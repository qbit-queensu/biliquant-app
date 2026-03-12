import styles from "./Footer.module.css";
import { useLanguage } from "../context/LanguageContext";

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div>
            <h3 className={styles.title}>QBiT</h3>
            <p className={styles.subtitle}>{t("footer.subtitle")}</p>
          </div>
          <div className={styles.linksSection}>
            <div className={styles.linkColumn}>
              <p className={styles.columnTitle}>{t("footer.explore")}</p>
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
              <p className={styles.columnTitle}>{t("footer.contact")}</p>
              <ul className={styles.linkList}>
                <li>
                  <a className={styles.link} href="mailto:qbit@engsoc.queensu.ca">
                    qbit@engsoc.queensu.ca
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.linkColumn}>
              <p className={styles.columnTitle}>{t("footer.affiliations")}</p>
              <ul className={styles.linkList}>
                <li>
                  <a className={styles.link} href="https://www.queensu.ca/">
                    Queen's University
                  </a>
                </li>
                <li>
                  <a className={styles.subtitle}>{t("footer.location")}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.copyright}>{t("footer.copyright")}</div>
      </div>
    </footer>
  );
}

export default Footer;
