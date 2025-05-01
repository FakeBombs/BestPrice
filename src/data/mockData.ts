// Export the mock data for use throughout the application
export const mockData = {
  mainCategories: [
    {
      id: 1,
      name: "Electronics",
      description: "Explore the latest gadgets and electronic devices.",
      imageUrl: "/dist/images/categories/electronics.jpg",
      slug: "electronics",
      image: "/dist/images/categories/electronics.jpg"
    },
    {
      id: 2,
      name: "Clothing & Apparel",
      description: "Discover trendy clothing and apparel for all occasions.",
      imageUrl: "/dist/images/categories/clothing.jpg",
      slug: "clothing-apparel",
      image: "/dist/images/categories/clothing.jpg"
    },
    {
      id: 3,
      name: "Home & Garden",
      description: "Find everything you need for your home and garden.",
      imageUrl: "/dist/images/categories/home-garden.jpg",
      slug: "home-garden",
      image: "/dist/images/categories/home-garden.jpg"
    },
    {
      id: 4,
      name: "Books & Media",
      description: "Explore a wide range of books, movies, and music.",
      imageUrl: "/dist/images/categories/books-media.jpg",
      slug: "books-media",
      image: "/dist/images/categories/books-media.jpg"
    },
    {
      id: 5,
      name: "Sports & Outdoors",
      description: "Gear up for your favorite sports and outdoor activities.",
      imageUrl: "/dist/images/categories/sports-outdoors.jpg",
      slug: "sports-outdoors",
      image: "/dist/images/categories/sports-outdoors.jpg"
    }
  ],
  categories: [
    {
      id: 101,
      parentId: 1,
      name: "Smartphones",
      description: "The latest smartphones with advanced features.",
      imageUrl: "/dist/images/subcategories/smartphones.jpg",
      slug: "smartphones",
      image: "/dist/images/subcategories/smartphones.jpg"
    },
    {
      id: 102,
      parentId: 1,
      name: "Laptops",
      description: "High-performance laptops for work and play.",
      imageUrl: "/dist/images/subcategories/laptops.jpg",
      slug: "laptops",
      image: "/dist/images/subcategories/laptops.jpg"
    },
    {
      id: 103,
      parentId: 1,
      name: "Headphones",
      description: "Premium headphones for an immersive audio experience.",
      imageUrl: "/dist/images/subcategories/headphones.jpg",
      slug: "headphones",
      image: "/dist/images/subcategories/headphones.jpg"
    },
    {
      id: 201,
      parentId: 2,
      name: "Men's Fashion",
      description: "Stylish clothing for men.",
      imageUrl: "/dist/images/subcategories/mens-fashion.jpg",
      slug: "mens-fashion",
      image: "/dist/images/subcategories/mens-fashion.jpg"
    },
    {
      id: 202,
      parentId: 2,
      name: "Women's Fashion",
      description: "Trendy clothing for women.",
      imageUrl: "/dist/images/subcategories/womens-fashion.jpg",
      slug: "womens-fashion",
      image: "/dist/images/subcategories/womens-fashion.jpg"
    },
    {
      id: 301,
      parentId: 3,
      name: "Furniture",
      description: "Comfortable and stylish furniture for your home.",
      imageUrl: "/dist/images/subcategories/furniture.jpg",
      slug: "furniture",
      image: "/dist/images/subcategories/furniture.jpg"
    },
    {
      id: 302,
      parentId: 3,
      name: "Gardening Tools",
      description: "Essential tools for maintaining your garden.",
      imageUrl: "/dist/images/subcategories/gardening-tools.jpg",
      slug: "gardening-tools",
      image: "/dist/images/subcategories/gardening-tools.jpg"
    },
    {
      id: 401,
      parentId: 4,
      name: "Fiction Books",
      description: "Engaging fiction books for all ages.",
      imageUrl: "/dist/images/subcategories/fiction-books.jpg",
      slug: "fiction-books",
      image: "/dist/images/subcategories/fiction-books.jpg"
    },
    {
      id: 402,
      parentId: 4,
      name: "Movies",
      description: "A wide selection of movies for entertainment.",
      imageUrl: "/dist/images/subcategories/movies.jpg",
      slug: "movies",
      image: "/dist/images/subcategories/movies.jpg"
    },
    {
      id: 501,
      parentId: 5,
      name: "Running Shoes",
      description: "High-quality running shoes for athletes.",
      imageUrl: "/dist/images/subcategories/running-shoes.jpg",
      slug: "running-shoes",
      image: "/dist/images/subcategories/running-shoes.jpg"
    },
     {
        id: 104,
        parentId: 1,
        name: "Smartwatches",
        description: "Stay connected with these smartwatches.",
        imageUrl: "/dist/images/subcategories/smartwatches.jpg",
        slug: "smartwatches",
        image: "/dist/images/subcategories/smartwatches.jpg"
      },
      {
        id: 203,
        parentId: 2,
        name: "Kids' Clothing",
        description: "Fashionable clothing for kids.",
        imageUrl: "/dist/images/subcategories/kids-clothing.jpg",
        slug: "kids-clothing",
        image: "/dist/images/subcategories/kids-clothing.jpg"
      },
      {
        id: 303,
        parentId: 3,
        name: "Home Decor",
        description: "Stylish decorations to enhance your home.",
        imageUrl: "/dist/images/subcategories/home-decor.jpg",
        slug: "home-decor",
        image: "/dist/images/subcategories/home-decor.jpg"
      },
      {
        id: 403,
        parentId: 4,
        name: "Music",
        description: "Explore various genres of music.",
        imageUrl: "/dist/images/subcategories/music.jpg",
        slug: "music",
        image: "/dist/images/subcategories/music.jpg"
      },
      {
        id: 502,
        parentId: 5,
        name: "Camping Gear",
        description: "Essential gear for camping and hiking.",
        imageUrl: "/dist/images/subcategories/camping-gear.jpg",
        slug: "camping-gear",
        image: "/dist/images/subcategories/camping-gear.jpg"
      }
  ],
  products: [
    {
      id: 1,
      categoryId: 101,
      categoryIds: [101],
      name: "Awesome SmartPhone",
      title: "Awesome SmartPhone",
      description: "A high-end smartphone with advanced features.",
      price: 799.99,
      imageUrl: "/dist/images/products/smartphone1.jpg",
      image: "/dist/images/products/smartphone1.jpg",
      rating: 4.5,
      reviewCount: 120,
      reviews: 120,
      brand: "TechMaster",
      sku: "TM-SP-001",
      slug: "awesome-smartphone",
      images: [
        "/dist/images/products/smartphone1.jpg",
        "/dist/images/products/smartphone2.jpg",
        "/dist/images/products/smartphone3.jpg"
      ],
      highlights: [
        "6.7-inch AMOLED Display",
        "128GB Internal Storage",
        "48MP Camera",
        "5G Connectivity"
      ]
    },
    {
      id: 2,
      categoryId: 102,
      name: "Incredible Laptop",
      description: "A powerful laptop for professionals and gamers.",
      price: 1299.99,
      imageUrl: "/dist/images/products/laptop1.jpg",
      image: "/dist/images/products/laptop1.jpg",
      rating: 4.8,
      reviewCount: 210,
      reviews: 210,
      brand: "PowerTech",
      sku: "PT-LP-002",
      slug: "incredible-laptop",
      images: [
        "/dist/images/products/laptop1.jpg",
        "/dist/images/products/laptop2.jpg",
        "/dist/images/products/laptop3.jpg"
      ],
      highlights: [
        "15.6-inch 4K Display",
        "16GB RAM",
        "512GB SSD",
        "NVIDIA GeForce RTX 3070"
      ]
    },
    {
      id: 3,
      categoryId: 103,
      name: "Amazing Headphones",
      description: "Noise-canceling headphones for an immersive experience.",
      price: 249.99,
      imageUrl: "/dist/images/products/headphones1.jpg",
      image: "/dist/images/products/headphones1.jpg",
      rating: 4.6,
      reviewCount: 150,
      reviews: 150,
      brand: "AudioSonic",
      sku: "AS-HP-003",
      slug: "amazing-headphones",
      images: [
        "/dist/images/products/headphones1.jpg",
        "/dist/images/products/headphones2.jpg",
        "/dist/images/products/headphones3.jpg"
      ],
      highlights: [
        "Active Noise Cancellation",
        "20 Hours Battery Life",
        "Bluetooth 5.0",
        "Comfortable Fit"
      ]
    },
    {
      id: 4,
      categoryId: 201,
      name: "Stylish Men's Shirt",
      description: "A fashionable shirt for men.",
      price: 49.99,
      imageUrl: "/dist/images/products/mens-shirt1.jpg",
      image: "/dist/images/products/mens-shirt1.jpg",
      rating: 4.2,
      reviewCount: 80,
      reviews: 80,
      brand: "FashionHub",
      sku: "FH-MS-004",
      slug: "stylish-men-shirt",
      images: [
        "/dist/images/products/mens-shirt1.jpg",
        "/dist/images/products/mens-shirt2.jpg",
        "/dist/images/products/mens-shirt3.jpg"
      ],
      highlights: [
        "100% Cotton",
        "Slim Fit",
        "Machine Washable",
        "Available in Multiple Colors"
      ]
    },
    {
      id: 5,
      categoryId: 202,
      name: "Elegant Women's Dress",
      description: "A beautiful dress for women.",
      price: 79.99,
      imageUrl: "/dist/images/products/womens-dress1.jpg",
      image: "/dist/images/products/womens-dress1.jpg",
      rating: 4.7,
      reviewCount: 180,
      reviews: 180,
      brand: "GlamourStyle",
      sku: "GS-WD-005",
      slug: "elegant-women-dress",
      images: [
        "/dist/images/products/womens-dress1.jpg",
        "/dist/images/products/womens-dress2.jpg",
        "/dist/images/products/womens-dress3.jpg"
      ],
      highlights: [
        "Silk Fabric",
        "Elegant Design",
        "Dry Clean Only",
        "Perfect for Special Occasions"
      ]
    },
    {
      id: 6,
      categoryId: 301,
      name: "Comfortable Sofa",
      description: "A cozy sofa for your living room.",
      price: 599.99,
      imageUrl: "/dist/images/products/sofa1.jpg",
      image: "/dist/images/products/sofa1.jpg",
      rating: 4.3,
      reviewCount: 95,
      reviews: 95,
      brand: "HomeComfort",
      sku: "HC-SF-006",
      slug: "comfortable-sofa",
      images: [
        "/dist/images/products/sofa1.jpg",
        "/dist/images/products/sofa2.jpg",
        "/dist/images/products/sofa3.jpg"
      ],
      highlights: [
        "Soft Cushions",
        "Durable Frame",
        "Easy to Assemble",
        "Modern Design"
      ]
    },
    {
      id: 7,
      categoryId: 302,
      name: "Gardening Tool Set",
      description: "Essential tools for gardening.",
      price: 39.99,
      imageUrl: "/dist/images/products/gardening-tools1.jpg",
      image: "/dist/images/products/gardening-tools1.jpg",
      rating: 4.0,
      reviewCount: 60,
      reviews: 60,
      brand: "GreenThumb",
      sku: "GT-GS-007",
      slug: "gardening-tool-set",
      images: [
        "/dist/images/products/gardening-tools1.jpg",
        "/dist/images/products/gardening-tools2.jpg",
        "/dist/images/products/gardening-tools3.jpg"
      ],
      highlights: [
        "Durable Steel",
        "Comfortable Handles",
        "Rust Resistant",
        "Perfect for All Gardening Tasks"
      ]
    },
    {
      id: 8,
      categoryId: 401,
      name: "Bestselling Fiction Book",
      description: "An engaging fiction book.",
      price: 19.99,
      imageUrl: "/dist/images/products/fiction-book1.jpg",
      image: "/dist/images/products/fiction-book1.jpg",
      rating: 4.9,
      reviewCount: 250,
      reviews: 250,
      brand: "StoryTime",
      sku: "ST-FB-008",
      slug: "bestselling-fiction-book",
      images: [
        "/dist/images/products/fiction-book1.jpg",
        "/dist/images/products/fiction-book2.jpg",
        "/dist/images/products/fiction-book3.jpg"
      ],
      highlights: [
        "Captivating Story",
        "Well-Developed Characters",
        "Perfect for All Ages",
        "A Must-Read"
      ]
    },
    {
      id: 9,
      categoryId: 402,
      name: "Popular Movie",
      description: "A must-see movie for entertainment.",
      price: 14.99,
      imageUrl: "/dist/images/products/movie1.jpg",
      image: "/dist/images/products/movie1.jpg",
      rating: 4.5,
      reviewCount: 140,
      reviews: 140,
      brand: "CineWorld",
      sku: "CW-MV-009",
      slug: "popular-movie",
      images: [
        "/dist/images/products/movie1.jpg",
        "/dist/images/products/movie2.jpg",
        "/dist/images/products/movie3.jpg"
      ],
      highlights: [
        "High-Definition Quality",
        "Engaging Plot",
        "Great Acting",
        "Perfect for Movie Night"
      ]
    },
    {
      id: 10,
      categoryId: 501,
      name: "High-Quality Running Shoes",
      description: "Top-notch running shoes for athletes.",
      price: 89.99,
      imageUrl: "/dist/images/products/running-shoes1.jpg",
      image: "/dist/images/products/running-shoes1.jpg",
      rating: 4.6,
      reviewCount: 170,
      reviews: 170,
      brand: "RunFast",
      sku: "RF-RS-010",
      slug: "high-quality-running-shoes",
      images: [
        "/dist/images/products/running-shoes1.jpg",
        "/dist/images/products/running-shoes2.jpg",
        "/dist/images/products/running-shoes3.jpg"
      ],
      highlights: [
        "Comfortable Fit",
        "Durable Sole",
        "Breathable Material",
        "Perfect for Running and Training"
      ]
    },
    {
        id: 11,
        categoryId: 104,
        name: "Advanced Smartwatch",
        description: "A feature-rich smartwatch to keep you connected.",
        price: 349.99,
        imageUrl: "/dist/images/products/smartwatch1.jpg",
        image: "/dist/images/products/smartwatch1.jpg",
        rating: 4.7,
        reviewCount: 190,
        reviews: 190,
        brand: "SmartTime",
        sku: "ST-SW-011",
        slug: "advanced-smartwatch",
        images: [
          "/dist/images/products/smartwatch1.jpg",
          "/dist/images/products/smartwatch2.jpg",
          "/dist/images/products/smartwatch3.jpg"
        ],
        highlights: [
          "Fitness Tracking",
          "Heart Rate Monitoring",
          "GPS",
          "Water Resistant"
        ]
      },
      {
        id: 12,
        categoryId: 203,
        name: "Cute Kids' Outfit",
        description: "A stylish and comfortable outfit for kids.",
        price: 29.99,
        imageUrl: "/dist/images/products/kids-clothing1.jpg",
        image: "/dist/images/products/kids-clothing1.jpg",
        rating: 4.4,
        reviewCount: 110,
        reviews: 110,
        brand: "TinyTrend",
        sku: "TT-KC-012",
        slug: "cute-kids-outfit",
        images: [
          "/dist/images/products/kids-clothing1.jpg",
          "/dist/images/products/kids-clothing2.jpg",
          "/dist/images/products/kids-clothing3.jpg"
        ],
        highlights: [
          "Soft Fabric",
          "Durable Stitching",
          "Machine Washable",
          "Available in Multiple Sizes"
        ]
      },
      {
        id: 13,
        categoryId: 303,
        name: "Elegant Home Decor Set",
        description: "A set of decorations to enhance your home's ambiance.",
        price: 59.99,
        imageUrl: "/dist/images/products/home-decor1.jpg",
        image: "/dist/images/products/home-decor1.jpg",
        rating: 4.8,
        reviewCount: 220,
        reviews: 220,
        brand: "CozyHome",
        sku: "CH-HD-013",
        slug: "elegant-home-decor-set",
        images: [
          "/dist/images/products/home-decor1.jpg",
          "/dist/images/products/home-decor2.jpg",
          "/dist/images/products/home-decor3.jpg"
        ],
        highlights: [
          "High-Quality Materials",
          "Elegant Design",
          "Easy to Install",
          "Perfect for Any Room"
        ]
      },
      {
        id: 14,
        categoryId: 403,
        name: "Timeless Music Album",
        description: "A collection of classic songs for music lovers.",
        price: 12.99,
        imageUrl: "/dist/images/products/music1.jpg",
        image: "/dist/images/products/music1.jpg",
        rating: 4.9,
        reviewCount: 260,
        reviews: 260,
        brand: "MelodyMaster",
        sku: "MM-MA-014",
        slug: "timeless-music-album",
        images: [
          "/dist/images/products/music1.jpg",
          "/dist/images/products/music2.jpg",
          "/dist/images/products/music3.jpg"
        ],
        highlights: [
          "Digitally Remastered",
          "High-Fidelity Audio",
          "Perfect for Music Enthusiasts",
          "A Classic Collection"
        ]
      },
      {
        id: 15,
        categoryId: 502,
        name: "Durable Camping Gear Set",
        description: "Essential gear for a comfortable camping experience.",
        price: 129.99,
        imageUrl: "/dist/images/products/camping-gear1.jpg",
        image: "/dist/images/products/camping-gear1.jpg",
        rating: 4.7,
        reviewCount: 200,
        reviews: 200,
        brand: "OutdoorAdventures",
        sku: "OA-CG-015",
        slug: "durable-camping-gear-set",
        images: [
          "/dist/images/products/camping-gear1.jpg",
          "/dist/images/products/camping-gear2.jpg",
          "/dist/images/products/camping-gear3.jpg"
        ],
        highlights: [
          "Waterproof Tent",
          "Comfortable Sleeping Bag",
          "Portable Stove",
          "Perfect for Outdoor Adventures"
        ]
      }
  ]
};

