
import { supabase } from '@/integrations/supabase/client';
import { mockData } from '@/data/mockData';

// Define proper types for our database
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
  review_count: number;
  created_at?: string;
  updated_at?: string;
  categories?: Array<{id: string, name: string}>;
  prices?: ProductPrice[];
}

export interface ProductPrice {
  id: string;
  product_id: string;
  vendor_id: string;
  price: number;
  in_stock: boolean;
  shipping_cost?: number;
  vendor_name?: string;
  vendor_logo?: string;
}

export type ProductCreate = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type ProductUpdate = Partial<ProductCreate>;

// Helper function to convert database records to our Product interface
const convertDBProductToProduct = (product: any): Product => {
  return {
    ...product,
    // Ensure specifications is a Record<string, any> and not a Json type
    specifications: product.specifications ? JSON.parse(JSON.stringify(product.specifications)) : {},
  };
};

// Get best price for a product
export const getBestPrice = (product: Product): ProductPrice | null => {
  if (!product.prices || product.prices.length === 0) {
    return null;
  }
  return product.prices
    .filter(price => price.in_stock)
    .sort((a, b) => a.price - b.price)[0] || null;
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
      
    if (error) {
      console.error("Error fetching products:", error);
      return mockData.products as unknown as Product[];
    }
    
    if (!data || data.length === 0) {
      return mockData.products as unknown as Product[];
    }
    
    return data.map(convertDBProductToProduct);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    return mockData.products as unknown as Product[];
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_categories!inner (
          category_id,
          categories:category_id (id, name)
        ),
        prices:product_prices (
          *,
          vendors:vendor_id (id, name, logo)
        )
      `)
      .eq('id', id)
      .single();
      
    if (error || !data) {
      console.error("Error fetching product:", error);
      const mockProduct = mockData.products.find(p => String(p.id) === id);
      return mockProduct ? mockProduct as unknown as Product : null;
    }
    
    return {
      ...convertDBProductToProduct(data),
      categories: data.product_categories.map(pc => pc.categories),
      prices: data.prices.map(price => ({
        ...price,
        vendor_name: price.vendors?.name,
        vendor_logo: price.vendors?.logo
      }))
    };
  } catch (error) {
    console.error("Error in getProductById:", error);
    const mockProduct = mockData.products.find(p => String(p.id) === id);
    return mockProduct ? mockProduct as unknown as Product : null;
  }
};

// Get products by category ID
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select(`
        products:product_id (*),
        categories:category_id (*)
      `)
      .eq('category_id', categoryId);
      
    if (error) {
      console.error("Error fetching products by category:", error);
      return mockData.products.filter(p => 
        String(p.categoryId) === categoryId || 
        (p.categoryIds && p.categoryIds.includes(Number(categoryId)))
      ) as unknown as Product[];
    }
    
    if (!data || data.length === 0) {
      return mockData.products.filter(p => 
        String(p.categoryId) === categoryId || 
        (p.categoryIds && p.categoryIds.includes(Number(categoryId)))
      ) as unknown as Product[];
    }
    
    return data.map(item => convertDBProductToProduct(item.products));
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    return mockData.products.filter(p => 
      String(p.categoryId) === categoryId || 
      (p.categoryIds && p.categoryIds.includes(Number(categoryId)))
    ) as unknown as Product[];
  }
};

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    // Fetch high rated products as featured
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gte('rating', 4.5)
      .limit(12);
      
    if (error) {
      console.error("Error fetching featured products:", error);
      return mockData.products.slice(0, 12) as unknown as Product[];
    }
    
    if (!data || data.length === 0) {
      return mockData.products.slice(0, 12) as unknown as Product[];
    }
    
    return data.map(convertDBProductToProduct);
  } catch (error) {
    console.error("Error in getFeaturedProducts:", error);
    return mockData.products.slice(0, 12) as unknown as Product[];
  }
};

// Create product
export const createProduct = async (product: ProductCreate): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        title: product.title,
        description: product.description,
        price: product.price,
        image_url: product.image_url,
        images: product.images,
        brand: product.brand,
        sku: product.sku,
        model: product.model,
        slug: product.slug,
        highlights: product.highlights,
        specifications: product.specifications,
        rating: product.rating,
        review_count: product.review_count
      }])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating product:", error);
      return null;
    }
    
    return convertDBProductToProduct(data);
  } catch (error) {
    console.error("Error in createProduct:", error);
    return null;
  }
};

// Update product
export const updateProduct = async (id: string, updates: ProductUpdate): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating product:", error);
      return null;
    }
    
    return convertDBProductToProduct(data);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return null;
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
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

// Import mock data into Supabase
export const importMockDataToSupabase = async (): Promise<boolean> => {
  try {
    // First import categories
    for (const category of mockData.mainCategories) {
      await supabase.from('categories').insert({
        name: category.name,
        description: category.description || '',
        slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
        category_type: 'main',
        image_url: category.imageUrl
      });
    }
    
    for (const category of mockData.categories) {
      await supabase.from('categories').insert({
        name: category.name,
        description: category.description || '',
        slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
        category_type: 'sub',
        parent_id: category.parentId ? String(category.parentId) : null,
        image_url: category.imageUrl
      });
    }
    
    // Then import products
    for (const product of mockData.products) {
      const newProduct = {
        name: product.name,
        title: product.title || product.name,
        description: product.description || '',
        price: product.price,
        image_url: product.imageUrl || product.image,
        images: product.images || [],
        brand: product.brand || '',
        sku: product.sku || '',
        model: product.model || '',
        slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
        highlights: product.highlights || [],
        specifications: product.specs || {},
        rating: product.rating || 0,
        review_count: product.reviewCount || 0
      };
      
      const { data } = await supabase.from('products').insert(newProduct).select('id').single();
      
      if (data) {
        // Add category relationship
        await supabase.from('product_categories').insert({
          product_id: data.id,
          category_id: String(product.categoryId),
          primary_category: true
        });
        
        // Add additional categories if present
        if (product.categoryIds && product.categoryIds.length > 0) {
          for (const catId of product.categoryIds) {
            if (String(catId) !== String(product.categoryId)) {
              await supabase.from('product_categories').insert({
                product_id: data.id,
                category_id: String(catId),
                primary_category: false
              });
            }
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error importing mock data to Supabase:", error);
    return false;
  }
};
