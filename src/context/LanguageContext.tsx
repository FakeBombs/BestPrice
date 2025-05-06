import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

type Language = 'en' | 'el' | 'es' | 'fr' | 'de';
type Translations = Record<string, Record<string, string>>; // Key: language code, Value: {translationKey: translatedString}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
  isLoaded: boolean;
}

const defaultTranslations: Translations = {
  en: {
    // Auth (Existing)
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    register: 'Register',
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
    resetYourPassword: 'Reset Your Password',
    enterEmailForReset: 'Enter your email address and we will send you a link to reset your password.',
    sendResetLink: 'Send Reset Link',
    sendingResetLink: 'Sending...',
    resetPasswordEmailSent: 'Password reset email sent. Please check your inbox.',
    backToLogin: 'Back to Login',
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
    languageSettings: 'Language Settings',
    selectLanguage: 'Select Language',
    english: 'English',
    greek: 'Greek',
    spanish: 'Spanish',
    french: 'French',
    german: 'German',
    systemLanguage: 'System Language (Default)',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
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
    categories: 'Categories',
    gifts: 'Gifts',
    deals: 'Deals',
    clearFilters: 'Clear filters',
    finalPrice: 'Final price',

    // --- Main Categories (English) ---
    'technology': 'Technology',
    'home-garden': 'Home & Garden',
    'fashion': 'Fashion',
    'health-beauty': 'Health & Beauty',
    'kids-baby': 'Kids & Baby',
    'hobby-sports': 'Hobby & Sports',
    'auto-moto': 'Auto & Moto',

    // --- Subcategories of Τεχνολογία (English) ---
    'mobile-telephony': 'Mobile Telephony',
    'computers': 'Computers',
    'laptops-accessories': 'Laptops & Accessories',
    'visual': 'Visual', // Changed from 'image' to be more descriptive for English
    'smartwatches-wearables': 'Smartwatches & Wearables',
    'tablets-accessories': 'Tablets & Accessories',
    'video-games': 'Video Games',
    'audio': 'Audio',
    'photo-video': 'Photo & Video',
    'electronics': 'Electronics', // Changed from 'consumer-electronics' for brevity
    'telephony': 'Telephony', // General telephony
    'gadgets': 'Gadgets',

    // --- Subcategories of Σπίτι & Κήπος (English) ---
    'home-appliances': 'Home Appliances',
    'tools': 'Tools',
    'furniture': 'Furniture',
    'garden': 'Garden',
    'home-items': 'Home Items',
    'linens': 'Linens', // Changed from 'home-linens'
    'lighting': 'Lighting',
    'kitchenware': 'Kitchenware', // Changed from 'kitchen-items'
    'food-beverages': 'Food & Beverages',
    'electrical-supplies': 'Electrical Supplies', // Changed
    'smoking-accessories': 'Smoking Accessories', // Changed
    'office-supplies': 'Office Supplies', // Changed
    'gift-items': 'Gift Items',
    'security-systems': 'Security Systems',
    'professional-equipment': 'Professional Equipment',
    'seasonal-items': 'Seasonal Items',
    'shopping-bags': 'Shopping Bags',
    'shopping-trolleys': 'Shopping Trolleys',
    'church-items': 'Church Items',
    'pet-supplies': 'Pet Supplies', // For Home & Garden context

    // --- Subcategories of Μόδα (English) ---
    'womens-fashion': "Women's Fashion",
    'mens-fashion': "Men's Fashion",
    'watches': 'Watches',
    'jewelry': 'Jewelry',
    'eyewear': 'Eyewear', // Using 'eyewear' as it's more common than 'opticals'
    'converse-all-star': 'Converse All Star',
    'rain-umbrellas': 'Rain Umbrellas',
    'shoe-accessories': 'Shoe Accessories',
    'kids-baby-fashion': "Kids & Baby Fashion", // For Fashion context
    'sneakers': 'Sneakers', // Slug was already 'sneakers'

    // --- Subcategories of Υγεία & Ομορφιά (English) ---
    'grooming': 'Grooming',
    'pharmacy-products': 'Pharmacy Products',
    'perfumes': 'Perfumes',
    'dietary-supplements': 'Dietary Supplements',
    'grooming-devices': 'Grooming Devices',
    'makeup': 'Makeup',
    'sunscreen-tanning': 'Sunscreen & Tanning',
    'medical-supplies': 'Medical Supplies',
    'manicure-pedicure': 'Manicure & Pedicure',
    'oral-hygiene': 'Oral Hygiene',
    'sex-toys': 'Sex Toys',
    'firming-slimming': 'Firming & Slimming',
    'cannabis-products': 'Cannabis Products',
    'orthopedics': 'Orthopedics',
    'patient-aids': 'Patient Aids',
    'optics': 'Optics', // Using 'optics' for Health context, matches one of your examples
    'korean-cosmetics': 'Korean Cosmetics',

    // --- Subcategories of Παιδικά - Βρεφικά (English) ---
    // 'kids-baby-fashion' already defined under Fashion, assuming same key is fine if content differs by parent
    'kids-toys': "Kids' Toys",
    'school-supplies': 'School Supplies',
    'baby-toys': 'Baby Toys',
    'baby-items': 'Baby Items',
    'kids-linens': "Kids' Linens",
    'christening-items': 'Christening Items',
    'kids-watches': "Kids' Watches",

    // --- Subcategories of Hobby, Αθλητισμός (English) ---
    'sports': 'Sports',
    'cycling': 'Cycling',
    'leisure-time': 'Leisure Time',
    'fishing-diving': 'Fishing & Diving',
    'beach-sea-items': 'Beach & Sea Items',
    'camping': 'Camping',
    'travel-items-bags': 'Travel Items & Bags',
    'books': 'Books',
    'hunting': 'Hunting',
    'fitness-equipment': 'Fitness Equipment',
    'pet-supplies-hobby': 'Pet Supplies (Hobby)', // Differentiated
    'drones-accessories': 'Drones & Accessories',
    'electric-scooters': 'Electric Scooters',
    'hoverboards': 'Hoverboards',
    'musical-instruments': 'Musical Instruments',
    'sports-accessories': 'Sports Accessories',
    'exploration-items': 'Exploration Items',
    'womens-sportswear': "Women's Sportswear",
    'womens-sports-shoes': "Women's Sports Shoes",
    'mens-sportswear': "Men's Sportswear",
    'mens-sports-shoes': "Men's Sports Shoes",

    // --- Subcategories of Μηχανοκίνηση (English) ---
    'car': 'Car',
    'motorcycle': 'Motorcycle',
    'boat': 'Boat',
    'truck-items': 'Truck Items',

    // --- Subcategories of Κινητή Τηλεφωνία (parentId: 10) (English) ---
    'smartphones': 'Smartphones',
    'iphone': 'iPhone',
    'mobile-cases': 'Mobile Cases',
    'bluetooth-handsfree': 'Bluetooth Handsfree',
    'handsfree': 'Handsfree',
    'mobile-chargers': 'Mobile Chargers',
    'tempered-glass': 'Tempered Glass',
    'screen-protectors': 'Screen Protectors',
    'power-banks': 'Power Banks',
    'mobile-batteries': 'Mobile Batteries',
    'selfie-sticks': 'Selfie Sticks',
    'mobile-holders': 'Mobile Holders',
    'charging-data-cables': 'Charging & Data Cables',
    'anti-lost-trackers': 'Anti-Lost Trackers',
    'mobile-spare-parts': 'Mobile Spare Parts',
    'mobile-gimbals': 'Mobile Gimbals',
    'stylus-pens': 'Stylus Pens',
    'stylus-accessories': 'Stylus Accessories',
    'bluetooth-headset-accessories': 'Bluetooth Headset Accessories',
    'anti-lost-tracker-accessories': 'Anti-Lost Tracker Accessories',
    'pop-sockets': 'Pop Sockets',
    'mobile-tripods': 'Mobile Tripods',
    'mobile-service-tools': 'Mobile Service Tools',
    'mobile-charms': 'Mobile Charms',
    'mobile-accessories': 'Mobile Accessories',
    'mobile-camera-protection': 'Mobile Camera Protection',
    'mobile-camera-lenses': 'Mobile Camera Lenses',
    'mobile-signal-boosters': 'Mobile Signal Boosters',
    'mobile-gaming-buttons': 'Mobile Gaming Buttons',
    'connection-packs': 'Connection Packs',
    'portable-bluetooth-speakers-mobile': 'Portable Bluetooth Speakers (Mobile)',

    // ... AND SO ON FOR ALL OTHER CATEGORIES ...
    // This will be a very long list. I will add a few more examples for deeper levels.

    // Example for nested: Subcategories of Ηλεκτρονικά Παιχνίδια (parentId: 179)
    'ps5-games': 'PS5 Games',
    'pc-games': 'PC Games',

    // Example for nested: Subcategories of Home Audio (parentId: 193)
    'amplifiers-preamplifiers': 'Amplifiers & Preamplifiers',
    'hi-fi-systems': 'Hi-Fi Systems',
    // 'soundbars' // Assuming this slug is used for Soundbar under Home Cinema as well for consistency
  },
  el: {
    // Auth (Existing)
    email: 'Email',
    password: 'Κωδικός',
    forgotPassword: 'Ξεχάσατε τον κωδικό;',
    register: 'Εγγραφή',
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
    resetYourPassword: 'Επαναφορά Κωδικού',
    enterEmailForReset: 'Εισαγάγετε το email σας και θα σας στείλουμε έναν σύνδεσμο για επαναφορά του κωδικού σας.',
    sendResetLink: 'Αποστολή Συνδέσμου',
    sendingResetLink: 'Αποστολή...',
    resetPasswordEmailSent: 'Το email επαναφοράς κωδικού στάλθηκε. Ελέγξτε τα εισερχόμενά σας.',
    backToLogin: 'Επιστροφή στη Σύνδεση',
    createNewPassword: 'Δημιουργία Νέου Κωδικού',
    newPassword: 'Νέος Κωδικός',
    updatePassword: 'Ενημέρωση Κωδικού',
    updating: 'Ενημέρωση...',
    passwordUpdated: 'Ο Κωδικός Ενημερώθηκε',
    passwordSuccessfullyChanged: 'Ο κωδικός σας άλλαξε επιτυχώς.',
    passwordResetFailed: 'Η Επαναφορά Κωδικού Απέτυχε',
    errorProcessingRequest: 'Παρουσιάστηκε σφάλμα κατά την επεξεργασία του αιτήματός σας.',
    passwordTooShort: 'Πολύ Κοντός Κωδικός',
    passwordMinLength: 'Ο κωδικός πρέπει να είναι τουλάχιστον 6 χαρακτήρες.',
    passwordsDontMatch: 'Οι Κωδικοί δεν Ταιριάζουν',
    pleaseCheckPasswords: 'Ελέγξτε ότι οι δύο κωδικοί ταιριάζουν.',
    languageSettings: 'Ρυθμίσεις Γλώσσας',
    selectLanguage: 'Επιλογή Γλώσσας',
    english: 'Αγγλικά',
    greek: 'Ελληνικά',
    spanish: 'Ισπανικά',
    french: 'Γαλλικά',
    german: 'Γερμανικά',
    systemLanguage: 'Γλώσσα Συστήματος (Προεπιλογή)',
    save: 'Αποθήκευση',
    cancel: 'Άκυρο',
    loading: 'Φόρτωση...',
    success: 'Επιτυχία',
    error: 'Σφάλμα',
    wallet: 'Πορτοφόλι',
    myWallet: 'Το Πορτοφόλι μου',
    manageWallet: 'Διαχείριση κεφαλαίων, συναλλαγών και διαφημίσεων',
    deposit: 'Κατάθεση',
    transactions: 'Συναλλαγές',
    connectWallet: 'Σύνδεση Πορτοφολιού',
    addFunds: 'Προσθήκη Χρημάτων',
    amount: 'Ποσό (€)', // Adjusted for Euro
    enterAmount: 'Εισάγετε ποσό',
    paymentMethod: 'Μέθοδος Πληρωμής',
    processing: 'Επεξεργασία...',
    myAccount: 'Ο Λογαριασμός μου',
    profile: 'Προφίλ',
    favorites: 'Αγαπημένα',
    recentlyViewed: 'Είδατε Πρόσφατα',
    priceAlerts: 'Ειδοποιήσεις Τιμών',
    settings: 'Ρυθμίσεις',
    logout: 'Αποσύνδεση',
    myProfile: 'Το Προφίλ μου',
    managePersonalInfo: 'Διαχείριση προσωπικών πληροφοριών',
    name: 'Όνομα',
    memberSince: 'Μέλος από',
    role: 'Ρόλος',
    administrator: 'Διαχειριστής',
    regularUser: 'Απλός Χρήστης',
    editProfile: 'Επεξεργασία Προφίλ',
    accountSummary: 'Σύνοψη Λογαριασμού',
    categories: 'Κατηγορίες',
    gifts: 'Δώρα',
    deals: 'Προσφορές',
    clearFilters: 'Καθαρισμός φίλτρων',
    finalPrice: 'Τελική τιμή',

    // --- Main Categories (Greek) ---
    'technology': 'Τεχνολογία',
    'home-garden': 'Σπίτι & Κήπος',
    'fashion': 'Μόδα',
    'health-beauty': 'Υγεία & Ομορφιά',
    'kids-baby': 'Παιδικά - Βρεφικά',
    'hobby-sports': 'Hobby, Αθλητισμός',
    'auto-moto': 'Μηχανοκίνηση',

    // --- Subcategories of Τεχνολογία (Greek) ---
    'mobile-telephony': 'Κινητή Τηλεφωνία',
    'computers': 'Υπολογιστές',
    'laptops-accessories': 'Laptops, Αξεσουάρ',
    'visual': 'Εικόνα',
    'smartwatches-wearables': 'Smartwatches, Wearables',
    'tablets-accessories': 'Tablets, Αξεσουάρ',
    'video-games': 'Video Games',
    'audio': 'Ήχος',
    'photo-video': 'Φωτογραφία, Video',
    'electronics': 'Ηλεκτρονικά',
    'telephony': 'Τηλεφωνία',
    'gadgets': 'Gadgets',

    // --- Subcategories of Σπίτι & Κήπος (Greek) ---
    'home-appliances': 'Οικιακές Συσκευές',
    'tools': 'Εργαλεία',
    'furniture': 'Έπιπλα',
    'garden': 'Κήπος',
    'home-items': 'Είδη Σπιτιού',
    'linens': 'Λευκά Είδη',
    'lighting': 'Φωτισμός',
    'kitchenware': 'Είδη Κουζίνας',
    'food-beverages': 'Τρόφιμα & Ποτά',
    'electrical-supplies': 'Ηλεκτρολογικά',
    'smoking-accessories': 'Είδη Καπνιστού',
    'office-supplies': 'Είδη Γραφείου',
    'gift-items': 'Είδη Δώρων',
    'security-systems': 'Συστήματα Ασφαλείας',
    'professional-equipment': 'Επαγγελματικός Εξοπλισμός',
    'seasonal-items': 'Εποχιακά Είδη',
    'shopping-bags': 'Τσάντες για Ψώνια',
    'shopping-trolleys': 'Καρότσια Λαϊκής',
    'church-items': 'Εκκλησιαστικά Είδη',
    'pet-supplies': 'Είδη Κατοικιδίων',

    // --- Subcategories of Μόδα (Greek) ---
    'womens-fashion': 'Γυναικεία Μόδα',
    'mens-fashion': 'Ανδρική Μόδα',
    'watches': 'Ρολόγια',
    'jewelry': 'Κοσμήματα',
    'eyewear': 'Οπτικά',
    'converse-all-star': 'Converse All Star',
    'rain-umbrellas': 'Ομπρέλες Βροχής',
    'shoe-accessories': 'Αξεσουάρ Παπουτσιών',
    'kids-baby-fashion': 'Παιδική, Βρεφική Μόδα',
    'sneakers': 'Sneakers: Τα πιο trendy παπούτσια για κάθε στυλ και περίσταση!',

    // --- Subcategories of Υγεία & Ομορφιά (Greek) ---
    'grooming': 'Περιποίηση',
    'pharmacy-products': 'Είδη Φαρμακείου',
    'perfumes': 'Αρώματα',
    'dietary-supplements': 'Συμπληρώματα Διατροφής',
    'grooming-devices': 'Συσκευές Περιποίησης',
    'makeup': 'Μακιγιάζ',
    'sunscreen-tanning': 'Αντηλιακή Προστασία, Μαύρισμα',
    'medical-supplies': 'Ιατρικά Είδη',
    'manicure-pedicure': 'Μανικιούρ - Πεντικιούρ',
    'oral-hygiene': 'Στοματική Υγιεινή',
    'sex-toys': 'Sex Toys',
    'firming-slimming': 'Σύσφιξη, Αδυνάτισμα',
    'cannabis-products': 'Προϊόντα Κάνναβης',
    'orthopedics': 'Ορθοπεδικά',
    'patient-aids': 'Βοηθήματα Ασθενών',
    'optics': 'Οπτικά',
    'korean-cosmetics': 'Κορεάτικα Καλλυντικά',

    // --- Subcategories of Παιδικά - Βρεφικά (Greek) ---
    // 'kids-baby-fashion' is already defined
    'kids-toys': 'Παιδικά Παιχνίδια',
    'school-supplies': 'Σχολικά Είδη',
    'baby-toys': 'Βρεφικά Παιχνίδια',
    'baby-items': 'Βρεφικά Είδη',
    'kids-linens': 'Παιδικά Λευκά Είδη',
    'christening-items': 'Βαπτιστικά',
    'kids-watches': 'Παιδικά Ρολόγια',

    // --- Subcategories of Hobby, Αθλητισμός (Greek) ---
    'sports': 'Αθλήματα',
    'cycling': 'Ποδηλασία',
    'leisure-time': 'Ελεύθερος Χρόνος',
    'fishing-diving': 'Ψάρεμα, Καταδύσεις',
    'beach-sea-items': 'Είδη Θαλάσσης',
    'camping': 'Camping',
    'travel-items-bags': 'Είδη Ταξιδίου, Τσάντες',
    'books': 'Βιβλία',
    'hunting': 'Κυνήγι',
    'fitness-equipment': 'Είδη Γυμναστικής',
    'pet-supplies-hobby': 'Είδη Κατοικιδίων (Hobby)',
    'drones-accessories': 'Drones & Αξεσουάρ',
    'electric-scooters': 'Ηλεκτρικά Πατίνια',
    'hoverboards': 'Hoverboards',
    'musical-instruments': 'Μουσικά Όργανα',
    'sports-accessories': 'Αξεσουάρ Αθλημάτων',
    'exploration-items': 'Είδη Εξερεύνησης',
    'womens-sportswear': 'Γυναικεία Αθλητικά Ρούχα',
    'womens-sports-shoes': 'Γυναικεία Αθλητικά Παπούτσια',
    'mens-sportswear': 'Ανδρικά Αθλητικά Ρούχα',
    'mens-sports-shoes': 'Ανδρικά Αθλητικά Παπούτσια',

    // --- Subcategories of Μηχανοκίνηση (Greek) ---
    'car': 'Αυτοκίνητο',
    'motorcycle': 'Μοτοσυκλέτα',
    'boat': 'Σκάφος',
    'truck-items': 'Είδη Φορτηγού',

    // --- Subcategories of Κινητή Τηλεφωνία (parentId: 10) (Greek) ---
    'smartphones': 'Κινητά',
    // 'iphone': 'iPhone', // Already 'iphone'
    'mobile-cases': 'Θήκες Κινητών',
    // 'bluetooth-handsfree': 'Bluetooth Handsfree', // Already same
    // 'handsfree': 'Handsfree', // Already same
    'mobile-chargers': 'Φορτιστές Κινητών',
    // 'tempered-glass': 'Tempered Glass', // Already same
    'screen-protectors': 'Προστασία Οθόνης',
    'power-banks': 'Power Banks',
    'mobile-batteries': 'Μπαταρίες Κινητών',
    'selfie-sticks': 'Selfie Stick',
    'mobile-holders': 'Βάσεις Κινητού',
    'charging-data-cables': 'Καλώδια Φόρτισης, Μεταφοράς Δεδομένων',
    'anti-lost-trackers': 'Anti-Lost Tracker',
    'mobile-spare-parts': 'Ανταλλακτικά Κινητών',
    'mobile-gimbals': 'Gimbal Κινητών',
    'stylus-pens': 'Γραφίδες Αφής',
    'stylus-accessories': 'Αξεσουάρ Γραφίδας',
    'bluetooth-headset-accessories': 'Αξεσουάρ Ακουστικών Bluetooth',
    'anti-lost-tracker-accessories': 'Αξεσουάρ Anti-Lost Tracker',
    'pop-sockets': 'Pop Sockets',
    'mobile-tripods': 'Τρίποδα Κινητών',
    'mobile-service-tools': 'Εργαλεία για Service Κινητών',
    'mobile-charms': 'Διακοσμητικά Κινητών',
    'mobile-accessories': 'Αξεσουάρ Κινητών',
    'mobile-camera-protection': 'Προστασία Κάμερας Κινητών',
    'mobile-camera-lenses': 'Φακοί Κάμερας Κινητών',
    'mobile-signal-boosters': 'Ενισχυτές Σήματος Κινητής Τηλεφωνίας',
    'mobile-gaming-buttons': 'Πλήκτρα Mobile Gaming',
    'connection-packs': 'Πακέτα Σύνδεσης',
    'portable-bluetooth-speakers-mobile': 'Φορητά Ηχεία Bluetooth',

    // Example for nested: Subcategories of Ηλεκτρονικά Παιχνίδια (parentId: 179)
    'ps5-games': 'PS5 Games',
    'pc-games': 'PC Games',

    // Example for nested: Subcategories of Home Audio (parentId: 193)
    'amplifiers-preamplifiers': 'Ενισχυτές, Προενισχυτές',
    'hi-fi-systems': 'Συστήματα Hi-Fi',
    // 'soundbars' uses the English key for consistency

    // ... (YOU WILL NEED TO ADD ALL OTHER GREEK TRANSLATIONS HERE FOR EACH SLUG)
  },
  es: {
    email: 'Correo electrónico', password: 'Contraseña', signIn: 'Iniciar sesión', createAccount: 'Crear cuenta',
    'technology': 'Tecnología',
    'mobile-telephony': 'Telefonía Móvil',
    // ... (Add all other Spanish translations)
  },
  fr: {
    email: 'E-mail', password: 'Mot de passe', signIn: 'Connexion', createAccount: 'Créer un compte',
    'technology': 'Technologie',
    'mobile-telephony': 'Téléphonie Mobile',
    // ... (Add all other French translations)
  },
  de: {
    email: 'E-Mail', password: 'Passwort', signIn: 'Anmelden', createAccount: 'Konto erstellen',
    'technology': 'Technologie',
    'mobile-telephony': 'Mobiltelefonie',
    // ... (Add all other German translations)
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'el', // Default to Greek if you prefer
  setLanguage: () => {},
  translations: defaultTranslations,
  isLoaded: false,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('el'); // Default to Greek
  const [translations, setTranslations] = useState<Translations>(defaultTranslations);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const detectLanguage = async () => {
      let detectedLang: Language = 'el'; // Default to Greek

      const browserLang = navigator.language.split('-')[0];
      if (['en', 'el', 'es', 'fr', 'de'].includes(browserLang)) {
        detectedLang = browserLang as Language;
      }

      if (user) {
        try {
          const { data, error } = await supabase.from('profiles').select('language').eq('id', user.id).single();
          if (data?.language && !error) { detectedLang = data.language as Language; }
        } catch (error) { console.error('Error fetching user language preference:', error); }
      }

      const savedLang = localStorage.getItem('language') as Language;
      if (savedLang && ['en', 'el', 'es', 'fr', 'de'].includes(savedLang)) {
        detectedLang = savedLang;
      }

      setLanguageState(detectedLang);
      setIsLoaded(true);
    };
    detectLanguage();
  }, [user]);

  useEffect(() => {
    const loadCustomTranslations = async () => {
      try {
        const { data, error } = await (supabase as any).from('translations').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          const customTranslations = { ...defaultTranslations };
          data.forEach((item: any) => {
            if (item && item.key) {
              Object.keys(customTranslations).forEach(lang => {
                if (item[lang]) {
                  // Only add if the key is not already in default (or decide merge strategy)
                  // This example prioritizes defaultTranslations if key exists, then DB
                  if (!customTranslations[lang][item.key] || typeof customTranslations[lang][item.key] === 'undefined') {
                     customTranslations[lang][item.key] = item[lang];
                  } else if (customTranslations[lang][item.key] && typeof item[lang] === 'string' && customTranslations[lang][item.key] !== item[lang]) {
                    // If key exists in both, and DB has a different value, update it.
                    // This makes DB override default if a key is present in both and different.
                    // If you want default to always win if key exists, remove this else if.
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
  }, []); // Load custom translations once

  const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
    if (user) {
      supabase.from('profiles').update({ language: lang } as any).eq('id', user.id)
        .then(({ error }) => { if (error) { console.error('Error saving language preference:', error); } });
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => useContext(LanguageContext);
