import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { categories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string; slug: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const subCategoryId = parseInt(categoryId);
        const subCategory = categories.find(cat => cat.id === subCategoryId);
        
        if (!subCategory) {
          throw new Error("Category not found");
        }

        setCurrentCategory(subCategory);
        
        const productsToDisplay = products.filter(product => product.categoryIds.includes(subCategoryId));
        if (productsToDisplay.length === 0) {
          throw new Error("No products found for this category");
        }

        setFilteredProducts(productsToDisplay);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  
  if (error) {
    return <h1>Error: {error}</h1>;
  }

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

  const sortedProducts = sortProducts(filteredProducts, 'rating-desc');

  return (
    <div className="root__wrapper">
      <h2>{currentCategory.name}</h2>
      <div className="products-grid">
        {sortedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="additional-info">
        <p>For more information about this category, visit the <a href={`/category/${categoryId}/info`}>info page</a>.</p>
      </div>
    </div>
  );
};

export default CategoryPage;
