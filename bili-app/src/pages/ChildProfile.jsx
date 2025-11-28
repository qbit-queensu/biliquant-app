import React, { useState } from 'react';
import styles from './ChildProfile.module.css';

export default function ChildProfile() {
  const [formData, setFormData] = useState({
    childName: '',
    childGender: '',
    childDateOfBirth: '',
    childWeight: '',
    doctorName: '',
    doctorEmail: '',
    doctorPlaceOfWork: '',
    doctorPhoneNumber: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}></div>
      
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                {/* Placeholder for avatar - you can add an image here */}
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="20" fill="#E0E0E0"/>
                  <path d="M20 20C22.7614 20 25 17.7614 25 15C25 12.2386 22.7614 10 20 10C17.2386 10 15 12.2386 15 15C15 17.7614 17.2386 20 20 20Z" fill="#999"/>
                  <path d="M20 22C14.477 22 10 26.477 10 32H30C30 26.477 25.523 22 20 22Z" fill="#999"/>
                </svg>
              </div>
            </div>
            <h1 className={styles.profileTitle}>Child A</h1>
          </div>

          <form className={styles.form}>
            <section className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Basic Information</h2>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="childName" className={styles.label}>Child's Name:</label>
                  <input
                    type="text"
                    id="childName"
                    name="childName"
                    value={formData.childName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter child's name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="childGender" className={styles.label}>Child's Gender:</label>
                  <select
                    id="childGender"
                    name="childGender"
                    value={formData.childGender}
                    onChange={handleInputChange}
                    className={styles.input}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="childDateOfBirth" className={styles.label}>Child's Date of Birth:</label>
                  <input
                    type="date"
                    id="childDateOfBirth"
                    name="childDateOfBirth"
                    value={formData.childDateOfBirth}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="childWeight" className={styles.label}>Child's Weight:</label>
                  <input
                    type="text"
                    id="childWeight"
                    name="childWeight"
                    value={formData.childWeight}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="e.g., 3.5 kg"
                  />
                </div>
              </div>
            </section>

            <section className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Preferred Doctor's Contact Information</h2>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="doctorName" className={styles.label}>Doctor's Name:</label>
                  <input
                    type="text"
                    id="doctorName"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter doctor's name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="doctorEmail" className={styles.label}>Doctor's Email:</label>
                  <input
                    type="email"
                    id="doctorEmail"
                    name="doctorEmail"
                    value={formData.doctorEmail}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="doctor@example.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="doctorPlaceOfWork" className={styles.label}>Doctor's Place of Work:</label>
                  <input
                    type="text"
                    id="doctorPlaceOfWork"
                    name="doctorPlaceOfWork"
                    value={formData.doctorPlaceOfWork}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Hospital/Clinic name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="doctorPhoneNumber" className={styles.label}>Doctor's Phone Number:</label>
                  <input
                    type="tel"
                    id="doctorPhoneNumber"
                    name="doctorPhoneNumber"
                    value={formData.doctorPhoneNumber}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}
