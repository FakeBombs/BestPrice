// src/hooks/useTranslation.ts
import { useCallback } from 'react';
import { useLanguageContext } from '@/context/LanguageContext';

// Define a type for options, can be extended later
type TranslationOptions = Record<string, string | number>;

export const useTranslation = () => {
  const { language, translations, isLoaded } = useLanguageContext();

  const t = useCallback(
    (key: string, optionsOrFallback?: TranslationOptions | string, fallbackText?: string): string => {
      let effectiveFallback = fallbackText; // Will be used if optionsOrFallback is an object
      let translationOptions: TranslationOptions | undefined = undefined;

      // Determine if the second argument is options or a fallback string
      if (typeof optionsOrFallback === 'string') {
        effectiveFallback = optionsOrFallback;
      } else if (typeof optionsOrFallback === 'object' && optionsOrFallback !== null) {
        translationOptions = optionsOrFallback;
        // If fallbackText is also provided (third arg), it's already assigned to effectiveFallback
      }
      // If only key is provided, optionsOrFallback and effectiveFallback remain undefined from their initial state


      // Handle case where translations are not yet loaded
      if (!isLoaded) {
        let textToReturn = effectiveFallback || key; // Use fallback or key itself
        // Attempt basic interpolation even if not loaded, using the fallback or key
        if (translationOptions && textToReturn) {
            Object.entries(translationOptions).forEach(([optKey, optValue]) => {
                const regex = new RegExp(`{{${optKey}}}`, 'g');
                textToReturn = textToReturn.replace(regex, String(optValue));
            });
        }
        return textToReturn;
      }

      // Try to find the translation in the current language
      let translatedString = translations[language]?.[key];

      // If not found in current language, try English as a fallback language
      if (typeof translatedString === 'undefined' && language !== 'en') {
        translatedString = translations.en?.[key];
      }

      // If still not found (not in current lang or English), use the provided fallback text or the key itself
      if (typeof translatedString === 'undefined') {
        translatedString = effectiveFallback || key;
      }

      // Perform interpolation if options are provided and we have a string to work with
      if (translationOptions && typeof translatedString === 'string') {
        let result = translatedString;
        Object.entries(translationOptions).forEach(([optKey, optValue]) => {
          const regex = new RegExp(`{{${optKey}}}`, 'g');
          result = result.replace(regex, String(optValue));
        });
        return result;
      }

      // If no interpolation needed or possible, return the string (or key/fallback if translation failed)
      return typeof translatedString === 'string' ? translatedString : key;
    },
    [language, translations, isLoaded]
  );

  return { t, language, isLoaded };
};
