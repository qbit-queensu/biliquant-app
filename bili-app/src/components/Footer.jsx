import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div>
            <h3 className={styles.title}>QBiT</h3>
            <p className={styles.subtitle}>
              Queen's Biomedical Innovation Team
            </p>
          </div>
          <div className={styles.linksSection}>
            <div className={styles.linkColumn}>
              <p className={styles.columnTitle}>Explore</p>
              <ul className={styles.linkList}>
                <li>
                  <a className={styles.link} href="#">
                    About Us
                  </a>
                </li>
                <li>
                  <a className={styles.link} href="#">
                    Projects
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.linkColumn}>
              <p className={styles.columnTitle}>Contact</p>
              <ul className={styles.linkList}>
                <li>
                  <a className={styles.link} href="mailto:contact@qbit.ca">
                    contact@qbit.ca
                  </a>
                </li>
                <li>
                  <p className={styles.link}>Kingston, ON, Canada</p>
                </li>
              </ul>
            </div>
            <div className={styles.linkColumn}>
              <p className={styles.columnTitle}>Affiliations</p>
              <ul className={styles.linkList}>
                <li>
                  <a className={styles.link} href="#">
                    Queen's University
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          © 2025 Queen's Biomedical Innovation Team. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
