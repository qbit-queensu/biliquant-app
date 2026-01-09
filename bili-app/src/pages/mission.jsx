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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </section>
    </div>
  );
}