// Export individual items for easier imports
export const { mainCategories, categories, products } = mockData;

// Add vendors array export
export const vendors = [
  { 
    id: "1", 
    name: "TechStore", 
    certification: "Certified", 
    address: ["123 Tech St"],
    telephone: ["123-456-7890"],
    productCount: Math.floor(Math.random() * 1000) + 100,
    categoryCount: Math.floor(Math.random() * 20) + 5,
    paymentMethods: ["Credit Card", "PayPal", "Bank Transfer"],
    url: "https://techstore.com",
    logo: "/dist/images/vendors/techstore-logo.png",
    rating: 4.8
  },
  { 
    id: "2", 
    name: "ElectroMart", 
    certification: "Premium", 
    address: ["456 Digital Ave"],
    telephone: ["123-456-7890"],
    productCount: Math.floor(Math.random() * 1000) + 100,
    categoryCount: Math.floor(Math.random() * 20) + 5,
    paymentMethods: ["Credit Card", "PayPal", "Bank Transfer"],
    url: "https://electromart.com",
    logo: "/dist/images/vendors/electromart-logo.png",
    rating: 4.6
  },
  { 
    id: "3", 
    name: "GadgetWorld", 
    certification: "Standard", 
    address: ["789 Gadget Blvd"],
    telephone: ["123-456-7890"],
    productCount: Math.floor(Math.random() * 1000) + 100,
    categoryCount: Math.floor(Math.random() * 20) + 5,
    paymentMethods: ["Credit Card", "PayPal", "Bank Transfer"],
    url: "https://gadgetworld.com",
    logo: "/dist/images/vendors/gadgetworld-logo.png",
    rating: 4.9
  }
];

