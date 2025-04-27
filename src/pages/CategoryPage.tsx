import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ScrollableSlider from '@/components/ScrollableSlider';

// Main component
const CategoryPage: React.FC = () => {
  const { id, slug } = useParams<{ id: string; slug: string; }>(); 

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [sortType, setSortType] = useState('rating-desc');

  // A single useEffect to find the category based on ID and slug
  useEffect(() => {
    const foundMainCategory = mainCategories.find(cat => cat.id.toString() === id);
    let foundCategory: Category | undefined = foundMainCategory;

    if (!foundMainCategory) {
      foundCategory = categories.find(cat => cat.slug === slug && cat.parentId === foundMainCategory?.id);
    }

    if (!foundCategory) {
      foundCategory = categories.find(cat => cat.id.toString() === id);
    }

    setCurrentCategory(foundCategory || foundMainCategory);
  }, [id, slug]);

  useEffect(() => {
    if (!currentCategory) return;

    // Filter products based on current category ID
    const productsToDisplay = products.filter(product => 
      product.categoryIds.includes(currentCategory.id)
    );

    setFilteredProducts(productsToDisplay);
  }, [currentCategory, products]);

  if (!currentCategory) {
    return <NotFound />;
  }

  const sortProducts = (products) => {
    // Sorting logic remains the same
  };

  const renderBreadcrumbs = () => {
    const breadcrumbs = [];
    const mainCategory = mainCategories.find(cat => cat.id.toString() === id);
  
    if (!mainCategory) return null;

    breadcrumbs.push(
      <li key={mainCategory.slug}>
        <Link to={`/cat/${mainCategory.id}/${mainCategory.slug}`}>{mainCategory.name}</Link>
      </li>
    );

    let category = currentCategory;

    // Build the breadcrumb trail from currentCategory up to the main category
    while (category) {
      breadcrumbs.unshift(
        <li key={category.slug}>
          <Link to={`/cat/${category.id}/${category.slug}`}>{category.name}</Link>
        </li>
      );  
      category = categories.find(cat => cat.id === category.parentId); 
    }
    
    return (
      <div id="trail">
        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="/" rel="home">
                <span>BestPrice</span>
              </Link>
              <span className="trail__breadcrumb-separator">›</span>
            </li>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {crumb}
                {index < breadcrumbs.length - 1 && <span className="trail__breadcrumb-separator">›</span>}
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
              <Link className="trail__back pressable" title="BestPrice" to="/">
                <svg aria-hidden="true" className="icon" width={16} height={16}>
                  <use xlinkHref="/public/dist/images/icons/icons.svg#icon-right-thin-16"></use>
                </svg>
              </Link>
              <h1>{currentCategory?.name}</h1>
            </div>
          </div>
        </div>
        <div className="root-category__categories">
          {subcategories.length > 0 ? (
            subcategories.map((subCat) => (
              <div key={subCat.id} className="root-category__category">
                <Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover">
                  <img src={subCat.image} alt={subCat.name} title={subCat.name} />
                </Link>
                <h3 className="root-category__category-title">
                  <Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
                </h3>
                <div className="root-category__footer">
                  <div className="root-category__links">
                    {categories
                      .filter(linkedSubCat => linkedSubCat.parentId === subCat.id)
                      .slice(0, 5)
                      .map((linkedSubCat, index) => (
                        <React.Fragment key={linkedSubCat.id}>
                          <Link to={`/cat/${linkedSubCat.id}/${linkedSubCat.slug}`}>
                            {linkedSubCat.name}
                          </Link>
                          {index < 4 && ', '}
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

  const renderSubcategories = (currentCategory) => {
    const mainCategory = mainCategories.find(cat => cat.id.toString() === id);

    return (
      <>
        <div className="page-header">
          <div className="hgroup">
            <div className="page-header__title-wrapper">
              <Link className="trail__back pressable" title={mainCategory.name} to={`/cat/${mainCategory.id}/${mainCategory.slug}`}>
                <svg aria-hidden="true" className="icon" width={16} height={16}>
                  <use xlinkHref="/public/dist/images/icons/icons.svg#icon-right-thin-16"></use>
                </svg>
              </Link>
              <h1>{currentCategory.name}</h1>
            </div>
          </div>
        </div>
        <div className="root-category__categories">
          {categories.filter(cat => cat.parentId === currentCategory.id).length > 0 ? (
            categories.filter(cat => cat.parentId === currentCategory.id).map((subCat) => {
              const subCatPath = `/cat/${mainCategory.id}/${currentCategory.id}/${subCat.slug}`;
              return (
                <div key={subCat.id} className="root-category__category">
                  <Link to={subCatPath} className="root-category__cover">
                    <img src={subCat.image} alt={subCat.name} title={subCat.name} />
                  </Link>
                  <h2 className="root-category__category-title">
                    <Link to={subCatPath}>{subCat.name}</Link>
                  </h2>
                  <div className="root-category__footer">
                    <div className="root-category__links">
                      {categories
                        .filter(linkedSubCat => linkedSubCat.parentId === subCat.id)
                        .slice(0, 5)
                        .map((linkedSubCat) => (
                          <React.Fragment key={linkedSubCat.id}>
                            <Link to={`/cat/${linkedSubCat.id}/${linkedSubCat.slug}`}>
                              {linkedSubCat.name}
                            </Link>
                          </React.Fragment>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            renderProducts()
          )}
        </div>
      </>
    );
  };

  const renderProducts = () => (
    <div className="page-products">
      <aside className="page-products__filters"></aside>
      <main className="page-products__main">
        <header className="page-header">
          <div className="page-header__title-wrapper">
            <div className="products-wrapper">
              <div className="products-wrapper__header"><div className="products-wrapper__title">Selected Offers</div></div>
              <ScrollableSlider></ScrollableSlider>
            </div>
          </div>
          <div className="page-header__sorting">
            <div className="tabs">
              <div className="tabs-wrapper">
                <nav>
                  <a data-type="rating-desc" className={sortType === 'rating-desc' ? 'current' : ''} onClick={() => setSortType('rating-desc')}>
                    <div className="tabs__content">Most Popular</div>
                  </a>
                  <a data-type="price-asc" className={sortType === 'price-asc' ? 'current' : ''} onClick={() => setSortType('price-asc')}>
                    <div className="tabs__content">Cheapest</div>
                  </a>
                  <a data-type="price-desc" className={sortType === 'price-desc' ? 'current' : ''} onClick={() => setSortType('price-desc')}>
                    <div className="tabs__content">Most Expensive</div>
                  </a>
                  <a data-type="merchants_desc" className={sortType === 'merchants_desc' ? 'current' : ''} onClick={() => setSortType('merchants_desc')}>
                    <div className="tabs__content">Number of Merchants</div>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </header>
        <div className="page-products__main-wrapper">
          <div className="p__products" data-pagination="">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>No products available for this category</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="root__wrapper root-category__root">
      <div className="root">
        {renderBreadcrumbs()}
        {currentCategory && currentCategory.parentId 
          ? renderSubcategories(currentCategory) 
          : renderMainCategories()
        }
      </div>
    </div>
  );
};

export default CategoryPage;
