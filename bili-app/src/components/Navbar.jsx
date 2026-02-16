import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import logoImg from "../assets/vite.svg";
import { supabase } from "../lib/supabaseClient";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    // Navigate immediately for faster UX
    navigate("/");
    // Sign out in background
    supabase.auth.signOut();
  };

  const navItems = [
    { to: "/home/patient_analytics", label: "Patient Analytics" },
    { to: "/home/jaundice", label: "Jaundice Guide" },
    { to: "/home/update-profile", label: "Profile" },
  ];

  const dropdownItems = [
    { to: "/home/mission", label: "Mission" },
    { to: "/home/about_qbit", label: "About Us" },
    { to: "/home/contact", label: "Contact" },
  ];

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/home/dashboard" className={styles.logo} aria-label="Go to dashboard">
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
          
          {/* Dropdown for Company */}
          <div 
            className={styles.dropdown}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              className={`${styles.navLink} ${styles.dropdownToggle} ${
                dropdownItems.some(item => location.pathname === item.to) ? styles.active : ""
              }`}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              QBiT
              <svg 
                className={`${styles.dropdownIcon} ${dropdownOpen ? styles.dropdownIconOpen : ""}`}
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none"
              >
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                {dropdownItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `${styles.dropdownItem} ${isActive ? styles.dropdownItemActive : ""}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          
          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            className={`${styles.navLink} ${styles.logoutBtn}`}
          >
            Logout
          </button>
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
          className={`${styles.mobilePanel} ${
            open ? styles.mobilePanelOpen : ""
          }`}
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
          
          {/* Mobile dropdown */}
          <div className={styles.mobileDropdown}>
            <button
              type="button"
              className={`${styles.mobileLink} ${styles.mobileDropdownToggle} ${
                dropdownItems.some(item => location.pathname === item.to) ? styles.mobileActive : ""
              }`}
              onClick={() => setDropdownOpen(v => !v)}
              aria-expanded={dropdownOpen}
            >
              Company
              <svg 
                className={`${styles.dropdownIcon} ${dropdownOpen ? styles.dropdownIconOpen : ""}`}
                width="16" 
                height="16" 
                viewBox="0 0 12 12" 
                fill="none"
              >
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            
            {dropdownOpen && (
              <div className={styles.mobileDropdownMenu}>
                {dropdownItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `${styles.mobileDropdownItem} ${isActive ? styles.mobileActive : ""}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          
          {/* Mobile Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            className={`${styles.mobileLink} ${styles.logoutBtn}`}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
