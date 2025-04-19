import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

// Main component
const CategoryPage: React.FC = () => {
  const { mainCatId, mainCatSlug, subCatId, subCatSlug } = useParams<{ mainCatId: string; mainCatSlug: string; subCatId: string; subCatSlug: string }>(); // Updated to include subCatId and subCatSlug
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [sortType, setSortType] = useState('rating-desc');

  useEffect(() => {
    const mainCategoryId = mainCatId ? parseInt(mainCatId) : undefined;
    const mainCategory = mainCategories.find(cat => cat.id === mainCategoryId && cat.slug === mainCatSlug);

    if (mainCategory) {
      setCurrentCategory(mainCategory);
      const productsToDisplay = products.filter(product => product.categoryIds.includes(mainCategory.id));
      setFilteredProducts(productsToDisplay);
    } else {
      const subCategoryId = subCatId ? parseInt(subCatId) : undefined; // Getting subcategory ID
      const subCategory = categories.find(cat => cat.id === subCategoryId && cat.slug === subCatSlug); // Ensure slug also matches

      if (subCategory) {
        setCurrentCategory(subCategory);
        const productsToDisplay = products.filter(product => product.categoryIds.includes(subCategory.id));
        setFilteredProducts(productsToDisplay);
      } else {
        setCurrentCategory(undefined);
      }
    }
  }, [mainCatId, subCatId]); // Adjusted dependencies

  if (!currentCategory) {
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

  const subcategories = categories.filter(cat => cat.parentId === currentCategory.id); // Filter subcategories based on the selected category
  const hasSubcategories = subcategories.length > 0;

  return (
    <div className="root__wrapper">
      <div className="root">
        
        {/* Main Categories Section (only show if not a subcategory) */}
        {currentCategory && !currentCategory.parentId ? (  // Show this only if the current category is a main category
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
              {mainCategories.map(mainCat => (
                <div className="root-category__category" key={mainCat.id}>
                  <Link to={`/cat/${mainCat.id}/${mainCat.slug}`} className="root-category__cover"><img src={mainCat.image} alt={mainCat.name} title={mainCat.name} /></Link>
                  <h2 className="root-category__category-title"><Link to={`/cat/${mainCat.id}/${mainCat.slug}`}>{mainCat.name}</Link></h2>
                  <div className="root-category__footer">
                    <div className="root-category__links">
                      {/* Map subcategories belonging to this main category */}
                      {categories.filter(cat => cat.parentId === mainCat.id).map(subCat => (
            <div key={subCat.id}>
              <Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover">
                <img src={subCat.image} alt={subCat.name} title={subCat.name} />
              </Link>
              <h2 className="root-category__category-title">
                <Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
              </h2>
              <div className="root-category__footer">
                <div className="root-category__links">
                  {/* Nested subcategories for this subcategory if any */}
                  {categories.filter(cat => cat.parentId === subCat.id).map(nestedSubCat => (
                    <Link key={nestedSubCat.id} to={`/cat/${nestedSubCat.id}/${nestedSubCat.slug}`}>{nestedSubCat.name}</Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ))}
</div>
          </>
        ) : null} {/* End of Main Categories Section */}

        {/* Subcategories with more subcategories Section */}
        {hasSubcategories && !mainCatId ? (
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
        ) : null}

        {/* Products Section for individual subcategories without more subcategories */}
        {!hasSubcategories ? (
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
        ) : null}

      </div>
    </div>
  );
};

export default CategoryPage;
