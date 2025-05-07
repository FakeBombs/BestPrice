
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageContext } from '@/context/LanguageContext';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageContext();
  const [selectedRegion, setSelectedRegion] = useState("suggested");

  // If modal is not open, don't render anything
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

  // Helper to convert language codes to app's supported languages
  const mapLanguageCode = (code: string): 'en' | 'el' | 'es' | 'fr' | 'de' => {
    // Extract base language code (e.g., 'en' from 'en-US')
    const baseCode = code.split('-')[0] as 'en' | 'el' | 'es' | 'fr' | 'de';
    return baseCode;
  };

  const handleLanguageSelect = (langCode: string) => {
    const mappedCode = mapLanguageCode(langCode);
    setLanguage(mappedCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[2147483647] flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-background p-6 rounded-lg shadow-xl w-full max-w-2xl h-[80vh] max-h-[600px] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <div className="flex-1"></div>
          <h2 className="text-xl font-bold text-center flex-grow">
            {t('selectYourLanguageTitle', 'Select Your Language')}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label={t('close', 'Close')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar */}
          <div className="w-1/3 border-r overflow-y-auto bg-muted/20">
            <ul className="py-2">
              {REGIONS.map(region => (
                <li key={region.key}>
                  <button 
                    className={`w-full text-left px-4 py-2 ${selectedRegion === region.key ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedRegion(region.key)}
                  >
                    {t(region.nameKey, region.nameKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right main panel */}
          <div className="w-2/3 overflow-y-auto p-4">
            <ul className="space-y-2">
              {DEBUG_LANG_LIST.map((lang) => {
                const mappedCode = mapLanguageCode(lang.code);
                const isActive = language === mappedCode;
                
                return (
                  <li key={lang.code}>
                    <button 
                      className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-md border ${isActive ? 'border-primary bg-primary/5' : 'hover:bg-gray-50 border-transparent'}`}
                      onClick={() => handleLanguageSelect(lang.code)}
                    >
                      <span>{lang.name}</span>
                      {isActive && (
                        <span className="text-primary">✓</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectorModal;
