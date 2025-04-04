
// Mock data for the BestPrice application

// Root Categories with icons
export interface RootCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export const rootCategories: RootCategory[] = [
  {
    id: 'rc1',
    name: 'Τεχνολογία',
    slug: 'technology',
    description: 'Smartphones, υπολογιστές, tablets και άλλες ηλεκτρονικές συσκευές',
    icon: 'smartphone'
  },
  {
    id: 'rc2',
    name: 'Σπίτι & Κήπος',
    slug: 'home-garden',
    description: 'Έπιπλα, εργαλεία, είδη σπιτιού και άλλες οικιακές συσκευές',
    icon: 'home-garden'
  },
  {
    id: 'rc3',
    name: 'Μόδα',
    slug: 'fashion',
    description: 'Ρούχα, παπούτσια, ρολόγια και αξεσουάρ',
    icon: 'fashion'
  },
  {
    id: 'rc4',
    name: 'Οικιακές Συσκευές',
    slug: 'home-appliances',
    description: 'Ψυγεία, πλυντήρια, συσκευές κουζίνας και άλλες οικιακές συσκευές',
    icon: 'home'
  },
  {
    id: 'rc5',
    name: 'Οικιακές Συσκευές',
    slug: 'home-appliances',
    description: 'Ψυγεία, πλυντήρια, συσκευές κουζίνας και άλλες οικιακές συσκευές',
    icon: 'home'
  },
  {
    id: 'rc6',
    name: 'Gaming',
    slug: 'gaming',
    description: 'Κονσόλες, παιχνίδια, αξεσουάρ gaming και περιφερειακά',
    icon: 'gamepad'
  },
  {
    id: 'rc7',
    name: 'Αθλητικά',
    slug: 'sports',
    description: 'Αθλητικά είδη, εξοπλισμός fitness και ρούχα',
    icon: 'dumbbell'
  },
  {
    id: 'rc8',
    name: 'Ένδυση',
    slug: 'clothing',
    description: 'Ρούχα, παπούτσια, ρολόγια και αξεσουάρ',
    icon: 'shirt'
  }
];

// Subcategories
export interface Category {
  id: string;
  name: string;
  rootCategoryId: string;
  icon: string;
}

export const categories: Category[] = [
  { id: 'mobile', name: 'Κινητή Τηλεφωνία', rootCategoryId: 'rc1', icon: 'smartphone' },
  { id: 'ypologistes', name: 'Υπολογιστές', rootCategoryId: 'rc2', icon: 'pc' },
  { id: 'laptops-accessories', name: 'Laptops, Αξεσουάρ', rootCategoryId: 'rc3', icon: 'laptop' },
  { id: 'eikona', name: 'Εικόνα', rootCategoryId: 'rc4', icon: 'Picture' },
  { id: 'c5', name: 'Cameras', rootCategoryId: 'rc5', icon: 'camera' },
  { id: 'c6', name: 'Monitors', rootCategoryId: 'rc6', icon: 'monitor' },
  { id: 'c7', name: 'Ψυγεία', rootCategoryId: 'rc7', icon: 'home' },
  { id: 'c8', name: 'Πλυντήρια', rootCategoryId: 'rc8', icon: 'home' },
  { id: 'c9', name: 'Κουζίνες', rootCategoryId: 'rc9', icon: 'home' },
  { id: 'c10', name: 'Κονσόλες', rootCategoryId: 'rc10', icon: 'gamepad' },
  { id: 'c11', name: 'Παιχνίδια', rootCategoryId: 'rc11', icon: 'gamepad' },
  { id: 'c12', name: 'Αξεσουάρ Gaming', rootCategoryId: 'rc12', icon: 'gamepad' },
  { id: 'c13', name: 'Όργανα Γυμναστικής', rootCategoryId: 'rc13', icon: 'dumbbell' },
  { id: 'c14', name: 'Αθλητικά Παπούτσια', rootCategoryId: 'rc14', icon: 'dumbbell' },
  { id: 'c15', name: 'Ανδρικά Ρούχα', rootCategoryId: 'rc15', icon: 'shirt' },
  { id: 'c16', name: 'Γυναικεία Ρούχα', rootCategoryId: 'rc16', icon: 'shirt' }
];

// Vendors
export interface Vendor {
  id: string;
  name: string;
  logo: string;
  rating: number;
}

