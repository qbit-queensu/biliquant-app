import React from "react";
import blueLogo from "../assets/blueLogo.png";
import "./SignUp.css";

const SignUp = () => {
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

        <form className="signup-form">
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email address" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />

          <button type="submit">Sign Up</button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
