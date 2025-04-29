import React from 'react';
import { Link } from 'react-router-dom';
import { Product, categories, mainCategories } from '@/data/mockData';

interface ProductBreadcrumbProps {
  product: Product;
}

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  const getCategoryPath = (mainSlug: string, slug: string, title: string, isFinal: boolean) => {
    const path = `/cat/${mainSlug}/${slug}`.replace(/\/+/g, '/');

    return (
      <li key={slug}>
        <Link 
          to={path} 
          title={isFinal ? `Όλα τα προϊόντα της κατηγορίας ${title}` : `Όλα τα προϊόντα και οι υποκατηγορίες της κατηγορίας ${title}`} 
          data-no-info=""
        >
          <span>{title}</span>
        </Link>
      </li>
    );
  };

  const findCategoryPath = (categoryId: number): React.ReactNode[] => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];

    const breadcrumbPath: React.ReactNode[] = [];

    // Recursively find all parent categories
    const getParentCategories = (catId: number) => {
      const cat = categories.find(c => c.id === catId);
      if (!cat) return;
      // Get parent category recursively
      if (cat.parentId) {
        getParentCategories(cat.parentId);
      }
      // Ensuring we get the main category slug 
      const mainCategory = mainCategories.find(mainCat => mainCat.id === (cat.parentId ? 
        categories.find(c => c.id === cat.parentId)?.parentId : cat.parentId));
      if (mainCategory) {
        breadcrumbPath.push(getCategoryPath(mainCategory.slug, cat.slug, cat.name, false));
      }
    };

    getParentCategories(categoryId);

    // Add the current category as the last breadcrumb
    breadcrumbPath.push(getCategoryPath(category.slug, category.slug, category.name, true));

    return breadcrumbPath;
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
