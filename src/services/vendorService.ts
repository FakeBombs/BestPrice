
import { supabase } from '@/integrations/supabase/client';
import { mockData } from '@/data/mockData';

// Initialize the vendors array in mockData if it doesn't exist
if (!mockData.vendors) {
  mockData.vendors = [
    { id: '1', name: 'Vendor 1', url: 'https://vendor1.com', logo: '/images/vendors/vendor1.png', rating: 4.5 },
    { id: '2', name: 'Vendor 2', url: 'https://vendor2.com', logo: '/images/vendors/vendor2.png', rating: 4.2 },
    { id: '3', name: 'Vendor 3', url: 'https://vendor3.com', logo: '/images/vendors/vendor3.png', rating: 3.9 },
  ];
}

export interface Vendor {
  id: string;
  name: string;
  url?: string;
  logo?: string;
  telephone?: string[];
  address?: string[];
  payment_methods?: string[];
  rating?: number;
  certification?: string;
  product_count?: number;
  category_count?: number;
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
      // Use mockData vendors
      return mockData.vendors || [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAllVendors:", error);
    return mockData.vendors || [];
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
      const mockVendor = mockData.vendors?.find(v => String(v.id) === id);
      return mockVendor ? {
        ...mockVendor,
        id: String(mockVendor.id)
      } : null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getVendorById:", error);
    const mockVendor = mockData.vendors?.find(v => String(v.id) === id);
    return mockVendor ? {
      ...mockVendor,
      id: String(mockVendor.id)
    } : null;
  }
};

// Create vendor
export const createVendor = async (vendor: VendorCreate): Promise<Vendor | null> => {
  try {
    const { data, error } = await supabase
      .from('vendors')
      .insert([vendor])
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

// Alias for compatibility with existing code
export const getVendors = getAllVendors;
