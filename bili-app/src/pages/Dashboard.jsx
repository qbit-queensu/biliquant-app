import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import "./Dashboard.css";


export default function Dashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [recentTests, setRecentTests] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingTests, setLoadingTests] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPatients();
    fetchRecentTests();
    fetchPatientAnalytics();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error.message);
      setError('Failed to load patients');
    } finally {
      setLoadingPatients(false);
    }
  };

  const fetchRecentTests = async () => {
  try {
    setLoadingTests(true);

    

    const { data, error } = await supabase
      .from("test_entries")
      .select("*")
      .order("date", { ascending: false })
      .limit(25);

    console.log("Recent tests:", data);

    if (error) throw error;

    setRecentTests(data || []);
  } catch (error) {
    console.error("Error fetching recent tests:", error.message);
  } finally {
    setLoadingTests(false);
  }
};

  const fetchPatientAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('patient_analytics') // Adjust to analytics table name
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error('Error fetching patient analytics:', error.message);
    }
  };

  // Helper function to get analytics for a specific test
  const getAnalyticsForTest = (test) => {
    if (!test || !test.id) return null;
    
    // Find analytics entry for this test
    // Adjust this logic based on how your analytics table is structured
    return analytics.find(a => a.test_entry_id === test.id) || null;
  };

  

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => {
    const name = patient.childName?.toLowerCase() || '';
    const id = patient.id?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return name.includes(search) || id.includes(search);
  });

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
            onClick={() => navigate("/home/profile")}
          >
            + Add Patient
          </button>
          <button
            className="primary-btn"
            onClick={() => navigate("/home/test_entry")}
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
              <span>Patient Name</span>
              <span>Time</span>
              <span>Date</span>
              <span>Bili levels</span>
              <span>Risk Level</span>
            </div>

            {loadingTests ? (
              <div className="loading-state">Loading recent tests...</div>
            ) : recentTests.length === 0 ? (
              <div className="empty-state">
                No recent tests yet. Click "New Test" to add one.
              </div>
            ) : (
              recentTests.map((test) => {
  const testAnalytics = getAnalyticsForTest(test);

  return (
    <div key={test.id} className="table-row five-col">
      <span>
        {test.children?.childName || "Unknown Patient"}
      </span>

      <span>{test.time || "N/A"}</span>

      <span>{test.date || "N/A"}</span>

      <span>
        {test.bilirubin_concentration
          ? `${test.bilirubin_concentration} mg/dL`
          : "N/A"}
      </span>

      <span
        className={`risk-badge risk-${
          testAnalytics?.risk_level?.toLowerCase() || "unknown"
        }`}
      >
        {testAnalytics?.risk_level || "Pending"}
      </span>
    </div>
  );
})
            )}
          </div>

          {/* Patient Records */}
          <h2 className="section-title">Patient Records</h2>
          <div className="card">
            {/* Search Bar */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search patients by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Fixed Header */}
            <div className="table-row three-col header">
              <span>Patient Name</span>
              <span>Gender</span>
              <span>See Details</span>
            </div>

            {/* Patient List */}
            {loadingPatients ? (
              <div className="loading-state">Loading patients...</div>
            ) : error ? (
              <div className="error-state">{error}</div>
            ) : filteredPatients.length === 0 ? (
              <div className="empty-state">
                {searchTerm 
                  ? `No patients matching "${searchTerm}"` 
                  : 'No patients yet. Click "Add Patient" to get started.'}
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <div key={patient.id} className="table-row three-col">
                  <span>{patient.child_name || 'Unknown Patient'}</span>
                  <span>
                    {patient.child_gender
                      ? patient.child_gender.charAt(0).toUpperCase() + patient.child_gender.slice(1)
                      : 'N/A'}
                  </span>
                  <button
                    className="link-btn"
                    onClick={() => navigate(`/home/patient_analytics?childId=${patient.id}`)}
                  >
                    See Details
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="alerts-card">
          <div className="alerts-header">
            🔔 Alerts
          </div>
          <div className="alerts-body">
            {analytics.filter(a => a.risk_level?.toLowerCase() === 'high' || a.risk_level?.toLowerCase() === 'critical').length > 0 
              ? `${analytics.filter(a => a.risk_level?.toLowerCase() === 'high' || a.risk_level?.toLowerCase() === 'critical').length} patient(s) with high/critical risk levels` 
              : "No alerts ready to be sent yet."
            }
          </div>
        </div>
      </div>
    </div>
  );
}
