import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { categories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

// Main component
const CategoryPage: React.FC = () => {
  const { subCatId, subCatSlug } = useParams<{ subCatId: string; subCatSlug: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentSubCategory, setCurrentSubCategory] = useState<Category | undefined>(undefined);
  const [sortType, setSortType] = useState('rating-desc');

  useEffect(() => {
    const subCategoryId = subCatId ? parseInt(subCatId) : undefined;
    const mainCategory = categories.find(cat => cat.id === subCategoryId);
    
    if (mainCategory) {
      // Case 1: Main Category Found
      setCurrentSubCategory(mainCategory);
      const productsToDisplay = products.filter(product => product.categoryIds.includes(mainCategory.id));
      setFilteredProducts(productsToDisplay);
    } else {
      // Case 2: Subcategory Scenario
      const subCategory = categories.find(cat => cat.id === subCategoryId);
      if (subCategory) {
        setCurrentSubCategory(subCategory);
        const productsToDisplay = products.filter(product => product.categoryIds.includes(subCategory.id));
        setFilteredProducts(productsToDisplay);
      } else {
        // Case 3: If no main category or subcategory is found
        setCurrentSubCategory(undefined);
      }
    }
  }, [subCatId]);

  if (!currentSubCategory) {
    return <h1>Category Not Found</h1>;
  }

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

  const hasSubcategories = categories.some(cat => cat.parentId === currentSubCategory.id);

  return (
    <div className="root__wrapper">
      <div className="root">
        {/* Main Categories Section */}
        <div className="page-header">
          <div className="hgroup">
            <div className="page-header__title-wrapper">
              <a className="trail__back pressable" title="BestPrice.gr" href="/"></a>
              <h1>Categories</h1>  {/* Main Category Title */}
            </div>
          </div>
        </div>
        <div className="root-category__categories">
          {categories.filter(cat => !cat.parentId).map(mainCat => (  // Filter for main categories
            <div className="root-category__category" key={mainCat.id}>
              <a href={`/cat/${mainCat.id}/${mainCat.slug}`} className="root-category__cover">
                <img src={mainCat.image} alt={mainCat.name} title={mainCat.name} />
              </a>
              <h2 className="root-category__category-title">
                <a href={`/cat/${mainCat.id}/${mainCat.slug}`}>{mainCat.name}</a>
              </h2>
              <div className="root-category__footer">
                <div className="root-category__links">
                  {categories.filter(cat => cat.parentId === mainCat.id).map(subCat => (  // Subcategories for the main category
                    <a key={subCat.id} href={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subcategories with more subcategories */}
        {hasSubcategories && !subCatId ? (
          <div className="subcategories-list">
            <h2>Subcategories:</h2>
            <ul>
              {categories.filter(cat => cat.parentId === currentSubCategory.id).map(subCat => (
                <li key={subCat.id}>
                  <Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
