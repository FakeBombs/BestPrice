// src/components/LanguageModal.tsx
import React, { useState, useCallback } from 'react'; // Removed useMemo for this test
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageContext } from '@/context/LanguageContext';

// Define these constants outside the component (they are NOT directly used by the list in this test)
type LanguageOption = {
  code: string; 
  name: string; 
  englishName: string;
  regionKey: string; 
};

const ALL_AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'el', name: 'Ελληνικά', englishName: 'Greek', regionKey: 'languageCategoryEurope' },
  { code: 'en-US', name: 'English (US)', englishName: 'English (US)', regionKey: 'languageCategoryAmericas' },
  // ... (your full list can remain here for when we re-enable it)
];

const LANGUAGE_REGIONS_FOR_MODAL = [
    { key: "suggested", nameKey: "suggestedLanguages" },
    { key: "languageCategoryEurope", nameKey: "languageCategoryEurope" },
    // ... (your full list can remain here)
];

// The small, hardcoded list that previously worked
const HARDCODED_DEBUG_LANGUAGES: { code: string; name: string; }[] = [
    { code: 'el', name: 'Ελληνικά (DEBUG Hardcoded)' },
    { code: 'en-US', name: 'English (US) (DEBUG Hardcoded)' },
    { code: 'es-ES', name: 'Español (DEBUG Hardcoded)'},
];

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { t, language: currentContextLangFromHook, isLoaded } = useTranslation();
  const { setLanguage: setContextLanguage } = useLanguageContext();
  const [selectedRegion, setSelectedRegion] = useState<string>("suggested");

  if (!isOpen) return null;

  const handleLanguageChange = (langCode: string) => {
    const simpleLangCode = langCode.split('-')[0] as 'en' | 'el' | 'es' | 'fr' | 'de';
    if (['en', 'el', 'es', 'fr', 'de'].includes(simpleLangCode)) {
        setContextLanguage(simpleLangCode);
    } else {
        console.warn(`Unsupported language code: ${langCode}. Attempting to use base code.`);
        if (['en', 'el', 'es', 'fr', 'de'].includes(simpleLangCode)){
            setContextLanguage(simpleLangCode);
        }
    }
    onClose();
  };

  // ALL useMemo calls for language lists are removed for this test.
  // We will map HARDCODED_DEBUG_LANGUAGES directly.
  // const suggestedLangsToDisplay = useMemo(...); // GONE
  // const languagesToDisplay = useMemo(...);    // GONE

  console.log("DEBUG: LanguageModal rendering with HARDCODED_DEBUG_LANGUAGES. isLoaded:", isLoaded, "currentLang:", currentContextLangFromHook);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[2147483647] p-4" onClick={onClose}>
      <div 
        className="bg-background rounded-lg shadow-xl w-full max-w-2xl h-[80vh] max-h-[600px] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border relative">
          <h3 className="text-xl font-semibold text-center">{t('selectYourLanguageTitle')}</h3>
          <button 
            onClick={onClose} 
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted"
            aria-label={t('close', 'Close')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-1/3 border-r border-border overflow-y-auto p-2 space-y-1 bg-muted/20">
            {/* Sidebar still uses LANGUAGE_REGIONS_FOR_MODAL and t() */}
            {LANGUAGE_REGIONS_FOR_MODAL.map(region => (
              <button
                key={region.key}
                onClick={() => setSelectedRegion(region.key)} // Will not change the main list in this test
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary
                  ${selectedRegion === region.key ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted/80'}`}
              >
                {t(region.nameKey, region.key === "suggested" ? t('suggestedLanguages', 'Suggested') : t(region.nameKey, region.key.replace('languageCategory','')))}
              </button>
            ))}
          </aside>

          <main className="w-2/3 overflow-y-auto p-4">
            <ul className="space-y-1">
              {/* ***** DEBUGGING: Use HARDCODED_DEBUG_LANGUAGES directly ***** */}
              {HARDCODED_DEBUG_LANGUAGES.map((lang) => ( 
                <li key={lang.code}>
                  <button
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary
                      ${currentContextLangFromHook === lang.code.split('-')[0] ? 'font-semibold text-primary' : 'text-foreground'}`}
                  >
                    {lang.name}
                    {currentContextLangFromHook === lang.code.split('-')[0] && <span className="ml-2">✓</span>}
                  </button>
                </li>
              ))}
               {/* This condition likely won't be met with the hardcoded list */}
               {HARDCODED_DEBUG_LANGUAGES.length === 0 && ( 
                <li className="px-3 py-2 text-sm text-muted-foreground">{t('noLanguagesInRegion', 'No languages listed for this region yet.')}</li>
              )}
            </ul>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;
