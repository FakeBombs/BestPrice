
import { supabase } from "@/integrations/supabase/client";

export interface Brand {
  id: string;
  name: string;
  logo: string | null;
  created_at: string;
  updated_at: string;
}

export const getBrands = async (): Promise<Brand[]> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name');

  if (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }

  return data || [];
};

export const getBrandById = async (id: string): Promise<Brand | null> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching brand:", error);
    return null;
  }

  return data;
};

export const createBrand = async (brand: Partial<Brand>): Promise<Brand | null> => {
  const { data, error } = await supabase
    .from('brands')
    .insert([brand])
    .select()
    .single();

  if (error) {
    console.error("Error creating brand:", error);
    throw error;
  }

  return data;
};

export const updateBrand = async (id: string, updates: Partial<Brand>): Promise<Brand | null> => {
  const { data, error } = await supabase
    .from('brands')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating brand:", error);
    throw error;
  }

  return data;
};

export const deleteBrand = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('brands')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting brand:", error);
    throw error;
  }
};

export const groupBrandsByFirstLetter = (brands: Brand[]): Record<string, Brand[]> => {
  const groups: Record<string, Brand[]> = {};
  brands.forEach(brand => {
    const firstLetter = brand.name.charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(brand);
  });
  return groups;
};
