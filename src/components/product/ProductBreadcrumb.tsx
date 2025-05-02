import React from 'react';
import { Link } from 'react-router-dom';
import { Product, categories, mainCategories, Category } from '@/data/mockData';

// Combine main and subcategories for easier lookups
const allCategories = [...mainCategories, ...categories];

interface ProductBreadcrumbProps {
  product: Product;
}

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  const pathCategories: Category[] = [];

  // Find the full path: Start from the product's category and go up
  if (product.categoryIds && product.categoryIds.length > 0) {
    const leafCategoryId = product.categoryIds[0];
    let currentCat = allCategories.find(cat => cat.id === leafCategoryId);

    while (currentCat) {
      pathCategories.unshift(currentCat);
      if (currentCat.parentId === null) {
        break;
      }
      const parentCat = allCategories.find(cat => cat.id === currentCat?.parentId);
      currentCat = parentCat;
    }
  }
  // pathCategories now holds the hierarchy: [MainCategory, ..., ParentCategory, LeafCategory]

  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      <ol>
        {/* 1. Home Link */}
        <li><Link to="/" rel="home"><span>BestPrice</span></Link></li>

        {/* 2. Category Path Links */}
        {pathCategories.map((category, index) => {
            // Determine if this is the last category in the generated path for this product
            const isFinal = index === pathCategories.length - 1;

            // Construct the title dynamically based on whether it's the last category link
            const linkTitle = isFinal
              ? `Όλα τα προϊόντα της κατηγορίας ${category.name}`
              : `Όλα τα προϊόντα και οι υποκατηγορίες της κατηγορίας ${category.name}`;

            return (
              <li key={category.id}>
                <span className="trail__breadcrumb-separator">›</span>
                <Link to={`/cat/${category.id}/${category.slug}`} title={linkTitle}><span>{category.name}</span></Link>
              </li>
            );
        })}

        {/* 3. Product Title (Not a link) */}
        <li>
          {/* Add separator only if there were categories in the path */}
          {pathCategories.length > 0 && <span className="trail__breadcrumb-separator">›</span>}
          {/* Use product.name or product.title depending on your Product type */}
          <span className="trail__last truncate max-w-[200px]">{product.title}</span>
        </li>
      </ol>
    </nav>
  );
};

export default ProductBreadcrumb;