// Add brands array export
export const brands = [
  { id: "1", name: "TechMaster", logo: "/dist/images/brands/techmaster-logo.png" },
  { id: "2", name: "PowerTech", logo: "/dist/images/brands/powertech-logo.png" },
  { id: "3", name: "AudioSonic", logo: "/dist/images/brands/audiosonic-logo.png" },
  { id: "4", name: "FashionHub", logo: "/dist/images/brands/fashionhub-logo.png" },
  { id: "5", name: "GlamourStyle", logo: "/dist/images/brands/glamourstyle-logo.png" }
];

// Add utility functions used in components
export const getProductById = (id: string) => {
  return mockData.products.find(product => String(product.id) === id);
};

export const getCategoryById = (id: string) => {
  return mockData.categories.find(category => String(category.id) === id) ||
         mockData.mainCategories.find(category => String(category.id) === id);
};

export const getVendorById = (id: string) => {
  return vendors.find(vendor => String(vendor.id) === id);
};

// Add the missing getProductsByBrand function
export const getProductsByBrand = (brandId: string) => {
  return mockData.products.filter(product => 
    String(product.brand) === brandId || String(product.brand) === getProductById(brandId)?.brand
  );
};

// Update the getBestPrice function
export const getBestPrice = (product: Product) => {
  if (!product.prices || product.prices.length === 0) {
    return null;
  }
  return product.prices.reduce((lowest, current) => 
    current.price < lowest.price ? current : lowest
  );
};

