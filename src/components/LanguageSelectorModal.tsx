// src/components/LanguageSelectorModal.tsx
import React, { useState, useMemo, useCallback } from 'react'; // Added useMemo
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageContext } from '@/context/LanguageContext';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define these constants outside the component
type LanguageOption = {
  code: string; 
  name: string; 
  englishName: string; // Keep for the full list logic
  regionKey: string;  // Keep for the full list logic
};

const ALL_AVAILABLE_LANGUAGES: LanguageOption[] = [ // This should be your full list eventually
  { code: 'el', name: 'Ελληνικά', englishName: 'Greek', regionKey: 'languageCategoryEurope' },
  { code: 'en-US', name: 'English (US)', englishName: 'English (US)', regionKey: 'languageCategoryAmericas' },
  { code: 'es-ES', name: 'Español (España)', englishName: 'Spanish (Spain)', regionKey: 'languageCategoryEurope' },
  { code: 'sq', name: 'Shqip', englishName: 'Albanian', regionKey: 'languageCategoryEurope' },
  { code: 'en-GB', name: 'English (UK)', englishName: 'English (UK)', regionKey: 'languageCategoryEurope' },
  { code: 'fr-FR', name: 'Français (France)', englishName: 'French (France)', regionKey: 'languageCategoryEurope' },
  { code: 'de-DE', name: 'Deutsch', englishName: 'German', regionKey: 'languageCategoryEurope' },
  // ... Add more languages from your full list
];

const LANGUAGE_REGIONS_FOR_MODAL = [
    { key: "suggested", nameKey: "suggestedLanguages" },
    { key: "languageCategoryEurope", nameKey: "languageCategoryEurope" },
    { key: "languageCategoryAmericas", nameKey: "languageCategoryAmericas" },
    { key: "languageCategoryAsia", nameKey: "languageCategoryAsia" },
    { key: "languageCategoryAfrica", nameKey: "languageCategoryAfrica" }
];

// This was the AI's debug list, we'll now derive suggested from ALL_AVAILABLE_LANGUAGES
// const DEBUG_LANG_LIST = [
//   { code: 'el', name: 'Ελληνικά' },
//   { code: 'en-US', name: 'English (US)' },
//   { code: 'es-ES', name: 'Español (España)' }
// ];

const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { t, language: currentSelectedAppLanguage, isLoaded } = useTranslation(); // isLoaded might be useful later
  const { setLanguage } = useLanguageContext();
  const [selectedRegion, setSelectedRegion] = useState("suggested");

  if (!isOpen) {
    return null;
  }

  const mapLanguageCode = (code: string): 'en' | 'el' | 'es' | 'fr' | 'de' => {
    const baseCode = code.split('-')[0] as 'en' | 'el' | 'es' | 'fr' | 'de';
    if (['en', 'el', 'es', 'fr', 'de'].includes(baseCode)) {
        return baseCode;
    }
    console.warn(`mapLanguageCode received an unmappable code: ${code}, returning 'en' as default.`);
    return 'en'; 
  };

  const handleLanguageSelect = (langCode: string) => {
    const mappedCode = mapLanguageCode(langCode);
    setLanguage(mappedCode);
    onClose();
  };

  // ===== RE-INTRODUCE useMemo for suggestedLangsToDisplay =====
  const suggestedLangsToDisplay = useMemo(() => {
    console.log("DEBUG: LanguageSelectorModal - suggestedLangsToDisplay useMemo triggered");
    return ALL_AVAILABLE_LANGUAGES.filter(lang => 
        ['el', 'en-US', 'sq', 'es-ES'].includes(lang.code) // Example codes for suggested
    );
  }, []); // ALL_AVAILABLE_LANGUAGES is a top-level const, so empty deps is correct.

  // For this step, the list displayed in JSX will be the memoized suggestedLangsToDisplay.
  // The full dynamic list logic (filtering by region and sorting) is NOT YET active.
  const languagesToDisplayInJSX = suggestedLangsToDisplay;

  console.log("DEBUG: LanguageSelectorModal rendering. SelectedRegion:", selectedRegion, "Displaying count:", languagesToDisplayInJSX.length);


  return (
    <div className="fixed inset-0 bg-black/50 z-[2147483647] flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-background p-0 rounded-lg shadow-xl w-full max-w-2xl h-[80vh] max-h-[600px] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b pb-3">
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
              {languagesToDisplayInJSX.map((lang) => { // This will map over suggestedLangsToDisplay
                const mappedCode = mapLanguageCode(lang.code);
                const isActive = currentSelectedAppLanguage === mappedCode;
                
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
              {languagesToDisplayInJSX.length === 0 && (
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
