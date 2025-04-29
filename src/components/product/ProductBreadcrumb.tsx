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

    const path = isFinal 
      ? `/cat/${mainSlug}/${categorySlug}` 
      : `/cat/${mainSlug}/${categorySlug}`;

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

  const findCategoryPath = (categoryId: number, slugs: string[] = []): React.ReactNode[] => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];

    // To handle the relationship with main categories
    const mainCategory = mainCategories.find(mainCat => mainCat.id === category.parentId);
    
    const childPath = findCategoryPath(category.parentId, [...slugs, category.slug]); // Build the slug path recursively

    // In case there's a main category
    const mainSlug = mainCategory ? mainCategory.slug : '';

    // Create full category path including main category
    const fullPath = [
      ...childPath, // Path leading to this category
      getCategoryPath(mainSlug, category, categoryId === product.categoryIds[0])
    ];

    return fullPath;
  };

  // Get the breadcrumb path starting from the first category id of the product
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
