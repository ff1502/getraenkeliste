import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
      translation: {
        "welcome": "Welcome to the app",
        "drink_list": "Drink List",
        "balance": "Balance",
        "save": "Save",
        "login": "Login",
        "logout": "Logout",
        "register": "Register",
        "language": "Language",
        "statistics": "Statistics", // hinzugefügt
      }
    },
    de: {
      translation: {
        "welcome": "Willkommen in der App",
        "drink_list": "Getränkeliste",
        "balance": "Guthaben",
        "save": "Speichern",
        "login": "Einloggen",
        "logout": "Ausloggen",
        "register": "Registrieren",
        "language": "Sprache",
        "statistics": "Statistiken", // hinzugefügt
      }
    }
  };
  

i18n
  .use(LanguageDetector) // Automatische Erkennung der Sprache im Browser
  .use(initReactI18next) // bindet i18n an React ein
  .init({
    resources,
    fallbackLng: 'de', // Falls die Sprache nicht erkannt wird, wird Deutsch verwendet
    interpolation: {
      escapeValue: false, // React hat bereits XSS-Schutz
    }
  });

export default i18n;
