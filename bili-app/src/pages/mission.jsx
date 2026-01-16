import React from 'react';
import './mission.css';

export default function BilliQuantMission() {
  return (
    <div className="page">
      {/* MISSION SECTION */}
      <section className="mission-section">
        <div className="mission-content">
          <div className="mission-header">
            <h1 className="mission-title">Our Mission</h1>
            <div className="title-accent"></div>
          </div>
          <p className="mission-text">
            The Queen's Biomedical Innovation Team (QBiT) empowers undergraduate students to explore the frontiers of biomedical engineering through hands-on, real-world design projects. By tackling challenges such as developing accessible solutions for neonatal jaundice, we provide students with opportunities to build technical expertise, cultivate creativity, and strengthen leadership skills. QBiT fosters collaboration across disciplines, promotes awareness of biomedical engineering on campus, and encourages innovation in a volunteer-driven, inclusive, and supportive environment, preparing students to make meaningful contributions to health outcomes locally and globally.
          </p>
        </div>
      </section>

      {/* IMAGE GALLERY */}
      <section className="gallery-section">
        <div className="gallery-grid">
          <div className="gallery-item"><div className="image-placeholder"></div></div>
          <div className="gallery-item"><div className="image-placeholder"></div></div>
          <div className="gallery-item"><div className="image-placeholder"></div></div>
          <div className="gallery-item"><div className="image-placeholder"></div></div>
          <div className="gallery-item"><div className="image-placeholder"></div></div>
          <div className="gallery-item"><div className="image-placeholder"></div></div>
        </div>
      </section>

      {/* VISION SECTION */}
      <section className="vision-section">
        <div className="vision-content">
          <div className="vision-header">
            <h1 className="vision-title">Our Vision</h1>
            <div className="title-accent"></div>
          </div>
          <p className="vision-text">
            QBiT aspires to be a premier undergraduate biomedical innovation community recognized for translating creative ideas into impactful solutions that improve human health. We aim to inspire curiosity, drive innovation, and cultivate the next generation of biomedical engineers and leaders who are equipped to address pressing medical challenges such as neonatal jaundice, while advancing accessible, sustainable, and life-changing technologies for communities worldwide.
          </p>
        </div>
      </section>
    </div>
  );
}
