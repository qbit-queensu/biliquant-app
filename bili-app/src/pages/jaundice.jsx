import React, { useState, useEffect } from "react";
import "./jaundice.css";
import CountUp from "../components/CountUp";
import { calculateJaundiceCases } from "../utils/jaundiceCalculator";
import { useLanguage } from "../context/LanguageContext";

export default function JaundiceGuide() {
  const { t, getTranslation } = useLanguage();
  const [birthCount, setBirthCount] = useState(25000);

  useEffect(() => {
    const scheduleNextIncrement = () => {
      const delay = Math.random() * 3000 + 1000;
      setTimeout(() => {
        setBirthCount((prev) => prev + 1);
        scheduleNextIncrement();
      }, delay);
    };
    scheduleNextIncrement();
    return () => {};
  }, []);

  const results = calculateJaundiceCases(birthCount);
  const signs = getTranslation("jaundice.signs");
  const causes = getTranslation("jaundice.causes");
  const diagnosis = getTranslation("jaundice.diagnosis");
  const treatment = getTranslation("jaundice.treatment");
  const resources = getTranslation("jaundice.resources");
  const professional = getTranslation("jaundice.professional");

  return (
    <div className="page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{t("jaundice.heroTitle")}</h1>
          <div className="hero-accent"></div>
          <p className="hero-subtitle">{t("jaundice.heroSubtitle")}</p>
          <button className="hero-button" onClick={() => window.open("/jaundice-guide.pdf", "_blank")}>
            {t("jaundice.downloadGuide")}
          </button>
        </div>
      </section>

      <section className="estimator-section">
        <div className="estimator-content">
          <div className="estimator-header">
            <h1 className="estimator-title">{t("jaundice.estimatorTitle")}</h1>
            <div className="title-accent"></div>
          </div>
          <p className="estimator-text">{t("jaundice.estimatorText")}</p>

          <div className="birth-data">
            <h3>{t("jaundice.liveBirthCounter")}</h3>
            <div className="birth-count">
              <CountUp to={birthCount} separator="," className="count-up-text large" />
              <span className="period"> {t("jaundice.period")}</span>
            </div>
          </div>
          {results.total > 0 && (
            <div className="results">
              <h3>{t("jaundice.casesTitle")}</h3>
              <div className="result-item total-emphasis">
                <span>{t("jaundice.totalCases")} </span>
                <CountUp to={results.total} separator="," className="count-up-text large" />
              </div>
              <div className="result-item">
                <span>{t("jaundice.termBabies")} </span>
                <CountUp to={results.term} separator="," className="count-up-text" />
              </div>
              <div className="result-item">
                <span>{t("jaundice.pretermBabies")} </span>
                <CountUp to={results.preterm} separator="," className="count-up-text" />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="jaundice-section">
        <div className="jaundice-content">
          <div className="jaundice-header">
            <h1 className="jaundice-title">{t("jaundice.whatIsTitle")}</h1>
            <div className="title-accent"></div>
          </div>
          <p className="jaundice-text">{t("jaundice.whatIsText")}</p>
        </div>
      </section>

      <section className="signs-section">
        <div className="signs-content">
          <div className="signs-header">
            <h1 className="signs-title">{t("jaundice.signsTitle")}</h1>
            <div className="title-accent"></div>
          </div>
          <div className="signs-grid">
            {signs.map((sign, index) => (
              <div key={sign.title} className="sign-card">
                <div className="sign-icon">{["👁️", "😴", "🍼"][index]}</div>
                <div className="sign-content">
                  <h3>{sign.title}</h3>
                  <p>{sign.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-content">
          <div className="info-header">
            <h1 className="info-title">{t("jaundice.causesTitle")}</h1>
            <div className="title-accent"></div>
          </div>
          <div className="info-text">
            {causes.map((item) => (
              <React.Fragment key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="diagnosis-section">
        <div className="diagnosis-content">
          <div className="diagnosis-header">
            <h1 className="diagnosis-title">{t("jaundice.diagnosisTitle")}</h1>
            <div className="title-accent"></div>
          </div>
          <div className="diagnosis-text">
            {diagnosis.map((item) => (
              <React.Fragment key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="treatment-section">
        <div className="treatment-content">
          <div className="treatment-header">
            <h1 className="treatment-title">{t("jaundice.treatmentTitle")}</h1>
            <div className="title-accent"></div>
          </div>
          <div className="treatment-text">
            {treatment.map((item) => (
              <React.Fragment key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="support-section">
        <div className="support-content">
          <div className="support-header">
            <h1 className="support-title">{t("jaundice.supportTitle")}</h1>
            <div className="title-accent"></div>
          </div>
          <div className="support-grid">
            <div className="support-card">
              <h3>📚 {t("jaundice.resourcesTitle")}</h3>
              <ul>
                {resources.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="support-card">
              <h3>🏥 {t("jaundice.professionalTitle")}</h3>
              <ul>
                {professional.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
