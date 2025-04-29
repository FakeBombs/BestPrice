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
          title={isFinal ? `Όλα τα προϊόντα της κατηγορίας ${categoryTitle}` : `Όλα τα προϊόντα και οι υποκατηγορίες της κατηγορίας ${categoryTitle}`} 
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
    
    // Determine the main category based on parentId
    const mainCategory = mainCategories.find(mainCat => mainCat.id === category.parentId) || {};

    // Recursively find the category path
    const childPath = category.parentId ? findCategoryPath(category.parentId) : []; 

    // Include the main category slug as the first item
    const mainSlug = mainCategory.slug || '';

    // Construct full category path
    const fullPath = [
      ...childPath,
      getCategoryPath(mainSlug, category, categoryId === product.categoryIds[0]),
    ];

    return fullPath;
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