// Update the Product interface to match actual usage in components
export interface Product {
  id: string | number;
  categoryId: string | number;
  categoryIds?: (string | number)[];
  name: string;
  title?: string;
  description: string;
  price: number;
  prices?: ProductPrice[];
  imageUrl?: string;
  image?: string;
  images?: string[];
  rating: number;
  reviewCount?: number;
  reviews?: number;
  brand: string;
  sku?: string;
  highlights?: string[];
  model?: string;
  specifications?: Record<string, string>;
  category?: string;
  slug?: string;
}

export interface Category {
  id: string | number;
  name: string;
  description: string;
  imageUrl?: string;
  image?: string;
  parentId?: string | number;
  slug?: string;
}

export interface Brand {
  id: string | number;
  name: string;
  logo?: string;
}

export interface ProductPrice {
  vendorId: string;
  price: number;
  inStock: boolean;
  shippingCost?: number;
}

// Function to search products
export const searchProducts = (query: string) => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return mockData.products.filter(
    product => 
      (product.name?.toLowerCase().includes(lowerQuery) || 
       product.title?.toLowerCase().includes(lowerQuery) ||
       product.description?.toLowerCase().includes(lowerQuery))
  );
};

// Modify the Promise-returning functions to return actual promises
export const fetchFeaturedProducts = () => {
  // Return a subset of products as featured
  return Promise.resolve(mockData.products.slice(0, 5));
};

