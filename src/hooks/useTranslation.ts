import { useCallback } from 'react';
import { useLanguageContext } from '@/context/LanguageContext';

type TranslationOptions = Record<string, string | number>;

const getPluralSuffix = (count: number, lang: string): string => {
  // This is a simplified plural rule for languages like English and Greek.
  if (count === 1) {
    return '_one';
  }
  return '_other';
};

export const useTranslation = () => {
  const { language, translations, isLoaded } = useLanguageContext();

  const t = useCallback(
    (key: string, optionsOrFallback?: TranslationOptions | string, fallbackText?: string): string => {
      let effectiveFallback = typeof fallbackText === 'string' ? fallbackText : undefined;
      let translationOptions: TranslationOptions | undefined = undefined;

      if (typeof optionsOrFallback === 'string') {
        if (effectiveFallback === undefined) {
            effectiveFallback = optionsOrFallback;
        }
      } else if (typeof optionsOrFallback === 'object' && optionsOrFallback !== null) {
        translationOptions = optionsOrFallback;
      }

      // If translations not loaded, attempt to interpolate options into fallback or key
      if (!isLoaded) {
        let textToReturn = effectiveFallback || key; // Use explicit fallback or key
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
      const englishFallbackTranslations = translations.en; // Assuming 'en' is your primary fallback language

      // 1. Attempt Pluralization if 'count' option is present
      if (translationOptions && typeof translationOptions.count === 'number') {
        const countValue = translationOptions.count;
        const pluralSuffix = getPluralSuffix(countValue, language);
        const pluralKey = `${key}${pluralSuffix}`; // e.g., gifts_total_count_one

        // Try specific plural key in current language
        if (currentLanguageTranslations && currentLanguageTranslations[pluralKey] !== undefined) {
          translatedString = currentLanguageTranslations[pluralKey];
        }
        // Try specific plural key in English fallback language (if current is not English)
        else if (language !== 'en' && englishFallbackTranslations && englishFallbackTranslations[pluralKey] !== undefined) {
          translatedString = englishFallbackTranslations[pluralKey];
        }
      }

      // 2. If pluralized string not found (or no count option), try base key in current language
      if (translatedString === undefined) {
        if (currentLanguageTranslations && currentLanguageTranslations[key] !== undefined) {
          translatedString = currentLanguageTranslations[key];
        }
        // 3. If base key not found in current language, try base key in English fallback language
        else if (language !== 'en' && englishFallbackTranslations && englishFallbackTranslations[key] !== undefined) {
          translatedString = englishFallbackTranslations[key];
        }
      }

      // 4. If still not found, use the effective fallback (passed in args) or the key itself
      if (translatedString === undefined) {
        // When only key and options are passed to t(), effectiveFallback will be undefined here.
        // So it will default to returning the 'key' if no translation is found.
        translatedString = effectiveFallback || key;
      }

      // 5. Perform interpolation on the resolved string
      if (translationOptions && typeof translatedString === 'string') {
        let result = translatedString;
        Object.entries(translationOptions).forEach(([optKey, optValue]) => {
          const regex = new RegExp(`{{${optKey}}}`, 'g');
          result = result.replace(regex, String(optValue));
        });
        return result;
      }

      // Return the string (or key if all attempts failed or no interpolation needed)
      return typeof translatedString === 'string' ? translatedString : key;
    },
    [language, translations, isLoaded]
  );

  return { t, language, isLoaded };
};
