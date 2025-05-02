
import { supabase } from '@/integrations/supabase/client';
import { mockData } from '@/data/mockData';

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parent_id?: string | null;
  category_type: 'main' | 'sub';
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  subcategories?: Category[];
}

export type CategoryCreate = Omit<Category, 'id' | 'created_at' | 'updated_at' | 'subcategories'>;
export type CategoryUpdate = Partial<CategoryCreate>;

// Helper function to format slug
export const formatSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
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
      return [...mockData.mainCategories, ...mockData.categories].map(cat => ({
        ...cat,
        id: String(cat.id),
        parent_id: cat.parentId ? String(cat.parentId) : null,
        category_type: cat.parentId ? 'sub' : 'main',
        image_url: cat.imageUrl,
        slug: cat.slug || formatSlug(cat.name)
      })) as Category[];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    return [...mockData.mainCategories, ...mockData.categories].map(cat => ({
      ...cat,
      id: String(cat.id),
      parent_id: cat.parentId ? String(cat.parentId) : null,
      category_type: cat.parentId ? 'sub' : 'main',
      image_url: cat.imageUrl,
      slug: cat.slug || formatSlug(cat.name)
    })) as Category[];
  }
};

// Get main categories
export const getMainCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('category_type', 'main')
      .order('name');
      
    if (error) {
      console.error("Error fetching main categories:", error);
      return mockData.mainCategories.map(cat => ({
        ...cat,
        id: String(cat.id),
        parent_id: null,
        category_type: 'main' as const,
        image_url: cat.imageUrl,
        slug: cat.slug || formatSlug(cat.name)
      })) as Category[];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getMainCategories:", error);
    return mockData.mainCategories.map(cat => ({
      ...cat,
      id: String(cat.id),
      parent_id: null,
      category_type: 'main' as const,
      image_url: cat.imageUrl,
      slug: cat.slug || formatSlug(cat.name)
    })) as Category[];
  }
};

// Get subcategories by parent ID
export const getSubcategoriesByParentId = async (parentId: string | null = null): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq(parentId ? 'parent_id' : 'category_type', parentId || 'sub')
      .order('name');
      
    if (error) {
      console.error("Error fetching subcategories:", error);
      return mockData.categories
        .filter(cat => parentId ? String(cat.parentId) === parentId : true)
        .map(cat => ({
          ...cat,
          id: String(cat.id),
          parent_id: cat.parentId ? String(cat.parentId) : null,
          category_type: 'sub' as const,
          image_url: cat.imageUrl,
          slug: cat.slug || formatSlug(cat.name)
        })) as Category[];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getSubcategoriesByParentId:", error);
    return mockData.categories
      .filter(cat => parentId ? String(cat.parentId) === parentId : true)
      .map(cat => ({
        ...cat,
        id: String(cat.id),
        parent_id: cat.parentId ? String(cat.parentId) : null,
        category_type: 'sub' as const,
        image_url: cat.imageUrl,
        slug: cat.slug || formatSlug(cat.name)
      })) as Category[];
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
      const mockCategory = [...mockData.mainCategories, ...mockData.categories].find(c => String(c.id) === id);
      return mockCategory ? {
        ...mockCategory,
        id: String(mockCategory.id),
        parent_id: mockCategory.parentId ? String(mockCategory.parentId) : null,
        category_type: mockCategory.parentId ? 'sub' : 'main',
        image_url: mockCategory.imageUrl,
        slug: mockCategory.slug || formatSlug(mockCategory.name)
      } as Category : null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    const mockCategory = [...mockData.mainCategories, ...mockData.categories].find(c => String(c.id) === id);
    return mockCategory ? {
      ...mockCategory,
      id: String(mockCategory.id),
      parent_id: mockCategory.parentId ? String(mockCategory.parentId) : null,
      category_type: mockCategory.parentId ? 'sub' : 'main',
      image_url: mockCategory.imageUrl,
      slug: mockCategory.slug || formatSlug(mockCategory.name)
    } as Category : null;
  }
};

// Create category
export const createCategory = async (category: CategoryCreate): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
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
