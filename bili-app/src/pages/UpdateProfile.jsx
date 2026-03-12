import { useEffect, useMemo, useState } from "react";
import "./UpdateProfile.css";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../context/LanguageContext";

const DEFAULT_PROFILE_PHOTO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBlf6OZ2nPJdzVwKTcsQhy0YhLT9LGlKXYGKWnoYuTAAygp0W9JmKcsXuor9qUcI_whjed1G5ALWtsNfglIJxAWi7tfBl8WhuS9JxI5qxluxO9l6xyKNXuguMD73rSKMrJPVk_403uHp3Vm9dbA1QjUrhSbZNeihDDeXyLrcbuTagqUbkQ90O_RkRvRAu1AFRNXxTA_mANmxIoNY-d5g4zEKcmQG8yluwyYwP9Ymcv_VClR-IR3nZ3GTpweBj1nxyioy2srrfGUq8o";

const EMPTY_FORM = {
  fullName: "",
  email: "",
  gender: "unknown",
  phone: "",
  dateOfBirth: "",
  allergies: "",
  medicalHistory: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function mapUserToForm(user) {
  const metadata = user?.user_metadata ?? {};

  return {
    fullName: metadata.full_name ?? "",
    email: user?.email ?? "",
    gender: metadata.gender ?? "unknown",
    phone: metadata.phone ?? "",
    dateOfBirth: metadata.date_of_birth ?? "",
    allergies: metadata.allergies ?? "",
    medicalHistory: metadata.medical_history ?? "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
}

function metadataFromForm(form) {
  return {
    full_name: form.fullName.trim(),
    gender: form.gender,
    phone: form.phone.trim(),
    date_of_birth: form.dateOfBirth,
    allergies: form.allergies.trim(),
    medical_history: form.medicalHistory.trim(),
  };
}

export default function UpdateProfile() {
  const fallbackPhotoUrl = useMemo(() => DEFAULT_PROFILE_PHOTO, []);
  const { t } = useLanguage();

  const [form, setForm] = useState(EMPTY_FORM);
  const [savedForm, setSavedForm] = useState(EMPTY_FORM);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(fallbackPhotoUrl);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");

      const { data, error: getUserError } = await supabase.auth.getUser();

      if (getUserError || !data?.user) {
        setError(getUserError?.message ?? t("updateProfile.loadError"));
        setLoading(false);
        return;
      }

      const loadedForm = mapUserToForm(data.user);
      setForm(loadedForm);
      setSavedForm(loadedForm);
      setProfilePhotoUrl(data.user.user_metadata?.avatar_url || fallbackPhotoUrl);
      setLoading(false);
    };

    loadProfile();
  }, [fallbackPhotoUrl, t]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setSuccess("");
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const hasPasswordInput =
      form.currentPassword || form.newPassword || form.confirmPassword;

    if (form.medicalHistory.trim().length > 250) {
      setError(t("updateProfile.patientBackgroundTooLong"));
      return;
    }

    if (hasPasswordInput) {
      if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
        setError(t("updateProfile.fillAllPasswordFields"));
        return;
      }

      if (form.newPassword !== form.confirmPassword) {
        setError(t("updateProfile.passwordMismatch"));
        return;
      }

      if (form.newPassword.length < 6) {
        setError(t("updateProfile.passwordTooShort"));
        return;
      }
    }

    setSaving(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error(userError?.message ?? t("updateProfile.identifyUserError"));
      }

      const currentUser = userData.user;
      const isEmailChanged =
        form.email.trim() &&
        form.email.trim().toLowerCase() !== (currentUser.email ?? "").toLowerCase();

      if (hasPasswordInput || isEmailChanged) {
        if (!form.currentPassword) {
          throw new Error(t("updateProfile.currentPasswordRequired"));
        }

        const { error: reauthError } = await supabase.auth.signInWithPassword({
          email: currentUser.email,
          password: form.currentPassword,
        });

        if (reauthError) {
          throw new Error(t("updateProfile.currentPasswordIncorrect"));
        }
      }

      const profilePayload = {
        data: metadataFromForm(form),
      };

      if (isEmailChanged) {
        profilePayload.email = form.email.trim();
      }

      const { error: profileUpdateError } = await supabase.auth.updateUser(profilePayload);

      if (profileUpdateError) {
        throw new Error(profileUpdateError.message);
      }

      if (hasPasswordInput) {
        const { error: passwordUpdateError } = await supabase.auth.updateUser({
          password: form.newPassword,
        });

        if (passwordUpdateError) {
          throw new Error(passwordUpdateError.message);
        }
      }

      const { data: refreshedData, error: refreshedError } = await supabase.auth.getUser();
      if (refreshedError || !refreshedData?.user) {
        throw new Error(refreshedError?.message ?? t("updateProfile.refreshFailed"));
      }

      const refreshedForm = mapUserToForm(refreshedData.user);
      setForm(refreshedForm);
      setSavedForm(refreshedForm);
      setProfilePhotoUrl(
        refreshedData.user.user_metadata?.avatar_url || fallbackPhotoUrl,
      );

      if (isEmailChanged) {
        setSuccess(t("updateProfile.emailConfirmSuccess"));
      } else {
        setSuccess(t("updateProfile.success"));
      }
    } catch (submitError) {
      setError(submitError.message || t("updateProfile.genericError"));
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    setForm(savedForm);
    setError("");
    setSuccess("");
  };

  return (
    <main className="update-profile">
      <div className="up-main">
        <div className="up-layout">
          <aside className="up-sidebar"></aside>

          <section className="up-card" aria-label={t("updateProfile.ariaProfileSettings")}>
            <div className="up-card-head">
              <h1 className="up-title">{t("updateProfile.settingsTitle")}</h1>
              <p className="up-subtitle">{t("updateProfile.settingsSubtitle")}</p>
            </div>

            <div className="up-card-body">
              <section className="up-photo">
                <div className="up-photo-wrap">
                  <div
                    className="up-photo-img"
                    role="img"
                    aria-label={t("updateProfile.ariaProfilePhoto")}
                    style={{ backgroundImage: `url(${profilePhotoUrl})` }}
                  />
                  <button
                    type="button"
                    className="up-photo-overlay"
                    aria-label={t("updateProfile.ariaChangePhoto")}
                    onClick={() => alert(t("updateProfile.uploadFlowAlert"))}
                  >
                    <span className="material-symbols-outlined">
                      photo_camera
                    </span>
                  </button>
                </div>

                <div className="up-photo-meta">
                  <h4 className="up-photo-title">{t("updateProfile.uploadTitle")}</h4>
                  <p className="up-photo-help">{t("updateProfile.uploadHelp")}</p>
                  <div className="up-photo-actions">
                    <button
                      type="button"
                      className="up-btn up-btn-secondary"
                      onClick={() => alert(t("updateProfile.uploadFlowAlert"))}
                    >
                      {t("updateProfile.changePhoto")}
                    </button>
                    <button
                      type="button"
                      className="up-btn up-btn-outline"
                      onClick={() => alert(t("updateProfile.removePhotoAlert"))}
                    >
                      {t("common.remove")}
                    </button>
                  </div>
                </div>
              </section>

              <div className="up-divider" role="separator" />

              <form className="up-form" onSubmit={onSubmit}>
                {loading && <p className="up-status">{t("updateProfile.loadingProfile")}</p>}
                {error && <p className="up-status up-status-error">{error}</p>}
                {success && (
                  <p className="up-status up-status-success">{success}</p>
                )}

                <div className="up-grid">
                  <div className="up-field">
                    <label className="up-label" htmlFor="fullName">
                      {t("updateProfile.fullName")}
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      className="up-input"
                      type="text"
                      placeholder={t("updateProfile.fullNamePlaceholder")}
                      value={form.fullName}
                      onChange={onChange}
                      disabled={loading || saving}
                    />
                  </div>

                  <div className="up-field">
                    <label className="up-label" htmlFor="email">
                      {t("updateProfile.email")}
                    </label>
                    <input
                      id="email"
                      name="email"
                      className="up-input"
                      type="email"
                      placeholder={t("updateProfile.emailPlaceholder")}
                      value={form.email}
                      onChange={onChange}
                      disabled={loading || saving}
                    />
                  </div>

                  <div className="up-field">
                    <label className="up-label" htmlFor="gender">
                      {t("updateProfile.gender")}
                    </label>
                    <div className="up-select-wrap">
                      <select
                        id="gender"
                        name="gender"
                        className="up-select"
                        value={form.gender}
                        onChange={onChange}
                        disabled={loading || saving}
                      >
                        <option value="female">{t("dashboard.female")}</option>
                        <option value="male">{t("dashboard.male")}</option>
                        <option value="other">{t("dashboard.other")}</option>
                        <option value="unknown">{t("updateProfile.preferNotToSay")}</option>
                      </select>
                      <span className="material-symbols-outlined up-select-icon">
                        expand_more
                      </span>
                    </div>
                  </div>

                  <div className="up-field">
                    <label className="up-label" htmlFor="phone">
                      {t("updateProfile.phone")}
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      className="up-input"
                      type="tel"
                      placeholder={t("updateProfile.phonePlaceholder")}
                      value={form.phone}
                      onChange={onChange}
                      disabled={loading || saving}
                    />
                  </div>

                  <div className="up-field">
                    <label className="up-label" htmlFor="dateOfBirth">
                      {t("updateProfile.dateOfBirth")}
                    </label>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      className="up-input"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={onChange}
                      disabled={loading || saving}
                    />
                  </div>

                  <div className="up-field">
                    <label className="up-label" htmlFor="allergies">
                      {t("updateProfile.allergies")}
                    </label>
                    <input
                      id="allergies"
                      name="allergies"
                      className="up-input"
                      type="text"
                      placeholder={t("updateProfile.allergiesPlaceholder")}
                      value={form.allergies}
                      onChange={onChange}
                      disabled={loading || saving}
                    />
                  </div>

                  <div className="up-field span-2 up-password-section">
                    <h3 className="up-subsection-title">{t("updateProfile.changePassword")}</h3>
                    <div className="up-field">
                      <label className="up-label" htmlFor="currentPassword">
                        {t("updateProfile.currentPassword")}
                      </label>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        className="up-input"
                        type="password"
                        value={form.currentPassword}
                        onChange={onChange}
                        disabled={loading || saving}
                      />
                    </div>

                    <div className="up-field">
                      <label className="up-label" htmlFor="newPassword">
                        {t("updateProfile.newPassword")}
                      </label>
                      <input
                        id="newPassword"
                        name="newPassword"
                        className="up-input"
                        type="password"
                        value={form.newPassword}
                        onChange={onChange}
                        disabled={loading || saving}
                      />
                    </div>

                    <div className="up-field">
                      <label className="up-label" htmlFor="confirmPassword">
                        {t("updateProfile.confirmPassword")}
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        className="up-input"
                        type="password"
                        value={form.confirmPassword}
                        onChange={onChange}
                        disabled={loading || saving}
                      />
                    </div>

                    <p className="up-help">{t("updateProfile.passwordHelp")}</p>
                  </div>

                  <div className="up-field span-2">
                    <label className="up-label" htmlFor="medicalHistory">
                      {t("updateProfile.patientBackground")}
                    </label>
                    <textarea
                      id="medicalHistory"
                      name="medicalHistory"
                      className="up-textarea"
                      rows={4}
                      placeholder={t("updateProfile.patientBackgroundPlaceholder")}
                      value={form.medicalHistory}
                      onChange={onChange}
                      maxLength={250}
                      disabled={loading || saving}
                    />
                    <p className="up-help">{t("updateProfile.patientBackgroundHelp")}</p>
                  </div>
                </div>

                <div className="up-form-footer">
                  <button
                    type="button"
                    className="up-delete"
                    onClick={() =>
                      confirm(t("updateProfile.deleteConfirm")) &&
                      alert(t("updateProfile.deleteAlert"))
                    }
                    disabled={loading || saving}
                  >
                    {t("updateProfile.deleteAccount")}
                  </button>

                  <div className="up-footer-actions">
                    <button
                      type="button"
                      className="up-btn up-btn-outline"
                      onClick={onCancel}
                      disabled={loading || saving}
                    >
                      {t("common.cancel")}
                    </button>
                    <button
                      type="submit"
                      className="up-btn up-btn-primary"
                      disabled={loading || saving}
                    >
                      <span className="material-symbols-outlined">
                        check_circle
                      </span>
                      {saving ? t("updateProfile.saving") : t("updateProfile.saveChanges")}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
