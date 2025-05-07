// src/components/LanguageSelectorModal.tsx
// ADAPTING STYLING STRUCTURE FROM THE "Νέα Συλλογή" MODAL

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageContext } from '@/context/LanguageContext';

// --- (Keep your LanguageOption type, LANGUAGE_REGIONS_FOR_MODAL, ALL_AVAILABLE_LANGUAGES, VALID_CONTEXT_LANGUAGES, DEFAULT_VARIANT_FOR_CONTEXT_LANG, mapLanguageCode as before) ---
type LanguageOption = {
  code: string;
  name: string;
  englishName: string;
  regionKey: string;
};

const LANGUAGE_REGIONS_FOR_MODAL = [
  { key: "all", nameKey: "allLanguages" },
  { key: "languageCategoryAfricaMiddleEast", nameKey: "languageCategoryAfrica" },
  { key: "languageCategoryAmericas", nameKey: "languageCategoryAmericas" },
  { key: "languageCategoryAsiaPacific", nameKey: "languageCategoryAsia" },
  { key: "languageCategoryEasternEurope", nameKey: "languageCategoryEasternEurope" },
  { key: "languageCategoryWesternEurope", nameKey: "languageCategoryWesternEurope" },
];

const ALL_AVAILABLE_LANGUAGES: LanguageOption[] = [
  // ... (Your full list as provided previously)
  { code: 'el', name: 'Ελληνικά', englishName: 'Greek', regionKey: 'languageCategoryWesternEurope' },
  { code: 'en-US', name: 'English (US)', englishName: 'English (US)', regionKey: 'languageCategoryAmericas' },
  { code: 'sq', name: 'Shqip', englishName: 'Albanian', regionKey: 'languageCategoryWesternEurope' },
  { code: 'es', name: 'Español', englishName: 'Spanish', regionKey: 'languageCategoryAmericas' },
  { code: 'de', name: 'Deutsch', englishName: 'German', regionKey: 'languageCategoryWesternEurope' },
  { code: 'fr-FR', name: 'Français (France)', englishName: 'French (France)', regionKey: 'languageCategoryWesternEurope' },
  { code: 'es-ES', name: 'Español (España)', englishName: 'Spanish (Spain)', regionKey: 'languageCategoryWesternEurope' },
  { code: 'so', name: 'Af-Soomaali', englishName: 'Somali', regionKey: 'languageCategoryAfricaMiddleEast' },
  { code: 'af', name: 'Afrikaans', englishName: 'Afrikaans', regionKey: 'languageCategoryAfricaMiddleEast' },
  { code: 'az', name: 'Azərbaycan dili', englishName: 'Azerbaijani', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'id', name: 'Bahasa Indonesia', englishName: 'Indonesian', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'ms', name: 'Bahasa Melayu', englishName: 'Malay', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'jv', name: 'Basa Jawa', englishName: 'Javanese', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'ceb', name: 'Bisaya', englishName: 'Cebuano', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'bs', name: 'Bosanski', englishName: 'Bosnian', regionKey: 'languageCategoryWesternEurope' },
  { code: 'br', name: 'Brezhoneg', englishName: 'Breton', regionKey: 'languageCategoryWesternEurope' },
  { code: 'ca', name: 'Català', englishName: 'Catalan', regionKey: 'languageCategoryWesternEurope' },
  { code: 'co', name: 'Corsu', englishName: 'Corsican', regionKey: 'languageCategoryWesternEurope' },
  { code: 'cy', name: 'Cymraeg', englishName: 'Welsh', regionKey: 'languageCategoryWesternEurope' },
  { code: 'da', name: 'Dansk', englishName: 'Danish', regionKey: 'languageCategoryWesternEurope' },
  { code: 'et', name: 'Eesti', englishName: 'Estonian', regionKey: 'languageCategoryWesternEurope' },
  { code: 'en-GB', name: 'English (UK)', englishName: 'English (UK)', regionKey: 'languageCategoryWesternEurope' },
  { code: 'eu', name: 'Euskara', englishName: 'Basque', regionKey: 'languageCategoryWesternEurope' },
  { code: 'fil', name: 'Filipino', englishName: 'Filipino', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'fr-CA', name: 'Français (Canada)', englishName: 'French (Canada)', regionKey: 'languageCategoryAmericas' },
  { code: 'fy', name: 'Frysk', englishName: 'Western Frisian', regionKey: 'languageCategoryWesternEurope' },
  { code: 'ff', name: 'Fula', englishName: 'Fulah', regionKey: 'languageCategoryAfricaMiddleEast' },
  { code: 'fur', name: 'Furlan', englishName: 'Friulian', regionKey: 'languageCategoryWesternEurope' },
  { code: 'fo', name: 'Føroyskt', englishName: 'Faroese', regionKey: 'languageCategoryWesternEurope' },
  { code: 'ga', name: 'Gaeilge', englishName: 'Irish', regionKey: 'languageCategoryWesternEurope' },
  { code: 'gl', name: 'Galego', englishName: 'Galician', regionKey: 'languageCategoryWesternEurope' },
  { code: 'gn', name: 'Guarani', englishName: 'Guarani', regionKey: 'languageCategoryAmericas' },
  { code: 'ha', name: 'Hausa', englishName: 'Hausa', regionKey: 'languageCategoryAfricaMiddleEast' },
  { code: 'hr', name: 'Hrvatski', englishName: 'Croatian', regionKey: 'languageCategoryWesternEurope' },
  { code: 'rw', name: 'Ikinyarwanda', englishName: 'Kinyarwanda', regionKey: 'languageCategoryAfricaMiddleEast' },
  { code: 'iu', name: 'Inuktitut', englishName: 'Inuktitut', regionKey: 'languageCategoryAmericas' },
  { code: 'it', name: 'Italiano', englishName: 'Italian', regionKey: 'languageCategoryWesternEurope' },
  { code: 'ik', name: 'Iñupiatun', englishName: 'Inupiaq', regionKey: 'languageCategoryAmericas' },
  { code: 'sw', name: 'Kiswahili', englishName: 'Swahili', regionKey: 'languageCategoryAfricaMiddleEast' },
  { code: 'ht', name: 'Kreyòl Ayisyen', englishName: 'Haitian Creole', regionKey: 'languageCategoryAmericas' },
  { code: 'ku', name: 'Kurdî (Kurmancî)', englishName: 'Kurdish (Kurmanji)', regionKey: 'languageCategoryAfricaMiddleEast' },
  { code: 'lv', name: 'Latviešu', englishName: 'Latvian', regionKey: 'languageCategoryWesternEurope' },
  { code: 'lt', name: 'Lietuvių', englishName: 'Lithuanian', regionKey: 'languageCategoryWesternEurope' },
  { code: 'hu', name: 'Magyar', englishName: 'Hungarian', regionKey: 'languageCategoryEasternEurope' },
  { code: 'mg', name: 'Malagasy', englishName: 'Malagasy', regionKey: 'languageCategoryAfricaMiddleEast' },
  { code: 'mt', name: 'Malti', englishName: 'Maltese', regionKey: 'languageCategoryWesternEurope' },
  { code: 'nl', name: 'Nederlands', englishName: 'Dutch', regionKey: 'languageCategoryWesternEurope' },
  { code: 'nb', name: 'Norsk (bokmål)', englishName: 'Norwegian (Bokmål)', regionKey: 'languageCategoryWesternEurope' },
  { code: 'nn', name: 'Norsk (nynorsk)', englishName: 'Norwegian (Nynorsk)', regionKey: 'languageCategoryWesternEurope' },
  { code: 'uz', name: 'O\'zbek', englishName: 'Uzbek', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'pl', name: 'Polski', englishName: 'Polish', regionKey: 'languageCategoryEasternEurope' },
  { code: 'pt-BR', name: 'Português (Brasil)', englishName: 'Portuguese (Brazil)', regionKey: 'languageCategoryAmericas' },
  { code: 'pt-PT', name: 'Português (Portugal)', englishName: 'Portuguese (Portugal)', regionKey: 'languageCategoryWesternEurope' },
  { code: 'ro', name: 'Română', englishName: 'Romanian', regionKey: 'languageCategoryEasternEurope' },
  { code: 'sc', name: 'Sardu', englishName: 'Sardinian', regionKey: 'languageCategoryWesternEurope' },
  { code: 'sn', name: 'Shona', englishName: 'Shona', regionKey: 'languageCategoryAfricaMiddleEast' },
  { code: 'sk', name: 'Slovenčina', englishName: 'Slovak', regionKey: 'languageCategoryEasternEurope' },
  { code: 'sl', name: 'Slovenščina', englishName: 'Slovenian', regionKey: 'languageCategoryEasternEurope' },
  { code: 'fi', name: 'Suomi', englishName: 'Finnish', regionKey: 'languageCategoryWesternEurope' },
  { code: 'sv', name: 'Svenska', englishName: 'Swedish', regionKey: 'languageCategoryWesternEurope' },
  { code: 'vi', name: 'Tiếng Việt', englishName: 'Vietnamese', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'tr', name: 'Türkçe', englishName: 'Turkish', regionKey: 'languageCategoryWesternEurope' },
  { code: 'nl-BE', name: 'Vlaams', englishName: 'Flemish (Dutch variant)', regionKey: 'languageCategoryWesternEurope' },
  { code: 'zza', name: 'Zaza', englishName: 'Zaza', regionKey: 'languageCategoryAfricaMiddleEast' },
  { code: 'is', name: 'Íslenska', englishName: 'Icelandic', regionKey: 'languageCategoryWesternEurope' },
  { code: 'cs', name: 'Čeština', englishName: 'Czech', regionKey: 'languageCategoryEasternEurope' },
  { code: 'szl', name: 'ślōnskŏ gŏdka', englishName: 'Silesian', regionKey: 'languageCategoryEasternEurope' },
  { code: 'be', name: 'Беларуская', englishName: 'Belarusian', regionKey: 'languageCategoryEasternEurope' },
  { code: 'bg', name: 'Български', englishName: 'Bulgarian', regionKey: 'languageCategoryEasternEurope' },
  { code: 'mk', name: 'Македонски', englishName: 'Macedonian', regionKey: 'languageCategoryEasternEurope' },
  { code: 'mn', name: 'Монгол', englishName: 'Mongolian', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'ru', name: 'Русский', englishName: 'Russian', regionKey: 'languageCategoryEasternEurope' },
  { code: 'sr', name: 'Српски', englishName: 'Serbian', regionKey: 'languageCategoryEasternEurope' },
  { code: 'tt', name: 'Татарча', englishName: 'Tatar', regionKey: 'languageCategoryEasternEurope' },
  { code: 'tg', name: 'Тоҷикӣ', englishName: 'Tajik', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'uk', name: 'Українська', englishName: 'Ukrainian', regionKey: 'languageCategoryEasternEurope' },
  { code: 'ky', name: 'кыргызча', englishName: 'Kyrgyz', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'kk', name: 'Қазақша', englishName: 'Kazakh', regionKey: 'languageCategoryEasternEurope' },
  { code: 'hy', name: 'Հայերեն', englishName: 'Armenian', regionKey: 'languageCategoryEasternEurope' },
  { code: 'he', name: 'עברית', englishName: 'Hebrew', regionKey: 'languageCategoryAfricaMiddleEast' },
  { code: 'ur', name: 'اردو', englishName: 'Urdu', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'ar', name: 'العربية', englishName: 'Arabic', regionKey: 'languageCategoryAfricaMiddleEast' },
  { code: 'fa', name: 'فارسی', englishName: 'Persian', regionKey: 'languageCategoryAfricaMiddleEast' },
  { code: 'ps', name: 'پښتو', englishName: 'Pashto', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'ckb', name: 'کوردیی ناوەندی', englishName: 'Kurdish (Sorani)', regionKey: 'languageCategoryAfricaMiddleEast' },
  { code: 'syr', name: 'ܣܘܪܝܝܐ', englishName: 'Syriac', regionKey: 'languageCategoryAfricaMiddleEast' },
  { code: 'ne', name: 'नेपाली', englishName: 'Nepali', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'mr', name: 'मराठी', englishName: 'Marathi', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'hi', name: 'हिंदी', englishName: 'Hindi', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'as', name: 'অসমীয়া', englishName: 'Assamese', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'bn', name: 'বাংলা', englishName: 'Bengali', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'gu', name: 'ગુજરાતી', englishName: 'Gujarati', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'or', name: 'ଓଡ଼ିଆ', englishName: 'Odia', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'ta', name: 'தமிழ்', englishName: 'Tamil', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'te', name: 'తెలుగు', englishName: 'Telugu', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'kn', name: 'ಕನ್ನಡ', englishName: 'Kannada', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'ml', name: 'മലയാളം', englishName: 'Malayalam', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'si', name: 'සිංහල', englishName: 'Sinhala', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'th', name: 'ภาษาไทย', englishName: 'Thai', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'lo', name: 'ພາສາລາວ', englishName: 'Lao', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'my', name: 'မြန်မာဘာသာ', englishName: 'Burmese', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'ka', name: 'ქართული', englishName: 'Georgian', regionKey: 'languageCategoryEasternEurope' },
  { code: 'am', name: 'አማርኛ', englishName: 'Amharic', regionKey: 'languageCategoryAfricaMiddleEast' },
  { code: 'km', name: 'ភាសាខ្មែរ', englishName: 'Khmer', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'ber', name: 'ⵜⴰⵎⴰⵣⵉⵖⵜ', englishName: 'Tamazight', regionKey: 'languageCategoryAfricaMiddleEast' },
  { code: 'zh-TW', name: '中文(台灣)', englishName: 'Chinese (Taiwan)', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'zh-CN', name: '中文(简体)', englishName: 'Chinese (Simplified)', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'zh-HK', name: '中文(香港)', englishName: 'Chinese (Hong Kong)', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'ja', name: '日本語', englishName: 'Japanese', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'ja-KS', name: '日本語(関西)', englishName: 'Japanese (Kansai)', regionKey: 'languageCategoryAsiaPacific' },
  { code: 'ko', name: '한국어', englishName: 'Korean', regionKey: 'languageCategoryAsiaPacific' },
];