export const fetchDeals = () => {
  // Return a subset of products as deals
  return Promise.resolve(mockData.products.slice(5, 10));
};

export const fetchNewArrivals = () => {
  // Return a subset of products as new arrivals
  return Promise.resolve(mockData.products.slice(10, 15));
};

export const getCategories = () => {
  // Return all categories
  return [...mockData.mainCategories, ...mockData.categories];
};

// Update the getProductsByCategory function to handle string IDs
export const getProductsByCategory = (categoryId: string) => {
  return mockData.products.filter(product => 
    String(product.categoryId) === categoryId || 
    (product.categoryIds && product.categoryIds.some(cid => String(cid) === categoryId))
  ).slice(0, 5) || [];
};

// Convert string to slug
export const formatSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Add grouped brands for BrandPage
export const groupedBrands = () => {
  // Group brands by first letter
  const groups: Record<string, typeof brands> = {};
  brands.forEach(brand => {
    const firstLetter = brand.name.charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(brand);
  });
  return groups;
};

// Update the mockData objects to use string IDs and add missing properties
for (let category of mockData.mainCategories) {
  category.id = String(category.id);
  category.slug = category.slug || formatSlug(category.name);
  category.image = category.image || category.imageUrl;
}

for (let category of mockData.categories) {
  category.id = String(category.id);
  category.parentId = String(category.parentId);
  category.slug = category.slug || formatSlug(category.name);
  category.image = category.image || category.imageUrl;
}

for (let product of mockData.products) {
  product.id = String(product.id);
  product.categoryId = String(product.categoryId);
  product.title = product.title || product.name;
  product.image = product.image || product.imageUrl;
  product.reviews = product.reviews || product.reviewCount;
  product.slug = product.slug || formatSlug(product.name);
  product.model = product.model || "";
  product.category = getCategoryById(String(product.categoryId))?.name || "";
  
  // Convert categoryIds if they exist or create them
  if (!product.categoryIds) {
    product.categoryIds = [String(product.categoryId)];
  } else {
    product.categoryIds = product.categoryIds.map(id => String(id));
  }
}
