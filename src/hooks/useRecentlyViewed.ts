
import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/services/productService';

const STORAGE_KEY = 'recentlyViewed';
const MAX_ITEMS = 10;

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Load recently viewed products from localStorage on component mount
  useEffect(() => {
    const storedItems = localStorage.getItem(STORAGE_KEY);
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        setRecentlyViewed(parsedItems);
      } catch (error) {
        console.error('Failed to parse stored recently viewed items:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Add a product to recently viewed
  const addProduct = useCallback((product: Product) => {
    setRecentlyViewed(prevItems => {
      // Check if product is already in the list
      const existingProductIndex = prevItems.findIndex(item => item.id === product.id);
      
      let newItems;
      if (existingProductIndex > -1) {
        // Remove existing product and add it to the front
        newItems = [
          product,
          ...prevItems.slice(0, existingProductIndex),
          ...prevItems.slice(existingProductIndex + 1)
        ];
      } else {
        // Add to front, and limit array length
        newItems = [product, ...prevItems].slice(0, MAX_ITEMS);
      }
      
      // Store in localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      } catch (error) {
        console.error('Failed to store recently viewed items:', error);
      }
      
      return newItems;
    });
  }, []);

  // Remove a product from recently viewed
  const removeProduct = useCallback((productId: string) => {
    setRecentlyViewed(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  // Clear all recently viewed products
  const clearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentlyViewed([]);
  }, []);

  return {
    recentlyViewed,
    addProduct,
    removeProduct,
    clearAll
  };
};
