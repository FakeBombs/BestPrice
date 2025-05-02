export interface Product {
  id: number;
  categoryId: number;
  categoryIds?: number[];
  category?: string;
  name: string;
  title?: string;
  description?: string;
  image: string;
  imageUrl?: string;
  images?: string[];
  brand?: string;
  model?: string;
  price: number;
  rating: number;
  reviewCount?: number;
  reviews?: number;
  specs?: Record<string, string>;
  slug?: string;
}

export interface Category {
  id: number;
  parentId?: number;
  name: string;
  description: string;
  imageUrl?: string;
  image?: string;
  slug?: string;
}

export interface Brand {
  id: number;
  name: string;
  logo: string;
}

export interface Vendor {
  id: number;
  name: string;
  url?: string;
  logo?: string;
  rating?: number;
}

export const brands: Brand[] = [
  { id: 1, name: 'Apple', logo: '/images/brands/apple.png' },
  { id: 2, name: 'Samsung', logo: '/images/brands/samsung.png' },
  { id: 3, name: 'Sony', logo: '/images/brands/sony.png' },
  { id: 4, name: 'LG', logo: '/images/brands/lg.png' },
  { id: 5, name: 'Microsoft', logo: '/images/brands/microsoft.png' },
];

export const vendors: Vendor[] = [
  { id: 1, name: 'Best Buy', url: 'https://www.bestbuy.com/', logo: '/images/vendors/bestbuy.png', rating: 4.5 },
  { id: 2, name: 'Amazon', url: 'https://www.amazon.com/', logo: '/images/vendors/amazon.png', rating: 4.2 },
  { id: 3, name: 'Walmart', url: 'https://www.walmart.com/', logo: '/images/vendors/walmart.png', rating: 3.9 },
];

export const mainCategories: Category[] = [
  { id: 1, name: 'Electronics', description: 'Explore the latest electronics.', imageUrl: '/dist/images/cat/electronics.webp' },
  { id: 2, name: 'Fashion', description: 'Stay trendy with our fashion collection.', imageUrl: '/dist/images/cat/fashion.webp' },
  { id: 3, name: 'Home & Garden', description: 'Create your dream home.', imageUrl: '/dist/images/cat/home-garden.webp' },
  { id: 4, name: 'Health & Beauty', description: 'Take care of your health and beauty.', imageUrl: '/dist/images/cat/health-beauty.webp' },
  { id: 5, name: 'Sports & Outdoors', description: 'Gear up for your next adventure.', imageUrl: '/dist/images/cat/sports.webp' },
];

export const categories: Category[] = [
  { id: 101, parentId: 1, name: 'Smartphones', description: 'The latest smartphones.', imageUrl: '/dist/images/cat/smartphones.webp' },
  { id: 102, parentId: 1, name: 'Laptops', description: 'Powerful laptops for every need.', imageUrl: '/dist/images/cat/laptops.webp' },
  { id: 103, parentId: 1, name: 'TVs', description: 'Experience stunning visuals.', imageUrl: '/dist/images/cat/tvs.webp' },
  { id: 201, parentId: 2, name: 'Men\'s Clothing', description: 'Stylish clothing for men.', imageUrl: '/dist/images/cat/men-clothing.webp' },
  { id: 202, parentId: 2, name: 'Women\'s Clothing', description: 'Trendy clothing for women.', imageUrl: '/dist/images/cat/women-clothing.webp' },
  { id: 301, parentId: 3, name: 'Furniture', description: 'Elegant furniture for your home.', imageUrl: '/dist/images/cat/furniture.webp' },
  { id: 302, parentId: 3, name: 'Gardening', description: 'Everything for your garden.', imageUrl: '/dist/images/cat/gardening.webp' },
  { id: 401, parentId: 4, name: 'Skincare', description: 'Take care of your skin.', imageUrl: '/dist/images/cat/skincare.webp' },
  { id: 402, parentId: 4, name: 'Makeup', description: 'Enhance your beauty.', imageUrl: '/dist/images/cat/makeup.webp' },
  { id: 501, parentId: 5, name: 'Fitness', description: 'Stay fit and active.', imageUrl: '/dist/images/cat/fitness.webp' },
  { id: 502, parentId: 5, name: 'Outdoor Gear', description: 'Essential gear for outdoor adventures.', imageUrl: '/dist/images/cat/outdoor-gear.webp' },
];