export const vendors: Vendor[] = [
  { 
    id: 'v1', 
    name: 'TechStore',
    logo: 'https://placehold.co/100x100?text=TechStore',
    rating: 4.5
  },
  { 
    id: 'v2', 
    name: 'ElectroWorld',
    logo: 'https://placehold.co/100x100?text=ElectroWorld',
    rating: 4.2
  },
  { 
    id: 'v3', 
    name: 'MegaShop',
    logo: 'https://placehold.co/100x100?text=MegaShop',
    rating: 4.7
  },
  { 
    id: 'v4', 
    name: 'BestBuy',
    logo: 'https://placehold.co/100x100?text=BestBuy',
    rating: 4.0
  },
  { 
    id: 'v5', 
    name: 'GlobalElectronics',
    logo: 'https://placehold.co/100x100?text=GlobalElectronics',
    rating: 4.3
  }
];

// Product price from vendor
export interface ProductPrice {
  vendorId: string;
  price: number;
  shippingCost: number;
  inStock: boolean;
}

// Product
export interface Product {
  id: string;
  title: string;
  brand: string;
  model: string;
  category: string;
  description: string;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  specifications: Record<string, string>;
  prices: ProductPrice[];
}

// Generate a bunch of products
const products: Product[] = [
  {
    id: 'p1',
    title: 'Apple iPhone 14 Pro Max 256GB',
    brand: 'Apple',
    model: 'iPhone 14 Pro Max',
    category: 'Smartphones',
    description: 'The latest iPhone with a stunning design and powerful performance.',
    image: 'https://placehold.co/400x400?text=iPhone+14',
    images: [
      'https://placehold.co/400x400?text=iPhone+14',
      'https://placehold.co/400x400?text=iPhone+14+Side',
      'https://placehold.co/400x400?text=iPhone+14+Back',
    ],
    rating: 4.8,
    reviews: 245,
    specifications: {
      'Display': '6.7 inch Super Retina XDR',
      'Processor': 'A16 Bionic',
      'RAM': '6GB',
      'Storage': '256GB',
      'Camera': '48MP + 12MP + 12MP',
      'OS': 'iOS 16',
      'Battery': '4323 mAh',
      'Dimensions': '160.7 x 77.6 x 7.85 mm',
      'Weight': '240g'
    },
    prices: [
      { vendorId: 'v1', price: 1299.99, shippingCost: 0, inStock: true },
      { vendorId: 'v2', price: 1319.99, shippingCost: 5, inStock: true },
      { vendorId: 'v3', price: 1289.99, shippingCost: 7.99, inStock: true },
      { vendorId: 'v4', price: 1309.99, shippingCost: 0, inStock: false }
    ]
  },
  {
    id: 'p2',
    title: 'Samsung Galaxy S23 Ultra 512GB',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    category: 'Smartphones',
    description: 'The ultimate Samsung phone with exceptional camera capabilities.',
    image: 'https://placehold.co/400x400?text=Galaxy+S23',
    images: [
      'https://placehold.co/400x400?text=Galaxy+S23',
      'https://placehold.co/400x400?text=Galaxy+S23+Side',
      'https://placehold.co/400x400?text=Galaxy+S23+Back',
    ],
    rating: 4.7,
    reviews: 189,
    specifications: {
      'Display': '6.8 inch Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 2',
      'RAM': '12GB',
      'Storage': '512GB',
      'Camera': '200MP + 12MP + 10MP + 10MP',
      'OS': 'Android 13',
      'Battery': '5000 mAh',
      'Dimensions': '163.4 x 78.1 x 8.9 mm',
      'Weight': '233g'
    },
    prices: [
      { vendorId: 'v1', price: 1199.99, shippingCost: 0, inStock: true },
      { vendorId: 'v3', price: 1179.99, shippingCost: 7.99, inStock: true },
      { vendorId: 'v5', price: 1189.99, shippingCost: 5, inStock: true }
    ]
  },
  {
    id: 'p3',
    title: 'MacBook Pro 14" M2 Pro',
    brand: 'Apple',
    model: 'MacBook Pro',
    category: 'laptops-accessories',
    categoryName: 'Laptops, Αξεσουάρ',
    description: 'Powerful MacBook Pro with the latest M2 Pro chip.',
    image: 'https://placehold.co/400x400?text=MacBook+Pro',
    images: [
      'https://placehold.co/400x400?text=MacBook+Pro',
      'https://placehold.co/400x400?text=MacBook+Pro+Side',
      'https://placehold.co/400x400?text=MacBook+Pro+Open',
    ],
    rating: 4.9,
    reviews: 156,
    specifications: {
      'Display': '14.2 inch Liquid Retina XDR',
      'Processor': 'M2 Pro',
      'RAM': '16GB',
      'Storage': '512GB SSD',
      'Graphics': 'Integrated 16-core GPU',
      'OS': 'macOS Ventura',
      'Battery': 'Up to 18 hours',
      'Weight': '1.6kg'
    },
    prices: [
      { vendorId: 'v1', price: 1999.99, shippingCost: 0, inStock: true },
      { vendorId: 'v2', price: 2019.99, shippingCost: 0, inStock: true },
      { vendorId: 'v4', price: 1989.99, shippingCost: 9.99, inStock: false }
    ]
  },
  {
    id: 'p4',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    brand: 'Sony',
    model: 'WH-1000XM5',
    category: 'Headphones',
    description: 'Industry-leading noise cancellation with exceptional sound quality.',
    image: 'https://placehold.co/400x400?text=Sony+WH1000XM5',
    images: [
      'https://placehold.co/400x400?text=Sony+WH1000XM5',
      'https://placehold.co/400x400?text=Sony+WH1000XM5+Side',
      'https://placehold.co/400x400?text=Sony+WH1000XM5+Case',
    ],
    rating: 4.8,
    reviews: 324,
    specifications: {
      'Type': 'Over-ear, Wireless',
      'Noise Cancellation': 'Active Noise Cancellation',
      'Battery Life': 'Up to 30 hours',
      'Connectivity': 'Bluetooth 5.2, 3.5mm audio cable',
      'Weight': '250g',
      'Charging': 'USB-C',
      'Controls': 'Touch, Voice Assistant'
    },
    prices: [
      { vendorId: 'v1', price: 379.99, shippingCost: 0, inStock: true },
      { vendorId: 'v2', price: 369.99, shippingCost: 5, inStock: true },
      { vendorId: 'v3', price: 389.99, shippingCost: 0, inStock: true },
      { vendorId: 'v5', price: 359.99, shippingCost: 7.99, inStock: true }
    ]
  },
  {
    id: 'p5',
    title: 'iPad Pro 12.9" M2 256GB',
    brand: 'Apple',
    model: 'iPad Pro',
    category: 'Tablets',
    description: 'The most powerful iPad yet with the M2 chip.',
    image: 'https://placehold.co/400x400?text=iPad+Pro',
    images: [
      'https://placehold.co/400x400?text=iPad+Pro',
      'https://placehold.co/400x400?text=iPad+Pro+Side',
      'https://placehold.co/400x400?text=iPad+Pro+Angle',
    ],
    rating: 4.7,
    reviews: 112,
    specifications: {
      'Display': '12.9 inch Liquid Retina XDR',
      'Processor': 'M2',
      'RAM': '8GB',
      'Storage': '256GB',
      'Camera': '12MP Wide + 10MP Ultra Wide',
      'OS': 'iPadOS 16',
      'Battery': 'Up to 10 hours',
      'Weight': '682g'
    },
    prices: [
      { vendorId: 'v1', price: 1199.99, shippingCost: 0, inStock: true },
      { vendorId: 'v3', price: 1189.99, shippingCost: 7.99, inStock: true },
      { vendorId: 'v4', price: 1209.99, shippingCost: 0, inStock: false }
    ]
  },
  {
    id: 'p6',
    title: 'Samsung QLED 4K Q80B 65"',
    brand: 'Samsung',
    model: 'Q80B',
    category: 'TVs',
    description: 'A premium QLED 4K TV with excellent picture quality and smart features.',
    image: 'https://placehold.co/400x400?text=Samsung+TV',
    images: [
      'https://placehold.co/400x400?text=Samsung+TV',
      'https://placehold.co/400x400?text=Samsung+TV+Side',
      'https://placehold.co/400x400?text=Samsung+TV+Back',
    ],
    rating: 4.6,
    reviews: 78,
    specifications: {
      'Screen Size': '65 inches',
      'Resolution': '4K UHD (3840 x 2160)',
      'Display Technology': 'QLED',
      'HDR': 'Quantum HDR',
      'Refresh Rate': '120Hz',
      'Smart Platform': 'Tizen',
      'Connectivity': 'Wi-Fi, Bluetooth, 4 HDMI, 2 USB',
      'Audio': '2.2.2 channel, 60W'
    },
    prices: [
      { vendorId: 'v2', price: 1499.99, shippingCost: 0, inStock: true },
      { vendorId: 'v3', price: 1479.99, shippingCost: 29.99, inStock: true },
      { vendorId: 'v5', price: 1489.99, shippingCost: 25, inStock: true }
    ]
  },
  {
    id: 'p7',
    title: 'Canon EOS R6 Mark II',
    brand: 'Canon',
    model: 'EOS R6 Mark II',
    category: 'Cameras',
    description: 'A professional mirrorless camera with exceptional performance.',
    image: 'https://placehold.co/400x400?text=Canon+EOS+R6',
    images: [
      'https://placehold.co/400x400?text=Canon+EOS+R6',
      'https://placehold.co/400x400?text=Canon+EOS+R6+Top',
      'https://placehold.co/400x400?text=Canon+EOS+R6+Back',
    ],
    rating: 4.8,
    reviews: 56,
    specifications: {
      'Sensor': '24.2MP Full-Frame CMOS',
      'Processor': 'DIGIC X',
      'Autofocus': 'Dual Pixel CMOS AF II',
      'ISO Range': '100-102400 (expandable to 204800)',
      'Video': '4K 60p, 1080p 120p',
      'Image Stabilization': '5-axis IBIS, up to 8 stops',
      'Viewfinder': 'OLED EVF, 3.69M dots',
      'Storage': 'Dual UHS-II SD card slots'
    },
    prices: [
      { vendorId: 'v1', price: 2499.99, shippingCost: 0, inStock: true },
      { vendorId: 'v4', price: 2479.99, shippingCost: 9.99, inStock: true },
      { vendorId: 'v5', price: 2489.99, shippingCost: 0, inStock: false }
    ]
  },
  {
    id: 'p8',
    title: 'PlayStation 5 Digital Edition',
    brand: 'Sony',
    model: 'PlayStation 5 Digital',
    category: 'Gaming Consoles',
    description: 'The next-generation gaming console from Sony (Digital Edition).',
    image: 'https://placehold.co/400x400?text=PS5+Digital',
    images: [
      'https://placehold.co/400x400?text=PS5+Digital',
      'https://placehold.co/400x400?text=PS5+Digital+Side',
      'https://placehold.co/400x400?text=PS5+Digital+Front',
    ],
    rating: 4.9,
    reviews: 234,
    specifications: {
      'CPU': '8-core AMD Zen 2',
      'GPU': 'AMD RDNA 2, 10.3 TFLOPS',
      'Storage': '825GB SSD',
      'RAM': '16GB GDDR6',
      'Resolution': 'Up to 8K',
      'Frame Rate': 'Up to 120fps',
      'Optical Drive': 'None (Digital Edition)',
      'Connectivity': 'Wi-Fi 6, Bluetooth 5.1, USB 3.2'
    },
    prices: [
      { vendorId: 'v1', price: 399.99, shippingCost: 0, inStock: false },
      { vendorId: 'v3', price: 409.99, shippingCost: 7.99, inStock: true },
      { vendorId: 'v4', price: 399.99, shippingCost: 9.99, inStock: false }
    ]
  },
  {
    id: 'p9',
    title: 'Apple Watch Series 8 GPS 45mm',
    brand: 'Apple',
    model: 'Watch Series 8',
    category: 'Smartwatches',
    description: 'Advanced health features in a stylish and durable design.',
    image: 'https://placehold.co/400x400?text=Apple+Watch',
    images: [
      'https://placehold.co/400x400?text=Apple+Watch',
      'https://placehold.co/400x400?text=Apple+Watch+Side',
      'https://placehold.co/400x400?text=Apple+Watch+Back',
    ],
    rating: 4.7,
    reviews: 167,
    specifications: {
      'Display': '45mm Retina LTPO OLED',
      'Processor': 'S8 SiP',
      'Storage': '32GB',
      'Water Resistance': '50 meters',
      'Battery': 'Up to 18 hours',
      'Sensors': 'Heart rate, ECG, Blood Oxygen, Temperature',
      'Connectivity': 'Wi-Fi, Bluetooth 5.0, GPS',
      'OS': 'watchOS 9'
    },
    prices: [
      { vendorId: 'v1', price: 429.99, shippingCost: 0, inStock: true },
      { vendorId: 'v2', price: 439.99, shippingCost: 5, inStock: true },
      { vendorId: 'v5', price: 419.99, shippingCost: 7.99, inStock: true }
    ]
  },
  {
    id: 'p10',
    title: 'LG C2 OLED 55" 4K TV',
    brand: 'LG',
    model: 'C2 OLED',
    category: 'TVs',
    description: 'Outstanding OLED TV with exceptional picture quality and perfect blacks.',
    image: 'https://placehold.co/400x400?text=LG+C2+OLED',
    images: [
      'https://placehold.co/400x400?text=LG+C2+OLED',
      'https://placehold.co/400x400?text=LG+C2+OLED+Side',
      'https://placehold.co/400x400?text=LG+C2+OLED+Back',
    ],
    rating: 4.9,
    reviews: 204,
    specifications: {
      'Screen Size': '55 inches',
      'Resolution': '4K UHD (3840 x 2160)',
      'Display Technology': 'OLED',
      'Processor': 'α9 Gen 5 AI Processor 4K',
      'HDR': 'Dolby Vision, HDR10, HLG',
      'Refresh Rate': '120Hz',
      'Smart Platform': 'webOS 22',
      'Connectivity': 'Wi-Fi, Bluetooth, 4 HDMI 2.1, 3 USB'
    },
    prices: [
      { vendorId: 'v2', price: 1699.99, shippingCost: 0, inStock: true },
      { vendorId: 'v3', price: 1679.99, shippingCost: 29.99, inStock: true },
      { vendorId: 'v4', price: 1689.99, shippingCost: 0, inStock: false }
    ]
  }
];

