// src/components/LanguageSelectorModal.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageContext } from '@/context/LanguageContext';

// Define types for clarity
type LanguageOption = { 
  code: string; 
  name: string; 
  englishName?: string; // Made optional as not all examples below will use it
  regionKey?: string;  // Made optional
};

// Define language regions for the sidebar (still used)
const LANGUAGE_REGIONS_FOR_MODAL = [
  { key: "suggested", nameKey: "suggestedLanguages" },
  { key: "languageCategoryEurope", nameKey: "languageCategoryEurope" },
  { key: "languageCategoryAmericas", nameKey: "languageCategoryAmericas" },
  { key: "languageCategoryAsia", nameKey: "languageCategoryAsia" },
  { key: "languageCategoryAfrica", nameKey: "languageCategoryAfrica" },
];

// ALL_AVAILABLE_LANGUAGES is defined but NOT used by the useMemo in this test
const ALL_AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'el', name: 'Ελληνικά', englishName: 'Greek', regionKey: 'languageCategoryEurope' },
  // ... your other languages would go here for future use
];

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { t, language: currentContextLangFromHook } = useTranslation();
  const { setLanguage: setContextLanguage } = useLanguageContext();
  const [selectedRegion, setSelectedRegion] = useState<string>("suggested");

  if (!isOpen) return null;

  const mapLanguageCode = (fullCode: string): 'en' | 'el' | 'es' | 'fr' | 'de' => {
    const baseCode = fullCode.split('-')[0] as 'en' | 'el' | 'es' | 'fr' | 'de';
    if (['en', 'el', 'es', 'fr', 'de'].includes(baseCode)) {
      return baseCode;
    }
    console.warn(`Unsupported language code: ${fullCode}, defaulting to English`);
    return 'en';
  };

  // ===== MINIMAL useMemo TEST - Returning a hardcoded array =====
  const suggestedLangsToDisplay = useMemo(() => {
    console.log("DEBUG AI Version - MINIMAL useMemo for suggestedLangsToDisplay");
    return [ 
      { code: 'el-memo-test', name: 'Ελληνικά (Minimal Memo)' }, // No englishName/regionKey needed for this object shape
      { code: 'en-US-memo-test', name: 'English (US) (Minimal Memo)' },
    ];
  }, []); // Empty dependency array

  // languagesToDisplay will just be this minimal, hardcoded, memoized array
  const languagesToDisplay = suggestedLangsToDisplay;

  const handleLanguageChange = (langCode: string) => {
    const baseCode = mapLanguageCode(langCode);
    setContextLanguage(baseCode);
    onClose();
  };

  console.log("DEBUG AI Version - Rendering with minimal memoized list. Count:", languagesToDisplay.length);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[2147483647] flex items-center justify-center p-4" onClick={onClose}>
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
                    onClick={() => setSelectedRegion(region.key)} // This won't change the main list in this test
                  >
                    {t(region.nameKey, region.key === "suggested" ? t('suggestedLanguages', "Suggested") : region.key.replace('languageCategory', ''))}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <main className="w-2/3 overflow-y-auto p-4">
            <ul className="space-y-1">
              {languagesToDisplay.map((lang) => { // Will map over the minimal hardcoded memoized array
                const mappedCode = mapLanguageCode(lang.code); // Ensure lang.code is valid for mapLanguageCode
                const isActive = currentContextLangFromHook === mappedCode;
                
                return (
                  <li key={lang.code}>
                    <button 
                      className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-md text-sm border ${isActive ? 'border-primary bg-primary/10 font-semibold text-primary' : 'hover:bg-muted border-transparent text-foreground'}`}
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      <span>{lang.name}</span>
                      {isActive && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      )}
                    </button>
                  </li>
                );
              })}
              {languagesToDisplay.length === 0 && (
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
