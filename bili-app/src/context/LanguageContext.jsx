import { createContext, useContext, useEffect, useMemo, useState } from "react";
import translations from "../i18n/translations";

const STORAGE_KEY = "biliquant-language";

const LanguageContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
  return storedLanguage === "fr" ? "fr" : "en";
}

function resolveValue(language, key) {
  return key.split(".").reduce((current, segment) => current?.[segment], translations[language]);
}

function interpolate(value, params) {
  if (typeof value !== "string" || !params) {
    return value;
  }

  return value.replace(/\{(\w+)\}/g, (_, token) => params[token] ?? `{${token}}`);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key, params) => interpolate(resolveValue(language, key) ?? key, params),
      getTranslation: (key) => resolveValue(language, key),
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider.");
  }

  return context;
}
