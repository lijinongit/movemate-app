import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import enLocale from './locales/en.json';
import arLocale from './locales/ar.json';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enLocale },
      ar: { translation: arLocale },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    debug: false,
  });

export default i18next;
