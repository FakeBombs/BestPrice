
import React, { useState, useMemo } from 'react';
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

// Define all available languages
const ALL_AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'el', name: 'Ελληνικά', englishName: 'Greek', regionKey: 'languageCategoryEurope' },
  { code: 'en-US', name: 'English (US)', englishName: 'English (US)', regionKey: 'languageCategoryAmericas' },
  { code: 'es-ES', name: 'Español (España)', englishName: 'Spanish (Spain)', regionKey: 'languageCategoryEurope' },
  { code: 'es-MX', name: 'Español (México)', englishName: 'Spanish (Mexico)', regionKey: 'languageCategoryAmericas' },
  { code: 'fr-FR', name: 'Français (France)', englishName: 'French (France)', regionKey: 'languageCategoryEurope' },
  { code: 'fr-CA', name: 'Français (Canada)', englishName: 'French (Canada)', regionKey: 'languageCategoryAmericas' },
  { code: 'de', name: 'Deutsch', englishName: 'German', regionKey: 'languageCategoryEurope' },
  { code: 'it', name: 'Italiano', englishName: 'Italian', regionKey: 'languageCategoryEurope' },
  { code: 'pt-BR', name: 'Português (Brasil)', englishName: 'Portuguese (Brazil)', regionKey: 'languageCategoryAmericas' },
  { code: 'pt-PT', name: 'Português (Portugal)', englishName: 'Portuguese (Portugal)', regionKey: 'languageCategoryEurope' },
  { code: 'ru', name: 'Русский', englishName: 'Russian', regionKey: 'languageCategoryEurope' },
  { code: 'ja', name: '日本語', englishName: 'Japanese', regionKey: 'languageCategoryAsia' },
  { code: 'zh-CN', name: '简体中文', englishName: 'Chinese (Simplified)', regionKey: 'languageCategoryAsia' },
  { code: 'zh-TW', name: '繁體中文', englishName: 'Chinese (Traditional)', regionKey: 'languageCategoryAsia' },
  { code: 'ko', name: '한국어', englishName: 'Korean', regionKey: 'languageCategoryAsia' },
  { code: 'ar', name: 'العربية', englishName: 'Arabic', regionKey: 'languageCategoryAfrica' },
  { code: 'hi', name: 'हिंदी', englishName: 'Hindi', regionKey: 'languageCategoryAsia' },
  { code: 'tr', name: 'Türkçe', englishName: 'Turkish', regionKey: 'languageCategoryEurope' },
  { code: 'nl', name: 'Nederlands', englishName: 'Dutch', regionKey: 'languageCategoryEurope' },
  { code: 'pl', name: 'Polski', englishName: 'Polish', regionKey: 'languageCategoryEurope' },
  { code: 'sv', name: 'Svenska', englishName: 'Swedish', regionKey: 'languageCategoryEurope' },
  { code: 'da', name: 'Dansk', englishName: 'Danish', regionKey: 'languageCategoryEurope' },
  { code: 'fi', name: 'Suomi', englishName: 'Finnish', regionKey: 'languageCategoryEurope' }
];

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { t, language: currentContextLangFromHook } = useTranslation();
  const { setLanguage: setContextLanguage } = useLanguageContext();
  const [selectedRegion, setSelectedRegion] = useState<string>("suggested");

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Helper function to map full language code to base code
  const mapLanguageCode = (fullCode: string): 'en' | 'el' | 'es' | 'fr' | 'de' => {
    const baseCode = fullCode.split('-')[0] as 'en' | 'el' | 'es' | 'fr' | 'de';
    if (['en', 'el', 'es', 'fr', 'de'].includes(baseCode)) {
      return baseCode;
    }
    console.warn(`Unsupported language code: ${fullCode}, defaulting to English`);
    return 'en';
  };

  // Derive suggested languages list
  const suggestedLangsToDisplay = useMemo(() => {
    return ALL_AVAILABLE_LANGUAGES.filter(lang => 
      ['el', 'en-US', 'es-ES', 'fr-FR', 'de'].includes(lang.code)
    );
  }, []);

  // Derive languages to display based on selected region
  const languagesToDisplay = useMemo(() => {
    let filteredLangs: LanguageOption[];
    
    if (selectedRegion === "suggested") {
      filteredLangs = [...suggestedLangsToDisplay];
    } else {
      filteredLangs = [...ALL_AVAILABLE_LANGUAGES.filter(lang => 
        lang.regionKey === selectedRegion
      )];
    }
    
    // Sort alphabetically by name in the current language context
    return filteredLangs.sort((a, b) => 
      a.name.localeCompare(b.name, currentContextLangFromHook || 'en')
    );
  }, [selectedRegion, suggestedLangsToDisplay, currentContextLangFromHook]);

  // Handle language selection
  const handleLanguageChange = (langCode: string) => {
    const baseCode = mapLanguageCode(langCode);
    setContextLanguage(baseCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[2147483647] p-4" onClick={onClose}>
      <div 
        className="bg-background rounded-lg shadow-xl w-full max-w-2xl h-[80vh] max-h-[600px] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border relative">
          <h3 className="text-xl font-semibold text-center">{t('selectYourLanguageTitle', 'Select Your Language')}</h3>
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
                {t(region.nameKey, region.key === "suggested" ? 'Suggested' : region.key.replace('languageCategory', ''))}
              </button>
            ))}
          </aside>

          <main className="w-2/3 overflow-y-auto p-4">
            <ul className="space-y-1">
              {languagesToDisplay.map((lang) => (
                <li key={lang.code}>
                  <button
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary
                      ${currentContextLangFromHook === mapLanguageCode(lang.code) ? 'font-semibold text-primary' : 'text-foreground'}`}
                  >
                    {lang.name}
                    {currentContextLangFromHook === mapLanguageCode(lang.code) && <span className="ml-2">✓</span>}
                  </button>
                </li>
              ))}
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
