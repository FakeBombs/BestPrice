import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { categories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string; slug: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  
  useEffect(() => {
    const subCategoryId = parseInt(categoryId);
    const subCategory = categories.find(cat => cat.id === subCategoryId);
    // if (subCategory) { ... }
  }, [/* categoryId */]);

  if (!currentCategory) {
    return <h1>Category Not Found</h1>;
  }

  const sortProducts = (products) => {
    switch ('sortType') {
      case 'price-asc':
        return [...products].sort((a, b) => a.prices[0].price - b.prices[0].price);
      case 'price-desc':
        return [...products].sort((a, b) => b.prices[0].price - a.prices[0].price);
      case 'rating-desc':
      default:
        return [...products].sort((a, b) => b.rating - a.rating);
    }
  };

  return (
    <div className="root__wrapper">
      {/* Main components */}
    </div>
  );
};

export default CategoryPage;
