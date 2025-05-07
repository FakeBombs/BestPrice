// src/components/LanguageSelectorModal.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageContext } from '@/context/LanguageContext';

// Define type for clarity, used by the hardcoded array in useMemo
type LanguageOptionInModal = {
  code: string;
  name: string;
  // englishName and regionKey are not strictly needed for what this useMemo returns,
  // but the LanguageOption type that ALL_AVAILABLE_LANGUAGES uses would have them.
};

// These constants are defined but ALL_AVAILABLE_LANGUAGES is NOT directly used by the useMemo in this test.
// LANGUAGE_REGIONS_FOR_MODAL is used by the sidebar.
type FullLanguageOption = {
  code: string;
  name: string;
  englishName: string;
  regionKey: string;
};
const ALL_AVAILABLE_LANGUAGES: FullLanguageOption[] = [ // Keep your full list here for future steps
  { code: 'el', name: 'Ελληνικά', englishName: 'Greek', regionKey: 'languageCategoryEurope' },
  { code: 'en-US', name: 'English (US)', englishName: 'English (US)', regionKey: 'languageCategoryAmericas' },
  // ... etc.
];

const LANGUAGE_REGIONS_FOR_MODAL = [
    { key: "suggested", nameKey: "suggestedLanguages" },
    { key: "languageCategoryEurope", nameKey: "languageCategoryEurope" },
    { key: "languageCategoryAmericas", nameKey: "languageCategoryAmericas" },
    { key: "languageCategoryAsia", nameKey: "languageCategoryAsia" },
    { key: "languageCategoryAfrica", nameKey: "languageCategoryAfrica" },
];

interface LanguageSelectorModalProps { // Changed from LanguageModalProps for clarity if needed
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
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

  // ===== MINIMAL useMemo TEST - Returning a hardcoded array =====
  const languagesToDisplayInJSX = useMemo(() => {
    console.log("DEBUG: LanguageSelectorModal - MINIMAL useMemo triggered (returns hardcoded array)");
    return [ 
      { code: 'el-memo-minimal', name: 'Ελληνικά (Minimal Memo Test)' },
      { code: 'en-US-memo-minimal', name: 'English (US) (Minimal Memo Test)' },
    ];
  }, []); // Empty dependency array.

  console.log("DEBUG: LanguageSelectorModal (Minimal useMemo Test). Displaying count:", languagesToDisplayInJSX.length);

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
            {LANGUAGE_REGIONS_FOR_MODAL.map(region => (
              <button
                key={region.key}
                onClick={() => setSelectedRegion(region.key)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary
                  ${selectedRegion === region.key ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted/80'}`}
              >
                {t(region.nameKey, region.key === "suggested" ? t('suggestedLanguages', 'Suggested') : t(region.nameKey, region.key.replace('languageCategory','')))}
              </button>
            ))}
          </aside>

          <main className="w-2/3 overflow-y-auto p-4">
            <ul className="space-y-1">
              {languagesToDisplayInJSX.map((lang) => ( 
                <li key={lang.code}>
                  <button
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary
                      ${currentContextLangFromHook === lang.code.split('-')[0] ? 'font-semibold text-primary' : 'text-foreground'}`}
                  >
                    {/* The objects returned by useMemo now only have 'code' and 'name' */}
                    {lang.name} 
                    {currentContextLangFromHook === lang.code.split('-')[0] && <span className="ml-2">✓</span>}
                  </button>
                </li>
              ))}
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

export default LanguageSelectorModal; // Corrected export name