export const products: Product[] = [
  {
    id: 1,
    categoryId: 101,
    name: 'Smartphone X',
    title: 'The best smartphone on the market',
    description: 'A high-end smartphone with advanced features.',
    image: '/dist/images/products/smartphone.webp',
    images: ['/dist/images/products/smartphone.webp', '/dist/images/products/laptop.webp'],
    brand: 'TechCo',
    model: 'X500',
    price: 999,
    rating: 4.7,
    reviewCount: 120,
    specs: {
      display: '6.5-inch AMOLED',
      camera: '48MP',
      storage: '256GB',
      ram: '8GB',
    },
  },
  {
    id: 2,
    categoryId: 102,
    name: 'Laptop Pro',
    title: 'High-performance laptop for professionals',
    description: 'A powerful laptop for demanding tasks.',
    image: '/dist/images/products/laptop.webp',
    images: ['/dist/images/products/laptop.webp', '/dist/images/products/smartphone.webp'],
    brand: 'TechCo',
    model: 'Pro15',
    price: 1499,
    rating: 4.5,
    reviewCount: 95,
    specs: {
      cpu: 'Intel i7',
      ram: '16GB',
      storage: '512GB SSD',
      display: '15.6-inch',
    },
  },
  {
    id: 3,
    categoryId: 103,
    name: 'Smart TV 4K',
    title: 'Experience stunning visuals with our 4K Smart TV',
    description: 'A 55-inch 4K Smart TV with HDR support.',
    image: '/dist/images/products/tv.webp',
    images: ['/dist/images/products/tv.webp', '/dist/images/products/smartphone.webp'],
    brand: 'VisionTech',
    model: '4K55',
    price: 799,
    rating: 4.3,
    reviewCount: 70,
    specs: {
      size: '55-inch',
      resolution: '4K',
      hdr: 'HDR10',
      smart: 'Yes',
    },
  },
  {
    id: 4,
    categoryId: 201,
    name: 'Men\'s Casual Shirt',
    title: 'Comfortable and stylish casual shirt for men',
    description: 'A cotton casual shirt for everyday wear.',
    image: '/dist/images/products/men-shirt.webp',
    images: ['/dist/images/products/men-shirt.webp', '/dist/images/products/women-dress.webp'],
    brand: 'FashionStyle',
    model: 'CS100',
    price: 49,
    rating: 4.1,
    reviewCount: 55,
  },
  {
    id: 5,
    categoryId: 202,
    name: 'Women\'s Summer Dress',
    title: 'Elegant summer dress for women',
    description: 'A lightweight dress perfect for summer.',
    image: '/dist/images/products/women-dress.webp',
    images: ['/dist/images/products/women-dress.webp', '/dist/images/products/men-shirt.webp'],
    brand: 'FashionStyle',
    model: 'SD200',
    price: 79,
    rating: 4.4,
    reviewCount: 80,
  },
  {
    id: 6,
    categoryId: 301,
    name: 'Modern Sofa',
    title: 'Comfortable and stylish sofa for your living room',
    description: 'A three-seater sofa with a modern design.',
    image: '/dist/images/products/sofa.webp',
    images: ['/dist/images/products/sofa.webp', '/dist/images/products/table.webp'],
    brand: 'HomeComfort',
    model: 'SF300',
    price: 599,
    rating: 4.6,
    reviewCount: 105,
  },
  {
    id: 7,
    categoryId: 302,
    name: 'Outdoor Table',
    title: 'Durable outdoor table for your garden',
    description: 'A weather-resistant table for outdoor use.',
    image: '/dist/images/products/table.webp',
    images: ['/dist/images/products/table.webp', '/dist/images/products/sofa.webp'],
    brand: 'GardenLife',
    model: 'OT400',
    price: 199,
    rating: 4.2,
    reviewCount: 65,
  },
  {
    id: 8,
    categoryId: 401,
    name: 'Anti-Aging Serum',
    title: 'Effective serum for youthful skin',
    description: 'A serum that reduces wrinkles and fine lines.',
    image: '/dist/images/products/serum.webp',
    images: ['/dist/images/products/serum.webp', '/dist/images/products/lipstick.webp'],
    brand: 'BeautyCare',
    model: 'AS500',
    price: 39,
    rating: 4.8,
    reviewCount: 130,
  },
  {
    id: 9,
    categoryId: 402,
    name: 'Red Lipstick',
    title: 'Classic red lipstick for a bold look',
    description: 'A long-lasting lipstick with a matte finish.',
    image: '/dist/images/products/lipstick.webp',
    images: ['/dist/images/products/lipstick.webp', '/dist/images/products/serum.webp'],
    brand: 'Glamour',
    model: 'RL600',
    price: 29,
    rating: 4.5,
    reviewCount: 90,
  },
  {
    id: 10,
    categoryId: 501,
    name: 'Dumbbells Set',
    title: 'Adjustable dumbbells set for home workouts',
    description: 'A set of dumbbells for strength training.',
    image: '/dist/images/products/dumbbells.webp',
    images: ['/dist/images/products/dumbbells.webp', '/dist/images/products/tent.webp'],
    brand: 'FitGear',
    model: 'DB700',
    price: 149,
    rating: 4.6,
    reviewCount: 110,
  },
  {
    id: 11,
    categoryId: 502,
    name: 'Camping Tent',
    title: 'Spacious camping tent for outdoor adventures',
    description: 'A waterproof tent for camping trips.',
    image: '/dist/images/products/tent.webp',
    images: ['/dist/images/products/tent.webp', '/dist/images/products/dumbbells.webp'],
    brand: 'AdventureCo',
    model: 'CT800',
    price: 249,
    rating: 4.4,
    reviewCount: 75,
  },
  {
    id: 12,
    categoryId: 101,
    name: 'Smartphone Y',
    title: 'Mid-range smartphone with great battery life',
    description: 'A reliable smartphone for everyday use.',
    image: '/dist/images/products/smartphone.webp',
    images: ['/dist/images/products/smartphone.webp'],
    brand: 'MobileTech',
    model: 'Y200',
    price: 599,
    rating: 4.2,
    reviewCount: 60,
  },
  {
    id: 13,
    categoryId: 102,
    name: 'Laptop Air',
    title: 'Lightweight and portable laptop for students',
    description: 'A compact laptop for on-the-go productivity.',
    image: '/dist/images/products/laptop.webp',
    images: ['/dist/images/products/laptop.webp'],
    brand: 'TechLite',
    model: 'Air13',
    price: 899,
    rating: 4.0,
    reviewCount: 45,
  },
  {
    id: 14,
    categoryId: 103,
    name: 'Smart TV HD',
    title: 'Affordable HD Smart TV for your home',
    description: 'A 32-inch HD Smart TV with built-in apps.',
    image: '/dist/images/products/tv.webp',
    images: ['/dist/images/products/tv.webp'],
    brand: 'VisionTech',
    model: 'HD32',
    price: 399,
    rating: 3.8,
    reviewCount: 30,
  },
  {
    id: 15,
    categoryId: 201,
    name: 'Men\'s Formal Suit',
    title: 'Elegant formal suit for men',
    description: 'A classic suit for special occasions.',
    image: '/dist/images/products/men-shirt.webp',
    images: ['/dist/images/products/men-shirt.webp'],
    brand: 'FashionStyle',
    model: 'FS300',
    price: 249,
    rating: 4.3,
    reviewCount: 70,
  },
  {
    id: 16,
    categoryId: 202,
    name: 'Women\'s Evening Gown',
    title: 'Stunning evening gown for women',
    description: 'A luxurious gown for formal events.',
    image: '/dist/images/products/women-dress.webp',
    images: ['/dist/images/products/women-dress.webp'],
    brand: 'Glamour',
    model: 'EG400',
    price: 349,
    rating: 4.6,
    reviewCount: 100,
  },
  {
    id: 17,
    categoryId: 301,
    name: 'Dining Table Set',
    title: 'Stylish dining table set for your home',
    description: 'A complete dining set with four chairs.',
    image: '/dist/images/products/table.webp',
    images: ['/dist/images/products/table.webp'],
    brand: 'HomeComfort',
    model: 'DT500',
    price: 449,
    rating: 4.1,
    reviewCount: 50,
  },
  {
    id: 18,
    categoryId: 302,
    name: 'BBQ Grill',
    title: 'Portable BBQ grill for outdoor cooking',
    description: 'A convenient grill for picnics and camping.',
    image: '/dist/images/products/table.webp',
    images: ['/dist/images/products/table.webp'],
    brand: 'GardenLife',
    model: 'BBQ600',
    price: 99,
    rating: 4.0,
    reviewCount: 40,
  },
  {
    id: 19,
    categoryId: 401,
    name: 'Vitamin C Serum',
    title: 'Brightening serum with Vitamin C',
    description: 'A serum that improves skin tone and texture.',
    image: '/dist/images/products/serum.webp',
    images: ['/dist/images/products/serum.webp'],
    brand: 'BeautyCare',
    model: 'VC700',
    price: 49,
    rating: 4.7,
    reviewCount: 115,
  },
  {
    id: 20,
    categoryId: 402,
    name: 'Nude Eyeshadow Palette',
    title: 'Versatile nude eyeshadow palette',
    description: 'A collection of neutral shades for any look.',
    image: '/dist/images/products/lipstick.webp',
    images: ['/dist/images/products/lipstick.webp'],
    brand: 'Glamour',
    model: 'EP800',
    price: 34,
    rating: 4.4,
    reviewCount: 85,
  },
  {
    id: 21,
    categoryId: 501,
    name: 'Yoga Mat',
    title: 'Non-slip yoga mat for comfortable workouts',
    description: 'A durable mat for yoga and exercise.',
    image: '/dist/images/products/dumbbells.webp',
    images: ['/dist/images/products/dumbbells.webp'],
    brand: 'FitGear',
    model: 'YM900',
    price: 29,
    rating: 4.2,
    reviewCount: 65,
  },
  {
    id: 22,
    categoryId: 502,
    name: 'Hiking Backpack',
    title: 'Lightweight hiking backpack for outdoor adventures',
    description: 'A comfortable backpack for hiking and trekking.',
    image: '/dist/images/products/tent.webp',
    images: ['/dist/images/products/tent.webp'],
    brand: 'AdventureCo',
    model: 'HB1000',
    price: 79,
    rating: 4.5,
    reviewCount: 95,
  },
];

