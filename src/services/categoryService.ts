
import { supabase } from "@/integrations/supabase/client";
import { formatSlug } from "@/utils/formatters";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  parent_id: string | null;
  category_type: 'main' | 'sub';
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export const getMainCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('category_type', 'main')
    .order('name');

  if (error) {
    console.error("Error fetching main categories:", error);
    throw error;
  }

  return data || [];
};

export const getSubcategories = async (parentId: string): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .order('name');

  if (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }

  return data || [];
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }

  return data;
};

export const getCategoryPath = async (categoryId: string): Promise<Category[]> => {
  const path: Category[] = [];
  let currentId = categoryId;
  
  while (currentId) {
    const category = await getCategoryById(currentId);
    if (!category) break;
    
    path.unshift(category);
    currentId = category.parent_id || '';
  }
  
  return path;
};

export const createCategory = async (category: Partial<Category>): Promise<Category | null> => {
  if (!category.slug && category.name) {
    category.slug = formatSlug(category.name);
  }
  
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    throw error;
  }

  return data;
};

export const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category | null> => {
  if (updates.name && !updates.slug) {
    updates.slug = formatSlug(updates.name);
  }
  
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating category:", error);
    throw error;
  }

  return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
