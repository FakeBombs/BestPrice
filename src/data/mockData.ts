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
  { id: 1, name: '{t('technology')}', slug: 'technology', image: '//placehold.co/200x150?text=Technology' },
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

// SVG Data Interface
export interface SvgIcon {
  id: string;        // Unique identifier for the SVG
  title: string;     // Description or name of the SVG (optional)
  path: string;      // SVG path data or the entire SVG string
}

// SVGs for Deals categories
export const dealsSVG: SvgIcon[] = [
  {
    id: 'technology',
    title: 'Technology Icon',
    path: `<svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img"><path d="M17 2H7C6.44772 2 6 2.44772 6 3V21C6 21.5523 6.44772 22 7 22H17C17.5523 22 18 21.5523 18 21V3C18 2.44772 17.5523 2 17 2ZM12.5 4H14M10 4H10.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'home-garden',
    title: 'Home & Garden Icon',
    path: `<svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img"><path fill-rule="evenodd" d="M6 2H18L20 12H4L6 2Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 12V19.2543M16 12V16M5 20.5C5 19.9477 5.44772 19.5 6 19.5H18C18.5523 19.5 19 19.9477 19 20.5V22H5V20.5Z" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'fashion',
    title: 'Fashion Icon',
    path: `<svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img"><path d="M5.8777 7.5C5.93812 8.06394 5.97559 8.72578 5.97559 9.5V22H17.9756V9.5C17.9756 8.72578 18.0131 8.06394 18.0735 7.5M18.5 11.0626L22 10.0626L18.9756 4.5L14.9756 2H8.97559L4.97559 4.5L2 10.0626L5.5 11.0626" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.97559 2.25C8.97559 3.90685 10.3187 5.25 11.9756 5.25C13.6324 5.25 14.9756 3.90685 14.9756 2.25" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'health-beauty',
    title: 'Health & Beauty Icon',
    path: `<svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img"><path d="M6 4 8 18V21C8 21.5523 8.44772 22 9 22H15C15.5523 22 16 21.5523 16 21V18L18 4V2H6V4ZM8 18H15.75M6.5 4.5H11.5M14 4.5H15" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'kids-baby',
    title: 'Kids & Baby Icon',
    path: `<svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img">
              <path d="M12.5 15.75C12.5 18.7876 10.0376 21.25 7 21.25 3.96243 21.25 1.5 18.7876 1.5 15.75 1.5 12.7124 3.96243 10.25 7 10.25 10.0376 10.25 12.5 12.7124 12.5 15.75ZM22.5 17.75C22.5 19.683 20.933 21.25 19 21.25 17.067 21.25 15.5 19.683 15.5 17.75 15.5 15.817 17.067 14.25 19 14.25 20.933 14.25 22.5 15.817 22.5 17.75Z" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 15.75L8.72147 5.4212C8.8822 4.45683 9.71658 3.75 10.6943 3.75H13.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.5 7.25C8.5 7.25 19.0288 8.87521 19.0288 17.7441" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`
  },
  {
    id: 'sports-hobbies',
    title: 'Sports & Hobbies Icon',
    path: `<svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12.015 20.9723C11.1004 16.0277 13.8957 12.3469 10.5431 9.51942C8.07443 7.43744 5.42553 8.4672 3.05798 12.1731" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`
  },
  {
    id: 'auto-moto',
    title: 'Auto & Moto Icon',
    path: `<svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img">
              <path d="M18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12Z" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 12C16 14.2091 14.2091 16 12 16 9.79086 16 8 14.2091 8 12 8 9.79086 9.79086 8 12 8 14.2091 8 16 9.79086 16 12ZM6.49663 3.64925 7.84375 3.8125M6.49663 3.64925C7.92433 2.70646 9.60802 2.11998 11.421 2.01648M6.49663 3.64925C5.04056 4.61077 3.85076 5.94291 3.0616 7.51129M11.421 2.01648C11.6126 2.00554 11.8057 2 12 2 13.6147 2 15.1401 2.38271 16.4903 3.06238M11.421 2.01648 12.5 2.83594M16.4903 3.06238 17.0156 4.3125M16.4903 3.06238C18.0599 3.85252 19.3929 5.044 20.3543 6.50207M20.3543 6.50207 20.1875 7.84766M20.3543 6.50207C21.2953 7.92896 21.8804 9.61115 21.9836 11.4224M21.9836 11.4224C21.9945 11.6135 22 11.8061 22 12 22 13.6141 21.6176 15.1389 20.9384 16.4887M21.9836 11.4224 21.168 12.5M20.9384 16.4887 19.6953 17.0117M20.9384 16.4887C20.1484 18.0587 18.957 19.392 17.4989 20.3537M17.4989 20.3537 16.1562 20.1914M17.4989 20.3537C16.0739 21.2936 14.3942 21.8787 12.5856 21.9831M12.5856 21.9831C12.3919 21.9943 12.1966 22 12 22 10.3871 22 8.86346 21.6182 7.51442 20.94M12.5856 21.9831 11.5039 21.1641M7.51442 20.94 6.98828 19.6875M7.51442 20.94C5.94598 20.1515 4.61361 18.9624 3.65162 17.507M3.65162 17.507 3.81641 16.1484M3.65162 17.507C2.70796 16.0793 2.12071 14.3954 2.01665 12.582M2.01665 12.582C2.0056 12.3894 2 12.1953 2 12 2 10.3859 2.38242 8.8611 3.0616 7.51129M2.01665 12.582 2.83594 11.5039M3.0616 7.51129 4.3125 6.98828" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`
  }
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
