import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import blueLogo from "../assets/blueLogo.png";
import "./SignUp.css";
import { supabase } from "../lib/supabaseClient";

const SignUp = () => {
  const navigate = useNavigate();

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
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name, // stored in user metadata
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    // signup success
    navigate("/");
  };
  return (
    <div className="signup-page">
      {/* Top-left logo */}
      <div className="logo-container">
        <img
          src={blueLogo}
          alt="Logo"
          className="logo"
        />
        <span className="logo-text">BiliQuant</span>
      </div>

      {/* Signup card */}
      <div className="signup-card">
        <h1>Sign Up</h1>
        <p className="subtitle">Create an account</p>

        <form className="signup-form" onSubmit={handleSignUp}>
  <input
    type="text"
    placeholder="Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />

  <input
    type="email"
    placeholder="Email address"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />

  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />

  <input
    type="password"
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
  />

  {error && <p className="error-text">{error}</p>}

  <button type="submit" disabled={loading}>
    {loading ? "Creating account..." : "Sign Up"}
  </button>
</form>


  <p className="login-link">Already have an account? <span className="link" onClick={() => navigate("/")}>
    Log in
</span>

        </p>
      </div>
    </div>
  );
};

export default SignUp;
