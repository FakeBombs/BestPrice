
export interface Vendor {
  id: string;
  name: string;
  logo: string;
  url: string;
  website?: string; // For backward compatibility
  certification?: string;
  address: string[];
  telephone: string[];
  paymentMethods: string[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  parentId?: number | null;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  website?: string;
}

export interface ProductPrice {
  id?: string;
  product_id?: string;
  vendorId: string;
  price: number;
  shippingCost?: number;
  inStock: boolean;
  // Add backward compatibility for the old property names
  vendor_id?: string;
  shipping_cost?: number;
  in_stock?: boolean;
}

export interface Product {
  id: string;
  categoryId?: number;
  categoryIds?: number[];
  category?: string;
  name: string;
  title?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  image_url?: string; // For backwards compatibility
  images?: string[];
  brand?: string;
  model?: string;
  sku?: string;
  price: number;
  rating: number;
  reviewCount?: number;
  reviews?: number;
  specs?: Record<string, string>;
  specifications?: Record<string, string>;
  slug?: string;
  highlights?: string[];
  prices?: ProductPrice[];
  categories?: string[]; // For backwards compatibility
}

// Mock data for vendors
export const vendors: Vendor[] = [
  {
    id: "1",
    name: "TechStore",
    logo: "/images/vendors/techstore.png",
    url: "https://techstore.example.com",
    certification: "Trusted Seller",
    address: ["123 Tech Street", "Tech City, TC 12345"],
    telephone: ["+1 555-123-4567"],
    paymentMethods: ["Visa", "MasterCard", "PayPal"]
  },
  {
    id: "2",
    name: "ElectronicsHub",
    logo: "/images/vendors/electronicshub.png",
    url: "https://electronicshub.example.com",
    address: ["456 Hub Avenue", "Hub City, HC 67890"],
    telephone: ["+1 555-987-6543"],
    paymentMethods: ["Visa", "MasterCard", "American Express"]
  },
  {
    id: "3",
    name: "GadgetZone",
    logo: "/images/vendors/gadgetzone.png",
    url: "https://gadgetzone.example.com",
    certification: "Premium Partner",
    address: ["789 Gadget Road", "Gadget Town, GT 13579"],
    telephone: ["+1 555-246-8101"],
    paymentMethods: ["Visa", "PayPal", "Bitcoin"]
  }
];

// Mock data for brands
export const brands: Brand[] = [
  {
    id: "1",
    name: "Apple",
    logo: "/images/brands/apple.png",
    website: "https://apple.com"
  },
  {
    id: "2",
    name: "Samsung",
    logo: "/images/brands/samsung.png",
    website: "https://samsung.com"
  },
  {
    id: "3",
    name: "Sony",
    logo: "/images/brands/sony.png",
    website: "https://sony.com"
  }
];

// Mock data for categories
export const mainCategories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    image: "/dist/images/cat/consumer-electronics.webp"
  },
  {
    id: 2,
    name: "Computers",
    slug: "computers",
    image: "/dist/images/cat/computers.webp"
  },
  {
    id: 3,
    name: "Mobile Phones",
    slug: "mobile-phones",
    image: "/dist/images/cat/mobile.webp"
  },
  {
    id: 4,
    name: "Home Appliances",
    slug: "home-appliances",
    image: "/dist/images/cat/home-appliances.webp"
  }
];

export const categories: Category[] = [
  ...mainCategories,
  {
    id: 5,
    name: "Laptops",
    slug: "laptops",
    parentId: 2,
    image: "/dist/images/cat/laptops.webp"
  },
  {
    id: 6,
    name: "Smartphones",
    slug: "smartphones",
    parentId: 3,
    image: "/dist/images/cat/mobiles.webp"
  },
  {
    id: 7,
    name: "Tablets",
    slug: "tablets",
    parentId: 2,
    image: "/dist/images/cat/tablets.webp"
  },
  {
    id: 8,
    name: "Monitors",
    slug: "monitors",
    parentId: 2,
    image: "/dist/images/cat/computer-monitors.webp"
  },
  {
    id: 9,
    name: "Refrigerators",
    slug: "refrigerators",
    parentId: 4,
    image: "/dist/images/cat/home-appliances.webp"
  }
];

