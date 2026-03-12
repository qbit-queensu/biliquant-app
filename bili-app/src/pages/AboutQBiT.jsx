import styles from "./AboutQBiT.module.css";
import bilirubenImg from "../assets/bilirubenometer_cartoon.png";
import { useLanguage } from "../context/LanguageContext";

function AboutQBiT() {
  const { t, getTranslation } = useLanguage();
  const projects = getTranslation("about.projects");

  return (
    <div className={styles.aboutPage}>
      <div className={styles.container}>
        <section className={styles.heroSection}>
          <div>
            <h1 className={styles.heroTitle}>{t("about.title")}</h1>
            <p className={styles.heroSubtitle}>{t("about.subtitle")}</p>
          </div>
        </section>

        <div
          className={styles.heroImage}
          style={{
            backgroundImage:
              'url("https://www.inside.unsw.edu.au/sites/default/files/article/ASB.jpg")',
          }}
          role="img"
          aria-label={t("about.heroImageAlt")}
        />

        <section className={styles.projectsSection}>
          <div>
            <h2 className={styles.sectionTitle}>{t("about.sectionTitle")}</h2>
            <div className={styles.cardGrid}>
              <div className={styles.projectCard}>
                <div
                  className={styles.projectImage}
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBUjFmEaLWWOmUmxj_dZLmjKsMcW7hi2_WXiD9iqozZjIj6fQ_rRPZwt-_4uagk2sYLJJNNn6kxBcCcp_OYDsLa2hlrdDlW9fcJBdtu17aZ_1Km6mWZjFxv7M54u8-IHWyoQ2q788uFlOqmLTc2NvpC8wqeQYobUzfTG1o__iCD4tQSIM8ppHaaNvJxominVG1pBp1X3LrUgg6W8IyKY3CqcZjEYxqbSYm1MXVT9fDDZY6fOYIQNWGnWCvuMYH5RYaaJSCf1-L42GM")',
                  }}
                  role="img"
                  aria-label={projects[0].imageAlt}
                />
                <div className={styles.projectContent}>
                  <h3 className={styles.projectTitle}>{projects[0].title}</h3>
                  <p className={styles.projectDescription}>{projects[0].description}</p>
                  <a href="#" className={styles.projectLink}>
                    {t("about.learnMore")}
                  </a>
                </div>
              </div>

              <div className={styles.projectCard}>
                <div
                  className={styles.projectImage}
                  style={{ backgroundImage: `url(${bilirubenImg})` }}
                  role="img"
                  aria-label={projects[1].imageAlt}
                />
                <div className={styles.projectContent}>
                  <h3 className={styles.projectTitle}>{projects[1].title}</h3>
                  <p className={styles.projectDescription}>{projects[1].description}</p>
                  <a href="#" className={styles.projectLink}>
                    {t("about.learnMore")}
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
                  aria-label={projects[2].imageAlt}
                />
                <div className={styles.projectContent}>
                  <h3 className={styles.projectTitle}>{projects[2].title}</h3>
                  <p className={styles.projectDescription}>{projects[2].description}</p>
                  <a href="#" className={styles.projectLink}>
                    {t("about.learnMore")}
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
