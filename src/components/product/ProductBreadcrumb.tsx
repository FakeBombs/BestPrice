import React from 'react';
import { Link } from 'react-router-dom';
import { Product, categories, mainCategories } from '@/data/mockData';

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

    const path = findCategoryPath(category.parentId); // Recursive call to get all parent categories

    // After getting parents, we need to check for main categories
    const mainCategory = mainCategories.find(mainCat => mainCat.id === category.parentId);
    if (mainCategory) {
      path.unshift(getCategoryPath(mainCategory, false)); // Add main category first if it exists
    }
    
    // Push the current category to the path
    path.push(getCategoryPath(category, true)); // Mark the last category as final

    return path;
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
