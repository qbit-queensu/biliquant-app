import React, { useState } from "react";
import "./mission.css";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import designElectricalLayout from "../assets/design-electrical-layout.jpeg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.png";
import preliminarySketch from "../assets/preliminary-sketch.jpeg";
import { useLanguage } from "../context/LanguageContext";

export default function BilliQuantMission() {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    { src: image1, alt: t("mission.imageAlt.image1") },
    { src: image2, alt: t("mission.imageAlt.image2") },
    { src: designElectricalLayout, alt: t("mission.imageAlt.electrical") },
    { src: image3, alt: t("mission.imageAlt.image3") },
    { src: image4, alt: t("mission.imageAlt.image4") },
    { src: preliminarySketch, alt: t("mission.imageAlt.sketch") },
  ];

  return (
    <div className="page">
      <section className="mission-section">
        <div className="mission-content">
          <div className="mission-header">
            <h1 className="mission-title">{t("mission.missionTitle")}</h1>
            <div className="title-accent"></div>
          </div>
          <p className="mission-text">{t("mission.missionText")}</p>
        </div>
      </section>

      <section className="gallery-section">
        <div className="gallery-grid">
          {galleryImages.map((image) => (
            <div key={image.alt} className="gallery-item">
              <img
                src={image.src}
                alt={image.alt}
                className="gallery-image"
                onClick={() => {
                  setSelectedImage(image.src);
                  setIsModalOpen(true);
                }}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="vision-section">
        <div className="vision-content">
          <div className="vision-header">
            <h1 className="vision-title">{t("mission.visionTitle")}</h1>
            <div className="title-accent"></div>
          </div>
          <p className="vision-text">{t("mission.visionText")}</p>
        </div>
      </section>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              aria-label={t("mission.close")}
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt={t("mission.imageAlt.enlarged")}
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}