// Add or update these helper functions to ensure consistent types
export const formatSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

// Ensure the mockData.brands exists for the brandService
if (!brands) {
  brands = [
    { id: 1, name: 'Apple', logo: '/images/brands/apple.png' },
    { id: 2, name: 'Samsung', logo: '/images/brands/samsung.png' },
    { id: 3, name: 'Sony', logo: '/images/brands/sony.png' },
    { id: 4, name: 'LG', logo: '/images/brands/lg.png' },
    { id: 5, name: 'Microsoft', logo: '/images/brands/microsoft.png' },
  ];
}

// Ensure the mockData.vendors exists for the vendorService
if (!vendors) {
  vendors = [
    { id: 1, name: 'Vendor 1', url: 'https://vendor1.com', logo: '/images/vendors/vendor1.png', rating: 4.5 },
    { id: 2, name: 'Vendor 2', url: 'https://vendor2.com', logo: '/images/vendors/vendor2.png', rating: 4.2 },
    { id: 3, name: 'Vendor 3', url: 'https://vendor3.com', logo: '/images/vendors/vendor3.png', rating: 3.9 },
  ];
}

// Update the products to ensure they have consistent types with the Product interface in productService
products = products.map(product => {
  return {
    ...product,
    id: product.id,
    reviewCount: product.reviewCount || 0,
    specs: product.specs || {},
    // Ensure all required fields from Product interface exist
    slug: product.slug || formatSlug(product.name),
    rating: product.rating || 0,
    price: product.price || 0
  };
});

