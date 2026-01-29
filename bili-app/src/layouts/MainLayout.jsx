import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./MainLayout.module.css";

function MainLayout() {
  const navigate = useNavigate();

  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <button
        className={styles.dashboardButton}
        onClick={() => navigate("/home/dashboard")}
        title="Go to Dashboard"
      >
        <span className="material-symbols-outlined">home</span>
      </button>
      <Footer />
    </div>
  );
}

export default MainLayout;
