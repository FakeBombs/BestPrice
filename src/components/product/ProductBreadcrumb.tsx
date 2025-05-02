import React from 'react';
import { Link } from 'react-router-dom';
import { Product, categories, mainCategories, Category } from '@/data/mockData'; // Make sure Category type is imported or defined

// Combine main and subcategories for easier lookups
const allCategories = [...mainCategories, ...categories];

interface ProductBreadcrumbProps {
  product: Product;
}

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  const pathCategories: Category[] = [];

  // Find the full path: Start from the product's category and go up
  // Using the first category ID as the leaf node for the path
  if (product.categoryIds && product.categoryIds.length > 0) {
    const leafCategoryId = product.categoryIds[0];
    let currentCat = allCategories.find(cat => cat.id === leafCategoryId);

    // Loop upwards finding parents until we hit a main category (parentId === null) or dead end
    while (currentCat) {
      pathCategories.unshift(currentCat); // Add the category to the beginning of the path array

      if (currentCat.parentId === null) {
        break; // Found the root (main category), stop.
      }

      // Find the parent category
      const parentCat = allCategories.find(cat => cat.id === currentCat?.parentId);
      currentCat = parentCat; // Move up to the parent for the next iteration
                             // If parentCat is not found, currentCat becomes undefined, ending the loop.
    }
  }
  // At this point, pathCategories contains the hierarchy from Main Category down to the Product's Category

  return (
    // Wrap in a nav element for accessibility
    <nav className="breadcrumb" aria-label="breadcrumb">
      <ol>
        {/* 1. Home Link */}
        <li>
          <Link to="/" rel="home">
            <span>BestPrice</span>
          </Link>
        </li>

        {/* 2. Category Path Links */}
        {pathCategories.map((category) => (
          <li key={category.id}> {/* Use category ID as the key */}
            <span className="trail__breadcrumb-separator">›</span>
            <Link to={`/cat/${category.id}/${category.slug}`} title={`Περισσότερα στην κατηγορία ${category.name}`}>
              <span>{category.name}</span>
            </Link>
          </li>
        ))}

        {/* 3. Product Title (Not a link) */}
        <li>
          <span className="trail__breadcrumb-separator">›</span>
          {/* Use product.name or product.title depending on your Product type */}
          <span className="trail__last truncate max-w-[200px]">{product.title}</span>
        </li>
      </ol>
    </nav>
  );
};

export default ProductBreadcrumb;
