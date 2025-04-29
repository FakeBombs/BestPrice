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
          title={isFinal ? `All products in the category ${title}` : `All products and subcategories in ${title}`} 
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

    // Recursively find the category path
    const childPath = category.parentId ? findCategoryPath(category.parentId) : []; 

    // Find the main category
    const mainCategory = mainCategories.find(mainCat => mainCat.id === (category.parentId ? categories.find(cat => cat.id === category.parentId)?.parentId : category.parentId));

    // Prepare the list for breadcrumbs
    const breadcrumbPath = [];

    // If main category exists, add it to the path
    if (mainCategory) {
      breadcrumbPath.push(getCategoryPath(mainCategory.slug, '', mainCategory.name, false));
    }

    // Add all ancestors
    childPath.forEach((subCategory) => {
      const subCatSlug = subCategory.props.children.props.children; // Get slug from the breadcrumb link
      breadcrumbPath.push(getCategoryPath(mainCategory.slug, subCatSlug, subCategory.props.children.props.children, false));
    });

    // Add the current category as the last breadcrumb
    breadcrumbPath.push(getCategoryPath(mainCategory?.slug || '', category.slug, category.name, categoryId === product.categoryIds[0]));
    
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
