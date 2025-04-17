import React from 'react';
import { useParams } from 'react-router-dom';
import { categories } from '@/data/mockData'; // Adjust the path as needed
import CategoryCard from '@/components/CategoryCard'; // Adjust the path based on your project structure

const CategoryPage: React.FC = () => {
  const { rootCategorySlug } = useParams<{ rootCategorySlug: string }>();

  // Find the root category based on the slug
  const rootCategory = categories.find(category => category.slug === rootCategorySlug);
  
  // If the root category is not found, you can handle it with a not found message or redirect
  if (!rootCategory) {
    return <h1>Category Not Found</h1>;
  }

  // Get subcategories associated with this root category
  const subCategories = categories.filter(subCategory => subCategory.rootCategoryId === rootCategory.id);

  return (
    <div className="category-page">
      <h1>{rootCategory.name}</h1>
      <div className="subcategory-list">
        {subCategories.map(subCategory => (
          <CategoryCard key={subCategory.id} category={subCategory} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
