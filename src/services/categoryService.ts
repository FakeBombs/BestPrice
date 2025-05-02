
import { supabase } from '@/integrations/supabase/client';
import { mockData, formatSlug } from '@/data/mockData';

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  slug: string;
  parent_id?: string;
  category_type: 'main' | 'sub';
  created_at?: string;
  updated_at?: string;
}

export type CategoryCreate = Omit<Category, 'id' | 'created_at' | 'updated_at'>;
export type CategoryUpdate = Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>;

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
      
    if (error) {
      console.error("Error fetching categories:", error);
      
      // Convert mockData categories to the right format
      const mainCategories = mockData.mainCategories.map(c => ({
        id: String(c.id),
        name: c.name,
        description: c.description || '',
        image_url: c.imageUrl || c.image || '',
        slug: c.slug || formatSlug(c.name),
        category_type: 'main' as const
      }));
      
      const subCategories = mockData.categories.map(c => ({
        id: String(c.id),
        name: c.name,
        description: c.description || '',
        image_url: c.imageUrl || c.image || '',
        slug: c.slug || formatSlug(c.name),
        parent_id: c.parentId ? String(c.parentId) : undefined,
        category_type: 'sub' as const
      }));
      
      return [...mainCategories, ...subCategories];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    
    // Convert mockData categories to the right format
    const mainCategories = mockData.mainCategories.map(c => ({
      id: String(c.id),
      name: c.name,
      description: c.description || '',
      image_url: c.imageUrl || c.image || '',
      slug: c.slug || formatSlug(c.name),
      category_type: 'main' as const
    }));
    
    const subCategories = mockData.categories.map(c => ({
      id: String(c.id),
      name: c.name,
      description: c.description || '',
      image_url: c.imageUrl || c.image || '',
      slug: c.slug || formatSlug(c.name),
      parent_id: c.parentId ? String(c.parentId) : undefined,
      category_type: 'sub' as const
    }));
    
    return [...mainCategories, ...subCategories];
  }
};

// Get category by ID
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error("Error fetching category:", error);
      
      // Check in main categories
      const mainCategory = mockData.mainCategories.find(c => String(c.id) === id);
      if (mainCategory) {
        return {
          id: String(mainCategory.id),
          name: mainCategory.name,
          description: mainCategory.description || '',
          image_url: mainCategory.imageUrl || mainCategory.image || '',
          slug: mainCategory.slug || formatSlug(mainCategory.name),
          category_type: 'main'
        };
      }
      
      // Check in subcategories
      const subCategory = mockData.categories.find(c => String(c.id) === id);
      if (subCategory) {
        return {
          id: String(subCategory.id),
          name: subCategory.name,
          description: subCategory.description || '',
          image_url: subCategory.imageUrl || subCategory.image || '',
          slug: subCategory.slug || formatSlug(subCategory.name),
          parent_id: subCategory.parentId ? String(subCategory.parentId) : undefined,
          category_type: 'sub'
        };
      }
      
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    
    // Check in main categories
    const mainCategory = mockData.mainCategories.find(c => String(c.id) === id);
    if (mainCategory) {
      return {
        id: String(mainCategory.id),
        name: mainCategory.name,
        description: mainCategory.description || '',
        image_url: mainCategory.imageUrl || mainCategory.image || '',
        slug: mainCategory.slug || formatSlug(mainCategory.name),
        category_type: 'main'
      };
    }
    
    // Check in subcategories
    const subCategory = mockData.categories.find(c => String(c.id) === id);
    if (subCategory) {
      return {
        id: String(subCategory.id),
        name: subCategory.name,
        description: subCategory.description || '',
        image_url: subCategory.imageUrl || subCategory.image || '',
        slug: subCategory.slug || formatSlug(subCategory.name),
        parent_id: subCategory.parentId ? String(subCategory.parentId) : undefined,
        category_type: 'sub'
      };
    }
    
    return null;
  }
};

// Get subcategories for a parent category
export const getSubcategories = async (parentId: string): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', parentId)
      .order('name');
      
    if (error) {
      console.error("Error fetching subcategories:", error);
      
      // Use mockData for subcategories
      return mockData.categories
        .filter(c => String(c.parentId) === parentId)
        .map(c => ({
          id: String(c.id),
          name: c.name,
          description: c.description || '',
          image_url: c.imageUrl || c.image || '',
          slug: c.slug || formatSlug(c.name),
          parent_id: String(c.parentId),
          category_type: 'sub' as const
        }));
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getSubcategories:", error);
    
    // Use mockData for subcategories
    return mockData.categories
      .filter(c => String(c.parentId) === parentId)
      .map(c => ({
        id: String(c.id),
        name: c.name,
        description: c.description || '',
        image_url: c.imageUrl || c.image || '',
        slug: c.slug || formatSlug(c.name),
        parent_id: String(c.parentId),
        category_type: 'sub' as const
      }));
  }
};

// Create category
export const createCategory = async (category: CategoryCreate): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        ...category,
        slug: category.slug || formatSlug(category.name)
      }])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating category:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in createCategory:", error);
    return null;
  }
};

// Update category
export const updateCategory = async (id: string, updates: CategoryUpdate): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({
        ...updates,
        slug: updates.name ? (updates.slug || formatSlug(updates.name)) : undefined
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating category:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in updateCategory:", error);
    return null;
  }
};

// Delete category
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting category:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    return false;
  }
};

// Get main categories (top-level)
export const getMainCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('category_type', 'main')
      .order('name');
      
    if (error) {
      console.error("Error fetching main categories:", error);
      
      // Use mockData for main categories
      return mockData.mainCategories.map(c => ({
        id: String(c.id),
        name: c.name,
        description: c.description || '',
        image_url: c.imageUrl || c.image || '',
        slug: c.slug || formatSlug(c.name),
        category_type: 'main' as const
      }));
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getMainCategories:", error);
    
    // Use mockData for main categories
    return mockData.mainCategories.map(c => ({
      id: String(c.id),
      name: c.name,
      description: c.description || '',
      image_url: c.imageUrl || c.image || '',
      slug: c.slug || formatSlug(c.name),
      category_type: 'main' as const
    }));
  }
};

// Get category path (breadcrumb)
export const getCategoryPath = async (categoryId: string): Promise<Category[]> => {
  const result: Category[] = [];
  let currentId = categoryId;
  
  while (currentId) {
    const category = await getCategoryById(currentId);
    if (!category) break;
    
    result.unshift(category);
    if (!category.parent_id) break;
    
    currentId = category.parent_id;
  }
  
  return result;
};
