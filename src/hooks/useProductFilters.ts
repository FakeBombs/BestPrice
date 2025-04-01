
import { useState, useEffect } from 'react';
import { Product } from '@/data/mockData';

interface UseProductFiltersProps {
  initialProducts: Product[];
}

export const useProductFilters = ({ initialProducts }: UseProductFiltersProps) => {
  const [filteredResults, setFilteredResults] = useState<Product[]>(initialProducts);
  const [sortOrder, setSortOrder] = useState('price-asc');
  const [filteredVendors, setFilteredVendors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<{min: number, max: number} | null>(null);
  
  // Apply filters whenever dependencies change
  useEffect(() => {
    let filtered = [...initialProducts];
    
    // Apply vendor filter
    if (filteredVendors.length > 0) {
      filtered = filtered.filter(product => 
        product.prices.some(price => 
          filteredVendors.includes(price.vendorId)
        )
      );
    }
    
    // Apply in-stock filter
    if (inStockOnly) {
      filtered = filtered.filter(product => 
        product.prices.some(price => price.inStock)
      );
    }
    
    // Apply price range filter
    if (priceRange) {
      filtered = filtered.filter(product => {
        const minProductPrice = Math.min(...product.prices.map(p => p.price));
        return minProductPrice >= priceRange.min && minProductPrice <= priceRange.max;
      });
    }
    
    // Apply sorting
    filtered = filtered.sort((a, b) => {
      const aPrice = Math.min(...a.prices.map(p => p.price));
      const bPrice = Math.min(...b.prices.map(p => p.price));
      
      switch (sortOrder) {
        case 'price-asc':
          return aPrice - bPrice;
        case 'price-desc':
          return bPrice - aPrice;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'reviews-desc':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });
    
    setFilteredResults(filtered);
  }, [initialProducts, sortOrder, filteredVendors, inStockOnly, priceRange]);
  
  const handlePriceRangeFilter = (min: number, max: number) => {
    setPriceRange({ min, max });
  };
  
  return {
    filteredResults,
    sortOrder,
    filteredVendors,
    inStockOnly,
    priceRange,
    setSortOrder,
    setFilteredVendors,
    setInStockOnly,
    handlePriceRangeFilter
  };
};
