<<<<<<< HEAD
import React from "react";
import styles from "./PatientAnalytics.module.css";
import { useLanguage } from "../context/LanguageContext";

export default function PatientAnalytics() {
  const { t } = useLanguage();
=======
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from './PatientAnalytics.module.css';
import { supabase } from "../lib/supabaseClient";

export default function PatientAnalytics() {
  const [searchParams] = useSearchParams();
  const [childId, setChildId] = useState(null);
  const [childBirthDate, setChildBirthDate] = useState(null);
  const [childBirthTime, setChildBirthTime] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestedChildId = searchParams.get('childId');

  const measurementSources = [
    {
      table: 'test_entries',
      childKey: 'patient_id',
      dateKey: 'date',
      timeKey: 'time',
      valueKey: 'bilirubin_concentration',
    },
  ];

  const buildMeasurementTimestamp = (entry) => {
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
  };

  const buildBirthTimestamp = () => {
    if (!childBirthDate) return null;
    const timePart = childBirthTime || '00:00:00';
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

      const normalized = (data || [])
        .map((item) => ({
          id: item.id,
          value: Number(item[valueKey]),
          date: item[dateKey] || null,
          time: item[timeKey] || null,
          created_at: item.created_at || null,
        }))
        .filter((item) => Number.isFinite(item.value));

      return normalized;
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
          throw new Error('You must be logged in to view analytics.');
        }

        let childData = null;

        if (requestedChildId) {
          const { data: selectedChild, error: selectedChildError } = await supabase
            .from('children')
            .select('id, child_date_of_birth, child_birth_time')
            .eq('user_id', authData.user.id)
            .eq('id', requestedChildId)
            .maybeSingle();

          if (selectedChildError) {
            throw selectedChildError;
          }

          childData = selectedChild;
        }

        if (!childData) {
          const { data: latestChild, error: childError } = await supabase
            .from('children')
            .select('id, child_date_of_birth, child_birth_time')
            .eq('user_id', authData.user.id)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (childError) {
            throw childError;
          }

          childData = latestChild;
        }

        if (!childData?.id) {
          throw new Error('No child profile found for this account.');
        }

        setChildId(childData.id);
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
        setError(loadError.message || 'Unable to load analytics.');
      } finally {
        setLoading(false);
      }
    };

    loadPatientAnalytics();
  }, [requestedChildId]);

  const latestMeasurement = measurements[0] || null;

  const trendSummary = useMemo(() => {
    if (measurements.length < 2) {
      return 'Not enough entries yet to determine a trend.';
    }

    const latest = measurements[0].value;
    const previous = measurements[1].value;
    const diff = Number((latest - previous).toFixed(2));

    if (diff > 0) {
      return `Up by ${diff} mg/dl from the previous test.`;
    }

    if (diff < 0) {
      return `Down by ${Math.abs(diff)} mg/dl from the previous test.`;
    }

    return 'Stable compared with the previous test.';
  }, [measurements]);

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
        points: '',
        circles: [],
        yTicks: [0, 1, 2, 3, 4].map((i) => ({ y: 50 + i * 50, label: '' })),
      };
    }

    const minValue = Math.min(...sorted.map((d) => d.value));
    const maxValue = Math.max(...sorted.map((d) => d.value));
    const range = Math.max(maxValue - minValue, 1);

    const xStart = 100;
    const xEnd = 550;
    const yTop = 70;
    const yBottom = 230;

    const points = sorted.map((item, index) => {
      const x = sorted.length === 1
        ? (xStart + xEnd) / 2
        : xStart + (index * (xEnd - xStart)) / (sorted.length - 1);
      const y = yBottom - ((item.value - minValue) / range) * (yBottom - yTop);
      const measurementTimestamp = buildMeasurementTimestamp(item);
      const postnatalHours = birthTimestamp && measurementTimestamp
        ? Math.max(
            0,
            Math.round((measurementTimestamp.getTime() - birthTimestamp.getTime()) / (1000 * 60 * 60))
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
      points: points.map((p) => `${p.x},${p.y}`).join(' '),
      circles: points,
      yTicks,
    };
  }, [measurements, childBirthDate, childBirthTime]);

  const formattedTimestamp = latestMeasurement
    ? (() => {
        const timestamp = buildMeasurementTimestamp(latestMeasurement);
        if (!timestamp || Number.isNaN(timestamp.getTime())) {
          return 'Date/time unavailable';
        }
        return timestamp.toLocaleString();
      })()
    : 'No measurements yet';
