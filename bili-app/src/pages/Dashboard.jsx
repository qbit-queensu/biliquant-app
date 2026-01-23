import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome!</h1>
          <p className="subtitle">Recent Tests</p>
        </div>

        <div className="dashboard-actions">
          <button
            className="primary-btn"
            onClick={() => navigate("/add-patient")}
          >
            + Add Patient
          </button>
          <button
            className="primary-btn"
            onClick={() => navigate("/new-test")}
          >
            + New Test
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* LEFT COLUMN */}
        <div className="left-column">
          {/* Recent Tests */}
          <div className="card">
            <div className="table-header five-col">
              <span>First Last Name</span>
              <span>Age</span>
              <span>Bili levels</span>
              <span>Risk Level</span>
              <span>Inc/Dec trend</span>
            </div>

            <div className="empty-state">
              No recent tests yet
            </div>
          </div>

          {/* Patient Records */}
          <h2 className="section-title">Patient Records</h2>
          <div className="card">
            <div
              className="table-row three-col header"
            >
              <span>First Last Name</span>
              <span>Age</span>
              <span>See Details</span>
            </div>

            {[1, 2, 3].map((id) => (
              <div
                key={id}
                className="table-row three-col"
              >
                <span>First Last Name</span>
                <span>Age</span>
                <button
                  className="link-btn"
                  onClick={() => navigate(`/patient/${id}`)}
                >
                  See Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="alerts-card">
          <div className="alerts-header">
            🔔 Alerts
          </div>
          <div className="alerts-body">
            No alerts ready to be sent yet.
          </div>
        </div>
      </div>
    </div>
  );
}
