import { useCallback } from 'react';
import { useLanguageContext } from '@/context/LanguageContext';

// Define a type for options, can be extended later
type TranslationOptions = Record<string, string | number>;

// A very basic plural selector for English/Greek like languages
// It's defined outside the hook as it doesn't depend on hook state.
const getPluralSuffix = (count: number, lang: string): string => {
  // This is a simplified example. Real i18n libraries have more robust plural rule sets.
  // For many European languages (including English and Greek):
  // Add more language-specific rules here if needed.
  // For now, we'll use a simple one/other distinction.
  if (count === 1) {
    return '_one';
  }
  return '_other';
  // Note: Languages like Polish, Russian, Arabic etc., have more complex plural forms.
  // This simple function would need to be expanded for full i18n support for those.
};

export const useTranslation = () => {
  const { language, translations, isLoaded } = useLanguageContext();

  const t = useCallback(
    (key: string, optionsOrFallback?: TranslationOptions | string, fallbackText?: string): string => {
      let effectiveFallback = typeof fallbackText === 'string' ? fallbackText : undefined;
      let translationOptions: TranslationOptions | undefined = undefined;

      // Determine if the second argument is options or a fallback string
      if (typeof optionsOrFallback === 'string') {
        // If effectiveFallback is already set (from 3rd arg), prioritize that.
        // Otherwise, use optionsOrFallback as the fallback.
        if (effectiveFallback === undefined) {
            effectiveFallback = optionsOrFallback;
        }
      } else if (typeof optionsOrFallback === 'object' && optionsOrFallback !== null) {
        translationOptions = optionsOrFallback;
        // If fallbackText (3rd arg) was provided, it's already assigned to effectiveFallback
      }
      // If only key is provided, effectiveFallback is undefined, optionsOrFallback is undefined.

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

      // --- Translation Logic ---
      let translatedString: string | undefined = undefined;
      const currentLanguageTranslations = translations[language];
      const englishFallbackTranslations = translations.en; // Assuming 'en' is your primary fallback

      // 1. Attempt Pluralization if 'count' option is present
      if (translationOptions && typeof translationOptions.count === 'number' && currentLanguageTranslations) {
        const pluralSuffix = getPluralSuffix(translationOptions.count, language);
        const pluralKey = `${key}${pluralSuffix}`; // e.g., gifts_total_count_one or gifts_total_count_other

        // Try specific plural key in current language
        if (currentLanguageTranslations[pluralKey] !== undefined) {
          translatedString = currentLanguageTranslations[pluralKey];
        }
        // Try specific plural key in English fallback language
        else if (language !== 'en' && englishFallbackTranslations && englishFallbackTranslations[pluralKey] !== undefined) {
          translatedString = englishFallbackTranslations[pluralKey];
        }
      }

      // 2. If pluralized string not found (or no count option), try base key in current language
      if (translatedString === undefined && currentLanguageTranslations && currentLanguageTranslations[key] !== undefined) {
        translatedString = currentLanguageTranslations[key];
      }

      // 3. If base key not found in current language, try base key in English fallback language
      if (translatedString === undefined && language !== 'en' && englishFallbackTranslations && englishFallbackTranslations[key] !== undefined) {
        translatedString = englishFallbackTranslations[key];
      }

      // 4. If still not found, use the effective fallback or the key itself
      if (translatedString === undefined) {
        translatedString = effectiveFallback || key;
      }

      // 5. Perform interpolation
      if (translationOptions && typeof translatedString === 'string') {
        let result = translatedString;
        Object.entries(translationOptions).forEach(([optKey, optValue]) => {
          const regex = new RegExp(`{{${optKey}}}`, 'g');
          result = result.replace(regex, String(optValue));
        });
        return result;
      }

      // Return the string (or key/fallback if all attempts failed or no interpolation needed)
      return typeof translatedString === 'string' ? translatedString : key;
    },
    [language, translations, isLoaded]
  );

  return { t, language, isLoaded };
};
