
import { Vendor, vendors, products } from '@/data/mockData';

export interface VendorWithStats extends Vendor {
  productCount: number;
  categoryCount: number;
  rating?: number;
}

export const getAllVendors = async (): Promise<VendorWithStats[]> => {
  return vendors.map(vendor => {
    const vendorProducts = products.filter(product => 
      product.prices?.some(price => price.vendorId === vendor.id || price.vendor_id === vendor.id)
    );
    
    // Count unique categories
    const categories = new Set();
    vendorProducts.forEach(product => {
      if (product.categoryId) categories.add(product.categoryId);
      if (product.categoryIds) product.categoryIds.forEach(catId => categories.add(catId));
      if (product.categories) product.categories.forEach(cat => categories.add(cat));
    });
    
    return {
      ...vendor,
      productCount: vendorProducts.length,
      categoryCount: categories.size
    };
  });
};

export const getVendorById = async (id: string): Promise<VendorWithStats | undefined> => {
  const vendor = vendors.find(v => v.id === id);
  
  if (!vendor) return undefined;
  
  const vendorProducts = products.filter(product => 
    product.prices?.some(price => price.vendorId === vendor.id || price.vendor_id === vendor.id)
  );
  
  // Count unique categories
  const categories = new Set();
  vendorProducts.forEach(product => {
    if (product.categoryId) categories.add(product.categoryId);
    if (product.categoryIds) product.categoryIds.forEach(catId => categories.add(catId));
    if (product.categories) product.categories.forEach(cat => categories.add(cat));
  });
  
  return {
    ...vendor,
    productCount: vendorProducts.length,
    categoryCount: categories.size
  };
};

export const getTopVendors = async (limit: number = 5): Promise<VendorWithStats[]> => {
  const allVendors = await getAllVendors();
  return allVendors
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, limit);
};

export const getFeaturedVendors = async (): Promise<VendorWithStats[]> => {
  // In a real app, you might have a "featured" flag on vendors
  // For now, just return the top vendors
  return getTopVendors(3);
};
