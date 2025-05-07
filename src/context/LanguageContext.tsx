import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback
} from 'react';
import { useAuth } from '@/hooks/useAuth'; // Ensure this path is correct
import { supabase } from '@/integrations/supabase/client'; // Ensure this path is correct

// Import the assembled default translations and the AllTranslations type
import initialDefaultTranslations, { AllTranslations } from '@/locales'; // Adjust path if your locales folder is elsewhere

// Define the base language codes your context will manage
type Language = keyof AllTranslations; // 'en' | 'el' | 'es' | 'fr' | 'de' (derived from AllTranslations keys)

// Define the type for the context value
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: AllTranslations; // Use the imported AllTranslations type
  isLoaded: boolean;
}

// Create the context with initial values
const LanguageContext = createContext<LanguageContextType>({
  language: 'el', // Your default application language
  setLanguage: (lang: Language) => {
    console.warn(
      `Attempted to call setLanguage with '${lang}' outside of a LanguageProvider.`
    );
  },
  translations: initialDefaultTranslations, // Use the imported defaults
  isLoaded: false,
});

// Language Provider Component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('el'); // Default language
  const [translations, setTranslationsState] = useState<AllTranslations>(initialDefaultTranslations);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  const VALID_LANGUAGES = Object.keys(initialDefaultTranslations) as Language[];

  useEffect(() => {
    const detectLanguage = async () => {
      let detectedLang: Language = 'el'; // Fallback default
      const browserLang = navigator.language.split('-')[0];

      if (VALID_LANGUAGES.includes(browserLang as Language)) {
        detectedLang = browserLang as Language;
      }

      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('language')
            .eq('id', user.id)
            .single();
          if (data?.language && !error && VALID_LANGUAGES.includes(data.language as Language)) {
            detectedLang = data.language as Language;
          } else if (error) {
            console.error('Error fetching user language preference from DB:', error);
          }
        } catch (fetchError) {
          console.error('Exception fetching user language preference:', fetchError);
        }
      }

      const savedLang = localStorage.getItem('language');
      if (savedLang && VALID_LANGUAGES.includes(savedLang as Language)) {
        detectedLang = savedLang as Language;
      }

      setLanguageState(detectedLang);
      setIsLoaded(true);
    };
    detectLanguage();
  }, [user, VALID_LANGUAGES]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    const loadCustomTranslations = async () => {
      const newMergedTranslations = JSON.parse(JSON.stringify(initialDefaultTranslations)) as AllTranslations;
      try {
        const { data, error } = await (supabase as any).from('translations').select('*');
        if (error) {
          console.error('Error fetching custom translations:', error.message || error);
          setTranslationsState(newMergedTranslations);
          return;
        }
        if (data && data.length > 0) {
          data.forEach((item: any) => {
            if (item && item.key) {
              (Object.keys(newMergedTranslations) as Language[]).forEach(langCode => {
                if (item[langCode] && typeof item[langCode] === 'string') {
                  if (newMergedTranslations[langCode] &&
                      Object.prototype.hasOwnProperty.call(newMergedTranslations[langCode], item.key)) {
                     (newMergedTranslations[langCode] as Record<string, string>)[item.key] = item[langCode];
                  }
                }
              });
            }
          });
        }
        setTranslationsState(newMergedTranslations);
      } catch (processingError) {
        console.error('Error processing custom translations:', processingError);
        setTranslationsState(newMergedTranslations);
      }
    };
    loadCustomTranslations();
  }, [isLoaded]); // Removed VALID_LANGUAGES as initialDefaultTranslations is stable from module scope

  const setLanguageCallback = useCallback((lang: Language) => {
    if (!VALID_LANGUAGES.includes(lang)) {
      console.warn(`Attempted to set an invalid language: ${lang}`);
      return;
    }
    localStorage.setItem('language', lang);
    setLanguageState(lang);
    if (user) {
      supabase
        .from('profiles')
        .update({ language: lang } as any)
        .eq('id', user.id)
        .then(({ error: updateError }) => {
          if (updateError) {
            console.error('Error saving language preference to DB:', updateError);
          }
        });
    }
  }, [user, VALID_LANGUAGES]);

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: setLanguageCallback,
        translations,
        isLoaded
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to consume the context
export const useLanguageContext = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider.');
  }
  return context;
};
