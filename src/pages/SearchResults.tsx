
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProducts, getCategories, vendors, brands } from '@/data/mockData';
import Sidebar from '@/components/search/Sidebar';
import ProductCard from '@/components/ProductCard';
import SearchHeader from '@/components/search/SearchHeader';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProductFilters } from '@/hooks/useProductFilters';

const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const storeFilter = searchParams.get('store') || '';
  const vendorFilter = searchParams.get('vendor') || '';
  const brandFilter = searchParams.get('brand') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get sort order from query params or default to 'relevance'
  const sortParam = searchParams.get('o') || 'relevance';
  
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await searchProducts(query);
        
        // Apply vendor filter if present
        let filteredData = data;
        if (storeFilter) {
          const vendorDomain = storeFilter;
          filteredData = filteredData.filter(product => 
            product.prices && product.prices.some(price => {
              const vendor = vendors.find(v => v.id === price.vendorId);
              return vendor?.url.includes(vendorDomain);
            })
          );
        }
        
        // Apply brand filter if present
        if (brandFilter) {
          filteredData = filteredData.filter(product => 
            product.brand.toLowerCase() === brandFilter.toLowerCase()
          );
        }
        
        setResults(filteredData);
      } catch (error) {
        console.error('Error searching products:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, storeFilter, brandFilter, vendorFilter]);

  // Apply filters and sorting
  const { filteredResults } = useProductFilters({ initialProducts: results });

  const handleSortChange = (value: string) => {
    // Update the URL with the new sort parameter
    const newParams = new URLSearchParams(searchParams);
    newParams.set('o', value);
    setSearchParams(newParams);
  };

  // Get the total count
  const totalResults = filteredResults.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchHeader query={query} resultsCount={totalResults} />
      
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        <aside className="md:w-1/4">
          <Sidebar query={query} />
        </aside>
        
        <main className="md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {loading ? 'Searching...' : `${totalResults} results`}
            </p>
            
            <Tabs defaultValue={sortParam} onValueChange={handleSortChange}>
              <TabsList>
                <TabsTrigger value="relevance">Σχετικότερα</TabsTrigger>
                <TabsTrigger value="price_asc">Φθηνότερα</TabsTrigger>
                <TabsTrigger value="price_desc">Ακριβότερα</TabsTrigger>
                <TabsTrigger value="stores">Αριθμός Καταστημάτων</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : totalResults === 0 ? (
            <div className="bg-white rounded-lg p-8 shadow text-center">
              <h2 className="text-2xl font-bold mb-4">No results found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching "{query}". Please try another search.
              </p>
              <Link to="/" className="text-blue-600 hover:underline">
                Return to homepage
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchResults;
