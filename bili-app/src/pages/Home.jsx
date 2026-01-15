import { Link } from "react-router-dom";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to BiliQuant</h1>
        <p className={styles.subtitle}>Queen's Biomedical Innovation Team</p>
        <div className={styles.links}>
          <Link to="/home/about_qbit" className={styles.link}>
            Learn About QBiT →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
