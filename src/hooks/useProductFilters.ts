
import { useState, useEffect } from 'react';
import { Product, vendors } from '@/data/mockData';
import { useSearchParams } from 'react-router-dom';

interface UseProductFiltersProps {
  initialProducts: Product[];
}

export const useProductFilters = ({ initialProducts }: UseProductFiltersProps) => {
  const [searchParams] = useSearchParams();
  const sortParam = searchParams.get('o') || 'relevance';
  
  const [filteredResults, setFilteredResults] = useState<Product[]>(initialProducts);
  const [filteredVendors, setFilteredVendors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<{min: number, max: number} | null>(null);
  
  // Apply filters whenever dependencies change
  useEffect(() => {
    let filtered = [...initialProducts];
    
    // Apply vendor filter
    if (filteredVendors.length > 0) {
      filtered = filtered.filter(product => 
        product.prices?.some(price => 
          filteredVendors.includes(price.vendorId)
        )
      );
    }
    
    // Apply in-stock filter
    if (inStockOnly) {
      filtered = filtered.filter(product => 
        product.prices?.some(price => price.inStock)
      );
    }
    
    // Apply price range filter
    if (priceRange) {
      filtered = filtered.filter(product => {
        const minProductPrice = product.prices?.length 
          ? Math.min(...product.prices.map(p => p.price)) 
          : product.price;
        
        return minProductPrice >= priceRange.min && minProductPrice <= priceRange.max;
      });
    }
    
    // Apply sorting
    filtered = filtered.sort((a, b) => {
      // Get the minimum price for each product
      const aPrice = a.prices?.length 
        ? Math.min(...a.prices.map(p => p.price)) 
        : a.price;
      
      const bPrice = b.prices?.length 
        ? Math.min(...b.prices.map(p => p.price)) 
        : b.price;
      
      // Get the vendor count for each product
      const aVendorCount = a.prices?.length || 0;
      const bVendorCount = b.prices?.length || 0;
      
      switch (sortParam) {
        case 'price_asc':
          return aPrice - bPrice;
        case 'price_desc':
          return bPrice - aPrice;
        case 'stores': 
          return bVendorCount - aVendorCount;
        case 'rating':
          return b.rating - a.rating;
        case 'relevance':
        default:
          return 0; // Keep original order for relevance
      }
    });
    
    setFilteredResults(filtered);
  }, [initialProducts, sortParam, filteredVendors, inStockOnly, priceRange]);
  
  const handlePriceRangeFilter = (min: number, max: number) => {
    setPriceRange({ min, max });
  };
  
  return {
    filteredResults,
    sortParam,
    filteredVendors,
    inStockOnly,
    priceRange,
    setFilteredVendors,
    setInStockOnly,
    handlePriceRangeFilter
  };
};
