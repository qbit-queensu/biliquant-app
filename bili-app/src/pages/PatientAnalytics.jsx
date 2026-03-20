import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./PatientAnalytics.module.css";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabaseClient";
import {
  classifyBhutaniRisk,
  getPostnatalHours,
} from "../utils/bhutaniRiskModel";

const measurementSources = [
  {
    table: "test_entries",
    childKey: "patient_id",
    dateKey: "date",
    timeKey: "time",
    valueKey: "bilirubin_concentration",
  },
];

function buildMeasurementTimestamp(entry) {
  const dateValue = entry.date || null;
  const timeValue = entry.time || null;

  if (dateValue && timeValue) {
    return new Date(`${dateValue}T${timeValue}`);
  }

  if (dateValue) {
    return new Date(`${dateValue}T00:00:00`);
  }

  if (entry.created_at) {
    return new Date(entry.created_at);
  }

  return null;
}

export default function PatientAnalytics() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [childId, setChildId] = useState(null);
  const [childName, setChildName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [childBirthDate, setChildBirthDate] = useState(null);
  const [childBirthTime, setChildBirthTime] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestedChildId = searchParams.get("childId");
  const requestedChildName = searchParams.get("childName");

  const buildBirthTimestamp = () => {
    if (!childBirthDate) return null;
    const timePart = childBirthTime || "00:00:00";
    const timestamp = new Date(`${childBirthDate}T${timePart}`);
    return Number.isNaN(timestamp.getTime()) ? null : timestamp;
  };

  const fetchMeasurements = async (currentChildId) => {
    for (const source of measurementSources) {
      const { table, childKey, dateKey, timeKey, valueKey } = source;

      let { data, error: queryError } = await supabase
        .from(table)
        .select(`id, ${childKey}, ${dateKey}, ${timeKey}, ${valueKey}, created_at`)
        .eq(childKey, currentChildId)
        .order(dateKey, { ascending: false })
        .order(timeKey, { ascending: false, nullsFirst: false })
        .limit(20);

      if (queryError) {
        const fallbackResult = await supabase
          .from(table)
          .select(`id, ${childKey}, ${dateKey}, ${valueKey}, created_at`)
          .eq(childKey, currentChildId)
          .order(dateKey, { ascending: false })
          .limit(20);

        data = fallbackResult.data;
        queryError = fallbackResult.error;
      }

      if (queryError) {
        continue;
      }

      return (data || [])
        .map((item) => ({
          id: item.id,
          value: Number(item[valueKey]),
          date: item[dateKey] || null,
          time: item[timeKey] || null,
          created_at: item.created_at || null,
        }))
        .filter((item) => Number.isFinite(item.value));
    }

    return [];
  };

  useEffect(() => {
    const loadPatientAnalytics = async () => {
      setLoading(true);
      setError("");

      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        if (!authData?.user) {
          throw new Error(t("patientAnalytics.loginRequired"));
        }

        let childData = null;

        if (requestedChildId) {
          const { data: selectedChild, error: selectedChildError } = await supabase
            .from("children")
            .select("id, child_name, doctor_name, doctor_email, child_date_of_birth, child_birth_time")
            .eq("user_id", authData.user.id)
            .eq("id", requestedChildId)
            .maybeSingle();

          if (selectedChildError) {
            throw selectedChildError;
          }

          childData = selectedChild;
        }

        if (!childData) {
          const { data: latestChild, error: childError } = await supabase
            .from("children")
            .select("id, child_name, doctor_name, doctor_email, child_date_of_birth, child_birth_time")
            .eq("user_id", authData.user.id)
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (childError) {
            throw childError;
          }

          childData = latestChild;
        }

        if (!childData?.id) {
          throw new Error(t("patientAnalytics.noChildProfile"));
        }

        setChildId(childData.id);
        setChildName(childData.child_name || "");
        setDoctorName(childData.doctor_name || "");
        setDoctorEmail(childData.doctor_email || "");
        setChildBirthDate(childData.child_date_of_birth || null);
        setChildBirthTime(childData.child_birth_time || null);

        const measurementData = await fetchMeasurements(childData.id);
        measurementData.sort((a, b) => {
          const aTime = buildMeasurementTimestamp(a)?.getTime() || 0;
          const bTime = buildMeasurementTimestamp(b)?.getTime() || 0;
          return bTime - aTime;
        });

        setMeasurements(measurementData);
      } catch (loadError) {
        setError(loadError.message || t("patientAnalytics.loadError"));
      } finally {
        setLoading(false);
      }
    };

    loadPatientAnalytics();
  }, [requestedChildId, t]);

  const latestMeasurement = measurements[0] || null;

  const trendSummary = useMemo(() => {
    if (measurements.length < 2) {
      return t("patientAnalytics.trendInsufficient");
    }

    const latest = measurements[0].value;
    const previous = measurements[1].value;
    const diff = Number((latest - previous).toFixed(2));

    if (diff > 0) {
      return t("patientAnalytics.trendUp", { diff });
    }

    if (diff < 0) {
      return t("patientAnalytics.trendDown", { diff: Math.abs(diff) });
    }

    return t("patientAnalytics.trendStable");
  }, [measurements, t]);

  const latestRisk = useMemo(() => {
    if (!latestMeasurement) return null;

    const postnatalHours = getPostnatalHours({
      birthDate: childBirthDate,
      birthTime: childBirthTime,
      measurementDate: latestMeasurement.date,
      measurementTime: latestMeasurement.time,
      measurementCreatedAt: latestMeasurement.created_at,
    });

    return classifyBhutaniRisk({
      bilirubinMgDl: latestMeasurement.value,
      postnatalHours,
    });
  }, [latestMeasurement, childBirthDate, childBirthTime]);

  const chartData = useMemo(() => {
    const birthTimestamp = buildBirthTimestamp();
    const sorted = [...measurements]
      .sort((a, b) => {
        const aTime = buildMeasurementTimestamp(a)?.getTime() || 0;
        const bTime = buildMeasurementTimestamp(b)?.getTime() || 0;
        return aTime - bTime;
      })
      .slice(-8);

    if (!sorted.length) {
      return {
        points: "",
        circles: [],
        yTicks: [0, 1, 2, 3, 4].map((i) => ({ y: 50 + i * 50, label: "" })),
      };
    }

    const minValue = Math.min(...sorted.map((item) => item.value));
    const maxValue = Math.max(...sorted.map((item) => item.value));
    const range = Math.max(maxValue - minValue, 1);

    const xStart = 100;
    const xEnd = 550;
    const yTop = 70;
    const yBottom = 230;

    const points = sorted.map((item, index) => {
      const x =
        sorted.length === 1
          ? (xStart + xEnd) / 2
          : xStart + (index * (xEnd - xStart)) / (sorted.length - 1);
      const y = yBottom - ((item.value - minValue) / range) * (yBottom - yTop);
      const measurementTimestamp = buildMeasurementTimestamp(item);
      const postnatalHours =
        birthTimestamp && measurementTimestamp
          ? Math.max(
              0,
              Math.round(
                (measurementTimestamp.getTime() - birthTimestamp.getTime()) / (1000 * 60 * 60),
              ),
            )
          : null;

      return { ...item, x, y, postnatalHours };
    });

    const yTicks = [0, 1, 2, 3, 4].map((i) => {
      const ratio = i / 4;
      const y = yBottom - ratio * (yBottom - yTop);
      const label = (minValue + ratio * (maxValue - minValue)).toFixed(1);
      return { y, label };
    });

    return {
      points: points.map((point) => `${point.x},${point.y}`).join(" "),
      circles: points,
      yTicks,
    };
  }, [measurements, childBirthDate, childBirthTime]);

  const formattedTimestamp = latestMeasurement
    ? (() => {
        const timestamp = buildMeasurementTimestamp(latestMeasurement);
        if (!timestamp || Number.isNaN(timestamp.getTime())) {
          return t("patientAnalytics.dateUnavailable");
        }
        return timestamp.toLocaleString();
      })()
    : t("patientAnalytics.noMeasurements");

  const resolvedChildName = childName || requestedChildName || "Unknown Child";
  const resolvedDoctorName = doctorName || "Doctor";

  const handleShareWithDoctor = () => {
    if (!doctorEmail) return;

    const recentMeasurements = measurements.slice(0, 5);
    const measurementLines = recentMeasurements.length
      ? recentMeasurements
          .map((entry, index) => {
            const timestamp = buildMeasurementTimestamp(entry);
            const formatted = timestamp && !Number.isNaN(timestamp.getTime())
              ? timestamp.toLocaleString()
              : "Date/time unavailable";
            return `${index + 1}. ${entry.value} mg/dl at ${formatted}`;
          })
          .join("\n")
      : "No recent measurements available";

    const subject = `${resolvedChildName} bilirubin update`;
    const body = `Hello ${resolvedDoctorName},\n\nPlease see the bilirubin summary for ${resolvedChildName}.\nPatient ID: ${childId || "Unavailable"}\n\nLatest reading: ${latestMeasurement ? `${latestMeasurement.value} mg/dl` : "No measurements yet"}\nMeasured on: ${formattedTimestamp}\n\nRecent measurements (up to 5):\n${measurementLines}\n\nThank you.`;

    window.location.href = `mailto:${doctorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageContainer}>
        <div className={styles.headerSection}>
          <div>
            <h1 className={styles.pageTitle}>{resolvedChildName}</h1>
            <p className={styles.childMeta}>
              {childId
                ? t("patientAnalytics.childIdLabel", { childId })
                : t("patientAnalytics.childIdUnavailable")}
            </p>
          </div>
          <button
            type="button"
            className={styles.actionButton}
            onClick={handleShareWithDoctor}
            disabled={!doctorEmail}
          >
            {t("patientAnalytics.shareWithDoctor")}
          </button>
        </div>

        <div className={styles.cardsGrid}>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <p className={styles.cardLabel}>{t("patientAnalytics.bilirubinLabel")}</p>
              <p className={styles.bilirubinValue}>
                {loading
                  ? t("common.loading")
                  : latestMeasurement
                    ? `${latestMeasurement.value} mg/dl`
                    : "--"}
              </p>
              <p className={styles.riskZone}>
                {latestRisk?.isWithinModelRange
                  ? `Risk zone: ${latestRisk.riskLabel} (${latestRisk.percentileBand}, ${latestRisk.probability}%)`
                  : "Risk zone unavailable (requires age 18-168 hours and valid birth/test time)."}
              </p>
              <p className={styles.measurementDate}>{trendSummary}</p>
              <p className={styles.measurementDate}>
                {t("patientAnalytics.measuredOnWithDate", { date: formattedTimestamp })}
              </p>
              {error ? <p className={styles.errorText}>{error}</p> : null}
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.trendTitle}>{t("patientAnalytics.trendTitle")}</h3>
            <div className={styles.chartContainer}>
              <svg className={styles.chart} viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
                <text x="24" y="150" transform="rotate(-90 24 150)" fill="#0D3B66" fontSize="12" fontWeight="600">
                  {t("patientAnalytics.axisBilirubin")}
                </text>
                <text x="300" y="292" textAnchor="middle" fill="#0D3B66" fontSize="12" fontWeight="600">
                  {t("patientAnalytics.axisPostnatalAge")}
                </text>

                {chartData.yTicks.map((tick, idx) => (
                  <line
                    key={`h-${idx}`}
                    x1="50"
                    y1={tick.y}
                    x2="550"
                    y2={tick.y}
                    stroke="#e0e0e0"
                    strokeWidth="1"
                  />
                ))}

                {chartData.yTicks.map((tick, idx) => (
                  <text key={`yl-${idx}`} x="44" y={tick.y + 4} textAnchor="end" fill="#666" fontSize="10">
                    {tick.label}
                  </text>
                ))}

                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={`v-${i}`}
                    x1={50 + i * 125}
                    y1="50"
                    x2={50 + i * 125}
                    y2="250"
                    stroke="#e0e0e0"
                    strokeWidth="1"
                  />
                ))}

                {chartData.points && (
                  <polyline
                    points={chartData.points}
                    fill="none"
                    stroke="#E88BA8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {chartData.circles.map((point, index) => (
                  <circle
                    key={point.id || index}
                    cx={point.x}
                    cy={point.y}
                    r={index === chartData.circles.length - 1 ? 10 : 8}
                    fill="#E88BA8"
                  />
                ))}

                {chartData.circles.map((point, index) => (
                  <text
                    key={`xl-${point.id || index}`}
                    x={point.x}
                    y="266"
                    textAnchor="middle"
                    fill="#666"
                    fontSize="10"
                  >
                    {point.postnatalHours !== null ? `${point.postnatalHours}h` : "-"}
                  </text>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
