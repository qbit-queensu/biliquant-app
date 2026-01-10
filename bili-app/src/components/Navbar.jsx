import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import logoImg from "../assets/vite.svg";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: "/home/about_qbit", label: "About" },
    { to: "/home/team", label: "Team" },
    { to: "/home/projects", label: "Projects" },
    { to: "/home/test_entry", label: "Test Entry" },
    { to: "/home/jaundice", label: "Jaundice Guide" },
    { to: "/home/mission", label: "Mission" },
    { to: "/home/contact", label: "Contact" },
    { to: "/home/patient_analytics", label: "Patient Analytics" },
    { to: "/home/profile", label: "Profile" },
  ];

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/home" className={styles.logo} aria-label="Go to home">
          <img src={logoImg} alt="" className={styles.logoImg} />
          <span className={styles.brandName}>BiliQuant</span>
        </Link>

        {/* Desktop links */}
        <nav className={styles.navLinks} aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={styles.hamburger}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
        </button>
      </div>

      {/* Mobile dropdown panel */}
      <div
        className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ""}`}
      >
        {/* Clickable backdrop */}
        <button
          className={styles.backdrop}
          aria-hidden={!open}
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        />

        <nav
          id="mobile-nav"
          className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ""}`}
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.mobileLink} ${isActive ? styles.mobileActive : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
