import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import "./Dashboard.css";
import { useLanguage } from "../context/LanguageContext";
import {
  classifyBhutaniRisk,
  formatRiskLabel,
  getPostnatalHours,
  normalizeRiskLevel,
} from "../utils/bhutaniRiskModel";

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [patients, setPatients] = useState([]);
  const [recentTests, setRecentTests] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingTests, setLoadingTests] = useState(true);
  const [deletingTestId, setDeletingTestId] = useState(null);
  const [deletingPatientId, setDeletingPatientId] = useState(null);
  const [testsError, setTestsError] = useState(null);
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
      const { data, error: patientsError } = await supabase
        .from("children")
        .select("*")
        .order("created_at", { ascending: false });

      if (patientsError) throw patientsError;
      setPatients(data || []);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoadingPatients(false);
    }
  };

  const fetchRecentTests = async () => {
    try {
      setLoadingTests(true);
      setTestsError(null);
      const { data, error: testsError } = await supabase
        .from("test_entries")
        .select(`
          *,
          children:patient_id (
            id,
            child_name,
            child_date_of_birth,
            child_birth_time
          )
        `)
        .order("date", { ascending: false })
        .limit(25);

      if (testsError) throw testsError;
      setRecentTests(data || []);
    } catch (fetchError) {
      setTestsError(fetchError.message);
    } finally {
      setLoadingTests(false);
    }
  };

  const handleDeleteTest = async (testId) => {
    const confirmed = window.confirm(t("dashboard.deleteTestConfirm"));
    if (!confirmed) return;

    try {
      setDeletingTestId(testId);
      setTestsError(null);

      const { error: analyticsDeleteError } = await supabase
        .from("patient_analytics")
        .delete()
        .eq("test_entry_id", testId);

      const isMissingAnalyticsTable =
        analyticsDeleteError?.code === "42P01" ||
        analyticsDeleteError?.message?.includes("schema cache") ||
        analyticsDeleteError?.message?.includes("patient_analytics");

      if (analyticsDeleteError && !isMissingAnalyticsTable) {
        throw analyticsDeleteError;
      }

      const { error: testDeleteError } = await supabase
        .from("test_entries")
        .delete()
        .eq("id", testId);

      if (testDeleteError) throw testDeleteError;

      setRecentTests((current) => current.filter((test) => test.id !== testId));
      setAnalytics((current) => current.filter((entry) => entry.test_entry_id !== testId));
    } catch (deleteError) {
      setTestsError(deleteError.message || t("dashboard.deleteTestError"));
    } finally {
      setDeletingTestId(null);
    }
  };

  const handleDeletePatient = async (patientId) => {
    const confirmed = window.confirm(t("dashboard.deletePatientConfirm"));
    if (!confirmed) return;

    try {
      setDeletingPatientId(patientId);
      setError(null);

      const { data: patientTests, error: patientTestsError } = await supabase
        .from("test_entries")
        .select("id")
        .eq("patient_id", patientId);

      const isMissingTestEntriesTable =
        patientTestsError?.code === "42P01" ||
        patientTestsError?.message?.includes("schema cache") ||
        patientTestsError?.message?.includes("test_entries");

      if (patientTestsError && !isMissingTestEntriesTable) {
        throw patientTestsError;
      }

      const testIds = (patientTests || []).map((test) => test.id).filter(Boolean);

      if (testIds.length > 0) {
        const { error: analyticsDeleteError } = await supabase
          .from("patient_analytics")
          .delete()
          .in("test_entry_id", testIds);

        const isMissingAnalyticsTable =
          analyticsDeleteError?.code === "42P01" ||
          analyticsDeleteError?.message?.includes("schema cache") ||
          analyticsDeleteError?.message?.includes("patient_analytics");

        if (analyticsDeleteError && !isMissingAnalyticsTable) {
          throw analyticsDeleteError;
        }
      }

      const { error: testDeleteError } = await supabase
        .from("test_entries")
        .delete()
        .eq("patient_id", patientId);

      if (testDeleteError && !isMissingTestEntriesTable) {
        throw testDeleteError;
      }

      const { error: patientDeleteError } = await supabase
        .from("children")
        .delete()
        .eq("id", patientId);

      if (patientDeleteError) throw patientDeleteError;

      setPatients((current) => current.filter((patient) => patient.id !== patientId));
      setRecentTests((current) =>
        current.filter((test) => String(test.patient_id) !== String(patientId)),
      );
      if (testIds.length > 0) {
        setAnalytics((current) =>
          current.filter((entry) => !testIds.includes(entry.test_entry_id)),
        );
      }
    } catch (deleteError) {
      setError(deleteError.message || t("dashboard.deletePatientError"));
    } finally {
      setDeletingPatientId(null);
    }
  };

  const fetchPatientAnalytics = async () => {
    try {
      const { data, error: analyticsError } = await supabase
        .from("patient_analytics")
        .select("*")
        .order("created_at", { ascending: false });

      if (analyticsError) throw analyticsError;
      setAnalytics(data || []);
    } catch {
      setAnalytics([]);
    }
  };

  const getAnalyticsForTest = (test) =>
    analytics.find((entry) => String(entry.test_entry_id) === String(test?.id)) || null;

  const getComputedRiskForTest = (test) => {
    const postnatalHours = getPostnatalHours({
      birthDate: test?.children?.child_date_of_birth || null,
      birthTime: test?.children?.child_birth_time || null,
      measurementDate: test?.date || null,
      measurementTime: test?.time || null,
      measurementCreatedAt: test?.created_at || null,
    });

    return classifyBhutaniRisk({
      bilirubinMgDl: Number(test?.bilirubin_concentration),
      postnatalHours,
    });
  };

  const resolveRiskForTest = (test) => {
    const analyticsEntry = getAnalyticsForTest(test);
    const persisted = normalizeRiskLevel(
      analyticsEntry?.risk_level ?? analyticsEntry?.riskLevel ?? analyticsEntry?.risk,
    );
    if (persisted) {
      return {
        level: persisted,
        label: formatRiskLabel(persisted),
      };
    }

    const computed = getComputedRiskForTest(test);
    const computedLevel = normalizeRiskLevel(computed?.riskLevel);

    if (computedLevel) {
      return {
        level: computedLevel,
        label: formatRiskLabel(computedLevel),
      };
    }

    return {
      level: null,
      label: t("dashboard.pending"),
    };
  };

  const filteredPatients = patients.filter((patient) => {
    const name = patient.child_name?.toLowerCase() || "";
    const id = patient.id?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return name.includes(search) || id.includes(search);
  });

  const highRiskCount = recentTests.filter((test) => {
    const risk = resolveRiskForTest(test).level;
    return risk === "high" || risk === "critical";
  }).length;

  const translateGender = (gender) => {
    if (!gender) return t("common.notAvailable");
    const normalized = gender.toLowerCase();
    if (normalized === "male") return t("dashboard.male");
    if (normalized === "female") return t("dashboard.female");
    if (normalized === "other") return t("dashboard.other");
    return gender;
  };

  return (
  <div className="dashboard">
    <div className="dashboard-header">
      <div>
        <h1>{t("dashboard.welcome")}</h1>
        <p className="subtitle">{t("dashboard.subtitle")}</p>
      </div>

      <div className="dashboard-actions">
        <button className="primary-btn" onClick={() => navigate("/home/profile")}>
          {t("dashboard.addPatient")}
        </button>
        <button className="primary-btn" onClick={() => navigate("/home/test_entry")}>
          {t("dashboard.newTest")}
        </button>
      </div>
    </div>

    <div className="dashboard-content">
      <div className="left-column">

        {/* RECENT TESTS */}
        <div className="card">
          <div className="table-header six-col">
            <span>{t("dashboard.patientName")}</span>
            <span>{t("dashboard.time")}</span>
            <span>{t("dashboard.date")}</span>
            <span>{t("dashboard.bilirubinLevels")}</span>
            <span>{t("dashboard.riskLevel")}</span>
            <span>{t("dashboard.actions")}</span>
          </div>

          <div className="table-scroll">
            {loadingTests ? (
              <div className="loading-state">{t("dashboard.loadingRecentTests")}</div>
            ) : testsError ? (
              <div className="error-state">{testsError}</div>
            ) : recentTests.length === 0 ? (
              <div className="empty-state">{t("dashboard.noRecentTests")}</div>
            ) : (
              recentTests.map((test) => {
                const risk = resolveRiskForTest(test);
                const riskClass = risk.level
                  ? risk.level.replace(/_/g, "-")
                  : "unknown";

                return (
                  <div key={test.id} className="table-row six-col">
                    <span>{test.children?.child_name || t("dashboard.unknownPatient")}</span>
                    <span>{test.time || t("common.notAvailable")}</span>
                    <span>{test.date || t("common.notAvailable")}</span>
                    <span>
                      {test.bilirubin_concentration
                        ? `${test.bilirubin_concentration} mg/dL`
                        : t("common.notAvailable")}
                    </span>
                    <span
                      className={`risk-badge risk-${riskClass}`}
                    >
                      {risk.label}
                    </span>
                    <button
                      type="button"
                      className="delete-test-btn recent-test-delete-btn"
                      onClick={() => handleDeleteTest(test.id)}
                      disabled={deletingTestId === test.id}
                      aria-label={t("common.remove")}
                    >
                      X
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* PATIENT RECORDS */}
        <h2 className="section-title">{t("dashboard.patientRecords")}</h2>
        <div className="card">
          <div className="search-container">
            <input
              type="text"
              placeholder={t("dashboard.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="table-row four-col header">
            <span>{t("dashboard.patientName")}</span>
            <span>{t("dashboard.gender")}</span>
            <span>{t("dashboard.seeDetails")}</span>
            <span>{t("dashboard.actions")}</span>
          </div>

          <div className="table-scroll">
            {loadingPatients ? (
              <div className="loading-state">{t("dashboard.loadingPatients")}</div>
            ) : error ? (
              <div className="error-state">{error}</div>
            ) : filteredPatients.length === 0 ? (
              <div className="empty-state">
                {searchTerm
                  ? t("dashboard.noPatientsFound", { searchTerm })
                  : t("dashboard.noPatients")}
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <div key={patient.id} className="table-row four-col">
                  <span>{patient.child_name || t("dashboard.unknownPatient")}</span>
                  <span>{translateGender(patient.child_gender)}</span>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() =>
                      navigate(`/home/patient_analytics?childId=${patient.id}`)
                    }
                  >
                    {t("dashboard.seeDetails")}
                  </button>
                  <button
                    type="button"
                    className="delete-test-btn"
                    onClick={() => handleDeletePatient(patient.id)}
                    disabled={deletingPatientId === patient.id}
                  >
                    {deletingPatientId === patient.id
                      ? t("dashboard.deletingPatient")
                      : t("common.remove")}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ALERTS */}
      <div className="alerts-card">
        <div className="alerts-header">🔔 {t("dashboard.alerts")}</div>
        <div className="alerts-body">
          {highRiskCount > 0
            ? t("dashboard.alertsReady", { count: highRiskCount })
            : t("dashboard.noAlerts")}
        </div>
      </div>
    </div>
  </div>
);
}
