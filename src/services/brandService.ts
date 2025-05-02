
import { supabase } from '@/integrations/supabase/client';
import { mockData } from '@/data/mockData';

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  created_at?: string;
  updated_at?: string;
}

export type BrandCreate = Omit<Brand, 'id' | 'created_at' | 'updated_at'>;
export type BrandUpdate = Partial<BrandCreate>;

// Make sure mockData has the brands property
const mockBrands = mockData as any;

// Get all brands
export const getAllBrands = async (): Promise<Brand[]> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');
      
    if (error) {
      console.error("Error fetching brands:", error);
      return mockBrands.brands || [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAllBrands:", error);
    return mockBrands.brands || [];
  }
};

// Get brand by ID
export const getBrandById = async (id: string): Promise<Brand | null> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error("Error fetching brand:", error);
      return mockBrands.brands ? mockBrands.brands.find(b => String(b.id) === id) as Brand || null : null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getBrandById:", error);
    return mockBrands.brands ? mockBrands.brands.find(b => String(b.id) === id) as Brand || null : null;
  }
};

// Create brand
export const createBrand = async (brand: BrandCreate): Promise<Brand | null> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .insert([{
        name: brand.name,
        logo: brand.logo
      }])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating brand:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in createBrand:", error);
    return null;
  }
};

// Update brand
export const updateBrand = async (id: string, updates: BrandUpdate): Promise<Brand | null> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating brand:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in updateBrand:", error);
    return null;
  }
};

// Delete brand
export const deleteBrand = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting brand:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteBrand:", error);
    return false;
  }
};

// Add the missing getBrands function that's being imported
export const getBrands = getAllBrands;
