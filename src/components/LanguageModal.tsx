// src/components/LanguageModal.tsx
import React, { useState, useCallback } from 'react';
// import { useTranslation } from '@/hooks/useTranslation';         // COMMENTED OUT
// import { useLanguageContext } from '@/context/LanguageContext'; // COMMENTED OUT

// Define type for clarity, even if not fully utilized in this minimal version
type LanguageOption = {
  code: string;
  name: string;
  // englishName: string; // Not strictly needed for this debug version
  // regionKey: string;  // Not strictly needed for this debug version
};

// These are defined but LANGUAGE_REGIONS_FOR_MODAL is used by the sidebar which still uses a mock 't'
const LANGUAGE_REGIONS_FOR_MODAL = [
    { key: "suggested", nameKey: "suggestedLanguages" },
    { key: "languageCategoryEurope", nameKey: "languageCategoryEurope" },
    { key: "languageCategoryAmericas", nameKey: "languageCategoryAmericas" },
    { key: "languageCategoryAsia", nameKey: "languageCategoryAsia" },
    { key: "languageCategoryAfrica", nameKey: "languageCategoryAfrica" },
];

const HARDCODED_DEBUG_LANGUAGES: LanguageOption[] = [
    { code: 'el-debug', name: 'Ελληνικά (Hardcoded)', englishName: 'Greek', regionKey: 'debug' },
    { code: 'en-US-debug', name: 'English (US) (Hardcoded)', englishName: 'English (US)', regionKey: 'debug' },
    { code: 'es-ES-debug', name: 'Español (Hardcoded)', englishName: 'Spanish', regionKey: 'debug' },
];

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  // --- All custom hooks commented out for this test ---
  // const { t, language: currentContextLangFromHook, isLoaded } = useTranslation();
  // const { setLanguage: setContextLanguage } = useLanguageContext();

  // --- Use hardcoded fallbacks ---
  const t = (key: string, fallback?: string) => fallback || key;
  const currentContextLangFromHook = 'el'; // Hardcode for testing the checkmark
  // const isLoaded = true; // Assume loaded for testing

  const [selectedRegion, setSelectedRegion] = useState<string>("suggested");

  if (!isOpen) return null;

  const handleLanguageChange = (langCode: string) => {
    console.log("DEBUG: Language selected in simplified modal (no context update):", langCode);
    // setContextLanguage(simpleLangCode); // Actual language change is disabled
    onClose();
  };

  console.log("DEBUG: LanguageModal rendering with NO custom hooks for data, NO useMemo for lists. SelectedRegion:", selectedRegion);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[2147483647] p-4" onClick={onClose}>
      <div 
        className="bg-background rounded-lg shadow-xl w-full max-w-2xl h-[80vh] max-h-[600px] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border relative">
          <h3 className="text-xl font-semibold text-center">{t('selectYourLanguageTitle', 'Select Your Language (Hardcoded)')}</h3>
          <button 
            onClick={onClose} 
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted"
            aria-label={t('close', 'Close (Hardcoded)')}
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
                {/* Using hardcoded fallback for region name as well, assuming t() from context might be an issue */}
                {t(region.nameKey, region.key.replace('languageCategory','').charAt(0).toUpperCase() + region.key.replace('languageCategory','').slice(1) || 'Region')}
              </button>
            ))}
          </aside>

          <main className="w-2/3 overflow-y-auto p-4">
            <ul className="space-y-1">
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
               {HARDCODED_DEBUG_LANGUAGES.length === 0 && ( 
                <li className="px-3 py-2 text-sm text-muted-foreground">{t('noLanguagesInRegion', 'No languages listed (Hardcoded).')}</li>
              )}
            </ul>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;
