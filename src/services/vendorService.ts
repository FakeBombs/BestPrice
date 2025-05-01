
import { supabase } from "@/integrations/supabase/client";

export interface Vendor {
  id: string;
  name: string;
  certification: string | null;
  address: string[];
  telephone: string[];
  product_count: number;
  category_count: number;
  payment_methods: string[];
  url: string;
  logo: string | null;
  rating: number;
  created_at: string;
  updated_at: string;
}

export const getVendors = async (): Promise<Vendor[]> => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('name');

  if (error) {
    console.error("Error fetching vendors:", error);
    throw error;
  }

  return data || [];
};

export const getVendorById = async (id: string): Promise<Vendor | null> => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching vendor:", error);
    return null;
  }

  return data;
};

export const createVendor = async (vendor: Partial<Vendor>): Promise<Vendor | null> => {
  const { data, error } = await supabase
    .from('vendors')
    .insert([vendor])
    .select()
    .single();

  if (error) {
    console.error("Error creating vendor:", error);
    throw error;
  }

  return data;
};

export const updateVendor = async (id: string, updates: Partial<Vendor>): Promise<Vendor | null> => {
  const { data, error } = await supabase
    .from('vendors')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating vendor:", error);
    throw error;
  }

  return data;
};

export const deleteVendor = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('vendors')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting vendor:", error);
    throw error;
  }
};
