
import { products } from '@/data/mockData';

export interface ProductPrice {
  id: string;
  product_id: string;
  vendor_id: string;
  price: number;
  in_stock: boolean;
  shipping_cost?: number;
}

export interface Product {
  id: string;
  name: string;
  title?: string;
  slug: string;
  description?: string;
  price: number;
  image_url?: string;
  imageUrl?: string;
  image?: string;
  images: string[];
  brand: string;
  model: string;
  rating: number;
  review_count: number;
  categories?: { id: string; name: string }[];
  specifications: Record<string, any>;
  highlights?: string[];
  prices?: ProductPrice[];
  created_at?: string;
  updated_at?: string;
  sku?: string;
}

// Helper function to get the best (lowest) price from a product
export const getBestPrice = (product: Product): ProductPrice | null => {
  if (!product.prices || product.prices.length === 0) {
    return null;
  }
  
  // Filter in-stock items and sort by price
  const inStockPrices = product.prices.filter(p => p.in_stock);
  
  if (inStockPrices.length === 0) {
    return null;
  }
  
  return inStockPrices.sort((a, b) => a.price - b.price)[0];
};

export const getAllProducts = async (): Promise<Product[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Convert mockProducts to ensure they match the Product interface
      const standardizedProducts: Product[] = products.map(p => ({
        ...p,
        id: String(p.id), // Ensure id is a string
        slug: p.slug || `product-${p.id}`, // Ensure each product has a slug
        specifications: p.specifications || {},
        images: p.images || [],
        prices: p.prices?.map(price => ({
          ...price,
          id: String(price.id || Math.random().toString(36).substr(2, 9)),
          product_id: String(p.id),
          vendor_id: String(price.vendorId || ''),
          in_stock: price.inStock || false,
        })) || [],
        rating: p.rating || 0,
        review_count: p.reviewCount || 0,
        brand: p.brand || '',
        model: p.model || '',
      })) as Product[];
      
      resolve(standardizedProducts);
    }, 500);
  });
};

export const getProductById = async (id: string): Promise<Product | null> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = products.find(p => String(p.id) === id);
      
      if (!product) {
        resolve(null);
        return;
      }
      
      const standardizedProduct: Product = {
        ...product,
        id: String(product.id),
        slug: product.slug || `product-${product.id}`,
        specifications: product.specifications || {},
        images: product.images || [],
        prices: product.prices?.map(price => ({
          ...price,
          id: String(price.id || Math.random().toString(36).substr(2, 9)),
          product_id: String(product.id),
          vendor_id: String(price.vendorId || ''),
          in_stock: price.inStock || false,
        })) || [],
        rating: product.rating || 0,
        review_count: product.reviewCount || 0,
        brand: product.brand || '',
        model: product.model || '',
      };
      
      resolve(standardizedProduct);
    }, 500);
  });
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  // In a real app, this would be an API call filtering by category
  const allProducts = await getAllProducts();
  // Mock filtering by category - in a real app this would be done server-side
  return allProducts.filter(p => p.categories?.some(c => c.id === categoryId));
};

export const getProductsByQuery = async (query: string): Promise<Product[]> => {
  // In a real app, this would be an API call with search functionality
  const allProducts = await getAllProducts();
  
  // Simple search by name or description
  if (!query) return allProducts;
  
  const lowerQuery = query.toLowerCase();
  return allProducts.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) || 
    (p.description && p.description.toLowerCase().includes(lowerQuery))
  );
};

// Adding searchProducts function to resolve the missing export in SearchResults.tsx
export const searchProducts = getProductsByQuery;

// Adding SearchFilters type for SearchResults.tsx
export interface SearchFilters {
  query: string;
  categories?: string[];
  priceRange?: [number, number];
  brands?: string[];
  vendors?: string[];
  inStock?: boolean;
  sortBy?: string;
}
