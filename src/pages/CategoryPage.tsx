import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { categories, products } from '@/data/mockData'; // Adjust the import path
import ProductCard from '@/components/ProductCard'; // Adjust the import path

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  
  // Find the main category based on the ID from the URL
  const mainCategory = categories.find(cat => cat.id === parseInt(categoryId) && !cat.parentId);

  useEffect(() => {
    if (mainCategory) {
      // Set subcategories belonging to the main category
      const subCategoriesToDisplay = categories.filter(cat => cat.parentId === mainCategory.id);
      setSubCategories(subCategoriesToDisplay);
      
      // Also fetch products related to the main category's subcategories
      const productsToDisplay = products.filter(product => 
        product.categoryIds.includes(mainCategory.id)
      );
      setFilteredProducts(productsToDisplay);
    }
  }, [mainCategory]);

  if (!mainCategory) {
    return <h1>Main Category Not Found</h1>;
  }

  return (
    <div>
      <h1>{mainCategory.name}</h1>
      <h2>Subcategories:</h2>
      {subCategories.length === 0 ? (
        <p>No subcategories found.</p>
      ) : (
        <ul>
          {subCategories.map(subCategory => (
            <li key={subCategory.id}>
              <a href={`/cat/${subCategory.id}/${subCategory.slug}`}>
                {subCategory.name}
              </a>
            </li>
          ))}
        </ul>
      )}
      
      <h2>Products:</h2>
      {filteredProducts.length === 0 ? (
        <p>No products found for this category.</p>
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
