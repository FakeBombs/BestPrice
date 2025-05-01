
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getCategories, 
  getProductsByCategory, 
  getCategoryById, 
  formatSlug 
} from '@/data/mockData';
import AllCategoriesView from '@/components/category/AllCategoriesView';
import SingleCategoryView from '@/components/category/SingleCategoryView';

const Categories = () => {
  const { categoryId, categorySlug } = useParams<{ 
    categoryId?: string; 
    categorySlug?: string;
  }>();
  const navigate = useNavigate();

  // If categoryId is provided, we're viewing a specific category
  const category = categoryId ? getCategoryById(categoryId) : null;
  
  // Fetch products for this category if needed
  const [products, setProducts] = useState<any[]>([]);
  
  useEffect(() => {
    if (categoryId) {
      const categoryProducts = getProductsByCategory(categoryId);
      setProducts(categoryProducts);
    }
  }, [categoryId]);

  // Redirect legacy URLs to new format
  useEffect(() => {
    if (category && !categorySlug) {
      const correctSlug = formatSlug(category.name);
      navigate(`/cat/${categoryId}/${correctSlug}`, { replace: true });
    }
  }, [categoryId, category, categorySlug, navigate]);

  // Handlers for SingleCategoryView props
  const handleSortChange = (value: string) => {
    // Implementation for sorting products
    console.log('Sort changed to:', value);
  };
  
  const handleVendorFilter = (vendors: number[]) => {
    // Implementation for filtering by vendors
    console.log('Vendor filter changed to:', vendors);
  };
  
  const handlePriceRangeFilter = (min: number, max: number) => {
    // Implementation for filtering by price range
    console.log('Price range filter changed to:', min, max);
  };
  
  const handleInStockOnly = (inStockOnly: boolean) => {
    // Implementation for filtering by stock availability
    console.log('In stock only changed to:', inStockOnly);
  };

  // Determine which view to render
  if (category) {
    return (
      <SingleCategoryView 
        category={category}
        onSortChange={handleSortChange}
        onVendorFilter={handleVendorFilter}
        onPriceRangeFilter={handlePriceRangeFilter}
        onInStockOnly={handleInStockOnly}
      />
    );
  } else {
    return <AllCategoriesView />;
  }
};

export default Categories;
