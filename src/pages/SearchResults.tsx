
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchProducts } from '@/data/mockData';
import { Product } from '@/data/mockData';
import Sidebar from '@/components/search/Sidebar';
import SearchHeader from '@/components/search/SearchHeader';
import ProductResults from '@/components/search/ProductResults';
import NotificationButton from '@/components/search/NotificationButton';

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
    <div id="root" className="clr">
      <div className="root__wrapper">
        <div className="root">
          <div className="page-products">
            <Sidebar query={query} />

            <main className="page-products__main">
              <SearchHeader query={query} resultsCount={filteredResults.length} />

              <div className="page-products__main-wrapper">
                <ProductResults
                  filteredResults={filteredResults}
                  onSortChange={setSortOrder}
                  onVendorFilter={setFilteredVendors}
                  onPriceRangeFilter={(min, max) => console.log(min, max)}
                  onInStockOnly={setInStockOnly}
                />
              </div>

              <NotificationButton query={query} />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
