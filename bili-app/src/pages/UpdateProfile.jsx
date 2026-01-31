import { useMemo, useState } from "react";
import "./UpdateProfile.css";

export default function UpdateProfile() {
  // Simple local state so inputs aren't read-only.
  const [isDark, setIsDark] = useState(false);

  const avatarUrl = useMemo(
    () =>
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBvMUliq7T6sMNMEliQHhdw4TKKJYK_lh2beiriYMarveQDMpWrTT4U4qAAT2ZcPzVEynJt0tX8lbaURe-I-rHTTxwSPBbq_KSnbSoHNeQ8TMIeItMt--MwTBwsN7qcB0ts8nkDC0vRGb8ORubfHg1qpn4Qrzwvusrk_G6ApY9PTeBrruRT3P5IfjWkiRUN1nZcjihhjBkb-iLhlU0nlNtOhaO0n35tObC-0O3W9V6V5u65IdfZkVSUaib_gyusS6z29zMRX4g3ohM",
    [],
  );

  const profilePhotoUrl = useMemo(
    () =>
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBlf6OZ2nPJdzVwKTcsQhy0YhLT9LGlKXYGKWnoYuTAAygp0W9JmKcsXuor9qUcI_whjed1G5ALWtsNfglIJxAWi7tfBl8WhuS9JxI5qxluxO9l6xyKNXuguMD73rSKMrJPVk_403uHp3Vm9dbA1QjUrhSbZNeihDDeXyLrcbuTagqUbkQ90O_RkRvRAu1AFRNXxTA_mANmxIoNY-d5g4zEKcmQG8yluwyYwP9Ymcv_VClR-IR3nZ3GTpweBj1nxyioy2srrfGUq8o",
    [],
  );

  const [form, setForm] = useState({
    fullName: "Sarah Jenkins",
    email: "sarah.j@biliquant.org",
    gender: "female",
    phone: "",
    dateOfBirth: "",
    allergies: "",
    medicalHistory:
      "Brief summary of relevant medical history, previous diagnoses, or perinatal events.",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Hook this into your real backend later.
    // For now, it simply demonstrates a working form.
    // Avoid logging raw password values in demo output
    const safeForm = { ...form };
    delete safeForm.currentPassword;
    delete safeForm.newPassword;
    delete safeForm.confirmPassword;
    console.log("UpdateProfile submitted:", safeForm);
    alert("Saved (demo). Wire this to your backend when ready.");
  };

  const onCancel = () => {
    // Simple reset to initial values from the template
    setForm({
      fullName: "Sarah Jenkins",
      email: "sarah.j@biliquant.org",
      gender: "female",
      phone: "",
      dateOfBirth: "",
      allergies: "",
      medicalHistory:
        "Brief summary of relevant medical history, previous diagnoses, or perinatal events.",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className={`update-profile ${isDark ? "dark" : ""}`}>
      <div className="up-shell">
        {/* Top Navigation Bar */}
        <header className="up-header">
          <div className="up-brand">
            <div className="up-logo" aria-hidden="true">
              <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                />
              </svg>
            </div>
            <h2 className="up-brand-name">BiliQuant</h2>
          </div>

          <div className="up-header-right">
            <nav className="up-nav" aria-label="Primary">
              <a href="#" className="up-nav-link">
                Research
              </a>
              <a href="#" className="up-nav-link">
                Impact
              </a>
              <a href="#" className="up-nav-link">
                Devices
              </a>
              <a href="#" className="up-nav-link">
                Community
              </a>
            </nav>

            <div className="up-actions">
              <div
                className="up-avatar"
                role="img"
                aria-label="User avatar"
                style={{ backgroundImage: `url(${avatarUrl})` }}
              />
            </div>
          </div>
        </header>

        {/* Main Layout */}
        <main className="up-main">
          <div className="up-layout">
            {/* Sidebar Navigation */}
            <aside className="up-sidebar">
              <div className="up-sidebar-head">
                <div className="up-sidebar-icon" aria-hidden="true">
                  <span className="material-symbols-outlined">
                    account_circle
                  </span>
                </div>
                <div>
                  <h3 className="up-sidebar-title">Account</h3>
                  <p className="up-sidebar-subtitle">Personal Settings</p>
                </div>
              </div>

              <nav className="up-side-nav" aria-label="Settings">
                <a className="up-side-link active" href="#">
                  <span className="material-symbols-outlined">person</span>
                  <span>Profile Information</span>
                </a>
              </nav>
            </aside>

            {/* Settings Content Area */}
            <section className="up-card" aria-label="Profile settings">
              <div className="up-card-head">
                <h1 className="up-title">Profile Settings</h1>
                <p className="up-subtitle">
                  Keep your patient information up to date to ensure timely and
                  safe care.
                </p>
              </div>

              <div className="up-card-body">
                {/* Profile Photo Section */}
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

                {/* Form */}
                <form className="up-form" onSubmit={onSubmit}>
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
                        />
                      </div>

                      <p className="up-help">
                        Leave blank to keep current password.
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
                    >
                      Delete Account
                    </button>

                    <div className="up-footer-actions">
                      <button
                        type="button"
                        className="up-btn up-btn-outline"
                        onClick={onCancel}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="up-btn up-btn-primary">
                        <span className="material-symbols-outlined">
                          check_circle
                        </span>
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="up-footer">
          <div className="up-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Help Center</a>
          </div>
          <p className="up-footer-copy">
            © 2024 BiliQuant. Engineering Impact for Global Health.
          </p>
        </footer>
      </div>
    </div>
  );
}
