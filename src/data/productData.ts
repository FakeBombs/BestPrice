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