const VALID_CONTEXT_LANGUAGES: Array<'en' | 'el' | 'es' | 'fr' | 'de'> = ['en', 'el', 'es', 'fr', 'de'];

const DEFAULT_VARIANT_FOR_CONTEXT_LANG: { [key in 'en' | 'el' | 'es' | 'fr' | 'de']: string } = {
  'el': 'el',
  'en': 'en-US',
  'es': 'es-ES',
  'fr': 'fr-FR',
  'de': 'de',
};

const mapLanguageCode = (fullCode: string): 'en' | 'el' | 'es' | 'fr' | 'de' => {
  const baseCode = fullCode.split('-')[0].toLowerCase();
  if (VALID_CONTEXT_LANGUAGES.includes(baseCode as any)) {
    return baseCode as 'en' | 'el' | 'es' | 'fr' | 'de';
  }
  console.warn(`mapLanguageCode received an unmappable code: ${fullCode}, defaulting to 'en'.`);
  return 'en';
};

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { t, language: currentContextLangFromHook, isLoaded } = useTranslation();
  const { setLanguage: setContextLanguage } = useLanguageContext();
  const [selectedRegionKey, setSelectedRegionKey] = useState<string>("all");

  const handleLanguageSelect = (langCode: string) => {
    const mappedCode = mapLanguageCode(langCode);
    setContextLanguage(mappedCode);
    onClose();
  };

  if (!isOpen) return null;

  const currentContextLangForSort = isLoaded ? currentContextLangFromHook : 'en';

  const activeSpecificLangCode = isLoaded
    ? DEFAULT_VARIANT_FOR_CONTEXT_LANG[currentContextLangFromHook]
    : null;

  const suggestedLanguageCodes = ['el', 'en-US', 'sq', 'es', 'de', 'fr-FR'];
  const suggestedLangs = ALL_AVAILABLE_LANGUAGES
    .filter(lang => suggestedLanguageCodes.includes(lang.code))
    .sort((a,b) => (a.name || '').localeCompare(b.name || '', currentContextLangForSort));

  let regionalLanguages: LanguageOption[];
  if (selectedRegionKey === "all") {
    regionalLanguages = ALL_AVAILABLE_LANGUAGES;
  } else {
    regionalLanguages = ALL_AVAILABLE_LANGUAGES.filter(lang => lang.regionKey === selectedRegionKey);
  }
  regionalLanguages = [...regionalLanguages].sort((a,b) => (a.name || '').localeCompare(b.name || '', currentContextLangForSort));

  const renderLanguageColumns = (languages: LanguageOption[], numColumns: number = 4, isSuggested: boolean = false) => {
    const columns: LanguageOption[][] = Array.from({ length: numColumns }, () => []);
    languages.forEach((lang, index) => {
      columns[index % numColumns].push(lang);
    });

    // Mimicking Facebook's table structure for layout with divs and grid
    return (
      <div className={`grid grid-cols-2 ${isSuggested ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-x-1`}> {/* `gap-x-1` for tighter columns like FB */}
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col"> {/* Mimics <td> */}
            <ul className="space-y-0"> {/* Mimics <ul class="_4kg">, no extra space for FB style */}
              {col.map((lang) => (
                <li key={lang.code} className="py-0.5"> {/* Mimics <li> containing <div class="localeLink"> */}
                  <button
                    onClick={() => handleLanguageSelect(lang.code)}
                    title={lang.englishName} // Or use lang.tooltipName if you re-add it
                    // Base styles from FB: text-left, rounded. Active styles added.
                    // Focus styles for accessibility.
                    className={`w-full text-left px-1.5 py-0.5 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 truncate ${
                      lang.code === activeSpecificLangCode 
                        ? 'text-blue-600 dark:text-blue-400 font-semibold' // .selectedLocale
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {lang.name}
                    {lang.code === activeSpecificLangCode && <span className="ml-1">✓</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    // popup-flex-center (applied to backdrop)
    <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-[2147483647] p-4 transition-opacity duration-150" // popup-backdrop open is-modal + transition
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-modal-title"
    >
      {/* popup open has-close has-close--inside is-modal */}
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-xl md:max-w-2xl lg:max-w-3xl flex flex-col max-h-[85vh] h-auto overflow-hidden relative transition-all duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* popup-body (overall container for content + close button) */}
        <div className="flex flex-col h-full">
            {/* Close button wrapper (positioned absolutely within popup-body) */}
            {/* pressable popup-close */}
            <button
                onClick={onClose}
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
                aria-label={t('close', 'Close')}
            >
                {/* close-button SVG (using a generic X icon) */}
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Actual content starts here, matching collection-create__wrapper conceptually */}
            <div className="flex flex-col h-full">
                {/* popup-header */}
                <div className="px-4 pt-4 pb-3 md:px-6 md:pt-5 md:pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 id="language-modal-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
                        {t('selectYourLanguageTitle', 'Select Your Language')}
                    </h1>
                    {/* Facebook's "intro" div for description - optional for language modal */}
                    {/* <div class="intro">...</div> */}
                </div>

                {/* Main scrollable content area (equivalent to where the form/language lists would be) */}
                {/* This will contain the suggested, divider, and region/language sections */}
                <div className="flex-1 px-1.5 py-3 md:p-4 overflow-y-auto"> {/* pvs phm, pam type padding */}
                    {/* Suggested Languages Section */}
                    <div className="mb-3"> {/* Grouping header and grid */}
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 px-1.5"> {/* uiList mrm suggestionsHeader */}
                            {t('suggestedLanguages', 'Suggested Languages')}
                        </h3>
                        <div> {/* suggestionsGrid */}
                            {renderLanguageColumns(suggestedLangs, 4, true)}
                        </div>
                    </div>

                    {/* Divider (suggestionsDivider) */}
                    <hr className="my-3 border-gray-200 dark:border-gray-700" />

                    {/* Main Language Selection Area (clearfix id="language_container") */}
                    <div className="flex flex-col md:flex-row md:space-x-3">
                        {/* Left Column: Region List (lfloat _ohe) */}
                        <aside className="w-full md:w-48 lg:w-56 mb-3 md:mb-0 flex-shrink-0"> {/* Fixed width for sidebar */}
                            <ul className="space-y-0.5"> {/* regionList _4kg */}
                                {LANGUAGE_REGIONS_FOR_MODAL.map(region => (
                                <li key={region.key}>
                                    <button
                                    onClick={() => setSelectedRegionKey(region.key)}
                                    className={`w-full text-left px-2.5 py-1.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                        selectedRegionKey === region.key 
                                        ? 'bg-gray-100 dark:bg-gray-700 font-semibold text-blue-600 dark:text-blue-400' // selected-intl-region-link active
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}
                                    >
                                    {t(region.nameKey, region.key.replace('languageCategory', ''))}
                                    </button>
                                </li>
                                ))}
                            </ul>
                        </aside>

                        {/* Right Column: Languages for Selected Region (selected-intl-region1) */}
                        <main className="flex-1 min-w-0"> {/* min-w-0 for flex child to allow shrinking */}
                            {/* The height in FB DOM is specific, we use flex and overflow on parent */}
                            {renderLanguageColumns(regionalLanguages, 3, false)}
                            {regionalLanguages.length === 0 && selectedRegionKey !== "all" && (
                                <p className="px-1.5 py-1 text-xs text-gray-500 dark:text-gray-400">{t('noLanguagesInRegion', 'No languages listed for this region yet.')}</p>
                            )}
                        </main>
                    </div>
                </div>
                {/* Footer area isn't explicitly in the FB language DOM for language list, but is in the collection modal */}
                {/* If needed, you can add a footer section here, similar to how it was before */}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectorModal;
