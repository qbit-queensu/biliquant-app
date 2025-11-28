import React from "react";
import styles from './PatientAnalytics.module.css';

export default function PatientAnalytics() {
  return (
    <div className={styles.page}>
      <div className={styles.pageContainer}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>Child A's Record</h1>
          <button className={styles.editLink}>Edit Charts Info →</button>
        </div>

        <div className={styles.cardsGrid}>
          {/* Bilirubin Level Card */}
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <p className={styles.cardLabel}>Your child's bilirubin level is</p>
              <p className={styles.bilirubinValue}>8 mg/dl</p>
              <p className={styles.riskZone}>This puts them in the low risk zone</p>
              <p className={styles.measurementDate}>This was measured on dd/mm/yyyy</p>
            </div>
            <button className={styles.actionButton}>Click to learn more</button>
          </div>

          {/* Trend Over Time Card */}
          <div className={styles.card}>
            <h3 className={styles.trendTitle}>Trend overtime</h3>
            
            <div className={styles.chartContainer}>
              {/* Enhanced SVG line chart */}
              <svg className={styles.chart} viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
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
                
                {/* Vertical grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
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
                
                {/* Trend line */}
                <polyline
                  points="100,200 250,140 400,180 550,80"
                  fill="none"
                  stroke="#E88BA8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Data points */}
                <circle cx="100" cy="200" r="8" fill="#E88BA8" />
                <circle cx="250" cy="140" r="8" fill="#E88BA8" />
                <circle cx="400" cy="180" r="8" fill="#E88BA8" />
                <circle cx="550" cy="80" r="10" fill="#E88BA8" />
              </svg>
            </div>
            
            <button className={styles.actionButton}>Share with Doctor</button>
          </div>
        </div>
      </div>
    </div>
  );
}