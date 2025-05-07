// src/locales/index.ts
import en from './en';
import el from './el';
import es from './es';
import fr from './fr';
import de from './de';
// Import other languages as you add them

// Define the structure that LanguageContext expects
// (mapping language codes to their translation objects)
export type AllTranslations = {
  en: typeof en; // Or use your LanguageStrings type if defined
  el: typeof el;
  es: typeof es;
  fr: typeof fr;
  de: typeof de;
  // Add other language types here
};

const initialTranslations: AllTranslations = {
  en,
  el,
  es,
  fr,
  de,
  // Add other imported language objects here
};

export default initialTranslations;
