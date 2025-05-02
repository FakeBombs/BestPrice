
import { supabase } from '@/integrations/supabase/client';
import { mockData } from '@/data/mockData';

export interface ProductPrice {
  id: string;
  product_id: string;
  vendor_id: string;
  price: number;
  shipping_cost?: number;
  in_stock: boolean;
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
}

export interface Product {
  id: string;
  name: string;
  title?: string;
  description?: string;
  price: number;
  image_url?: string;
  images?: string[];
  brand?: string;
  sku?: string;
  model?: string;
  slug: string;
  highlights?: string[];
  specifications?: Record<string, any>;
  rating: number;
  review_count?: number;
  created_at?: string;
  updated_at?: string;
  prices?: ProductPrice[];
  categories?: Category[];
}

export interface SearchFilters {
  category_id?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
  sort_by?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
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
  const inStockPrices = product.prices.filter(p => p.in_stock);
  
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
        specifications: p.specs || {},
        // Map categories from mockData if they exist
        categories: p.categoryId ? [{ 
          id: String(p.categoryId), 
          name: p.category || 'Uncategorized' 
        }] : []
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
      specifications: p.specs || {},
      // Map categories from mockData if they exist
      categories: p.categoryId ? [{ 
        id: String(p.categoryId), 
        name: p.category || 'Uncategorized' 
      }] : []
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
        specifications: mockProduct.specs || {},
        // Map categories from mockData if they exist
        categories: mockProduct.categoryId ? [{ 
          id: String(mockProduct.categoryId), 
          name: mockProduct.category || 'Uncategorized' 
        }] : []
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
      specifications: mockProduct.specs || {},
      // Map categories from mockData if they exist
      categories: mockProduct.categoryId ? [{ 
        id: String(mockProduct.categoryId), 
        name: mockProduct.category || 'Uncategorized' 
      }] : []
    } : null;
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
      return mockData.products?.filter(p => String(p.categoryId) === categoryId || p.categoryIds?.includes(Number(categoryId)))
        .map(p => ({
          ...p,
          id: String(p.id),
          review_count: p.reviewCount || 0,
          specifications: p.specs || {}
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
    return mockData.products?.filter(p => String(p.categoryId) === categoryId || p.categoryIds?.includes(Number(categoryId)))
      .map(p => ({
        ...p,
        id: String(p.id),
        review_count: p.reviewCount || 0,
        specifications: p.specs || {}
      })) || [];
  }
};

// Get related products
export const getRelatedProducts = async (productId: string, limit = 10): Promise<Product[]> => {
  try {
    // Get the product's categories
    const { data: productCategories, error: categoriesError } = await supabase
      .from('product_categories')
      .select('category_id')
      .eq('product_id', productId);
      
    if (categoriesError || !productCategories || productCategories.length === 0) {
      console.error("Error fetching product categories:", categoriesError);
      // Fallback to mock data
      const mockProduct = mockData.products?.find(p => String(p.id) === productId);
      if (!mockProduct) return [];
      
      return mockData.products
        ?.filter(p => p.id !== Number(productId) && 
          (p.categoryId === mockProduct.categoryId || 
          p.categoryIds?.some(cid => mockProduct.categoryIds?.includes(cid))))
        .slice(0, limit)
        .map(p => ({
          ...p,
          id: String(p.id),
          review_count: p.reviewCount || 0,
          specifications: p.specs || {}
        })) || [];
    }
    
    const categoryIds = productCategories.map(item => item.category_id);
    
    // Get product IDs from the same categories excluding the current product
    const { data: relatedProductsData, error: relatedError } = await supabase
      .from('product_categories')
      .select('product_id')
      .in('category_id', categoryIds)
      .neq('product_id', productId)
      .limit(limit);
      
    if (relatedError || !relatedProductsData || relatedProductsData.length === 0) {
      console.error("Error fetching related products:", relatedError);
      return [];
    }
    
    const relatedProductIds = [...new Set(relatedProductsData.map(item => item.product_id))].slice(0, limit);
    
    // Get the actual product data
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', relatedProductIds);
      
    if (productsError) {
      console.error("Error fetching related product details:", productsError);
      return [];
    }
    
    return products || [];
  } catch (error) {
    console.error("Error in getRelatedProducts:", error);
    // Fallback to mock data
    const mockProduct = mockData.products?.find(p => String(p.id) === productId);
    if (!mockProduct) return [];
    
    return mockData.products
      ?.filter(p => p.id !== Number(productId) && 
        (p.categoryId === mockProduct.categoryId || 
        p.categoryIds?.some(cid => mockProduct.categoryIds?.includes(cid))))
      .slice(0, limit)
      .map(p => ({
        ...p,
        id: String(p.id),
        review_count: p.reviewCount || 0,
        specifications: p.specs || {}
      })) || [];
  }
};

// Search products with filters
export const searchProducts = async (filters: SearchFilters): Promise<{ products: Product[]; total: number }> => {
  try {
    let query = supabase.from('products').select('*', { count: 'exact' });
    
    // Apply filters
    if (filters.query) {
      query = query.or(`name.ilike.%${filters.query}%, description.ilike.%${filters.query}%`);
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
    
    if (filters.brand) {
      query = query.eq('brand', filters.brand);
    }
    
    // If category filter is applied, first get product IDs from that category
    if (filters.category_id) {
      const { data: categoryProducts, error: categoryError } = await supabase
        .from('product_categories')
        .select('product_id')
        .eq('category_id', filters.category_id);
        
      if (categoryError) {
        console.error("Error fetching products from category:", categoryError);
        // Mock data fallback for category filter
        const mockFiltered = mockData.products
          ?.filter(p => {
            let matches = true;
            if (filters.category_id) {
              matches = matches && (String(p.categoryId) === filters.category_id || p.categoryIds?.includes(Number(filters.category_id)));
            }
            if (filters.brand) {
              matches = matches && p.brand === filters.brand;
            }
            if (filters.min_price !== undefined) {
              matches = matches && p.price >= filters.min_price;
            }
            if (filters.max_price !== undefined) {
              matches = matches && p.price <= filters.max_price;
            }
            if (filters.rating !== undefined) {
              matches = matches && (p.rating || 0) >= filters.rating;
            }
            if (filters.query) {
              const query = filters.query.toLowerCase();
              matches = matches && (
                p.name.toLowerCase().includes(query) ||
                (p.description && p.description.toLowerCase().includes(query))
              );
            }
            return matches;
          })
          .map(p => ({
            ...p,
            id: String(p.id),
            review_count: p.reviewCount || 0,
            specifications: p.specs || {}
          }));
        
        // Apply sorting
        if (mockFiltered) {
          const sortedMock = [...mockFiltered];
          if (filters.sort_by === 'price_asc') {
            sortedMock.sort((a, b) => a.price - b.price);
          } else if (filters.sort_by === 'price_desc') {
            sortedMock.sort((a, b) => b.price - a.price);
          } else if (filters.sort_by === 'rating') {
            sortedMock.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          }
          
          // Apply pagination
          const page = filters.page || 1;
          const limit = filters.limit || 20;
          const start = (page - 1) * limit;
          const paginatedMock = sortedMock.slice(start, start + limit);
          
          return {
            products: paginatedMock,
            total: sortedMock.length
          };
        }
      }
      
      if (!categoryProducts || categoryProducts.length === 0) {
        return { products: [], total: 0 };
      }
      
      const productIds = categoryProducts.map(item => item.product_id);
      query = query.in('id', productIds);
    }
    
    // Apply sorting
    if (filters.sort_by === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (filters.sort_by === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else if (filters.sort_by === 'rating') {
      query = query.order('rating', { ascending: false });
    } else if (filters.sort_by === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('name');
    }
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const start = (page - 1) * limit;
    query = query.range(start, start + limit - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error("Error searching products:", error);
      // Fallback to mock data with filters
      const mockFiltered = mockData.products
        ?.filter(p => {
          let matches = true;
          if (filters.category_id) {
            matches = matches && (String(p.categoryId) === filters.category_id || p.categoryIds?.includes(Number(filters.category_id)));
          }
          if (filters.brand) {
            matches = matches && p.brand === filters.brand;
          }
          if (filters.min_price !== undefined) {
            matches = matches && p.price >= filters.min_price;
          }
          if (filters.max_price !== undefined) {
            matches = matches && p.price <= filters.max_price;
          }
          if (filters.rating !== undefined) {
            matches = matches && (p.rating || 0) >= filters.rating;
          }
          if (filters.query) {
            const query = filters.query.toLowerCase();
            matches = matches && (
              p.name.toLowerCase().includes(query) ||
              (p.description && p.description.toLowerCase().includes(query))
            );
          }
          return matches;
        })
        .map(p => ({
          ...p,
          id: String(p.id),
          review_count: p.reviewCount || 0,
          specifications: p.specs || {}
        }));
      
      // Apply sorting
      if (mockFiltered) {
        const sortedMock = [...mockFiltered];
        if (filters.sort_by === 'price_asc') {
          sortedMock.sort((a, b) => a.price - b.price);
        } else if (filters.sort_by === 'price_desc') {
          sortedMock.sort((a, b) => b.price - a.price);
        } else if (filters.sort_by === 'rating') {
          sortedMock.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
        
        // Apply pagination
        const paginatedMock = sortedMock.slice(start, start + limit);
        
        return {
          products: paginatedMock,
          total: sortedMock.length
        };
      }
      
      return { products: [], total: 0 };
    }
    
    return {
      products: data || [],
      total: count || 0
    };
  } catch (error) {
    console.error("Error in searchProducts:", error);
    // Fallback to mock data with no filters
    return {
      products: mockData.products?.slice(0, 20).map(p => ({
        ...p,
        id: String(p.id),
        review_count: p.reviewCount || 0,
        specifications: p.specs || {}
      })) || [],
      total: mockData.products?.length || 0
    };
  }
};

// Create product
export const createProduct = async (product: ProductCreate, categoryIds: string[]): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        title: product.title || product.name,
        description: product.description || '',
        price: product.price,
        image_url: product.image_url || '',
        images: product.images || [],
        brand: product.brand || '',
        sku: product.sku || '',
        model: product.model || '',
        slug: product.slug,
        highlights: product.highlights || [],
        specifications: product.specifications || {},
        rating: product.rating || 0,
        review_count: product.review_count || 0
      }])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating product:", error);
      return null;
    }
    
    if (data && categoryIds.length > 0) {
      // Add primary category
      const primaryCategoryId = categoryIds[0];
      const { error: primaryCategoryError } = await supabase
        .from('product_categories')
        .insert([{
          product_id: data.id,
          category_id: primaryCategoryId,
          primary_category: true
        }]);
        
      if (primaryCategoryError) {
        console.error("Error adding primary category:", primaryCategoryError);
      }
      
      // Add additional categories
      if (categoryIds.length > 1) {
        const additionalCategories = categoryIds.slice(1).map(categoryId => ({
          product_id: data.id,
          category_id: categoryId,
          primary_category: false
        }));
        
        const { error: additionalCategoriesError } = await supabase
          .from('product_categories')
          .insert(additionalCategories);
          
        if (additionalCategoriesError) {
          console.error("Error adding additional categories:", additionalCategoriesError);
        }
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error in createProduct:", error);
    return null;
  }
};

// Update product
export const updateProduct = async (id: string, updates: ProductUpdate, categoryIds?: string[]): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: updates.name,
        title: updates.title,
        description: updates.description,
        price: updates.price,
        image_url: updates.image_url,
        images: updates.images,
        brand: updates.brand,
        sku: updates.sku,
        model: updates.model,
        slug: updates.slug,
        highlights: updates.highlights,
        specifications: updates.specifications,
        rating: updates.rating,
        review_count: updates.review_count
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating product:", error);
      return null;
    }
    
    // Update categories if provided
    if (data && categoryIds && categoryIds.length > 0) {
      // First delete existing categories
      const { error: deleteError } = await supabase
        .from('product_categories')
        .delete()
        .eq('product_id', id);
        
      if (deleteError) {
        console.error("Error deleting existing categories:", deleteError);
      }
      
      // Add primary category
      const primaryCategoryId = categoryIds[0];
      const { error: primaryCategoryError } = await supabase
        .from('product_categories')
        .insert([{
          product_id: data.id,
          category_id: primaryCategoryId,
          primary_category: true
        }]);
        
      if (primaryCategoryError) {
        console.error("Error adding primary category:", primaryCategoryError);
      }
      
      // Add additional categories
      if (categoryIds.length > 1) {
        const additionalCategories = categoryIds.slice(1).map(categoryId => ({
          product_id: data.id,
          category_id: categoryId,
          primary_category: false
        }));
        
        const { error: additionalCategoriesError } = await supabase
          .from('product_categories')
          .insert(additionalCategories);
          
        if (additionalCategoriesError) {
          console.error("Error adding additional categories:", additionalCategoriesError);
        }
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return null;
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    // First delete product categories
    const { error: categoriesError } = await supabase
      .from('product_categories')
      .delete()
      .eq('product_id', id);
      
    if (categoriesError) {
      console.error("Error deleting product categories:", categoriesError);
      return false;
    }
    
    // Then delete the product
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting product:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    return false;
  }
};
