// src/components/LanguageSelectorModal.tsx
import React, { useState, useMemo, useCallback } from 'react';
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
  { key: "languageCategoryEurope", nameKey: "languageCategoryEurope" },
  { key: "languageCategoryAmericas", nameKey: "languageCategoryAmericas" },
  { key: "languageCategoryAsia", nameKey: "languageCategoryAsia" },
  { key: "languageCategoryAfrica", nameKey: "languageCategoryAfrica" },
];

// THIS IS WHERE YOU WILL PUT THE FULL FACEBOOK-LIKE LIST OF LANGUAGES
// For now, using the example list from the AI's output, ensure regionKey matches LANGUAGE_REGIONS_FOR_MODAL keys
const ALL_AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'el', name: 'Ελληνικά', englishName: 'Greek', regionKey: 'languageCategoryEurope' },
  { code: 'en-US', name: 'English (US)', englishName: 'English (US)', regionKey: 'languageCategoryAmericas' },
  { code: 'es-ES', name: 'Español (España)', englishName: 'Spanish (Spain)', regionKey: 'languageCategoryEurope' },
  { code: 'es-MX', name: 'Español (México)', englishName: 'Spanish (Mexico)', regionKey: 'languageCategoryAmericas' },
  { code: 'fr-FR', name: 'Français (France)', englishName: 'French (France)', regionKey: 'languageCategoryEurope' },
  { code: 'fr-CA', name: 'Français (Canada)', englishName: 'French (Canada)', regionKey: 'languageCategoryAmericas' },
  { code: 'de', name: 'Deutsch', englishName: 'German', regionKey: 'languageCategoryEurope' }, // Often de-DE
  { code: 'it', name: 'Italiano', englishName: 'Italian', regionKey: 'languageCategoryEurope' }, // Often it-IT
  { code: 'pt-BR', name: 'Português (Brasil)', englishName: 'Portuguese (Brazil)', regionKey: 'languageCategoryAmericas' },
  { code: 'pt-PT', name: 'Português (Portugal)', englishName: 'Portuguese (Portugal)', regionKey: 'languageCategoryEurope' },
  { code: 'ru', name: 'Русский', englishName: 'Russian', regionKey: 'languageCategoryEurope' }, // Or Asia
  { code: 'ja', name: '日本語', englishName: 'Japanese', regionKey: 'languageCategoryAsia' },
  { code: 'zh-CN', name: '简体中文', englishName: 'Chinese (Simplified)', regionKey: 'languageCategoryAsia' },
  { code: 'zh-TW', name: '繁體中文', englishName: 'Chinese (Traditional)', regionKey: 'languageCategoryAsia' },
  { code: 'ko', name: '한국어', englishName: 'Korean', regionKey: 'languageCategoryAsia' },
  { code: 'ar', name: 'العربية', englishName: 'Arabic', regionKey: 'languageCategoryAfrica' },
  { code: 'hi', name: 'हिंदी', englishName: 'Hindi', regionKey: 'languageCategoryAsia' },
  { code: 'tr', name: 'Türkçe', englishName: 'Turkish', regionKey: 'languageCategoryEurope' }, // Can also be Asia or Africa/Middle East
  { code: 'nl', name: 'Nederlands', englishName: 'Dutch', regionKey: 'languageCategoryEurope' },
  { code: 'pl', name: 'Polski', englishName: 'Polish', regionKey: 'languageCategoryEurope' },
  { code: 'sv', name: 'Svenska', englishName: 'Swedish', regionKey: 'languageCategoryEurope' },
  { code: 'da', name: 'Dansk', englishName: 'Danish', regionKey: 'languageCategoryEurope' },
  { code: 'fi', name: 'Suomi', englishName: 'Finnish', regionKey: 'languageCategoryEurope' },
  { code: 'sq', name: 'Shqip', englishName: 'Albanian', regionKey: 'languageCategoryEurope' }, // Added from your earlier examples
  // ADD THE FULL LIST OF LANGUAGES HERE, CORRECTLY CATEGORIZED BY regionKey
];


interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { t, language: currentContextLangFromHook, isLoaded } = useTranslation(); // isLoaded can be used if needed
  const { setLanguage: setContextLanguage } = useLanguageContext();
  const [selectedRegion, setSelectedRegion] = useState<string>("suggested");

  if (!isOpen) return null;

  const mapLanguageCode = (fullCode: string): 'en' | 'el' | 'es' | 'fr' | 'de' => {
    const baseCode = fullCode.split('-')[0] as 'en' | 'el' | 'es' | 'fr' | 'de';
    if (['en', 'el', 'es', 'fr', 'de'].includes(baseCode)) {
      return baseCode;
    }
    console.warn(`mapLanguageCode received an unmappable code: ${fullCode}, defaulting to English`);
    return 'en';
  };

  const handleLanguageSelect = (langCode: string) => {
    const mappedCode = mapLanguageCode(langCode);
    setContextLanguage(mappedCode);
    onClose();
  };

  // Derive suggested languages list
  const suggestedLangsToDisplay = useMemo(() => {
    console.log("DEBUG: suggestedLangsToDisplay useMemo triggered");
    return ALL_AVAILABLE_LANGUAGES.filter(lang => 
      ['el', 'en-US', 'es-ES', 'fr-FR', 'de'].includes(lang.code) // Ensure these codes exist in ALL_AVAILABLE_LANGUAGES
    );
  }, []); // ALL_AVAILABLE_LANGUAGES is stable

  // Derive languages to display based on selected region
  const languagesToDisplay = useMemo(() => {
    console.log("DEBUG: languagesToDisplay useMemo triggered. Region:", selectedRegion);
    let filteredLangs: LanguageOption[];
    
    if (selectedRegion === "suggested") {
      filteredLangs = suggestedLangsToDisplay; // Use the memoized suggested list
    } else {
      // Filter the FULL list based on the selected region
      filteredLangs = ALL_AVAILABLE_LANGUAGES.filter(lang => 
        lang.regionKey === selectedRegion
      );
    }
    
    // Sort alphabetically by name in the current language context (or fallback)
    return [...filteredLangs].sort((a, b) => 
      a.name.localeCompare(b.name, currentContextLangFromHook || 'en')
    );
  }, [selectedRegion, suggestedLangsToDisplay, currentContextLangFromHook]);

  return (
    <div className="fixed inset-0 bg-black/50 z-[2147483647] flex items-center justify-center p-4" onClick={onClose}>
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
              {languagesToDisplay.map((lang) => { // Now maps over the DYNAMIC languagesToDisplay
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
              {languagesToDisplay.length === 0 && selectedRegion !== "suggested" && ( // This message will now be shown if a region has no languages
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
