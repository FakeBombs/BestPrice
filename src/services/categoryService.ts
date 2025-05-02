
import { supabase } from '@/integrations/supabase/client';
import { mockData, Category as MockCategory } from '@/data/mockData';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
  category_type?: 'main' | 'sub';
}

export type CategoryCreate = Omit<Category, 'id' | 'created_at' | 'updated_at'> & { 
  name: string;
  slug: string;
};

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
      
    if (error) {
      console.error("Error fetching categories:", error);
      // Use mockData as fallback
      return convertMockCategories([...mockData.mainCategories, ...mockData.categories]);
    }
    
    return data;
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    return convertMockCategories([...mockData.mainCategories, ...mockData.categories]);
  }
};

// Get main categories (top level)
export const getMainCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('category_type', 'main')
      .order('name');
      
    if (error) {
      console.error("Error fetching main categories:", error);
      return convertMockCategories(mockData.mainCategories);
    }
    
    return data;
  } catch (error) {
    console.error("Error in getMainCategories:", error);
    return convertMockCategories(mockData.mainCategories);
  }
};

// Get subcategories by parent ID
export const getSubcategoriesByParentId = async (parentId: string): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', parentId)
      .order('name');
      
    if (error) {
      console.error("Error fetching subcategories:", error);
      return convertMockCategories(mockData.categories.filter(c => c.parentId === parentId));
    }
    
    return data;
  } catch (error) {
    console.error("Error in getSubcategoriesByParentId:", error);
    return convertMockCategories(mockData.categories.filter(c => c.parentId === parentId));
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
      
      // Find in mock data
      const mockCategory = [...mockData.mainCategories, ...mockData.categories].find(c => c.id === id);
      return mockCategory ? convertMockCategory(mockCategory) : null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    
    // Find in mock data
    const mockCategory = [...mockData.mainCategories, ...mockData.categories].find(c => c.id === id);
    return mockCategory ? convertMockCategory(mockCategory) : null;
  }
};

// Create a new category
export const createCategory = async (category: CategoryCreate): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
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

// Update an existing category
export const updateCategory = async (id: string, updates: Partial<CategoryCreate>): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
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

// Delete a category
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

// Helper function to convert mock categories to match the API structure
const convertMockCategories = (categories: MockCategory[]): Category[] => {
  return categories.map(convertMockCategory);
};

const convertMockCategory = (cat: MockCategory): Category => {
  return {
    id: cat.id,
    name: cat.name,
    description: cat.description,
    parent_id: cat.parentId || null,
    image_url: cat.imageUrl || cat.image || null,
    slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
    category_type: cat.parentId ? 'sub' : 'main'
  };
};
