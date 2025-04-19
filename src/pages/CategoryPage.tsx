import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

// Main component
const CategoryPage: React.FC = () => {
  const { mainCatId, mainCatSlug, subCatId, subCatSlug, categorytId, categorySlug } = useParams<{
    mainCatId?: string;
    mainCatSlug?: string;
    subCatId?: string;
    subCatSlug?: string;
    categorytId?: string; 
    categorySlug?: string;
  }>(); 
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  
  useEffect(() => {
    let foundCategory: Category | undefined;
  
    // Check for main category
    if (mainCatId) {
      const id = parseInt(mainCatId);
      foundCategory = mainCategories.find(cat => cat.id === id && cat.slug === mainCatSlug);
    }
    
    // Check for subcategory (that can contain subcategories)
    if (!foundCategory && subCatId) {
      const id = parseInt(subCatId);
      foundCategory = categories.find(cat => cat.id === id && cat.slug === subCatSlug);
    }

    // Check for leaf category
    if (!foundCategory && categorytId) {
      const id = parseInt(categorytId);
      foundCategory = categories.find(cat => cat.id === id && cat.slug === categorySlug);
    }

    if (foundCategory) {
      setCurrentCategory(foundCategory);
      
      // If it is a subcategory or leaf category, fetch products
      if (foundCategory.parentId) {
        const productsToDisplay = products.filter(product => product.categoryIds.includes(foundCategory.id));
        setFilteredProducts(productsToDisplay);
      } else {
        setFilteredProducts([]); // No products for main categories
      }
    } else {
      setCurrentCategory(undefined); // No category was found
    }

  }, [mainCatId, mainCatSlug, subCatId, subCatSlug, categorytId, categorySlug]);

  if (!currentCategory) {
    return <h1>Category Not Found</h1>; // Display error if category not found
  }

  // 1. Rendering Main Category's Subcategories for a main category
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

  // 2. Rendering Products Section for Leaf Subcategories / Categories
  const renderProductsSection = () => {
    // Show products for leaf categories or subcategories
    if (currentCategory && filteredProducts.length > 0) { 
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
