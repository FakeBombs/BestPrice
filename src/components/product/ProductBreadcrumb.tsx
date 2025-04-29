import React from 'react';
import { Link } from 'react-router-dom';
import { Product, categories, mainCategories } from '@/data/mockData';

interface ProductBreadcrumbProps {
  product: Product;
}

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  const getCategoryPath = (slug: string, title: string, isFinal: boolean): JSX.Element => {
    const path = slug ? `/cat/${slug}` : '';
    return (
      <li key={slug}>
        <Link 
          to={path} 
          title={isFinal ? `All products in the category ${title}` : `All products and subcategories in ${title}`} 
          data-no-info=""
        >
          <span>{title}</span>
        </Link>
      </li>
    );
  };

  const findCategoryPath = (categoryId: number): { slug: string; title: string }[] => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];

    const pathParts: { slug: string; title: string }[] = [];

    // Find the ancestors
    const traverseCategories = (catId: number) => {
      const currentCategory = categories.find(cat => cat.id === catId);
      if (currentCategory) {
        pathParts.unshift({ slug: currentCategory.slug, title: currentCategory.name });
        if (currentCategory.parentId) {
          traverseCategories(currentCategory.parentId);
        }
      }
    };

    // Begin traversing from the product's category
    traverseCategories(categoryId);
    
    return pathParts;
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
          {getCategoryPath(category.slug, category.title, index === categoryPath.length - 1)}
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
