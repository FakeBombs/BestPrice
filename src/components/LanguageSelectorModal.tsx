// src/components/LanguageSelectorModal.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageContext } from '@/context/LanguageContext';

// Define types for clarity
type LanguageOption = { 
  code: string;          // e.g., "en-US", "el", "es-ES"
  name: string;          // Native name, e.g., "English (US)", "Ελληνικά"
  englishName: string;   // English name for easier reference or alternative sorting
  regionKey: string;     // Key to match with LANGUAGE_REGIONS_FOR_MODAL
  tooltipName?: string;  // Optional: Name as seen in Facebook's tooltip (often Greek in your example)
};

// Updated language regions based on Facebook DOM
const LANGUAGE_REGIONS_FOR_MODAL = [
  { key: "suggested", nameKey: "suggestedLanguages" }, // For the "Προτεινόμενες γλώσσες" section
  { key: "all", nameKey: "allLanguages" }, // For "Όλες οι γλώσσες"
  { key: "languageCategoryAfricaMiddleEast", nameKey: "languageCategoryAfrica" }, // For "Αφρική και Μέση Ανατολή"
  { key: "languageCategoryAmericas", nameKey: "languageCategoryAmericas" }, // For "Αμερική"
  { key: "languageCategoryAsiaPacific", nameKey: "languageCategoryAsia" },  // For "Ασία-Ειρηνικός" (using existing Asia key)
  { key: "languageCategoryEasternEurope", nameKey: "languageCategoryEasternEurope" }, // New key needed
  { key: "languageCategoryWesternEurope", nameKey: "languageCategoryWesternEurope" }, // New key needed
];

