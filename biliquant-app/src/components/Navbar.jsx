import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <header className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </div>
        <h2 className={styles.brandName}>BiliQuant</h2>
      </Link>

      <nav className={styles.navLinks}>
        <Link to="/about_qbit" className={styles.navLink}>
          About
        </Link>
        <Link to="/team" className={styles.navLink}>
          Team
        </Link>
        <Link to="/projects" className={styles.navLink}>
          Projects
        </Link>
        <Link to="/jaundice" className={styles.navLink}>
          Jaundice Guide
        </Link>
        <Link to="/mission" className={styles.navLink}>
          Mission
        </Link>
        <Link to="/contact" className={styles.navLink}>
          Contact
        </Link>
      </nav>

      <button className={styles.ctaButton}>
        <span>Get Involved</span>
      </button>
    </header>
  );
}

export default Navbar;
