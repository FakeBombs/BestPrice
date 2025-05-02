
import { supabase } from '@/integrations/supabase/client';
import { mockData } from '@/data/mockData';

export interface Vendor {
  id: string;
  name: string;
  certification?: string;
  address?: string[];
  telephone?: string[];
  product_count?: number;
  category_count?: number;
  payment_methods?: string[];
  url?: string;
  logo?: string;
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

export type VendorCreate = Omit<Vendor, 'id' | 'created_at' | 'updated_at'>;
export type VendorUpdate = Partial<VendorCreate>;

// Get all vendors
export const getAllVendors = async (): Promise<Vendor[]> => {
  try {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('name');
      
    if (error) {
      console.error("Error fetching vendors:", error);
      return mockData.vendors ? mockData.vendors as unknown as Vendor[] : [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAllVendors:", error);
    return mockData.vendors ? mockData.vendors as unknown as Vendor[] : [];
  }
};

// Get vendor by ID
export const getVendorById = async (id: string): Promise<Vendor | null> => {
  try {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error("Error fetching vendor:", error);
      return mockData.vendors ? mockData.vendors.find(v => String(v.id) === id) as unknown as Vendor || null : null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getVendorById:", error);
    return mockData.vendors ? mockData.vendors.find(v => String(v.id) === id) as unknown as Vendor || null : null;
  }
};

// Create vendor
export const createVendor = async (vendor: VendorCreate): Promise<Vendor | null> => {
  try {
    const { data, error } = await supabase
      .from('vendors')
      .insert([{
        name: vendor.name,
        certification: vendor.certification,
        address: vendor.address || [],
        telephone: vendor.telephone || [],
        product_count: vendor.product_count || 0,
        category_count: vendor.category_count || 0,
        payment_methods: vendor.payment_methods || [],
        url: vendor.url,
        logo: vendor.logo,
        rating: vendor.rating || 0
      }])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating vendor:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in createVendor:", error);
    return null;
  }
};

// Update vendor
export const updateVendor = async (id: string, updates: VendorUpdate): Promise<Vendor | null> => {
  try {
    const { data, error } = await supabase
      .from('vendors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating vendor:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in updateVendor:", error);
    return null;
  }
};

// Delete vendor
export const deleteVendor = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting vendor:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteVendor:", error);
    return false;
  }
};
