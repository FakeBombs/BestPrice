// Category interface for nested structure
export interface Category {
  id: number;              
  name: string;           
  slug: string;           
  parentId?: number;      
  image: string;          
}

// Main categories
export const mainCategories: Category[] = [
  { id: 1, name: 'Τεχνολογία', slug: 'technology', image: '//placehold.co/200x150?text=Technology' },
  { id: 2, name: 'Σπίτι & Κήπος', slug: 'home-garden', image: '//placehold.co/200x150?text=Home+Garden' },
  { id: 3, name: 'Μόδα', slug: 'fashion', image: '//placehold.co/200x150?text=Fashion' },
  { id: 4, name: 'Υγεία & Ομορφιά', slug: 'health-beauty', image: '//placehold.co/200x150?text=Health+Beauty' },
  { id: 5, name: 'Παιδικά - Βρεφικά', slug: 'children-baby', image: '//placehold.co/200x150?text=Children+Baby' },
  { id: 6, name: 'Hobby, Αθλητισμός', slug: 'hobby-sports', image: '//placehold.co/200x150?text=Hobby+Sports' },
  { id: 7, name: 'Μηχανοκίνηση', slug: 'auto-moto', image: '//placehold.co/200x150?text=Auto+Moto' }
];

// Subcategories and nested categories
export const categories: Category[] = [
  // Subcategories under Technology
  { id: 10, name: 'Κινητά', slug: 'mobile-phones', parentId: 1, image: '//abpcdn.pstatic.gr/P/bpimg128/806_SX400Y400/1629455538/mobile-phones.webp' },
  { id: 11, name: 'Laptops', slug: 'laptops', parentId: 1, image: '//abpcdn.pstatic.gr/P/bpimg128/2591_SX400Y400/1629455496/laptops.webp' },
  { id: 20, name: 'Tablets', slug: 'tablets', parentId: 10, image: '//abpcdn.pstatic.gr/P/bpimg128/3446_SX400Y400/1629455501/tablets.webp' },
  { id: 21, name: 'Smartwatches', slug: 'smartwatches', parentId: 10, image: '//abpcdn.pstatic.gr/P/bpimg128/6280_SX400Y400/1629455522/smartwatches.webp' },

  // Subcategories under Home & Garden
  { id: 16, name: 'Ψυγεία', slug: 'refrigerators', parentId: 2, image: '//abpcdn.pstatic.gr/P/bpimg128/2485_SX400Y400/1629455496/psigeia.webp' },
  { id: 17, name: 'Πλυντήρια Ρούχων', slug: 'washing-machines', parentId: 2, image: '//abpcdn.pstatic.gr/P/bpimg128/2492_SX400Y400/1629455496/plyntiria-rouxwn.webp' },
  { id: 22, name: 'Kitchen Accessories', slug: 'kitchen-accessories', parentId: 17, image: '//placehold.co/200x150?text=Kitchen+Accessories' },
  { id: 23, name: 'Garden Tools', slug: 'garden-tools', parentId: 16, image: '//placehold.co/200x150?text=Garden+Tools' },

  // Subcategories under Fashion
  { id: 19, name: 'Gaming Consoles', slug: 'gaming-consoles', parentId: 3, image: '//placehold.co/200x200' },
  { id: 24, name: 'Cars and Accessories', slug: 'cars-accessories', parentId: 3, image: '//placehold.co/200x200' },
  { id: 25, name: 'Men’s Clothing', slug: 'mens-clothing', parentId: 3, image: '//placehold.co/200x200' },
  { id: 26, name: 'Women’s Clothing', slug: 'womens-clothing', parentId: 3, image: '//placehold.co/200x200' },

  // Subcategories under Health & Beauty
  { id: 27, name: 'Sport Equipment', slug: 'sport-equipment', parentId: 4, image: '//placehold.co/200x200' },
  { id: 28, name: 'Cosmetics', slug: 'cosmetics', parentId: 4, image: '//placehold.co/200x200' },
  
  // Subcategories under Children & Baby
  { id: 29, name: 'Baby Toys', slug: 'baby-toys', parentId: 5, image: '//placehold.co/200x200' },
  { id: 30, name: 'Clothing', slug: 'clothing', parentId: 5, image: '//placehold.co/200x200' },

  // Subcategories under Hobby & Sports
  { id: 31, name: 'Sportswear', slug: 'sportswear', parentId: 6, image: '//placehold.co/200x200' },
  { id: 32, name: 'Outdoor Gear', slug: 'outdoor-gear', parentId: 6, image: '//placehold.co/200x200' }
];

