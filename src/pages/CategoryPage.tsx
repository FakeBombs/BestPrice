import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

// Main component
const CategoryPage: React.FC = () => {
  console.log({ mainCatId, mainCatSlug, subCatId, subCatSlug, urlCategoryId, categorySlug });
  
  const { mainCatId, mainCatSlug, subCatId, subCatSlug, categoryId: urlCategoryId, categorySlug } = useParams<{
    mainCatId?: string;
    mainCatSlug?: string;
    subCatId?: string;
    subCatSlug?: string;
    categoryId?: string; 
    categorySlug?: string;
  }>(); 

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  
  useEffect(() => {
    let foundCategoryId: number | undefined = undefined;
    
    // Attempting to parse different IDs from URL
    if (mainCatId) {
      foundCategoryId = parseInt(mainCatId, 10);
      console.log("Parsed Main Category ID:", foundCategoryId);
      const foundCategory = mainCategories.find(cat => cat.id === foundCategoryId && cat.slug === mainCatSlug);
      if (foundCategory) {
        setCurrentCategory(foundCategory);
        console.log("Found Category:", foundCategory); 
console.log("Found SubCategory:", foundSubCategory); 
console.log("Found Leaf Category:", foundLeafCategory);
        console.log("Current Category:", currentCategory);
        return; // Stop additional checks if main category is found
      }
    }

    if (subCatId) {
      foundCategoryId = parseInt(subCatId);
      const foundSubCategory = categories.find(cat => cat.id === foundCategoryId && cat.slug === subCatSlug);
      if (foundSubCategory) {
        setCurrentCategory(foundSubCategory);
        return; // Stop additional checks if subcategory is found
      }
    }

    if (urlCategoryId) {
      foundCategoryId = parseInt(urlCategoryId);
      const foundLeafCategory = categories.find(cat => cat.id === foundCategoryId && cat.slug === categorySlug);
      if (foundLeafCategory) {
        setCurrentCategory(foundLeafCategory);
        return; // Stop additional checks if leaf category is found
      }
    }

    setCurrentCategory(undefined); // If no category found
  }, [mainCatId, mainCatSlug, subCatId, subCatSlug, urlCategoryId, categorySlug]);

  useEffect(() => {
    if (!currentCategory) return;

    // Load products for leaf categories
    if (!currentCategory.parentId) {
      setFilteredProducts([]); // No products for main categories
    } else {
      const productsToDisplay = products.filter(product => product.categoryIds.includes(currentCategory.id));
      setFilteredProducts(productsToDisplay);
    }
  }, [currentCategory]);

  // Handle category not found
  if (!currentCategory) {
    return <h1>Category Not Found</h1>;
  }

  // Render main categories
  const renderMainCategories = () => (
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

  // Render subcategories
  const renderSubcategories = () => {
    const subcategories = categories.filter(cat => cat.parentId === currentCategory.id);
    return (
      <div>
        <h2>Subcategories</h2>
        <div className="subcategories">
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

  // Render leaf products
  const renderProducts = () => (
    <div>
      <h2>Products</h2>
      {filteredProducts.length > 0 ? (
        filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>No products in this category.</p>
      )}
    </div>
  );

  return (
    <div>
      {renderMainCategories()}
      {renderSubcategories()}
      {currentCategory && currentCategory.parentId && renderProducts()} {/* Only show products if it's not a main category */}
    </div>
  );
};

export default CategoryPage;
