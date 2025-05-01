
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProducts, categories, formatSlug } from '@/data/mockData';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    // Simulate search API call
    setLoading(true);
    const timer = setTimeout(() => {
      const searchResult = searchProducts(query);
      setResults(searchResult);
      setFilteredResults(searchResult);
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);

  // Get unique categories from search results
  const uniqueCategories = React.useMemo(() => {
    const categoryMap = new Map();
    
    results.forEach(product => {
      const categoryId = String(product.categoryId);
      const category = categories.find(c => String(c.id) === categoryId);
      
      if (category && !categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          id: categoryId,
          name: category.name,
          count: 1,
          slug: category.slug || formatSlug(category.name),
          image: category.image || category.imageUrl || ''
        });
      } else if (categoryMap.has(categoryId)) {
        const current = categoryMap.get(categoryId);
        categoryMap.set(categoryId, { ...current, count: current.count + 1 });
      }
    });
    
    return Array.from(categoryMap.values());
  }, [results]);

  // Filter results when tabs or filters change
  useEffect(() => {
    let filtered = [...results];
    
    // Apply category filters if any are selected
    if (activeFilters.length > 0) {
      filtered = filtered.filter(product => 
        activeFilters.includes(String(product.categoryId))
      );
    }
    
    // Apply tab filters
    if (activeTab === 'popular') {
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (activeTab === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (activeTab === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (activeTab === 'newest') {
      // Assume we have a 'createdAt' or similar field for sorting
      // Here we'll just shuffle for demo
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }
    
    setFilteredResults(filtered);
  }, [activeTab, activeFilters, results]);

  const toggleCategoryFilter = (categoryId: string) => {
    setActiveFilters(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-2">Search Results</h1>
      {query && <p className="text-gray-600 mb-6">Showing results for "{query}"</p>}
      
      {loading ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-10 w-1/4" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-1">
              <Skeleton className="h-80 w-full" />
            </div>
            
            <div className="col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <Skeleton className="h-48 w-full mb-4" />
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <div className="flex justify-between mt-4">
                      <Skeleton className="h-6 w-1/4" />
                      <Skeleton className="h-6 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Tabs for result sorting */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Results</TabsTrigger>
              <TabsTrigger value="popular">Most Popular</TabsTrigger>
              <TabsTrigger value="price-low">Price: Low to High</TabsTrigger>
              <TabsTrigger value="price-high">Price: High to Low</TabsTrigger>
              <TabsTrigger value="newest">Newest First</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Left sidebar - Categories */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg border p-4 sticky top-4">
                <h2 className="text-lg font-medium mb-4">Categories</h2>
                
                {uniqueCategories.length > 0 ? (
                  <div className="space-y-3">
                    {uniqueCategories.map(category => (
                      <div key={category.id} className="flex items-start">
                        <Button 
                          variant={activeFilters.includes(String(category.id)) ? "default" : "outline"} 
                          size="sm"
                          className="flex items-center justify-between w-full"
                          onClick={() => toggleCategoryFilter(String(category.id))}
                        >
                          <span>{category.name}</span>
                          <span className="ml-auto text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {category.count}
                          </span>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No categories found</p>
                )}
              </div>
            </div>
            
            {/* Right content - Results grid */}
            <div className="col-span-3">
              {filteredResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.map(product => (
                    <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                      <Link to={`/product/${product.id}/${product.slug || formatSlug(product.name)}`}>
                        <img 
                          src={product.imageUrl || product.image} 
                          alt={product.title || product.name} 
                          className="w-full h-48 object-cover"
                        />
                      </Link>
                      <div className="p-4">
                        <Link to={`/product/${product.id}/${product.slug || formatSlug(product.name)}`} className="hover:text-primary">
                          <h3 className="font-medium mb-2 truncate">{product.title || product.name}</h3>
                        </Link>
                        <div className="flex items-center mb-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-sm">
                                {i < Math.floor(product.rating) ? "★" : "☆"}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">({product.reviewCount || product.reviews})</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                          <Button size="sm" asChild>
                            <Link to={`/product/${product.id}/${product.slug || formatSlug(product.name)}`}>
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No results found</h3>
                  <p className="text-gray-500 mb-6">
                    We couldn't find any products matching your search "{query}".
                  </p>
                  <Button asChild>
                    <Link to="/">Browse All Products</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;
