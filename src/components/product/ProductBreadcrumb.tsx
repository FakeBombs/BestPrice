import React from 'react';
import { Link } from 'react-router-dom';
import { Product, categories, mainCategories } from '@/data/mockData';

interface ProductBreadcrumbProps {
  product: Product;
}

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  const getCategoryPath = (category: any, slugs: string[], isFinal: boolean) => {
    const categorySlug = category.slug;
    const categoryTitle = category.name;

    const path = `/cat/${slugs.join('/')}/${categorySlug}`.replace(/\/+/g, '/');

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
    
    const path = findCategoryPath(category.parentId, [...slugs, category.slug]); // Build the slug path recursively

    // If there's a main category, add it at the start
    if (mainCategory) {
      path.unshift(getCategoryPath(mainCategory, [], false)); // Add main category, mark as not final
    }

    return [...path, getCategoryPath(category, slugs, categoryId === product.categoryIds[0])]; // Add current category path
  };

  // Assuming product has categoryIds and we want the first one for the breadcrumb
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
