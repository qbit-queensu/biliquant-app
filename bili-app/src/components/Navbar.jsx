import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import logoImg from "../assets/vite.svg";

function Navbar() {
  return (
    <header className={styles.navbar}>
      <Link to="/home" className={styles.logo}>
        <img src={logoImg} alt="Logo" className={styles.logoImg} />
        <h2 className={styles.brandName}>BiliQuant</h2>
      </Link>

      <nav className={styles.navLinks}>
        <Link to="/home/about_qbit" className={styles.navLink}>
          About
        </Link>
        <Link to="/home/team" className={styles.navLink}>
          Team
        </Link>
        <Link to="/home/projects" className={styles.navLink}>
          Projects
        </Link>
        <Link to="/home/test_entry" className={styles.navLink}>
          Test Entry
        </Link>
        <Link to="/home/jaundice" className={styles.navLink}>
          Jaundice Guide
        </Link>
        <Link to="/home/mission" className={styles.navLink}>
          Mission
        </Link>
        <Link to="/home/contact" className={styles.navLink}>
          Contact
        </Link>
        <Link to="/home/patient_analytics" className={styles.navLink}>
          Patient Analytics
        </Link>
        <Link to="/home/profile" className={styles.navLink}>
          Profile
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
