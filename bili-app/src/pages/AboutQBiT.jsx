import styles from "./AboutQBiT.module.css";
import bilirubenImg from "../assets/bilirubenometer_cartoon.png";

function AboutQBiT() {
  return (
    <div className={styles.aboutPage}>
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div>
            <h1 className={styles.heroTitle}>About Us</h1>
            <p className={styles.heroSubtitle}>
              Fostering biomedical innovation through interdisciplinary
              collaboration at Queen's University. We believe in education
              through application.
            </p>
          </div>
        </section>

        {/* Hero Image */}
        <div
          className={styles.heroImage}
          style={{
            backgroundImage:
              'url("https://www.inside.unsw.edu.au/sites/default/files/article/ASB.jpg")',
          }}
          role="img"
          aria-label="A diverse group of students collaborating in a modern lab setting, focused on a biomedical device."
        />

        {/* Projects Section */}
        <section className={styles.projectsSection}>
          <div>
            <h2 className={styles.sectionTitle}>Our Innovative Projects</h2>
            <div className={styles.cardGrid}>
              <div className={styles.projectCard}>
                <div
                  className={styles.projectImage}
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBUjFmEaLWWOmUmxj_dZLmjKsMcW7hi2_WXiD9iqozZjIj6fQ_rRPZwt-_4uagk2sYLJJNNn6kxBcCcp_OYDsLa2hlrdDlW9fcJBdtu17aZ_1Km6mWZjFxv7M54u8-IHWyoQ2q788uFlOqmLTc2NvpC8wqeQYobUzfTG1o__iCD4tQSIM8ppHaaNvJxominVG1pBp1X3LrUgg6W8IyKY3CqcZjEYxqbSYm1MXVT9fDDZY6fOYIQNWGnWCvuMYH5RYaaJSCf1-L42GM")',
                  }}
                  role="img"
                  aria-label="A close-up of a handheld diagnostic device being used in a clinical setting."
                />
                <div className={styles.projectContent}>
                  <h3 className={styles.projectTitle}>IODETECT</h3>
                  <p className={styles.projectDescription}>
                    A novel device for early detection of iodine deficiency,
                    aiming to prevent cognitive impairments in developing
                    regions.
                  </p>
                  <a href="#" className={styles.projectLink}>
                    Learn More →
                  </a>
                </div>
              </div>
              <div className={styles.projectCard}>
                <div
                  className={styles.projectImage}
                  style={{
                    backgroundImage: `url(${bilirubenImg})`,
                  }}
                  role="img"
                  aria-label="A medical professional holding a small, portable bilirubinometer near a newborn's forehead."
                />
                <div className={styles.projectContent}>
                  <h3 className={styles.projectTitle}>BILIQUANT</h3>
                  <p className={styles.projectDescription}>
                    A low-cost, non-invasive bilirubinometer for under-resourced
                    settings to combat neonatal jaundice.
                  </p>
                  <a href="#" className={styles.projectLink}>
                    Learn More →
                  </a>
                </div>
              </div>
              <div className={styles.projectCard}>
                <div
                  className={styles.projectImage}
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_z95mDfv_LjmOLbq-xm99xCZpMruTeGjSJqGBT9gkh1CACaITKGRDw0dQmjq07gk-hVen8JJFlsPc6JWbZ_shIbmE0YmPKfbvol_T2yarmp2yy__hq5fsjz6HWLdGeN6-Uy3bwlpbD5hT1G-31t3cS6Cjzd8NEBkjgpb1dSMS3gQydf99CTzJvFuAbnA1rg66fjGWTRxWf6FPCEERMxZoz33HrYqNf_rfJdsOuj3TrOtiaX6fswptEStV3yFoFiyhguca8Csg6n4")',
                  }}
                  role="img"
                  aria-label="A person with limited mobility using a sleek, modern robotic arm to grasp a water bottle."
                />
                <div className={styles.projectContent}>
                  <h3 className={styles.projectTitle}>A.R.M.</h3>
                  <p className={styles.projectDescription}>
                    An assistive robotic arm for individuals with limited
                    mobility, enhancing independence and quality of life.
                  </p>
                  <a href="#" className={styles.projectLink}>
                    Learn More →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutQBiT;
