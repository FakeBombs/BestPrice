import React from 'react';
import { Link } from 'react-router-dom';
import { Product, categories, mainCategories } from '@/data/mockData';

interface ProductBreadcrumbProps {
  product: Product;
}

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  const getCategoryPath = (mainSlug: string, subCategorySlug: string, title: string, isFinal: boolean) => {
    const path = `/cat/${mainSlug}/${subCategorySlug}`.replace(/\/+/g, '/');
    return (
      <li key={subCategorySlug}>
        <Link to={path} title={isFinal ? `Product page for ${title}` : `Browse ${title}`} data-no-info="">
          <span>{title}</span>
        </Link>
      </li>
    );
  };

  const findCategoryPath = (categoryId: number): { slug: string; title: string; isMain: boolean }[] => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];

    // Store the path
    const path: { slug: string; title: string; isMain: boolean }[] = [];

    // Find the main category
    const mainCategory = mainCategories.find(mainCat => mainCat.id === (category.parentId ? categories.find(cat => cat.id === category.parentId)?.parentId : category.parentId));

    if (mainCategory) {
      path.push({ slug: mainCategory.slug, title: mainCategory.name, isMain: true });
    }

    const buildPath = (catId: number, parentSlug: string) => {
      const subCategory = categories.find(cat => cat.id === catId);
      if (subCategory) {
        path.push({ slug: subCategory.slug, title: subCategory.name, isMain: false });
        // If there's a parent, continue going up the chain
        if (subCategory.parentId) {
          const parentMainCategory = categories.find(cat => cat.id === subCategory.parentId);
          if (parentMainCategory) {
            buildPath(parentMainCategory.id, `${parentSlug}/${subCategory.slug}`);
          }
        }
      }
    };

    buildPath(categoryId, mainCategory.slug);
    return path.reverse(); // Reverse to get the correct order from root to the final category
  };

  // Get the breadcrumb paths using the first category id of the product
  const categoryPath = findCategoryPath(product.categoryIds[0]);

  return (
    <ol>
      <li>
        <Link to="/" rel="home" data-no-info="">
          <span>BestPrice</span>
        </Link>
        <span className="trail__breadcrumb-separator">›</span>
      </li>
      {categoryPath.map((category, index) => {
        const isFinal = index === categoryPath.length - 1;
        const fullPath = `/cat/${categoryPath.slice(0, index + 1).map(cat => cat.slug).join('/')}`; // Create full path for the link
        return (
          <React.Fragment key={index}>
            {getCategoryPath(category.slug, fullPath, category.title, isFinal)}
            {index < categoryPath.length - 1 && <span className="trail__breadcrumb-separator">›</span>}
          </React.Fragment>
        );
      })}
      <li>
        <span className="trail__breadcrumb-separator">›</span>
        <span className="trail__last truncate max-w-[200px]">{product.title}</span>
      </li>
    </ol>
  );
};

export default ProductBreadcrumb;
