
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProducts, getCategories, formatSlug } from '@/data/mockData';
import Sidebar from '@/components/search/Sidebar';
import ProductCard from '@/components/ProductCard';
import SearchHeader from '@/components/search/SearchHeader';

interface SearchResultsProps {}

const SearchResults: React.FC<SearchResultsProps> = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('relevance');

  // Retrieve categories for filtering
  const allCategories = getCategories();
  
  // Add missing properties to categories for TypeScript compatibility
  const categoriesWithProperties = allCategories.map(category => ({
    ...category,
    slug: category.slug || formatSlug(category.name),
    image: category.image || category.imageUrl
  }));

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await searchProducts(query);
        setResults(data);
      } catch (error) {
        console.error('Error searching products:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSortChange = (option) => {
    setSortOption(option);
    // Implement sorting logic here
  };

  // Get the total count
  const totalResults = results.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchHeader query={query} totalResults={totalResults} />
      
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        <aside className="md:w-1/4">
          <Sidebar 
            categories={categoriesWithProperties}
            onCategoryChange={() => {}} 
            onPriceRangeChange={() => {}}
            onBrandChange={() => {}}
            onRatingChange={() => {}}
          />
        </aside>
        
        <main className="md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {loading ? 'Searching...' : `${totalResults} results`}
            </p>
            
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border rounded p-1 text-sm"
              >
                <option value="relevance">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>
            </div>
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
              {results.map((product) => (
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
