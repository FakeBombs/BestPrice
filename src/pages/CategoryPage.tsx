import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

// Main component
const CategoryPage: React.FC = () => {
  const { mainCatId, mainCatSlug, subCatId, subCatSlug } = useParams<{ mainCatId: string; mainCatSlug: string; subCatId?: string; subCatSlug?: string }>(); 
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  
  useEffect(() => {
    const mainCategoryId = mainCatId ? parseInt(mainCatId) : undefined;
    const mainCategory = mainCategories.find(cat => cat.id === mainCategoryId && cat.slug === mainCatSlug);

    if (mainCategory) {
      setCurrentCategory(mainCategory);
      const subcategories = categories.filter(cat => cat.parentId === mainCategory.id);
      setFilteredProducts([]); // Clear products, we will show subcategories
    } else {
      const subCategoryId = subCatId ? parseInt(subCatId) : undefined; 
      const subCategory = categories.find(cat => cat.id === subCategoryId && cat.slug === subCatSlug);

      if (subCategory) {
        setCurrentCategory(subCategory);
        const productsToDisplay = products.filter(product => product.categoryIds.includes(subCategory.id));
        setFilteredProducts(productsToDisplay);
      } else {
        setCurrentCategory(undefined);
      }
    }
  }, [mainCatId, mainCatSlug, subCatId, subCatSlug]);

  if (!currentCategory) {
    return <h1>Category Not Found</h1>;
  }

  // 1. Rendering Main Category's Subcategories
  const renderSubcategoriesForMainCategory = () => {
    const subcategories = categories.filter(cat => cat.parentId === currentCategory.id);
    return (
      <>
        <h1>{currentCategory.name} - Subcategories</h1>
        <div>
          {subcategories.length > 0 ? (
            subcategories.map(subCat => (
              <Link key={subCat.id} to={`/cat/${mainCatId}/${mainCatSlug}/${subCat.id}/${subCat.slug}`}>
                {subCat.name}
              </Link>
            ))
          ) : (
            <p>No subcategories available for this main category.</p>
          )}
        </div>
      </>
    );
  };

  // 2. If we are in a Subcategory that contains more subcategories
  const renderSubcategoriesSection = () => {
    if (currentCategory && currentCategory.parentId) {
      const subcategories = categories.filter(cat => cat.parentId === currentCategory.id);
      return (
        <div>
          <h2>Subcategories:</h2>
          {subcategories.length > 0 ? (
            subcategories.map(subCat => (
              <Link key={subCat.id} to={`/cat/${mainCatId}/${mainCatSlug}/${subCat.id}/${subCat.slug}`}>
                {subCat.name}
              </Link>
            ))
          ) : (
            <p>No more subcategories available.</p>
          )}
        </div>
      );
    }
    return null; // This is for leaf subcategories
  };

  // 3. Rendering Products Section for Leaf Subcategories
  const renderProductsSection = () => {
    if (currentCategory?.parentId && filteredProducts.length > 0) { // Only show products for leaf subcategories
      return (
        <div>
          {filteredProducts.length === 0 ? (
            <p>No products found in this category.</p>
          ) : (
            <div>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      );
    }
    return null; // No products to show for main category or no products
  };

  return (
    <div>
      {currentCategory && !currentCategory.parentId ? renderSubcategoriesForMainCategory() : renderSubcategoriesSection()}
      {renderProductsSection()} 
    </div>
  );
};

export default CategoryPage;
