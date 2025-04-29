import React from 'react';
import { Link } from 'react-router-dom';
import { Product, categories, mainCategories } from '@/data/mockData';

interface ProductBreadcrumbProps {
  product: Product;
}

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  const getCategoryPath = (path: string, title: string, isFinal: boolean) => {
    return (
      <li key={path}>
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

  const findCategoryPath = (categoryId: number): { path: string; title: string }[] => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];

    // Gather path parts
    const pathParts: { path: string; title: string }[] = [];

    // Find main category's slug
    const mainCategory = mainCategories.find(mainCat => 
      mainCat.id === (category.parentId ? categories.find(cat => cat.id === category.parentId)?.parentId : category.parentId)
    );

    // Build path starting from main category
    if (mainCategory) {
      const mainPath = `/cat/${mainCategory.slug}`;
      pathParts.push({ path: mainPath, title: mainCategory.name }); // Main Category
    }

    // Build ancestor paths
    const buildPath = (catId: number, parentSlug: string) => {
      const subCategory = categories.find(cat => cat.id === catId);
      if (subCategory) {
        const currentSlug = subCategory.slug;
        const fullPath = `${parentSlug}/${currentSlug}`;
        pathParts.push({ path: fullPath, title: subCategory.name }); // Push current subcategory
        // Continue if there is a parent
        if (subCategory.parentId) {
          buildPath(subCategory.parentId, parentSlug);
        }
      }
    };

    buildPath(categoryId, mainCategory.slug); // Starting point of recursive function
    return pathParts.reverse(); // Reverse the order to go from root to current category
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
          {getCategoryPath(category.path, category.title, index === categoryPath.length - 1)}
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
