import enTranslations from './en';
import elTranslations from './el';
import esTranslations from './es';
import frTranslations from './fr';
import deTranslations from './de';
// Import other languages as you add them: e.g., import xxTranslations from './xx';

// Define a type for a single language's translation object
// This helps ensure all language files have the same keys.
// You should list ALL your translation keys here.
export type LanguageStrings = typeof enTranslations; // Assuming 'en' has all keys

// Define the structure for all translations that LanguageContext expects
export type AllTranslations = {
  en: LanguageStrings;
  el: LanguageStrings;
  es: LanguageStrings;
  fr: LanguageStrings;
  de: LanguageStrings;
  // Add other language codes here as keys, with LanguageStrings as their type
  // e.g., xx: LanguageStrings;
};

const initialDefaultTranslations: AllTranslations = {
  en: enTranslations,
  el: elTranslations,
  es: esTranslations,
  fr: frTranslations,
  de: deTranslations,
  // Add other imported language objects here: e.g., xx: xxTranslations,
};

export default initialDefaultTranslations;
