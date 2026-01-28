
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.ts';
import es from './locales/es.ts';

i18next
  .use(initReactI18next)
  .init({
    lng: 'es', // Set default language to Spanish
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
