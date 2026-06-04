import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';

const resources = {
  en: { translation: translationEN },
  es: { translation: translationES }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    detection: {
      order: ['navigator', 'localStorage', 'htmlTag', 'cookie'],
      caches: ['localStorage', 'cookie'] 
    },
    fallbackLng: "es", 
    supportedLngs: ['es', 'en'], 
    load: 'languageOnly',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;