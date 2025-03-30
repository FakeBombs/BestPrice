
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchProducts } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';
import { Product } from '@/data/mockData';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState('price-asc');
  const [filteredVendors, setFilteredVendors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  
  useEffect(() => {
    if (query) {
      const searchResults = searchProducts(query);
      setResults(searchResults);
      setFilteredResults(searchResults);
    }
  }, [query]);
  
  useEffect(() => {
    let filtered = [...results];
    
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
  }, [results, sortOrder, filteredVendors, inStockOnly]);
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-muted-foreground mb-6">
        {filteredResults.length} results for "{query}"
      </p>
      
      <ProductFilter 
        onSortChange={setSortOrder}
        onVendorFilter={setFilteredVendors}
        onPriceRangeFilter={(min, max) => console.log(min, max)}
        onInStockOnly={setInStockOnly}
      />
      
      {filteredResults.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No products found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
