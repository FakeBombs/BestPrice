
import { supabase } from '@/integrations/supabase/client';
import { mockData } from '@/data/mockData';

export interface ProductPrice {
  id: string;
  product_id: string;
  vendor_id: string;
  vendorId?: string;
  price: number;
  shipping_cost?: number;
  shippingCost?: number;
  in_stock: boolean;
  inStock?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCategory {
  product_id: string;
  category_id: string;
  primary_category: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  slug?: string;
}

export interface Product {
  id: string;
  name: string;
  title?: string;
  description?: string;
  price: number;
  image_url?: string;
  imageUrl?: string;
  image?: string;
  images?: string[];
  brand?: string;
  sku?: string;
  model?: string;
  slug: string;
  highlights?: string[];
  specifications?: Record<string, any>;
  specs?: Record<string, string>;
  rating: number;
  review_count?: number;
  reviewCount?: number;
  created_at?: string;
  updated_at?: string;
  prices?: ProductPrice[];
  categories?: Category[];
  categoryId?: number;
}

export interface SearchFilters {
  category_id?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
  sort_by?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'relevance';
  page?: number;
  limit?: number;
  query?: string;
}

export type ProductCreate = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type ProductUpdate = Partial<ProductCreate>;

// Helper function to get the best price for a product
export const getBestPrice = (product: Product): ProductPrice | null => {
  if (!product.prices || product.prices.length === 0) {
    // Return a default price object using the product's base price
    return {
      id: "default",
      product_id: product.id,
      vendor_id: "default",
      price: product.price,
      in_stock: true
    };
  }
  
  // Filter for in-stock prices
  const inStockPrices = product.prices.filter(p => p.in_stock || p.inStock);
  
  if (inStockPrices.length === 0) {
    // If no in-stock prices, return the lowest price overall
    return product.prices.sort((a, b) => a.price - b.price)[0];
  }
  
  // Return the lowest in-stock price
  return inStockPrices.sort((a, b) => a.price - b.price)[0];
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
      
    if (error) {
      console.error("Error fetching products:", error);
      // Use mockData products when real API fails
      return mockData.products?.map(p => ({
        ...p,
        id: String(p.id),
        rating: p.rating || 0,
        review_count: p.reviewCount || 0,
        specifications: p.specifications || p.specs || {},
        slug: p.slug || formatSlug(p.name)
      })) || [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    return mockData.products?.map(p => ({
      ...p,
      id: String(p.id),
      rating: p.rating || 0,
      review_count: p.reviewCount || 0,
      specifications: p.specifications || p.specs || {},
      slug: p.slug || formatSlug(p.name)
    })) || [];
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error("Error fetching product:", error);
      const mockProduct = mockData.products?.find(p => String(p.id) === id);
      return mockProduct ? {
        ...mockProduct,
        id: String(mockProduct.id),
        rating: mockProduct.rating || 0,
        review_count: mockProduct.reviewCount || 0,
        specifications: mockProduct.specifications || mockProduct.specs || {},
        slug: mockProduct.slug || formatSlug(mockProduct.name)
      } : null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getProductById:", error);
    const mockProduct = mockData.products?.find(p => String(p.id) === id);
    return mockProduct ? {
      ...mockProduct,
      id: String(mockProduct.id),
      rating: mockProduct.rating || 0,
      review_count: mockProduct.reviewCount || 0,
      specifications: mockProduct.specifications || mockProduct.specs || {},
      slug: mockProduct.slug || formatSlug(mockProduct.name)
    } : null;
  }
};

// Helper function to format slug
const formatSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

// Search products
export const searchProducts = async (filters: SearchFilters): Promise<{ products: Product[], total: number }> => {
  try {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (filters.query) {
      query = query.ilike('name', `%${filters.query}%`);
    }
    
    if (filters.category_id) {
      // This is simplified - in a real app, you'd query product_categories table
      query = query.eq('category_id', filters.category_id);
    }
    
    if (filters.brand) {
      query = query.ilike('brand', `%${filters.brand}%`);
    }
    
    if (filters.min_price !== undefined) {
      query = query.gte('price', filters.min_price);
    }
    
    if (filters.max_price !== undefined) {
      query = query.lte('price', filters.max_price);
    }
    
    if (filters.rating !== undefined) {
      query = query.gte('rating', filters.rating);
    }
    
    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query.range(from, to);
    
    // Sorting
    if (filters.sort_by) {
      switch (filters.sort_by) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          // For 'relevance', we don't apply any specific sorting
          break;
      }
    }
    
    const { data, count, error } = await query;
    
    if (error) {
      console.error("Error searching products:", error);
      
      // Implement filtering on mockData
      let filteredProducts = [...mockData.products];
      
      if (filters.query) {
        const searchQuery = filters.query.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchQuery) || 
          p.description?.toLowerCase().includes(searchQuery) ||
          p.brand?.toLowerCase().includes(searchQuery)
        );
      }
      
      // Return mock data
      return { 
        products: filteredProducts.map(p => ({
          ...p,
          id: String(p.id),
          rating: p.rating || 0,
          review_count: p.reviewCount || 0,
          specifications: p.specifications || p.specs || {},
          slug: p.slug || formatSlug(p.name)
        })),
        total: filteredProducts.length 
      };
    }
    
    return { products: data || [], total: count || 0 };
  } catch (error) {
    console.error("Error in searchProducts:", error);
    
    // Fallback to mock data
    return { 
      products: mockData.products.map(p => ({
        ...p,
        id: String(p.id),
        rating: p.rating || 0,
        review_count: p.reviewCount || 0,
        specifications: p.specifications || p.specs || {},
        slug: p.slug || formatSlug(p.name)
      })),
      total: mockData.products.length 
    };
  }
};

// Get products by category
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('product_id')
      .eq('category_id', categoryId);
      
    if (error) {
      console.error("Error fetching products by category:", error);
      // Use mockData products filtered by category when real API fails
      return mockData.products?.filter(p => String(p.categoryId) === categoryId)
        .map(p => ({
          ...p,
          id: String(p.id),
          review_count: p.reviewCount || 0,
          specifications: p.specifications || p.specs || {},
          slug: p.slug || formatSlug(p.name)
        })) || [];
    }
    
    if (data.length === 0) {
      return [];
    }
    
    const productIds = data.map(item => item.product_id);
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);
      
    if (productsError) {
      console.error("Error fetching products by IDs:", productsError);
      return [];
    }
    
    return products || [];
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    // Use mockData products filtered by category as fallback
    return mockData.products?.filter(p => String(p.categoryId) === categoryId)
      .map(p => ({
        ...p,
        id: String(p.id),
        review_count: p.reviewCount || 0,
        specifications: p.specifications || p.specs || {},
        slug: p.slug || formatSlug(p.name)
      })) || [];
  }
};

// Get related products
export const getRelatedProducts = async (productId: string, limit = 10): Promise<Product[]> => {
  try {
    // This is a simplified implementation, in a real app you might want to
    // fetch products from the same category or with similar attributes
    const mockProduct = mockData.products?.find(p => String(p.id) === productId);
    if (!mockProduct) return [];
    
    return mockData.products
      ?.filter(p => String(p.id) !== productId && 
        (p.categoryId === mockProduct.categoryId))
      .slice(0, limit)
      .map(p => ({
        ...p,
        id: String(p.id),
        review_count: p.reviewCount || 0,
        specifications: p.specifications || p.specs || {},
        slug: p.slug || formatSlug(p.name)
      })) || [];
  } catch (error) {
    console.error("Error in getRelatedProducts:", error);
    return [];
  }
};

// Alias for compatibility with existing code
export const getBrands = getAllProducts;