// Add a searchProducts function that returns Product[] from productService
export const searchProducts = (query: string) => {
  return products.filter(
    product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase()) ||
      product.brand?.toLowerCase().includes(query.toLowerCase())
  );
};

export const fetchFeaturedProducts = async () => {
  return products.slice(0, 7);
};

export const fetchDeals = async () => {
  return products.slice(3, 10);
};

export const fetchNewArrivals = async () => {
  return products.slice(5, 12);
};

export const getProductsByBrand = (brandId: string) => {
  return products.filter(product => product.brand === 'Apple');
};

export const getCategoryById = (categoryId: string) => {
  const categoryFromMain = mainCategories.find(cat => cat.id === Number(categoryId));
  const categoryFromCategories = categories.find(cat => cat.id === Number(categoryId));
  return categoryFromMain || categoryFromCategories || null;
};

export const getProductsByCategory = (categoryId: string) => {
  return products.filter(product => product.categoryId === Number(categoryId));
};

export const fetchProductById = async (productId: string) => {
  return products.find(product => product.id === Number(productId));
};

export const fetchVendorById = async (vendorId: string) => {
  return vendors.find(vendor => vendor.id === Number(vendorId));
};

export const fetchTopCategories = async () => {
  return mainCategories.slice(0, 5);
};

export const fetchAllCategories = async () => {
  return mainCategories.concat(categories);
};

export const fetchCategoryById = async (categoryId: string) => {
  const categoryFromMain = mainCategories.find(cat => cat.id === Number(categoryId));
  const categoryFromCategories = categories.find(cat => cat.id === Number(categoryId));
  return categoryFromMain || categoryFromCategories || null;
};

export const fetchProductsByCategoryId = async (categoryId: string) => {
  return products.filter(product => product.categoryId === Number(categoryId));
};

export const fetchBrands = async () => {
  return brands;
};

export const fetchVendors = async () => {
  return vendors;
};

export const fetchCategoryPath = async (categoryId: string) => {
  const category = await fetchCategoryById(categoryId);
  if (!category) return [];

  const path = [category];
  let parentId = category.parentId;

  while (parentId) {
    const parentCategory = await fetchCategoryById(String(parentId));
    if (!parentCategory) break;
    path.unshift(parentCategory);
    parentId = parentCategory.parentId;
  }

  return path;
};

export const fetchProductsByQuery = async (query: string) => {
  return products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description?.toLowerCase().includes(query.toLowerCase()) ||
    product.brand?.toLowerCase().includes(query.toLowerCase())
  );
};
