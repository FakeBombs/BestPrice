
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  getCategories, 
  getRootCategories, 
  getProductsByCategory, 
  getProductsByRootCategory,
  getCategoryById,
  getRootCategoryById,
  getRootCategoryBySlug,
  getCategoriesByRootCategory
} from '@/data/mockData';
import AllCategoriesView from '@/components/category/AllCategoriesView';
import RootCategoryView from '@/components/category/RootCategoryView';
import SingleCategoryView from '@/components/category/SingleCategoryView';

const Categories = () => {
  const { categoryName, rootSlug } = useParams<{ categoryName?: string; rootSlug?: string }>();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // If categoryId is provided, we're viewing a specific category
  // If rootSlug is provided, we're viewing a root category
  // If neither is provided, we're viewing all categories
  const category = categoryName ? getCategoryByName(categoryName) : null;
  const rootCategoryFromSlug = rootSlug ? getRootCategoryBySlug(rootSlug) : null;
  const rootCategory = category ? getRootCategoryById(category.rootCategoryId) : rootCategoryFromSlug;
  
  useEffect(() => {
    if (category) {
      // Fetch products for a specific category
      const categoryProducts = getProductsByCategory(category.Name);
      setProducts(categoryProducts);
      setFilteredProducts(categoryProducts);
    } else if (rootCategory) {
      // Fetch products for a root category
      const rootCategoryProducts = getProductsByRootCategory(rootCategory.id);
      setProducts(rootCategoryProducts);
      setFilteredProducts(rootCategoryProducts);
    } else {
      // No need to fetch products for all categories view
      setProducts([]);
      setFilteredProducts([]);
    }
  }, [category, rootCategory]);
  
  // Filter and sort functions
  const handleSortChange = (value: string) => {
    const sorted = [...filteredProducts];
    
    switch (value) {
      case 'price-asc':
        sorted.sort((a, b) => {
          const aPrice = a.prices.length ? Math.min(...a.prices.map(p => p.price)) : 0;
          const bPrice = b.prices.length ? Math.min(...b.prices.map(p => p.price)) : 0;
          return aPrice - bPrice;
        });
        break;
      case 'price-desc':
        sorted.sort((a, b) => {
          const aPrice = a.prices.length ? Math.min(...a.prices.map(p => p.price)) : 0;
          const bPrice = b.prices.length ? Math.min(...b.prices.map(p => p.price)) : 0;
          return bPrice - aPrice;
        });
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews-desc':
        sorted.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }
    
    setFilteredProducts(sorted);
  };
  
  const handleVendorFilter = (vendors: string[]) => {
    if (vendors.length === 0) {
      setFilteredProducts(products);
      return;
    }
    
    const filtered = products.filter(product => 
      product.prices.some(price => vendors.includes(price.vendorId))
    );
    
    setFilteredProducts(filtered);
  };
  
  const handlePriceRangeFilter = (min: number, max: number) => {
    const filtered = products.filter(product => {
      const minPrice = product.prices.length ? Math.min(...product.prices.map(p => p.price)) : 0;
      return minPrice >= min && minPrice <= max;
    });
    
    setFilteredProducts(filtered);
  };
  
  const handleInStockOnly = (inStockOnly: boolean) => {
    if (!inStockOnly) {
      setFilteredProducts(products);
      return;
    }
    
    const filtered = products.filter(product => 
      product.prices.some(price => price.inStock)
    );
    
    setFilteredProducts(filtered);
  };
  
  // Determine which view to render
  if (category) {
    return (
      <SingleCategoryView 
        category={category} 
        products={filteredProducts}
        rootCategory={rootCategory}
        onSortChange={handleSortChange}
        onVendorFilter={handleVendorFilter}
        onPriceRangeFilter={handlePriceRangeFilter}
        onInStockOnly={handleInStockOnly}
      />
    );
  } else if (rootCategory) {
    const subcategories = getCategoriesByRootCategory(rootCategory.id);
    
    return (
      <RootCategoryView 
        rootCategory={rootCategory} 
        subcategories={subcategories}
        products={filteredProducts}
        onSortChange={handleSortChange}
        onVendorFilter={handleVendorFilter}
        onPriceRangeFilter={handlePriceRangeFilter}
        onInStockOnly={handleInStockOnly}
      />
    );
  } else {
    return (
      <AllCategoriesView 
        rootCategories={getRootCategories()} 
        categories={getCategories()} 
      />
    );
  }
};

export default Categories;
