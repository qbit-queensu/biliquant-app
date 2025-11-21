import React from 'react';
import './mission.css';

export default function BilliQuantMission() {
  return (
    <div className="page">
      {/* MISSION */}
      <section className="section">
        <div className="mission-box">
          <h2>Our Mission</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </section>

      {/* VISION */}
      <section className="section">
        <div className="vision-box">
          <h2>Our Vision</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </section>

      {/* IMAGE GRID */}
      <section className="image-grid">
        <div className="card light1"><div className="inner-card"></div></div>
        <div className="card light2"><div className="inner-card"></div></div>
        <div className="card light3"><div className="inner-card"></div></div>
        <div className="card light4"><div className="inner-card"></div></div>
      </section>
    </div>
  );
}
