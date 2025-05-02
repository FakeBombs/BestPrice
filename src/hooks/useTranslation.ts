
import { useCallback } from 'react';
import { useLanguageContext } from '@/context/LanguageContext';

export const useTranslation = () => {
  const { language, translations, isLoaded } = useLanguageContext();
  
  const t = useCallback((key: string, fallback?: string): string => {
    if (!isLoaded) {
      return fallback || key;
    }
    
    // Try to find the translation in the current language
    const translation = translations[language]?.[key];
    
    // If not found, try English as fallback
    if (!translation && language !== 'en') {
      return translations.en?.[key] || fallback || key;
    }
    
    return translation || fallback || key;
  }, [language, translations, isLoaded]);
  
  return { t, language, isLoaded };
};
