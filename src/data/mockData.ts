// --- Interfaces ---

// Category interface for nested structure
export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  image: string | null;
  isMain?: boolean;
}

// Product price from vendor
export interface ProductPrice {
  vendorId: number;
  price: number;
  shippingCost?: number;
  inStock: boolean;
  productUrl?: string;
  lastUpdated?: string;
  discountPrice?: number;
  installments?: {
      count: number;
      monthlyAmount?: number;
  };
}

// Product Variant Interface
export interface ProductVariant {
  sku?: string;
  gtin?: string;
  attributes: Record<string, string>;
  image?: string;
  prices: ProductPrice[];
}

// Opening Hours Interface
export interface OpeningHours {
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  opens: string; closes: string; notes?: string;
}

// Payment Methods Enum
 export enum PaymentMethod {
   COD = "Αντικαταβολή", CreditCard = "Πιστωτικές κάρτες", PayPal = "PayPal", BankTransfer = "Τραπεζική κατάθεση", VivaPayments = "Viva Payments", Paysafecard = "Paysafecard", Courier = "Ταχυμεταφορά (Courier)",
   NetworkPickup = "Παραλαβή από δίκτυο", TransportCompany = "Μεταφορική εταιρία", PickupVia = "Παραλαβή μέσω", FreeReturn = "Δωρεάν επιστροφή", PointsCollection = "Συλλογή πόντων", GiftCards = "Δωροκάρτες",
   ExtendedWarranty = "Επέκταση εγγύησης", WeddingList = "Λίστα γάμου/μωρού", DeviceRecycling = "Ανακύκλωση συσκευών", Klarna = "Klarna", Epistrofi = "€πιστροφή Eurobank", Installments = "Άτοκες Δόσεις", LoyaltyPoints = "Πόντοι Επιβράβευσης"
 }

// Enhanced Vendor Interface
export interface Vendor {
  id: number;
  name: string;
  slug?: string;
  logo: string;
  rating?: number;
  url: string;
  certification?: 'Gold' | 'Silver' | 'Bronze' | '';
  telephone?: string[];
  location?: { lat: number; lng: number }[];
  address?: string[];
  paymentMethods?: PaymentMethod[];
  numberOfRatings?: number;
  shippingPolicySummary?: string;
  returnPolicySummary?: string;
  isMarketplace?: boolean;
  dateJoined?: string;
  socialLinks?: Record<string, string>;
  openingHours?: OpeningHours[];
  statusMessage?: string;
}

export const vendors: Vendor[] = [
  {
    id: 1, name: 'You', slug: 'you', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/252.svg', rating: 4.5, numberOfRatings: 1500, certification: 'Bronze', url: 'https://www.you.gr', telephone: ['211 9991900'], address: ['Αργυρουπόλεως 2Α, Καλλιθέα'], location: [{ lat: 37.9337, lng: 23.7004 }], paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn, PaymentMethod.Klarna, PaymentMethod.Installments, PaymentMethod.LoyaltyPoints], shippingPolicySummary: "Δωρεάν μεταφορικά άνω των 50€", dateJoined: "2018-05-20",
    socialLinks: { facebook: "https://www.facebook.com/You.gr" },
    openingHours: [ { dayOfWeek: 'Monday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Tuesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Wednesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Thursday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Friday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Saturday', opens: '09:00', closes: '18:00' } ]
  },
  {
    id: 2, name: 'Plaisio', slug: 'plaisio', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/79.svg', rating: 4.2, numberOfRatings: 2100, certification: 'Silver', url: 'https://www.plaisio.gr', telephone: ['210 2895000'], address: ['Στρατηγού Μακρυγιάννη 54, Μοσχάτο'], location: [{ lat: 37.9530, lng: 23.6845 }], paymentMethods: [PaymentMethod.COD, PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.Courier, PaymentMethod.PickupVia, PaymentMethod.FreeReturn, PaymentMethod.GiftCards, PaymentMethod.ExtendedWarranty, PaymentMethod.Installments], dateJoined: "2015-11-01",
    socialLinks: { facebook: "https://www.facebook.com/plaisio", instagram: "https://www.instagram.com/plaisioofficial/", twitter: "https://twitter.com/PlaisioOfficial" },
    openingHours: [ { dayOfWeek: 'Monday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Tuesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Wednesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Thursday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Friday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Saturday', opens: '09:00', closes: '20:00' } ]
  },
  {
    id: 3, name: 'Public', slug: 'public', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/743.svg', rating: 4.7, numberOfRatings: 5500, certification: 'Gold', url: 'https://www.public.gr', telephone: ['210 8181333'], address: ['Θηβαϊδος 22, Κηφισιά', 'Καραγεώργη Σερβίας 1, Πλατεία Συντάγματος, 10563, Αθήνα'], location: [{ lat: 38.0747, lng: 23.7582 }], paymentMethods: [PaymentMethod.COD, PaymentMethod.CreditCard, PaymentMethod.PayPal, PaymentMethod.BankTransfer, PaymentMethod.Courier, PaymentMethod.FreeReturn, PaymentMethod.PointsCollection, PaymentMethod.GiftCards, PaymentMethod.ExtendedWarranty, PaymentMethod.DeviceRecycling, PaymentMethod.Klarna], isMarketplace: true, returnPolicySummary: "Επιστροφές εντός 30 ημερών", dateJoined: "2010-03-10",
    socialLinks: { facebook: "https://facebook.com/public.gr", instagram: "https://instagram.com/public_stores", twitter: "https://twitter.com/publicstores", youtube: "https://www.youtube.com/user/publicstores" },
    openingHours: [ { dayOfWeek: 'Monday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Tuesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Wednesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Thursday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Friday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Saturday', opens: '09:00', closes: '20:00' }, { dayOfWeek: 'Sunday', opens: '11:00', closes: '19:00', notes: "Select stores only" } ]
  },
  {
    id: 4, name: 'Κωτσόβολος', slug: 'kotsovolos', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/496.svg', rating: 4.0, numberOfRatings: 3200, certification: 'Gold', url: 'https://www.kotsovolos.gr', telephone: ['210 2899999'], address: ['Λεωφόρος Συγγρού 257-259, Νέα Σμύρνη'], location: [{ lat: 37.9465, lng: 23.7140 }], paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn], dateJoined: "2012-08-01",
    openingHours: [ { dayOfWeek: 'Monday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Tuesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Wednesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Thursday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Friday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Saturday', opens: '09:00', closes: '20:00' } ]
  },
  {
    id: 5, name: 'Funky Buddha', slug: 'funky-buddha', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/4351.svg', rating: 4.3, numberOfRatings: 800, certification: '', url: 'https://www.funky-buddha.com', telephone: ['211 1030800'], address: ['Ερμού 23-25, Αθήνα'], location: [{ lat: 37.9768, lng: 23.7283 }], paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn, PaymentMethod.COD, PaymentMethod.PayPal], dateJoined: "2019-01-15", socialLinks: { instagram: "https://www.instagram.com/funkybuddha_" }
  },
  {
    id: 6, name: 'Germanos', slug: 'germanos', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/8697.svg', rating: 4.1, numberOfRatings: 1800, certification: '', url: 'https://www.germanos.gr', telephone: ['800 11 40000'], address: ['Λεωφόρος Κηφισίας 196, Νέο Ψυχικό'], location: [{ lat: 38.0076, lng: 23.7779 }], paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn, PaymentMethod.COD], dateJoined: "2011-06-30"
  },
  {
    id: 7, name: 'e-shop.gr', slug: 'e-shop-gr', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/16.svg', rating: 3.2, numberOfRatings: 4500, certification: 'Gold', url: 'http://www.e-shop.gr', telephone: ['211 5000500'], address: ['Πανεπιστημίου 44, Αθήνα'], location: [{ lat: 37.9800, lng: 23.7328 }], paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn, PaymentMethod.COD, PaymentMethod.PayPal], dateJoined: "2008-01-01",
    openingHours: [ { dayOfWeek: 'Monday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Tuesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Wednesday', opens: '09:00', closes: '18:00' }, { dayOfWeek: 'Thursday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Friday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Saturday', opens: '09:00', closes: '17:00' } ]
  },
  {
    id: 8, name: 'Χαμόγελο του Παιδιού', slug: 'hamogelo-toy-paidioy', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/874.svg', rating: 4.7, numberOfRatings: 300, certification: 'Bronze', url: 'https://www.hamogelo.gr', telephone: ['11040'], address: ['Ομήρου 9, Αθήνα'], location: [{ lat: 37.9780, lng: 23.7355 }], paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.PayPal], dateJoined: "2014-02-10", socialLinks: { facebook: "https://www.facebook.com/HamogeloTouPaidiou" }
  },
];

// Brand Interface
export interface Brand {
  id: number;
  name: string;
  logo: string;
  slug?: string;
  officialWebsite?: string;
  description?: string;
  countryOfOrigin?: string;
}

// Product Interface with Gift Attributes
export interface Product {
  id: number;
  title: string;
  slug?: string;
  brand?: string;
  model?: string;
  mpn?: string;
  gtin?: string;
  sku?: string;
  categoryIds: number[]; // MANDATORY ARRAY
  description: string;
  shortDescription?: string;
  image: string;
  images?: string[];          // Optional Array
  videos?: string[];          // Optional Array
  rating?: number;
  reviews?: number;
  specifications?: Record<string, string | number | boolean>;
  prices: ProductPrice[];      // MANDATORY ARRAY
  lowestPrice?: number;
  bestPriceVendorId?: number;
  hasVariants?: boolean;
  variants?: ProductVariant[]; // Optional Array
  variantAttributes?: string[];// Optional Array
  status?: 'active' | 'inactive' | 'discontinued';
  isFeatured?: boolean;
  tags?: string[];           // Optional Array
  dateAdded?: string;
  lastModified?: string;
  releaseDate?: string;
  weight?: number;
  dimensions?: { length?: number; width?: number; height?: number; unit?: 'cm' | 'in'; };
  shippingClass?: string;
  relatedProductIds?: number[]; // Optional Array
  comparisonProductIds?: number[]; // Optional Array
  giftAttributes?: { // Optional Object
    recipient?: ('men' | 'women' | 'teens' | 'kids9-11' | 'kids6-8' | 'toddlers' | 'babies')[]; // Optional Array
    occasion?: string[]; // Optional Array
    interest?: string[]; // Optional Array
    genderTarget?: 'male' | 'female' | 'unisex'; // NEW
  };
}


// --- Data Arrays ---

// --- Main Categories ---
export const mainCategories: Category[] = [
  { id: 1, name: 'Τεχνολογία', slug: 'technology', parentId: null, image: null, isMain: true },
  { id: 2, name: 'Σπίτι & Κήπος', slug: 'home-garden', parentId: null, image: null, isMain: true },
  { id: 3, name: 'Μόδα', slug: 'fashion', parentId: null, image: null, isMain: true },
  { id: 4, name: 'Υγεία & Ομορφιά', slug: 'health-beauty', parentId: null, image: null, isMain: true },
  { id: 5, name: 'Παιδικά - Βρεφικά', slug: 'kids-baby', parentId: null, image: null, isMain: true },
  { id: 6, name: 'Hobby, Αθλητισμός', slug: 'hobby-sports', parentId: null, image: null, isMain: true },
  { id: 7, name: 'Μηχανοκίνηση', slug: 'auto-moto', parentId: null, image: null, isMain: true }
];

