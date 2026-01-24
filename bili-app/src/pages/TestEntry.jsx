import React, { useState } from "react";
import "./TestEntry.css";
import { supabase } from "../lib/supabaseClient";

export default function TestEntry() {
  const [formData, setFormData] = useState({
    patientId: "",
    date: "",
    bilirubinConcentration: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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

    try {
      const { error } = await supabase.from("test_entries").insert([
        {
          patient_id: formData.patientId,
          date: formData.date,
          bilirubin_concentration: parseFloat(formData.bilirubinConcentration),
          notes: formData.notes,
        },
      ]);

      if (error) {
        console.error("Supabase insert error:", error);
        setSubmitStatus("error");
        return;
      }

      setSubmitStatus("success");
      setFormData({
        patientId: "",
        date: "",
        bilirubinConcentration: "",
        notes: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="test-entry-container">
      <h1 className="page-title">Test Entry</h1>

      <div className="form-card">
        <h2 className="form-title">Please enter your test results</h2>

        <div className="device-btn-container">
          <button type="button" className="device-btn">
            Connect to Device
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Select Patient</label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
          >
            <option value="">Select a patient</option>
            <option value="1">Patient 1</option>
            <option value="2">Patient 2</option>
          </select>

          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <label>Bilirubin Concentration (mg/dl)</label>
          <input
            type="number"
            name="bilirubinConcentration"
            step="0.01"
            placeholder="Enter bilirubin concentration"
            value={formData.bilirubinConcentration}
            onChange={handleChange}
            required
          />

          <label>Notes/Comments</label>
          <textarea
            name="notes"
            placeholder="Enter any notes or comments"
            value={formData.notes}
            onChange={handleChange}
          />

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        {submitStatus === "success" && (
          <div style={{ color: "green", marginTop: "1rem" }}>
            Test entry submitted successfully!
          </div>
        )}
        {submitStatus === "error" && (
          <div style={{ color: "red", marginTop: "1rem" }}>
            Error submitting form. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}