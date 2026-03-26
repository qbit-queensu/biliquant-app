import { useTranslation } from 'react-i18next';
import styles from './LanguageToggle.module.css';

function LanguageToggle() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language || 'en';

  return (
    <div className={styles.languageToggle}>
      <button
        className={`${styles.langButton} ${currentLanguage === 'en' ? styles.active : ''}`}
        onClick={() => changeLanguage('en')}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        className={`${styles.langButton} ${currentLanguage === 'fr' ? styles.active : ''}`}
        onClick={() => changeLanguage('fr')}
        aria-label="Switch to French"
      >
        FR
      </button>
    </div>
  );
}

export default LanguageToggle;
