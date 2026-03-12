import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { useLanguage } from "../context/LanguageContext";

function Home() {
  const { t } = useLanguage();

  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t("home.title")}</h1>
        <p className={styles.subtitle}>{t("home.subtitle")}</p>
        <div className={styles.links}>
          <Link to="/home/about_qbit" className={styles.link}>
            {t("home.learnAbout")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
