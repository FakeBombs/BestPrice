import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/data/mockData';

export const useProductFilters = (products: Product[]) => {
  const [sortParam, setSortParam] = useState<string>('default');
  const [filteredVendors, setFilteredVendors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({min: 0, max: 10000});
  
  // Apply all filters
  const filteredResults = useMemo(() => {
    let results = [...products];
    
    // Apply vendor filter
    if (filteredVendors.length > 0) {
      results = results.filter(product => {
        // If product has prices and the prices have vendors
        if (product.prices && product.prices.length > 0) {
          // We need to check vendor_id instead of vendor object
          return product.prices.some(price => 
            price.vendorId && filteredVendors.includes(price.vendorId)
          );
        }
        return false;
      });
    }
    
    // Apply in-stock filter
    if (inStockOnly) {
      results = results.filter(product => {
        if (product.prices && product.prices.length > 0) {
          return product.prices.some(price => price.inStock);
        }
        // If no price, consider not in stock
        return false;
      });
    }
    
    // Apply price filter
    results = results.filter(product => {
      const price = product.price || 0;
      return price >= priceRange.min && price <= priceRange.max;
    });
    
    // Apply sorting
    switch(sortParam) {
      case 'price-asc':
        results.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        results.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popularity':
        results.sort((a, b) => ((b.reviewCount || 0) - (a.reviewCount || 0)));
        break;
      // Default sorting keeps the original order
      default:
        break;
    }
    
    return results;
  }, [products, sortParam, filteredVendors, inStockOnly, priceRange]);
  
  // Handlers for filter changes
  const handleSortChange = (value: string) => {
    setSortParam(value);
  };
  
  const handleVendorFilter = (vendors: string[]) => {
    setFilteredVendors(vendors);
  };
  
  const handlePriceRangeFilter = (min: number, max: number) => {
    setPriceRange({min, max});
  };
  
  const handleInStockOnly = (value: boolean) => {
    setInStockOnly(value);
  };
  
  return {
    products: filteredResults,
    sortParam,
    filteredVendors,
    inStockOnly,
    priceRange,
    setFilteredVendors,
    setInStockOnly,
    handlePriceRangeFilter,
    handleSortChange,
    handleVendorFilter,
    handleInStockOnly
  };
};

export default useProductFilters;
