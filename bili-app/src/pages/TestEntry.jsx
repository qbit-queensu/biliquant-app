import React from "react";
import "./TestEntry.css";

export default function TestEntry() {
  return (
    <div className="test-entry-container">
      
      {/* Page Title */}
      <h1 className="page-title">Test Entry</h1>

      {/* Form Box */}
      <div className="form-card">

        <h2 className="form-title">Please enter your test results</h2>

        {/* Connect to Device Button */}
        <div className="device-btn-container">
          <button className="device-btn">Connect to Device</button>
        </div>

        {/* Select Patient */}
        <label>Select Patient</label>
        <select>
          <option>Value</option>
        </select>

        {/* Date */}
        <label>Date</label>
        <input type="date" />

        {/* Bilirubin Concentration */}
        <label>Bilirubin Concentration (mg/dl)</label>
        <input
        type="number"
        step="0.01"
        placeholder="Enter bilirubin concentration"
        />

        {/* Notes */}
        <label>Notes/Comments</label>
        <textarea placeholder="Value"></textarea>

        {/* Submit */}
        <button className="submit-btn">Submit</button>

      </div>
    </div>
  );
}
