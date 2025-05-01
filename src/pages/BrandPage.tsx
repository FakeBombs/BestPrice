
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Product, 
  Brand, 
  categories, 
  formatSlug, 
  getProductsByBrand 
} from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import { Filter } from 'lucide-react';

interface BrandPageProps {}

// Add this missing function to fetch products by brand
function getProductsByBrand(brandId: string): Product[] {
  // This is a mock implementation, replace with actual logic based on your data structure
  return []; // Placeholder
}

const BrandPage: React.FC<BrandPageProps> = () => {
  const { id, name } = useParams<{ id: string; name: string }>();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [activeSort, setActiveSort] = useState('popular');
  const [filtersVisible, setFiltersVisible] = useState(false);

  useEffect(() => {
    // Fetch brand details
    const fetchBrand = () => {
      // Mock implementation - replace with actual API call
      setBrand({
        id: id || '1',
        name: name || 'Brand Name',
        logo: '/dist/images/brands/default-logo.png'
      });
    };

    // Fetch products
    const fetchProducts = () => {
      // Mock implementation - replace with actual API call
      if (id) {
        const brandProducts = getProductsByBrand(id);
        setProducts(brandProducts);
      }
    };

    fetchBrand();
    fetchProducts();
  }, [id, name]);

  // Get unique categories from products
  const uniqueCategories = React.useMemo(() => {
    const categoryMap = new Map<string, { id: string; name: string }>();
    
    products.forEach(product => {
      const categoryId = String(product.categoryId);
      const category = categories.find(c => String(c.id) === categoryId);
      
      if (category && !categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          id: categoryId,
          name: category.name
        });
      }
    });
    
    return Array.from(categoryMap.values());
  }, [products]);

  // Handle category filter changes
  const handleCategoryFilter = (categoryId: string) => {
    setCategoryFilters(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Filter products based on active filters
  const filteredProducts = React.useMemo(() => {
    let result = [...products];
    
    // Apply category filters
    if (categoryFilters.length > 0) {
      result = result.filter(product => 
        categoryFilters.includes(String(product.categoryId))
      );
    }
    
    // Apply tab filters
    if (activeTab !== 'all') {
      // Implement specific tab filtering logic here
      // For example, if activeTab is 'new', filter for new products
    }
    
    // Apply sorting
    switch (activeSort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        // Default sorting (popular) implementation
        break;
    }
    
    return result;
  }, [products, categoryFilters, activeTab, activeSort]);

  if (!brand) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Brand Header */}
      <div className="flex items-center space-x-4 mb-6">
        {brand.logo && (
          <img src={brand.logo} alt={brand.name} className="w-16 h-16 object-contain" />
        )}
        <h1 className="text-2xl font-bold">{brand.name}</h1>
      </div>
      
      {/* Tabs and Filters */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="new">New Arrivals</TabsTrigger>
              <TabsTrigger value="popular">Most Popular</TabsTrigger>
              <TabsTrigger value="deals">Deals</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFiltersVisible(!filtersVisible)}
            className="ml-2"
          >
            <Filter className="mr-2 h-4 w-4" /> 
            Filters
          </Button>
        </div>
        
        {filtersVisible && (
          <div className="p-4 border rounded-md mb-4">
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {uniqueCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={categoryFilters.includes(category.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryFilter(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
            
            <h3 className="font-medium mb-2 mt-4">Sort By</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeSort === 'popular' ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSort('popular')}
              >
                Popular
              </Button>
              <Button
                variant={activeSort === 'price-asc' ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSort('price-asc')}
              >
                Price: Low to High
              </Button>
              <Button
                variant={activeSort === 'price-desc' ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSort('price-desc')}
              >
                Price: High to Low
              </Button>
              <Button
                variant={activeSort === 'rating' ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSort('rating')}
              >
                Highest Rated
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={String(product.id)} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center p-8">
            <p className="text-gray-500">No products found for this brand.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;
