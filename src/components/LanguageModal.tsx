// src/components/LanguageModal.tsx
import React, { useState, useCallback, useMemo } from 'react'; // useMemo not used yet for lists
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageContext } from '@/context/LanguageContext'; // RE-INTRODUCE THIS

// ... (LanguageOption type, ALL_AVAILABLE_LANGUAGES, LANGUAGE_REGIONS_FOR_MODAL, HARDCODED_DEBUG_LANGUAGES constants remain the same) ...

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { t, language: currentContextLangFromHook, isLoaded } = useTranslation();
  // ===== STEP 2: RE-INTRODUCE useLanguageContext for setLanguage =====
  const { setLanguage: setContextLanguage } = useLanguageContext(); 
  
  const [selectedRegion, setSelectedRegion] = useState<string>("suggested");

  // const currentContextLangForSort = isLoaded ? currentContextLangFromHook : 'en'; // Not needed yet

  if (!isOpen) return null;

  const handleLanguageChange = (langCode: string) => {
    const simpleLangCode = langCode.split('-')[0] as 'en' | 'el' | 'es' | 'fr' | 'de';
    if (['en', 'el', 'es', 'fr', 'de'].includes(simpleLangCode)) {
        setContextLanguage(simpleLangCode); // Now uses the real context function
    } else {
        console.warn(`Unsupported language code: ${langCode}. Attempting to use base code.`);
        if (['en', 'el', 'es', 'fr', 'de'].includes(simpleLangCode)){
            setContextLanguage(simpleLangCode);
        }
    }
    onClose();
  };

  // Still using hardcoded list for display for this step
  const languagesToDisplayInJSX = HARDCODED_DEBUG_LANGUAGES; 

  console.log("DEBUG: LanguageModal (Step 2 Re-intro useLanguageContext). isLoaded:", isLoaded, "currentLang:", currentContextLangFromHook);

  return (
    // ... (JSX remains the same as Step 1) ...
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

export default LanguageModal;
