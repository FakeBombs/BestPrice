import React from 'react';
import { Link } from 'react-router-dom';
import { Product, categories } from '@/data/mockData';

interface ProductBreadcrumbProps {
  product: Product;
}

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  const getCategoryPath = (category: any, isFinal: boolean) => {
    const categorySlug = category.slug;
    const categoryTitle = category.name;

    return (
      <li key={categorySlug}>
        <Link to={`/cat/${category.id}/${categorySlug}`} title={isFinal ? `Όλα τα προϊόντα της κατηγορίας ${categoryTitle}` : `Όλα τα προϊόντα και οι υποκατηγορίες της κατηγορίας ${categoryTitle}`} data-no-info="">
          <span>{categoryTitle}</span>
        </Link>
      </li>
    );
  };

  const findCategoryPath = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];

    const parentCategory = categories.find(cat => category.parentId === cat.id);
    const hasSubcategories = categories.some(cat => cat.parentId === categoryId);

    if (parentCategory) {
      const parentPath = findCategoryPath(parentCategory.id);
      return [...parentPath, getCategoryPath(category, !hasSubcategories)];
    } else {
      return [getCategoryPath(category, !hasSubcategories)];
    }
  };

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