// --- Subcategories and nested categories ---
export const categories: Category[] = [
  { id: 10, name: 'Κινητή Τηλεφωνία', slug: 'mobile', parentId: 1, image: '/dist/images/cat/mobile.webp' },
  { id: 11, name: 'Υπολογιστές', slug: 'computers', parentId: 1, image: '/dist/images/cat/computers.webp' },
  { id: 12, name: 'Laptops, Αξεσουάρ', slug: 'laptops-accessories', parentId: 1, image: '/dist/images/cat/laptops-accessories.webp' },
  { id: 13, name: 'Εικόνα', slug: 'visual', parentId: 1, image: '/dist/images/cat/visual.webp' },
  { id: 14, name: 'Smartwatches, Wearables', slug: 'smartwatches-wearables', parentId: 1, image: '/dist/images/cat/smartwatches-wearables.webp' },
  { id: 15, name: 'Tablets, Αξεσουάρ', slug: 'tablets-accessories', parentId: 1, image: '/dist/images/cat/tablets-accessories.webp' },
  { id: 16, name: 'Video Games', slug: 'video-games', parentId: 1, image: '/dist/images/cat/video-games.webp' },
  { id: 17, name: 'Ήχος', slug: 'audio', parentId: 1, image: '/dist/images/cat/audio.webp' },
  { id: 18, name: 'Φωτογραφία, Video', slug: 'photo-video', parentId: 1, image: '/dist/images/cat/photo-video.webp' },
  { id: 19, name: 'Ηλεκτρονικά', slug: 'consumer-electronics', parentId: 1, image: '/dist/images/cat/consumer-electronics.webp' },
  { id: 20, name: 'Τηλεφωνία', slug: 'telephony', parentId: 1, image: '/dist/images/cat/telephony.webp' },
  { id: 21, name: 'Gadgets', slug: 'gadgets', parentId: 1, image: '/dist/images/cat/gadgets.webp' },
  { id: 22, name: 'Οικιακές Συσκευές', slug: 'home-appliances', parentId: 2, image: '/dist/images/cat/home-appliances.webp' },
  { id: 23, name: 'Εργαλεία', slug: 'tools', parentId: 2, image: '/dist/images/cat/tools.webp' },
  { id: 24, name: 'Έπιπλα', slug: 'furniture', parentId: 2, image: '/dist/images/cat/furniture.webp' },
  { id: 25, name: 'Κήπος', slug: 'garden', parentId: 2, image: '/dist/images/cat/garden.webp' },
  { id: 26, name: 'Είδη Σπιτιού', slug: 'home-items', parentId: 2, image: '/dist/images/cat/home-items.webp' },
  { id: 27, name: 'Λευκά Είδη', slug: 'linens', parentId: 2, image: '/dist/images/cat/linens.webp' },
  { id: 28, name: 'Φωτισμός', slug: 'lighting', parentId: 2, image: '/dist/images/cat/lighting.webp' },
  { id: 29, name: 'Είδη Κουζίνας', slug: 'kitchenware', parentId: 2, image: '/dist/images/cat/kitchenware.webp' },
  { id: 30, name: 'Τρόφιμα & Ποτά', slug: 'food-beverages', parentId: 2, image: '/dist/images/cat/food-beverages.webp' },
  { id: 31, name: 'Ηλεκτρολογικά', slug: 'electrical-supplies', parentId: 2, image: '/dist/images/cat/electrical-supplies.webp' },
  { id: 32, name: 'Είδη Καπνιστού', slug: 'smoking-accessories', parentId: 2, image: '/dist/images/cat/smoking-accessories.webp' },
  { id: 33, name: 'Είδη Γραφείου', slug: 'office-supplies', parentId: 2, image: '/dist/images/cat/office-supplies.webp' },
  { id: 34, name: 'Είδη Δώρων', slug: 'gift-items', parentId: 2, image: '/dist/images/cat/gift-items.webp' },
  { id: 35, name: 'Συστήματα Ασφαλείας', slug: 'security-systems', parentId: 2, image: '/dist/images/cat/security-systems.webp' },
  { id: 36, name: 'Επαγγελματικός Εξοπλισμός', slug: 'professional-equipment', parentId: 2, image: '/dist/images/cat/professional-equipment.webp' },
  { id: 37, name: 'Εποχιακά Είδη', slug: 'seasonal-items', parentId: 2, image: '/dist/images/cat/seasonal-items.webp' },
  { id: 38, name: 'Τσάντες για Ψώνια', slug: 'shopping-bags', parentId: 2, image: '/dist/images/cat/shopping-bags.webp' },
  { id: 39, name: 'Καρότσια Λαϊκής', slug: 'shopping-trolleys', parentId: 2, image: '/dist/images/cat/shopping-trolleys.webp' },
  { id: 40, name: 'Εκκλησιαστικά Είδη', slug: 'church-items', parentId: 2, image: '/dist/images/cat/church-items.webp' },
  { id: 41, name: 'Είδη Κατοικιδίων', slug: 'pet-supplies', parentId: 2, image: '/dist/images/cat/pet-supplies.webp' },
  { id: 42, name: 'Γυναικεία Μόδα', slug: 'womens-fashion', parentId: 3, image: '/dist/images/cat/womens-fashion.webp' },
  { id: 43, name: 'Ανδρική Μόδα', slug: 'mens-fashion', parentId: 3, image: '/dist/images/cat/mens-fashion.webp' },
  { id: 44, name: 'Ρολόγια', slug: 'watches', parentId: 3, image: '/dist/images/cat/watches.webp' },
  { id: 45, name: 'Κοσμήματα', slug: 'jewelry', parentId: 3, image: '/dist/images/cat/jewelry.webp' },
  { id: 46, name: 'Οπτικά', slug: 'eyewear', parentId: 3, image: '/dist/images/cat/eyewear.webp' },
  { id: 47, name: 'Converse All Star', slug: 'converse-all-star', parentId: 3, image: '/dist/images/cat/converse-all-star.webp' },
  { id: 48, name: 'Ομπρέλες Βροχής', slug: 'rain-umbrellas', parentId: 3, image: '/dist/images/cat/rain-umbrellas.webp' },
  { id: 49, name: 'Αξεσουάρ Παπουτσιών', slug: 'shoe-accessories', parentId: 3, image: '/dist/images/cat/shoe-accessories.webp' },
  { id: 50, name: 'Παιδική, Βρεφική Μόδα', slug: 'kids-baby-fashion', parentId: 3, image: '/dist/images/cat/kids-baby-fashion.webp' },
  { id: 51, name: 'Sneakers: Τα πιο trendy παπούτσια για κάθε στυλ και περίσταση!', slug: 'sneakers', parentId: 3, image: '/dist/images/cat/sneakers.webp' },
  { id: 52, name: 'Περιποίηση', slug: 'grooming', parentId: 4, image: '/dist/images/cat/grooming.webp' },
  { id: 53, name: 'Είδη Φαρμακείου', slug: 'pharmacy-products', parentId: 4, image: '/dist/images/cat/pharmacy-products.webp' },
  { id: 54, name: 'Αρώματα', slug: 'perfumes', parentId: 4, image: '/dist/images/cat/perfumes.webp' },
  { id: 55, name: 'Συμπληρώματα Διατροφής', slug: 'dietary-supplements', parentId: 4, image: '/dist/images/cat/dietary-supplements.webp' },
  { id: 56, name: 'Συσκευές Περιποίησης', slug: 'grooming-devices', parentId: 4, image: '/dist/images/cat/grooming-devices.webp' },
  { id: 57, name: 'Μακιγιάζ', slug: 'makeup', parentId: 4, image: '/dist/images/cat/makeup.webp' },
  { id: 58, name: 'Αντηλιακή Προστασία, Μαύρισμα', slug: 'sunscreen-tanning', parentId: 4, image: '/dist/images/cat/sunscreen-tanning.webp' },
  { id: 59, name: 'Ιατρικά Είδη', slug: 'medical-supplies', parentId: 4, image: '/dist/images/cat/medical-supplies.webp' },
  { id: 60, name: 'Μανικιούρ - Πεντικιούρ', slug: 'manicure-pedicure', parentId: 4, image: '/dist/images/cat/manicure-pedicure.webp' },
  { id: 61, name: 'Στοματική Υγιεινή', slug: 'oral-hygiene', parentId: 4, image: '/dist/images/cat/oral-hygiene.webp' },
  { id: 62, name: 'Sex Toys', slug: 'sex-toys', parentId: 4, image: '/dist/images/cat/sex-toys.webp' },
  { id: 63, name: 'Σύσφιξη, Αδυνάτισμα', slug: 'firming-slimming', parentId: 4, image: '/dist/images/cat/firming-slimming.webp' },
  { id: 64, name: 'Προϊόντα Κάνναβης', slug: 'cannabis-products', parentId: 4, image: '/dist/images/cat/cannabis-products.webp' },
  { id: 65, name: 'Ορθοπεδικά', slug: 'orthopedics', parentId: 4, image: '/dist/images/cat/orthopedics.webp' },
  { id: 66, name: 'Βοηθήματα Ασθενών', slug: 'patient-aids', parentId: 4, image: '/dist/images/cat/patient-aids.webp' },
  { id: 67, name: 'Οπτικά (Υγεία & Ομορφιά)', slug: 'optics', parentId: 4, image: '/dist/images/cat/optics.webp' },
  { id: 68, name: 'Κορεάτικα Καλλυντικά', slug: 'korean-cosmetics', parentId: 4, image: '/dist/images/cat/korean-cosmetics.webp' },
  { id: 69, name: 'Παιδική, Βρεφική Μόδα (Παιδικά)', slug: 'kids-baby-fashion-main', parentId: 5, image: '/dist/images/cat/kids-baby-fashion-main.webp' },
  { id: 70, name: 'Παιδικά Παιχνίδια', slug: 'kids-toys', parentId: 5, image: '/dist/images/cat/kids-toys.webp' },
  { id: 71, name: 'Σχολικά Είδη', slug: 'school-supplies', parentId: 5, image: '/dist/images/cat/school-supplies.webp' },
  { id: 72, name: 'Βρεφικά Παιχνίδια', slug: 'baby-toys', parentId: 5, image: '/dist/images/cat/baby-toys.webp' },
  { id: 73, name: 'Βρεφικά Είδη', slug: 'baby-items', parentId: 5, image: '/dist/images/cat/baby-items.webp' },
  { id: 74, name: 'Παιδικά Λευκά Είδη', slug: 'kids-linens', parentId: 5, image: '/dist/images/cat/kids-linens.webp' },
  { id: 75, name: 'Βαπτιστικά', slug: 'christening-items', parentId: 5, image: '/dist/images/cat/christening-items.webp' },
  { id: 76, name: 'Παιδικά Ρολόγια', slug: 'kids-watches', parentId: 5, image: '/dist/images/cat/kids-watches.webp' },
  { id: 77, name: 'Αθλήματα', slug: 'sports', parentId: 6, image: '/dist/images/cat/sports.webp' },
  { id: 78, name: 'Ποδηλασία', slug: 'cycling', parentId: 6, image: '/dist/images/cat/cycling.webp' },
  { id: 79, name: 'Ελεύθερος Χρόνος', slug: 'leisure-time', parentId: 6, image: '/dist/images/cat/leisure-time.webp' },
  { id: 80, name: 'Ψάρεμα, Καταδύσεις', slug: 'fishing-diving', parentId: 6, image: '/dist/images/cat/fishing-diving.webp' },
  { id: 81, name: 'Είδη Θαλάσσης', slug: 'beach-sea-items', parentId: 6, image: '/dist/images/cat/beach-sea-items.webp' },
  { id: 82, name: 'Camping', slug: 'camping', parentId: 6, image: '/dist/images/cat/camping.webp' },
  { id: 83, name: 'Είδη Ταξιδίου, Τσάντες', slug: 'travel-items-bags', parentId: 6, image: '/dist/images/cat/travel-items-bags.webp' },
  { id: 84, name: 'Βιβλία', slug: 'books', parentId: 6, image: '/dist/images/cat/books.webp' },
  { id: 85, name: 'Κυνήγι', slug: 'hunting', parentId: 6, image: '/dist/images/cat/hunting.webp' },
  { id: 86, name: 'Είδη Γυμναστικής', slug: 'fitness-equipment', parentId: 6, image: '/dist/images/cat/fitness-equipment.webp' },
  { id: 87, name: 'Είδη Κατοικιδίων (Hobby)', slug: 'pet-supplies-hobby', parentId: 6, image: '/dist/images/cat/pet-supplies-hobby.webp' },
  { id: 88, name: 'Drones & Αξεσουάρ', slug: 'drones-accessories', parentId: 6, image: '/dist/images/cat/drones-accessories.webp' },
  { id: 89, name: 'Ηλεκτρικά Πατίνια', slug: 'electric-scooters', parentId: 6, image: '/dist/images/cat/electric-scooters.webp' },
  { id: 90, name: 'Hoverboards', slug: 'hoverboards', parentId: 6, image: '/dist/images/cat/hoverboards.webp' },
  { id: 91, name: 'Μουσικά Όργανα', slug: 'musical-instruments', parentId: 6, image: '/dist/images/cat/musical-instruments.webp' },
  { id: 92, name: 'Αξεσουάρ Αθλημάτων', slug: 'sports-accessories', parentId: 6, image: '/dist/images/cat/sports-accessories.webp' },
  { id: 93, name: 'Είδη Εξερεύνησης', slug: 'exploration-items', parentId: 6, image: '/dist/images/cat/exploration-items.webp' },
  { id: 94, name: 'Γυναικεία Αθλητικά Ρούχα', slug: 'womens-sportswear', parentId: 6, image: '/dist/images/cat/womens-sportswear.webp' },
  { id: 95, name: 'Γυναικεία Αθλητικά Παπούτσια', slug: 'womens-sports-shoes', parentId: 6, image: '/dist/images/cat/womens-sports-shoes.webp' },
  { id: 96, name: 'Ανδρικά Αθλητικά Ρούχα', slug: 'mens-sportswear', parentId: 6, image: '/dist/images/cat/mens-sportswear.webp' },
  { id: 97, name: 'Ανδρικά Αθλητικά Παπούτσια', slug: 'mens-sports-shoes', parentId: 6, image: '/dist/images/cat/mens-sports-shoes.webp' },
  { id: 98, name: 'Αυτοκίνητο', slug: 'car', parentId: 7, image: '/dist/images/cat/car.webp' },
  { id: 99, name: 'Μοτοσυκλέτα', slug: 'motorcycle', parentId: 7, image: '/dist/images/cat/motorcycle.webp' },
  { id: 100, name: 'Σκάφος', slug: 'boat', parentId: 7, image: '/dist/images/cat/boat.webp' },
  { id: 101, name: 'Είδη Φορτηγού', slug: 'truck-items', parentId: 7, image: '/dist/images/cat/truck-items.webp' },
  { id: 102, name: 'Κινητά', slug: 'smartphones', parentId: 10, image: '/dist/images/cat/smartphones.webp' },
  { id: 103, name: 'iPhone', slug: 'iphone', parentId: 10, image: '/dist/images/cat/iphone.webp' },
  { id: 104, name: 'Θήκες Κινητών', slug: 'mobile-cases', parentId: 10, image: '/dist/images/cat/mobile-cases.webp' },
  { id: 105, name: 'Bluetooth Handsfree', slug: 'bluetooth-handsfree', parentId: 10, image: '/dist/images/cat/bluetooth-handsfree.webp' },
  { id: 106, name: 'Handsfree', slug: 'handsfree', parentId: 10, image: '/dist/images/cat/handsfree.webp' },
  { id: 107, name: 'Φορτιστές Κινητών', slug: 'mobile-chargers', parentId: 10, image: '/dist/images/cat/mobile-chargers.webp' },
  { id: 108, name: 'Tempered Glass', slug: 'tempered-glass', parentId: 10, image: '/dist/images/cat/tempered-glass.webp' },
  { id: 109, name: 'Προστασία Οθόνης', slug: 'screen-protectors', parentId: 10, image: '/dist/images/cat/screen-protectors.webp' },
  { id: 110, name: 'Power Banks', slug: 'power-banks', parentId: 10, image: '/dist/images/cat/power-banks.webp' },
  { id: 111, name: 'Μπαταρίες Κινητών', slug: 'mobile-batteries', parentId: 10, image: '/dist/images/cat/mobile-batteries.webp' },
  { id: 112, name: 'Selfie Stick', slug: 'selfie-sticks', parentId: 10, image: '/dist/images/cat/selfie-sticks.webp' },
  { id: 113, name: 'Βάσεις Κινητού', slug: 'mobile-holders', parentId: 10, image: '/dist/images/cat/mobile-holders.webp' },
  { id: 114, name: 'Καλώδια Φόρτισης, Μεταφοράς Δεδομένων', slug: 'charging-data-cables', parentId: 10, image: '/dist/images/cat/charging-data-cables.webp' },
  { id: 115, name: 'Anti-Lost Tracker', slug: 'anti-lost-trackers', parentId: 10, image: '/dist/images/cat/anti-lost-trackers.webp' },
  { id: 116, name: 'Ανταλλακτικά Κινητών', slug: 'mobile-spare-parts', parentId: 10, image: '/dist/images/cat/mobile-spare-parts.webp' },
  { id: 117, name: 'Gimbal Κινητών', slug: 'mobile-gimbals', parentId: 10, image: '/dist/images/cat/mobile-gimbals.webp' },
  { id: 118, name: 'Γραφίδες Αφής', slug: 'stylus-pens', parentId: 10, image: '/dist/images/cat/stylus-pens.webp' },
  { id: 119, name: 'Αξεσουάρ Γραφίδας', slug: 'stylus-accessories', parentId: 10, image: '/dist/images/cat/stylus-accessories.webp' },
  { id: 120, name: 'Αξεσουάρ Ακουστικών Bluetooth', slug: 'bluetooth-headset-accessories', parentId: 10, image: '/dist/images/cat/bluetooth-headset-accessories.webp' },
  { id: 121, name: 'Αξεσουάρ Anti-Lost Tracker', slug: 'anti-lost-tracker-accessories', parentId: 10, image: '/dist/images/cat/anti-lost-tracker-accessories.webp' },
  { id: 122, name: 'Pop Sockets', slug: 'pop-sockets', parentId: 10, image: '/dist/images/cat/pop-sockets.webp' },
  { id: 123, name: 'Τρίποδα Κινητών', slug: 'mobile-tripods', parentId: 10, image: '/dist/images/cat/mobile-tripods.webp' },
  { id: 124, name: 'Εργαλεία για Service Κινητών', slug: 'mobile-service-tools', parentId: 10, image: '/dist/images/cat/mobile-service-tools.webp' },
  { id: 125, name: 'Διακοσμητικά Κινητών', slug: 'mobile-charms', parentId: 10, image: '/dist/images/cat/mobile-charms.webp' },
  { id: 126, name: 'Αξεσουάρ Κινητών', slug: 'mobile-accessories', parentId: 10, image: '/dist/images/cat/mobile-accessories.webp' },
  { id: 127, name: 'Προστασία Κάμερας Κινητών', slug: 'mobile-camera-protection', parentId: 10, image: '/dist/images/cat/mobile-camera-protection.webp' },
  { id: 128, name: 'Φακοί Κάμερας Κινητών', slug: 'mobile-camera-lenses', parentId: 10, image: '/dist/images/cat/mobile-camera-lenses.webp' },
  { id: 129, name: 'Ενισχυτές Σήματος Κινητής Τηλεφωνίας', slug: 'mobile-signal-boosters', parentId: 10, image: '/dist/images/cat/mobile-signal-boosters.webp' },
  { id: 130, name: 'Πλήκτρα Mobile Gaming', slug: 'mobile-gaming-buttons', parentId: 10, image: '/dist/images/cat/mobile-gaming-buttons.webp' },
  { id: 131, name: 'Πακέτα Σύνδεσης', slug: 'connection-packs', parentId: 10, image: '/dist/images/cat/connection-packs.webp' },
  { id: 132, name: 'Φορητά Ηχεία Bluetooth (Κινητή)', slug: 'portable-bluetooth-speakers-mobile', parentId: 10, image: '/dist/images/cat/portable-bluetooth-speakers-mobile.webp' },
  { id: 133, name: 'Περιφερειακά, Αναλώσιμα', slug: 'peripherals-consumables', parentId: 11, image: '/dist/images/cat/peripherals-consumables.webp' },
  { id: 134, name: 'Hardware', slug: 'hardware', parentId: 11, image: '/dist/images/cat/hardware.webp' },
  { id: 135, name: 'Δικτυακά', slug: 'networking', parentId: 11, image: '/dist/images/cat/networking.webp' },
  { id: 136, name: 'Desktops & Servers', slug: 'desktops-servers', parentId: 11, image: '/dist/images/cat/desktops-servers.webp' },
  { id: 137, name: 'Οθόνες PC, Αξεσουάρ', slug: 'pc-monitors-accessories', parentId: 11, image: '/dist/images/cat/pc-monitors-accessories.webp' },
  { id: 138, name: 'Software', slug: 'software', parentId: 11, image: '/dist/images/cat/software.webp' },
  { id: 139, name: 'Επεκτάσεις Εγγύησης', slug: 'warranty-extensions', parentId: 11, image: '/dist/images/cat/warranty-extensions.webp' },
  { id: 140, name: 'Laptops', slug: 'laptops', parentId: 12, image: '/dist/images/cat/laptops.webp' },
  { id: 141, name: 'MacBook', slug: 'macbook', parentId: 12, image: '/dist/images/cat/macbook.webp' },
  { id: 142, name: 'Τσάντες Laptop', slug: 'laptop-bags', parentId: 12, image: '/dist/images/cat/laptop-bags.webp' },
  { id: 143, name: 'Καλύμματα Laptop', slug: 'laptop-covers', parentId: 12, image: '/dist/images/cat/laptop-covers.webp' },
  { id: 144, name: 'Φορτιστές Laptop', slug: 'laptop-chargers', parentId: 12, image: '/dist/images/cat/laptop-chargers.webp' },
  { id: 145, name: 'Μπαταρίες Laptop', slug: 'laptop-batteries', parentId: 12, image: '/dist/images/cat/laptop-batteries.webp' },
  { id: 146, name: 'Βάσεις Laptop', slug: 'laptop-stands', parentId: 12, image: '/dist/images/cat/laptop-stands.webp' },
  { id: 147, name: 'Docking Stations Laptop', slug: 'laptop-docking-stations', parentId: 12, image: '/dist/images/cat/laptop-docking-stations.webp' },
  { id: 148, name: 'Αυτοκόλλητα Laptop', slug: 'laptop-stickers', parentId: 12, image: '/dist/images/cat/laptop-stickers.webp' },
  { id: 149, name: 'Ανταλλακτικά Laptop', slug: 'laptop-spare-parts', parentId: 12, image: '/dist/images/cat/laptop-spare-parts.webp' },
  { id: 150, name: 'Κάρτες PCMCIA', slug: 'pcmcia-cards', parentId: 12, image: '/dist/images/cat/pcmcia-cards.webp' },
  { id: 151, name: 'Διάφορα Είδη Laptop', slug: 'various-laptop-items', parentId: 12, image: '/dist/images/cat/various-laptop-items.webp' },
  { id: 152, name: 'Τηλεοράσεις, Αξεσουάρ', slug: 'tv-accessories', parentId: 13, image: '/dist/images/cat/tv-accessories.webp' },
  { id: 153, name: 'Καλώδια HDMI', slug: 'hdmi-cables', parentId: 13, image: '/dist/images/cat/hdmi-cables.webp' },
  { id: 154, name: 'Δορυφορική, Cable & DVB-T', slug: 'satellite-cable-dvbt', parentId: 13, image: '/dist/images/cat/satellite-cable-dvbt.webp' },
  { id: 155, name: 'Projectors, Αξεσουάρ', slug: 'projectors-accessories', parentId: 13, image: '/dist/images/cat/projectors-accessories.webp' },
  { id: 156, name: 'TV Box', slug: 'tv-box', parentId: 13, image: '/dist/images/cat/tv-box.webp' },
  { id: 157, name: 'Smart TV Stick', slug: 'smart-tv-stick', parentId: 13, image: '/dist/images/cat/smart-tv-stick.webp' },
  { id: 158, name: 'Φορητές Τηλεοράσεις', slug: 'portable-tvs', parentId: 13, image: '/dist/images/cat/portable-tvs.webp' },
  { id: 159, name: 'Φορητά DVD Player', slug: 'portable-dvd-players', parentId: 13, image: '/dist/images/cat/portable-dvd-players.webp' },
  { id: 160, name: 'DVD, Blu-Ray Players & Recorders', slug: 'dvd-bluray-players-recorders', parentId: 13, image: '/dist/images/cat/dvd-bluray-players-recorders.webp' },
  { id: 161, name: 'Καλώδια DisplayPort', slug: 'displayport-cables', parentId: 13, image: '/dist/images/cat/displayport-cables.webp' },
  { id: 162, name: 'Smartwatches', slug: 'smartwatches', parentId: 14, image: '/dist/images/cat/smartwatches.webp' },
  { id: 163, name: 'Λουράκια Smartwatch', slug: 'smartwatch-straps', parentId: 14, image: '/dist/images/cat/smartwatch-straps.webp' },
  { id: 164, name: 'Φορτιστές Smartwatch', slug: 'smartwatch-chargers', parentId: 14, image: '/dist/images/cat/smartwatch-chargers.webp' },
  { id: 165, name: 'Προστασία Οθόνης Smartwatch', slug: 'smartwatch-screen-protectors', parentId: 14, image: '/dist/images/cat/smartwatch-screen-protectors.webp' },
  { id: 166, name: 'Θήκες Smartwatch', slug: 'smartwatch-cases', parentId: 14, image: '/dist/images/cat/smartwatch-cases.webp' },
  { id: 167, name: 'Ζώνες Καρδιακών Παλμών', slug: 'heart-rate-belts', parentId: 14, image: '/dist/images/cat/heart-rate-belts.webp' },
  { id: 168, name: 'Αξεσουάρ Wearables', slug: 'wearable-accessories', parentId: 14, image: '/dist/images/cat/wearable-accessories.webp' },
  { id: 169, name: 'Tablets', slug: 'tablets', parentId: 15, image: '/dist/images/cat/tablets.webp' },
  { id: 170, name: 'iPad', slug: 'ipad', parentId: 15, image: '/dist/images/cat/ipad.webp' },
  { id: 171, name: 'Θήκες Tablet', slug: 'tablet-cases', parentId: 15, image: '/dist/images/cat/tablet-cases.webp' },
  { id: 172, name: 'Βάσεις Tablet', slug: 'tablet-stands', parentId: 15, image: '/dist/images/cat/tablet-stands.webp' },
  { id: 173, name: 'Προστασία Οθόνης Tablet', slug: 'tablet-screen-protectors', parentId: 15, image: '/dist/images/cat/tablet-screen-protectors.webp' },
  { id: 174, name: 'E-Book Readers', slug: 'e-book-readers', parentId: 15, image: '/dist/images/cat/e-book-readers.webp' },
  { id: 175, name: 'Ανταλλακτικά Tablet', slug: 'tablet-spare-parts', parentId: 15, image: '/dist/images/cat/tablet-spare-parts.webp' },
  { id: 176, name: 'Διάφορα Αξεσουάρ Tablet', slug: 'various-tablet-accessories', parentId: 15, image: '/dist/images/cat/various-tablet-accessories.webp' },
  { id: 177, name: 'Γραφίδες Αφής (Tablets)', slug: 'stylus-pens-tablets', parentId: 15, image: '/dist/images/cat/stylus-pens-tablets.webp' },
  { id: 178, name: 'Κονσόλες', slug: 'consoles', parentId: 16, image: '/dist/images/cat/consoles.webp' },
  { id: 179, name: 'Ηλεκτρονικά Παιχνίδια', slug: 'electronic-games', parentId: 16, image: '/dist/images/cat/electronic-games.webp' },
  { id: 180, name: 'Gaming Controllers', slug: 'gaming-controllers', parentId: 16, image: '/dist/images/cat/gaming-controllers.webp' },
  { id: 181, name: 'Τιμονιέρες', slug: 'steering-wheels', parentId: 16, image: '/dist/images/cat/steering-wheels.webp' },
  { id: 182, name: 'Joysticks', slug: 'joysticks', parentId: 16, image: '/dist/images/cat/joysticks.webp' },
  { id: 183, name: 'Διάφορα Gaming', slug: 'various-gaming', parentId: 16, image: '/dist/images/cat/various-gaming.webp' },
  { id: 184, name: 'Ανταλλακτικά Κονσολών', slug: 'console-spare-parts', parentId: 16, image: '/dist/images/cat/console-spare-parts.webp' },
  { id: 185, name: 'VR Headsets', slug: 'vr-headsets', parentId: 16, image: '/dist/images/cat/vr-headsets.webp' },
  { id: 186, name: 'Character Figures', slug: 'character-figures', parentId: 16, image: '/dist/images/cat/character-figures.webp' },
  { id: 187, name: 'Game TimeCards', slug: 'game-time-cards', parentId: 16, image: '/dist/images/cat/game-time-cards.webp' },
  { id: 188, name: 'Gaming Headsets (Video Games)', slug: 'gaming-headsets-video-games', parentId: 16, image: '/dist/images/cat/gaming-headsets-video-games.webp' },
  { id: 189, name: 'Καρέκλες Gaming', slug: 'gaming-chairs', parentId: 16, image: '/dist/images/cat/gaming-chairs.webp' },
  { id: 190, name: 'Κάρτες Γραφικών (Gaming)', slug: 'graphics-cards-gaming', parentId: 16, image: '/dist/images/cat/graphics-cards-gaming.webp' },
  { id: 191, name: 'Gaming Ποντίκια', slug: 'gaming-mice', parentId: 16, image: '/dist/images/cat/gaming-mice.webp' },
  { id: 192, name: 'Gaming Πληκτρολόγια', slug: 'gaming-keyboards', parentId: 16, image: '/dist/images/cat/gaming-keyboards.webp' },
  { id: 193, name: 'Home Audio', slug: 'home-audio', parentId: 17, image: '/dist/images/cat/home-audio.webp' },
  { id: 194, name: 'Επαγγελματικός Ήχος', slug: 'professional-sound', parentId: 17, image: '/dist/images/cat/professional-sound.webp' },
  { id: 195, name: 'Ακουστικά, Αξεσουάρ', slug: 'headphones-accessories', parentId: 17, image: '/dist/images/cat/headphones-accessories.webp' },
  { id: 196, name: 'Karaoke', slug: 'karaoke', parentId: 17, image: '/dist/images/cat/karaoke.webp' },
  { id: 197, name: 'Συσκευές Πικάπ, Αξεσουάρ', slug: 'turntables-accessories', parentId: 17, image: '/dist/images/cat/turntables-accessories.webp' },
  { id: 198, name: 'Home Cinema', slug: 'home-cinema', parentId: 17, image: '/dist/images/cat/home-cinema.webp' },
  { id: 199, name: 'Φορητές Συσκευές', slug: 'portable-devices', parentId: 17, image: '/dist/images/cat/portable-devices.webp' },
  { id: 200, name: 'MP3, MP4 Players & Αξεσουάρ', slug: 'mp3-mp4-players-accessories', parentId: 17, image: '/dist/images/cat/mp3-mp4-players-accessories.webp' },
  { id: 201, name: 'Ηχεία Εγκαταστάσεων', slug: 'installation-speakers', parentId: 17, image: '/dist/images/cat/installation-speakers.webp' },
  { id: 202, name: 'Αυτοενισχυόμενα Ηχεία', slug: 'powered-speakers', parentId: 17, image: '/dist/images/cat/powered-speakers.webp' },
  { id: 203, name: 'Φωτογραφικές Μηχανές, Αξεσουάρ', slug: 'cameras-accessories', parentId: 18, image: '/dist/images/cat/cameras-accessories.webp' },
  { id: 204, name: 'Action Cameras, Αξεσουάρ', slug: 'action-cameras-accessories', parentId: 18, image: '/dist/images/cat/action-cameras-accessories.webp' },
  { id: 205, name: 'Βιντεοκάμερες, Αξεσουάρ', slug: 'camcorders-accessories', parentId: 18, image: '/dist/images/cat/camcorders-accessories.webp' },
  { id: 206, name: 'Εξοπλισμός Studio', slug: 'studio-equipment', parentId: 18, image: '/dist/images/cat/studio-equipment.webp' },
  { id: 207, name: 'Ψηφιακές Κορνίζες', slug: 'digital-photo-frames', parentId: 18, image: '/dist/images/cat/digital-photo-frames.webp' },
  { id: 208, name: 'Μπαταρίες & Φορτιστές Μπαταριών', slug: 'batteries-chargers', parentId: 19, image: '/dist/images/cat/batteries-chargers.webp' },
  { id: 209, name: 'Μικροηλεκτρονικά', slug: 'microelectronics', parentId: 19, image: '/dist/images/cat/microelectronics.webp' },
  { id: 210, name: 'Ηλεκτρονικά Εξαρτήματα', slug: 'electronic-components', parentId: 19, image: '/dist/images/cat/electronic-components.webp' },
  { id: 211, name: 'Αξεσουάρ Ηλεκτρονικών Συσκευών', slug: 'electronic-device-accessories', parentId: 19, image: '/dist/images/cat/electronic-device-accessories.webp' },
  { id: 212, name: 'Σταθερή Τηλεφωνία', slug: 'landline-telephony', parentId: 20, image: '/dist/images/cat/landline-telephony.webp' },
  { id: 213, name: 'VoIP', slug: 'voip', parentId: 20, image: '/dist/images/cat/voip.webp' },
  { id: 214, name: 'Ασύρματοι, Αξεσουάρ', slug: 'walkie-talkies-accessories', parentId: 20, image: '/dist/images/cat/walkie-talkies-accessories.webp' },
  { id: 215, name: 'Θήκες Κινητών Samsung', slug: 'mobile-cases-samsung', parentId: 104, image: '/dist/images/cat/mobile-cases-samsung.webp' },
  { id: 216, name: 'Θήκες Κινητών Xiaomi', slug: 'mobile-cases-xiaomi', parentId: 104, image: '/dist/images/cat/mobile-cases-xiaomi.webp' },
  { id: 217, name: 'Θήκες iPhone', slug: 'iphone-cases', parentId: 104, image: '/dist/images/cat/iphone-cases.webp' },
  { id: 218, name: 'Θήκες Κινητών Huawei', slug: 'mobile-cases-huawei', parentId: 104, image: '/dist/images/cat/mobile-cases-huawei.webp' },
  { id: 219, name: 'Θήκες Κινητών Nokia', slug: 'mobile-cases-nokia', parentId: 104, image: '/dist/images/cat/mobile-cases-nokia.webp' },
  { id: 220, name: 'Θήκες Κινητών Honor', slug: 'mobile-cases-honor', parentId: 104, image: '/dist/images/cat/mobile-cases-honor.webp' },
  { id: 221, name: 'Θήκες Κινητών LG', slug: 'mobile-cases-lg', parentId: 104, image: '/dist/images/cat/mobile-cases-lg.webp' },
  { id: 222, name: 'Θήκες Κινητών Sony', slug: 'mobile-cases-sony', parentId: 104, image: '/dist/images/cat/mobile-cases-sony.webp' },
  { id: 223, name: 'Θήκες Κινητών MLS', slug: 'mobile-cases-mls', parentId: 104, image: '/dist/images/cat/mobile-cases-mls.webp' },
  { id: 224, name: 'Θήκες Άλλων Κινητών', slug: 'mobile-cases-other-brands', parentId: 104, image: '/dist/images/cat/mobile-cases-other-brands.webp' },
  { id: 225, name: 'Θήκες Universal', slug: 'universal-cases', parentId: 104, image: '/dist/images/cat/universal-cases.webp' },
  { id: 226, name: 'Θήκες Κινητών Πουγκί (Pouch)', slug: 'mobile-pouch-cases', parentId: 104, image: '/dist/images/cat/mobile-pouch-cases.webp' },
  { id: 227, name: 'Θήκες Κινητών για Τρέξιμο', slug: 'mobile-running-armbands', parentId: 104, image: '/dist/images/cat/mobile-running-armbands.webp' },
  { id: 228, name: 'Θήκες Κινητών με Σχέδια', slug: 'patterned-mobile-cases', parentId: 104, image: '/dist/images/cat/patterned-mobile-cases.webp' },
  { id: 229, name: 'Αδιάβροχες Θήκες Κινητών', slug: 'waterproof-mobile-cases', parentId: 104, image: '/dist/images/cat/waterproof-mobile-cases.webp' },
  { id: 230, name: 'Καλώδια USB Type-C', slug: 'usb-type-c-cables', parentId: 114, image: '/dist/images/cat/usb-type-c-cables.webp' },
  { id: 231, name: 'Καλώδια Lightning', slug: 'lightning-cables', parentId: 114, image: '/dist/images/cat/lightning-cables.webp' },
  { id: 232, name: 'Καλώδια micro USB', slug: 'micro-usb-cables', parentId: 114, image: '/dist/images/cat/micro-usb-cables.webp' },
  { id: 233, name: 'Καλώδια Multi Port', slug: 'multi-port-cables', parentId: 114, image: '/dist/images/cat/multi-port-cables.webp' },
  { id: 234, name: 'Καλώδια 30-Pin', slug: '30-pin-cables', parentId: 114, image: '/dist/images/cat/30-pin-cables.webp' },
  { id: 235, name: 'Αντάπτορες, Προεκτάσεις Κινητών', slug: 'mobile-adapters-extensions', parentId: 114, image: '/dist/images/cat/mobile-adapters-extensions.webp' },
  { id: 236, name: 'Οθόνες Κινητών', slug: 'mobile-screens', parentId: 116, image: '/dist/images/cat/mobile-screens.webp' },
  { id: 237, name: 'Μηχανισμοί Δόνησης Κινητών', slug: 'mobile-vibration-motors', parentId: 116, image: '/dist/images/cat/mobile-vibration-motors.webp' },
  { id: 238, name: 'Μηχανισμοί Αφής Κινητών', slug: 'mobile-touch-mechanisms', parentId: 116, image: '/dist/images/cat/mobile-touch-mechanisms.webp' },
  { id: 239, name: 'Καπάκια Κινητών', slug: 'mobile-back-covers', parentId: 116, image: '/dist/images/cat/mobile-back-covers.webp' },
  { id: 240, name: 'Πλήκτρα, Διακόπτες, Καλύμματα', slug: 'mobile-buttons-switches-covers', parentId: 116, image: '/dist/images/cat/mobile-buttons-switches-covers.webp' },
  { id: 241, name: 'Ανταλλακτικά Ηχεία Κινητών', slug: 'mobile-speaker-parts', parentId: 116, image: '/dist/images/cat/mobile-speaker-parts.webp' },
  { id: 242, name: 'Charging Ports (Επαφές Φόρτισης)', slug: 'mobile-charging-ports', parentId: 116, image: '/dist/images/cat/mobile-charging-ports.webp' },
  { id: 243, name: 'Κάμερες Κινητών', slug: 'mobile-cameras', parentId: 116, image: '/dist/images/cat/mobile-cameras.webp' },
  { id: 244, name: 'Ανταλλακτικά για Ακουστικά Κινητών', slug: 'mobile-headset-parts', parentId: 116, image: '/dist/images/cat/mobile-headset-parts.webp' },
  { id: 245, name: 'Μικρόφωνα για Κινητά', slug: 'mobile-microphones', parentId: 116, image: '/dist/images/cat/mobile-microphones.webp' },
  { id: 246, name: 'Προσόψεις Κινητών', slug: 'mobile-front-panels', parentId: 116, image: '/dist/images/cat/mobile-front-panels.webp' },
  { id: 247, name: 'Πλαίσια Κινητών', slug: 'mobile-frames', parentId: 116, image: '/dist/images/cat/mobile-frames.webp' },
  { id: 248, name: 'Κεραίες για Κινητά', slug: 'mobile-antennas', parentId: 116, image: '/dist/images/cat/mobile-antennas.webp' },
  { id: 249, name: 'Βίδες για Κινητά', slug: 'mobile-screws', parentId: 116, image: '/dist/images/cat/mobile-screws.webp' },
  { id: 250, name: 'Καλωδιοταινίες', slug: 'mobile-flex-cables', parentId: 116, image: '/dist/images/cat/mobile-flex-cables.webp' },
  { id: 251, name: 'SD/SIM Trays', slug: 'sd-sim-trays', parentId: 116, image: '/dist/images/cat/sd-sim-trays.webp' },
  { id: 252, name: 'Πλακέτες Πληκτρολογίου, Πληκτρολόγια', slug: 'mobile-keypad-boards', parentId: 116, image: '/dist/images/cat/mobile-keypad-boards.webp' },
  { id: 253, name: 'Διάφορα Ανταλλακτικά Κινητών', slug: 'various-mobile-parts', parentId: 116, image: '/dist/images/cat/various-mobile-parts.webp' },
  { id: 254, name: 'Εκτυπωτές & Αξεσουάρ', slug: 'printers-accessories', parentId: 133, image: '/dist/images/cat/printers-accessories.webp' },
  { id: 255, name: 'Συσκευές Εισόδου', slug: 'input-devices', parentId: 133, image: '/dist/images/cat/input-devices.webp' },
  { id: 256, name: 'Multimedia', slug: 'multimedia', parentId: 133, image: '/dist/images/cat/multimedia.webp' },
  { id: 257, name: 'Scanner & Αξεσουάρ', slug: 'scanners-accessories', parentId: 133, image: '/dist/images/cat/scanners-accessories.webp' },
  { id: 258, name: 'USB Sticks', slug: 'usb-sticks', parentId: 133, image: '/dist/images/cat/usb-sticks.webp' },
  { id: 259, name: 'USB Hubs', slug: 'usb-hubs', parentId: 133, image: '/dist/images/cat/usb-hubs.webp' },
  { id: 260, name: 'UPS, Αξεσουάρ', slug: 'ups-accessories', parentId: 133, image: '/dist/images/cat/ups-accessories.webp' },
  { id: 261, name: 'Καλώδια, Adaptors', slug: 'cables-adapters', parentId: 133, image: '/dist/images/cat/cables-adapters.webp' },
  { id: 262, name: 'Καλώδια Τροφοδοσίας', slug: 'power-cables', parentId: 133, image: '/dist/images/cat/power-cables.webp' },
  { id: 263, name: 'Καλώδια USB', slug: 'usb-cables', parentId: 133, image: '/dist/images/cat/usb-cables.webp' },
  { id: 264, name: 'Κάρτες Μνήμης', slug: 'memory-cards', parentId: 133, image: '/dist/images/cat/memory-cards.webp' },
  { id: 265, name: 'Card Readers', slug: 'card-readers', parentId: 133, image: '/dist/images/cat/card-readers.webp' },
  { id: 266, name: 'CD, DVD', slug: 'cd-dvd-media', parentId: 133, image: '/dist/images/cat/cd-dvd-media.webp' },
  { id: 267, name: 'KVM', slug: 'kvm-switches', parentId: 133, image: '/dist/images/cat/kvm-switches.webp' },
  { id: 268, name: 'Θήκες Μεταφοράς CD', slug: 'cd-cases-transport', parentId: 133, image: '/dist/images/cat/cd-cases-transport.webp' },
  { id: 269, name: 'Θήκες CD, DVD', slug: 'cd-dvd-storage-cases', parentId: 133, image: '/dist/images/cat/cd-dvd-storage-cases.webp' },
  { id: 270, name: 'Μαγνητικά Μέσα Αποθήκευσης', slug: 'magnetic-storage-media', parentId: 133, image: '/dist/images/cat/magnetic-storage-media.webp' },
  { id: 271, name: 'Καλώδια Σειριακά, PS/2', slug: 'serial-ps2-cables', parentId: 133, image: '/dist/images/cat/serial-ps2-cables.webp' },
  { id: 272, name: 'Καλώδια FireWire', slug: 'firewire-cables', parentId: 133, image: '/dist/images/cat/firewire-cables.webp' },
  { id: 273, name: 'Καλώδια HDMI (PC)', slug: 'hdmi-cables-pc', parentId: 133, image: '/dist/images/cat/hdmi-cables-pc.webp' },
  { id: 274, name: 'Κάρτες Γραφικών', slug: 'graphics-cards', parentId: 134, image: '/dist/images/cat/graphics-cards.webp' },
  { id: 275, name: 'Μητρικές Κάρτες', slug: 'motherboards', parentId: 134, image: '/dist/images/cat/motherboards.webp' },
  { id: 276, name: 'CPU', slug: 'cpu', parentId: 134, image: '/dist/images/cat/cpu.webp' },
  { id: 277, name: 'Σκληροί Δίσκοι', slug: 'hard-drives', parentId: 134, image: '/dist/images/cat/hard-drives.webp' },
  { id: 278, name: 'RAM', slug: 'ram', parentId: 134, image: '/dist/images/cat/ram.webp' },
  { id: 279, name: 'Κουτιά Υπολογιστών', slug: 'pc-cases', parentId: 134, image: '/dist/images/cat/pc-cases.webp' },
  { id: 280, name: 'Τροφοδοτικά Υπολογιστών', slug: 'power-supplies', parentId: 134, image: '/dist/images/cat/power-supplies.webp' },
  { id: 281, name: 'Cooling PC', slug: 'pc-cooling', parentId: 134, image: '/dist/images/cat/pc-cooling.webp' },
  { id: 282, name: 'Optical Drives', slug: 'optical-drives', parentId: 134, image: '/dist/images/cat/optical-drives.webp' },
  { id: 283, name: 'Tuning Parts', slug: 'tuning-parts', parentId: 134, image: '/dist/images/cat/tuning-parts.webp' },
  { id: 284, name: 'Κάρτες Τηλεόρασης, Video', slug: 'tv-video-cards', parentId: 134, image: '/dist/images/cat/tv-video-cards.webp' },
  { id: 285, name: 'Κάρτες Ήχου', slug: 'sound-cards', parentId: 134, image: '/dist/images/cat/sound-cards.webp' },
  { id: 286, name: 'Κάρτες Επέκτασης', slug: 'expansion-cards', parentId: 134, image: '/dist/images/cat/expansion-cards.webp' },
  { id: 287, name: 'Case Panels', slug: 'case-panels', parentId: 134, image: '/dist/images/cat/case-panels.webp' },
  { id: 288, name: 'Floppy, Tape Drives', slug: 'floppy-tape-drives', parentId: 134, image: '/dist/images/cat/floppy-tape-drives.webp' },
  { id: 289, name: 'Καλώδια Hardware', slug: 'hardware-cables', parentId: 134, image: '/dist/images/cat/hardware-cables.webp' },
  { id: 290, name: 'Διάφορα Είδη Υπολογιστών', slug: 'various-pc-items', parentId: 134, image: '/dist/images/cat/various-pc-items.webp' },
  { id: 291, name: 'WiFi Extenders', slug: 'wifi-extenders', parentId: 135, image: '/dist/images/cat/wifi-extenders.webp' },
  { id: 292, name: 'Routers', slug: 'routers', parentId: 135, image: '/dist/images/cat/routers.webp' },
  { id: 293, name: 'Access Points', slug: 'access-points', parentId: 135, image: '/dist/images/cat/access-points.webp' },
  { id: 294, name: 'USB Adapters Δικτύου', slug: 'usb-network-adapters', parentId: 135, image: '/dist/images/cat/usb-network-adapters.webp' },
  { id: 295, name: 'Powerline', slug: 'powerline', parentId: 135, image: '/dist/images/cat/powerline.webp' },
  { id: 296, name: 'Καλώδια Δικτύου', slug: 'network-cables', parentId: 135, image: '/dist/images/cat/network-cables.webp' },
  { id: 297, name: 'Κάρτες Δικτύου', slug: 'network-cards', parentId: 135, image: '/dist/images/cat/network-cards.webp' },
  { id: 298, name: 'Κεραίες WiFi', slug: 'wifi-antennas', parentId: 135, image: '/dist/images/cat/wifi-antennas.webp' },
  { id: 299, name: 'Bluetooth Adapter', slug: 'bluetooth-adapters', parentId: 135, image: '/dist/images/cat/bluetooth-adapters.webp' },
  { id: 300, name: 'File Servers, NAS', slug: 'file-servers-nas', parentId: 135, image: '/dist/images/cat/file-servers-nas.webp' },
  { id: 301, name: 'Switches', slug: 'switches', parentId: 135, image: '/dist/images/cat/switches.webp' },
  { id: 302, name: 'Print Server', slug: 'print-servers', parentId: 135, image: '/dist/images/cat/print-servers.webp' },
  { id: 303, name: 'PoE Injectors, Adapters', slug: 'poe-injectors-adapters', parentId: 135, image: '/dist/images/cat/poe-injectors-adapters.webp' },
  { id: 304, name: 'Keystone', slug: 'keystone-jacks', parentId: 135, image: '/dist/images/cat/keystone-jacks.webp' },
  { id: 305, name: 'Σύνδεσμοι Καλωδίων', slug: 'cable-connectors', parentId: 135, image: '/dist/images/cat/cable-connectors.webp' },
  { id: 306, name: 'Media Converter', slug: 'media-converters', parentId: 135, image: '/dist/images/cat/media-converters.webp' },
  { id: 307, name: 'Transceivers', slug: 'transceivers', parentId: 135, image: '/dist/images/cat/transceivers.webp' },
  { id: 308, name: 'Gateways, Controllers', slug: 'gateways-controllers', parentId: 135, image: '/dist/images/cat/gateways-controllers.webp' },
  { id: 309, name: 'Κάλυμμα για Βύσμα Δικτύου', slug: 'network-jack-covers', parentId: 135, image: '/dist/images/cat/network-jack-covers.webp' },
  { id: 310, name: 'RJ45 Connectors', slug: 'rj45-connectors', parentId: 135, image: '/dist/images/cat/rj45-connectors.webp' },
  { id: 311, name: 'Διάφορα Δικτυακά', slug: 'various-networking-items', parentId: 135, image: '/dist/images/cat/various-networking-items.webp' },
  { id: 312, name: 'Desktop PC', slug: 'desktop-pc', parentId: 136, image: '/dist/images/cat/desktop-pc.webp' },
  { id: 313, name: 'All in One PC', slug: 'all-in-one-pc', parentId: 136, image: '/dist/images/cat/all-in-one-pc.webp' },
  { id: 314, name: 'Mini PC', slug: 'mini-pc', parentId: 136, image: '/dist/images/cat/mini-pc.webp' },
  { id: 315, name: 'Servers', slug: 'servers', parentId: 136, image: '/dist/images/cat/servers.webp' },
  { id: 316, name: 'Αξεσουάρ Server', slug: 'server-accessories', parentId: 136, image: '/dist/images/cat/server-accessories.webp' },
  { id: 317, name: 'Βάσεις Desktop', slug: 'desktop-stands', parentId: 136, image: '/dist/images/cat/desktop-stands.webp' },
  { id: 318, name: 'Barebones', slug: 'barebones', parentId: 136, image: '/dist/images/cat/barebones.webp' },
  { id: 319, name: 'Οθόνες Υπολογιστών', slug: 'pc-monitors', parentId: 137, image: '/dist/images/cat/pc-monitors.webp' },
  { id: 320, name: 'Αξεσουάρ Οθονών', slug: 'monitor-accessories', parentId: 137, image: '/dist/images/cat/monitor-accessories.webp' },
  { id: 321, name: 'Public Displays', slug: 'public-displays', parentId: 137, image: '/dist/images/cat/public-displays.webp' },
  { id: 322, name: 'Antivirus, Security', slug: 'antivirus-security', parentId: 138, image: '/dist/images/cat/antivirus-security.webp' },
  { id: 323, name: 'Εφαρμογές Γραφείου', slug: 'office-applications', parentId: 138, image: '/dist/images/cat/office-applications.webp' },
  { id: 324, name: 'Λειτουργικά Συστήματα', slug: 'operating-systems', parentId: 138, image: '/dist/images/cat/operating-systems.webp' },
  { id: 325, name: 'Εφαρμογές Software', slug: 'software-applications', parentId: 138, image: '/dist/images/cat/software-applications.webp' },
  { id: 326, name: 'Επεξεργασία Εικόνας - Ήχου', slug: 'image-audio-editing', parentId: 138, image: '/dist/images/cat/image-audio-editing.webp' },
  { id: 327, name: 'Εμπορική Διαχείριση', slug: 'business-management', parentId: 138, image: '/dist/images/cat/business-management.webp' },
  { id: 328, name: 'Οθόνες Laptop', slug: 'laptop-screens', parentId: 149, image: '/dist/images/cat/laptop-screens.webp' },
  { id: 329, name: 'Πληκτρολόγια Laptop', slug: 'laptop-keyboards', parentId: 149, image: '/dist/images/cat/laptop-keyboards.webp' },
  { id: 330, name: 'Καλωδιοταινίες Laptop', slug: 'laptop-flex-cables', parentId: 149, image: '/dist/images/cat/laptop-flex-cables.webp' },
  { id: 331, name: 'Ανεμιστηράκια Laptop', slug: 'laptop-fans', parentId: 149, image: '/dist/images/cat/laptop-fans.webp' },
  { id: 332, name: 'Βύσματα Τροφοδοσίας Laptop', slug: 'laptop-power-jacks', parentId: 149, image: '/dist/images/cat/laptop-power-jacks.webp' },
  { id: 333, name: 'Πλαίσια Laptop', slug: 'laptop-bezels-frames', parentId: 149, image: '/dist/images/cat/laptop-bezels-frames.webp' },
  { id: 334, name: 'Μεντεσέδες Laptop', slug: 'laptop-hinges', parentId: 149, image: '/dist/images/cat/laptop-hinges.webp' },
  { id: 335, name: 'LCD Inverters Laptop', slug: 'laptop-lcd-inverters', parentId: 149, image: '/dist/images/cat/laptop-lcd-inverters.webp' },
  { id: 336, name: 'Διάφορα Ανταλλακτικά Laptop', slug: 'various-laptop-parts', parentId: 149, image: '/dist/images/cat/various-laptop-parts.webp' },
  { id: 337, name: 'Τηλεοράσεις', slug: 'tvs', parentId: 152, image: '/dist/images/cat/tvs.webp' },
  { id: 338, name: 'Βάσεις Τηλεοράσεων', slug: 'tv-mounts', parentId: 152, image: '/dist/images/cat/tv-mounts.webp' },
  { id: 339, name: 'Τηλεχειριστήρια Τηλεόρασης', slug: 'tv-remotes', parentId: 152, image: '/dist/images/cat/tv-remotes.webp' },
  { id: 340, name: 'Καλώδια Κεραίας', slug: 'antenna-cables', parentId: 152, image: '/dist/images/cat/antenna-cables.webp' },
  { id: 341, name: 'Καλώδια, Αντάπτορες (TV)', slug: 'cables-adapters-tv', parentId: 152, image: '/dist/images/cat/cables-adapters-tv.webp' },
  { id: 342, name: 'Γυαλιά 3D', slug: '3d-glasses', parentId: 152, image: '/dist/images/cat/3d-glasses.webp' },
  { id: 343, name: 'Διάφορα Είδη Τηλεοράσεως', slug: 'various-tv-items', parentId: 152, image: '/dist/images/cat/various-tv-items.webp' },
  { id: 344, name: 'Ψηφιακοί Δέκτες Mpeg-4', slug: 'mpeg4-receivers', parentId: 154, image: '/dist/images/cat/mpeg4-receivers.webp' },
  { id: 345, name: 'Δορυφορικοί Αποκωδικοποιητές', slug: 'satellite-decoders', parentId: 154, image: '/dist/images/cat/satellite-decoders.webp' },
  { id: 346, name: 'Επίγειες Κεραίες', slug: 'terrestrial-antennas', parentId: 154, image: '/dist/images/cat/terrestrial-antennas.webp' },
  { id: 347, name: 'Ενισχυτές Κεραιών Τηλεοράσεων', slug: 'tv-antenna-amplifiers', parentId: 154, image: '/dist/images/cat/tv-antenna-amplifiers.webp' },
  { id: 348, name: 'Δορυφορικά Πιάτα, Αξεσουάρ', slug: 'satellite-dishes-accessories', parentId: 154, image: '/dist/images/cat/satellite-dishes-accessories.webp' },
  { id: 349, name: 'LNBs', slug: 'lnbs', parentId: 154, image: '/dist/images/cat/lnbs.webp' },
  { id: 350, name: 'Ολοκληρωμένα Συστήματα', slug: 'complete-systems', parentId: 154, image: '/dist/images/cat/complete-systems.webp' },
  { id: 351, name: 'Καλώδια, Βύσματα (Δορυφορικά)', slug: 'satellite-cables-connectors', parentId: 154, image: '/dist/images/cat/satellite-cables-connectors.webp' },
  { id: 352, name: 'Diseqc', slug: 'diseqc', parentId: 154, image: '/dist/images/cat/diseqc.webp' },
  { id: 353, name: 'Μίκτες, Πολυδιακόπτες, Διακλαδωτές', slug: 'mixers-multiswitches-splitters', parentId: 154, image: '/dist/images/cat/mixers-multiswitches-splitters.webp' },
  { id: 354, name: 'Αξεσουάρ Συστημάτων Λήψης', slug: 'reception-system-accessories', parentId: 154, image: '/dist/images/cat/reception-system-accessories.webp' },
  { id: 355, name: 'Projectors', slug: 'projectors', parentId: 155, image: '/dist/images/cat/projectors.webp' },
  { id: 356, name: 'Οθόνες Προβολής', slug: 'projection-screens', parentId: 155, image: '/dist/images/cat/projection-screens.webp' },
  { id: 357, name: 'Λάμπες Projector', slug: 'projector-lamps', parentId: 155, image: '/dist/images/cat/projector-lamps.webp' },
  { id: 358, name: 'Βάσεις Projector', slug: 'projector-mounts', parentId: 155, image: '/dist/images/cat/projector-mounts.webp' },
  { id: 359, name: 'Αξεσουάρ Projectors', slug: 'projector-accessories', parentId: 155, image: '/dist/images/cat/projector-accessories.webp' },
  { id: 360, name: 'PS5 Games', slug: 'ps5-games', parentId: 179, image: '/dist/images/cat/ps5-games.webp' },
  { id: 361, name: 'PS4 Games', slug: 'ps4-games', parentId: 179, image: '/dist/images/cat/ps4-games.webp' },
  { id: 362, name: 'PS3 Games', slug: 'ps3-games', parentId: 179, image: '/dist/images/cat/ps3-games.webp' },
  { id: 363, name: 'Playstation 2 Games', slug: 'playstation-2-games', parentId: 179, image: '/dist/images/cat/playstation-2-games.webp' },
  { id: 364, name: 'Xbox Series Games', slug: 'xbox-series-games', parentId: 179, image: '/dist/images/cat/xbox-series-games.webp' },
  { id: 365, name: 'PC Games', slug: 'pc-games', parentId: 179, image: '/dist/images/cat/pc-games.webp' },
  { id: 366, name: 'Xbox One Games', slug: 'xbox-one-games', parentId: 179, image: '/dist/images/cat/xbox-one-games.webp' },
  { id: 367, name: 'Nintendo Switch Games', slug: 'nintendo-switch-games', parentId: 179, image: '/dist/images/cat/nintendo-switch-games.webp' },
  { id: 368, name: 'Μεταχειρισμένα Παιχνίδια', slug: 'used-games', parentId: 179, image: '/dist/images/cat/used-games.webp' },
  { id: 369, name: 'Xbox 360 Games', slug: 'xbox-360-games', parentId: 179, image: '/dist/images/cat/xbox-360-games.webp' },
  { id: 370, name: 'Nintendo Wii Games', slug: 'nintendo-wii-games', parentId: 179, image: '/dist/images/cat/nintendo-wii-games.webp' },
  { id: 371, name: 'Nintendo Wii U Games', slug: 'nintendo-wii-u-games', parentId: 179, image: '/dist/images/cat/nintendo-wii-u-games.webp' },
  { id: 372, name: 'Nintendo 3DS Games', slug: 'nintendo-3ds-games', parentId: 179, image: '/dist/images/cat/nintendo-3ds-games.webp' },
  { id: 373, name: 'Nintendo DS Series Games', slug: 'nintendo-ds-series-games', parentId: 179, image: '/dist/images/cat/nintendo-ds-series-games.webp' },
  { id: 374, name: 'PSP Games', slug: 'psp-games', parentId: 179, image: '/dist/images/cat/psp-games.webp' },
  { id: 375, name: 'PS Vita Games', slug: 'ps-vita-games', parentId: 179, image: '/dist/images/cat/ps-vita-games.webp' },
  { id: 376, name: 'GameCube Games', slug: 'gamecube-games', parentId: 179, image: '/dist/images/cat/gamecube-games.webp' },
  { id: 377, name: 'GameBoy Games', slug: 'gameboy-games', parentId: 179, image: '/dist/images/cat/gameboy-games.webp' },
  { id: 378, name: 'Συλλεκτικά Video Games', slug: 'collectible-video-games', parentId: 179, image: '/dist/images/cat/collectible-video-games.webp' },
  { id: 379, name: 'Ενισχυτές, Προενισχυτές', slug: 'amplifiers-preamplifiers', parentId: 193, image: '/dist/images/cat/amplifiers-preamplifiers.webp' },
  { id: 380, name: 'Συστήματα Hi-Fi', slug: 'hi-fi-systems', parentId: 193, image: '/dist/images/cat/hi-fi-systems.webp' },
  { id: 381, name: 'Φορητά Ηχεία Bluetooth', slug: 'portable-bluetooth-speakers', parentId: 193, image: '/dist/images/cat/portable-bluetooth-speakers.webp' },
  { id: 382, name: 'Ηχεία Hi-Fi', slug: 'hi-fi-speakers', parentId: 193, image: '/dist/images/cat/hi-fi-speakers.webp' },
  { id: 383, name: 'Subwoofer', slug: 'subwoofers', parentId: 193, image: '/dist/images/cat/subwoofers.webp' },
  { id: 384, name: 'Ραδιόφωνα, Δέκτες', slug: 'radios-receivers', parentId: 193, image: '/dist/images/cat/radios-receivers.webp' },
  { id: 385, name: 'CD Players, Recorders', slug: 'cd-players-recorders', parentId: 193, image: '/dist/images/cat/cd-players-recorders.webp' },
  { id: 386, name: 'Παρελκόμενα Hi-Fi', slug: 'hi-fi-accessories', parentId: 193, image: '/dist/images/cat/hi-fi-accessories.webp' },
  { id: 387, name: 'Docking Stations', slug: 'docking-stations', parentId: 193, image: '/dist/images/cat/docking-stations.webp' },
  { id: 388, name: 'Soundbar (Home Audio)', slug: 'soundbars', parentId: 193, image: '/dist/images/cat/soundbars.webp' },
  { id: 389, name: 'Ηχεία Υπολογιστή', slug: 'computer-speakers', parentId: 193, image: '/dist/images/cat/computer-speakers.webp' },
  { id: 390, name: 'Ηχεία PA', slug: 'pa-speakers', parentId: 194, image: '/dist/images/cat/pa-speakers.webp' },
  { id: 391, name: 'Επαγγελματικά Μικρόφωνα, Αξεσουάρ', slug: 'pro-microphones-accessories', parentId: 194, image: '/dist/images/cat/pro-microphones-accessories.webp' },
  { id: 392, name: 'Επαγγελματικός Φωτισμός', slug: 'pro-lighting', parentId: 194, image: '/dist/images/cat/pro-lighting.webp' },
  { id: 393, name: 'Ανταλλακτικά Ηχείων', slug: 'speaker-parts', parentId: 194, image: '/dist/images/cat/speaker-parts.webp' },
  { id: 394, name: 'Εξοπλισμός DJ & Αξεσουάρ', slug: 'dj-equipment-accessories', parentId: 194, image: '/dist/images/cat/dj-equipment-accessories.webp' },
  { id: 395, name: 'Κονσόλες, Μίκτες Ήχου', slug: 'consoles-mixers', parentId: 194, image: '/dist/images/cat/consoles-mixers.webp' },
  { id: 396, name: 'Επαγγελματικές Κάρτες Ήχου', slug: 'pro-sound-cards', parentId: 194, image: '/dist/images/cat/pro-sound-cards.webp' },
  { id: 397, name: 'Ηχομονωτικά', slug: 'soundproofing', parentId: 194, image: '/dist/images/cat/soundproofing.webp' },
  { id: 398, name: 'Μηχανήματα Καπνού & Ατμόσφαιρας', slug: 'fog-atmosphere-machines', parentId: 194, image: '/dist/images/cat/fog-atmosphere-machines.webp' },
  { id: 399, name: 'Τσάντες, Θήκες (Επαγγελματικός Ήχος)', slug: 'bags-cases-pro-audio', parentId: 194, image: '/dist/images/cat/bags-cases-pro-audio.webp' },
  { id: 400, name: 'Βάσεις Ηχείων', slug: 'speaker-stands', parentId: 194, image: '/dist/images/cat/speaker-stands.webp' },
  { id: 401, name: 'Επαγγελματικοί Ενισχυτές, Προενισχυτές', slug: 'pro-amplifiers-preamplifiers', parentId: 194, image: '/dist/images/cat/pro-amplifiers-preamplifiers.webp' },
  { id: 402, name: 'Ψηφιακοί Επεξεργαστές, Equalizers', slug: 'digital-processors-equalizers', parentId: 194, image: '/dist/images/cat/digital-processors-equalizers.webp' },
  { id: 403, name: 'Ψηφιακά Συστήματα Εγγραφής', slug: 'digital-recording-systems', parentId: 194, image: '/dist/images/cat/digital-recording-systems.webp' },
  { id: 404, name: 'Monitor Controllers', slug: 'monitor-controllers', parentId: 194, image: '/dist/images/cat/monitor-controllers.webp' },
  { id: 405, name: 'Συνεδριακά Συστήματα', slug: 'conference-systems', parentId: 194, image: '/dist/images/cat/conference-systems.webp' },
  { id: 406, name: 'Bundles (Επαγγελματικός Ήχος)', slug: 'bundles-pro-audio', parentId: 194, image: '/dist/images/cat/bundles-pro-audio.webp' },
  { id: 407, name: 'Τηλεβόες, Κόρνες', slug: 'megaphones-horns', parentId: 194, image: '/dist/images/cat/megaphones-horns.webp' },
  { id: 408, name: 'Καλώδια Ήχου', slug: 'audio-cables-pro', parentId: 194, image: '/dist/images/cat/audio-cables-pro.webp' },
  { id: 409, name: 'Βύσματα Ήχου', slug: 'audio-connectors-pro', parentId: 194, image: '/dist/images/cat/audio-connectors-pro.webp' },
  { id: 410, name: 'Αντάπτορες, Προεκτάσεις Ήχου', slug: 'audio-adapters-extensions-pro', parentId: 194, image: '/dist/images/cat/audio-adapters-extensions-pro.webp' },
  { id: 411, name: 'Διάφορα Επαγγελματικού Ήχου', slug: 'various-pro-audio', parentId: 194, image: '/dist/images/cat/various-pro-audio.webp' },
  { id: 412, name: 'Ηχεία Εγκαταστάσεων (Επαγγελματικός Ήχος)', slug: 'installation-speakers-pro', parentId: 194, image: '/dist/images/cat/installation-speakers-pro.webp' },
  { id: 413, name: 'Επαγγελματικά Μικρόφωνα', slug: 'pro-microphones', parentId: 391, image: '/dist/images/cat/pro-microphones.webp' },
  { id: 414, name: 'Δέκτες (Μικροφώνων)', slug: 'microphone-receivers', parentId: 391, image: '/dist/images/cat/microphone-receivers.webp' },
  { id: 415, name: 'Κάψες (Μικροφώνων)', slug: 'microphone-capsules', parentId: 391, image: '/dist/images/cat/microphone-capsules.webp' },
  { id: 416, name: 'Αξεσουάρ Μικροφώνων (Επαγγελματικά)', slug: 'microphone-accessories-pro', parentId: 391, image: '/dist/images/cat/microphone-accessories-pro.webp' },
  { id: 417, name: 'Φωτορυθμικά', slug: 'lighting-effects', parentId: 392, image: '/dist/images/cat/lighting-effects.webp' },
  { id: 418, name: 'Laser (Φωτισμός)', slug: 'lasers-lighting', parentId: 392, image: '/dist/images/cat/lasers-lighting.webp' },
  { id: 419, name: 'Κεφαλές Laser (Φωτισμός)', slug: 'laser-heads-lighting', parentId: 392, image: '/dist/images/cat/laser-heads-lighting.webp' },
  { id: 420, name: 'Par Cans', slug: 'par-cans', parentId: 392, image: '/dist/images/cat/par-cans.webp' },
  { id: 421, name: 'Μπάλες από Καθρέπτη', slug: 'mirror-balls', parentId: 392, image: '/dist/images/cat/mirror-balls.webp' },
  { id: 422, name: 'Κονσόλες Φωτισμού', slug: 'lighting-consoles', parentId: 392, image: '/dist/images/cat/lighting-consoles.webp' },
  { id: 423, name: 'DJ Controllers', slug: 'dj-controllers', parentId: 394, image: '/dist/images/cat/dj-controllers.webp' },
  { id: 424, name: 'Εξοπλισμός Midi Υπολογιστή (DJ)', slug: 'midi-equipment-dj', parentId: 394, image: '/dist/images/cat/midi-equipment-dj.webp' },
  { id: 425, name: 'DJ CD / MP3 Players', slug: 'dj-cd-mp3-players', parentId: 394, image: '/dist/images/cat/dj-cd-mp3-players.webp' },
  { id: 426, name: 'DJ Αξεσουάρ', slug: 'dj-accessories', parentId: 394, image: '/dist/images/cat/dj-accessories.webp' },
  { id: 427, name: 'Μηχανές Καπνού', slug: 'smoke-machines', parentId: 398, image: '/dist/images/cat/smoke-machines.webp' },
  { id: 428, name: 'Μηχανές για Φυσαλίδες', slug: 'bubble-machines', parentId: 398, image: '/dist/images/cat/bubble-machines.webp' },
  { id: 429, name: 'Μηχανές Χιονιού', slug: 'snow-machines', parentId: 398, image: '/dist/images/cat/snow-machines.webp' },
  { id: 430, name: 'Αξεσουάρ Μηχανημάτων Καπνού & Ατμόσφαιρας', slug: 'fog-atmosphere-accessories', parentId: 398, image: '/dist/images/cat/fog-atmosphere-accessories.webp' },
  { id: 431, name: 'Headphones', slug: 'headphones', parentId: 195, image: '/dist/images/cat/headphones.webp' },
  { id: 432, name: 'Ακουστικά Ψείρες', slug: 'earbuds', parentId: 195, image: '/dist/images/cat/earbuds.webp' },
  { id: 433, name: 'Ενισχυτές Ακουστικών', slug: 'headphone-amplifiers', parentId: 195, image: '/dist/images/cat/headphone-amplifiers.webp' },
  { id: 434, name: 'Μαξιλαράκια Ακουστικών', slug: 'headphone-pads', parentId: 195, image: '/dist/images/cat/headphone-pads.webp' },
  { id: 435, name: 'Βάσεις Ακουστικών', slug: 'headphone-stands', parentId: 195, image: '/dist/images/cat/headphone-stands.webp' },
  { id: 436, name: 'Αξεσουάρ, Ανταλλακτικά Ακουστικών', slug: 'headphone-accessories-parts', parentId: 195, image: '/dist/images/cat/headphone-accessories-parts.webp' },
  { id: 437, name: 'Gaming Headsets (Ήχος)', slug: 'gaming-headsets-audio', parentId: 195, image: '/dist/images/cat/gaming-headsets-audio.webp' },
  { id: 438, name: 'Ακουστικά Υπολογιστή (Ήχος)', slug: 'computer-headphones-audio', parentId: 195, image: '/dist/images/cat/computer-headphones-audio.webp' },
  { id: 439, name: 'Πικάπ', slug: 'turntables', parentId: 197, image: '/dist/images/cat/turntables.webp' },
  { id: 440, name: 'Slipmat', slug: 'slipmats', parentId: 197, image: '/dist/images/cat/slipmats.webp' },
  { id: 441, name: 'Κεφάλες Πικάπ', slug: 'turntable-cartridges', parentId: 197, image: '/dist/images/cat/turntable-cartridges.webp' },
  { id: 442, name: 'Συντήρηση, Καθαρισμός Πικάπ', slug: 'turntable-maintenance', parentId: 197, image: '/dist/images/cat/turntable-maintenance.webp' },
  { id: 443, name: 'Ρυθμιστικά Πικάπ', slug: 'turntable-adjustments', parentId: 197, image: '/dist/images/cat/turntable-adjustments.webp' },
  { id: 444, name: 'Βελόνες Πικάπ', slug: 'turntable-needles', parentId: 197, image: '/dist/images/cat/turntable-needles.webp' },
  { id: 445, name: 'Ανταλλακτικά Πικάπ', slug: 'turntable-parts', parentId: 197, image: '/dist/images/cat/turntable-parts.webp' },
  { id: 446, name: 'Αποθήκευση, Μεταφορά Δίσκων Πικάπ', slug: 'turntable-record-storage', parentId: 197, image: '/dist/images/cat/turntable-record-storage.webp' },
  { id: 447, name: 'Ενισχυτές Πικάπ', slug: 'turntable-amplifiers', parentId: 197, image: '/dist/images/cat/turntable-amplifiers.webp' },
  { id: 448, name: 'Σετ Home Cinema', slug: 'home-cinema-sets', parentId: 198, image: '/dist/images/cat/home-cinema-sets.webp' },
  { id: 449, name: 'Soundbar (Home Cinema)', slug: 'soundbars', parentId: 198, image: '/dist/images/cat/soundbars.webp' },
  { id: 450, name: 'Subwoofer (Home Cinema)', slug: 'subwoofers', parentId: 198, image: '/dist/images/cat/subwoofers.webp' },
  { id: 451, name: 'Φορητά Ράδιο CD', slug: 'portable-radio-cd', parentId: 199, image: '/dist/images/cat/portable-radio-cd.webp' },
  { id: 452, name: 'Φορητά Ραδιόφωνα', slug: 'portable-radios', parentId: 199, image: '/dist/images/cat/portable-radios.webp' },
  { id: 453, name: 'Δημοσιογραφικά, Καταγραφικά Ήχου', slug: 'audio-recorders', parentId: 199, image: '/dist/images/cat/audio-recorders.webp' },
  { id: 454, name: 'Φορητά CD Players', slug: 'portable-cd-players', parentId: 199, image: '/dist/images/cat/portable-cd-players.webp' },
  { id: 455, name: 'MP3, MP4 Players', slug: 'mp3-mp4-players', parentId: 200, image: '/dist/images/cat/mp3-mp4-players.webp' },
  { id: 456, name: 'MP3, MP4 Αξεσουάρ', slug: 'mp3-mp4-accessories', parentId: 200, image: '/dist/images/cat/mp3-mp4-accessories.webp' },
  { id: 457, name: 'Φωτογραφικές Μηχανές', slug: 'cameras', parentId: 203, image: '/dist/images/cat/cameras.webp' },
  { id: 458, name: 'Ring Lights', slug: 'ring-lights', parentId: 203, image: '/dist/images/cat/ring-lights.webp' },
  { id: 459, name: 'Τσάντες, Θήκες Φωτογραφικών Μηχανών', slug: 'camera-bags-cases', parentId: 203, image: '/dist/images/cat/camera-bags-cases.webp' },
  { id: 460, name: 'Φακοί Φωτογραφικών Μηχανών', slug: 'camera-lenses', parentId: 203, image: '/dist/images/cat/camera-lenses.webp' },
  { id: 461, name: 'Φίλτρα Φακών', slug: 'lens-filters', parentId: 203, image: '/dist/images/cat/lens-filters.webp' },
  { id: 462, name: 'Μπαταρίες Φωτογραφικών Μηχανών', slug: 'camera-batteries', parentId: 203, image: '/dist/images/cat/camera-batteries.webp' },
  { id: 463, name: 'Τρίποδα & Μονόποδα', slug: 'tripods-monopods', parentId: 203, image: '/dist/images/cat/tripods-monopods.webp' },
  { id: 464, name: 'Light Box', slug: 'light-boxes', parentId: 203, image: '/dist/images/cat/light-boxes.webp' },
  { id: 465, name: 'Soft Box', slug: 'soft-boxes', parentId: 203, image: '/dist/images/cat/soft-boxes.webp' },
  { id: 466, name: 'Φόντο Φωτογράφισης', slug: 'photo-backdrops', parentId: 203, image: '/dist/images/cat/photo-backdrops.webp' },
  { id: 467, name: 'Φιλμ', slug: 'film', parentId: 203, image: '/dist/images/cat/film.webp' },
  { id: 468, name: 'Φορτιστές Φωτογραφικών Μηχανών', slug: 'camera-chargers', parentId: 203, image: '/dist/images/cat/camera-chargers.webp' },
  { id: 469, name: 'Φλας, Αξεσουάρ', slug: 'flashes-accessories', parentId: 203, image: '/dist/images/cat/flashes-accessories.webp' },
  { id: 470, name: 'Βάσεις Φωτογραφικών Μηχανών', slug: 'camera-mounts', parentId: 203, image: '/dist/images/cat/camera-mounts.webp' },
  { id: 471, name: 'Αξεσουάρ Φωτογραφικών Μηχανών', slug: 'camera-accessories', parentId: 203, image: '/dist/images/cat/camera-accessories.webp' },
  { id: 472, name: 'Αξεσουάρ Φακών Φωτογραφικών Μηχανών', slug: 'lens-accessories', parentId: 203, image: '/dist/images/cat/lens-accessories.webp' },
  { id: 473, name: 'Action Cameras', slug: 'action-cameras', parentId: 204, image: '/dist/images/cat/action-cameras.webp' },
  { id: 474, name: 'Θήκες Προστασίας Action Cameras', slug: 'action-camera-protective-cases', parentId: 204, image: '/dist/images/cat/action-camera-protective-cases.webp' },
  { id: 475, name: 'Θήκες Μεταφοράς Action Cameras', slug: 'action-camera-carrying-cases', parentId: 204, image: '/dist/images/cat/action-camera-carrying-cases.webp' },
  { id: 476, name: 'Ιμάντες Στήριξης Action Cameras', slug: 'action-camera-mounting-straps', parentId: 204, image: '/dist/images/cat/action-camera-mounting-straps.webp' },
  { id: 477, name: 'Βάσεις Στήριξης Action Cameras', slug: 'action-camera-mounts', parentId: 204, image: '/dist/images/cat/action-camera-mounts.webp' },
  { id: 478, name: 'Gimbals Action Cameras', slug: 'action-camera-gimbals', parentId: 204, image: '/dist/images/cat/action-camera-gimbals.webp' },
  { id: 479, name: 'Τρίποδα Action Cameras', slug: 'action-camera-tripods', parentId: 204, image: '/dist/images/cat/action-camera-tripods.webp' },
  { id: 480, name: 'Μπαταρίες Action Cameras', slug: 'action-camera-batteries', parentId: 204, image: '/dist/images/cat/action-camera-batteries.webp' },
  { id: 481, name: 'Φορτιστές Action Cameras', slug: 'action-camera-chargers', parentId: 204, image: '/dist/images/cat/action-camera-chargers.webp' },
  { id: 482, name: 'Φίλτρα Action Cameras', slug: 'action-camera-filters', parentId: 204, image: '/dist/images/cat/action-camera-filters.webp' },
  { id: 483, name: 'Αξεσουάρ Action Cameras', slug: 'action-camera-accessories', parentId: 204, image: '/dist/images/cat/action-camera-accessories.webp' },
  { id: 484, name: 'Κάρτες Μνήμης (Action Cameras)', slug: 'action-camera-memory-cards', parentId: 204, image: '/dist/images/cat/action-camera-memory-cards.webp' },
  { id: 485, name: 'Ψηφιακές Βιντεοκάμερες', slug: 'digital-camcorders', parentId: 205, image: '/dist/images/cat/digital-camcorders.webp' },
  { id: 486, name: 'Μπαταρίες Βιντεοκαμερών', slug: 'camcorder-batteries', parentId: 205, image: '/dist/images/cat/camcorder-batteries.webp' },
  { id: 487, name: 'Προβολείς, Φλας (Video)', slug: 'lights-flashes-video', parentId: 205, image: '/dist/images/cat/lights-flashes-video.webp' },
  { id: 488, name: 'Φορτιστές Βιντεοκαμερών', slug: 'camcorder-chargers', parentId: 205, image: '/dist/images/cat/camcorder-chargers.webp' },
  { id: 489, name: 'Διάφορα Αξεσουάρ Βιντεοκάμερας', slug: 'various-camcorder-accessories', parentId: 205, image: '/dist/images/cat/various-camcorder-accessories.webp' },
  { id: 490, name: 'Φορτιστές Μπαταριών (Γενικοί)', slug: 'general-battery-chargers', parentId: 208, image: '/dist/images/cat/general-battery-chargers.webp' },
  { id: 491, name: 'Μπαταρίες (Γενικές)', slug: 'general-batteries', parentId: 208, image: '/dist/images/cat/general-batteries.webp' },
  { id: 492, name: 'Διάφορα Μπαταριών', slug: 'various-battery-items', parentId: 208, image: '/dist/images/cat/various-battery-items.webp' },
  { id: 493, name: 'Μικροεπεξεργαστές', slug: 'microprocessors', parentId: 209, image: '/dist/images/cat/microprocessors.webp' },
  { id: 494, name: 'Διακόπτες (Ηλεκτρονικοί)', slug: 'electronic-switches', parentId: 209, image: '/dist/images/cat/electronic-switches.webp' },
  { id: 495, name: 'Πυκνωτές', slug: 'capacitors', parentId: 209, image: '/dist/images/cat/capacitors.webp' },
  { id: 496, name: 'Led', slug: 'leds', parentId: 209, image: '/dist/images/cat/leds.webp' },
  { id: 497, name: 'Αισθητήρες', slug: 'sensors', parentId: 209, image: '/dist/images/cat/sensors.webp' },
  { id: 498, name: 'Ρελέ', slug: 'relays', parentId: 209, image: '/dist/images/cat/relays.webp' },
  { id: 499, name: 'Καλώδια (Μικροηλεκτρονικά)', slug: 'microelectronic-cables', parentId: 209, image: '/dist/images/cat/microelectronic-cables.webp' },
  { id: 500, name: 'Transistor', slug: 'transistors', parentId: 209, image: '/dist/images/cat/transistors.webp' },
  { id: 501, name: 'Δίοδοι', slug: 'diodes', parentId: 209, image: '/dist/images/cat/diodes.webp' },
  { id: 502, name: 'Ποτενσιόμετρα', slug: 'potentiometers', parentId: 209, image: '/dist/images/cat/potentiometers.webp' },
  { id: 503, name: 'Ασφάλειες (Ηλεκτρονικές)', slug: 'electronic-fuses', parentId: 209, image: '/dist/images/cat/electronic-fuses.webp' },
  { id: 504, name: 'Αντιστάσεις', slug: 'resistors', parentId: 209, image: '/dist/images/cat/resistors.webp' },
  { id: 505, name: 'Ολοκληρωμένα Κυκλώματα', slug: 'integrated-circuits', parentId: 209, image: '/dist/images/cat/integrated-circuits.webp' },
  { id: 506, name: 'Διάφορα Μικροηλεκτρονικά', slug: 'various-microelectronics', parentId: 209, image: '/dist/images/cat/various-microelectronics.webp' },
  { id: 507, name: 'Πλακέτες Ανάπτυξης', slug: 'development-boards', parentId: 493, image: '/dist/images/cat/development-boards.webp' },
  { id: 508, name: 'Εξαρτήματα Μικροεπεξεργαστών', slug: 'microprocessor-components', parentId: 493, image: '/dist/images/cat/microprocessor-components.webp' },
  { id: 509, name: 'Αξεσουάρ Μικροεπεξεργαστών', slug: 'microprocessor-accessories', parentId: 493, image: '/dist/images/cat/microprocessor-accessories.webp' },
  { id: 510, name: 'CD / DVD Καθαρισμού Φακών', slug: 'cd-dvd-lens-cleaners', parentId: 211, image: '/dist/images/cat/cd-dvd-lens-cleaners.webp' },
  { id: 511, name: 'Διάφορα Ηλεκτρονικών Συσκευών', slug: 'various-electronic-device-items', parentId: 211, image: '/dist/images/cat/various-electronic-device-items.webp' },
  { id: 512, name: 'Ασύρματα Τηλέφωνα', slug: 'cordless-phones', parentId: 212, image: '/dist/images/cat/cordless-phones.webp' },
  { id: 513, name: 'Ενσύρματα Τηλέφωνα', slug: 'corded-phones', parentId: 212, image: '/dist/images/cat/corded-phones.webp' },
  { id: 514, name: 'Αξεσουάρ Σταθερής Τηλεφωνίας', slug: 'landline-accessories', parentId: 212, image: '/dist/images/cat/landline-accessories.webp' },
  { id: 515, name: 'Παρελκόμενα Σταθερής Τηλεφωνίας', slug: 'landline-peripherals', parentId: 212, image: '/dist/images/cat/landline-peripherals.webp' },
  { id: 516, name: 'Τηλεφωνικά Κέντρα', slug: 'pbx-systems', parentId: 212, image: '/dist/images/cat/pbx-systems.webp' },
  { id: 517, name: 'Παρελκόμενα Τηλεφωνικών Κέντρων', slug: 'pbx-accessories', parentId: 212, image: '/dist/images/cat/pbx-accessories.webp' },
  { id: 518, name: 'Τηλεφωνικές Συσκευές IP', slug: 'ip-phones', parentId: 213, image: '/dist/images/cat/ip-phones.webp' },
  { id: 519, name: 'VoIP Gateways', slug: 'voip-gateways', parentId: 213, image: '/dist/images/cat/voip-gateways.webp' },
  { id: 520, name: 'VoIP Adapters', slug: 'voip-adapters', parentId: 213, image: '/dist/images/cat/voip-adapters.webp' },
  { id: 521, name: 'Κάρτες VoIP', slug: 'voip-cards', parentId: 213, image: '/dist/images/cat/voip-cards.webp' },
  { id: 522, name: 'Αξεσουάρ VoIP', slug: 'voip-accessories', parentId: 213, image: '/dist/images/cat/voip-accessories.webp' },
  { id: 523, name: 'Πομποδέκτες, Walkie-Talkie', slug: 'transceivers-walkie-talkies', parentId: 214, image: '/dist/images/cat/transceivers-walkie-talkies.webp' },
  { id: 524, name: 'Αξεσουάρ Ασυρμάτων', slug: 'walkie-talkie-accessories', parentId: 214, image: '/dist/images/cat/walkie-talkie-accessories.webp' },
];


