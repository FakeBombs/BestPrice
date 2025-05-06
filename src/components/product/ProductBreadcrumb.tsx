import React from 'react';
import { Link } from 'react-router-dom';
import { Product, categories, mainCategories, Category } from '@/data/mockData';
import { useTranslation } from '@/hooks/useTranslation'; // Import useTranslation

// Combine main and subcategories for easier lookups
const allCategoriesList = [...mainCategories, ...categories]; // Renamed to avoid conflict if allCategories is used elsewhere

interface ProductBreadcrumbProps {
  product: Product;
}

const ProductBreadcrumb = ({ product }: ProductBreadcrumbProps) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const pathCategories: Category[] = [];

  // Find the full path: Start from the product's category and go up
  if (product.categoryIds && product.categoryIds.length > 0) {
    const leafCategoryId = product.categoryIds[0]; // Assuming the first categoryId is the most specific one
    let currentCat = allCategoriesList.find(cat => cat.id === leafCategoryId);

    while (currentCat) {
      pathCategories.unshift(currentCat); // Add to the beginning to maintain order
      if (currentCat.parentId === null || typeof currentCat.parentId === 'undefined') {
        break;
      }
      const parentCat = allCategoriesList.find(cat => cat.id === currentCat?.parentId);
      currentCat = parentCat;
    }
  }
  // pathCategories now holds the hierarchy: [MainCategory, ..., ParentCategory, LeafCategory]

  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      <ol>
        {/* 1. Home Link */}
        <li><Link to="/" rel="home"><span>{t('breadcrumbHome', 'BestPrice')}</span></Link></li>

        {/* 2. Category Path Links */}
        {pathCategories.map((category, index) => {
            const isFinal = index === pathCategories.length - 1;
            // Translate the category name itself using its slug as the key
            const translatedCategoryName = t(category.slug, category.name); // Fallback to category.name

            const linkTitleKey = isFinal
              ? 'breadcrumbAllProductsInCategory'
              : 'breadcrumbAllProductsAndSubcategoriesInCategory';

            const linkTitle = t(linkTitleKey, { categoryName: translatedCategoryName });

            return (
              <li key={category.id}>
                <span className="trail__breadcrumb-separator">›</span>
                <Link to={`/cat/${category.id}/${category.slug}`} title={linkTitle}>
                  {/* Display the translated category name */}
                  <span>{translatedCategoryName}</span>
                </Link>
              </li>
            );
        })}

        {/* 3. Product Title (Not a link) - Product titles are usually dynamic and not translated via keys */}
        <li>
          {pathCategories.length > 0 && <span className="trail__breadcrumb-separator">›</span>}
          <span className="trail__last truncate max-w-[200px]">{product.title}</span> {/* Product title remains as is */}
        </li>
      </ol>
    </nav>
  );
};

export default ProductBreadcrumb;
