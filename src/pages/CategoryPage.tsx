import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

// Main component
const CategoryPage: React.FC = () => {
  const { mainCatId, mainCatSlug, subCatId, subCatSlug, searchQuery } = useParams<{ mainCatId: string; mainCatSlug: string; subCatId?: string; subCatSlug?: string; searchQuery?: string }>(); 
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
      <div className="root-category__categories">
        {subcategories.length > 0 ? (
          subcategories.map(subCat => (
            <div className="root-category__category" key={subCat.id}>
              <Link to={`/cat/${subCat.id}/${subCat.slug}.html?bpref=root-category`} className="root-category__cover">
                <img src={subCat.image} alt={subCat.name} title={subCat.name} />
              </Link>
              <h2 className="root-category__category-title">
                <Link to={`/cat/${subCat.id}/${subCat.slug}.html?bpref=root-category__title`}>
                  {subCat.name}
                </Link>
              </h2>
              <div className="root-category__footer">
                <div className="root-category__links">
                  {subCat.subcategories && subCat.subcategories.map(nestedSubCat => (
                    <Link key={nestedSubCat.id} to={`/cat/${nestedSubCat.id}/${nestedSubCat.slug}.html?bpref=root-category-subcat`}>
                      {nestedSubCat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No subcategories available for this main category.</p>
        )}
      </div>
    );
  };

  // 2. If we are in a Subcategory that contains more subcategories or brands
  const renderSubcategoriesSection = () => {
    if (currentCategory && currentCategory.parentId) {
      const subcategories = categories.filter(cat => cat.parentId === currentCategory.id);
      const brands = Array.from(new Set(products
        .filter(product => product.categoryIds.includes(currentCategory.id))
        .map(product => product.brand)
      )); // Get distinct brands from products in the current category

      return (
        <div>
          <h2>Subcategories:</h2>
          {subcategories.length > 0 ? (
            subcategories.map(subCat => (
              <div className="root-category__category" key={subCat.id}>
                <Link to={`/cat/${subCat.id}/${subCat.slug}.html?bpref=sub-category`} className="root-category__cover">
                  <img 
                    src={subCat.image} 
                    srcSet={`${subCat.image2x} 2x`} 
                    alt={subCat.name} 
                    title={subCat.name} 
                  />
                </Link>
                <h3 className="root-category__category-title">
                  <Link to={`/cat/${subCat.id}/${subCat.slug}.html?bpref=sub-category-title`}>
                    {subCat.name}
                  </Link>
                </h3>
                <div className="root-category__footer">
                  <div className="root-category__links">
                    {subCat.subcategories && subCat.subcategories.map(nestedSubCat => (
                      <Link key={nestedSubCat.id} to={`/cat/${nestedSubCat.id}/${nestedSubCat.slug}.html?bpref=sub-category-nested`}>
                        {nestedSubCat.name}
                      </Link>
                    ))}
                    {brands.length > 0 && (
                      <>
                        <h4>Brands:</h4>
                        {brands.map(brand => (
                          <Link key={brand} to={`?filter=brand&value=${brand}`} onClick={() => { 
                            // Auto-select brand logic can be placed here
                          }}>
                            {brand}
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No subcategories or brands available.</p>
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
    <div className="root__wrapper root-category__root">
      <div class="root">
        {currentCategory && !currentCategory.parentId ? renderSubcategoriesForMainCategory() : renderSubcategoriesSection()} 
        {renderProductsSection()} 
      </div>
    </div>
  );
};

export default CategoryPage;