>>>>>>> c3fee384068465b38da85525a9522bfeb4efb720

  return (
    <div className={styles.page}>
      <div className={styles.pageContainer}>
        <div className={styles.headerSection}>
<<<<<<< HEAD
          <h1 className={styles.pageTitle}>{t("patientAnalytics.title")}</h1>
          <button className={styles.editLink}>{t("patientAnalytics.editCharts")}</button>
=======
          <h1 className={styles.pageTitle}>{childId ? `Child ID: ${childId}` : 'Child ID unavailable'}</h1>
>>>>>>> c3fee384068465b38da85525a9522bfeb4efb720
        </div>

        <div className={styles.cardsGrid}>
          <div className={styles.card}>
            <div className={styles.cardContent}>
<<<<<<< HEAD
              <p className={styles.cardLabel}>{t("patientAnalytics.bilirubinLabel")}</p>
              <p className={styles.bilirubinValue}>8 mg/dl</p>
              <p className={styles.riskZone}>{t("patientAnalytics.riskZone")}</p>
              <p className={styles.measurementDate}>{t("patientAnalytics.measuredOn")}</p>
=======
              <p className={styles.cardLabel}>Your child's bilirubin level is</p>
              <p className={styles.bilirubinValue}>
                {loading ? 'Loading...' : latestMeasurement ? `${latestMeasurement.value} mg/dl` : '--'}
              </p>
              <p className={styles.riskZone}>{trendSummary}</p>
              <p className={styles.measurementDate}>Measured on {formattedTimestamp}</p>
              {error && <p className={styles.errorText}>{error}</p>}
>>>>>>> c3fee384068465b38da85525a9522bfeb4efb720
            </div>
            <button className={styles.actionButton}>{t("patientAnalytics.learnMore")}</button>
          </div>

          <div className={styles.card}>
            <h3 className={styles.trendTitle}>{t("patientAnalytics.trendTitle")}</h3>
            <div className={styles.chartContainer}>
              <svg className={styles.chart} viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
<<<<<<< HEAD
                {[0, 1, 2, 3, 4].map((i) => (
=======
                <text x="24" y="150" transform="rotate(-90 24 150)" fill="#0D3B66" fontSize="12" fontWeight="600">
                  Bilirubin (mg/dl)
                </text>
                <text x="300" y="292" textAnchor="middle" fill="#0D3B66" fontSize="12" fontWeight="600">
                  Postnatal age (hours)
                </text>

                {/* Grid lines */}
                {chartData.yTicks.map((tick, idx) => (
>>>>>>> c3fee384068465b38da85525a9522bfeb4efb720
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
<<<<<<< HEAD
                {[0, 1, 2, 3, 4].map((i) => (
=======

                {chartData.yTicks.map((tick, idx) => (
                  <text
                    key={`yl-${idx}`}
                    x="44"
                    y={tick.y + 4}
                    textAnchor="end"
                    fill="#666"
                    fontSize="10"
                  >
                    {tick.label}
                  </text>
                ))}
                
                {/* Vertical grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
>>>>>>> c3fee384068465b38da85525a9522bfeb4efb720
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
<<<<<<< HEAD
                <polyline
                  points="100,200 250,140 400,180 550,80"
                  fill="none"
                  stroke="#E88BA8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="100" cy="200" r="8" fill="#E88BA8" />
                <circle cx="250" cy="140" r="8" fill="#E88BA8" />
                <circle cx="400" cy="180" r="8" fill="#E88BA8" />
                <circle cx="550" cy="80" r="10" fill="#E88BA8" />
=======
                
                {/* Trend line */}
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
                
                {/* Data points */}
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
                    {point.postnatalHours !== null ? point.postnatalHours : '-'}h
                  </text>
                ))}
>>>>>>> c3fee384068465b38da85525a9522bfeb4efb720
              </svg>
            </div>
            <button className={styles.actionButton}>{t("patientAnalytics.shareWithDoctor")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
