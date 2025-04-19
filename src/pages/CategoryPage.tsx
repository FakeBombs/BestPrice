import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { categories, products } from '@/data/mockData'; // Adjust the import path as needed
import ProductCard from '@/components/ProductCard'; // Adjust the import path as needed

// CategoryPage component
const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>(); // Change to get category ID
  const { rootCategorySlug } = useParams<{ rootCategorySlug: string }>(); // Route for category slug
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // State for products

  // Locate the subcategory based on the ID from the URL
  const subCategory = categories.find(cat => cat.id === parseInt(categoryId));

  useEffect(() => {
    if (subCategory) {
      const productsToDisplay = products.filter(product => product.categoryIds.includes(subCategory.id));
      setFilteredProducts(productsToDisplay);
    }
  }, [subCategory]);

  // If no matching subcategory was found
  if (!subCategory) {
    return <h1>Category Not Found: "{rootCategorySlug}"</h1>;
  }

  return (
    <div>
      <h1>{subCategory.name}</h1>
      {filteredProducts.length === 0 ? (
        <p>No products found matching your search.</p>
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
