// src/components/LanguageSelectorModal.tsx (AI's code with one minor fallback change)
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageContext } from '@/context/LanguageContext';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { t, language: currentSelectedAppLanguage } = useTranslation(); // Renamed to avoid conflict
  const { setLanguage } = useLanguageContext();
  const [selectedRegion, setSelectedRegion] = useState("suggested");

  if (!isOpen) {
    return null;
  }

  const REGIONS = [
    { key: "suggested", nameKey: "suggestedLanguages" },
    { key: "languageCategoryEurope", nameKey: "languageCategoryEurope" },
    { key: "languageCategoryAmericas", nameKey: "languageCategoryAmericas" },
    { key: "languageCategoryAsia", nameKey: "languageCategoryAsia" },
    { key: "languageCategoryAfrica", nameKey: "languageCategoryAfrica" }
  ];

  const DEBUG_LANG_LIST = [
    { code: 'el', name: 'Ελληνικά' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Español (España)' }
  ];

  const mapLanguageCode = (code: string): 'en' | 'el' | 'es' | 'fr' | 'de' => {
    const baseCode = code.split('-')[0] as 'en' | 'el' | 'es' | 'fr' | 'de';
    // Ensure the baseCode is one of the supported types, otherwise default or handle error
    if (['en', 'el', 'es', 'fr', 'de'].includes(baseCode)) {
        return baseCode;
    }
    console.warn(`mapLanguageCode received an unmappable code: ${code}, returning 'en' as default.`);
    return 'en'; // Default to 'en' if mapping fails
  };

  const handleLanguageSelect = (langCode: string) => {
    const mappedCode = mapLanguageCode(langCode);
    setLanguage(mappedCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[2147483647] flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-background p-0 rounded-lg shadow-xl w-full max-w-2xl h-[80vh] max-h-[600px] flex flex-col overflow-hidden" // Changed p-6 to p-0
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b pb-3"> {/* Moved padding here for header */}
          <div className="flex-1"></div> {/* For centering title */}
          <h2 className="text-xl font-semibold text-center flex-grow"> {/* Changed font-bold to font-semibold */}
            {t('selectYourLanguageTitle', 'Select Your Language')}
          </h2>
          <div className="flex-1 flex justify-end"> {/* To push button to the right */}
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
          <aside className="w-1/3 border-r border-border overflow-y-auto bg-muted/20 p-1"> {/* Added p-1 */}
            <ul className="space-y-1"> {/* Removed py-2 from ul, added space-y-1 */}
              {REGIONS.map(region => (
                <li key={region.key}>
                  <button 
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedRegion === region.key ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-foreground font-normal'}`}
                    onClick={() => setSelectedRegion(region.key)}
                  >
                    {/* Simplified fallback for region name */}
                    {t(region.nameKey, region.key === "suggested" ? t('suggestedLanguages', "Suggested") : region.key.replace('languageCategory', ''))}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <main className="w-2/3 overflow-y-auto p-4">
            <ul className="space-y-1"> {/* Changed space-y-2 to space-y-1 */}
              {DEBUG_LANG_LIST.map((lang) => { // For now, this will not change based on selectedRegion
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
              {/* Logic for "No languages in region" would be added when DEBUG_LANG_LIST is replaced by dynamic list */}
            </ul>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectorModal;
