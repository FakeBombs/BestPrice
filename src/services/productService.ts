
import { supabase } from "@/integrations/supabase/client";
import { formatSlug } from "@/utils/formatters";

export interface Product {
  id: string;
  name: string;
  title: string | null;
  description: string | null;
  price: number;
  image_url: string | null;
  images: string[];
  brand: string | null;
  sku: string | null;
  model: string | null;
  slug: string;
  highlights: string[];
  specifications: Record<string, any>;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  categories?: { id: string; name: string }[];
  prices?: ProductPrice[];
}

export interface ProductPrice {
  id: string;
  product_id: string;
  vendor_id: string;
  price: number;
  in_stock: boolean;
  shipping_cost: number | null;
  vendor?: {
    name: string;
    url: string;
    certification: string | null;
  };
}

export const getProducts = async (limit = 20, page = 1): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .range((page - 1) * limit, page * limit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return await enrichProducts(data || []);
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  if (data) {
    return (await enrichProducts([data]))[0];
  }

  return null;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  if (!query) return [];
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('rating', { ascending: false });

  if (error) {
    console.error("Error searching products:", error);
    throw error;
  }

  return await enrichProducts(data || []);
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  // First get all child categories
  const allCategoryIds = await getAllChildCategoryIds(categoryId);
  allCategoryIds.push(categoryId);
  
  // Then get all products in those categories
  const { data, error } = await supabase
    .from('product_categories')
    .select('product_id')
    .in('category_id', allCategoryIds);

  if (error) {
    console.error("Error fetching products for category:", error);
    throw error;
  }

  const productIds = data.map(pc => pc.product_id);
  
  if (productIds.length === 0) {
    return [];
  }
  
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds);

  if (productsError) {
    console.error("Error fetching products by IDs:", productsError);
    throw productsError;
  }

  return await enrichProducts(products || []);
};

const getAllChildCategoryIds = async (parentId: string): Promise<string[]> => {
  const result: string[] = [];
  
  const { data } = await supabase
    .from('categories')
    .select('id')
    .eq('parent_id', parentId);
    
  if (!data || data.length === 0) return result;
  
  for (const category of data) {
    result.push(category.id);
    const childIds = await getAllChildCategoryIds(category.id);
    result.push(...childIds);
  }
  
  return result;
};

const enrichProducts = async (products: Product[]): Promise<Product[]> => {
  if (products.length === 0) return [];
  
  // Get all product IDs
  const productIds = products.map(p => p.id);
  
  // Fetch categories for these products
  const { data: categoryData, error: catError } = await supabase
    .from('product_categories')
    .select('product_id, categories(id, name)')
    .in('product_id', productIds);
    
  // Fetch prices for these products
  const { data: priceData, error: priceError } = await supabase
    .from('product_prices')
    .select('*, vendors(id, name, url, certification)')
    .in('product_id', productIds);
    
  if (catError) console.error("Error fetching product categories:", catError);
  if (priceError) console.error("Error fetching product prices:", priceError);
  
  // Organize the data by product ID
  const categoriesByProduct: Record<string, any[]> = {};
  const pricesByProduct: Record<string, any[]> = {};
  
  categoryData?.forEach(item => {
    if (!categoriesByProduct[item.product_id]) {
      categoriesByProduct[item.product_id] = [];
    }
    categoriesByProduct[item.product_id].push(item.categories);
  });
  
  priceData?.forEach(item => {
    if (!pricesByProduct[item.product_id]) {
      pricesByProduct[item.product_id] = [];
    }
    pricesByProduct[item.product_id].push({
      id: item.id,
      product_id: item.product_id,
      vendor_id: item.vendor_id,
      price: item.price,
      in_stock: item.in_stock,
      shipping_cost: item.shipping_cost,
      vendor: item.vendors
    });
  });
  
  // Enrich the products with their related data
  return products.map(product => ({
    ...product,
    categories: categoriesByProduct[product.id] || [],
    prices: pricesByProduct[product.id] || []
  }));
};

export const createProduct = async (product: Partial<Product>): Promise<Product | null> => {
  if (!product.slug && product.name) {
    product.slug = formatSlug(product.name);
  }
  
  // Handle categories separately
  const categories = product.categories;
  delete product.categories;
  
  // Handle prices separately
  const prices = product.prices;
  delete product.prices;
  
  // Insert the product
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw error;
  }

  // Add categories if provided
  if (data && categories && categories.length > 0) {
    const categoryEntries = categories.map((cat: any) => ({
      product_id: data.id,
      category_id: cat.id,
      primary_category: cat.primary || false
    }));
    
    const { error: catError } = await supabase
      .from('product_categories')
      .insert(categoryEntries);
      
    if (catError) {
      console.error("Error adding product categories:", catError);
    }
  }
  
  // Add prices if provided
  if (data && prices && prices.length > 0) {
    const priceEntries = prices.map((price: any) => ({
      product_id: data.id,
      vendor_id: price.vendor_id,
      price: price.price,
      in_stock: price.in_stock !== undefined ? price.in_stock : true,
      shipping_cost: price.shipping_cost
    }));
    
    const { error: priceError } = await supabase
      .from('product_prices')
      .insert(priceEntries);
      
    if (priceError) {
      console.error("Error adding product prices:", priceError);
    }
  }

  return getProductById(data.id);
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  if (updates.name && !updates.slug) {
    updates.slug = formatSlug(updates.name);
  }
  
  // Handle categories separately
  const categories = updates.categories;
  delete updates.categories;
  
  // Handle prices separately
  const prices = updates.prices;
  delete updates.prices;
  
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error);
    throw error;
  }

  // Update categories if provided
  if (categories) {
    // First delete existing categories
    await supabase.from('product_categories').delete().eq('product_id', id);
    
    // Then add new ones
    if (categories.length > 0) {
      const categoryEntries = categories.map((cat: any) => ({
        product_id: id,
        category_id: cat.id,
        primary_category: cat.primary || false
      }));
      
      const { error: catError } = await supabase
        .from('product_categories')
        .insert(categoryEntries);
        
      if (catError) {
        console.error("Error updating product categories:", catError);
      }
    }
  }
  
  // Update prices if provided
  if (prices) {
    // First delete existing prices
    await supabase.from('product_prices').delete().eq('product_id', id);
    
    // Then add new ones
    if (prices.length > 0) {
      const priceEntries = prices.map((price: any) => ({
        product_id: id,
        vendor_id: price.vendor_id,
        price: price.price,
        in_stock: price.in_stock !== undefined ? price.in_stock : true,
        shipping_cost: price.shipping_cost
      }));
      
      const { error: priceError } = await supabase
        .from('product_prices')
        .insert(priceEntries);
        
      if (priceError) {
        console.error("Error updating product prices:", priceError);
      }
    }
  }

  return getProductById(id);
};

export const deleteProduct = async (id: string): Promise<void> => {
  // Delete related records first
  await supabase.from('product_categories').delete().eq('product_id', id);
  await supabase.from('product_prices').delete().eq('product_id', id);
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const getBestPrice = (product: Product): ProductPrice | null => {
  if (!product.prices || product.prices.length === 0) {
    return null;
  }
  return product.prices.reduce((lowest, current) => 
    current.price < lowest.price ? current : lowest
  );
};
