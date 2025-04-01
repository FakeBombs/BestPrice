
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchProducts } from '@/data/mockData';
import { Product } from '@/data/mockData';
import Sidebar from '@/components/search/Sidebar';
import SearchHeader from '@/components/search/SearchHeader';
import ProductResults from '@/components/search/ProductResults';
import NotificationButton from '@/components/search/NotificationButton';
import { useProductFilters } from '@/hooks/useProductFilters';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  
  // Fetch search results
  useEffect(() => {
    if (query) {
      const searchResults = searchProducts(query);
      setResults(searchResults);
    }
  }, [query]);
  
  // Use our custom hook for filtering
  const {
    filteredResults,
    setSortOrder,
    setFilteredVendors,
    setInStockOnly,
    handlePriceRangeFilter
  } = useProductFilters({ initialProducts: results });
  
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
                  onPriceRangeFilter={handlePriceRangeFilter}
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
