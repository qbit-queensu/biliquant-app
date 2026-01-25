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
                  <a className={styles.link} href="https://www.linkedin.com/company/qbitqueensu/">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a className={styles.link} href="https://www.instagram.com/Qbit_queensu">
                    Instagram
                  </a>
                </li>
                <li>
                  <a className={styles.link} href="https://www.facebook.com/engsocqbit">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.linkColumn}>
              <p className={styles.columnTitle}>Contact</p>
              <ul className={styles.linkList}>
                <li>
                  <a className={styles.link} href="mailto:qbit@engsoc.queensu.ca">
                    qbit@engsoc.queensu.ca
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.linkColumn}>
              <p className={styles.columnTitle}>Affiliations</p>
              <ul className={styles.linkList}>
                <li>
                  <a className={styles.link} href="https://www.queensu.ca/">
                    Queen's University
                  </a>
                </li>
                <li>
                  <a className={styles.subtitle}>
                    Kingston, ON, Canada
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
