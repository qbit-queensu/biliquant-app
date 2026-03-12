import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import blueLogo from "../assets/blueLogo.png";
import loginImage from "../assets/loginImage.JPG";
import "./LogIn.css";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../context/LanguageContext";

function LogIn() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (loginError) {
      setError(loginError.message);
      return;
    }

    if (data.user) {
      navigate("/home/dashboard");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="logo-row">
          <img src={blueLogo} className="logo" alt="BiliQuant logo" />
          <h1 className="logo-text">BiliQuant</h1>
        </div>

        <h2 className="welcome">{t("login.welcome")}</h2>
        <p className="subtitle">{t("login.subtitle")}</p>

        <form onSubmit={handleLogin}>
          <div className="input-label">{t("login.email")}</div>
          <div className="input-box">
            <input
              type="email"
              placeholder={t("login.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-label">{t("login.password")}</div>
          <div className="input-box">
            <input
              type="password"
              placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error ? <p className="error-text">{error}</p> : null}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? t("login.loading") : t("login.submit")}
          </button>
        </form>

        <p className="signup-text">
          {t("login.noAccount")} <span onClick={() => navigate("/signup")}>{t("login.signUp")}</span>
        </p>
      </div>

      <div className="login-right">
        <img src={loginImage} alt="Login visual" className="right-img" />
      </div>
    </div>
  );
}

export default LogIn;
