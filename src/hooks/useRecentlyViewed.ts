
import { useState, useEffect } from 'react';
import { Product, getProductById } from '@/data/mockData';

const RECENTLY_VIEWED_KEY = 'recentlyViewedProducts';
const MAX_RECENT_PRODUCTS = 50;

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Load recently viewed products from localStorage
  useEffect(() => {
    const storedIds = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
    const products = storedIds
      .map((id: string) => getProductById(id))
      .filter(Boolean); // Filter out any null/undefined values
    
    setRecentlyViewed(products);
  }, []);

  // Add a product to recently viewed
  const addToRecentlyViewed = (productId: string) => {
    // Get current list from localStorage
    const storedIds = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
    
    // Remove the product if it's already in the list
    const filteredIds = storedIds.filter((id: string) => id !== productId);
    
    // Add the product to the beginning of the list
    const updatedIds = [productId, ...filteredIds].slice(0, MAX_RECENT_PRODUCTS);
    
    // Save to localStorage
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updatedIds));
    
    // Update state
    const products = updatedIds
      .map((id: string) => getProductById(id))
      .filter(Boolean);
    
    setRecentlyViewed(products);
  };
  
  // Adding a simplified version to support the existing code
  const addProduct = (product: Product) => {
    if (!product || !product.id) return;
    addToRecentlyViewed(product.id);
  };

  return {
    recentlyViewed,
    addToRecentlyViewed,
    addProduct
  };
};
