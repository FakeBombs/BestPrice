
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      header: {
        home: "Home",
        categories: "Categories",
        brands: "Brands",
        stores: "Stores",
        blog: "Blog",
        profile: "Profile",
        search: "Search",
        map: "Map",
        logoAlt: "Website Logo"
      },
      footer: {
        copyright: "© 2023 All rights reserved."
      },
      languages: {
        en: "English",
        el: "Greek"
      }
    }
  },
  el: {
    translation: {
      header: {
        home: "Αρχική",
        categories: "Κατηγορίες",
        brands: "Μάρκες",
        stores: "Καταστήματα",
        blog: "Ιστολόγιο",
        profile: "Προφίλ",
        search: "Αναζήτηση",
        map: "Χάρτης",
        logoAlt: "Λογότυπο Ιστοσελίδας"
      },
      footer: {
        copyright: "© 2023 Με επιφύλαξη παντός δικαιώματος."
      },
      languages: {
        en: "Αγγλικά",
        el: "Ελληνικά"
      }
    }
  }
};

// Initialize i18next instance
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
