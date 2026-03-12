import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import blueLogo from "../assets/blueLogo.png";
import "./SignUp.css";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../context/LanguageContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("signup.passwordMismatch"));
      return;
    }

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    navigate("/");
  };

  return (
    <div className="signup-page">
      <div className="logo-container">
        <img src={blueLogo} alt="Logo" className="logo" />
        <span className="logo-text">BiliQuant</span>
      </div>

      <div className="signup-card">
        <h1>{t("signup.title")}</h1>
        <p className="subtitle">{t("signup.subtitle")}</p>

        <form className="signup-form" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder={t("signup.namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder={t("signup.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder={t("signup.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder={t("signup.confirmPasswordPlaceholder")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? t("signup.loading") : t("signup.submit")}
          </button>
        </form>

        <p className="login-link">
          {t("signup.hasAccount")}{" "}
          <span className="link" onClick={() => navigate("/")}>
            {t("signup.login")}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
