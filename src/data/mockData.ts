
export interface Vendor {
  id: string;
  name: string;
  logo: string;
  rating: number;
}

export interface ProductPrice {
  vendorId: string;
  price: number;
  inStock: boolean;
  shippingCost: number;
}

export interface Product {
  id: string;
  title: string;
  image: string;
  category: string;
  description: string;
  prices: ProductPrice[];
  specifications: Record<string, string>;
  reviews: number;
  rating: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

// Mock vendors
export const vendors: Vendor[] = [
  {
    id: "v1",
    name: "TechStore",
    logo: "https://via.placeholder.com/50",
    rating: 4.5,
  },
  {
    id: "v2",
    name: "ElectroShop",
    logo: "https://via.placeholder.com/50",
    rating: 4.7,
  },
  {
    id: "v3",
    name: "GadgetGuru",
    logo: "https://via.placeholder.com/50",
    rating: 4.2,
  },
  {
    id: "v4",
    name: "BestBuy",
    logo: "https://via.placeholder.com/50",
    rating: 4.8,
  },
  {
    id: "v5",
    name: "TechWorld",
    logo: "https://via.placeholder.com/50",
    rating: 4.1,
  },
];

// Mock categories
export const categories: Category[] = [
  { id: "c1", name: "Smartphones", icon: "smartphone" },
  { id: "c2", name: "Laptops", icon: "laptop" },
  { id: "c3", name: "Tablets", icon: "tablet" },
  { id: "c4", name: "Headphones", icon: "headphones" },
  { id: "c5", name: "Cameras", icon: "camera" },
  { id: "c6", name: "Monitors", icon: "monitor" },
  { id: "c7", name: "Smart Home", icon: "home" },
  { id: "c8", name: "Gaming", icon: "gamepad" },
];

// Mock products
export const products: Product[] = [
  {
    id: "p1",
    title: "iPhone 14 Pro Max 256GB",
    image: "https://via.placeholder.com/300",
    category: "c1",
    description:
      "Apple's flagship smartphone featuring the A16 Bionic chip, 48MP main camera, and Dynamic Island.",
    prices: [
      { vendorId: "v1", price: 1299, inStock: true, shippingCost: 0 },
      { vendorId: "v2", price: 1329, inStock: true, shippingCost: 5 },
      { vendorId: "v4", price: 1289, inStock: true, shippingCost: 10 },
    ],
    specifications: {
      Screen: "6.7-inch Super Retina XDR",
      Processor: "A16 Bionic",
      RAM: "6GB",
      Storage: "256GB",
      Camera: "48MP + 12MP + 12MP",
      OS: "iOS 16",
    },
    reviews: 158,
    rating: 4.8,
  },
  {
    id: "p2",
    title: "Samsung Galaxy S23 Ultra 512GB",
    image: "https://via.placeholder.com/300",
    category: "c1",
    description:
      "Samsung's premium smartphone with S Pen support, 200MP main camera, and Snapdragon 8 Gen 2 processor.",
    prices: [
      { vendorId: "v1", price: 1249, inStock: true, shippingCost: 0 },
      { vendorId: "v3", price: 1219, inStock: true, shippingCost: 0 },
      { vendorId: "v5", price: 1229, inStock: false, shippingCost: 7 },
    ],
    specifications: {
      Screen: "6.8-inch Dynamic AMOLED 2X",
      Processor: "Snapdragon 8 Gen 2",
      RAM: "12GB",
      Storage: "512GB",
      Camera: "200MP + 12MP + 10MP + 10MP",
      OS: "Android 13",
    },
    reviews: 142,
    rating: 4.7,
  },
  {
    id: "p3",
    title: "MacBook Pro M2 14-inch",
    image: "https://via.placeholder.com/300",
    category: "c2",
    description:
      "The latest MacBook Pro featuring the powerful M2 chip, stunning display, and all-day battery life.",
    prices: [
      { vendorId: "v1", price: 1999, inStock: true, shippingCost: 0 },
      { vendorId: "v2", price: 1949, inStock: true, shippingCost: 0 },
      { vendorId: "v4", price: 1979, inStock: true, shippingCost: 15 },
    ],
    specifications: {
      Screen: "14.2-inch Liquid Retina XDR",
      Processor: "M2 Pro or M2 Max",
      RAM: "16GB",
      Storage: "512GB SSD",
      Battery: "Up to 18 hours",
      OS: "macOS Ventura",
    },
    reviews: 87,
    rating: 4.9,
  },
  {
    id: "p4",
    title: "Dell XPS 15",
    image: "https://via.placeholder.com/300",
    category: "c2",
    description:
      "Premium Windows laptop with InfinityEdge display, powerful Intel Core i7 processor, and NVIDIA graphics.",
    prices: [
      { vendorId: "v2", price: 1899, inStock: true, shippingCost: 0 },
      { vendorId: "v3", price: 1949, inStock: true, shippingCost: 5 },
      { vendorId: "v5", price: 1879, inStock: true, shippingCost: 0 },
    ],
    specifications: {
      Screen: "15.6-inch 4K UHD+",
      Processor: "Intel Core i7-12700H",
      RAM: "16GB",
      Storage: "1TB SSD",
      Graphics: "NVIDIA RTX 3050 Ti",
      OS: "Windows 11",
    },
    reviews: 64,
    rating: 4.6,
  },
  {
    id: "p5",
    title: "Sony WH-1000XM5",
    image: "https://via.placeholder.com/300",
    category: "c4",
    description:
      "Industry-leading noise canceling headphones with exceptional sound quality and long battery life.",
    prices: [
      { vendorId: "v1", price: 399, inStock: true, shippingCost: 0 },
      { vendorId: "v3", price: 389, inStock: true, shippingCost: 5 },
      { vendorId: "v4", price: 379, inStock: true, shippingCost: 7 },
    ],
    specifications: {
      Type: "Over-ear, Wireless",
      Battery: "Up to 30 hours",
      Connectivity: "Bluetooth 5.2, 3.5mm",
      "Noise Cancellation": "Adaptive",
      Charging: "USB-C",
    },
    reviews: 212,
    rating: 4.8,
  },
  {
    id: "p6",
    title: "iPad Pro 12.9-inch M2",
    image: "https://via.placeholder.com/300",
    category: "c3",
    description:
      "Apple's most advanced iPad featuring the M2 chip, Liquid Retina XDR display, and Apple Pencil support.",
    prices: [
      { vendorId: "v1", price: 1099, inStock: true, shippingCost: 0 },
      { vendorId: "v2", price: 1079, inStock: true, shippingCost: 0 },
      { vendorId: "v4", price: 1089, inStock: false, shippingCost: 10 },
    ],
    specifications: {
      Screen: "12.9-inch Liquid Retina XDR",
      Processor: "M2",
      RAM: "8GB",
      Storage: "256GB",
      Battery: "Up to 10 hours",
      OS: "iPadOS 16",
    },
    reviews: 76,
    rating: 4.7,
  },
];

// Function to get products by category
export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter((product) => product.category === categoryId);
};

// Function to get a product by ID
export const getProductById = (productId: string): Product | undefined => {
  return products.find((product) => product.id === productId);
};

// Function to get a vendor by ID
export const getVendorById = (vendorId: string): Vendor | undefined => {
  return vendors.find((vendor) => vendor.id === vendorId);
};

// Function to get the best price for a product
export const getBestPrice = (product: Product): ProductPrice | undefined => {
  if (!product.prices.length) return undefined;
  
  return product.prices.reduce((best, current) => {
    if (!current.inStock) return best;
    return current.price < best.price ? current : best;
  }, product.prices.find(p => p.inStock) || product.prices[0]);
};

// Function to search products
export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return products;
  
  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
  );
};
