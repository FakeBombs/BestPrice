import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

// Main component
const CategoryPage: React.FC = () => {
  const { mainCatId, mainCatSlug, subCatId, subCatSlug, categorytId, categorySlug } = useParams<{ mainCatId: string; mainCatSlug: string; subCatId?: string; subCatSlug?: string; categorytId?: string; categorySlug?: string }>(); 
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  
  useEffect(() => {
    let foundCategory = undefined;

    // Check if we are in the main category route
    if (mainCatId && mainCatSlug) {
      const mainCategoryId = parseInt(mainCatId);
      foundCategory = mainCategories.find(cat => cat.id === mainCategoryId && cat.slug === mainCatSlug);
      setCurrentCategory(foundCategory);
      
      if (foundCategory) {
        // Reset filteredProducts for main category
        setFilteredProducts([]);
      }
    } 
    // Check if we are in subcategory routes
    else if (subCatId && subCatSlug) {
      const subCategoryId = parseInt(subCatId);
      foundCategory = categories.find(cat => cat.id === subCategoryId && cat.slug === subCatSlug);
      
      if (foundCategory) {
        setCurrentCategory(foundCategory);
        const productsToDisplay = products.filter(product => product.categoryIds.includes(foundCategory.id));
        setFilteredProducts(productsToDisplay);
      } else {
        setCurrentCategory(undefined);
      }
    } 
    // Check if we are in leaf category routes
    else if (categorytId && categorySlug) {
      const categoryId = parseInt(categorytId);
      foundCategory = categories.find(cat => cat.id === categoryId && cat.slug === categorySlug);
      
      if (foundCategory) {
        setCurrentCategory(foundCategory);
        const productsToDisplay = products.filter(product => product.categoryIds.includes(foundCategory.id));
        setFilteredProducts(productsToDisplay);
      } else {
        setCurrentCategory(undefined);
      }
    } else {
      setCurrentCategory(undefined); // No valid category found
    }
  }, [mainCatId, mainCatSlug, subCatId, subCatSlug, categorytId, categorySlug]);

  if (!currentCategory) {
    return <h1>Category Not Found</h1>; // Display error if category not found
  }

  // 1. Rendering Main Category's Subcategories
  const renderSubcategoriesForMainCategory = () => {
    const subcategories = categories.filter(cat => cat.parentId === currentCategory.id);
    
    return (
      <div className="root-category__categories">
        {subcategories.length > 0 ? (
          subcategories.map(subCat => (
            <div className="root-category__category" key={subCat.id}>
              <Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover">
                <img src={subCat.image} srcSet={`${subCat.image2x} 2x`} alt={subCat.name} title={subCat.name} />
              </Link>
              <h2 className="root-category__category-title">
                <Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
              </h2>
            </div>
          ))
        ) : (
          <p>No subcategories available for this main category.</p>
        )}
      </div>
    );
  };

  // 2. Rendering Products Section for Leaf Subcategories
  const renderProductsSection = () => {
    // Only show products for leaf categories
    if (filteredProducts.length > 0) { 
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
    return null; // No products to show
  };

  return (
    <div>
      {currentCategory.parentId ? renderSubcategoriesForMainCategory() : null}
      {renderProductsSection()} 
    </div>
  );
};

export default CategoryPage;
