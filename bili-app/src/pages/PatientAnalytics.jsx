import React from "react";
import styles from "./PatientAnalytics.module.css";
import { useLanguage } from "../context/LanguageContext";

export default function PatientAnalytics() {
  const { t } = useLanguage();

  return (
    <div className={styles.page}>
      <div className={styles.pageContainer}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>{t("patientAnalytics.title")}</h1>
          <button className={styles.editLink}>{t("patientAnalytics.editCharts")}</button>
        </div>

        <div className={styles.cardsGrid}>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <p className={styles.cardLabel}>{t("patientAnalytics.bilirubinLabel")}</p>
              <p className={styles.bilirubinValue}>8 mg/dl</p>
              <p className={styles.riskZone}>{t("patientAnalytics.riskZone")}</p>
              <p className={styles.measurementDate}>{t("patientAnalytics.measuredOn")}</p>
            </div>
            <button className={styles.actionButton}>{t("patientAnalytics.learnMore")}</button>
          </div>

          <div className={styles.card}>
            <h3 className={styles.trendTitle}>{t("patientAnalytics.trendTitle")}</h3>
            <div className={styles.chartContainer}>
              <svg className={styles.chart} viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={`h-${i}`}
                    x1="50"
                    y1={50 + i * 50}
                    x2="550"
                    y2={50 + i * 50}
                    stroke="#e0e0e0"
                    strokeWidth="1"
                  />
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
              </svg>
            </div>
            <button className={styles.actionButton}>{t("patientAnalytics.shareWithDoctor")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
