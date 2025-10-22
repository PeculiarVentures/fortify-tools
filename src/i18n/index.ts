import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enLocale from './locales/en/main.json';

export const supportedLngs = ['en'];

const resources = { en: { main: enLocale } };

i18n.use(initReactI18next).init({
  resources,
  load: 'languageOnly',
  fallbackLng: supportedLngs[0],
  ns: ['main'],
  supportedLngs: supportedLngs,
  debug: import.meta.env.MODE === 'development',
  interpolation: { escapeValue: false },
});

export default i18n;