// Mock data for products
export const products: Product[] = [
  {
    id: "1",
    categoryId: 5,
    name: "MacBook Pro",
    title: "Apple MacBook Pro 16-inch (2023)",
    description: "The most powerful MacBook Pro ever.",
    image: "/images/products/macbook-pro.jpg",
    brand: "Apple",
    model: "MBP16-2023",
    price: 2499.99,
    rating: 4.8,
    reviewCount: 245,
    slug: "apple-macbook-pro-16-inch",
    highlights: [
      "M2 Pro or M2 Max chip",
      "Up to 96GB unified memory",
      "Up to 8TB storage"
    ],
    prices: [
      {
        id: "price1",
        vendorId: "1",
        price: 2499.99,
        inStock: true
      },
      {
        id: "price2",
        vendorId: "2",
        price: 2549.99,
        shippingCost: 0,
        inStock: true
      }
    ]
  },
  {
    id: "2",
    categoryId: 6,
    name: "iPhone 15 Pro",
    title: "Apple iPhone 15 Pro (256GB)",
    description: "The ultimate iPhone experience.",
    image: "/images/products/iphone-15-pro.jpg",
    brand: "Apple",
    model: "iPhone15Pro-256",
    price: 1199.99,
    rating: 4.7,
    reviewCount: 387,
    slug: "apple-iphone-15-pro",
    prices: [
      {
        id: "price3",
        vendorId: "1",
        price: 1199.99,
        inStock: true
      },
      {
        id: "price4",
        vendorId: "3",
        price: 1189.99,
        shippingCost: 10.00,
        inStock: true
      }
    ]
  },
  {
    id: "3",
    categoryId: 7,
    name: "iPad Pro",
    title: "Apple iPad Pro 12.9-inch (2023)",
    description: "Supercharged by the Apple M2 chip.",
    image: "/images/products/ipad-pro.jpg",
    brand: "Apple",
    model: "iPadPro-129-M2",
    price: 1099.99,
    rating: 4.9,
    reviewCount: 156,
    slug: "apple-ipad-pro-129",
    prices: [
      {
        id: "price5",
        vendorId: "1",
        price: 1099.99,
        inStock: true
      },
      {
        id: "price6",
        vendorId: "2",
        price: 1129.99,
        shippingCost: 0,
        inStock: false
      }
    ]
  },
  {
    id: "4",
    categoryId: 6,
    name: "Samsung Galaxy S23 Ultra",
    title: "Samsung Galaxy S23 Ultra (512GB)",
    description: "The ultimate Galaxy experience with built-in S Pen.",
    image: "/images/products/galaxy-s23-ultra.jpg",
    brand: "Samsung",
    model: "SM-S918B",
    price: 1399.99,
    rating: 4.6,
    reviewCount: 289,
    slug: "samsung-galaxy-s23-ultra",
    prices: [
      {
        id: "price7",
        vendorId: "2",
        price: 1399.99,
        inStock: true
      },
      {
        id: "price8",
        vendorId: "3",
        price: 1379.99,
        shippingCost: 15.00,
        inStock: true
      }
    ]
  },
  {
    id: "5",
    categoryId: 8,
    name: "LG UltraGear",
    title: "LG UltraGear 27-inch QHD Gaming Monitor",
    description: "1ms response time gaming monitor with G-Sync compatibility.",
    image: "/images/products/lg-ultragear.jpg",
    brand: "LG",
    model: "27GN800-B",
    price: 399.99,
    rating: 4.5,
    reviewCount: 178,
    slug: "lg-ultragear-27-inch-monitor",
    prices: [
      {
        id: "price9",
        vendorId: "1",
        price: 399.99,
        inStock: true
      },
      {
        id: "price10",
        vendorId: "2",
        price: 419.99,
        shippingCost: 0,
        inStock: true
      }
    ]
  }
];

// Helper functions
export const formatSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const getProductsByCategory = (categoryId: number | string): Product[] => {
  const id = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId;
  return products.filter(p => p.categoryId === id);
};

export const fetchProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductsByBrand = (brandId: string): Product[] => {
  const brand = brands.find(b => b.id === brandId);
  if (!brand) return [];
  return products.filter(p => p.brand === brand.name);
};

export const fetchFeaturedProducts = (limit = 4): Product[] => {
  return [...products].sort(() => 0.5 - Math.random()).slice(0, limit);
};

export const fetchDeals = (limit = 4): Product[] => {
  return [...products].sort(() => 0.5 - Math.random()).slice(0, limit);
};

export const fetchNewArrivals = (limit = 4): Product[] => {
  return [...products].sort(() => 0.5 - Math.random()).slice(0, limit);
};

// Mock data
export const mockData = {
  products,
  categories,
  vendors,
  brands
};
