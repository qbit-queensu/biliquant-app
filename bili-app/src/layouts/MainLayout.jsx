import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./MainLayout.module.css";
import { useLanguage } from "../context/LanguageContext";

function MainLayout() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <button
        className={styles.dashboardButton}
        onClick={() => navigate("/home/dashboard")}
        title={t("nav.dashboard")}
      >
        <span className="material-symbols-outlined">home</span>
      </button>
      <Footer />
    </div>
  );
}

export default MainLayout;
