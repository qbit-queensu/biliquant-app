import React, { useState, useEffect } from "react";
import "./TestEntry.css";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../context/LanguageContext";
import { classifyBhutaniRisk, getPostnatalHours } from "../utils/bhutaniRiskModel";

export default function TestEntry() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    patientId: "",
    date: "",
    time: "",
    bilirubinConcentration: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [latestRiskResult, setLatestRiskResult] = useState(null);

  const [patients, setPatients] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoadingPatients(true);
        const { data, error } = await supabase
          .from("children")
          .select("id, child_name, user_id, child_date_of_birth, child_birth_time")
          .order("child_name", { ascending: true });

        if (error) throw error;
        setPatients(data || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setLatestRiskResult(null);

    try {
      const selectedPatient = patients.find((patient) => patient.id === formData.patientId) || null;
      const postnatalHours = getPostnatalHours({
        birthDate: selectedPatient?.child_date_of_birth || null,
        birthTime: selectedPatient?.child_birth_time || null,
        measurementDate: formData.date,
        measurementTime: formData.time,
      });

      const riskResult = classifyBhutaniRisk({
        bilirubinMgDl: Number(formData.bilirubinConcentration),
        postnatalHours,
      });

      const { data: insertedEntry, error } = await supabase
        .from("test_entries")
        .insert([
          {
            patient_id: formData.patientId,
            date: formData.date,
            time: formData.time,
            bilirubin_concentration: parseFloat(formData.bilirubinConcentration),
            notes: formData.notes,
          },
        ])
        .select("id")
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        setSubmitStatus("error");
        return;
      }

      if (insertedEntry?.id && riskResult?.isWithinModelRange && riskResult.riskLevel) {
        const payloadWithExtendedFields = {
          test_entry_id: insertedEntry.id,
          risk_level: riskResult.riskLevel,
          percentile_band: riskResult.percentileBand,
          risk_probability: riskResult.probability,
          postnatal_age_hours: riskResult.postnatalHours,
        };

        const { error: analyticsError } = await supabase
          .from("patient_analytics")
          .insert([payloadWithExtendedFields]);

        if (analyticsError) {
          const fallbackPayload = {
            test_entry_id: insertedEntry.id,
            risk_level: riskResult.riskLevel,
          };

          await supabase.from("patient_analytics").insert([fallbackPayload]);
        }
      }

      setSubmitStatus("success");
      setLatestRiskResult(riskResult);
      setFormData({
        patientId: "",
        date: "",
        time: "",
        bilirubinConcentration: "",
        notes: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      setLatestRiskResult(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="test-entry-container">
      <h1 className="page-title">{t("testEntry.title")}</h1>

      <div className="form-card">
        <h2 className="form-title">{t("testEntry.subtitle")}</h2>

        <div className="device-btn-container">
          <button type="button" className="device-btn">
            {t("testEntry.connectDevice")}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>{t("testEntry.selectPatient")}</label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
            disabled={isLoadingPatients}
          >
            <option value="">
              {isLoadingPatients
                ? t("testEntry.loadingPatients")
                : t("testEntry.selectPatientPlaceholder")}
            </option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.child_name}
              </option>
            ))}
          </select>

          <label>{t("testEntry.date")}</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <label>{t("testEntry.time")}</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />

          <label>{t("testEntry.bilirubin")}</label>
          <input
            type="number"
            name="bilirubinConcentration"
            step="0.01"
            placeholder={t("testEntry.bilirubinPlaceholder")}
            value={formData.bilirubinConcentration}
            onChange={handleChange}
            required
          />

          <label>{t("testEntry.notes")}</label>
          <textarea
            name="notes"
            placeholder={t("testEntry.notesPlaceholder")}
            value={formData.notes}
            onChange={handleChange}
          />

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? t("testEntry.submitting") : t("testEntry.submit")}
          </button>
        </form>

        {submitStatus === "success" && (
          <div style={{ color: "green", marginTop: "1rem" }}>
            {t("testEntry.success")}
            {latestRiskResult?.isWithinModelRange && latestRiskResult?.riskLabel ? (
              <div style={{ marginTop: "0.5rem" }}>
                Risk classification: {latestRiskResult.riskLabel} ({latestRiskResult.percentileBand},{" "}
                {latestRiskResult.probability}%)
              </div>
            ) : null}
          </div>
        )}
        {submitStatus === "error" && (
          <div style={{ color: "red", marginTop: "1rem" }}>{t("testEntry.error")}</div>
        )}
      </div>
    </div>
  );
}
