import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

type Language = 'en' | 'el' | 'es' | 'fr' | 'de';
type Translations = Record<string, Record<string, string>>;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
  isLoaded: boolean;
}

const defaultTranslations: Translations = {
  en: {
    // Auth
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    signIn: 'Sign In',
    loggingIn: 'Logging in...',
    emailPlaceholder: 'email@example.com',
    orContinueWith: 'Or continue with',
    google: 'Google',
    facebook: 'Facebook',
    twitter: 'Twitter',
    createAccount: 'Create Account',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    fullName: 'Full Name',
    confirmPassword: 'Confirm Password',
    agreeToTerms: 'I agree to the Terms of Service and Privacy Policy',
    creatingAccount: 'Creating Account...',
    
    // Forgot password
    resetYourPassword: 'Reset Your Password',
    enterEmailForReset: 'Enter your email address and we will send you a link to reset your password.',
    sendResetLink: 'Send Reset Link',
    sendingResetLink: 'Sending...',
    resetPasswordEmailSent: 'Password reset email sent. Please check your inbox.',
    backToLogin: 'Back to Login',
    
    // Reset password
    createNewPassword: 'Create New Password',
    newPassword: 'New Password',
    updatePassword: 'Update Password',
    updating: 'Updating...',
    passwordUpdated: 'Password Updated',
    passwordSuccessfullyChanged: 'Your password has been successfully changed.',
    passwordResetFailed: 'Password Reset Failed',
    errorProcessingRequest: 'There was an error processing your request.',
    passwordTooShort: 'Password Too Short',
    passwordMinLength: 'Password must be at least 6 characters.',
    passwordsDontMatch: 'Passwords Don\'t Match',
    pleaseCheckPasswords: 'Please check that both passwords match.',
    
    // Settings
    languageSettings: 'Language Settings',
    selectLanguage: 'Select Language',
    english: 'English',
    greek: 'Greek',
    spanish: 'Spanish',
    french: 'French',
    german: 'German',
    systemLanguage: 'System Language (Default)',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    
    // Wallet
    wallet: 'Wallet',
    myWallet: 'My Wallet',
    manageWallet: 'Manage your funds, transactions, and ad payments',
    deposit: 'Deposit',
    transactions: 'Transactions',
    connectWallet: 'Connect Wallet',
    addFunds: 'Add Funds',
    amount: 'Amount ($)',
    enterAmount: 'Enter amount',
    paymentMethod: 'Payment Method',
    processing: 'Processing...',
    
    // Account
    myAccount: 'My Account',
    profile: 'Profile',
    favorites: 'Favorites',
    recentlyViewed: 'Recently Viewed',
    priceAlerts: 'Price Alerts',
    settings: 'Settings',
    logout: 'Logout',
    myProfile: 'My Profile',
    managePersonalInfo: 'Manage your personal information',
    name: 'Name',
    memberSince: 'Member since',
    role: 'Role',
    administrator: 'Administrator',
    regularUser: 'Regular User',
    editProfile: 'Edit Profile',
    accountSummary: 'Account Summary',

    // Deals
    deals: 'Deals',
  },
  el: {
    // Greek translations
    email: 'Email',
    password: 'Κωδικός',
    forgotPassword: 'Ξεχάσατε τον κωδικό;',
    signIn: 'Σύνδεση',
    loggingIn: 'Γίνεται σύνδεση...',
    emailPlaceholder: 'email@example.com',
    orContinueWith: 'Ή συνεχίστε με',
    google: 'Google',
    facebook: 'Facebook',
    twitter: 'Twitter',
    createAccount: 'Δημιουργία Λογαριασμού',
    dontHaveAccount: 'Δεν έχετε λογαριασμό;',
    alreadyHaveAccount: 'Έχετε ήδη λογαριασμό;',
    fullName: 'Ονοματεπώνυμο',
    confirmPassword: 'Επαλήθευση Κωδικού',
    agreeToTerms: 'Συμφωνώ με τους Όρους Χρήσης και την Πολιτική Απορρήτου',
    creatingAccount: 'Δημιουργία Λογαριασμού...',
    
    // Greek translations for wallet, account, etc.
    wallet: 'Πορτοφόλι',
    myWallet: 'Το Πορτοφόλι μου',
    manageWallet: 'Διαχείριση κεφαλαίων, συναλλαγών και διαφημίσεων',
    deposit: 'Κατάθεση',
    transactions: 'Συναλλαγές',
    connectWallet: 'Σύνδεση Πορτοφολιού',
    
    // Deals
    deals: 'Προσφορές',
  },
  // Add other languages
  es: {
    // Spanish translations (basic set)
    email: 'Correo electrónico',
    password: 'Contraseña',
    signIn: 'Iniciar sesión',
    createAccount: 'Crear cuenta',
  },
  fr: {
    // French translations (basic set)
    email: 'E-mail',
    password: 'Mot de passe',
    signIn: 'Connexion',
    createAccount: 'Créer un compte',
  },
  de: {
    // German translations (basic set)
    email: 'E-Mail',
    password: 'Passwort',
    signIn: 'Anmelden',
    createAccount: 'Konto erstellen',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  translations: defaultTranslations,
  isLoaded: false,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>(defaultTranslations);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  // Get system language or user preference
  useEffect(() => {
    const detectLanguage = async () => {
      let detectedLang: Language = 'en';
      
      // Check browser language
      const browserLang = navigator.language.split('-')[0];
      if (['en', 'el', 'es', 'fr', 'de'].includes(browserLang)) {
        detectedLang = browserLang as Language;
      }
      
      // If user is logged in, check their preference
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('language')
            .eq('id', user.id)
            .single();
            
          if (data?.language && !error) {
            detectedLang = data.language as Language;
          }
        } catch (error) {
          console.error('Error fetching user language preference:', error);
        }
      }
      
      // Check localStorage (overrides browser and user preference)
      const savedLang = localStorage.getItem('language') as Language;
      if (savedLang && ['en', 'el', 'es', 'fr', 'de'].includes(savedLang)) {
        detectedLang = savedLang;
      }
      
      setLanguageState(detectedLang);
      setIsLoaded(true);
    };
    
    detectLanguage();
  }, [user]);

  // Load custom translations from database
  useEffect(() => {
    const loadCustomTranslations = async () => {
      try {
        // Use a type assertion to bypass TypeScript's type checking
        const { data, error } = await (supabase as any)
          .from('translations')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform data into our translations format
          const customTranslations = { ...defaultTranslations };
          
          data.forEach((item: any) => {
            if (item && item.key) {
              Object.keys(customTranslations).forEach(lang => {
                if (item[lang]) {
                  // Make sure the key exists
                  if (!customTranslations[lang][item.key]) {
                    customTranslations[lang][item.key] = item[lang];
                  }
                }
              });
            }
          });
          
          setTranslations(customTranslations);
        }
      } catch (error) {
        console.error('Error loading translations:', error);
      }
    };
    
    loadCustomTranslations();
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
    
    // If user is logged in, save preference to profile
    if (user) {
      supabase
        .from('profiles')
        .update({ language: lang } as any)
        .eq('id', user.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error saving language preference:', error);
          }
        });
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => useContext(LanguageContext);
