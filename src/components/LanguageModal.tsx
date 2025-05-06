// src/components/LanguageModal.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageContext } from '@/context/LanguageContext';

// Define these constants outside the component
type LanguageOption = {
  code: string; 
  name: string; 
  englishName: string;
  regionKey: string; 
};

const ALL_AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'el', name: 'Ελληνικά', englishName: 'Greek', regionKey: 'languageCategoryEurope' },
  { code: 'en-US', name: 'English (US)', englishName: 'English (US)', regionKey: 'languageCategoryAmericas' },
  { code: 'es-ES', name: 'Español (España)', englishName: 'Spanish (Spain)', regionKey: 'languageCategoryEurope' },
  { code: 'sq', name: 'Shqip', englishName: 'Albanian', regionKey: 'languageCategoryEurope' },
  { code: 'en-GB', name: 'English (UK)', englishName: 'English (UK)', regionKey: 'languageCategoryEurope' },
  { code: 'fr-FR', name: 'Français (France)', englishName: 'French (France)', regionKey: 'languageCategoryEurope' },
  { code: 'de-DE', name: 'Deutsch', englishName: 'German', regionKey: 'languageCategoryEurope' },
  { code: 'it-IT', name: 'Italiano', englishName: 'Italian', regionKey: 'languageCategoryEurope' },
  { code: 'pt-PT', name: 'Português (Portugal)', englishName: 'Portuguese (Portugal)', regionKey: 'languageCategoryEurope' },
  { code: 'es-MX', name: 'Español (México)', englishName: 'Spanish (Mexico)', regionKey: 'languageCategoryAmericas' },
  { code: 'pt-BR', name: 'Português (Brasil)', englishName: 'Portuguese (Brazil)', regionKey: 'languageCategoryAmericas' },
  { code: 'fr-CA', name: 'Français (Canada)', englishName: 'French (Canada)', regionKey: 'languageCategoryAmericas' },
  { code: 'ja', name: '日本語', englishName: 'Japanese', regionKey: 'languageCategoryAsia' },
  { code: 'ko', name: '한국어', englishName: 'Korean', regionKey: 'languageCategoryAsia' },
  { code: 'zh-CN', name: '中文(简体)', englishName: 'Chinese (Simplified)', regionKey: 'languageCategoryAsia' },
  { code: 'zh-TW', name: '中文(台灣)', englishName: 'Chinese (Traditional)', regionKey: 'languageCategoryAsia' },
  { code: 'hi', name: 'हिन्दी', englishName: 'Hindi', regionKey: 'languageCategoryAsia' },
  { code: 'ar', name: 'العربية', englishName: 'Arabic', regionKey: 'languageCategoryAfrica' },
  { code: 'he', name: 'עברית', englishName: 'Hebrew', regionKey: 'languageCategoryAfrica' },
  { code: 'tr', name: 'Türkçe', englishName: 'Turkish', regionKey: 'languageCategoryAfrica' },
  { code: 'sw', name: 'Kiswahili', englishName: 'Swahili', regionKey: 'languageCategoryAfrica' },
  // You would expand this list significantly
];

const LANGUAGE_REGIONS_FOR_MODAL = [
    { key: "suggested", nameKey: "suggestedLanguages" },
    { key: "languageCategoryEurope", nameKey: "languageCategoryEurope" },
    { key: "languageCategoryAmericas", nameKey: "languageCategoryAmericas" },
    { key: "languageCategoryAsia", nameKey: "languageCategoryAsia" },
    { key: "languageCategoryAfrica", nameKey: "languageCategoryAfrica" },
];

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { t, language: currentContextLangFromHook, isLoaded } = useTranslation();
  const { setLanguage: setContextLanguage } = useLanguageContext();
  const [selectedRegion, setSelectedRegion] = useState<string>("suggested");

  // This variable is not used if filtering and sorting are commented out,
  // but keeping it for when we re-add them.
  const currentContextLangForSort = isLoaded ? currentContextLangFromHook : 'en';

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

  const suggestedLangsToDisplay = useMemo(() => {
    console.log("DEBUG: suggestedLangsToDisplay useMemo triggered");
    return ALL_AVAILABLE_LANGUAGES.filter(lang => 
        ['el', 'en-US', 'sq', 'es-ES'].includes(lang.code) 
    );
  }, []); 

  // ***** DEBUGGING STEP 2b: Test with ONLY suggestedLangsToDisplay *****
  const languagesToDisplay = useMemo(() => {
    console.log("DEBUG Attempt B: languagesToDisplay (ONLY suggested).");
    // SIMPLIFY FURTHER: ALWAYS return only suggestedLangsToDisplay
    return suggestedLangsToDisplay;
    
    // --- ORIGINAL COMPLEX LOGIC (COMMENTED OUT FOR DEBUGGING) ---
    // let listToFilter;
    // if (selectedRegion === "suggested") {
    //     listToFilter = suggestedLangsToDisplay;
    // } else {
    //     listToFilter = ALL_AVAILABLE_LANGUAGES.filter(lang => lang.regionKey === selectedRegion);
    // }
    // return [...listToFilter].sort((a,b) => a.name.localeCompare(b.name, currentContextLangForSort || 'en'));
  }, [suggestedLangsToDisplay]); // Dependency is ONLY on the stable suggestedLangsToDisplay


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
                onClick={() => setSelectedRegion(region.key)} // This will not affect the displayed list in this test version
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary
                  ${selectedRegion === region.key ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted/80'}`}
              >
                {t(region.nameKey, region.key === "suggested" ? t('suggestedLanguages', 'Suggested') : t(region.nameKey, region.key.replace('languageCategory','')))}
              </button>
            ))}
          </aside>

          <main className="w-2/3 overflow-y-auto p-4">
            <ul className="space-y-1">
              {languagesToDisplay.map((lang) => ( // This will now use the further simplified list
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
               {/* This condition might always be false now, or the list won't be empty, depending on suggestedLangsToDisplay */}
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

export default LanguageModal;
