import { useTranslation } from '@/hooks/useTranslation';

// Category interface for nested structure
export interface Category {
  id: number;              // Numeric ID for URL
  name: string;           // Category name
  slug: string;           // URL slug
  parentId?: number;      // Optional parent ID for nesting
  image: string;          // Category image
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
  { id: 12, name: 'Tablets', slug: 'tablets', parentId: 1, image: '//abpcdn.pstatic.gr/P/bpimg128/3446_SX400Y400/1629455501/tablets.webp' },
  { id: 13, name: 'Headphones', slug: 'headphones', parentId: 1, image: '//abpcdn.pstatic.gr/P/bpimg128/8068_SX400Y400/1629455538/headphones.webp' },
  { id: 14, name: 'Cameras', slug: 'cameras', parentId: 1, image: '//abpcdn.pstatic.gr/P/bpimg128/3013_SX400Y400/1472043991/psifiakes-videokameres.webp' },
  { id: 15, name: 'Monitors', slug: 'monitors', parentId: 1, image: '//abpcdn.pstatic.gr/P/bpimg128/2621_SX400Y400/1473673319/othones-ypologiston.webp' },

  // Subcategories under Home & Garden
  { id: 16, name: 'Ψυγεία', slug: 'refrigerators', parentId: 2, image: '//abpcdn.pstatic.gr/P/bpimg128/2485_SX400Y400/1629455496/psigeia.webp' },
  { id: 17, name: 'Πλυντήρια Ρούχων', slug: 'washing-machines', parentId: 2, image: '//abpcdn.pstatic.gr/P/bpimg128/2492_SX400Y400/1629455496/plyntiria-rouxwn.webp' },
  { id: 18, name: 'Κουζίνες', slug: 'kitchen-appliances', parentId: 2, image: '//abpcdn.pstatic.gr/P/bpimg128/2488_SX400Y400/1629455496/kouzines.webp' },

  // Subcategories under Fashion
  { id: 19, name: 'Gaming Consoles', slug: 'gaming-consoles', parentId: 3, image: '//placehold.co/200x200' },
  { id: 20, name: 'Παιχνίδια', slug: 'games', parentId: 3, image: '//placehold.co/200x200' },
  { id: 21, name: 'Αξεσουάρ Gaming', slug: 'gaming-accessories', parentId: 3, image: '//placehold.co/200x200' },

  // Subcategories under Health & Beauty
  { id: 22, name: 'Sport Equipment', slug: 'sport-equipment', parentId: 4, image: '//placehold.co/200x200' },
  { id: 23, name: 'Sports Shoes', slug: 'sports-shoes', parentId: 4, image: '//placehold.co/200x200' },

  // Subcategories under Children & Baby
  { id: 24, name: 'Men’s Clothing', slug: 'mens-clothing', parentId: 5, image: '//placehold.co/200x200' },
  { id: 25, name: 'Women’s Clothing', slug: 'womens-clothing', parentId: 5, image: '//placehold.co/200x200' },

  // Additional subcategories
  { id: 26, name: 'Smartwatches', slug: 'smartwatches', parentId: 1, image: '//abpcdn.pstatic.gr/P/bpimg128/6280_SX400Y400/1629455522/smartwatches.webp' }
];

// Vendors
export interface Vendor {
  id: number; // Numeric ID for URL
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
  vendorId: number; // Changed to numeric ID for URL
  price: number;
  shippingCost: number;
  inStock: boolean;
}

// Product
export interface Product {
  id: number; // Numeric ID
  title: string;
  brand: string;
  model: string;
  categoryIds: number[]; // Array of category IDs
  description: string;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  specifications: Record<string, string>;
  prices: ProductPrice[];
}

// Sample products
export const products: Product[] = [
  {
    id: 1,
    title: 'Apple iPhone 14 Pro Max 256GB',
    brand: 'Apple',
    model: 'iPhone 14 Pro Max',
    categoryIds: [10], // Associated categories
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
    categoryIds: [10], // Associates with "Mobile Phones"
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
  // Additional products go here
];

// Brands
export interface Brand {
  id: number; // Numeric ID
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

// Removed getRootCategories function since rootCategories are no longer used

export const getBrands = () => {
  return brands;
};
