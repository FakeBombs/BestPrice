import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { categories, products } from '@/data/mockData'; // Adjust the import path
import ProductCard from '@/components/ProductCard'; // Adjust the import path

const CategoryPage: React.FC = () => {
  const { categoryId, rootCategorySlug } = useParams<{ categoryId: string; rootCategorySlug: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Find the subcategory based on the ID from the URL
  const subCategory = categories.find(cat => cat.id === parseInt(categoryId) && !cat.parentId);

  useEffect(() => {
    if (subCategory) {
      const productsToDisplay = products.filter(product => product.categoryIds.includes(subCategory.id));
      setFilteredProducts(productsToDisplay);
    }
  }, [subCategory]);

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
