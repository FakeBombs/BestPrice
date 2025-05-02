
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          'header.logoAlt': 'Logo',
          'header.home': 'Home',
          'header.categories': 'Categories',
          'header.brands': 'Brands',
          'header.stores': 'Stores',
          'header.blog': 'Blog',
          'header.search': 'Search',
          'header.map': 'Map',
          'header.profile': 'Profile',
          'footer.copyright': '© 2025 All rights reserved.',
          'languages.el': 'Greek',
          'languages.en': 'English',
        }
      },
      el: {
        translation: {
          'header.logoAlt': 'Λογότυπο',
          'header.home': 'Αρχική',
          'header.categories': 'Κατηγορίες',
          'header.brands': 'Μάρκες',
          'header.stores': 'Καταστήματα',
          'header.blog': 'Ιστολόγιο',
          'header.search': 'Αναζήτηση',
          'header.map': 'Χάρτης',
          'header.profile': 'Προφίλ',
          'footer.copyright': '© 2025 Με επιφύλαξη παντός δικαιώματος.',
          'languages.el': 'Ελληνικά',
          'languages.en': 'Αγγλικά',
        }
      }
    },
    lng: 'el',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
