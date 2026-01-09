import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import logoImg from "../assets/vite.svg";

function Navbar() {
  return (
    <header className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <img src={logoImg} alt="Logo" className={styles.logoImg} />
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
        <Link to="/test_entry" className={styles.navLink}>
          Test Entry
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
        <Link to="/patient_analytics" className={styles.navLink}>
          Patient Analytics
        </Link>
        <Link to="/profile" className={styles.navLink}>
          Profile
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