// Vendors
export interface Vendor {
  id: number; 
  name: string;
  logo: string;
  rating: number;
}

export const vendors: Vendor[] = [
  { id: 1, name: 'You', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/252.svg', rating: 4.5 },
  { id: 2, name: 'Plaisio', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/79.svg', rating: 4.2 },
  { id: 3, name: 'Public', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/743.svg', rating: 4.7 },
  { id: 4, name: 'Κωτσόβολος', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/496.svg', rating: 4.0 },
  { id: 5, name: 'Funky Buddha', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/4351.svg', rating: 4.3 },
  { id: 6, name: 'Germanos', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/8697.svg', rating: 4.1 },
  { id: 7, name: 'e-shop.gr', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/16.svg', rating: 3.2 },
  { id: 8, name: 'Χαμόγελο του Παιδιού', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/874.svg', rating: 4.7 }
];

// Product price from vendor
export interface ProductPrice {
  vendorId: number; 
  price: number;
  shippingCost: number;
  inStock: boolean;
}

// Product
export interface Product {
  id: number; 
  title: string;
  brand: string;
  model: string;
  categoryIds: number[];
  description: string;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  specifications: Record<string, string>;
  prices: ProductPrice[];
}

// Sample products (20 random products)
export const products: Product[] = [
  {
    id: 1,
    title: 'Apple iPhone 14 Pro Max 256GB',
    brand: 'Apple',
    model: 'iPhone 14 Pro Max',
    categoryIds: [10], 
    description: 'The latest iPhone with stunning design and performance.',
    image: '//bbpcdn.pstatic.gr/bpimg0/78TKg/1SYzV1_SX660/1728492731/apple-iphone-14-pro-max-256gb.webp',
    images: [
      '//bbpcdn.pstatic.gr/bpimg0/78TKg/1SYzV1_SX660/1728492731/apple-iphone-14-pro-max-256gb.webp',
      '//bbpcdn.pstatic.gr/P/bpimg129/66117/apple-iphone-14-pro-max-256gb.webp'
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
      { vendorId: 1, price: 1299.99, shippingCost: 0, inStock: true },
      { vendorId: 2, price: 1319.99, shippingCost: 5, inStock: true },
      { vendorId: 3, price: 1289.99, shippingCost: 7.99, inStock: true },
      { vendorId: 4, price: 1309.99, shippingCost: 0, inStock: false }
    ]
  },
  {
    id: 2,
    title: 'Samsung Galaxy S23 Ultra 512GB',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    categoryIds: [10],
    description: 'The ultimate Samsung phone with exceptional camera capabilities.',
    image: '//placehold.co/400x400?text=Galaxy+S23',
    images: [
      '//placehold.co/400x400?text=Galaxy+S23',
      '//placehold.co/400x400?text=Galaxy+S23+Side',
      '//placehold.co/400x400?text=Galaxy+S23+Back'
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
      { vendorId: 1, price: 1199.99, shippingCost: 0, inStock: true },
      { vendorId: 3, price: 1179.99, shippingCost: 7.99, inStock: true },
      { vendorId: 5, price: 1189.99, shippingCost: 5, inStock: true }
    ]
  },
  {
    id: 3,
    title: 'MacBook Pro 16-inch',
    brand: 'Apple',
    model: 'MacBook Pro',
    categoryIds: [11],
    description: 'High-performance laptop for professionals.',
    image: '//placehold.co/400x400?text=MacBook+Pro',
    images: ['//placehold.co/400x400?text=MacBook+Pro'],
    rating: 4.6,
    reviews: 200,
    specifications: {
      'Processor': 'Apple M1 Pro',
      'RAM': '16GB',
      'Storage': '512GB SSD',
      'Dimensions': '3.5 x 13.5 x 9.8 inches',
      'Weight': '4.7 pounds'
    },
    prices: [
      { vendorId: 1, price: 2499.99, shippingCost: 0, inStock: true },
      { vendorId: 2, price: 2399.99, shippingCost: 10, inStock: true }
    ]
  },
  {
    id: 4,
    title: 'Sony 55 Inch 4K UHD TV',
    brand: 'Sony',
    model: 'Bravia',
    categoryIds: [12],
    description: 'Stunning visuals and vibrant colors.',
    image: '//placehold.co/400x400?text=Sony+TV',
    images: ['//placehold.co/400x400?text=Sony+TV'],
    rating: 4.8,
    reviews: 150,
    specifications: {
      'Resolution': '4K UHD',
      'Screen Type': 'LED',
      'Smart TV': 'Yes',
      'Weight': '37.5 pounds'
    },
    prices: [
      { vendorId: 3, price: 899.99, shippingCost: 0, inStock: true },
      { vendorId: 4, price: 849.99, shippingCost: 20, inStock: true }
    ]
  },
  {
    id: 5,
    title: 'Dell XPS 13 Laptop',
    brand: 'Dell',
    model: 'XPS 13',
    categoryIds: [11],
    description: 'Ultra-thin laptop with stunning 4K display.',
    image: '//placehold.co/400x400?text=Dell+XPS+13',
    images: ['//placehold.co/400x400?text=Dell+XPS+13'],
    rating: 4.5,
    reviews: 180,
    specifications: {
      'Processor': 'Intel i7',
      'RAM': '16GB',
      'Storage': '1TB SSD',
      'Dimensions': '0.58 x 11.6 x 7.8 inches',
      'Weight': '2.7 pounds'
    },
    prices: [
      { vendorId: 2, price: 1299.99, shippingCost: 0, inStock: true },
      { vendorId: 6, price: 1249.99, shippingCost: 5, inStock: true }
    ]
  },
  {
    id: 6,
    title: 'Fitness Tracker Watch',
    brand: 'Fitbit',
    model: 'Versa 3',
    categoryIds: [20],
    description: 'Monitor your health and fitness activities.',
    image: '//placehold.co/400x400?text=Fitness+Tracker',
    images: ['//placehold.co/400x400?text=Fitness+Tracker'],
    rating: 4.4,
    reviews: 300,
    specifications: {
      'Battery Life': '6+ days',
      'Water Resistant': 'Yes',
      'Syncs to': 'Mobile App'
    },
    prices: [
      { vendorId: 2, price: 229.99, shippingCost: 0, inStock: true },
      { vendorId: 3, price: 199.99, shippingCost: 5, inStock: true }
    ]
  },
  {
    id: 7,
    title: 'Nike Running Shoes',
    brand: 'Nike',
    model: 'Air Zoom Pegasus',
    categoryIds: [22],
    description: 'Comfortable running shoes for all-day wear.',
    image: '//placehold.co/400x400?text=Nike+Shoes',
    images: ['//placehold.co/400x400?text=Nike+Shoes'],
    rating: 4.7,
    reviews: 350,
    specifications: {
      'Material': 'Synthetic',
      'Weight': '10.6 ounces',
      'Style': 'Running'
    },
    prices: [
      { vendorId: 1, price: 119.99, shippingCost: 0, inStock: true },
      { vendorId: 6, price: 109.99, shippingCost: 5, inStock: true }
    ]
  },
  {
    id: 8,
    title: 'PlayStation 5 Console',
    brand: 'Sony',
    model: 'PS5',
    categoryIds: [19],
    description: 'Next-gen gaming console with stunning graphics.',
    image: '//placehold.co/400x400?text=PS5',
    images: ['//placehold.co/400x400?text=PS5'],
    rating: 4.9,
    reviews: 500,
    specifications: {
      'Storage': '825GB SSD',
      'Resolution': 'Up to 120fps',
      'Includes': 'Controller and Cable'
    },
    prices: [
      { vendorId: 1, price: 499.99, shippingCost: 0, inStock: true },
      { vendorId: 2, price: 489.99, shippingCost: 10, inStock: true }
    ]
  },
  {
    id: 9,
    title: 'Wireless Headphones',
    brand: 'Bose',
    model: 'QuietComfort 35',
    categoryIds: [13],
    description: 'Noise-cancelling headphones for immersive sound.',
    image: '//placehold.co/400x400?text=Bose+Headphones',
    images: ['//placehold.co/400x400?text=Bose+Headphones'],
    rating: 4.8,
    reviews: 275,
    specifications: {
      'Battery Life': '20 hours',
      'Features': 'Bluetooth, Voice Assistant'
    },
    prices: [
      { vendorId: 3, price: 299.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 10,
    title: 'Artificial Intelligence for Beginners',
    brand: 'TechBooks',
    model: 'AI Basics',
    categoryIds: [11],
    description: 'An introductory book on artificial intelligence concepts.',
    image: '//placehold.co/400x400?text=AI+Book',
    images: ['//placehold.co/400x400?text=AI+Book'],
    rating: 4.5,
    reviews: 50,
    specifications: {
      'Pages': '400',
      'ISBN': '978-3-16-148410-0'
    },
    prices: [
      { vendorId: 5, price: 29.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 11,
    title: 'Camping Tent',
    brand: 'NatureHike',
    model: 'Camping Tent X1',
    categoryIds: [31],
    description: 'Spacious camping tent for outdoor adventures.',
    image: '//placehold.co/400x400?text=Camping+Tent',
    images: ['//placehold.co/400x400?text=Camping+Tent'],
    rating: 4.6,
    reviews: 100,
    specifications: {
      'Capacity': '4 Persons',
      'Material': 'Waterproof'
    },
    prices: [
      { vendorId: 6, price: 149.99, shippingCost: 0, inStock: true },
      { vendorId: 2, price: 139.99, shippingCost: 10, inStock: true }
    ]
  },
  {
    id: 12,
    title: 'Vegetable Planter Box',
    brand: 'Gardener\'s Supply',
    model: 'Planter Box to go',
    categoryIds: [23],
    description: 'Perfect for urban gardening!',
    image: '//placehold.co/400x400?text=Vegetable+Planter',
    images: ['//placehold.co/400x400?text=Vegetable+Planter'],
    rating: 4.7,
    reviews: 60,
    specifications: {
      'Material': 'Wood',
      'Dimensions': '40 x 20 x 15 inches'
    },
    prices: [
      { vendorId: 1, price: 79.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 13,
    title: 'Nonstick Cookware Set',
    brand: 'T-fal',
    model: 'Cookware Basic Set',
    categoryIds: [17],
    description: 'Durable cookware set for everyday cooking.',
    image: '//placehold.co/400x400?text=Cookware+Set',
    images: ['//placehold.co/400x400?text=Cookware+Set'],
    rating: 4.4,
    reviews: 150,
    specifications: {
      'Material': 'Nonstick',
      'Gauge': '304 Stainless Steel'
    },
    prices: [
      { vendorId: 6, price: 99.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 14,
    title: 'Fashion Backpack',
    brand: 'SwissGear',
    model: 'Travel Backpack',
    categoryIds: [25],
    description: 'Stylish and functional backpack for travel.',
    image: '//placehold.co/400x400?text=Backpack',
    images: ['//placehold.co/400x400?text=Backpack'],
    rating: 4.7,
    reviews: 120,
    specifications: {
      'Material': 'Polyester',
      'Dimensions': '17.5 x 12.5 x 7 inches'
    },
    prices: [
      { vendorId: 5, price: 59.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 15,
    title: 'Electric Kettle',
    brand: 'Hamilton Beach',
    model: 'Electric Kettle 1.7L',
    categoryIds: [16],
    description: 'Quick boiling kettle for hot beverages.',
    image: '//placehold.co/400x400?text=Electric+Kettle',
    images: ['//placehold.co/400x400?text=Electric+Kettle'],
    rating: 4.5,
    reviews: 90,
    specifications: {
      'Material': 'Stainless Steel',
      'Capacity': '1.7 Liters'
    },
    prices: [
      { vendorId: 2, price: 39.99, shippingCost: 0, inStock: true },
      { vendorId: 3, price: 34.99, shippingCost: 5, inStock: true }
    ]
  },
  {
    id: 16,
    title: 'Yoga Mat',
    brand: 'Liforme',
    model: 'Eco-Friendly',
    categoryIds: [22],
    description: 'Durable and non-slip yoga mat.',
    image: '//placehold.co/400x400?text=Yoga+Mat',
    images: ['//placehold.co/400x400?text=Yoga+Mat'],
    rating: 4.8,
    reviews: 200,
    specifications: {
      'Material': 'Natural Rubber',
      'Thickness': '5mm'
    },
    prices: [
      { vendorId: 1, price: 49.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 17,
    title: 'Pet Cat Tree',
    brand: 'PawHut',
    model: 'Pet Kitty Tower',
    categoryIds: [29],
    description: 'Fun play area for your cat.',
    image: '//placehold.co/400x400?text=Cat+Tree',
    images: ['//placehold.co/400x400?text=Cat+Tree'],
    rating: 4.6,
    reviews: 80,
    specifications: {
      'Material': 'Wood and Fabric',
      'Height': '4 feet'
    },
    prices: [
      { vendorId: 4, price: 79.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 18,
    title: 'Children’s Educational Tablet',
    brand: 'Amazon',
    model: 'Fire HD 10',
    categoryIds: [10],
    description: 'Kids-friendly tablet with educational content.',
    image: '//placehold.co/400x400?text=Kids+Tablet',
    images: ['//placehold.co/400x400?text=Kids+Tablet'],
    rating: 4.7,
    reviews: 300,
    specifications: {
      'Battery Life': '12 hours',
      'Size': '10.1 inch'
    },
    prices: [
      { vendorId: 1, price: 149.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 19,
    title: 'Smart TV Stick',
    brand: 'Amazon',
    model: 'Fire Stick 4K',
    categoryIds: [13],
    description: 'Stream all your favorites in 4K resolution.',
    image: '//placehold.co/400x400?text=Smart+TV+Stick',
    images: ['//placehold.co/400x400?text=Smart+TV+Stick'],
    rating: 4.9,
    reviews: 400,
    specifications: {
      'Supports': '4K Ultra HD, HDR',
      'Includes': 'Alexa Voice Remote'
    },
    prices: [
      { vendorId: 5, price: 49.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 20,
    title: 'Drone with Camera',
    brand: 'DJI',
    model: 'Mavic Air 2',
    categoryIds: [14],
    description: 'Capture stunning aerial footage.',
    image: '//placehold.co/400x400?text=Drone',
    images: ['//placehold.co/400x400?text=Drone'],
    rating: 4.8,
    reviews: 150,
    specifications: {
      'Camera': '48MP',
      'Flight Time': '34 minutes'
    },
    prices: [
      { vendorId: 2, price: 799.99, shippingCost: 0, inStock: true }
    ]
  }
];

// Brands
export interface Brand {
  id: number; 
  name: string;
  logo: string;
}

export const brands: Brand[] = [
  { id: 1, name: 'Apple', logo: '//orig-bpcdn.pstatic.gr/logs/brands/9.svg' },
  { id: 2, name: 'Samsung', logo: '//orig-bpcdn.pstatic.gr/logs/brands/26.svg' },
  { id: 3, name: 'Sony', logo: '//orig-bpcdn.pstatic.gr/logs/brands/5.svg' },
  { id: 4, name: 'LG', logo: '//orig-bpcdn.pstatic.gr/logs/brands/293.svg' },
  { id: 5, name: 'Canon', logo: '//orig-bpcdn.pstatic.gr/logs/brands/10.svg' },
  { id: 6, name: 'Nikon', logo: '//orig-bpcdn.pstatic.gr/logs/brands/281.svg' },
  { id: 7, name: 'Lenovo', logo: '//orig-bpcdn.pstatic.gr/logs/brands/728.svg' },
  { id: 8, name: 'Dell', logo: '//orig-bpcdn.pstatic.gr/logs/brands/292.svg' },
  { id: 9, name: 'HP', logo: '//orig-bpcdn.pstatic.gr/logs/brands/1.svg' },
  { id: 10, name: 'Asus', logo: '//orig-bpcdn.pstatic.gr/logs/brands/161.svg' },
  { id: 11, name: 'Acer', logo: '//orig-bpcdn.pstatic.gr/logs/brands/7.svg' },
  { id: 12, name: 'Microsoft', logo: '//orig-bpcdn.pstatic.gr/logs/brands/100.svg' }
];

// Helper functions to simulate API calls
export const fetchFeaturedProducts = () => {
  return products.slice(0, 5);
};

export const fetchDeals = () => {
  return products.slice(3, 8);
};

export const fetchNewArrivals = () => {
  return products.slice(5, 10);
};

export const searchProducts = (query: string) => {
  const searchText = query.toLowerCase();
  return products.filter(product => 
    product.title.toLowerCase().includes(searchText) ||
    product.brand.toLowerCase().includes(searchText)
  );
};

export const getCategoryById = (id: number) => {
  return categories.find(category => category.id === id);
};

export const getProductById = (id: number) => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (categoryId: number) => {
  return products.filter(product => product.categoryIds.includes(categoryId));
};

export const getSimilarProducts = (productId: string) => {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products
    .filter(p => p.categoryIds.includes(productId) && p.id !== productId)
    .slice(0, 5);
};

export const getVendorById = (vendorId: number) => {
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

// Fetch categories and brands
export const getCategories = () => {
  return categories;
};

export const getBrands = () => {
  return brands;
};
