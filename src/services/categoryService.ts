
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

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
      
    if (error) {
      console.error("Error fetching categories:", error);
      return [...mockData.mainCategories, ...mockData.categories] as unknown as Category[];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    return [...mockData.mainCategories, ...mockData.categories] as unknown as Category[];
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
      return mockData.mainCategories as unknown as Category[];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getMainCategories:", error);
    return mockData.mainCategories as unknown as Category[];
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
      return mockData.categories.filter(cat => 
        parentId ? String(cat.parentId) === parentId : true
      ) as unknown as Category[];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getSubcategoriesByParentId:", error);
    return mockData.categories.filter(cat => 
      parentId ? String(cat.parentId) === parentId : true
    ) as unknown as Category[];
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
      const mockCategory = [...mockData.mainCategories, ...mockData.categories].find(cat => 
        String(cat.id) === id
      );
      return mockCategory as unknown as Category || null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    const mockCategory = [...mockData.mainCategories, ...mockData.categories].find(cat => 
      String(cat.id) === id
    );
    return mockCategory as unknown as Category || null;
  }
};

// Create category
export const createCategory = async (category: CategoryCreate): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.name,
        description: category.description || '',
        slug: category.slug,
        parent_id: category.parent_id || null,
        category_type: category.category_type || 'sub',
        image_url: category.image_url || null
      })
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

// Get hierarchical categories
export const getHierarchicalCategories = async (): Promise<Category[]> => {
  try {
    // First get all categories
    const { data: allCategories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
      
    if (error) {
      console.error("Error fetching hierarchical categories:", error);
      return mockData.mainCategories.map(main => ({
        ...main,
        subcategories: mockData.categories.filter(sub => String(sub.parentId) === String(main.id))
      })) as unknown as Category[];
    }
    
    // Build the hierarchy
    const mainCategories = allCategories?.filter(cat => cat.category_type === 'main' || cat.parent_id === null) || [];
    
    const result = mainCategories.map(mainCat => {
      const withSubcategories = {
        ...mainCat,
        subcategories: buildCategoryHierarchy(mainCat.id, allCategories || [])
      };
      return withSubcategories;
    });
    
    return result;
  } catch (error) {
    console.error("Error in getHierarchicalCategories:", error);
    return mockData.mainCategories.map(main => ({
      ...main,
      subcategories: mockData.categories.filter(sub => String(sub.parentId) === String(main.id))
    })) as unknown as Category[];
  }
};

// Helper function to build category hierarchy recursively
const buildCategoryHierarchy = (parentId: string, allCategories: Category[]): Category[] => {
  const directChildren = allCategories.filter(cat => cat.parent_id === parentId);
  
  return directChildren.map(child => ({
    ...child,
    subcategories: buildCategoryHierarchy(child.id, allCategories)
  }));
};

// Format slug
export const formatSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};
