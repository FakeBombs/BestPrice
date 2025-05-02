
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchHeader from '@/components/search/SearchHeader';
import Sidebar from '@/components/search/Sidebar';
import ProductResults from '@/components/search/ProductResults';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProductFilters } from '@/hooks/useProductFilters';
import { searchProducts, Product, SearchFilters } from '@/services/productService';
import { getAllBrands } from '@/services/brandService';
import { getAllVendors } from '@/services/vendorService';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState([]);
  const [vendors, setVendors] = useState([]);
  
  const {
    filteredResults,
    sortParam,
    setFilteredVendors,
    setInStockOnly,
    handlePriceRangeFilter
  } = useProductFilters({ initialProducts: products });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Create a proper SearchFilters object
        const searchFilters: SearchFilters = {
          query: query,
          category_id: category || undefined,
          sort_by: 'relevance'
        };
        
        const { products: searchResults } = await searchProducts(searchFilters);
        setProducts(searchResults);
        
        const brandsData = await getAllBrands();
        setBrands(brandsData);
        
        const vendorsData = await getAllVendors();
        setVendors(vendorsData);
      } catch (error) {
        console.error('Error fetching search data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [query, category]);

  const handleSortChange = (value: string) => {
    // Handle sort change
    console.log("Sort change:", value);
  };

  const handleVendorFilter = (vendors: string[]) => {
    setFilteredVendors(vendors);
  };

  const handlePriceRange = (min: number, max: number) => {
    handlePriceRangeFilter(min, max);
  };

  const handleInStockOnly = (inStockOnly: boolean) => {
    setInStockOnly(inStockOnly);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <SearchHeader 
        query={query} 
        resultsCount={products.length} 
      />
      
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        <aside className="w-full lg:w-1/4">
          <Sidebar 
            query={query} 
            brands={brands} 
            vendors={vendors}
            onInStockOnly={handleInStockOnly}
            onVendorFilter={handleVendorFilter}
            onPriceRangeFilter={handlePriceRange}
          />
        </aside>
        
        <main className="w-full lg:w-3/4">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="products">Προϊόντα</TabsTrigger>
              <TabsTrigger value="shops">Καταστήματα</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Button variant="ghost" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Φόρτωση...
              </Button>
            </div>
          ) : (
            <ProductResults 
              filteredResults={filteredResults}
              onSortChange={handleSortChange}
              onVendorFilter={handleVendorFilter}
              onPriceRangeFilter={handlePriceRange}
              onInStockOnly={handleInStockOnly}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchResults;
