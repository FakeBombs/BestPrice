import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getCategories, 
  getRootCategories, 
  getProductsByCategory, 
  getRootCategoryBySlug,
  getCategoryById,
  getCategoriesByRootCategory
} from '@/data/mockData';
import AllCategoriesView from '@/components/category/AllCategoriesView';
import RootCategoryView from '@/components/category/RootCategoryView';
import SingleCategoryView from '@/components/category/SingleCategoryView';

const formatCategorySlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const Categories = () => {
  const { categoryId, categorySlug, rootSlug } = useParams<{ 
    categoryId?: string; 
    categorySlug?: string;
    rootSlug?: string; 
  }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // If categoryId is provided, we're viewing a specific category
  // If rootSlug is provided, we're viewing a root category
  const category = categoryId ? getCategoryById(Number(categoryId)) : null;
  const rootCategoryFromSlug = rootSlug ? getRootCategoryBySlug(rootSlug) : null;
  const rootCategory = category ? getRootCategories().find(root => root.id === category.parentId) : rootCategoryFromSlug;

  // Redirect legacy URLs to new format
  useEffect(() => {
    if (category && !categorySlug) {
      const correctSlug = formatCategorySlug(category.name);
      navigate(`/cat/${categoryId}/${correctSlug}`, { replace: true });
    }
  }, [categoryId, category, categorySlug, navigate]);

  useEffect(() => {
    if (category) {
      // Fetch products for a specific category
      const categoryProducts = getProductsByCategory(category.id);
      setProducts(categoryProducts);
      setFilteredProducts(categoryProducts);
    } else if (rootCategory) {
      // Fetch products for a root category
      const rootCategoryProducts = getProductsByCategory(rootCategory.id);
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
          const aPrice = Math.min(...(a.prices.map(p => p.price) || [Infinity]));
          const bPrice = Math.min(...(b.prices.map(p => p.price) || [Infinity]));
          return aPrice - bPrice;
        });
        break;
      case 'price-desc':
        sorted.sort((a, b) => {
          const aPrice = Math.min(...(a.prices.map(p => p.price) || [Infinity]));
          const bPrice = Math.min(...(b.prices.map(p => p.price) || [Infinity]));
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
  
  const handleVendorFilter = (vendors: number[]) => {
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
      const minPrice = Math.min(...(product.prices.map(p => p.price) || [Infinity]));
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
