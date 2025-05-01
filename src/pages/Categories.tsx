
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getCategories, 
  getProductsByCategory, 
  getCategoryById 
} from '@/data/mockData';
import AllCategoriesView from '@/components/category/AllCategoriesView';
import SingleCategoryView from '@/components/category/SingleCategoryView';

const formatCategorySlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const Categories = () => {
  const { categoryId, categorySlug } = useParams<{ 
    categoryId?: string; 
    categorySlug?: string;
  }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // If categoryId is provided, we're viewing a specific category
  const category = categoryId ? getCategoryById(categoryId) : null;

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
      const categoryProducts = getProductsByCategory(String(category.id));
      setProducts(categoryProducts);
      setFilteredProducts(categoryProducts);
    } else {
      // No need to fetch products if no category is selected
      setProducts([]);
      setFilteredProducts([]);
    }
  }, [category]);

  // Filter and sort functions
  const handleSortChange = (value: string) => {
    const sorted = [...filteredProducts];
    
    switch (value) {
      case 'price-asc':
        sorted.sort((a, b) => {
          const aPrice = Math.min(...(a.prices?.map(p => p.price) || [Infinity]));
          const bPrice = Math.min(...(b.prices?.map(p => p.price) || [Infinity]));
          return aPrice - bPrice;
        });
        break;
      case 'price-desc':
        sorted.sort((a, b) => {
          const aPrice = Math.min(...(a.prices?.map(p => p.price) || [Infinity]));
          const bPrice = Math.min(...(b.prices?.map(p => p.price) || [Infinity]));
          return bPrice - aPrice;
        });
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews-desc':
        sorted.sort((a, b) => (b.reviews || b.reviewCount || 0) - (a.reviews || a.reviewCount || 0));
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
      product.prices?.some(price => vendors.includes(Number(price.vendorId)))
    );
    
    setFilteredProducts(filtered);
  };
  
  const handlePriceRangeFilter = (min: number, max: number) => {
    const filtered = products.filter(product => {
      const minPrice = Math.min(...(product.prices?.map(p => p.price) || [Infinity]));
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
      product.prices?.some(price => price.inStock)
    );
    
    setFilteredProducts(filtered);
  };

  // Determine which view to render
  if (category) {
    return (
      <SingleCategoryView 
        category={category} 
      />
    );
  } else {
    return (
      <AllCategoriesView />
    );
  }
};

export default Categories;
