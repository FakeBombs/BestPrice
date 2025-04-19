import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { categories, products } from '@/data/mockData'; // Adjust the import path
import ProductCard from '@/components/ProductCard'; // Adjust the import path

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);

  // Find the subcategory based on the ID from the URL
  const subCategoryId = parseInt(categoryId);
  const subCategory = categories.find(cat => cat.id === subCategoryId);

  useEffect(() => {
    if (subCategory) {
      setCurrentCategory(subCategory);
      // Get products that belong to the category ID of the subcategory
      const productsToDisplay = products.filter(product => product.categoryIds.includes(subCategoryId));
      setFilteredProducts(productsToDisplay);
    }
  }, [subCategory, subCategoryId]);

  if (!currentCategory) {
    return <h1>Category Not Found</h1>;
  }

  return (
    <div>
      <h1>{currentCategory.name}</h1>
      {filteredProducts.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
