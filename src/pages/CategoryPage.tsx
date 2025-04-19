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
    
    if (subCategory) {
      setCurrentCategory(subCategory);
      const productsToDisplay = products.filter(product => product.categoryIds.includes(subCategoryId));
      setFilteredProducts(productsToDisplay);
    } else {
      setCurrentCategory(undefined); // Ensure category is unset if not found
    }
  }, [categoryId]);

  if (!currentCategory) {
    return <h1>Category Not Found</h1>;
  }

  if (filteredProducts.length === 0) {
    return <p>No products found in this category.</p>;
  }

  const sortProducts = (productsToSort: Product[], sortType: string) => {
    switch (sortType) {
      case 'price-asc':
        return [...productsToSort].sort((a, b) => a.prices[0].price - b.prices[0].price);
      case 'price-desc':
        return [...productsToSort].sort((a, b) => b.prices[0].price - a.prices[0].price);
      case 'rating-desc':
      default:
        return [...productsToSort].sort((a, b) => b.rating - a.rating);
    }
  };

  const sortedProducts = sortProducts(filteredProducts, 'rating-desc'); // You can change this sortType based on your needs

  return (
    <div className="root__wrapper">
      <h2>{currentCategory.name}</h2>
      <div className="products-grid">
        {sortedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
