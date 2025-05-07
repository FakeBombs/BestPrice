import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'; // Added useCallback
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
  // ================================= English (en) ===================================
  en: {
    // Auth
    email: 'Email',                              password: 'Password',                    forgotPassword: 'Forgot Password?',        register: 'Register',
    signIn: 'Sign In',                           loggingIn: 'Logging in...',              emailPlaceholder: 'email@example.com',     orContinueWith: 'Or continue with',
    google: 'Google',                            facebook: 'Facebook',                    twitter: 'Twitter',                        createAccount: 'Create Account',
    dontHaveAccount: "Don't have an account?",   alreadyHaveAccount: 'Already have an account?', fullName: 'Full Name', confirmPassword: 'Confirm Password',
    agreeToTerms: 'I agree to the Terms of Service and Privacy Policy',
    creatingAccount: 'Creating Account...',      resetYourPassword: 'Reset Your Password',
    enterEmailForReset: 'Enter your email address and we will send you a link to reset your password.',
    sendResetLink: 'Send Reset Link',            sendingResetLink: 'Sending...',
    resetPasswordEmailSent: 'Password reset email sent. Please check your inbox.',
    backToLogin: 'Back to Login',                createNewPassword: 'Create New Password',
    newPassword: 'New Password',                 updatePassword: 'Update Password',
    updating: 'Updating...',                     passwordUpdated: 'Password Updated',
    passwordSuccessfullyChanged: 'Your password has been successfully changed.',
    passwordResetFailed: 'Password Reset Failed',
    errorProcessingRequest: 'There was an error processing your request.',
    passwordTooShort: 'Password Too Short',      passwordMinLength: 'Password must be at least 6 characters.',
    passwordsDontMatch: 'Passwords Don\'t Match', pleaseCheckPasswords: 'Please check that both passwords match.',

    // General UI & Nav
    languageSettings: 'Language Settings',       selectLanguage: 'Select Language',         english: 'English',          greek: 'Greek',
    spanish: 'Spanish',                          french: 'French',                         german: 'German',            systemLanguage: 'System Language (Default)',
    save: 'Save',                                cancel: 'Cancel',                          loading: 'Loading...',       success: 'Success',
    error: 'Error',                              wallet: 'Wallet',                          myWallet: 'My Wallet',       manageWallet: 'Manage your funds, transactions, and ad payments',
    deposit: 'Deposit',                          transactions: 'Transactions',              connectWallet: 'Connect Wallet', addFunds: 'Add Funds',
    amount: 'Amount ($)',                        enterAmount: 'Enter amount',               paymentMethod: 'Payment Method', processing: 'Processing...',
    myAccount: 'My Account',                     profile: 'Profile',                        favorites: 'Favorites',      recentlyViewed: 'Recently Viewed',
    priceAlerts: 'Price Alerts',                 settings: 'Settings',                      logout: 'Logout',            myProfile: 'My Profile',
    managePersonalInfo: 'Manage your personal information',
    name: 'Name',                                memberSince: 'Member since',               role: 'Role',                administrator: 'Administrator',
    regularUser: 'Regular User',                 editProfile: 'Edit Profile',               accountSummary: 'Account Summary', categories: 'Categories',
    gifts: 'Gifts',                              deals: 'Deals',                            clearFilters: 'Clear filters', finalPrice: 'Final price',
    yes: "Yes",                                  no: "No",                                  ok: "OK",                    close: "Close",
    showMore: "Show More",                       showLess: "Show Less",                     all: "All",                  selectOption: "Select an option",
    optional: "Optional",                        required: "Required",                      back: "Back",                next: "Next",
    submit: "Submit",                            search: "Search",                          searchPlaceholder: "Search for products...",
    notFoundPageTitle: "Page Not Found",         notFoundMessage: "Oops! The page you are looking for does not exist.",
    recently_viewed_title: "Recently Viewed",

    // Categories Page & Filters
    "product_singular": "product",               "product_plural": "{{count}} products",
    "rating_label": "Rating",                    "reviews_label_singular": "review",        "reviews_label_plural": "{{count}} reviews",
    "from_vendor": "from",                       "with": "with",
    "no_products_in_category": "There are no products in this category yet.",
    "filters_title": "Filters",                  "remove_all_filters_tooltip": "Remove all filters",
    "show_only_title": "Show only",              "deals_label": "Deals",
    "deals_title": "Products with significant price drop",
    "certified_label": "Certified",              "certified_stores_title": "Certified Stores",
    "instock_label": "In Stock",                 "instock_title": "Only products available in stock",
    "boxnow_delivery_title": "BOX NOW Delivery",
    "boxnow_tooltip": "Pick up your order from a BOX NOW locker 24/7",
    "delivery_label": "BOX NOW",                 "manufacturer_title": "Manufacturer",
    "show_less_manufacturers": "Show less manufacturers", "show_all_manufacturers": "Show all manufacturers",
    "show_all": "Show All",
    "show_less_options": "Show less options for", "show_all_options": "Show all options for",
    "remove_instock_filter": "Remove 'In Stock' filter",    "remove_deals_filter": "Remove 'Deals' filter",
    "remove_certified_filter": "Remove 'Certified' filter", "remove_nearby_filter": "Remove 'Nearby' filter",
    "remove_boxnow_filter": "Remove 'BOX NOW' filter",
    "remove_brand_filter": "Remove brand filter",           "remove_spec_filter": "Remove spec filter",
    "reset_all_filters": "Reset all filters",               "clear_all_filters": "Clear All",
    "selected_deals": "Selected Deals",                     "popular_choices": "Popular Choices",
    "sort_most_popular": "Most Popular",                    "sort_newest": "Newest",
    "sort_cheapest": "Cheapest",                            "sort_most_expensive": "Most Expensive",
    "sort_alphabetical": "Alphabetical (A-Z)",              "sort_most_reviews": "Most Reviews",
    "sort_by_manufacturer": "By Manufacturer",              "sort_num_stores": "Number of Stores",
    "price_alert_for": "Price Alert for",
    "no_products_found_filters": "No products match your current filters.",
    "suggestions_title": "Suggestions",
    "suggestion_see_all_products": "See all products in this category:",
    "all_category_products": "All Category Products",
    "suggestion_try_removing_filters": "Try removing some filters:",
    "remove_a_filter": "Remove a filter",
    "suggestion_return_home": "Return to the homepage:",
    "return_to_homepage": "Return to Homepage",
    "no_subcategories": "No subcategories available.",
    "popular_categories": "Popular Categories",             "top_deals_in": "Top Deals in",
    "products_with_significant_price_drop": "Products with a significant price drop",
    "hottest_in": "Hottest in",                             "product_reviews_title": "Product Reviews",
    "helpful_reviews_subtitle": "Helpful reviews from our users",
    "popular_manufacturers": "Popular Manufacturers",
    "price_alert_button": "Set Price Alert",
    "price_alert_prompt_in": "Never miss a deal for products in",
    "return_to": "Return to",
    "info_for_certified_store": "Information for certified store",
    "showing_products_from_store": "Showing products from store",
    "remove_filter": "Remove this filter",

    // Product Breadcrumb
    "breadcrumbHome": "BestPrice",
    "breadcrumbAllProductsInCategory": "All products in the {{categoryName}} category",
    "breadcrumbAllProductsAndSubcategoriesInCategory": "All products and subcategories in the {{categoryName}} category",

    // Product Detail Page
    "loadingProduct": "Loading Product...",
    "addToShoppingList": "Add to Shopping List", "addToComparison": "Add to Comparison",
    "iWantIt": "I Want It",                      "iHaveIt": "I Have It",
    "notifyPriceDrop": "Notify for Price Drop",  "addToCollection": "Add to Collection",
    "priceFrom": "From",                         "inStores": "in {{count}} stores",
    "storesCount": "Stores ({{count}})",
    "available": "Available",                    "nearMe": "Near Me",
    "deliveryWithService": "Delivery with {{serviceName}}",
    "coupons": "Coupons",                        "color": "Color",
    "officialResellers": "Official Resellers",   "priceHistoryTitle": "Price History",
    "productDetails": "Product Details",         "userReviews": "User Reviews ({{count}})",
    "questionsAndAnswers": "Questions & Answers ({{count}})",
    "similarProducts": "Similar Products",       "dealsInCategory": "Deals in {{categoryName}}",
    "addToCart": "Add to Cart",                  "buyNow": "Buy Now",
    "specifications": "Specifications",          "reviews": "Reviews",
    "relatedProducts": "Related Products",       "writeReview": "Write a Review",
    "outOfStock": "Out of Stock",
    "availableAt": "Available at {{count}} stores", "noStoresAvailable": "Currently unavailable",
    "priceRange": "Price Range",                 "comparePrices": "Compare {{count}} Prices",
    "viewAllStores": "View all stores",          "productDescription": "Description",
    "share": "Share",
    "removeFromFavorites": "Remove from Favorites",
    "priceHistory": "Price History",
    "certifiedStoresTooltip": "Show only products from certified stores",
    "vendorPopupCertification": "Certification: {{certificationType}}",
    "vendorPopupInformation": "Information",
    "vendorPopupAddressNotAvailable": "Online Only Store",
    "vendorPopupPaymentMethods": "PAYMENT METHODS",
    "vendorPopupLearnMore": "Learn More",        "vendorPopupViewInStore": "View in Store",
    "openingHoursNotAvailable": "Opening hours information not available",
    "closedToday": "Closed today",               "openUntil": "Open until {{time}}",
    "closedOpensAt": "Closed - Opens at {{time}}", "closedForToday": "Closed for today",
    "openingHoursError": "Error in opening hours",
    "loginRequired": "Login Required",
    "loginToAddToFavorites": "Please log in to add this product to your favorites",
    "productAddedToFavorites": "{{productName}} has been added to your favorites",
    "linkCopied": "Link Copied",                 "productLinkCopied": "Product link copied to clipboard",
    "copyFailed": "Copy Failed",                 "couldNotCopyLink": "Could not copy link",
    "loginToSetPriceAlert": "Please log in to set a price alert",

    // Vendor Page
    "loadingVendor": "Loading store...", "allStores": "Stores",
    "certifiedStoreLinkText": "Certified Store ({{certificationLevel}})",
    "certifiedStoreFullText": "{{vendorName}} is a certified store ({{certificationLevel}})",
    "memberSinceDate": "On BestPrice since {{date}}",
    "ratingTooltip": "{{rating}} stars from {{count}} ratings",
    "social_facebook": "Facebook", "social_twitter": "Twitter", "social_instagram": "Instagram", "social_youtube": "YouTube", "social_linkedin": "LinkedIn", "social_tiktok": "TikTok",
    "additionalStores": "{{count}} more {{storeLabel}}",
    "storeLabelSingular": "store", "storeLabelPlural": "stores",
    "logoFor": "{{name}} logo", "screenshotFor": "{{name}} Screenshot",
    "authorizedReseller": "Authorized Reseller", "previewWebsite": "Preview Website",
    "dealsFromVendor": "Deals from {{vendorName}}",
    "popularCategoriesInVendor": "Popular Categories in {{vendorName}}",
    "viewAllVendorProducts": "View all products<span class=\"hide-mobile\"> of the store</span>",
    "storeReviewsTitle": "Store Reviews for {{vendorName}}",
    "reviewCount": "{{count}} reviews", "rateIt": "Rate It",
    "reviewsPlaceholder": "(Reviews display - Implementation needed)",
    "servicePointsTitle": "Service Points for {{vendorName}}",
    "servicePointsCount": "{{count}} points",
    "storeAndPickup": "Store / Pickup Point",
    "mapPlaceholderText": "Map Placeholder - Requires Map Library",
    "noLanguagesInRegion": "No languages listed for this region yet.",

    // UserButton & UserDropdownContent
    "toggleTheme": "Toggle theme",
    "productsYouWant": "Products you want",      "productsYouHave": "Products you have",
    "myOffers": "My Offers",                     "priceDrops": "Price Drops",
    "myCollections": "My Collections",           "newCollection": "New Collection...",
    "creditsClub": "Credits Club",               "savedOrders": "Saved Orders",
    "myQuestions": "My Questions",               "myReviews": "My Reviews",
    "myFriends": "My Friends",                   "viewProfileTooltip": "View your profile",
    "userMenuCaretAlt": "Open user menu",

    // Footer
    "backToTop": "Back to Top",
    "bestpriceSloganShort": "The truly best price",
    "bestpriceSloganLong": "BestPrice is the first and largest price comparison service in Greece.",
    "bestpriceSloganFindDeals": "At BestPrice you will quickly and easily find real offers and the best price from the largest stores.",
    "bestpriceGive": "BestPrice Give", "footerBestPriceSectionTitle": "BestPrice",
    "aboutUs": "About Us", "ourBlog": "Our Blog",
    "buyingGuides": "Buying Guides", "purchaseInsurance": "Purchase Insurance",
    "advertising": "Advertising", "bestpriceCertification": "BestPrice Certification",
    "customerReviewAwards": "Customer Review Awards", "ourAwards": "Our Awards",
    "ourTeam": "Our Team", "bestpriceAssistant": "BestPrice Assistant",
    "jobOpenings": "Job Openings ({{count}})", "contactUs": "Contact",
    "inNumbers": "In Numbers",
    "storeCountLink": "{{count}} stores", "productCountLink": "{{count}} products",
    "brandCountLink": "{{count}} manufacturers","dealCountLink": "{{count}} offers",
    "termsAndPrivacy": "Terms & Privacy", "termsOfUse": "Terms of Use",
    "privacyPolicy": "Privacy Policy", "cookiePolicy": "Cookie Policy",
    "gdprLink": "GDPR", "dsaLink": "DSA",
    "bestpriceForMerchants": "BestPrice For Merchants",
    "merchantsSectionSlogan1": "Do you have an online store?",
    "merchantsSectionSlogan2": "See how BestPrice can help you increase your sales!",
    "forMerchantsButton": "For Merchants",
    "bestpriceForBrands": "BestPrice For Brands",
    "brandsSectionSlogan": "BestPrice for Brands will offer useful information & services to manufacturers (Brands).",
    "moreInfoButton": "More Info",
    "bestpriceOnFacebook": "BestPrice on Facebook", "bestpriceOnX": "BestPrice on X",
    "bestpriceOnThreads": "BestPrice on Threads", "bestpriceOnInstagram": "BestPrice on Instagram",
    "bestpriceOnTikTok": "BestPrice on TikTok", "bestpriceOnYouTube": "BestPrice on YouTube",
    "bestpriceOnLinkedIn": "BestPrice on LinkedIn",
    "homepageTitle": "Homepage",
    "changeLanguage": "Change Language", "selectYourLanguageTitle": "Select Your Language",
    "suggestedLanguages": "Suggested Languages", "allLanguages": "All Languages",
    "languageCategoryEurope": "Europe", "languageCategoryAsia": "Asia",
    "languageCategoryAmericas": "Americas", "languageCategoryAfrica": "Africa & Middle East",
    "languageCategoryEasternEurope": "Eastern Europe", "languageCategoryWesternEurope": "Western Europe", // Added from FB DOM

    // Deals, Brands, Search
    "allBrands": "All Brands", "productsFromBrand": "Products from {{brandName}}",
    "searchResultsFor": "Search results for \"{{searchTerm}}\"",
    "noResultsFound": "No results found for \"{{searchTerm}}\"",
    "sortBy": "Sort by", "viewAsGrid": "Grid View",
    "viewAsList": "List View", "itemsPerPage": "Items per page",
    "page": "Page", "of": "of", "nextPage": "Next", "previousPage": "Previous",
    "todaysDeals": "Today's Deals", "filterBy": "Filter by",

    // Cart & Checkout
    "shoppingCart": "Shopping Cart", "proceedToCheckout": "Proceed to Checkout",
    "item": "Item", "quantity": "Quantity", "subtotal": "Subtotal", "total": "Total",
    "emptyCart": "Your cart is empty.", "continueShopping": "Continue Shopping",
    "shippingAddress": "Shipping Address", "billingAddress": "Billing Address",
    "paymentInformation": "Payment Information", "placeOrder": "Place Order",
    "orderSummary": "Order Summary", "discountCode": "Discount Code", "apply": "Apply",

    // Payment Methods (Dynamic Keys)
    "paymentMethod_credit_card": "Credit Card", "paymentMethod_bank_transfer": "Bank Transfer",
    "paymentMethod_paypal": "PayPal", "paymentMethod_cash_on_delivery": "Cash on Delivery",
    "paymentMethod_pickup_from_store": "Pickup from Store", "paymentMethod_klarna": "Klarna",
    "paymentMethod_apple_pay": "Apple Pay", "paymentMethod_google_pay": "Google Pay",
    "paymentMethod_ideal": "iDEAL", "paymentMethod_crypto": "Cryptocurrency",
    "paymentMethod_pay_by_link": "Pay by Link", "paymentMethod_pickup_via": "Pickup via Courier/Service",

    // Category Slugs
    'technology': 'Technology', 'home-garden': 'Home & Garden', 'fashion': 'Fashion',
    'health-beauty': 'Health & Beauty', 'kids-baby': 'Kids & Baby', 'hobby-sports': 'Hobby & Sports',
    'auto-moto': 'Auto & Moto',
    'mobile-telephony': 'Mobile Telephony', 'computers': 'Computers', 'laptops-accessories': 'Laptops & Accessories',
    'visual': 'Visual', 'smartwatches-wearables': 'Smartwatches & Wearables', 'tablets-accessories': 'Tablets & Accessories',
    'video-games': 'Video Games', 'audio': 'Audio', 'photo-video': 'Photo & Video',
    'electronics': 'Electronics', 'telephony': 'Telephony', 'gadgets': 'Gadgets',
    'home-appliances': 'Home Appliances', 'tools': 'Tools', 'furniture': 'Furniture',
    'garden': 'Garden', 'home-items': 'Home Items', 'linens': 'Linens',
    'lighting': 'Lighting', 'kitchenware': 'Kitchenware', 'food-beverages': 'Food & Beverages',
    'electrical-supplies': 'Electrical Supplies', 'smoking-accessories': 'Smoking Accessories', 'office-supplies': 'Office Supplies',
    'gift-items': 'Gift Items', 'security-systems': 'Security Systems', 'professional-equipment': 'Professional Equipment',
    'seasonal-items': 'Seasonal Items', 'shopping-bags': 'Shopping Bags', 'shopping-trolleys': 'Shopping Trolleys',
    'church-items': 'Church Items', 'pet-supplies': 'Pet Supplies', 'womens-fashion': "Women's Fashion",
    'mens-fashion': "Men's Fashion", 'watches': 'Watches', 'jewelry': 'Jewelry',
    'eyewear': 'Eyewear', 'converse-all-star': 'Converse All Star', 'rain-umbrellas': 'Rain Umbrellas',
    'shoe-accessories': 'Shoe Accessories', 'kids-baby-fashion': "Kids & Baby Fashion", 'sneakers': 'Sneakers',
    'grooming': 'Grooming', 'pharmacy-products': 'Pharmacy Products', 'perfumes': 'Perfumes',
    'dietary-supplements': 'Dietary Supplements','grooming-devices': 'Grooming Devices', 'makeup': 'Makeup',
    'sunscreen-tanning': 'Sunscreen & Tanning', 'medical-supplies': 'Medical Supplies', 'manicure-pedicure': 'Manicure & Pedicure',
    'oral-hygiene': 'Oral Hygiene', 'sex-toys': 'Sex Toys', 'firming-slimming': 'Firming & Slimming',
    'cannabis-products': 'Cannabis Products', 'orthopedics': 'Orthopedics', 'patient-aids': 'Patient Aids',
    'optics': 'Optics', 'korean-cosmetics': 'Korean Cosmetics', 'kids-toys': "Kids' Toys",
    'school-supplies': 'School Supplies', 'baby-toys': 'Baby Toys', 'baby-items': 'Baby Items',
    'kids-linens': "Kids' Linens", 'christening-items': 'Christening Items', 'kids-watches': "Kids' Watches",
    'sports': 'Sports', 'cycling': 'Cycling', 'leisure-time': 'Leisure Time',
    'fishing-diving': 'Fishing & Diving', 'beach-sea-items': 'Beach & Sea Items', 'camping': 'Camping',
    'travel-items-bags': 'Travel Items & Bags', 'books': 'Books', 'hunting': 'Hunting',
    'fitness-equipment': 'Fitness Equipment', 'pet-supplies-hobby': 'Pet Supplies (Hobby)', 'drones-accessories': 'Drones & Accessories',
    'electric-scooters': 'Electric Scooters', 'hoverboards': 'Hoverboards', 'musical-instruments': 'Musical Instruments',
    'sports-accessories': 'Sports Accessories', 'exploration-items': 'Exploration Items',
    'womens-sportswear': "Women's Sportswear", 'womens-sports-shoes': "Women's Sports Shoes",
    'mens-sportswear': "Men's Sportswear", 'mens-sports-shoes': "Men's Sports Shoes",
    'car': 'Car', 'motorcycle': 'Motorcycle', 'boat': 'Boat',
    'truck-items': 'Truck Items', 'smartphones': 'Smartphones', 'iphone': 'iPhone',
    'mobile-cases': 'Mobile Cases', 'bluetooth-handsfree': 'Bluetooth Handsfree', 'handsfree': 'Handsfree',
    'mobile-chargers': 'Mobile Chargers', 'tempered-glass': 'Tempered Glass', 'screen-protectors': 'Screen Protectors',
    'power-banks': 'Power Banks', 'mobile-batteries': 'Mobile Batteries', 'selfie-sticks': 'Selfie Sticks',
    'mobile-holders': 'Mobile Holders', 'charging-data-cables': 'Charging & Data Cables', 'anti-lost-trackers': 'Anti-Lost Trackers',
    'mobile-spare-parts': 'Mobile Spare Parts', 'mobile-gimbals': 'Mobile Gimbals', 'stylus-pens': 'Stylus Pens',
    'stylus-accessories': 'Stylus Accessories', 'bluetooth-headset-accessories': 'Bluetooth Headset Accessories',
    'anti-lost-tracker-accessories': 'Anti-Lost Tracker Accessories',
    'pop-sockets': 'Pop Sockets', 'mobile-tripods': 'Mobile Tripods', 'mobile-service-tools': 'Mobile Service Tools',
    'mobile-charms': 'Mobile Charms', 'mobile-accessories': 'Mobile Accessories',
    'mobile-camera-protection': 'Mobile Camera Protection', 'mobile-camera-lenses': 'Mobile Camera Lenses',
    'mobile-signal-boosters': 'Mobile Signal Boosters', 'mobile-gaming-buttons': 'Mobile Gaming Buttons',
    'connection-packs': 'Connection Packs', 'portable-bluetooth-speakers-mobile': 'Portable Bluetooth Speakers (Mobile)',
    'ps5-games': 'PS5 Games', 'pc-games': 'PC Games', 'amplifiers-preamplifiers': 'Amplifiers & Preamplifiers',
    'hi-fi-systems': 'Hi-Fi Systems',
  },
  // ================================= Greek (el) ===================================
  el: {
    // Auth
    email: 'Email', password: 'Κωδικός', forgotPassword: 'Ξεχάσατε τον κωδικό;', register: 'Εγγραφή',
    signIn: 'Σύνδεση', loggingIn: 'Γίνεται σύνδεση...', emailPlaceholder: 'email@example.com', orContinueWith: 'Ή συνεχίστε με',
    google: 'Google', facebook: 'Facebook', twitter: 'Twitter', createAccount: 'Δημιουργία Λογαριασμού',
    dontHaveAccount: 'Δεν έχετε λογαριασμό;', alreadyHaveAccount: 'Έχετε ήδη λογαριασμό;', fullName: 'Ονοματεπώνυμο', confirmPassword: 'Επαλήθευση Κωδικού',
    agreeToTerms: 'Συμφωνώ με τους Όρους Χρήσης και την Πολιτική Απορρήτου',
    creatingAccount: 'Δημιουργία Λογαριασμού...', resetYourPassword: 'Επαναφορά Κωδικού',
    enterEmailForReset: 'Εισαγάγετε το email σας και θα σας στείλουμε έναν σύνδεσμο για επαναφορά του κωδικού σας.',
    sendResetLink: 'Αποστολή Συνδέσμου', sendingResetLink: 'Αποστολή...',
    resetPasswordEmailSent: 'Το email επαναφοράς κωδικού στάλθηκε. Ελέγξτε τα εισερχόμενά σας.',
    backToLogin: 'Επιστροφή στη Σύνδεση', createNewPassword: 'Δημιουργία Νέου Κωδικού',
    newPassword: 'Νέος Κωδικός', updatePassword: 'Ενημέρωση Κωδικού',
    updating: 'Ενημέρωση...', passwordUpdated: 'Ο Κωδικός Ενημερώθηκε',
    passwordSuccessfullyChanged: 'Ο κωδικός σας άλλαξε επιτυχώς.',
    passwordResetFailed: 'Η Επαναφορά Κωδικού Απέτυχε',
    errorProcessingRequest: 'Παρουσιάστηκε σφάλμα κατά την επεξεργασία του αιτήματός σας.',
    passwordTooShort: 'Πολύ Κοντός Κωδικός', passwordMinLength: 'Ο κωδικός πρέπει να είναι τουλάχιστον 6 χαρακτήρες.',
    passwordsDontMatch: 'Οι Κωδικοί δεν Ταιριάζουν', pleaseCheckPasswords: 'Ελέγξτε ότι οι δύο κωδικοί ταιριάζουν.',

    // General UI & Nav
    languageSettings: 'Ρυθμίσεις Γλώσσας', selectLanguage: 'Επιλογή Γλώσσας', english: 'Αγγλικά', greek: 'Ελληνικά',
    spanish: 'Ισπανικά', french: 'Γαλλικά', german: 'Γερμανικά', systemLanguage: 'Γλώσσα Συστήματος (Προεπιλογή)',
    save: 'Αποθήκευση', cancel: 'Άκυρο', loading: 'Φόρτωση...', success: 'Επιτυχία',
    error: 'Σφάλμα', wallet: 'Πορτοφόλι', myWallet: 'Το Πορτοφόλι μου', manageWallet: 'Διαχείριση κεφαλαίων, συναλλαγών και διαφημίσεων',
    deposit: 'Κατάθεση', transactions: 'Συναλλαγές', connectWallet: 'Σύνδεση Πορτοφολιού', addFunds: 'Προσθήκη Χρημάτων',
    amount: 'Ποσό (€)', enterAmount: 'Εισάγετε ποσό', paymentMethod: 'Μέθοδος Πληρωμής', processing: 'Επεξεργασία...',
    myAccount: 'Ο Λογαριασμός μου', profile: 'Προφίλ', favorites: 'Αγαπημένα', recentlyViewed: 'Είδατε Πρόσφατα',
    priceAlerts: 'Ειδοποιήσεις Τιμών', settings: 'Ρυθμίσεις', logout: 'Αποσύνδεση', myProfile: 'Το Προφίλ μου',
    managePersonalInfo: 'Διαχείριση προσωπικών πληροφοριών',
    name: 'Όνομα', memberSince: 'Μέλος από', role: 'Ρόλος', administrator: 'Διαχειριστής',
    regularUser: 'Απλός Χρήστης', editProfile: 'Επεξεργασία Προφίλ', accountSummary: 'Σύνοψη Λογαριασμού', categories: 'Κατηγορίες',
    gifts: 'Δώρα', deals: 'Προσφορές', clearFilters: 'Καθαρισμός φίλτρων', finalPrice: 'Τελική τιμή',
    yes: "Ναι", no: "Όχι", ok: "OK", close: "Κλείσιμο",
    showMore: "Περισσότερα", showLess: "Λιγότερα", all: "Όλα", selectOption: "Επιλέξτε",
    optional: "Προαιρετικό", required: "Απαιτείται", back: "Πίσω", next: "Επόμενο",
    submit: "Υποβολή", search: "Αναζήτηση", searchPlaceholder: "Αναζήτηση προϊόντων...",
    notFoundPageTitle: "Η Σελίδα δεν Βρέθηκε", notFoundMessage: "Ουπς! Η σελίδα που αναζητάτε δεν υπάρχει.",
    recently_viewed_title: "Είδατε Πρόσφατα",

    // Categories Page & Filters
    "product_singular": "προϊόν", "product_plural": "{{count}} προϊόντα",
    "rating_label": "Βαθμολογία", "reviews_label_singular": "αξιολόγηση", "reviews_label_plural": "{{count}} αξιολογήσεις",
    "from_vendor": "από", "with": "με",
    "no_products_in_category": "Δεν υπάρχουν προϊόντα σε αυτή την κατηγορία ακόμα.",
    "filters_title": "Φίλτρα", "remove_all_filters_tooltip": "Αφαίρεση όλων των φίλτρων",
    "show_only_title": "Εμφάνιση μόνο", "deals_label": "Προσφορές",
    "deals_title": "Προϊόντα με σημαντική πτώση τιμής",
    "certified_label": "Πιστοποιημένα", "certified_stores_title": "Πιστοποιημένα Καταστήματα",
    "instock_label": "Διαθέσιμα", "instock_title": "Μόνο προϊόντα διαθέσιμα σε απόθεμα",
    "boxnow_delivery_title": "BOX NOW Παράδοση",
    "boxnow_tooltip": "Παραλάβετε την παραγγελία σας από ένα BOX NOW locker 24/7",
    "delivery_label": "BOX NOW", "manufacturer_title": "Κατασκευαστής",
    "show_less_manufacturers": "Λιγότεροι κατασκευαστές", "show_all_manufacturers": "Όλοι οι κατασκευαστές",
    "show_all": "Όλα",
    "show_less_options": "Λιγότερες επιλογές για", "show_all_options": "Όλες οι επιλογές για",
    "remove_instock_filter": "Αφαίρεση φίλτρου 'Διαθέσιμα'", "remove_deals_filter": "Αφαίρεση φίλτρου 'Προσφορές'",
    "remove_certified_filter": "Αφαίρεση φίλτρου 'Πιστοποιημένα'", "remove_nearby_filter": "Αφαίρεση φίλτρου 'Κοντινά'",
    "remove_boxnow_filter": "Αφαίρεση φίλτρου 'BOX NOW'",
    "remove_brand_filter": "Αφαίρεση φίλτρου κατασκευαστή", "remove_spec_filter": "Αφαίρεση φίλτρου χαρακτηριστικού",
    "reset_all_filters": "Επαναφορά όλων των φίλτρων", "clear_all_filters": "Καθαρισμός Όλων",
    "selected_deals": "Επιλεγμένες Προσφορές", "popular_choices": "Δημοφιλείς Επιλογές",
    "sort_most_popular": "Δημοφιλέστερα", "sort_newest": "Νεότερα",
    "sort_cheapest": "Φθηνότερα", "sort_most_expensive": "Ακριβότερα",
    "sort_alphabetical": "Αλφαβητικά (Α-Ω)", "sort_most_reviews": "Περισσότερες Αξιολογήσεις",
    "sort_by_manufacturer": " ανά Κατασκευαστή", "sort_num_stores": "Πλήθος Καταστημάτων",
    "price_alert_for": "Ειδοποίηση Τιμής για",
    "no_products_found_filters": "Κανένα προϊόν δεν αντιστοιχεί στα τρέχοντα φίλτρα σας.",
    "suggestions_title": "Προτάσεις",
    "suggestion_see_all_products": "Δείτε όλα τα προϊόντα αυτής της κατηγορίας:",
    "all_category_products": "Όλα τα Προϊόντα Κατηγορίας",
    "suggestion_try_removing_filters": "Δοκιμάστε να αφαιρέσετε μερικά φίλτρα:",
    "remove_a_filter": "Αφαίρεση φίλτρου",
    "suggestion_return_home": "Επιστρέψτε στην αρχική σελίδα:",
    "return_to_homepage": "Επιστροφή στην Αρχική",
    "no_subcategories": "Δεν υπάρχουν διαθέσιμες υποκατηγορίες.",
    "popular_categories": "Δημοφιλείς Κατηγορίες", "top_deals_in": "Top Προσφορές σε",
    "products_with_significant_price_drop": "Προϊόντα με σημαντική πτώση τιμής",
    "hottest_in": "Τα πιο Hot σε", "product_reviews_title": "Αξιολογήσεις Προϊόντων",
    "helpful_reviews_subtitle": "Χρήσιμες αξιολογήσεις από τους χρήστες μας",
    "popular_manufacturers": "Δημοφιλείς Κατασκευαστές",
    "price_alert_button": "Ειδοποίηση Πτώσης Τιμής",
    "price_alert_prompt_in": "Μην χάσετε ποτέ μια προσφορά για προϊόντα στην κατηγορία",
    "return_to": "Επιστροφή σε",
    "info_for_certified_store": "Πληροφορίες για πιστοποιημένο κατάστημα",
    "showing_products_from_store": "Εμφάνιση προϊόντων από το κατάστημα",
    "remove_filter": "Αφαίρεση αυτού του φίλτρου",

    // Product Breadcrumb
    "breadcrumbHome": "BestPrice",
    "breadcrumbAllProductsInCategory": "Όλα τα προϊόντα της κατηγορίας {{categoryName}}",
    "breadcrumbAllProductsAndSubcategoriesInCategory": "Όλα τα προϊόντα και οι υποκατηγορίες της κατηγορίας {{categoryName}}",

    // Product Detail Page
    "loadingProduct": "Φόρτωση Προϊόντος...",
    "addToShoppingList": "Προσθήκη στη Λίστα Αγορών", "addToComparison": "Προσθήκη στη σύγκριση",
    "iWantIt": "Το θέλω", "iHaveIt": "Το έχω",
    "notifyPriceDrop": "Ειδοποίηση για πτώση τιμής", "addToCollection": "Προσθήκη σε συλλογή",
    "priceFrom": "Από", "inStores": "σε {{count}} καταστήματα",
    "storesCount": "Καταστήματα ({{count}})",
    "available": "Διαθέσιμα", "nearMe": "Κοντά μου",
    "deliveryWithService": "Παράδοση με {{serviceName}}",
    "coupons": "Κουπόνια", "color": "Χρώμα",
    "officialResellers": "Επίσημοι μεταπωλητές", "priceHistoryTitle": "Ιστορικό Τιμών",
    "productDetails": "Λεπτομέρειες Προϊόντος", "userReviews": "Αξιολογήσεις Χρηστών ({{count}})",
    "questionsAndAnswers": "Ερωτήσεις & Απαντήσεις ({{count}})",
    "similarProducts": "Παρόμοια Προϊόντα", "dealsInCategory": "Προσφορές στην κατηγορία {{categoryName}}",
    "addToCart": "Προσθήκη στο Καλάθι", "buyNow": "Αγορά Τώρα",
    "specifications": "Χαρακτηριστικά", "reviews": "Αξιολογήσεις",
    "relatedProducts": "Σχετικά Προϊόντα", "writeReview": "Γράψτε Αξιολόγηση",
    "outOfStock": "Εξαντλημένο",
    "availableAt": "Διαθέσιμο σε {{count}} καταστήματα", "noStoresAvailable": "Προς το παρόν μη διαθέσιμο",
    "priceRange": "Εύρος Τιμών", "comparePrices": "Σύγκριση {{count}} Τιμών",
    "viewAllStores": "Δείτε όλα τα καταστήματα", "productDescription": "Περιγραφή",
    "share": "Κοινοποίηση", "removeFromFavorites": "Αφαίρεση από τα Αγαπημένα",
    "priceHistory": "Ιστορικό Τιμών",
    "certifiedStoresTooltip": "Εμφάνιση μόνο προϊόντων από πιστοποιημένα καταστήματα",
    "vendorPopupCertification": "Πιστοποίηση: {{certificationType}}",
    "vendorPopupInformation": "Πληροφορίες",
    "vendorPopupAddressNotAvailable": "Μόνο Ηλεκτρονικό κατάστημα",
    "vendorPopupPaymentMethods": "ΤΡΟΠΟΙ ΠΛΗΡΩΜΗΣ",
    "vendorPopupLearnMore": "Μάθε περισσότερα", "vendorPopupViewInStore": "Προβολή στο κατάστημα",
    "openingHoursNotAvailable": "Πληροφορίες ωραρίου μη διαθέσιμες",
    "closedToday": "Κλειστό σήμερα", "openUntil": "Ανοιχτό μέχρι τις {{time}}",
    "closedOpensAt": "Κλειστό - Ανοίγει στις {{time}}", "closedForToday": "Κλειστό για σήμερα",
    "openingHoursError": "Σφάλμα ωραρίου",
    "loginRequired": "Απαιτείται Σύνδεση",
    "loginToAddToFavorites": "Παρακαλώ συνδεθείτε για να προσθέσετε αυτό το προϊόν στα αγαπημένα σας",
    "productAddedToFavorites": "Το προϊόν {{productName}} προστέθηκε στα αγαπημένα",
    "linkCopied": "Ο Σύνδεσμος Αντιγράφηκε", "productLinkCopied": "Ο σύνδεσμος του προϊόντος αντιγράφηκε στο πρόχειρο",
    "copyFailed": "Η Αντιγραφή Απέτυχε", "couldNotCopyLink": " αδυναμία αντιγραφής συνδέσμου",
    "loginToSetPriceAlert": "Παρακαλώ συνδεθείτε για να ορίσετε ειδοποίηση τιμής",

    // Vendor Page
    "loadingVendor": "Φόρτωση καταστήματος...", "allStores": "Καταστήματα",
    "certifiedStoreLinkText": "Πιστοποιημένο Κατάστημα ({{certificationLevel}})",
    "certifiedStoreFullText": "Το {{vendorName}} είναι πιστοποιημένο κατάστημα ({{certificationLevel}})",
    "memberSinceDate": "Στο BestPrice από {{date}}",
    "ratingTooltip": "{{rating}} αστέρια από {{count}} αξιολογήσεις",
    "social_facebook": "Facebook", "social_twitter": "Twitter", "social_instagram": "Instagram", "social_youtube": "YouTube", "social_linkedin": "LinkedIn", "social_tiktok": "TikTok",
    "additionalStores": "{{count}} ακόμη {{storeLabel}}",
    "storeLabelSingular": "κατάστημα", "storeLabelPlural": "καταστήματα",
    "logoFor": "Λογότυπο {{name}}", "screenshotFor": "Στιγμιότυπο {{name}}",
    "authorizedReseller": "Εξουσιοδοτημένος Μεταπωλητής", "previewWebsite": "Προεπισκόπηση Ιστοσελίδας",
    "dealsFromVendor": "Προσφορές από {{vendorName}}",
    "popularCategoriesInVendor": "Δημοφιλείς Κατηγορίες {{vendorName}}",
    "viewAllVendorProducts": "Δες όλα τα προϊόντα<span class=\"hide-mobile\"> του καταστήματος</span>",
    "storeReviewsTitle": "Αξιολογήσεις Καταστήματος {{vendorName}}",
    "reviewCount": "{{count}} αξιολογήσεις", "rateIt": "Αξιολόγησέ το",
    "reviewsPlaceholder": "(Προβολή αξιολογήσεων - Χρειάζεται Υλοποίηση)",
    "servicePointsTitle": "Σημεία Εξυπηρέτησης {{vendorName}}", "servicePointsCount": "{{count}} σημεία",
    "storeAndPickup": "Κατάστημα / Παραλαβή", "mapPlaceholderText": "Map Placeholder - Απαιτείται Βιβλιοθήκη Χάρτη",
    "noLanguagesInRegion": "Δεν υπάρχουν γλώσσες για αυτήν την περιοχή ακόμη.",

    // UserButton & UserDropdownContent
    "toggleTheme": "Εναλλαγή θέματος",
    "productsYouWant": "Προϊόντα που θέλεις", "productsYouHave": "Προϊόντα που έχεις",
    "myOffers": "Οι Προσφορές μου", "priceDrops": "Ειδοποιήσεις Τιμών",
    "myCollections": "Οι Συλλογές μου", "newCollection": "Νέα Συλλογή...",
    "creditsClub": "Credits Club", "savedOrders": "Αποθηκευμένες Παραγγελίες",
    "myQuestions": "Οι Ερωτήσεις μου", "myReviews": "Οι Αξιολογήσεις μου",
    "myFriends": "Οι Φίλοι μου", "viewProfileTooltip": "Δείτε το προφίλ σας",
    "userMenuCaretAlt": "Άνοιγμα μενού χρήστη",

    // Footer
    "backToTop": "Επιστροφή στην κορυφή",
    "bestpriceSloganShort": "Η πραγματικά καλύτερη τιμή",
    "bestpriceSloganLong": "Το BestPrice είναι η πρώτη και μεγαλύτερη υπηρεσία σύγκρισης τιμών στην Ελλάδα.",
    "bestpriceSloganFindDeals": "Στο BestPrice θα βρεις γρήγορα και εύκολα πραγματικές προσφορές και την καλύτερη τιμή από τα μεγαλύτερα καταστήματα.",
    "bestpriceGive": "BestPrice Give", "footerBestPriceSectionTitle": "BestPrice",
    "aboutUs": "Σχετικά με εμάς", "ourBlog": "Το Blog μας",
    "buyingGuides": "Οδηγοί αγοράς", "purchaseInsurance": "Ασφάλιση Αγορών",
    "advertising": "Διαφήμιση", "bestpriceCertification": "Πιστοποίηση BestPrice",
    "customerReviewAwards": "Customer Review Awards", "ourAwards": "Οι διακρίσεις μας",
    "ourTeam": "Η ομάδα μας", "bestpriceAssistant": "BestPrice Assistant",
    "jobOpenings": "Θέσεις εργασίας ({{count}})", "contactUs": "Επικοινωνία",
    "inNumbers": "Σε αριθμούς",
    "storeCountLink": "{{count}} καταστήματα", "productCountLink": "{{count}} προϊόντα",
    "brandCountLink": "{{count}} κατασκευαστές","dealCountLink": "{{count}} προσφορές",
    "termsAndPrivacy": "Όροι χρήσης & ιδιωτικότητα", "termsOfUse": "Όροι χρήσης",
    "privacyPolicy": "Πολιτική προσωπικών δεδομένων", "cookiePolicy": "Χρήση cookies",
    "gdprLink": "GDPR", "dsaLink": "DSA",
    "bestpriceForMerchants": "BestPrice For Merchants",
    "merchantsSectionSlogan1": "Έχεις ηλεκτρονικό κατάστημα;",
    "merchantsSectionSlogan2": "Δες πως το BestPrice μπορεί να σε βοηθήσει να αυξήσεις τις πωλήσεις σου!",
    "forMerchantsButton": "Για εμπόρους",
    "bestpriceForBrands": "BestPrice For Brands",
    "brandsSectionSlogan": "Το BestPrice for Brands θα προσφέρει χρήσιμες πληροφορίες & υπηρεσίες σε κατασκευαστές (Brands).",
    "moreInfoButton": "Περισσότερα",
    "bestpriceOnFacebook": "Το BestPrice στο Facebook", "bestpriceOnX": "Το BestPrice στο X",
    "bestpriceOnThreads": "Το BestPrice στο Threads", "bestpriceOnInstagram": "Το BestPrice στο Instagram",
    "bestpriceOnTikTok": "Το BestPrice στο TikTok", "bestpriceOnYouTube": "Το BestPrice στο YouTube",
    "bestpriceOnLinkedIn": "Το BestPrice στο LinkedIn",
    "homepageTitle": "Αρχική σελίδα",
    "changeLanguage": "Αλλαγή Γλώσσας", "selectYourLanguageTitle": "Επιλέξτε τη Γλώσσα σας",
    "suggestedLanguages": "Προτεινόμενες γλώσσες", "allLanguages": "Όλες οι γλώσσες",
    "languageCategoryEurope": "Ευρώπη", "languageCategoryAsia": "Ασία",
    "languageCategoryAmericas": "Αμερική", "languageCategoryAfrica": "Αφρική και Μέση Ανατολή",
    "languageCategoryEasternEurope": "Ανατολική Ευρώπη", "languageCategoryWesternEurope": "Δυτική Ευρώπη",


    // Deals, Brands, Search
    "allBrands": "Όλες οι Μάρκες", "productsFromBrand": "Προϊόντα από {{brandName}}",
    "searchResultsFor": "Αποτελέσματα αναζήτησης για \"{{searchTerm}}\"",
    "noResultsFound": "Δεν βρέθηκαν αποτελέσματα για \"{{searchTerm}}\"",
    "sortBy": "Ταξινόμηση κατά", "viewAsGrid": "Προβολή Πλέγματος",
    "viewAsList": "Προβολή Λίστας", "itemsPerPage": "Αντικείμενα ανά σελίδα",
    "page": "Σελίδα", "of": "από", "nextPage": "Επόμενη", "previousPage": "Προηγούμενη",
    "todaysDeals": " σημερινές Προσφορές", "filterBy": "Φιλτράρισμα κατά",

    // Cart & Checkout
    "shoppingCart": "Καλάθι Αγορών", "proceedToCheckout": "Ολοκλήρωση Παραγγελίας",
    "item": "Προϊόν", "quantity": "Ποσότητα", "subtotal": "Μερικό Σύνολο", "total": "Συνολικό Ποσό",
    "emptyCart": "Το καλάθι σας είναι άδειο.", "continueShopping": "Συνέχεια Αγορών",
    "shippingAddress": "Διεύθυνση Αποστολής", "billingAddress": "Διεύθυνση Χρέωσης",
    "paymentInformation": "Στοιχεία Πληρωμής", "placeOrder": "Καταχώρηση Παραγγελίας",
    "orderSummary": "Σύνοψη Παραγγελίας", "discountCode": "Κωδικός Έκπτωσης", "apply": "Εφαρμογή",

    // Payment Methods (Dynamic Keys)
    "paymentMethod_credit_card": "Πιστωτική Κάρτα", "paymentMethod_bank_transfer": "Τραπεζική Κατάθεση",
    "paymentMethod_paypal": "PayPal", "paymentMethod_cash_on_delivery": "Αντικαταβολή",
    "paymentMethod_pickup_from_store": "Παραλαβή από το Κατάστημα", "paymentMethod_klarna": "Klarna",
    "paymentMethod_apple_pay": "Apple Pay", "paymentMethod_google_pay": "Google Pay",
    "paymentMethod_ideal": "iDEAL", "paymentMethod_crypto": "Κρυπτονόμισμα",
    "paymentMethod_pay_by_link": "Πληρωμή με Σύνδεσμο", "paymentMethod_pickup_via": "Παραλαβή μέσω Courier/Υπηρεσίας",

    // Category Slugs
    'technology': 'Τεχνολογία', 'home-garden': 'Σπίτι & Κήπος', 'fashion': 'Μόδα',
    'health-beauty': 'Υγεία & Ομορφιά', 'kids-baby': 'Παιδικά - Βρεφικά', 'hobby-sports': 'Hobby, Αθλητισμός',
    'auto-moto': 'Μηχανοκίνηση',
    'mobile-telephony': 'Κινητή Τηλεφωνία', 'computers': 'Υπολογιστές', 'laptops-accessories': 'Laptops, Αξεσουάρ',
    'visual': 'Εικόνα', 'smartwatches-wearables': 'Smartwatches, Wearables', 'tablets-accessories': 'Tablets, Αξεσουάρ',
    'video-games': 'Video Games', 'audio': 'Ήχος', 'photo-video': 'Φωτογραφία, Video',
    'electronics': 'Ηλεκτρονικά', 'telephony': 'Τηλεφωνία', 'gadgets': 'Gadgets',
    'home-appliances': 'Οικιακές Συσκευές', 'tools': 'Εργαλεία', 'furniture': 'Έπιπλα',
    'garden': 'Κήπος', 'home-items': 'Είδη Σπιτιού', 'linens': 'Λευκά Είδη',
    'lighting': 'Φωτισμός', 'kitchenware': 'Είδη Κουζίνας', 'food-beverages': 'Τρόφιμα & Ποτά',
    'electrical-supplies': 'Ηλεκτρολογικά', 'smoking-accessories': 'Είδη Καπνιστού', 'office-supplies': 'Είδη Γραφείου',
    'gift-items': 'Είδη Δώρων', 'security-systems': 'Συστήματα Ασφαλείας', 'professional-equipment': 'Επαγγελματικός Εξοπλισμός',
    'seasonal-items': 'Εποχιακά Είδη', 'shopping-bags': 'Τσάντες για Ψώνια', 'shopping-trolleys': 'Καρότσια Λαϊκής',
    'church-items': 'Εκκλησιαστικά Είδη', 'pet-supplies': 'Είδη Κατοικιδίων', 'womens-fashion': 'Γυναικεία Μόδα',
    'mens-fashion': 'Ανδρική Μόδα', 'watches': 'Ρολόγια', 'jewelry': 'Κοσμήματα',
    'eyewear': 'Οπτικά', 'converse-all-star': 'Converse All Star', 'rain-umbrellas': 'Ομπρέλες Βροχής',
    'shoe-accessories': 'Αξεσουάρ Παπουτσιών', 'kids-baby-fashion': 'Παιδική, Βρεφική Μόδα', 'sneakers': 'Sneakers: Τα πιο trendy παπούτσια για κάθε στυλ και περίσταση!',
    'grooming': 'Περιποίηση', 'pharmacy-products': 'Είδη Φαρμακείου', 'perfumes': 'Αρώματα',
    'dietary-supplements': 'Συμπληρώματα Διατροφής','grooming-devices': 'Συσκευές Περιποίησης', 'makeup': 'Μακιγιάζ',
    'sunscreen-tanning': 'Αντηλιακή Προστασία, Μαύρισμα', 'medical-supplies': 'Ιατρικά Είδη', 'manicure-pedicure': 'Μανικιούρ - Πεντικιούρ',
    'oral-hygiene': 'Στοματική Υγιεινή', 'sex-toys': 'Sex Toys', 'firming-slimming': 'Σύσφιξη, Αδυνάτισμα',
    'cannabis-products': 'Προϊόντα Κάνναβης', 'orthopedics': 'Ορθοπεδικά', 'patient-aids': 'Βοηθήματα Ασθενών',
    'optics': 'Οπτικά', 'korean-cosmetics': 'Κορεάτικα Καλλυντικά', 'kids-toys': 'Παιδικά Παιχνίδια',
    'school-supplies': 'Σχολικά Είδη', 'baby-toys': 'Βρεφικά Παιχνίδια', 'baby-items': 'Βρεφικά Είδη',
    'kids-linens': 'Παιδικά Λευκά Είδη', 'christening-items': 'Βαπτιστικά', 'kids-watches': 'Παιδικά Ρολόγια',
    'sports': 'Αθλήματα', 'cycling': 'Ποδηλασία', 'leisure-time': 'Ελεύθερος Χρόνος',
    'fishing-diving': 'Ψάρεμα, Καταδύσεις', 'beach-sea-items': 'Είδη Θαλάσσης', 'camping': 'Camping',
    'travel-items-bags': 'Είδη Ταξιδίου, Τσάντες', 'books': 'Βιβλία', 'hunting': 'Κυνήγι',
    'fitness-equipment': 'Είδη Γυμναστικής', 'pet-supplies-hobby': 'Είδη Κατοικιδίων (Hobby)', 'drones-accessories': 'Drones & Αξεσουάρ',
    'electric-scooters': 'Ηλεκτρικά Πατίνια', 'hoverboards': 'Hoverboards', 'musical-instruments': 'Μουσικά Όργανα',
    'sports-accessories': 'Αξεσουάρ Αθλημάτων', 'exploration-items': 'Είδη Εξερεύνησης',
    'womens-sportswear': 'Γυναικεία Αθλητικά Ρούχα', 'womens-sports-shoes': 'Γυναικεία Αθλητικά Παπούτσια',
    'mens-sportswear': 'Ανδρικά Αθλητικά Ρούχα', 'mens-sports-shoes': 'Ανδρικά Αθλητικά Παπούτσια',
    'car': 'Αυτοκίνητο', 'motorcycle': 'Μοτοσυκλέτα', 'boat': 'Σκάφος',
    'truck-items': 'Είδη Φορτηγού', 'smartphones': 'Κινητά', 'iphone': 'iPhone',
    'mobile-cases': 'Θήκες Κινητών', 'bluetooth-handsfree': 'Bluetooth Handsfree', 'handsfree': 'Handsfree',
    'mobile-chargers': 'Φορτιστές Κινητών', 'tempered-glass': 'Tempered Glass', 'screen-protectors': 'Προστασία Οθόνης',
    'power-banks': 'Power Banks', 'mobile-batteries': 'Μπαταρίες Κινητών', 'selfie-sticks': 'Selfie Stick',
    'mobile-holders': 'Βάσεις Κινητού', 'charging-data-cables': 'Καλώδια Φόρτισης, Μεταφοράς Δεδομένων', 'anti-lost-trackers': 'Anti-Lost Tracker',
    'mobile-spare-parts': 'Ανταλλακτικά Κινητών', 'mobile-gimbals': 'Gimbal Κινητών', 'stylus-pens': 'Γραφίδες Αφής',
    'stylus-accessories': 'Αξεσουάρ Γραφίδας', 'bluetooth-headset-accessories': 'Αξεσουάρ Ακουστικών Bluetooth',
    'anti-lost-tracker-accessories': 'Αξεσουάρ Anti-Lost Tracker',
    'pop-sockets': 'Pop Sockets', 'mobile-tripods': 'Τρίποδα Κινητών', 'mobile-service-tools': 'Εργαλεία για Service Κινητών',
    'mobile-charms': 'Διακοσμητικά Κινητών', 'mobile-accessories': 'Αξεσουάρ Κινητών',
    'mobile-camera-protection': 'Προστασία Κάμερας Κινητών', 'mobile-camera-lenses': 'Φακοί Κάμερας Κινητών',
    'mobile-signal-boosters': 'Ενισχυτές Σήματος Κινητής Τηλεφωνίας', 'mobile-gaming-buttons': 'Πλήκτρα Mobile Gaming',
    'connection-packs': 'Πακέτα Σύνδεσης', 'portable-bluetooth-speakers-mobile': 'Φορητά Ηχεία Bluetooth',
    'ps5-games': 'PS5 Games', 'pc-games': 'PC Games', 'amplifiers-preamplifiers': 'Ενισχυτές, Προενισχυτές',
    'hi-fi-systems': 'Συστήματα Hi-Fi',
  },
  // ============================ Spanish (es) - Placeholder, needs full translation ============================
  es: {
    // --- Start Copying from English 'en' section above and translate each key ---
    email: '[es] Email', password: '[es] Password', // ... and so on for ALL keys
    // ...
    languageCategoryEasternEurope: "[es] Eastern Europe", // Example of a new key added
    languageCategoryWesternEurope: "[es] Western Europe", // Example of a new key added
    // ... ensure ALL keys from 'en' are here and translated/placeholdered
    'technology': '[es] Technology', // ... and all category slugs
  },
  // ============================ French (fr) - Placeholder, needs full translation =============================
  fr: {
    // --- Start Copying from English 'en' section above and translate each key ---
    email: '[fr] Email', password: '[fr] Password', // ... and so on for ALL keys
    // ...
    languageCategoryEasternEurope: "[fr] Eastern Europe",
    languageCategoryWesternEurope: "[fr] Western Europe",
    // ... ensure ALL keys from 'en' are here and translated/placeholdered
    'technology': '[fr] Technology', // ... and all category slugs
  },
  // ============================ German (de) - Placeholder, needs full translation =============================
  de: {
    // --- Start Copying from English 'en' section above and translate each key ---
    email: '[de] Email', password: '[de] Password', // ... and so on for ALL keys
    // ...
    languageCategoryEasternEurope: "[de] Eastern Europe",
    languageCategoryWesternEurope: "[de] Western Europe",
    // ... ensure ALL keys from 'en' are here and translated/placeholdered
    'technology': '[de] Technology', // ... and all category slugs
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'el',
  setLanguage: () => {},
  translations: defaultTranslations,
  isLoaded: false,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('el');
  const [translations, setTranslations] = useState<Translations>(defaultTranslations);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const detectLanguage = async () => {
      let detectedLang: Language = 'el';
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
      if (!isLoaded && (Object.keys(translations).length === 0 || translations === defaultTranslations )) { 
         setTranslations(defaultTranslations); 
      }

      try {
        const { data, error } = await (supabase as any).from('translations').select('*');
        if (error) {
            console.error('Error fetching custom translations:', error); 
            if (Object.keys(translations).length === 0 || translations === defaultTranslations) {
              setTranslations(defaultTranslations);
            }
            return;
        };
        if (data && data.length > 0) {
          const newLoadedTranslations = JSON.parse(JSON.stringify(defaultTranslations)) as Translations;
          data.forEach((item: any) => {
            if (item && item.key) {
              (Object.keys(newLoadedTranslations) as Language[]).forEach(lang => {
                if (item[lang] && typeof item[lang] === 'string') {
                  newLoadedTranslations[lang][item.key] = item[lang];
                }
              });
            }
          });
          setTranslations(newLoadedTranslations);
        } else {
           if (Object.keys(translations).length === 0 || translations === defaultTranslations) {
            setTranslations(defaultTranslations);
          }
        }
      } catch (error) {
        console.error('Error processing custom translations:', error);
        if (Object.keys(translations).length === 0 || translations === defaultTranslations) {
          setTranslations(defaultTranslations);
        }
      }
    };

    if (isLoaded) {
        loadCustomTranslations();
    } else if (Object.keys(translations).length === 0) { 
        setTranslations(defaultTranslations);
    }
  }, [isLoaded]); 

  const setLanguage = useCallback((lang: Language) => { // Wrapped in useCallback
    localStorage.setItem('language', lang);
    setLanguageState(lang);
    if (user) { 
      supabase.from('profiles').update({ language: lang } as any).eq('id', user.id)
        .then(({ error }) => { if (error) { console.error('Error saving language preference:', error); } });
    }
  }, [user]); // user is a dependency

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => useContext(LanguageContext);
