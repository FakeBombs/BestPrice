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
    const breadcrumbs: React.ReactNode[] = [];
    const addCategoryToBreadcrumb = (id: number) => {
      const category = categories.find(cat => cat.id === id);
      if (!category) return;

      // Adding the category to the breadcrumbs
      breadcrumbs.unshift(getCategoryPath(mainCategories.find(mainCat => mainCat.id === category.parentId)?.slug, category.slug, category.name, false));
      
      if (category.parentId) {
        addCategoryToBreadcrumb(category.parentId);  // Recur to add parent categories
      }
    };

    addCategoryToBreadcrumb(categoryId);
    
    // Lastly add the current product category as the last breadcrumb
    const currentCategory = categories.find(cat => cat.id === categoryId);
    if (currentCategory) {
      breadcrumbs.push(getCategoryPath(mainCategories.find(mainCat => mainCat.id === currentCategory.parentId)?.slug, currentCategory.slug, currentCategory.name, true));
    }
    
    return breadcrumbs;
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
