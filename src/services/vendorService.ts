
import { supabase } from '@/integrations/supabase/client';
import { mockData } from '@/data/mockData';

// Initialize the vendors array in mockData if it doesn't exist
if (!mockData.vendors) {
  mockData.vendors = [
    { 
      id: 1, 
      name: 'BestBuy', 
      address: ['123 Main St, City'],
      telephone: ['+1 234 567 8900'],
      product_count: 1250,
      category_count: 45,
      payment_methods: ['Credit Card', 'PayPal', 'Cash'],
      url: 'https://example.com/bestbuy',
      logo: '/images/vendors/bestbuy.png',
      rating: 4.5
    },
    { 
      id: 2, 
      name: 'TechWorld', 
      address: ['456 Tech Blvd, Innovation City'],
      telephone: ['+1 987 654 3210'],
      product_count: 980,
      category_count: 32,
      payment_methods: ['Credit Card', 'Bank Transfer'],
      url: 'https://example.com/techworld',
      logo: '/images/vendors/techworld.png',
      rating: 4.2
    },
    { 
      id: 3, 
      name: 'ElectroMart', 
      address: ['789 Digital Ave, Smart Town'],
      telephone: ['+1 555 123 4567'],
      product_count: 1500,
      category_count: 50,
      payment_methods: ['Credit Card', 'PayPal', 'Apple Pay', 'Google Pay'],
      url: 'https://example.com/electromart',
      logo: '/images/vendors/electromart.png',
      rating: 4.7
    }
  ];
}

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
      return mockData.vendors?.map(v => ({
        ...v,
        id: String(v.id)
      })) || [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAllVendors:", error);
    return mockData.vendors?.map(v => ({
      ...v,
      id: String(v.id)
    })) || [];
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

// Alias for compatibility with existing code
export const getVendors = getAllVendors;
