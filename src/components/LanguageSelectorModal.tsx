// src/components/LanguageSelectorModal.tsx
import React, { useState, useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageContext } from '@/context/LanguageContext'; // Corrected path

// Define types for clarity
type LanguageOption = {
  code: string;
  name: string;
  englishName: string;
  regionKey: string;
  tooltipName?: string;
};

// Your new LANGUAGE_REGIONS_FOR_MODAL
const LANGUAGE_REGIONS_FOR_MODAL = [
  { key: "suggested", nameKey: "suggestedLanguages" },
  { key: "all", nameKey: "allLanguages" },
  { key: "languageCategoryAfricaMiddleEast", nameKey: "languageCategoryAfrica" },
  { key: "languageCategoryAmericas", nameKey: "languageCategoryAmericas" },
  { key: "languageCategoryAsiaPacific", nameKey: "languageCategoryAsia" },
  { key: "languageCategoryEasternEurope", nameKey: "languageCategoryEasternEurope" },
  { key: "languageCategoryWesternEurope", nameKey: "languageCategoryWesternEurope" },
];

// Your new, extensive ALL_AVAILABLE_LANGUAGES
const ALL_AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'el', name: 'Ελληνικά', englishName: 'Greek', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Ελληνικά' },
  { code: 'en-US', name: 'English (US)', englishName: 'English (US)', regionKey: 'languageCategoryAmericas', tooltipName: 'Αγγλικά (ΗΠΑ)' },
  { code: 'sq', name: 'Shqip', englishName: 'Albanian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Αλβανικά' },
  { code: 'es', name: 'Español', englishName: 'Spanish', regionKey: 'languageCategoryAmericas', tooltipName: 'Ισπανικά' },
  { code: 'so', name: 'Af-Soomaali', englishName: 'Somali', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Σομαλικά' },
  { code: 'af', name: 'Afrikaans', englishName: 'Afrikaans', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Αφρικάανς' },
  { code: 'az', name: 'Azərbaycan dili', englishName: 'Azerbaijani', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Αζερικά' },
  { code: 'id', name: 'Bahasa Indonesia', englishName: 'Indonesian', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Ινδονησιακά' },
  { code: 'ms', name: 'Bahasa Melayu', englishName: 'Malay', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Μαλαϊκά' },
  { code: 'jv', name: 'Basa Jawa', englishName: 'Javanese', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Ιαβικά' },
  { code: 'ceb', name: 'Bisaya', englishName: 'Cebuano', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Σεμπουάνο' },
  { code: 'bs', name: 'Bosanski', englishName: 'Bosnian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Βοσνιακά' },
  { code: 'br', name: 'Brezhoneg', englishName: 'Breton', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Βρετονικά' },
  { code: 'ca', name: 'Català', englishName: 'Catalan', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Καταλανικά' },
  { code: 'co', name: 'Corsu', englishName: 'Corsican', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Κορσικανικά' },
  { code: 'cy', name: 'Cymraeg', englishName: 'Welsh', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Ουαλικά' },
  { code: 'da', name: 'Dansk', englishName: 'Danish', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Δανέζικα' },
  { code: 'de', name: 'Deutsch', englishName: 'German', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Γερμανικά' },
  { code: 'et', name: 'Eesti', englishName: 'Estonian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Εσθονικά' },
  { code: 'en-GB', name: 'English (UK)', englishName: 'English (UK)', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Αγγλικά (ΗΒ)' },
  { code: 'es-ES', name: 'Español (España)', englishName: 'Spanish (Spain)', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Ισπανικά ( Ισπανία )' },
  { code: 'eu', name: 'Euskara', englishName: 'Basque', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Βασκικά' },
  { code: 'fil', name: 'Filipino', englishName: 'Filipino', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Φιλιππινέζικα' },
  { code: 'fr-CA', name: 'Français (Canada)', englishName: 'French (Canada)', regionKey: 'languageCategoryAmericas', tooltipName: 'Γαλλικά (Καναδά)' },
  { code: 'fr-FR', name: 'Français (France)', englishName: 'French (France)', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Γαλλικά (Γαλλία)' },
  { code: 'fy', name: 'Frysk', englishName: 'Western Frisian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Φρισικά' },
  { code: 'ff', name: 'Fula', englishName: 'Fulah', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Φουλάνι' },
  { code: 'fur', name: 'Furlan', englishName: 'Friulian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Φριουλιανικά' },
  { code: 'fo', name: 'Føroyskt', englishName: 'Faroese', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Φεροϊκά' },
  { code: 'ga', name: 'Gaeilge', englishName: 'Irish', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Ιρλανδικά' },
  { code: 'gl', name: 'Galego', englishName: 'Galician', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Γαλικιανά' },
  { code: 'gn', name: 'Guarani', englishName: 'Guarani', regionKey: 'languageCategoryAmericas', tooltipName: 'Γκουαρανί' },
  { code: 'ha', name: 'Hausa', englishName: 'Hausa', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Χάουσα' },
  { code: 'hr', name: 'Hrvatski', englishName: 'Croatian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Κροατικά' },
  { code: 'rw', name: 'Ikinyarwanda', englishName: 'Kinyarwanda', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Κινιαρουαντιανά' },
  { code: 'iu', name: 'Inuktitut', englishName: 'Inuktitut', regionKey: 'languageCategoryAmericas', tooltipName: 'Ινούκτιτουτ' },
  { code: 'it', name: 'Italiano', englishName: 'Italian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Ιταλικά' },
  { code: 'ik', name: 'Iñupiatun', englishName: 'Inupiaq', regionKey: 'languageCategoryAmericas', tooltipName: 'Ινούπιακ' },
  { code: 'sw', name: 'Kiswahili', englishName: 'Swahili', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Σουαχίλι' },
  { code: 'ht', name: 'Kreyòl Ayisyen', englishName: 'Haitian Creole', regionKey: 'languageCategoryAmericas', tooltipName: 'Κρεόλ Αϊτής' },
  { code: 'ku', name: 'Kurdî (Kurmancî)', englishName: 'Kurdish (Kurmanji)', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Βόρεια Κουρδικά (Κουρμάντζι)' },
  { code: 'lv', name: 'Latviešu', englishName: 'Latvian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Λετονικά' },
  { code: 'lt', name: 'Lietuvių', englishName: 'Lithuanian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Λιθουανικά' },
  { code: 'hu', name: 'Magyar', englishName: 'Hungarian', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Ουγγρικά' },
  { code: 'mg', name: 'Malagasy', englishName: 'Malagasy', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Μαλαγασικά' },
  { code: 'mt', name: 'Malti', englishName: 'Maltese', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Μαλτέζικα' },
  { code: 'nl', name: 'Nederlands', englishName: 'Dutch', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Ολλανδικά' },
  { code: 'nb', name: 'Norsk (bokmål)', englishName: 'Norwegian (Bokmål)', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Νορβηγικά (μποκμάλ)' },
  { code: 'nn', name: 'Norsk (nynorsk)', englishName: 'Norwegian (Nynorsk)', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Νορβηγικά (Nynorsk)' },
  { code: 'uz', name: 'O\'zbek', englishName: 'Uzbek', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Ουζμπεκικά' },
  { code: 'pl', name: 'Polski', englishName: 'Polish', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Πολωνικά' },
  { code: 'pt-BR', name: 'Português (Brasil)', englishName: 'Portuguese (Brazil)', regionKey: 'languageCategoryAmericas', tooltipName: 'Πορτογαλικά (Βραζιλίας)' },
  { code: 'pt-PT', name: 'Português (Portugal)', englishName: 'Portuguese (Portugal)', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Πορτογαλικά (Πορτογαλία)' },
  { code: 'ro', name: 'Română', englishName: 'Romanian', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Ρουμανικά' },
  { code: 'sc', name: 'Sardu', englishName: 'Sardinian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Σαρδηνικά' },
  { code: 'sn', name: 'Shona', englishName: 'Shona', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Σόνα' },
  { code: 'sk', name: 'Slovenčina', englishName: 'Slovak', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Σλοβακικά' },
  { code: 'sl', name: 'Slovenščina', englishName: 'Slovenian', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Σλοβενικά' },
  { code: 'fi', name: 'Suomi', englishName: 'Finnish', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Φινλανδικά' },
  { code: 'sv', name: 'Svenska', englishName: 'Swedish', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Σουηδικά' },
  { code: 'vi', name: 'Tiếng Việt', englishName: 'Vietnamese', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Βιετναμέζικα' },
  { code: 'tr', name: 'Türkçe', englishName: 'Turkish', regionKey: 'languageCategoryEurope', tooltipName: 'Türkçe' }, // Corrected regionKey for tr, can be Europe/Asia
  { code: 'nl-BE', name: 'Vlaams', englishName: 'Flemish (Dutch variant)', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Φλαμανδικά' },
  { code: 'zza', name: 'Zaza', englishName: 'Zaza', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Ζαζαϊκά' },
  { code: 'is', name: 'Íslenska', englishName: 'Icelandic', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Ισλανδικά' },
  { code: 'cs', name: 'Čeština', englishName: 'Czech', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Τσέχικα' },
  { code: 'szl', name: 'ślōnskŏ gŏdka', englishName: 'Silesian', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Σιλεσιανά' },
  { code: 'be', name: 'Беларуская', englishName: 'Belarusian', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Λευκορωσικά' },
  { code: 'bg', name: 'Български', englishName: 'Bulgarian', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Βουλγαρικά' },
  { code: 'mk', name: 'Македонски', englishName: 'Macedonian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Σλαβομακεδονικά' },
  { code: 'mn', name: 'Монгол', englishName: 'Mongolian', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Μογγολικά' },
  { code: 'ru', name: 'Русский', englishName: 'Russian', regionKey: 'languageCategoryEurope', tooltipName: 'Русский' }, // Corrected regionKey for ru
  { code: 'sr', name: 'Српски', englishName: 'Serbian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Σερβικά' },
  { code: 'tt', name: 'Татарча', englishName: 'Tatar', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Ταταρικά' },
  { code: 'tg', name: 'Тоҷикӣ', englishName: 'Tajik', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Τατζίκ' },
  { code: 'uk', name: 'Українська', englishName: 'Ukrainian', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Ουκρανικά' },
  { code: 'ky', name: 'кыргызча', englishName: 'Kyrgyz', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Κυργιζιανά' },
  { code: 'kk', name: 'Қазақша', englishName: 'Kazakh', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Καζακικά' },
  { code: 'hy', name: 'Հայերեն', englishName: 'Armenian', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Αρμένικα' },
  { code: 'he', name: 'עברית', englishName: 'Hebrew', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Εβραϊκά' },
  { code: 'ur', name: 'اردو', englishName: 'Urdu', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Ουρντού' },
  { code: 'ar', name: 'العربية', englishName: 'Arabic', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Αραβικά' },
  { code: 'fa', name: 'فارسی', englishName: 'Persian', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Περσικά' },
  { code: 'ps', name: 'پښتو', englishName: 'Pashto', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Πάστο' },
  { code: 'ckb', name: 'کوردیی ناوەندی', englishName: 'Kurdish (Sorani)', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Κουρδικά Σοράνι' },
  { code: 'syr', name: 'ܣܘܪܝܝܐ', englishName: 'Syriac', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Συριακά' },
  { code: 'ne', name: 'नेपाली', englishName: 'Nepali', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Νεπαλέζικα' },
  { code: 'mr', name: 'मराठी', englishName: 'Marathi', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Μαράθι' },
  { code: 'hi', name: 'हिंदी', englishName: 'Hindi', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Χίντι' },
  { code: 'as', name: 'অসমীয়া', englishName: 'Assamese', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Ασαμικά' },
  { code: 'bn', name: 'বাংলা', englishName: 'Bengali', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Μπενγκάλι' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Παντζάμπι' },
  { code: 'gu', name: 'ગુજરાતી', englishName: 'Gujarati', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Γκουτζαράτι' },
  { code: 'or', name: 'ଓଡ଼ିଆ', englishName: 'Odia', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Οριγικά' },
  { code: 'ta', name: 'தமிழ்', englishName: 'Tamil', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Ταμίλ' },
  { code: 'te', name: 'తెలుగు', englishName: 'Telugu', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Τελούγκου' },
  { code: 'kn', name: 'ಕನ್ನಡ', englishName: 'Kannada', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Κανάντα' },
  { code: 'ml', name: 'മലയാളം', englishName: 'Malayalam', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Μαλαγιαλαμικά' },
  { code: 'si', name: 'සිංහල', englishName: 'Sinhala', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Σινχάλα' },
  { code: 'th', name: 'ภาษาไทย', englishName: 'Thai', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Ταϊλανδέζικα' },
  { code: 'lo', name: 'ພາສາລາວ', englishName: 'Lao', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Λάος' },
  { code: 'my', name: 'မြန်မာဘာသာ', englishName: 'Burmese', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Βιρμανικά' },
  { code: 'ka', name: 'ქართული', englishName: 'Georgian', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Γεωργιανά' },
  { code: 'am', name: 'አማርኛ', englishName: 'Amharic', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Αμχαρικά' },
  { code: 'km', name: 'ភាសាខ្មែរ', englishName: 'Khmer', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Χμερ' },
  { code: 'ber', name: 'ⵜⴰⵎⴰⵣⵉⵖⵜ', englishName: 'Tamazight', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Ταμαζίγκχτ' },
  { code: 'zh-TW', name: '中文(台灣)', englishName: 'Chinese (Taiwan)', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Παραδοσιακά Κινέζικα (Ταϊβάν)' },
  { code: 'zh-CN', name: '中文(简体)', englishName: 'Chinese (Simplified)', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Απλοποιημένα Κινέζικα (Κίνα)' },
  { code: 'zh-HK', name: '中文(香港)', englishName: 'Chinese (Hong Kong)', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Παραδοσιακά Κινέζικα (Χονγκ Κονγκ)' },
  { code: 'ja', name: '日本語', englishName: 'Japanese', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Ιαπωνικά' },
  { code: 'ja-KS', name: '日本語(関西)', englishName: 'Japanese (Kansai)', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Ιαπωνικά (Κανσάι)' },
  { code: 'ko', name: '한국어', englishName: 'Korean', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Κορεατικά' },
];

const VALID_CONTEXT_LANGUAGES: Array<'en' | 'el' | 'es' | 'fr' | 'de'> = ['en', 'el', 'es', 'fr', 'de'];

// Helper function (can be outside component if it doesn't need component scope)
const mapLanguageCodeToContextType = (fullCode: string): 'en' | 'el' | 'es' | 'fr' | 'de' => {
  const baseCode = fullCode.split('-')[0].toLowerCase();
  if (VALID_CONTEXT_LANGUAGES.includes(baseCode as any)) {
    return baseCode as 'en' | 'el' | 'es' | 'fr' | 'de';
  }
  console.warn(`mapLanguageCodeToContextType received an unmappable code: ${fullCode}, defaulting to 'en'.`);
  return 'en'; // Your application's primary default
};


interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { t, language: currentContextLangFromHook, isLoaded } = useTranslation();
  const { setLanguage: setContextLanguage } = useLanguageContext(); // This setLanguage is from LanguageContext
  const [selectedRegion, setSelectedRegion] = useState<string>("suggested");

  // Fallback for sorting locale if context isn't loaded yet or language is somehow unexpected
  const currentContextLangForSort = isLoaded && VALID_CONTEXT_LANGUAGES.includes(currentContextLangFromHook)
    ? currentContextLangFromHook
    : 'en';

  if (!isOpen) return null;

  // Event handler for language selection.
  // No useCallback needed here as per your working version's pattern.
  // It will be recreated on each render, which is fine for this component's complexity.
  // If performance issues arose, then `useCallback` with correct dependencies would be the next step.
  const handleLanguageSelect = (langCode: string) => {
    const mappedCode = mapLanguageCodeToContextType(langCode);
    setContextLanguage(mappedCode); // Call the function from LanguageContext
    onClose();
  };

  const suggestedLangsToDisplay = useMemo(() => {
    const suggestedCodes = ['el', 'en-US', 'es-ES', 'fr-FR', 'de', 'sq'];
    return ALL_AVAILABLE_LANGUAGES.filter(lang =>
      suggestedCodes.includes(lang.code)
    );
  }, []); // ALL_AVAILABLE_LANGUAGES is stable

  const languagesToDisplay = useMemo(() => {
    let filteredLangs: LanguageOption[];

    if (selectedRegion === "suggested") {
      filteredLangs = suggestedLangsToDisplay;
    } else if (selectedRegion === "all") {
      filteredLangs = ALL_AVAILABLE_LANGUAGES;
    } else {
      filteredLangs = ALL_AVAILABLE_LANGUAGES.filter(lang =>
        lang.regionKey === selectedRegion
      );
    }

    // Ensure names are strings before sorting to prevent errors with undefined/null names
    return [...filteredLangs].sort((a, b) =>
      (a.name || '').localeCompare(b.name || '', currentContextLangForSort)
    );
  }, [selectedRegion, suggestedLangsToDisplay, currentContextLangForSort]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[2147483647] p-4" onClick={onClose}>
      <div
        className="bg-background p-0 rounded-lg shadow-xl w-full max-w-2xl h-[80vh] max-h-[600px] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b pb-3 border-border">
          <div className="flex-1"></div> {/* Spacer */}
          <h2 className="text-xl font-semibold text-center flex-grow">
            {t('selectYourLanguageTitle', 'Select Your Language')}
          </h2>
          <div className="flex-1 flex justify-end"> {/* Container for close button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground"
              aria-label={t('close', 'Close')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-1/3 border-r border-border overflow-y-auto bg-muted/20 p-1">
            <ul className="space-y-1">
              {LANGUAGE_REGIONS_FOR_MODAL.map(region => (
                <li key={region.key}>
                  <button
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedRegion === region.key ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-foreground font-normal'}`}
                    onClick={() => setSelectedRegion(region.key)}
                  >
                    {t(region.nameKey, region.key === "suggested" ? t('suggestedLanguages', "Suggested") : (region.nameKey.replace('languageCategory', '').charAt(0).toUpperCase() + region.nameKey.replace('languageCategory', '').slice(1) || "Region"))}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <main className="w-2/3 overflow-y-auto p-4">
            <ul className="space-y-1">
              {languagesToDisplay.map((lang) => {
                const mappedCode = mapLanguageCodeToContextType(lang.code);
                const isActive = currentContextLangFromHook === mappedCode;

                return (
                  <li key={lang.code}>
                    <button
                      className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-md text-sm border ${isActive ? 'border-primary bg-primary/10 font-semibold text-primary' : 'hover:bg-muted border-transparent text-foreground'}`}
                      onClick={() => handleLanguageSelect(lang.code)}
                    >
                      <span>{lang.name}</span>
                      {isActive && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      )}
                    </button>
                  </li>
                );
              })}
              {languagesToDisplay.length === 0 && !["suggested", "all"].includes(selectedRegion) && (
                <li className="px-3 py-2 text-sm text-muted-foreground">{t('noLanguagesInRegion', 'No languages listed for this region yet.')}</li>
              )}
            </ul>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectorModal;