// --- Brands ---
export const brands: Brand[] = [
  { id: 1, name: 'Apple', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/9.svg', slug: 'apple', officialWebsite: 'https://www.apple.com', countryOfOrigin: 'USA' },
  { id: 2, name: 'Samsung', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/26.svg', slug: 'samsung', officialWebsite: 'https://www.samsung.com', countryOfOrigin: 'South Korea' },
  { id: 3, name: 'Sony', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/5.svg', slug: 'sony' },
  { id: 4, name: 'LG', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/293.svg', slug: 'lg' },
  { id: 5, name: 'Canon', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/10.svg', slug: 'canon' },
  { id: 6, name: 'Nikon', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/281.svg', slug: 'nikon' },
  { id: 7, name: 'Lenovo', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/728.svg', slug: 'lenovo' },
  { id: 8, name: 'Dell', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/292.svg', slug: 'dell' },
  { id: 9, name: 'HP', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/1.svg', slug: 'hp' },
  { id: 10, name: 'Asus', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/161.svg', slug: 'asus' },
  { id: 11, name: 'Acer', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/7.svg', slug: 'acer' },
  { id: 12, name: 'Microsoft', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/100.svg', slug: 'microsoft' },
  { id: 13, name: 'ΑΛΦΑ', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/30165.svg', slug: 'alfa' },
  { id: 14, name: '3Guys', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/16764.svg', slug: '3guys' },
  { id: 15, name: '2K Games', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/18388.svg', slug: '2k-games' },
  { id: 16, name: '7Days', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/39065.svg', slug: '7days' },
  { id: 17, name: 'Βιοκαρπέτ', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/30055.svg', slug: 'viokarpet' },
  { id: 18, name: 'Χαμόγελο του Παιδιού', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/33632.svg', slug: 'hamogelo-tou-paidiou' },
  { id: 19, name: 'Χρωτέχ', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/36032.svg', slug: 'xrotex' },
  { id: 20, name: 'Γιώτης', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/21623.svg', slug: 'giotis' },
];


// --- Products ---
export const products: Product[] = [
  {
    id: 1, title: 'Apple iPhone 14 Pro Max 256GB Deep Purple', slug: 'apple-iphone-14-pro-max-256gb-deep-purple', brand: 'Apple', model: 'iPhone 14 Pro Max', mpn: 'MQ9X3HX/A', gtin: '0194253401199', categoryIds: [102, 103], description: 'Ανακάλυψε το iPhone 14 Pro Max 256GB...', shortDescription: 'iPhone 14 Pro Max 256GB Deep Purple με A16 Bionic.', image: '//bbpcdn.pstatic.gr/bpimg0/78TKg/1SYzV1_SX660/1728492731/apple-iphone-14-pro-max-256gb.webp', images: ['//bbpcdn.pstatic.gr/bpimg0/78TKg/1SYzV1_SX660/1728492731/apple-iphone-14-pro-max-256gb.webp', '//bbpcdn.pstatic.gr/P/bpimg129/66117/apple-iphone-14-pro-max-256gb.webp'], videos: ['https://www.youtube.com/watch?v=exampleVideoId1'], rating: 4.8, reviews: 245,
    specifications: { 'Οθόνη': '6.7 inch Super Retina XDR', 'Επεξεργαστής': 'A16 Bionic', 'RAM': '6GB', 'Χωρητικότητα': '256GB', 'Camera': '48MP + 12MP + 12MP', 'Λειτουργικό Σύστημα': 'iOS 16', 'Μπαταρία': '4323 mAh', 'Διαστάσεις': '160.7 x 77.6 x 7.85 mm', 'Weight': '240g', 'Χρώμα': 'Deep Purple' },
    prices: [ { vendorId: 1, price: 1299.99, shippingCost: 0, inStock: true, installments: { count: 12 }, productUrl: 'https://www.you.gr/product/1', lastUpdated: '2023-10-26T10:00:00Z' }, { vendorId: 2, price: 1319.99, shippingCost: 5, inStock: true, installments: { count: 24, monthlyAmount: 55 }, productUrl: 'https://www.plaisio.gr/product/1', lastUpdated: '2023-10-27T08:30:00Z' }, { vendorId: 3, price: 1289.99, shippingCost: 7.99, inStock: true, productUrl: 'https://www.public.gr/product/1', lastUpdated: '2023-10-27T11:15:00Z' }, { vendorId: 4, price: 1309.99, shippingCost: 0, inStock: false, productUrl: 'https://www.kotsovolos.gr/product/1', lastUpdated: '2023-10-25T14:00:00Z' } ],
    lowestPrice: 1289.99, bestPriceVendorId: 3, status: 'active', isFeatured: true, tags: ["new", "smartphone", "ios"], dateAdded: "2022-09-16T00:00:00Z", releaseDate: "2022-09-16", lastModified: "2023-10-27T11:15:00Z", hasVariants: true, variantAttributes: ["Χρώμα", "Χωρητικότητα"], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['men', 'women', 'teens'], interest: ['tech', 'gadgets'], occasion: ['birthday', 'christmas'], genderTarget: 'unisex' }, // Assuming unisex for these recipients
  },
  {
    id: 2, title: 'Samsung Galaxy S23 Ultra 512GB Phantom Black', slug: 'samsung-galaxy-s23-ultra-512gb-phantom-black', brand: 'Samsung', model: 'Galaxy S23 Ultra', categoryIds: [102],
    description: 'Το απόλυτο Samsung τηλέφωνο...', image: '//placehold.co/400x400?text=Galaxy+S23+Black', images: ['//placehold.co/400x400?text=Galaxy+S23+Black', '//placehold.co/400x400?text=Galaxy+S23+Side', '//placehold.co/400x400?text=Galaxy+S23+Back'], videos: [], rating: 4.7, reviews: 189,
    specifications: { 'Οθόνη': '6.8 inch Dynamic AMOLED 2X', 'Χρώμα': 'Phantom Black' },
    prices: [ { vendorId: 1, price: 1199.99, shippingCost: 0, inStock: true, lastUpdated: '2023-10-27T09:00:00Z' }, { vendorId: 3, price: 1179.99, shippingCost: 7.99, inStock: true, lastUpdated: '2023-10-27T11:00:00Z' }, { vendorId: 7, price: 1189.99, shippingCost: 3, inStock: true, discountPrice: 1159.99, lastUpdated: '2023-10-26T18:00:00Z' } ],
    lowestPrice: 1159.99, bestPriceVendorId: 7, status: 'active', tags: ["android", "flagship", "s pen"], dateAdded: "2023-02-01T00:00:00Z", releaseDate: "2023-02-17", lastModified: "2023-10-27T11:00:00Z", hasVariants: true, variantAttributes: ["Χρώμα", "Χωρητικότητα"],
    variants: [ { sku: "SM-S918BZGPEUB", gtin: "8806094732145", attributes: { "Χρώμα": "Green", "Χωρητικότητα": "512GB" }, image: "//placehold.co/400x400?text=Galaxy+S23+Green", prices: [ { vendorId: 3, price: 1185.00, shippingCost: 8, inStock: true, lastUpdated: '2023-10-27T10:00:00Z' } ] }, { sku: "SM-S918BZCPEUB", gtin: "8806094732888", attributes: { "Χρώμα": "Cream", "Χωρητικότητα": "512GB" }, prices: [ { vendorId: 1, price: 1199.99, shippingCost: 0, inStock: false, lastUpdated: '2023-10-25T10:00:00Z' } ] } ],
    comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['men', 'women', 'teens'], interest: ['tech', 'gadgets', 'photography'], occasion: ['birthday', 'christmas'], genderTarget: 'unisex' },
  },
  {
    id: 3, title: 'MacBook Pro 16-inch', slug: 'macbook-pro-16-inch-m1', brand: 'Apple', model: 'MacBook Pro', categoryIds: [141], description: 'High-performance laptop...', image: '//placehold.co/400x400?text=MacBook+Pro', images: ['//placehold.co/400x400?text=MacBook+Pro'], rating: 4.6, reviews: 200,
    specifications: { 'Επεξεργαστής': 'Apple M1 Pro', 'RAM': '16GB', 'Χωρητικότητα': '512GB SSD', 'Διαστάσεις': '3.5 x 13.5 x 9.8 inches', 'Weight': '4.7 pounds' },
    prices: [ { vendorId: 1, price: 2499.99, shippingCost: 0, inStock: true }, { vendorId: 2, price: 2399.99, shippingCost: 10, inStock: true } ], lowestPrice: 2399.99, bestPriceVendorId: 2, status: 'active', tags: ['laptop', 'pro', 'macos'], videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['men', 'women', 'teens'], interest: ['tech', 'work', 'design'], genderTarget: 'unisex' },
  },
  {
    id: 4, title: 'Sony 55 Inch 4K UHD TV', slug: 'sony-bravia-55-4k-uhd', brand: 'Sony', model: 'Bravia', categoryIds: [337], description: 'Stunning visuals...', image: '//placehold.co/400x400?text=Sony+TV', images: ['//placehold.co/400x400?text=Sony+TV'], rating: 4.8, reviews: 150,
    specifications: { 'Resolution': '4K UHD', 'Τύπος οθόνης': 'LED', 'Smart TV': 'Yes', 'Weight': '37.5 pounds' },
    prices: [ { vendorId: 3, price: 899.99, shippingCost: 0, inStock: true }, { vendorId: 4, price: 849.99, shippingCost: 20, inStock: true, discountPrice: 829.99 } ], lowestPrice: 829.99, bestPriceVendorId: 4, status: 'active', tags: ['tv', '4k', 'smarttv'], videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['men', 'women'], interest: ['home-cinema', 'tech'], occasion: ['housewarming'], genderTarget: 'unisex' },
  },
  {
    id: 5, title: 'Dell XPS 13 Laptop', slug: 'dell-xps-13-laptop', brand: 'Dell', model: 'XPS 13', categoryIds: [140], description: 'Ultra-thin laptop...', image: '//placehold.co/400x400?text=Dell+XPS+13', images: ['//placehold.co/400x400?text=Dell+XPS+13'], rating: 4.5, reviews: 180,
    specifications: { 'Επεξεργαστής': 'Intel i7', 'RAM': '16GB', 'Χωρητικότητα': '1TB SSD', 'Διαστάσεις': '0.58 x 11.6 x 7.8 inches', 'Weight': '2.7 pounds' },
    prices: [ { vendorId: 2, price: 1299.99, shippingCost: 0, inStock: true }, { vendorId: 6, price: 1249.99, shippingCost: 5, inStock: true } ], lowestPrice: 1249.99, bestPriceVendorId: 6, status: 'active', tags: ['laptop', 'ultrabook', 'windows'], videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['men', 'women', 'teens'], interest: ['tech', 'work'], genderTarget: 'unisex' },
  },
  {
    id: 6, title: 'Fitness Tracker Watch', slug: 'fitbit-versa-3', brand: 'Fitbit', model: 'Versa 3', categoryIds: [162], description: 'Monitor your health...', image: '//placehold.co/400x400?text=Fitness+Tracker', images: ['//placehold.co/400x400?text=Fitness+Tracker'], rating: 4.4, reviews: 300,
    specifications: { 'Διάρκεια μπαταρίας': '6+ days', 'Water Resistant': 'Yes', 'Syncs to': 'Mobile App' },
    prices: [ { vendorId: 2, price: 229.99, shippingCost: 0, inStock: true }, { vendorId: 3, price: 199.99, shippingCost: 5, inStock: true } ], lowestPrice: 199.99, bestPriceVendorId: 3, status: 'active', tags: ['wearable', 'fitness', 'smartwatch'], videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['men', 'women', 'teens'], interest: ['fitness', 'health', 'tech'], genderTarget: 'unisex' },
  },
  {
    id: 7, title: 'Nike Running Shoes', slug: 'nike-air-zoom-pegasus', brand: 'Nike', model: 'Air Zoom Pegasus', categoryIds: [97], description: 'Comfortable running shoes...', image: '//placehold.co/400x400?text=Nike+Shoes', images: ['//placehold.co/400x400?text=Nike+Shoes'], rating: 4.7, reviews: 350,
    specifications: { 'Material': 'Synthetic', 'Weight': '10.6 ounces', 'Style': 'Running' },
    prices: [ { vendorId: 1, price: 119.99, shippingCost: 0, inStock: true }, { vendorId: 6, price: 109.99, shippingCost: 5, inStock: true } ], lowestPrice: 109.99, bestPriceVendorId: 6, status: 'active', tags: ['shoes', 'running', 'sport'], videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['men', 'women', 'teens'], interest: ['sports', 'fitness', 'running'], genderTarget: 'unisex' }, // Could be male/female specific if variants exist
  },
  {
    id: 8, title: 'PlayStation 5 Console Digital Edition', slug: 'playstation-5-digital-edition', brand: 'Sony', model: 'PS5 Digital Edition', gtin: '0711719395102', categoryIds: [178], description: 'Next-gen gaming console...', image: '//placehold.co/400x400?text=PS5+Digital', images: ['//placehold.co/400x400?text=PS5+Digital'], rating: 4.9, reviews: 500,
    specifications: { 'Χωρητικότητα': '825GB SSD', 'Resolution': 'Up to 120fps', 'Includes': 'Controller and Cable', 'Optical Drive': 'No' },
    prices: [ { vendorId: 1, price: 449.99, shippingCost: 0, inStock: false, lastUpdated: '2023-10-20T10:00:00Z' }, { vendorId: 4, price: 439.99, shippingCost: 10, inStock: true, lastUpdated: '2023-10-27T12:00:00Z' } ], lowestPrice: 439.99, bestPriceVendorId: 4, status: 'active', tags: ["gaming", "console", "digital"], dateAdded: "2020-11-12T00:00:00Z", releaseDate: "2020-11-12", lastModified: "2023-10-27T12:00:00Z", videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['men', 'teens'], interest: ['gaming', 'tech'], genderTarget: 'male' }, // Often marketed more to males, but can be unisex
  },
  {
    id: 9, title: 'Wireless Headphones', slug: 'bose-quietcomfort-35', brand: 'Bose', model: 'QuietComfort 35', categoryIds: [431], description: 'Noise-cancelling headphones...', image: '//placehold.co/400x400?text=Bose+Headphones', images: ['//placehold.co/400x400?text=Bose+Headphones'], rating: 4.8, reviews: 275,
    specifications: { 'Διάρκεια μπαταρίας': '20 hours', 'Features': 'Bluetooth, Voice Assistant' },
    prices: [ { vendorId: 3, price: 299.99, shippingCost: 0, inStock: true } ], lowestPrice: 299.99, bestPriceVendorId: 3, status: 'active', tags: ['audio', 'headphones', 'wireless', 'noise-cancelling'], videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['men', 'women', 'teens'], interest: ['tech', 'music', 'travel'], genderTarget: 'unisex' },
  },
  {
    id: 10, title: 'Artificial Intelligence for Beginners', slug: 'ai-for-beginners-book', brand: 'TechBooks', model: 'AI Basics', categoryIds: [84], description: 'An introductory book...', image: '//placehold.co/400x400?text=AI+Book', images: ['//placehold.co/400x400?text=AI+Book'], rating: 4.5, reviews: 50, specifications: { 'Pages': '400', 'ISBN': '978-3-16-148410-0' },
    prices: [ { vendorId: 5, price: 29.99, shippingCost: 0, inStock: true } ], lowestPrice: 29.99, bestPriceVendorId: 5, status: 'active', tags: ['book', 'ai', 'tech', 'learning'], videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['men', 'women', 'teens'], interest: ['books', 'tech', 'learning'], genderTarget: 'unisex' },
  },
  {
    id: 11, title: 'Camping Tent', slug: 'naturehike-camping-tent-x1', brand: 'NatureHike', model: 'Camping Tent X1', categoryIds: [82], description: 'Spacious camping tent...', image: '//placehold.co/400x400?text=Camping+Tent', images: ['//placehold.co/400x400?text=Camping+Tent'], rating: 4.6, reviews: 100, specifications: { 'Capacity': '4 Persons', 'Material': 'Waterproof' },
    prices: [ { vendorId: 6, price: 149.99, shippingCost: 0, inStock: true }, { vendorId: 2, price: 139.99, shippingCost: 10, inStock: true } ], lowestPrice: 139.99, bestPriceVendorId: 2, status: 'active', tags: ['camping', 'outdoor', 'tent'], videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['men', 'women'], interest: ['camping', 'outdoors', 'hobby'], genderTarget: 'unisex' },
  },
  {
    id: 12, title: 'Vegetable Planter Box', slug: 'vegetable-planter-box', brand: 'Gardener\'s Supply', model: 'Planter Box to go', categoryIds: [25], description: 'Perfect for urban gardening!', image: '//placehold.co/400x400?text=Vegetable+Planter', images: ['//placehold.co/400x400?text=Vegetable+Planter'], rating: 4.7, reviews: 60, specifications: { 'Material': 'Wood', 'Διαστάσεις': '40 x 20 x 15 inches' },
    prices: [ { vendorId: 1, price: 79.99, shippingCost: 0, inStock: true } ], lowestPrice: 79.99, bestPriceVendorId: 1, status: 'active', tags: ['garden', 'planting', 'home'], videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['women', 'men'], interest: ['gardening', 'home'], genderTarget: 'unisex' },
  },
  {
    id: 13, title: 'Nonstick Cookware Set', slug: 't-fal-cookware-basic-set', brand: 'T-fal', model: 'Cookware Basic Set', categoryIds: [29], description: 'Durable cookware set...', image: '//placehold.co/400x400?text=Cookware+Set', images: ['//placehold.co/400x400?text=Cookware+Set'], rating: 4.4, reviews: 150, specifications: { 'Material': 'Nonstick', 'Gauge': '304 Stainless Steel' },
    prices: [ { vendorId: 6, price: 99.99, shippingCost: 0, inStock: true } ], lowestPrice: 99.99, bestPriceVendorId: 6, status: 'active', tags: ['kitchen', 'cookware', 'home'], videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['women', 'men'], interest: ['cooking', 'home'], occasion: ['housewarming', 'wedding'], genderTarget: 'unisex' },
  },
  {
    id: 14, title: 'Fashion Backpack', slug: 'swissgear-travel-backpack', brand: 'SwissGear', model: 'Travel Backpack', categoryIds: [83], description: 'Stylish and functional backpack...', image: '//placehold.co/400x400?text=Backpack', images: ['//placehold.co/400x400?text=Backpack'], rating: 4.7, reviews: 120, specifications: { 'Material': 'Polyester', 'Διαστάσεις': '17.5 x 12.5 x 7 inches' },
    prices: [ { vendorId: 5, price: 59.99, shippingCost: 0, inStock: true } ], lowestPrice: 59.99, bestPriceVendorId: 5, status: 'active', tags: ['bag', 'backpack', 'travel', 'fashion'], videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['men', 'women', 'teens'], interest: ['travel', 'fashion'], genderTarget: 'unisex' },
  },
  {
    id: 15, title: 'Electric Kettle', slug: 'hamilton-beach-electric-kettle', brand: 'Hamilton Beach', model: 'Electric Kettle 1.7L', categoryIds: [22], description: 'Quick boiling kettle...', image: '//placehold.co/400x400?text=Electric+Kettle', images: ['//placehold.co/400x400?text=Electric+Kettle'], rating: 4.5, reviews: 90, specifications: { 'Material': 'Stainless Steel', 'Capacity': '1.7 Liters' },
    prices: [ { vendorId: 2, price: 39.99, shippingCost: 0, inStock: true }, { vendorId: 3, price: 34.99, shippingCost: 5, inStock: true } ], lowestPrice: 34.99, bestPriceVendorId: 3, status: 'active', tags: ['kitchen', 'kettle', 'appliance'], videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['men', 'women'], interest: ['home', 'kitchen'], occasion: ['housewarming'], genderTarget: 'unisex' },
  },
  {
    id: 16, title: 'Yoga Mat', slug: 'liforme-yoga-mat', brand: 'Liforme', model: 'Eco-Friendly', categoryIds: [86], description: 'Durable and non-slip yoga mat.', image: '//placehold.co/400x400?text=Yoga+Mat', images: ['//placehold.co/400x400?text=Yoga+Mat'], rating: 4.8, reviews: 200, specifications: { 'Material': 'Natural Rubber', 'Thickness': '5mm' },
    prices: [ { vendorId: 1, price: 49.99, shippingCost: 0, inStock: true } ], lowestPrice: 49.99, bestPriceVendorId: 1, status: 'active', tags: ['yoga', 'fitness', 'sport'], videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['women', 'men', 'teens'], interest: ['fitness', 'health', 'yoga'], genderTarget: 'unisex' },
  },
  {
    id: 17, title: 'Pet Cat Tree', slug: 'pawhut-cat-tree-tower', brand: 'PawHut', model: 'Pet Kitty Tower', categoryIds: [41], description: 'Fun play area for your cat.', image: '//placehold.co/400x400?text=Cat+Tree', images: ['//placehold.co/400x400?text=Cat+Tree'], rating: 4.6, reviews: 80, specifications: { 'Material': 'Wood and Fabric', 'Height': '4 feet' },
    prices: [ { vendorId: 4, price: 79.99, shippingCost: 0, inStock: true } ], lowestPrice: 79.99, bestPriceVendorId: 4, status: 'active', tags: ['pet', 'cat', 'home'], videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: {},
  },
  {
    id: 18, title: 'Children’s Educational Tablet', slug: 'amazon-fire-hd-10-kids', brand: 'Amazon', model: 'Fire HD 10', categoryIds: [169, 73], description: 'Kids-friendly tablet...', image: '//placehold.co/400x400?text=Kids+Tablet', images: ['//placehold.co/400x400?text=Kids+Tablet'], rating: 4.7, reviews: 300, specifications: { 'Διάρκεια μπαταρίας': '12 hours', 'Size': '10.1 inch' },
    prices: [ { vendorId: 1, price: 149.99, shippingCost: 0, inStock: true } ], lowestPrice: 149.99, bestPriceVendorId: 1, status: 'active', tags: ['kids', 'tablet', 'education', 'tech'], videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['kids9-11', 'kids6-8'], interest: ['tech', 'learning', 'gaming'], occasion: ['birthday', 'christmas'], genderTarget: 'unisex' }, // Tablets generally unisex for kids
  },
  {
    id: 19, title: 'Smart TV Stick', slug: 'amazon-fire-stick-4k', brand: 'Amazon', model: 'Fire Stick 4K', categoryIds: [157], description: 'Stream all your favorites...', image: '//placehold.co/400x400?text=Smart+TV+Stick', images: ['//placehold.co/400x400?text=Smart+TV+Stick'], rating: 4.9, reviews: 400, specifications: { 'Supports': '4K Ultra HD, HDR', 'Includes': 'Alexa Voice Remote' },
    prices: [ { vendorId: 5, price: 49.99, shippingCost: 0, inStock: true } ], lowestPrice: 49.99, bestPriceVendorId: 5, status: 'active', tags: ['streaming', 'tv', 'gadget', '4k'], videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['men', 'women', 'teens'], interest: ['tech', 'gadgets', 'movies'], genderTarget: 'unisex' },
  },
  {
    id: 20, title: 'Drone with Camera', slug: 'dji-mavic-air-2', brand: 'DJI', model: 'Mavic Air 2', categoryIds: [88], description: 'Capture stunning aerial footage.', image: '//placehold.co/400x400?text=Drone', images: ['//placehold.co/400x400?text=Drone'], rating: 4.8, reviews: 150, specifications: { 'Camera': '48MP', 'Flight Time': '34 minutes' },
    prices: [ { vendorId: 2, price: 799.99, shippingCost: 0, inStock: true } ], lowestPrice: 799.99, bestPriceVendorId: 2, status: 'active', tags: ['drone', 'camera', 'tech', 'gadget'], videos: [], variants: [], comparisonProductIds: [], relatedProductIds: [],
    giftAttributes: { recipient: ['men', 'teens'], interest: ['tech', 'gadgets', 'photography', 'hobby'], genderTarget: 'male' }, // Often more male-targeted
  },
  {
    id: 21, title: 'Espresso Machine Pro X', slug: 'delonghi-espresso-pro-x', brand: 'DeLonghi', categoryIds: [22, 29], description: 'Απολαύστε αυθεντικό espresso στο σπίτι με πίεση 15 bar.', image: '//placehold.co/400x400?text=Espresso+Pro+X', rating: 4.6, reviews: 120,
    specifications: { 'Pressure': '15 bar', 'Water Tank': '1.1L' }, prices: [ { vendorId: 4, price: 219.50, inStock: true }, { vendorId: 7, price: 209.90, discountPrice: 195.00, inStock: true } ], lowestPrice: 195.00, bestPriceVendorId: 7,
    giftAttributes: { recipient: ['men', 'women'], interest: ['coffee', 'kitchen', 'home'], occasion: ['housewarming', 'birthday'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['kitchen', 'appliance'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 22, title: 'Ασύρματο Ποντίκι Logitech MX Anywhere 3', slug: 'logitech-mx-anywhere-3', brand: 'Logitech', categoryIds: [255], description: 'Compact, performance mouse for mobile work.', image: '//placehold.co/400x400?text=MX+Anywhere', rating: 4.8, reviews: 250,
    specifications: { 'Connectivity': 'Bluetooth, USB-C', 'Sensor': 'Darkfield' }, prices: [ { vendorId: 2, price: 79.99, inStock: true }, { vendorId: 3, price: 75.90, inStock: false } ], lowestPrice: 79.99, bestPriceVendorId: 2,
    giftAttributes: { recipient: ['men', 'women', 'teens'], interest: ['tech', 'work', 'computers', 'travel'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['computer', 'mouse', 'portable'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 23, title: 'Βαλίτσα Ταξιδίου Spinner Large', slug: 'samsonite-spinner-large', brand: 'Samsonite', categoryIds: [83], description: 'Μεγάλη βαλίτσα spinner για μακρινά ταξίδια.', image: '//placehold.co/400x400?text=Suitcase+Large', rating: 4.7, reviews: 95,
    specifications: { 'Size': 'Large', 'Material': 'Polycarbonate' }, prices: [ { vendorId: 3, price: 195.00, discountPrice: 175.00, inStock: true }, { vendorId: 5, price: 190.50, inStock: true } ], lowestPrice: 175.00, bestPriceVendorId: 3,
    giftAttributes: { recipient: ['men', 'women'], interest: ['travel'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['luggage', 'travel'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 24, title: 'Lego Creator Expert Βοτανικός Κήπος', slug: 'lego-botanical-garden', brand: 'Lego', categoryIds: [79, 26], description: 'Όμορφη κατασκευή Lego για ενήλικες.', image: '//placehold.co/400x400?text=Lego+Botanical', rating: 4.9, reviews: 180,
    specifications: { 'Pieces': 1173 }, prices: [ { vendorId: 3, price: 89.99, inStock: true }, { vendorId: 7, price: 85.00, inStock: true } ], lowestPrice: 85.00, bestPriceVendorId: 7,
    giftAttributes: { recipient: ['women', 'men'], interest: ['lego', 'home', 'decor', 'hobby'], occasion: ['birthday', 'mothersday'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['lego', 'adult', 'decor'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 25, title: 'Ανδρικό Ρολόι Seiko 5 Sports Automatic', slug: 'seiko-5-sports-auto', brand: 'Seiko', categoryIds: [44], description: 'Αυτόματο μηχανικό ρολόι με σπορ εμφάνιση.', image: '//placehold.co/400x400?text=Seiko+5', rating: 4.7, reviews: 255,
    specifications: { 'Movement': 'Automatic', 'Water Resistance': '100m' }, prices: [ { vendorId: 1, price: 249.00, inStock: true }, { vendorId: 6, price: 240.00, discountPrice: 230.00, inStock: true } ], lowestPrice: 230.00, bestPriceVendorId: 6,
    giftAttributes: { recipient: ['men'], interest: ['watches', 'fashion', 'accessories', 'automatic'], occasion: ['birthday', 'anniversary'], genderTarget: 'male' }, images: [], videos: [], variants: [], tags: ['watch', 'men', 'automatic'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 26, title: 'Kobo Clara 2E E-reader', slug: 'kobo-clara-2e', brand: 'Kobo', categoryIds: [174], description: 'E-reader με οθόνη Carta E Ink 6" και ComfortLight PRO.', image: '//placehold.co/400x400?text=Kobo+Clara', rating: 4.6, reviews: 140,
    specifications: { 'Storage': '16GB', 'Screen': '6 inch E Ink Carta 1200' }, prices: [{ vendorId: 3, price: 149.99, inStock: true }], lowestPrice: 149.99, bestPriceVendorId: 3,
    giftAttributes: { recipient: ['men', 'women', 'teens'], interest: ['books', 'tech', 'reading'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['ebook', 'reader', 'tech'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 27, title: 'Philips Series 9000 Prestige Ξυριστική Μηχανή', slug: 'philips-shaver-9000-prestige', brand: 'Philips', categoryIds: [56], description: 'Κορυφαίο ξύρισμα με αισθητήρα πίεσης.', image: '//placehold.co/400x400?text=Philips+Shaver', rating: 4.8, reviews: 190,
    specifications: { 'Type': 'Rotary', 'Wet & Dry': true }, prices: [{ vendorId: 4, price: 299.90, discountPrice: 279.90, inStock: true }], lowestPrice: 279.90, bestPriceVendorId: 4,
    giftAttributes: { recipient: ['men'], interest: ['grooming', 'tech', 'beauty'], genderTarget: 'male' }, images: [], videos: [], variants: [], tags: ['shaver', 'grooming', 'men'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 28, title: 'Creed Aventus Eau de Parfum 100ml', slug: 'creed-aventus-edp', brand: 'Creed', categoryIds: [54], description: 'Εμβληματικό ανδρικό άρωμα πολυτέλειας.', image: '//placehold.co/400x400?text=Aventus', rating: 4.9, reviews: 620,
    specifications: { 'Notes': 'Pineapple, Birch, Musk' }, prices: [{ vendorId: 1, price: 285.00, inStock: true }], lowestPrice: 285.00, bestPriceVendorId: 1,
    giftAttributes: { recipient: ['men'], interest: ['perfume', 'luxury', 'fashion'], occasion: ['birthday', 'anniversary', 'christmas'], genderTarget: 'male' }, images: [], videos: [], variants: [], tags: ['fragrance', 'men', 'luxury'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 29, title: 'Philips Sonicare DiamondClean Ηλεκτρική Οδοντόβουρτσα', slug: 'sonicare-diamondclean', brand: 'Philips Sonicare', categoryIds: [61], description: 'Για λευκότερα δόντια και υγιή ούλα.', image: '//placehold.co/400x400?text=Sonicare', rating: 4.8, reviews: 280,
    specifications: { 'Modes': 5, 'Technology': 'Sonic' }, prices: [{ vendorId: 4, price: 159.90, inStock: true }], lowestPrice: 159.90, bestPriceVendorId: 4,
    giftAttributes: { recipient: ['men', 'women'], interest: ['health', 'gadgets', 'beauty'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['oralcare', 'health', 'tech'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 30, title: 'Πέτρα Πίτσας για BBQ', slug: 'bbq-pizza-stone', brand: 'Weber', categoryIds: [29], description: 'Ψήστε τέλεια πίτσα στο μπάρμπεκιου.', image: '//placehold.co/400x400?text=Pizza+Stone', rating: 4.5, reviews: 70,
    specifications: { 'Material': 'Cordierite', 'Diameter': '36cm' }, prices: [{ vendorId: 2, price: 44.90, inStock: true }], lowestPrice: 44.90, bestPriceVendorId: 2,
    giftAttributes: { recipient: ['men', 'women'], interest: ['bbq', 'cooking', 'outdoors', 'home', 'food'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['bbq', 'pizza', 'cooking'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 31, title: 'Μπλέντερ Χειρός Braun MultiQuick 7', slug: 'braun-multiquick-7', brand: 'Braun', categoryIds: [22, 29], description: 'Πολυλειτουργικό ραβδομπλέντερ με αξεσουάρ.', image: '//placehold.co/400x400?text=Braun+MQ7', rating: 4.7, reviews: 150,
    specifications: { 'Power': '1000W', 'Attachments': 'Chopper, Whisk, Beaker' }, prices: [{ vendorId: 7, price: 79.90, inStock: true }], lowestPrice: 79.90, bestPriceVendorId: 7,
    giftAttributes: { recipient: ['women', 'men'], interest: ['cooking', 'kitchen', 'home'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['blender', 'kitchen', 'appliance'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 32, title: 'Αφυγραντήρας Inventor Eva II Pro WiFi 20L', slug: 'inventor-dehumidifier-eva-2', brand: 'Inventor', categoryIds: [22], description: 'Αποτελεσματικός αφυγραντήρας με σύνδεση WiFi.', image: '//placehold.co/400x400?text=Inventor+Dehumidifier', rating: 4.6, reviews: 190,
    specifications: { 'Capacity': '20L/day', 'Coverage': '120 sqm', 'WiFi': true }, prices: [{ vendorId: 4, price: 239.00, discountPrice: 219.00, inStock: true }], lowestPrice: 219.00, bestPriceVendorId: 4,
    giftAttributes: { recipient: ['women', 'men'], interest: ['home', 'smarthome', 'health'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['dehumidifier', 'home', 'appliance'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 33, title: 'Επιτραπέζιο Παιχνίδι Azul', slug: 'azul-board-game', brand: 'Next Move Games', categoryIds: [79], description: 'Πανέμορφο παιχνίδι στρατηγικής με πλακίδια.', image: '//placehold.co/400x400?text=Azul', rating: 4.8, reviews: 290,
    specifications: {}, prices: [{ vendorId: 3, price: 32.00, inStock: true }], lowestPrice: 32.00, bestPriceVendorId: 3,
    giftAttributes: { recipient: ['teens', 'men', 'women'], interest: ['boardgames', 'strategy', 'art'], occasion: ['birthday', 'christmas'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['boardgame', 'abstract', 'strategy'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 34, title: 'Ρομποτική Σκούπα Xiaomi Robot Vacuum S10', slug: 'xiaomi-robot-vacuum-s10', brand: 'Xiaomi', categoryIds: [22], description: 'Έξυπνη σκούπα ρομπότ με σφουγγάρισμα.', image: '//placehold.co/400x400?text=Xiaomi+Robot', rating: 4.5, reviews: 310,
    specifications: { 'Suction': '4000Pa', 'Mapping': 'LDS Laser' }, prices: [{ vendorId: 7, price: 249.00, inStock: true }], lowestPrice: 249.00, bestPriceVendorId: 7,
    giftAttributes: { recipient: ['men', 'women'], interest: ['tech', 'smarthome', 'gadgets', 'home'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['robotvacuum', 'smarthome', 'tech'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 35, title: 'Σετ Παπλωματοθήκη Υπέρδιπλη Nef-Nef', slug: 'nef-nef-duvet-cover-set', brand: 'Nef-Nef', categoryIds: [27], description: 'Παπλωματοθήκη και μαξιλαροθήκες από βαμβακοσατέν.', image: '//placehold.co/400x400?text=Duvet+Set', rating: 4.6, reviews: 80,
    specifications: { 'Material': 'Cotton Sateen', 'Size': 'King' }, prices: [{ vendorId: 2, price: 59.90, discountPrice: 49.90, inStock: true }], lowestPrice: 49.90, bestPriceVendorId: 2,
    giftAttributes: { recipient: ['women', 'men'], interest: ['home', 'decor'], occasion: ['wedding', 'housewarming'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['bedding', 'home', 'decor'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 36, title: 'Φορητό Ηχείο Bluetooth JBL Flip 6', slug: 'jbl-flip-6', brand: 'JBL', categoryIds: [381], description: 'Αδιάβροχο φορητό ηχείο με δυνατό ήχο.', image: '//placehold.co/400x400?text=JBL+Flip6', rating: 4.7, reviews: 550,
    specifications: { 'Waterproof': 'IP67', 'Playtime': '12 hours' }, prices: [{ vendorId: 3, price: 119.00, inStock: true }, { vendorId: 1, price: 115.00, inStock: true }], lowestPrice: 115.00, bestPriceVendorId: 1,
    giftAttributes: { recipient: ['men', 'women', 'teens'], interest: ['music', 'tech', 'gadgets', 'outdoors'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['speaker', 'bluetooth', 'portable', 'audio'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 37, title: 'Μύλος Καφέ Hario Skerton Pro', slug: 'hario-skerton-pro', brand: 'Hario', categoryIds: [29], description: 'Χειροκίνητος μύλος καφέ με κεραμικά μαχαίρια.', image: '//placehold.co/400x400?text=Hario+Grinder', rating: 4.8, reviews: 190,
    specifications: { 'Burrs': 'Ceramic', 'Capacity': '100g' }, prices: [{ vendorId: 4, price: 45.00, inStock: true }], lowestPrice: 45.00, bestPriceVendorId: 4,
    giftAttributes: { recipient: ['men', 'women'], interest: ['coffee', 'kitchen', 'home'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['coffee', 'grinder', 'manual'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 38, title: 'Παιχνίδι Κάρτες Uno', slug: 'uno-card-game', brand: 'Mattel', categoryIds: [79], description: 'Το κλασικό παιχνίδι καρτών για όλη την παρέα.', image: '//placehold.co/400x400?text=Uno+Cards', rating: 4.9, reviews: 1500,
    specifications: {}, prices: [{ vendorId: 3, price: 5.99, inStock: true }], lowestPrice: 5.99, bestPriceVendorId: 3,
    giftAttributes: { recipient: ['kids6-8', 'kids9-11', 'teens', 'men', 'women'], interest: ['games', 'cardgames', 'family'], occasion: ['stocking-stuffer'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['cardgame', 'family', 'party'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 39, title: 'Βιβλίο "Sapiens: Μια Σύντομη Ιστορία του Ανθρώπου"', slug: 'sapiens-book', brand: 'Yuval Noah Harari', categoryIds: [84], description: 'Μια συναρπαστική αφήγηση της ανθρώπινης ιστορίας.', image: '//placehold.co/400x400?text=Sapiens', rating: 4.8, reviews: 850,
    specifications: { 'Author': 'Yuval Noah Harari' }, prices: [{ vendorId: 5, price: 17.50, inStock: true }], lowestPrice: 17.50, bestPriceVendorId: 5,
    giftAttributes: { recipient: ['men', 'women'], interest: ['books', 'reading', 'history', 'science'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['book', 'history', 'nonfiction'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 40, title: 'Monitor Dell UltraSharp U2723QE 27" 4K', slug: 'dell-ultrasharp-u2723qe', brand: 'Dell', categoryIds: [319], description: 'Επαγγελματική οθόνη 4K με IPS Black.', image: '//placehold.co/400x400?text=Dell+U2723QE', rating: 4.9, reviews: 95,
    specifications: { 'Resolution': '4K UHD', 'Panel': 'IPS Black', 'Size': '27 inch' }, prices: [{ vendorId: 2, price: 599.00, inStock: true }], lowestPrice: 599.00, bestPriceVendorId: 2,
    giftAttributes: { recipient: ['men', 'women'], interest: ['tech', 'computers', 'design', 'work'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['monitor', '4k', 'ips', 'professional'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 41, title: 'Κούπα Καφέ Εμαγιέ', slug: 'enamel-coffee-mug', brand: 'Generic', categoryIds: [26, 82], description: 'Ανθεκτική κούπα για καφέ, ιδανική για camping.', image: '//placehold.co/400x400?text=Enamel+Mug', rating: 4.4, reviews: 70,
    specifications: {}, prices: [{ vendorId: 1, price: 8.90, inStock: true }], lowestPrice: 8.90, bestPriceVendorId: 1,
    giftAttributes: { recipient: ['men', 'women'], interest: ['camping', 'outdoors', 'coffee', 'home'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['mug', 'camping', 'kitchen'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 42, title: 'Ανδρικό Μπουφάν The North Face', slug: 'north-face-jacket-men', brand: 'The North Face', categoryIds: [43], description: 'Αδιάβροχο και αντιανεμικό μπουφάν.', image: '//placehold.co/400x400?text=NorthFace+Jacket', rating: 4.7, reviews: 180,
    specifications: { 'Material': 'DryVent', 'Waterproof': true }, prices: [{ vendorId: 5, price: 149.90, discountPrice: 129.90, inStock: true }], lowestPrice: 129.90, bestPriceVendorId: 5,
    giftAttributes: { recipient: ['men', 'teens'], interest: ['fashion', 'outdoors', 'clothing'], genderTarget: 'male' }, images: [], videos: [], variants: [], tags: ['jacket', 'outdoor', 'men'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 43, title: 'Σετ Αποσκευών Σκληρές ABS (3 τμχ)', slug: 'hardcase-luggage-set', brand: ' Hauptstadtkoffer', categoryIds: [83], description: 'Ανθεκτικό σετ βαλιτσών με σκληρό κέλυφος.', image: '//placehold.co/400x400?text=Hardcase+Luggage', rating: 4.5, reviews: 105,
    specifications: { 'Material': 'ABS', 'Wheels': 4 }, prices: [{ vendorId: 3, price: 159.00, inStock: true }], lowestPrice: 159.00, bestPriceVendorId: 3,
    giftAttributes: { recipient: ['men', 'women'], interest: ['travel'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['luggage', 'travel', 'set'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 44, title: 'Ισοθερμικό Μπουκάλι Chilly\'s 500ml', slug: 'chillys-bottle-500ml', brand: 'Chilly\'s', categoryIds: [26, 86], description: 'Διατηρεί τα ροφήματα κρύα ή ζεστά.', image: '//placehold.co/400x400?text=Chillys+Bottle', rating: 4.9, reviews: 650,
    specifications: { 'Capacity': '500ml', 'Material': 'Stainless Steel' }, prices: [{ vendorId: 7, price: 24.90, inStock: true }], lowestPrice: 24.90, bestPriceVendorId: 7,
    giftAttributes: { recipient: ['men', 'women', 'teens', 'kids9-11'], interest: ['fitness', 'outdoors', 'travel', 'home', 'eco'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['bottle', 'thermos', 'eco'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 45, title: 'Lancome La Vie Est Belle EDP 75ml', slug: 'lancome-la-vie-est-belle', brand: 'Lancome', categoryIds: [54], description: 'Γλυκό και λουλουδάτο γυναικείο άρωμα.', image: '//placehold.co/400x400?text=LaVieEstBelle', rating: 4.8, reviews: 490,
    specifications: {}, prices: [{ vendorId: 1, price: 88.00, inStock: true }, { vendorId: 6, price: 85.50, discountPrice: 81.00, inStock: true }], lowestPrice: 81.00, bestPriceVendorId: 6,
    giftAttributes: { recipient: ['women'], interest: ['perfume', 'beauty', 'fashion'], occasion: ['birthday', 'mothersday', 'anniversary'], genderTarget: 'female' }, images: [], videos: [], variants: [], tags: ['fragrance', 'women'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 46, title: 'Εξωτερικός Σκληρός Δίσκος HDD 2TB USB 3.0', slug: 'external-hdd-2tb', brand: 'Seagate', categoryIds: [277], description: 'Μεγάλη χωρητικότητα για backup αρχείων.', image: '//placehold.co/400x400?text=External+HDD', rating: 4.6, reviews: 410,
    specifications: { 'Capacity': '2TB', 'Interface': 'USB 3.0' }, prices: [{ vendorId: 2, price: 64.90, inStock: true }], lowestPrice: 64.90, bestPriceVendorId: 2,
    giftAttributes: { recipient: ['men', 'women', 'teens'], interest: ['tech', 'computers'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['storage', 'hdd', 'backup'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 47, title: 'Σετ Μαρκαδόροι Sharpie Fine Point (24 χρώματα)', slug: 'sharpie-fine-point-set', brand: 'Sharpie', categoryIds: [33],
    description: 'Μαρκαδόροι ανεξίτηλοι με λεπτή μύτη.', image: '//placehold.co/400x400?text=Sharpie+Set', rating: 4.8, reviews: 310,
    specifications: {}, prices: [{ vendorId: 4, price: 19.90, inStock: true }], lowestPrice: 19.90, bestPriceVendorId: 4,
    giftAttributes: { recipient: ['teens', 'men', 'women', 'kids9-11'], interest: ['art', 'hobby', 'office', 'creative'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['markers', 'art', 'office'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 48, title: 'Κάμερα Οπισθοπορείας Αυτοκινήτου', slug: 'car-reverse-camera', brand: 'Generic', categoryIds: [98],
    description: 'Για εύκολο παρκάρισμα και ασφάλεια.', image: '//placehold.co/400x400?text=Reverse+Camera', rating: 4.3, reviews: 95,
    specifications: { 'Waterproof': 'IP68', 'Viewing Angle': '170°' }, prices: [{ vendorId: 3, price: 25.00, inStock: true }], lowestPrice: 25.00, bestPriceVendorId: 3,
    giftAttributes: { recipient: ['men'], interest: ['cars', 'gadgets', 'tech'], genderTarget: 'male' }, images: [], videos: [], variants: [], tags: ['car', 'camera', 'safety'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 49, title: 'Έξυπνη Πρίζα WiFi TP-Link Tapo P100', slug: 'tp-link-tapo-p100', brand: 'TP-Link', categoryIds: [21, 31],
    description: 'Ελέγξτε τις συσκευές σας απομακρυσμένα.', image: '//placehold.co/400x400?text=Tapo+Plug', rating: 4.7, reviews: 450,
    specifications: { 'Compatibility': 'Google Assistant, Alexa' }, prices: [{ vendorId: 7, price: 12.90, discountPrice: 9.90, inStock: true }], lowestPrice: 9.90, bestPriceVendorId: 7,
    giftAttributes: { recipient: ['men', 'women', 'teens'], interest: ['tech', 'smarthome', 'gadgets'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['smarthome', 'plug', 'wifi'], relatedProductIds: [], comparisonProductIds: []
  },
  {
    id: 50, title: 'Παιδικό Κάθισμα Αυτοκινήτου Isofix', slug: 'child-car-seat-isofix', brand: 'Chicco', categoryIds: [73, 98],
    description: 'Ασφαλές κάθισμα αυτοκινήτου για παιδιά.', image: '//placehold.co/400x400?text=Car+Seat', rating: 4.8, reviews: 170,
    specifications: { 'Group': '1/2/3', 'Isofix': true }, prices: [{ vendorId: 2, price: 149.00, inStock: true }], lowestPrice: 149.00, bestPriceVendorId: 2,
    giftAttributes: { recipient: ['babies', 'toddlers'], interest: ['safety', 'baby'], occasion: ['baby-shower'], genderTarget: 'unisex' }, images: [], videos: [], variants: [], tags: ['carseat', 'baby', 'safety'], relatedProductIds: [], comparisonProductIds: []
  },
];

// --- Helper Functions ---
export const fetchFeaturedProducts = () => { return products.filter(p => p.isFeatured).slice(0, 5); };
export const fetchDeals = () => { return products.filter(p => Array.isArray(p.prices) && p.prices.some(price => price.discountPrice)).slice(0, 5); }; // Added Array.isArray check
export const fetchNewArrivals = () => { return [...products].sort((a, b) => new Date(b.releaseDate || b.dateAdded || 0).getTime() - new Date(a.releaseDate || a.dateAdded || 0).getTime()).slice(0, 5); };
export const searchProducts = (query: string): Product[] => { if (!query) return []; const searchText = query.toLowerCase(); return products.filter(product => product.title.toLowerCase().includes(searchText) || product.brand?.toLowerCase().includes(searchText) || product.model?.toLowerCase().includes(searchText) || (Array.isArray(product.tags) && product.tags.some(tag => tag.toLowerCase().includes(searchText))) ); }; // Added Array.isArray check
export const getCategoryById = (id: number): Category | undefined => { const allCatsMap = new Map([...mainCategories, ...categories].map(c => [c.id, c])); return allCatsMap.get(id); };
export const getProductById = (id: number): Product | undefined => { return products.find(product => product.id === id); };
export const getProductsByCategory = (categoryId: number): Product[] => { return products.filter(product => Array.isArray(product.categoryIds) && product.categoryIds.includes(categoryId)); }; // Added Array.isArray check
export const getSimilarProducts = (productId: number): Product[] => { const product = getProductById(productId); if (!product || !Array.isArray(product.categoryIds) || product.categoryIds.length === 0) return []; const leafCategoryId = product.categoryIds[product.categoryIds.length - 1]; return products.filter(p => p.id !== productId && Array.isArray(p.categoryIds) && p.categoryIds.includes(leafCategoryId)).slice(0, 5); }; // Added Array.isArray check
export const getVendorById = (vendorId: number): Vendor | undefined => { const vendorMap = new Map(vendors.map(v => [v.id, v])); return vendorMap.get(vendorId); };
export const getBestPrice = (product: Product): ProductPrice | null => { if (!product || !Array.isArray(product.prices) || product.prices.length === 0) return null; const inStockPrices = product.prices.filter(price => price.inStock); if (inStockPrices.length === 0) { return null; } return inStockPrices.reduce((best, current) => (current.price < best.price) ? current : best, inStockPrices[0]); }; // Added Array.isArray check
export const getCategories = (): Category[] => { return categories; };
export const getBrands = (): Brand[] => { return brands; };