// More products - these could be generated programmatically for a real app
const moreProducts = [
  // ... more products would go here
];

// Combine all products
const allProducts = [...products, ...moreProducts];

// Helper functions to simulate API calls
export const fetchFeaturedProducts = () => {
  return products.slice(0, 5);
};

export const fetchDeals = () => {
  // In a real app, this would filter products with actual deals
  return products.slice(3, 8);
};

export const fetchNewArrivals = () => {
  return products.slice(5, 10);
};

export const searchProducts = (query: string) => {
  const searchText = query.toLowerCase();
  return products.filter(product => 
    product.title.toLowerCase().includes(searchText) || 
    product.brand.toLowerCase().includes(searchText) || 
    product.category.toLowerCase().includes(searchText)
  );
};

export const getProductById = (id: string) => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (categoryId: string) => {
  const category = categories.find(c => c.id === categoryId);
  if (!category) return [];
  
  return products.filter(product => product.category === category.name);
};

export const getProductsByRootCategory = (rootCategoryId: string) => {
  const categoryIds = categories
    .filter(c => c.rootCategoryId === rootCategoryId)
    .map(c => c.id);
  
  let result: Product[] = [];
  
  categoryIds.forEach(catId => {
    result = [...result, ...getProductsByCategory(catId)];
  });
  
  return result;
};

export const getSimilarProducts = (productId: string) => {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products
    .filter(p => p.category === product.category && p.id !== productId)
    .slice(0, 5);
};

export const getVendorById = (vendorId: string) => {
  return vendors.find(vendor => vendor.id === vendorId);
};

export const getBestPrice = (product: Product) => {
  if (!product.prices.length) return null;
  
  const inStockPrices = product.prices.filter(price => price.inStock);
  if (!inStockPrices.length) return product.prices[0];
  
  return inStockPrices.reduce((best, current) => 
    (current.price < best.price) ? current : best
  , inStockPrices[0]);
};

export const getCategories = () => {
  return categories;
};

export const getRootCategories = () => {
  return rootCategories;
};

export const getCategoryById = (categoryId: string) => {
  return categories.find(category => category.id === categoryId);
};

export const getRootCategoryById = (rootCategoryId: string) => {
  return rootCategories.find(rootCategory => rootCategory.id === rootCategoryId);
};

export const getRootCategoryBySlug = (slug: string) => {
  return rootCategories.find(rootCategory => rootCategory.slug === slug);
};

export const getCategoriesByRootCategory = (rootCategoryId: string) => {
  return categories.filter(category => category.rootCategoryId === rootCategoryId);
};
