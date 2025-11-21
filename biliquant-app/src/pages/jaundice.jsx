import React, { useState } from 'react';
import './jaundice.css';

export default function JaundiceGuide() {
  const [openAccordion, setOpenAccordion] = useState('causes');

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="page">
      {/* LOGO */}
      <header className="logo">
        <div className="logo-icon">
          <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
          </svg>
        </div>
        <h1>BilliQuant</h1>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Understanding Newborn Jaundice: A Guide for Your Family</h2>
          <p className="hero-subtitle">
            A comprehensive and reassuring resource to help you navigate, manage, and support your newborn through neonatal jaundice.
          </p>
          <button className="hero-button">Download a Guide</button>
        </div>
      </section>

      {/* WHAT IS JAUNDICE */}
      <section className="section">
        <div className="content-box">
          <h2>What is Jaundice?</h2>
          <p>
            A simple, clear explanation of what neonatal jaundice is, why it occurs in newborns, and what parents can typically expect. 
            This section aims to provide foundational knowledge in an easy-to-understand manner. Neonatal jaundice is a common and usually 
            harmless condition in newborn babies that causes yellowing of the skin and the whites of the eyes.
          </p>
        </div>
      </section>

      {/* SIGNS TO WATCH FOR */}
      <section className="section">
        <div className="signs-box">
          <h2>Signs to Watch For</h2>
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

      {/* CAUSES, DIAGNOSIS & TREATMENT */}
      <section className="section">
        <h2>Causes, Diagnosis & Treatment</h2>
        <div className="accordion-container">
          <div className="accordion-item">
            <div 
              className="accordion-header"
              onClick={() => toggleAccordion('causes')}
            >
              <span>Causes and Types</span>
              <span className={`accordion-arrow ${openAccordion === 'causes' ? 'open' : ''}`}>▼</span>
            </div>
            {openAccordion === 'causes' && (
              <div className="accordion-content">
                <p>
                  Jaundice occurs when there is a buildup of bilirubin, a yellow substance produced when red blood cells are broken down. 
                  Learn about physiological (normal) jaundice, breastfeeding jaundice, and other less common types.
                </p>
              </div>
            )}
          </div>

          <div className="accordion-item">
            <div 
              className="accordion-header"
              onClick={() => toggleAccordion('diagnosis')}
            >
              <span>Diagnosis and Monitoring</span>
              <span className={`accordion-arrow ${openAccordion === 'diagnosis' ? 'open' : ''}`}>▼</span>
            </div>
            {openAccordion === 'diagnosis' && (
              <div className="accordion-content">
                <p>
                  Doctors diagnose jaundice through a physical exam and can confirm it with a simple skin or blood test to measure bilirubin levels. 
                  Monitoring is crucial, especially in the first few days of life.
                </p>
              </div>
            )}
          </div>

          <div className="accordion-item">
            <div 
              className="accordion-header"
              onClick={() => toggleAccordion('treatment')}
            >
              <span>Treatment Options</span>
              <span className={`accordion-arrow ${openAccordion === 'treatment' ? 'open' : ''}`}>▼</span>
            </div>
            {openAccordion === 'treatment' && (
              <div className="accordion-content">
                <p>
                  Most cases of newborn jaundice resolve on their own. For higher bilirubin levels, common treatments include phototherapy 
                  (light therapy) and ensuring adequate feeding to help eliminate bilirubin from the body.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* LEARN MORE & GET SUPPORT */}
      <section className="section">
        <h2>Learn More & Get Support</h2>
        <div className="accordion-container">
          <div className="accordion-item">
            <div 
              className="accordion-header"
              onClick={() => toggleAccordion('learn')}
            >
              <span>Learn More</span>
              <span className={`accordion-arrow ${openAccordion === 'learn' ? 'open' : ''}`}>▼</span>
            </div>
            {openAccordion === 'learn' && (
              <div className="accordion-content">
                <ul>
                  <li><a href="#">Educational Videos Placeholder</a></li>
                  <li><a href="#">Parental Tips for Home Care Placeholder</a></li>
                  <li><a href="#">Frequently Asked Questions Placeholder</a></li>
                </ul>
              </div>
            )}
          </div>

          <div className="accordion-item">
            <div 
              className="accordion-header"
              onClick={() => toggleAccordion('support')}
            >
              <span>Get Support</span>
              <span className={`accordion-arrow ${openAccordion === 'support' ? 'open' : ''}`}>▼</span>
            </div>
            {openAccordion === 'support' && (
              <div className="accordion-content">
                <ul>
                  <li><a href="#">Local Support Groups Placeholder</a></li>
                  <li><a href="#">Professional Organizations Placeholder</a></li>
                  <li><a href="#">Downloadable Guides Placeholder</a></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}