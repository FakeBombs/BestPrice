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

    // Find the main category based on the current category's parent chain
    const mainCategory = mainCategories.find(mainCat => mainCat.id === category.parentId) || 
                         (childPath.length > 0 && mainCategories.find(mainCat => mainCat.id === categories.find(cat => cat.slug === childPath[0].key).parentId));

    // If main category is found and is at the top of the hierarchy, include it in the path
    const mainSlug = mainCategory ? mainCategory.slug : '';

    // Construct full category path, ensuring the main category is included first
    const fullPath = [
      ...(childPath.length ? [getCategoryPath(mainSlug, categories.find(cat => cat.id === category.parentId)!, false)] : []), // Add main category if parent exists
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
