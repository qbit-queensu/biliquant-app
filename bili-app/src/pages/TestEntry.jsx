import React, { useState, useEffect, useRef } from "react";
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
  const [patientSearch, setPatientSearch] = useState("");
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const patientComboboxRef = useRef(null);

  const filteredPatients = patients.filter((patient) =>
    patient.child_name.toLowerCase().includes(patientSearch.trim().toLowerCase())
  );

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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        patientComboboxRef.current &&
        !patientComboboxRef.current.contains(event.target)
      ) {
        setIsPatientDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePatientSearchChange = (value) => {
    setPatientSearch(value);
    setIsPatientDropdownOpen(true);

    const matchedPatient = patients.find(
      (patient) => patient.child_name.toLowerCase() === value.trim().toLowerCase()
    );

    setFormData((prev) => ({
      ...prev,
      patientId: matchedPatient ? matchedPatient.id : "",
    }));
  };

  const handlePatientSelect = (patient) => {
    setPatientSearch(patient.child_name);
    setFormData((prev) => ({
      ...prev,
      patientId: patient.id,
    }));
    setIsPatientDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patientId) {
      setSubmitStatus("error");
      return;
    }

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
      setPatientSearch("");
      setIsPatientDropdownOpen(false);
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

        {/* <div className="device-btn-container">
          <button type="button" className="device-btn">
            {t("testEntry.connectDevice")}
          </button>
        </div> */}

        <form onSubmit={handleSubmit}>
          <label>{t("testEntry.selectPatient")}</label>
          <div className="patient-combobox" ref={patientComboboxRef}>
            <input
              type="text"
              className="patient-search-input"
              placeholder="Search patient"
              value={patientSearch}
              onChange={(e) => handlePatientSearchChange(e.target.value)}
              onFocus={() => setIsPatientDropdownOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsPatientDropdownOpen(false);
                }
              }}
              required
              disabled={isLoadingPatients}
            />

            {isPatientDropdownOpen && !isLoadingPatients && (
              <div className="patient-dropdown" role="listbox">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      className="patient-dropdown-option"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handlePatientSelect(patient);
                      }}
                    >
                      {patient.child_name}
                    </button>
                  ))
                ) : (
                  <div className="patient-dropdown-empty">No matching patients</div>
                )}
              </div>
            )}
          </div>

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
