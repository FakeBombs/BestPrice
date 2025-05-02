
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProductsByQuery, Product } from '@/services/productService';
import SearchHeader from '@/components/search/SearchHeader';
import ProductResults from '@/components/search/ProductResults';
import Sidebar from '@/components/search/Sidebar';
import { useProductFilters } from '@/hooks/useProductFilters';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Use the hook for filtering functionality
  const {
    filteredResults,
    handleSortChange,
    handleVendorFilter,
    handlePriceRangeFilter,
    handleInStockOnly
  } = useProductFilters(products);
  
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Search for products based on query
        const results = await getProductsByQuery(query);
        setProducts(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [query]);
  
  return (
    <div className="container mx-auto px-4 pt-6 pb-16">
      <SearchHeader 
        query={query}
        count={filteredResults.length}
        loading={loading}
      />
      
      <div className="flex flex-col md:flex-row mt-6 gap-6">
        {/* Sidebar with filters */}
        <div className="w-full md:w-1/4 lg:w-1/5">
          <Sidebar 
            vendors={[]}
            selectedVendors={[]}
            priceRange={{min: 0, max: 10000}}
            inStockOnly={false}
            onVendorChange={handleVendorFilter}
            onPriceChange={handlePriceRangeFilter}
            onInStockChange={handleInStockOnly}
          />
        </div>
        
        {/* Search results */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          <ProductResults 
            products={filteredResults}
            onSort={handleSortChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
