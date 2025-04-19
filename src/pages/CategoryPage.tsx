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

    // Check for subcategory
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

      // Load products for leaf categories
      if (!foundCategory.parentId) {
        setFilteredProducts([]); // No products for main categories with parentId undefined
      } else {
        const productsToDisplay = products.filter(product => product.categoryIds.includes(foundCategory.id));
        setFilteredProducts(productsToDisplay);
      }
    } else {
      setCurrentCategory(undefined); // No category found
    }

  }, [mainCatId, mainCatSlug, subCatId, subCatSlug, categorytId, categorySlug]);

  // Handle category not found
  if (!currentCategory) {
    return <h1>Category Not Found</h1>;
  }

  // Function to render main categories
  const renderMainCategories = () => {
    return (
      <div>
        <h2>Main Categories</h2>
        <div className="main-categories">
          {mainCategories.map((cat) => (
            <div key={cat.id}>
              <Link to={`/cat/${cat.id}/${cat.slug}`}>
                <h3>{cat.name}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Function to render subcategories with further subcategories
  const renderSubcategoriesWithSubcategories = () => {
    const subcategories = categories.filter(cat => cat.parentId === currentCategory.id);

    return (
      <div>
        <h2>Subcategories with More Subcategories</h2>
        <div className="subcategories-with-subcategories">
          {subcategories.length > 0 ? (
            subcategories.map((subCat) => (
              <div key={subCat.id}>
                <Link to={`/cat/${subCat.id}/${subCat.slug}`}>
                  <h3>{subCat.name}</h3>
                </Link>
              </div>
            ))
          ) : (
            <p>No subcategories available for this category.</p>
          )}
        </div>
      </div>
    );
  };

  // Function to render leaf subcategories
  const renderLeafSubcategories = () => {
    const leafSubcategories = categories.filter(cat => 
      cat.parentId === currentCategory.id && 
      !categories.some(child => child.parentId === cat.id)
    );

    return (
      <div>
        <h2>Leaf Subcategories (No Further Subcategories)</h2>
        <div className="leaf-subcategories">
          {leafSubcategories.length > 0 ? (
            leafSubcategories.map((leaf) => (
              <div key={leaf.id}>
                <Link to={`/cat/${leaf.id}/${leaf.slug}`}>
                  <h3>{leaf.name}</h3>
                </Link>
              </div>
            ))
          ) : (
            <p>No leaf subcategories available for this category.</p>
          )}
        </div>
      </div>
    );
  };

  // Main rendering
  return (
    <div>
      {renderMainCategories()} // Always show main categories
      {renderSubcategoriesWithSubcategories()} // Show subcategories with further subcategories
      {renderLeafSubcategories()} // Show leaf subcategories

      {/* Render products for leaf categories only */}
      {currentCategory.parentId && filteredProducts.length > 0 && (
        <div>
          <h2>Products</h2>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
