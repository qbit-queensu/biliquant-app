import React, { useState } from "react";
import styles from "./ChildProfile.module.css";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../context/LanguageContext";

export default function ChildProfile() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    childName: "",
    childGender: "",
    childDateOfBirth: "",
    childBirthTime: "",
    childWeight: "",
    doctorName: "",
    doctorEmail: "",
    doctorPlaceOfWork: "",
    doctorPhoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError(t("childProfile.loginRequired"));
        setLoading(false);
        return;
      }

      const { error: dbError } = await supabase.from("children").insert([
        {
          user_id: user.id,
          child_name: formData.childName,
          child_gender: formData.childGender,
          child_date_of_birth: formData.childDateOfBirth,
          child_birth_time: formData.childBirthTime,
          child_weight: formData.childWeight,
          doctor_name: formData.doctorName,
          doctor_email: formData.doctorEmail,
          doctor_place_of_work: formData.doctorPlaceOfWork,
          doctor_phone_number: formData.doctorPhoneNumber,
        },
      ]);

      if (dbError) throw dbError;

      setSuccess(t("childProfile.saveSuccess"));
      setFormData({
        childName: "",
        childGender: "",
        childDateOfBirth: "",
        childBirthTime: "",
        childWeight: "",
        doctorName: "",
        doctorEmail: "",
        doctorPlaceOfWork: "",
        doctorPhoneNumber: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}></div>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="20" fill="#E0E0E0" />
                  <path d="M20 20C22.7614 20 25 17.7614 25 15C25 12.2386 22.7614 10 20 10C17.2386 10 15 12.2386 15 15C15 17.7614 17.2386 20 20 20Z" fill="#999" />
                  <path d="M20 22C14.477 22 10 26.477 10 32H30C30 26.477 25.523 22 20 22Z" fill="#999" />
                </svg>
              </div>
            </div>
            <h1 className={styles.profileTitle}>{t("childProfile.title")}</h1>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}

            <section className={styles.formSection}>
              <h2 className={styles.sectionTitle}>{t("childProfile.basicInformation")}</h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="childName" className={styles.label}>{t("childProfile.childName")}</label>
                  <input id="childName" name="childName" value={formData.childName} onChange={handleInputChange} className={styles.input} placeholder={t("childProfile.childNamePlaceholder")} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="childGender" className={styles.label}>{t("childProfile.childGender")}</label>
                  <select id="childGender" name="childGender" value={formData.childGender} onChange={handleInputChange} className={styles.input}>
                    <option value="">{t("childProfile.selectGender")}</option>
                    <option value="male">{t("dashboard.male")}</option>
                    <option value="female">{t("dashboard.female")}</option>
                    <option value="other">{t("dashboard.other")}</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="childDateOfBirth" className={styles.label}>{t("childProfile.childDateOfBirth")}</label>
                  <input type="date" id="childDateOfBirth" name="childDateOfBirth" value={formData.childDateOfBirth} onChange={handleInputChange} className={styles.input} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="childBirthTime" className={styles.label}>{t("childProfile.birthTime")}</label>
                  <input type="time" id="childBirthTime" name="childBirthTime" value={formData.childBirthTime} onChange={handleInputChange} className={styles.input} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="childWeight" className={styles.label}>{t("childProfile.childWeight")}</label>
                  <input type="text" id="childWeight" name="childWeight" value={formData.childWeight} onChange={handleInputChange} className={styles.input} placeholder={t("childProfile.childWeightPlaceholder")} />
                </div>
              </div>
            </section>

            <section className={styles.formSection}>
              <h2 className={styles.sectionTitle}>{t("childProfile.doctorInfo")}</h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="doctorName" className={styles.label}>{t("childProfile.doctorName")}</label>
                  <input type="text" id="doctorName" name="doctorName" value={formData.doctorName} onChange={handleInputChange} className={styles.input} placeholder={t("childProfile.doctorNamePlaceholder")} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="doctorEmail" className={styles.label}>{t("childProfile.doctorEmail")}</label>
                  <input type="email" id="doctorEmail" name="doctorEmail" value={formData.doctorEmail} onChange={handleInputChange} className={styles.input} placeholder={t("childProfile.doctorEmailPlaceholder")} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="doctorPlaceOfWork" className={styles.label}>{t("childProfile.doctorPlaceOfWork")}</label>
                  <input type="text" id="doctorPlaceOfWork" name="doctorPlaceOfWork" value={formData.doctorPlaceOfWork} onChange={handleInputChange} className={styles.input} placeholder={t("childProfile.doctorPlaceOfWorkPlaceholder")} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="doctorPhoneNumber" className={styles.label}>{t("childProfile.doctorPhoneNumber")}</label>
                  <input type="tel" id="doctorPhoneNumber" name="doctorPhoneNumber" value={formData.doctorPhoneNumber} onChange={handleInputChange} className={styles.input} placeholder={t("childProfile.doctorPhoneNumberPlaceholder")} />
                </div>
              </div>
            </section>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? t("childProfile.saving") : t("childProfile.saveProfile")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
