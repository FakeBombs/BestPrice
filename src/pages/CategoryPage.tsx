import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

// Main component
const CategoryPage: React.FC = () => {
  const { mainCatId, mainCatSlug, subCatId, subCatSlug } = useParams<{ mainCatId: string; mainCatSlug: string; subCatId: string; subCatSlug: string }>(); 
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [sortType, setSortType] = useState('rating-desc');

  // Fetch category and products when the component mounts or parameters change
  useEffect(() => {
    const mainCategoryId = mainCatId ? parseInt(mainCatId) : undefined;
    const mainCategory = mainCategories.find(cat => cat.id === mainCategoryId && cat.slug === mainCatSlug);

    // Handling Main Category Selection
    if (mainCategory) {
      setCurrentCategory(mainCategory);
      const productsToDisplay = products.filter(product => product.categoryIds.includes(mainCategory.id));
      setFilteredProducts(productsToDisplay);
    } else {
      // Handling Subcategory Selection
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
  }, [mainCatId, mainCatSlug, subCatId, subCatSlug]); // Adjusted dependencies to include all related params

  // 1. Handle the case where no category is found
  if (!currentCategory) {
    return <h1>Category Not Found</h1>;
  }

  // 2. Function to sort products based on the selected criteria
  const sortProducts = (products: Product[]) => {
    const sortedProducts = [...products];
    switch (sortType) {
      case 'price-asc':
        return sortedProducts.sort((a, b) => (a.prices[0]?.price || 0) - (b.prices[0]?.price || 0));
      case 'price-desc':
        return sortedProducts.sort((a, b) => (b.prices[0]?.price || 0) - (a.prices[0]?.price || 0));
      case 'rating-desc':
      default:
        return sortedProducts.sort((a, b) => b.rating - a.rating);
    }
  };

  // 3. Separate rendering for Main Categories Section
  const renderMainCategorySection = () => {
    if (currentCategory && !currentCategory.parentId) { // Only show if it's a main category
      return (
        <>
          <div className="page-header">
            <div className="hgroup">
              <div className="page-header__title-wrapper">
                <a className="trail__back pressable" title="BestPrice.gr" href="/"></a>
                <h1>{currentCategory.name}</h1> {/* Display the name of the currently selected main category */}
              </div>
            </div>
          </div>
          <div className="root-category__categories">
            {categories.filter(cat => cat.parentId === currentCategory.id).map(subCat => (
              <div className="root-category__category" key={subCat.id}>
                <Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover">
                  <img src={subCat.image} alt={subCat.name} title={subCat.name} />
                </Link>
                <h2 className="root-category__category-title">
                  <Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
                </h2>
              </div>
            ))}
          </div>
        </>
      );
    }
    return null;
  };

  // 4. Separate rendering for Subcategories Section (if on a subcategory view)
  const renderSubcategoriesSection = () => {
    const subcategories = categories.filter(cat => cat.parentId === currentCategory.id);
    if (currentCategory && currentCategory.parentId && subcategories.length > 0) { // Only display if current is a subcategory
      return (
        <div className="subcategories-list">
          <h2>Subcategories with More Options:</h2>
          <ul>
            {subcategories.map(subCat => (
              <li key={subCat.id}>
                <Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  // 5. Rendering Products Section based on the selected category
  const renderProductsSection = () => {
    if (!currentCategory.parentId) {
      return null; // Prevent displaying products if viewing a main category
    }
    
    return (
      <div className="page-products__main-wrapper">
        {filteredProducts.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          <div className="p__products" data-pagination="">
            {sortProducts(filteredProducts).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="root__wrapper">
      <div className="root">
        {renderMainCategorySection()} 
        {renderSubcategoriesSection()} 
        {renderProductsSection()} 
      </div>
    </div>
  );
};

export default CategoryPage;