// Define all available languages based on the provided Facebook DOM
// This is a large array. I've tried to map regionKey based on Facebook's classes or best guess.
// You might need to adjust regionKey assignments for perfect matching.
const ALL_AVAILABLE_LANGUAGES: LanguageOption[] = [
  // Suggested (these will be filtered again later, but good to have them in the main list with a primary region)
  { code: 'el', name: 'Ελληνικά', englishName: 'Greek', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Ελληνικά' },
  { code: 'en-US', name: 'English (US)', englishName: 'English (US)', regionKey: 'languageCategoryAmericas', tooltipName: 'Αγγλικά (ΗΠΑ)' },
  { code: 'sq', name: 'Shqip', englishName: 'Albanian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Αλβανικά' }, // Also appears in Eastern Europe list
  { code: 'es', name: 'Español', englishName: 'Spanish', regionKey: 'languageCategoryAmericas', tooltipName: 'Ισπανικά' }, // Generic Spanish often for Americas

  // From "Όλες οι γλώσσες" section - categorizing them
  { code: 'so', name: 'Af-Soomaali', englishName: 'Somali', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Σομαλικά' },
  { code: 'af', name: 'Afrikaans', englishName: 'Afrikaans', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Αφρικάανς' },
  { code: 'az', name: 'Azərbaycan dili', englishName: 'Azerbaijani', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Αζερικά' }, // Also EE
  { code: 'id', name: 'Bahasa Indonesia', englishName: 'Indonesian', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Ινδονησιακά' },
  { code: 'ms', name: 'Bahasa Melayu', englishName: 'Malay', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Μαλαϊκά' },
  { code: 'jv', name: 'Basa Jawa', englishName: 'Javanese', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Ιαβικά' },
  { code: 'ceb', name: 'Bisaya', englishName: 'Cebuano', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Σεμπουάνο' },
  { code: 'bs', name: 'Bosanski', englishName: 'Bosnian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Βοσνιακά' }, // Could be EE
  { code: 'br', name: 'Brezhoneg', englishName: 'Breton', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Βρετονικά' },
  { code: 'ca', name: 'Català', englishName: 'Catalan', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Καταλανικά' },
  { code: 'co', name: 'Corsu', englishName: 'Corsican', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Κορσικανικά' },
  { code: 'cy', name: 'Cymraeg', englishName: 'Welsh', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Ουαλικά' },
  { code: 'da', name: 'Dansk', englishName: 'Danish', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Δανέζικα' },
  { code: 'de', name: 'Deutsch', englishName: 'German', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Γερμανικά' },
  { code: 'et', name: 'Eesti', englishName: 'Estonian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Εσθονικά' }, // Could be EE
  { code: 'en-GB', name: 'English (UK)', englishName: 'English (UK)', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Αγγλικά (ΗΒ)' },
  // 'es' generic already listed, 'es-ES' specific:
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
  { code: 'hr', name: 'Hrvatski', englishName: 'Croatian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Κροατικά' }, // Could be EE
  { code: 'rw', name: 'Ikinyarwanda', englishName: 'Kinyarwanda', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Κινιαρουαντιανά' },
  { code: 'iu', name: 'Inuktitut', englishName: 'Inuktitut', regionKey: 'languageCategoryAmericas', tooltipName: 'Ινούκτιτουτ' },
  { code: 'it', name: 'Italiano', englishName: 'Italian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Ιταλικά' },
  { code: 'ik', name: 'Iñupiatun', englishName: 'Inupiaq', regionKey: 'languageCategoryAmericas', tooltipName: 'Ινούπιακ' },
  { code: 'sw', name: 'Kiswahili', englishName: 'Swahili', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Σουαχίλι' },
  { code: 'ht', name: 'Kreyòl Ayisyen', englishName: 'Haitian Creole', regionKey: 'languageCategoryAmericas', tooltipName: 'Κρεόλ Αϊτής' },
  { code: 'ku', name: 'Kurdî (Kurmancî)', englishName: 'Kurdish (Kurmanji)', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Βόρεια Κουρδικά (Κουρμάντζι)' },
  { code: 'lv', name: 'Latviešu', englishName: 'Latvian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Λετονικά' }, // Could be EE
  { code: 'lt', name: 'Lietuvių', englishName: 'Lithuanian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Λιθουανικά' }, // Could be EE
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
  // sq already listed
  { code: 'sk', name: 'Slovenčina', englishName: 'Slovak', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Σλοβακικά' },
  { code: 'sl', name: 'Slovenščina', englishName: 'Slovenian', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Σλοβενικά' },
  { code: 'fi', name: 'Suomi', englishName: 'Finnish', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Φινλανδικά' },
  { code: 'sv', name: 'Svenska', englishName: 'Swedish', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Σουηδικά' },
  { code: 'vi', name: 'Tiếng Việt', englishName: 'Vietnamese', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Βιετναμέζικα' },
  // tr already listed
  { code: 'nl-BE', name: 'Vlaams', englishName: 'Flemish (Dutch variant)', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Φλαμανδικά' }, // Using nl-BE as a common code for Flemish
  { code: 'zza', name: 'Zaza', englishName: 'Zaza', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Ζαζαϊκά' },
  { code: 'is', name: 'Íslenska', englishName: 'Icelandic', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Ισλανδικά' },
  { code: 'cs', name: 'Čeština', englishName: 'Czech', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Τσέχικα' },
  { code: 'szl', name: 'ślōnskŏ gŏdka', englishName: 'Silesian', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Σιλεσιανά' },
  // el already listed
  { code: 'be', name: 'Беларуская', englishName: 'Belarusian', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Λευκορωσικά' },
  { code: 'bg', name: 'Български', englishName: 'Bulgarian', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Βουλγαρικά' },
  { code: 'mk', name: 'Македонски', englishName: 'Macedonian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Σλαβομακεδονικά' }, // Or EE
  { code: 'mn', name: 'Монгол', englishName: 'Mongolian', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Μογγολικά' },
  // ru already listed
  { code: 'sr', name: 'Српски', englishName: 'Serbian', regionKey: 'languageCategoryWesternEurope', tooltipName: 'Σερβικά' }, // Or EE
  { code: 'tt', name: 'Татарча', englishName: 'Tatar', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Ταταρικά' }, // Also AP
  { code: 'tg', name: 'Тоҷикӣ', englishName: 'Tajik', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Τατζίκ' },
  { code: 'uk', name: 'Українська', englishName: 'Ukrainian', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Ουκρανικά' },
  { code: 'ky', name: 'кыргызча', englishName: 'Kyrgyz', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Κυργιζιανά' },
  { code: 'kk', name: 'Қазақша', englishName: 'Kazakh', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Καζακικά' }, // Also AP
  { code: 'hy', name: 'Հայերեն', englishName: 'Armenian', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Αρμένικα' }, // Also AP
  // he already listed
  { code: 'ur', name: 'اردو', englishName: 'Urdu', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Ουρντού' },
  // ar already listed
  { code: 'fa', name: 'فارسی', englishName: 'Persian', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Περσικά' },
  { code: 'ps', name: 'پښتو', englishName: 'Pashto', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Πάστο' }, // Also AFME
  { code: 'ckb', name: 'کوردیی ناوەندی', englishName: 'Kurdish (Sorani)', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Κουρδικά Σοράνι' },
  { code: 'syr', name: 'ܣܘܪܝܝܐ', englishName: 'Syriac', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Συριακά' },
  { code: 'ne', name: 'नेपाली', englishName: 'Nepali', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Νεπαλέζικα' },
  { code: 'mr', name: 'मराठी', englishName: 'Marathi', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Μαράθι' },
  // hi already listed
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
  { code: 'ka', name: 'ქართული', englishName: 'Georgian', regionKey: 'languageCategoryEasternEurope', tooltipName: 'Γεωργιανά' }, // Also AP
  { code: 'am', name: 'አማርኛ', englishName: 'Amharic', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Αμχαρικά' },
  { code: 'km', name: 'ភាសាខ្មែរ', englishName: 'Khmer', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Χμερ' },
  { code: 'ber', name: 'ⵜⴰⵎⴰⵣⵉⵖⵜ', englishName: 'Tamazight', regionKey: 'languageCategoryAfricaMiddleEast', tooltipName: 'Ταμαζίγκχτ' }, // Used 'ber' as a common code for Berber languages
  { code: 'zh-TW', name: '中文(台灣)', englishName: 'Chinese (Taiwan)', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Παραδοσιακά Κινέζικα (Ταϊβάν)' }, // Already had zh-TW, this matches tooltip
  { code: 'zh-CN', name: '中文(简体)', englishName: 'Chinese (Simplified)', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Απλοποιημένα Κινέζικα (Κίνα)' }, // Already had zh-CN
  { code: 'zh-HK', name: '中文(香港)', englishName: 'Chinese (Hong Kong)', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Παραδοσιακά Κινέζικα (Χονγκ Κονγκ)' }, // zh-Hant used by FB, using zh-HK for specificity
  // ja already listed
  { code: 'ja-KS', name: '日本語(関西)', englishName: 'Japanese (Kansai)', regionKey: 'languageCategoryAsiaPacific', tooltipName: 'Ιαπωνικά (Κανσάι)' },
  // ko already listed
];


interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { t, language: currentContextLangFromHook, isLoaded } = useTranslation(); 
  const { setLanguage: setContextLanguage } = useLanguageContext();
  const [selectedRegion, setSelectedRegion] = useState<string>("suggested");

  const currentContextLangForSort = isLoaded ? currentContextLangFromHook : 'en'; 

  if (!isOpen) return null;

  const mapLanguageCode = useCallback((fullCode: string): 'en' | 'el' | 'es' | 'fr' | 'de' => {
    const baseCode = fullCode.split('-')[0] as 'en' | 'el' | 'es' | 'fr' | 'de';
    if (['en', 'el', 'es', 'fr', 'de'].includes(baseCode)) {
      return baseCode;
    }
    console.warn(`mapLanguageCode received an unmappable code: ${fullCode}, defaulting to 'en'.`);
    return 'en'; 
  }, []);

  const handleLanguageSelect = useCallback((langCode: string) => {
    const mappedCode = mapLanguageCode(langCode);
    setContextLanguage(mappedCode);
    onClose();
  }, [setContextLanguage, onClose, mapLanguageCode]);

  const suggestedLangsToDisplay = useMemo(() => {
    // Define which language codes are "suggested"
    // These codes should exist in your ALL_AVAILABLE_LANGUAGES list
    const suggestedCodes = ['el', 'en-US', 'es-ES', 'fr-FR', 'de', 'sq'];
    return ALL_AVAILABLE_LANGUAGES.filter(lang => 
      suggestedCodes.includes(lang.code)
    );
  }, []); // ALL_AVAILABLE_LANGUAGES is stable, so empty dependency array.

  const languagesToDisplay = useMemo(() => {
    let filteredLangs: LanguageOption[];
    
    if (selectedRegion === "suggested") {
      filteredLangs = suggestedLangsToDisplay; 
    } else if (selectedRegion === "all") { // Handle the "All Languages" tab
      filteredLangs = ALL_AVAILABLE_LANGUAGES;
    }
    else {
      filteredLangs = ALL_AVAILABLE_LANGUAGES.filter(lang => 
        lang.regionKey === selectedRegion
      );
    }
    
    return [...filteredLangs].sort((a, b) => 
      String(a.name || '').localeCompare(String(b.name || ''), currentContextLangForSort)
    );
  }, [selectedRegion, suggestedLangsToDisplay, currentContextLangForSort]); // currentContextLangFromHook renamed to currentContextLangForSort

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
                    {t(region.nameKey, region.key === "suggested" ? t('suggestedLanguages', "Suggested") : region.key.replace('languageCategory', ''))}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <main className="w-2/3 overflow-y-auto p-4">
            <ul className="space-y-1">
              {languagesToDisplay.map((lang) => {
                const mappedCode = mapLanguageCode(lang.code);
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
              {languagesToDisplay.length === 0 && selectedRegion !== "suggested" && (
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
