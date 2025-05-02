
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCategoryById, fetchProductsByCategoryId } from '@/data/mockData';
import { Category } from '@/services/categoryService';
import { Product } from '@/services/productService';
import CategoryBreadcrumb from '../components/category/CategoryBreadcrumb';
import ProductResults from '../components/search/ProductResults';
import { useProductFilters } from '@/hooks/useProductFilters';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string, categorySlug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const {
    filteredResults,
    sortParam,
    setFilteredVendors,
    setInStockOnly,
    handlePriceRangeFilter
  } = useProductFilters({ initialProducts: products });
  
  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;
      
      setLoading(true);
      
      try {
        const fetchedCategory = await getCategoryById(categoryId);
        const fetchedProducts = await fetchProductsByCategoryId(categoryId);
        
        setCategory(fetchedCategory as Category);
        setProducts(fetchedProducts as unknown as Product[]);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [categoryId]);
  
  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }
  
  if (!category) {
    return <div className="container mx-auto p-4">Category not found.</div>;
  }
  
  const handleSortChange = (value: string) => {
    // Sort logic here
    console.log(`Sort by ${value}`);
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
    <div className="container mx-auto p-4">
      <CategoryBreadcrumb category={category} />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {category.description}
        </p>
      </div>
      
      <div className="mt-8">
        <ProductResults
          filteredResults={filteredResults}
          onSortChange={handleSortChange}
          onVendorFilter={handleVendorFilter}
          onPriceRangeFilter={handlePriceRange}
          onInStockOnly={handleInStockOnly}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
