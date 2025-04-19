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

    // Check for Main Categories
    if (mainCatId) {
      const id = parseInt(mainCatId);
      foundCategory = mainCategories.find(cat => cat.id === id && cat.slug === mainCatSlug);
    }

    // Check for Subcategories with more subcategories
    if (!foundCategory && subCatId) {
      const id = parseInt(subCatId);
      foundCategory = categories.find(cat => cat.id === id && cat.slug === subCatSlug);
    }

    // Check for Leaf Subcategories
    if (!foundCategory && categorytId) {
      const id = parseInt(categorytId);
      foundCategory = categories.find(cat => cat.id === id && cat.slug === categorySlug);
    }

    if (foundCategory) {
      setCurrentCategory(foundCategory);

      // Set products if it's a subcategory or a leaf category
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

  // Display an error if there's no found category
  if (!currentCategory) {
    return <h1>Category Not Found</h1>;
  }

  // Section 1: Render Main Categories
  const renderMainCategories = () => {
    return (
      <div>
        <h2>Main Categories</h2>
        <div className="main-categories">
          {mainCategories.map(cat => (
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

  // Section 2: Render Subcategories That Contain More Subcategories
  const renderSubcategoriesWithSubcategories = () => {
    if (!currentCategory.parentId) return null;

    const subcategories = categories.filter(cat => cat.parentId === currentCategory.id);

    return (
      <div>
        <h2>Subcategories with More Subcategories</h2>
        <div className="subcategories-with-subcategories">
          {subcategories.length > 0 ? (
            subcategories.map(subCat => (
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

  // Section 3: Render Subcategories That Do NOT Contain More Subcategories
  const renderLeafSubcategories = () => {
    if (!currentCategory.parentId) return null;

    const leafSubcategories = categories.filter(cat => cat.parentId === currentCategory.id && !categories.some(child => child.parentId === cat.id));

    return (
      <div>
        <h2>Leaf Subcategories (No Further Subcategories)</h2>
        <div className="leaf-subcategories">
          {leafSubcategories.length > 0 ? (
            leafSubcategories.map(leaf => (
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

  // Rendering the Main Component
  return (
    <div>
      {renderMainCategories()} {/* Section 1 */}
      {renderSubcategoriesWithSubcategories()} {/* Section 2 */}
      {renderLeafSubcategories()} {/* Section 3 */}
      
      {/* Render Products Section for Leaf Categories */}
      {currentCategory && filteredProducts.length > 0 && (
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
