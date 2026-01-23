import React, { useState } from 'react';
import './mission.css';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import designElectricalLayout from '../assets/design-electrical-layout.jpeg';
import image3 from '../assets/image3.jpg';
import image4 from '../assets/image4.png';
import preliminarySketch from '../assets/preliminary-sketch.jpeg';

export default function BilliQuantMission() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
          <div className="gallery-item"><img src={image1} alt="Project Image 1" className="gallery-image" onClick={() => { setSelectedImage(image1); setIsModalOpen(true); }} /></div>
          <div className="gallery-item"><img src={image2} alt="Project Image 2" className="gallery-image" onClick={() => { setSelectedImage(image2); setIsModalOpen(true); }} /></div>
          <div className="gallery-item"><img src={designElectricalLayout} alt="Design with Electrical Layout" className="gallery-image" onClick={() => { setSelectedImage(designElectricalLayout); setIsModalOpen(true); }} /></div>
          <div className="gallery-item"><img src={image3} alt="Project Image 3" className="gallery-image" onClick={() => { setSelectedImage(image3); setIsModalOpen(true); }} /></div>
          <div className="gallery-item"><img src={image4} alt="Project Image 4" className="gallery-image" onClick={() => { setSelectedImage(image4); setIsModalOpen(true); }} /></div>
          <div className="gallery-item"><img src={preliminarySketch} alt="Preliminary Sketch" className="gallery-image" onClick={() => { setSelectedImage(preliminarySketch); setIsModalOpen(true); }} /></div>
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

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            <img src={selectedImage} alt="Enlarged view" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
}
