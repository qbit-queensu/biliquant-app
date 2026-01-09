import React from 'react';
import './jaundice.css';

export default function JaundiceGuide() {
  return (
    <div className="page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Understanding Newborn Jaundice</h1>
          <div className="hero-accent"></div>
          <p className="hero-subtitle">
            Neonatal jaundice affects 60% of term infants and 85% of preterm infants.
            This comprehensive guide provides evidence-based information for parents and caregivers.
          </p>
          <button className="hero-button" onClick={() => window.open('/jaundice-guide.pdf', '_blank')}>
            Download Guide →
          </button>
        </div>
      </section>

      {/* WHAT IS JAUNDICE */}
      <section className="jaundice-section">
        <div className="jaundice-content">
          <div className="jaundice-header">
            <h1 className="jaundice-title">What is Jaundice?</h1>
            <div className="title-accent"></div>
          </div>
          <p className="jaundice-text">
            Bilirubin is produced from the breakdown of hemoglobin when red blood cells reach the end of their lifespan.
            Newborns produce approximately twice as much bilirubin as adults due to increased red blood cell turnover,
            immature liver function, and increased enterohepatic circulation. This natural process leads to the visible
            yellowing of skin and eyes known as jaundice. While most cases resolve naturally, understanding bilirubin
            metabolism helps parents recognize when medical attention is needed.
          </p>
        </div>
      </section>

      {/* SIGNS TO WATCH FOR */}
      <section className="signs-section">
        <div className="signs-content">
          <div className="signs-header">
            <h1 className="signs-title">Signs to Watch For</h1>
            <div className="title-accent"></div>
          </div>
          <div className="signs-grid">
            <div className="sign-card">
              <div className="sign-icon">👁️</div>
              <div className="sign-content">
                <h3>Yellow Skin/Eyes</h3>
                <p>The most common sign, usually starting on the face and moving down the body.</p>
              </div>
            </div>
            <div className="sign-card">
              <div className="sign-icon">😴</div>
              <div className="sign-content">
                <h3>Drowsiness</h3>
                <p>Your baby may be unusually sleepy or difficult to wake for feedings.</p>
              </div>
            </div>
            <div className="sign-card">
              <div className="sign-icon">🍼</div>
              <div className="sign-content">
                <h3>Poor Feeding</h3>
                <p>Difficulty with breastfeeding or bottle-feeding is a key sign to monitor.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAUSES AND TYPES */}
      <section className="info-section">
        <div className="info-content">
          <div className="info-header">
            <h1 className="info-title">Causes and Types</h1>
            <div className="title-accent"></div>
          </div>
          <div className="info-text">
            <h3>Physiological Jaundice</h3>
            <p>The normal process of RBC breakdown combined with an immature hepatic system. Appears day 2-3 of life, peaks day 5-7, resolves by day 10-14 in term infants.</p>

            <h3>Pathological Jaundice</h3>
            <p>Results from underlying disease or exceeds age-specific treatment thresholds. Red flags include jaundice within first 24 hours, rapidly rising bilirubin (&gt;8.5 μmol/L/hour), or persistence beyond expected timeframe.</p>

            <h3>Risk Factors</h3>
            <p>Prematurity, blood group incompatibility, bruising/cephalohematoma, family history of hemolytic disease, exclusive breastfeeding, and gestational age under 38 weeks.</p>
          </div>
        </div>
      </section>

      {/* DIAGNOSIS AND MONITORING */}
      <section className="diagnosis-section">
        <div className="diagnosis-content">
          <div className="diagnosis-header">
            <h1 className="diagnosis-title">Diagnosis and Monitoring</h1>
            <div className="title-accent"></div>
          </div>
          <div className="diagnosis-text">
            <h3>Clinical Assessment</h3>
            <p>Visual inspection in bright light, blanching test, and examination of key areas (sclera, gums, blanched skin).</p>

            <h3>Measurement Methods</h3>
            <p>Transcutaneous bilirubin (TcB) provides rapid screening, while serum bilirubin (SBR) remains the gold standard for quantification. TcB is excellent for screening when &gt;50 μmol/L below phototherapy threshold.</p>

            <h3>Monitoring Guidelines</h3>
            <p>All babies &lt;35 weeks gestation require SBR measurement. Term infants with visible jaundice need measurement before discharge, with risk-based follow-up at 24-72 hours.</p>
          </div>
        </div>
      </section>

      {/* TREATMENT OPTIONS */}
      <section className="treatment-section">
        <div className="treatment-content">
          <div className="treatment-header">
            <h1 className="treatment-title">Treatment Options</h1>
            <div className="title-accent"></div>
          </div>
          <div className="treatment-text">
            <h3>Phototherapy</h3>
            <p>Uses visible light (430-490 nm) to convert unconjugated bilirubin into water-soluble isomers. Standard phototherapy reduces bilirubin by 17-34 μmol/L within 4-6 hours. Intensive phototherapy (doubled intensity) reduces levels by 20-40% within 4-6 hours.</p>

            <h3>Exchange Transfusion</h3>
            <p>Reserved for severe hyperbilirubinemia above exchange thresholds or rapidly rising bilirubin despite intensive phototherapy. Removes ~80 mL/kg of infant's blood, replacing with donor RBCs and plasma.</p>

            <h3>Feeding Support</h3>
            <p>Adequate feeding is fundamental - promotes bilirubin excretion via stool and prevents dehydration. Lactation consultation recommended for breastfeeding difficulties. Continue breastfeeding during phototherapy.</p>
          </div>
        </div>
      </section>

      {/* GET SUPPORT */}
      <section className="support-section">
        <div className="support-content">
          <div className="support-header">
            <h1 className="support-title">Get Support</h1>
            <div className="title-accent"></div>
          </div>
          <div className="support-grid">
            <div className="support-card">
              <h3>📚 Educational Resources</h3>
              <ul>
                <li>Understanding Bilirubin Metabolism</li>
                <li>Phototherapy: What Parents Need to Know</li>
                <li>Feeding Support for Jaundiced Infants</li>
                <li>Recognizing Warning Signs</li>
              </ul>
            </div>
            <div className="support-card">
              <h3>🏥 Professional Support</h3>
              <ul>
                <li>24/7 Neonatal Helpline</li>
                <li>Lactation Consultant Services</li>
                <li>Follow-up Care Coordination</li>
                <li>Multidisciplinary Care Team</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}