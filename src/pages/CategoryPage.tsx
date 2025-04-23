import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

// Main component
const CategoryPage: React.FC = () => {
  const { mainCatSlug, subCatSlug, subSubCatSlug, extraSubSubCatSlug } = useParams<{
    mainCatSlug?: string;
    subCatSlug?: string;
    subSubCatSlug?: string;
    extraSubSubCatSlug?: string;
  }>(); 

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);

  useEffect(() => {
    const foundMainCategory = mainCategories.find(cat => cat.slug === mainCatSlug);

    if (subCatSlug) {
      const foundCategory = categories.find(cat => cat.slug === subCatSlug && cat.parentId === foundMainCategory?.id);
      setCurrentCategory(foundCategory);
    } else {
      setCurrentCategory(foundMainCategory);
    }
  }, [mainCatSlug, subCatSlug]);

  useEffect(() => {
    if (!currentCategory) return;

    const isLeafCategory = categories.some(cat => cat.parentId === currentCategory.id);

    if (!isLeafCategory) {
      setFilteredProducts([]); 
    } else {
      const productsToDisplay = products.filter(product => 
        product.categoryIds.includes(currentCategory.id)
      );
      setFilteredProducts(productsToDisplay);
    }
  }, [currentCategory, products]); 

  if (!currentCategory) {
    return <NotFound />;
  }

  // Render breadcrumbs
  const renderBreadcrumbs = () => {
    const breadcrumbs = [];
    let category = currentCategory;
    while (category) {
      breadcrumbs.unshift(
        <li key={category.id}>
          <Link to={`/cat/${category.slug}`}>{category.name}</Link>
        </li>
      );
      category = categories.find(cat => cat.id === category.parentId);
    }

    return (
      <div id="trail">
        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="/" rel="home" data-no-info="">
                <span>BestPrice</span>
              </Link>
              <span className="trail__breadcrumb-separator">›</span>
            </li>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {crumb}
                {index < breadcrumbs.length - 1 && <span> › </span>}
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div>
    );
  };

  const renderMainCategories = () => {
    const subcategories = categories.filter(cat => cat.parentId === currentCategory?.id) || [];
    return (
      <>
        <div className="page-header">
          <div className="hgroup">
            <div className="page-header__title-wrapper">
              <a className="trail__back pressable" title="BestPrice.gr" href="/">
                <svg aria-hidden="true" className="icon" width={16} height={16}>
                  <use xlinkHref="/public/dist/images/icons/icons.svg#icon-right-thin-16"></use>
                </svg>
              </a>
              <h1>{currentCategory?.name}</h1>
            </div>
          </div>
        </div>
        <div className="root-category__categories">
          {subcategories.length > 0 ? (
            subcategories.map((subCat) => (
              <div key={subCat.id} className="root-category__category">
                <Link to={`/cat/${mainCatSlug}/${subCat.slug}`} className="root-category__cover">
                  <img src={subCat.image} alt={subCat.name} title={subCat.name} />
                </Link>
                <h3 className="root-category__category-title">
                  <Link to={`/cat/${mainCatSlug}/${subCat.slug}`}>{subCat.name}</Link>
                </h3>
                <div className="root-category__footer">
                  <div className="root-category__links">
                    {categories
                      .filter(linkedSubCat => linkedSubCat.parentId === subCat.id) // Filter linked subcategories for the current subCat
                      .slice(0, 5) // Limit to 5 linked subcategories
                      .map((linkedSubCat, index, arr) => (
                        <React.Fragment key={linkedSubCat.id}>
                          <Link to={`/cat/${mainCatSlug}/${subCat.slug}/${linkedSubCat.slug}`}>{linkedSubCat.name}</Link>
                          {index < arr.length - 1 && ', '} {/* Add comma if there are more */}
                        </React.Fragment>
                      ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            renderProducts()
          )}
        </div>
      </>
    );
  };

  const renderSubcategories = (basePath: string = '') => {
  const subcategories = categories.filter(cat => cat.parentId === currentCategory?.id) || [];
  return (
    <div className="page-header">
      <div className="hgroup">
        <div className="page-header__title-wrapper">
          <a className="trail__back pressable" title="BestPrice.gr" href="/">
            <svg aria-hidden="true" className="icon" width={16} height={16}>
              <use xlinkHref="/public/dist/images/icons/icons.svg#icon-right-thin-16"></use>
            </svg>
          </a>
          <h1>{currentCategory?.name}</h1>
        </div>
      </div>
      <div className="root-category__categories">
        {subcategories.length > 0 ? (
          subcategories.map((subCat) => {
            // Create base path for the current subcategory
            const currentSubPath = `${basePath}/${subCat.slug}`;
            return (
              <div key={subCat.id} className="root-category__category">
                <Link to={`/cat${currentSubPath}`} className="root-category__cover">
                  <img src={subCat.image} alt={subCat.name} title={subCat.name} />
                </Link>
                <h2 className="root-category__category-title">
                  <Link to={`/cat${currentSubPath}`}>{subCat.name}</Link>
                </h2>
                <div className="root-category__footer">
                  <div className="root-category__links">
                    {/* Render linked subcategories using the same currentSubPath */}
                    {categories
                      .filter(linkedSubCat => linkedSubCat.parentId === subCat.id) // Filter sub-subcategories
                      .slice(0, 5) // Limit to 5 sub-subcategories
                      .map((linkedSubCat, index, arr) => {
                        // Build the path for linked subcategories
                        const linkedPath = `${currentSubPath}/${linkedSubCat.slug}`; 
                        return (
                          <React.Fragment key={linkedSubCat.id}>
                            <Link to={`/cat${linkedPath}`}>{linkedSubCat.name}</Link>
                            {index < arr.length - 1 && ', '}
                          </React.Fragment>
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          renderProducts() // If no subcategories, render products
        )}
      </div>
    </div>
  );
};

  const renderProducts = () => (
    <div>
      <h2>Products</h2>
      {filteredProducts.length > 0 ? (
        filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        renderProducts()
      )}
    </div>
  );

  return (
    <div className="root__wrapper root-category__root">
      <div className="root">
        {renderBreadcrumbs()}
        {currentCategory && currentCategory.parentId 
          ? renderSubcategories(`/${mainCatSlug}`) 
          : (currentCategory 
              ? renderMainCategories() 
              : renderProducts()
            )
        }
      </div>
    </div>
  );
};

export default CategoryPage;
