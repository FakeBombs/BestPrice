// src/components/LanguageSelectorModal.tsx
// IMPLEMENTING STRATEGY 1: Single check mark based on a default variant for the active context language.

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageContext } from '@/context/LanguageContext';

// Define types for clarity
type LanguageOption = {
  code: string;
  name: string;
  englishName: string;
  regionKey: string;
};

// Define language regions for the sidebar
const LANGUAGE_REGIONS_FOR_MODAL = [
  { key: "suggested", nameKey: "suggestedLanguages" },
  { key: "all", nameKey: "allLanguages" },
  { key: "languageCategoryAfricaMiddleEast", nameKey: "languageCategoryAfrica" },
  { key: "languageCategoryAmericas", nameKey: "languageCategoryAmericas" },
  { key: "languageCategoryAsiaPacific", nameKey: "languageCategoryAsia" },
  { key: "languageCategoryEasternEurope", nameKey: "languageCategoryEasternEurope" },
  { key: "languageCategoryWesternEurope", nameKey: "languageCategoryWesternEurope" },
];

// Define all available languages
const ALL_AVAILABLE_LANGUAGES: LanguageOption[] = [
  // Your extensive list here...
  { code: 'el', name: 'Ελληνικά', englishName: 'Greek', regionKey: 'languageCategoryWesternEurope' },
  { code: 'en-US', name: 'English (US)', englishName: 'English (US)', regionKey: 'languageCategoryAmericas' },
  { code: 'sq', name: 'Shqip', englishName: 'Albanian', regionKey: 'languageCategoryWesternEurope' },
  { code: 'es', name: 'Español', englishName: 'Spanish', regionKey: 'languageCategoryAmericas' }, // Generic Spanish
  { code: 'de', name: 'Deutsch', englishName: 'German', regionKey: 'languageCategoryWesternEurope' }, // Base German
  { code: 'fr-FR', name: 'Français (France)', englishName: 'French (France)', regionKey: 'languageCategoryWesternEurope' },
  { code: 'es-ES', name: 'Español (España)', englishName: 'Spanish (Spain)', regionKey: 'languageCategoryWesternEurope' },
  // ... (the rest of your large ALL_AVAILABLE_LANGUAGES list) ...
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

// <<<< NEW: Define default variants for each base context language >>>>
// Adjust these specific codes to what you consider the "main" variant for each base language.
// Ensure these codes exist in ALL_AVAILABLE_LANGUAGES.
const DEFAULT_VARIANT_FOR_CONTEXT_LANG: { [key in 'en' | 'el' | 'es' | 'fr' | 'de']: string } = {
  'el': 'el',
  'en': 'en-US',
  'es': 'es-ES',
  'fr': 'fr-FR',
  'de': 'de',
};

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { t, language: currentContextLangFromHook, isLoaded } = useTranslation();
  const { setLanguage: setContextLanguage } = useLanguageContext();
  const [selectedRegion, setSelectedRegion] = useState<string>("suggested");

  const mapLanguageCode = (fullCode: string): 'en' | 'el' | 'es' | 'fr' | 'de' => {
    const baseCode = fullCode.split('-')[0].toLowerCase();
    if (VALID_CONTEXT_LANGUAGES.includes(baseCode as any)) {
      return baseCode as 'en' | 'el' | 'es' | 'fr' | 'de';
    }
    console.warn(`mapLanguageCode received an unmappable code: ${fullCode}, defaulting to 'en'.`);
    return 'en';
  };

  const handleLanguageSelect = (langCode: string) => {
    const mappedCode = mapLanguageCode(langCode);
    setContextLanguage(mappedCode);
    onClose();
  };

  if (!isOpen) return null;

  const currentContextLangForSort = isLoaded ? currentContextLangFromHook : 'en';

  const suggestedLangsToDisplay = ALL_AVAILABLE_LANGUAGES.filter(lang =>
    ['el', 'en-US', 'es-ES', 'fr-FR', 'de', 'sq'].includes(lang.code)
  );

  let languagesToDisplay: LanguageOption[] = [];
  if (selectedRegion === "suggested") {
    languagesToDisplay = suggestedLangsToDisplay;
  } else if (selectedRegion === "all") {
    languagesToDisplay = ALL_AVAILABLE_LANGUAGES;
  }
  else {
    languagesToDisplay = ALL_AVAILABLE_LANGUAGES.filter(lang =>
      lang.regionKey === selectedRegion
    );
  }

  languagesToDisplay = [...languagesToDisplay].sort((a, b) =>
    String(a.name || '').localeCompare(String(b.name || ''), currentContextLangForSort)
  );

  // <<<< MODIFIED: Logic to determine the single active language item for the check mark >>>>
  // Get the preferred specific variant code for the current base context language.
  const preferredVariantForCurrentActiveBaseLang = isLoaded
    ? DEFAULT_VARIANT_FOR_CONTEXT_LANG[currentContextLangFromHook]
    : null; // If context isn't loaded, no specific variant is preferred yet.

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[2147483647] p-4" onClick={onClose}>
      <div
        className="bg-background p-0 rounded-lg shadow-xl w-full max-w-2xl h-[80vh] max-h-[600px] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b pb-3 border-border">
          <div className="flex-1"></div>
          <h2 className="text-xl font-semibold text-center flex-grow">
            {t('selectYourLanguageTitle', 'Select Your Language')}
          </h2>
          <div className="flex-1 flex justify-end">
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
                // <<<< MODIFIED: isActive condition for single check mark >>>>
                const isActive = lang.code === preferredVariantForCurrentActiveBaseLang;

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
