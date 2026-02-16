import { useEffect, useMemo, useState } from "react";
import "./UpdateProfile.css";
import { supabase } from "../lib/supabaseClient";

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
        setError(getUserError?.message ?? "Unable to load user profile.");
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
  }, [fallbackPhotoUrl]);

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
      setError("Patient background must be 250 characters or less.");
      return;
    }

    if (hasPasswordInput) {
      if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
        setError("Fill all password fields to change your password.");
        return;
      }

      if (form.newPassword !== form.confirmPassword) {
        setError("New password and confirmation do not match.");
        return;
      }

      if (form.newPassword.length < 6) {
        setError("New password must be at least 6 characters.");
        return;
      }
    }

    setSaving(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error(userError?.message ?? "Unable to identify current user.");
      }

      const currentUser = userData.user;
      const isEmailChanged =
        form.email.trim() &&
        form.email.trim().toLowerCase() !== (currentUser.email ?? "").toLowerCase();

      if (hasPasswordInput || isEmailChanged) {
        if (!form.currentPassword) {
          throw new Error("Current password is required to change email or password.");
        }

        const { error: reauthError } = await supabase.auth.signInWithPassword({
          email: currentUser.email,
          password: form.currentPassword,
        });

        if (reauthError) {
          throw new Error("Current password is incorrect.");
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
        throw new Error(refreshedError?.message ?? "Profile updated but reload failed.");
      }

      const refreshedForm = mapUserToForm(refreshedData.user);
      setForm(refreshedForm);
      setSavedForm(refreshedForm);
      setProfilePhotoUrl(
        refreshedData.user.user_metadata?.avatar_url || fallbackPhotoUrl,
      );

      if (isEmailChanged) {
        setSuccess(
          "Profile updated. Check your inbox to confirm the new email address.",
        );
      } else {
        setSuccess("Profile updated successfully.");
      }
    } catch (submitError) {
      setError(submitError.message || "Failed to update profile.");
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

          <section className="up-card" aria-label="Profile settings">
            <div className="up-card-head">
              <h1 className="up-title">Profile Settings</h1>
              <p className="up-subtitle">
                Keep your patient information up to date to ensure timely and
                safe care.
              </p>
            </div>

            <div className="up-card-body">
              <section className="up-photo">
                <div className="up-photo-wrap">
                  <div
                    className="up-photo-img"
                    role="img"
                    aria-label="Profile photo"
                    style={{ backgroundImage: `url(${profilePhotoUrl})` }}
                  />
                  <button
                    type="button"
                    className="up-photo-overlay"
                    aria-label="Change profile photo"
                    onClick={() => alert("Connect this to an upload flow.")}
                  >
                    <span className="material-symbols-outlined">
                      photo_camera
                    </span>
                  </button>
                </div>

                <div className="up-photo-meta">
                  <h4 className="up-photo-title">Upload Profile Photo</h4>
                  <p className="up-photo-help">
                    JPG, GIF or PNG. Maximum size 800KB.
                  </p>
                  <div className="up-photo-actions">
                    <button
                      type="button"
                      className="up-btn up-btn-secondary"
                      onClick={() => alert("Connect this to an upload flow.")}
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      className="up-btn up-btn-outline"
                      onClick={() => alert("Connect this to remove photo.")}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </section>

              <div className="up-divider" role="separator" />

              <form className="up-form" onSubmit={onSubmit}>
                {loading && <p className="up-status">Loading profile...</p>}
                {error && <p className="up-status up-status-error">{error}</p>}
                {success && (
                  <p className="up-status up-status-success">{success}</p>
                )}

                <div className="up-grid">
                  <div className="up-field">
                    <label className="up-label" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      className="up-input"
                      type="text"
                      placeholder="e.g. Sarah Jenkins"
                      value={form.fullName}
                      onChange={onChange}
                      disabled={loading || saving}
                    />
                  </div>

                  <div className="up-field">
                    <label className="up-label" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      className="up-input"
                      type="email"
                      placeholder="sarah.j@biliquant.org"
                      value={form.email}
                      onChange={onChange}
                      disabled={loading || saving}
                    />
                  </div>

                  <div className="up-field">
                    <label className="up-label" htmlFor="gender">
                      Gender
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
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                        <option value="unknown">Prefer not to say</option>
                      </select>
                      <span className="material-symbols-outlined up-select-icon">
                        expand_more
                      </span>
                    </div>
                  </div>

                  <div className="up-field">
                    <label className="up-label" htmlFor="phone">
                      Phone Number (Optional)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      className="up-input"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={onChange}
                      disabled={loading || saving}
                    />
                  </div>

                  <div className="up-field">
                    <label className="up-label" htmlFor="dateOfBirth">
                      Date of Birth
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
                      Allergies (Optional)
                    </label>
                    <input
                      id="allergies"
                      name="allergies"
                      className="up-input"
                      type="text"
                      placeholder="e.g. Penicillin, peanuts"
                      value={form.allergies}
                      onChange={onChange}
                      disabled={loading || saving}
                    />
                  </div>

                  <div className="up-field span-2 up-password-section">
                    <h3 className="up-subsection-title">Change Password</h3>
                    <div className="up-field">
                      <label className="up-label" htmlFor="currentPassword">
                        Current Password
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
                        New Password
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
                        Confirm New Password
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

                    <p className="up-help">
                      Enter current password to change email or password.
                    </p>
                  </div>

                  <div className="up-field span-2">
                    <label className="up-label" htmlFor="medicalHistory">
                      Patient Background
                    </label>
                    <textarea
                      id="medicalHistory"
                      name="medicalHistory"
                      className="up-textarea"
                      rows={4}
                      placeholder="Summarize relevant medical history, perinatal events, or other notes for the care team..."
                      value={form.medicalHistory}
                      onChange={onChange}
                      maxLength={250}
                      disabled={loading || saving}
                    />
                    <p className="up-help">
                      Brief medical notes for the patient record. Max 250
                      characters.
                    </p>
                  </div>
                </div>

                <div className="up-form-footer">
                  <button
                    type="button"
                    className="up-delete"
                    onClick={() =>
                      confirm("This is a demo. Confirm delete?") &&
                      alert("Wire delete flow later.")
                    }
                    disabled={loading || saving}
                  >
                    Delete Account
                  </button>

                  <div className="up-footer-actions">
                    <button
                      type="button"
                      className="up-btn up-btn-outline"
                      onClick={onCancel}
                      disabled={loading || saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="up-btn up-btn-primary"
                      disabled={loading || saving}
                    >
                      <span className="material-symbols-outlined">
                        check_circle
                      </span>
                      {saving ? "Saving..." : "Save Changes"}
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
