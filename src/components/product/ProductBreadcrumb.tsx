import React from 'react';
import { Link } from 'react-router-dom';
import { Product, categories, mainCategories } from '@/data/mockData';

interface ProductBreadcrumbProps {
  product: Product;
}

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  const getCategoryPath = (mainSlug: string, category: any, isFinal: boolean) => {
    const categorySlug = category.slug;
    const categoryTitle = category.name;

    // Construct the path correctly with the main category slug
    const path = `/cat/${mainSlug}/${categorySlug}`.replace(/\/+/g, '/');

    return (
      <li key={categorySlug}>
        <Link 
          to={path} 
          title={isFinal ? `All products in the category ${categoryTitle}` : `All products and subcategories in ${categoryTitle}`} 
          data-no-info=""
        >
          <span>{categoryTitle}</span>
        </Link>
      </li>
    );
  };

  const findCategoryPath = (categoryId: number): React.ReactNode[] => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];

    // Recursively find the category path
    const childPath = category.parentId ? findCategoryPath(category.parentId) : []; 

    // Find the main category by climbing up the hierarchy
    const mainCategory = mainCategories.find(mainCat => mainCat.id === (category.parentId ? categories.find(cat => cat.id === category.parentId)?.parentId : category.parentId)) || {};

    // If the main category is found, include its slug
    const mainSlug = mainCategory.slug || '';
    
    // Create an array and ensure the main category is the first item
    const fullPath = [
      ...childPath, // Add all upstream categories
      getCategoryPath(mainSlug, category, categoryId === product.categoryIds[0]), // Also add the current category
    ];

    // Prepend the main category to the path
    const mainCategoryPath = getCategoryPath(mainSlug, mainCategory, false);
    return [mainCategoryPath, ...fullPath]; // Return with the main category as the first item
  };

  // Get the breadcrumb path using the first category id of the product
  const categoryPath = findCategoryPath(product.categoryIds[0]);

  return (
    <ol>
      <li>
        <Link to="/" rel="home" data-no-info="">
          <span>BestPrice</span>
        </Link>
        <span className="trail__breadcrumb-separator">›</span>
      </li>
      {categoryPath.map((category, index) => (
        <React.Fragment key={index}>
          {category}
          {index < categoryPath.length - 1 && <span className="trail__breadcrumb-separator">›</span>}
        </React.Fragment>
      ))}
      <li>
        <span className="trail__breadcrumb-separator">›</span>
        <span className="trail__last truncate max-w-[200px]">{product.title}</span>
      </li>
    </ol>
  );
};

export default ProductBreadcrumb;
