import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ICU from "i18next-icu";

import enLocale from "./locales/en/main.json";

export const supportedLngs = ["en"];

const resources = {
  en: {
    main: enLocale,
  },
};

i18n
  .use(ICU)
  .use(initReactI18next)
  .init({
    resources,
    load: "languageOnly",
    fallbackLng: supportedLngs[0],
    ns: ["main"],
    supportedLngs: supportedLngs,
    debug: import.meta.env.MODE === "development",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
