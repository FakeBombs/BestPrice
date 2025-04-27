import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ScrollableSlider from '@/components/ScrollableSlider';

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
  const [sortType, setSortType] = useState('rating-desc');

  useEffect(() => {
    const foundMainCategory = mainCategories.find(cat => cat.slug === mainCatSlug);
    if (!foundMainCategory) {
      setCurrentCategory(undefined);
      return;
    }

    let foundCategory: Category | undefined = foundMainCategory;

    if (subCatSlug) {
      foundCategory = categories.find(cat => cat.slug === subCatSlug && cat.parentId === foundMainCategory.id);
    }
    
    if (foundCategory && subSubCatSlug) {
      foundCategory = categories.find(cat => cat.slug === subSubCatSlug && cat.parentId === foundCategory.id);
    }
    
    if (foundCategory && extraSubSubCatSlug) {
      foundCategory = categories.find(cat => cat.slug === extraSubSubCatSlug && cat.parentId === foundCategory.id);
    }

    setCurrentCategory(foundCategory || foundMainCategory);
  }, [mainCatSlug, subCatSlug, subSubCatSlug, extraSubSubCatSlug]);

  useEffect(() => {
    if (!currentCategory) return;

    const productsToDisplay = products.filter(product => 
      product.categoryIds.includes(currentCategory.id)
    );

    setFilteredProducts(productsToDisplay);
  }, [currentCategory, products]);

  if (!currentCategory) {
    return <NotFound />;
  }

  const sortProducts = (products) => {
    switch (sortType) {
        case 'rating-desc':
            return products.sort((a, b) => b.rating - a.rating);
        case 'price-asc':
            return products.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return products.sort((a, b) => b.price - a.price);
        case 'merchants_desc':
            return products.sort((a, b) => b.merchantCount - a.merchantCount);
        default:
            return products;
    }
  };

  const renderBreadcrumbs = () => {
    return (
      <nav className="breadcrumbs">
        <Link to="/">Home</Link>
        <span className="separator">/</span>
        <Link to={`/cat/${mainCatSlug}`}>{mainCatSlug}</Link>
        {subCatSlug && (
          <>
            <span className="separator">/</span>
            <Link to={`/cat/${mainCatSlug}/${subCatSlug}`}>{subCatSlug}</Link>
          </>
        )}
        {subSubCatSlug && (
          <>
            <span className="separator">/</span>
            <Link to={`/cat/${mainCatSlug}/${subCatSlug}/${subSubCatSlug}`}>{subSubCatSlug}</Link>
          </>
        )}
        {extraSubSubCatSlug && (
          <>
            <span className="separator">/</span>
            {extraSubSubCatSlug}
          </>
        )}
      </nav>
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
                <Link to={`/cat/${mainCatSlug}/${subCat.slug}`} className="root-category__cover">
                  <img src={subCat.image} alt={subCat.name} title={subCat.name} />
                </Link>
                <h3 className="root-category__category-title">
                  <Link to={`/cat/${mainCatSlug}/${subCat.slug}`}>{subCat.name}</Link>
                </h3>
                <div className="root-category__footer">
                  <div className="root-category__links">
                    {categories
                      .filter(linkedSubCat => linkedSubCat.parentId === subCat.id)
                      .slice(0, 5)
                      .map((linkedSubCat, index, arr) => (
                        <React.Fragment key={linkedSubCat.id}>
                          <Link to={`/cat/${mainCatSlug}/${subCat.slug}/${linkedSubCat.slug}`}>
                            {linkedSubCat.name}
                          </Link>
                          {index < arr.length - 1 && ', '}
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

  const renderSubcategories = (currentCategory: Category) => {
    const subcategories = categories.filter(cat => cat.parentId === currentCategory.id);
    return (
      <div className="subcategories">
        {subcategories.map(subCat => (
          <div key={subCat.id}>
            <h2>
              <Link to={`/cat/${mainCatSlug}/${subCat.slug}`}>{subCat.name}</Link>
            </h2>
            {subCat.subcategories && subCat.subcategories.map(subSubCat => (
              <div key={subSubCat.id}>
                <h3>
                  <Link to={`/cat/${mainCatSlug}/${subCat.slug}/${subSubCat.slug}`}>{subSubCat.name}</Link>
                </h3>
                {subSubCat.subcategories && subSubCat.subcategories.map(extraCat => (
                  <Link key={extraCat.id} to={`/cat/${mainCatSlug}/${subCat.slug}/${subSubCat.slug}/${extraCat.slug}`}>
                    {extraCat.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderProducts = () => (
    <div className="page-products">
      <aside className="page-products__filters"></aside>
      <main className="page-products__main">
        <header className="page-header">
          <div className="page-header__title-wrapper">
            <div className="products-wrapper">
              <div className="products-wrapper__header">
                <div className="products-wrapper__title">Επιλεγμένες Προσφορές</div>
              </div>
              <ScrollableSlider></ScrollableSlider>
            </div>
          </div>
          <div className="page-header__sorting">
            <div className="tabs">
              <div className="tabs-wrapper">
                <nav>
                  <a data-type="rating-desc" rel="nofollow" className={sortType === 'rating-desc' ? 'current' : ''} onClick={() => setSortType('rating-desc')}><div className="tabs__content">Δημοφιλέστερα</div></a>
                  <a data-type="price-asc" rel="nofollow" className={sortType === 'price-asc' ? 'current' : ''} onClick={() => setSortType('price-asc')}><div className="tabs__content">Φθηνότερα</div></a>
                  <a data-type="price-desc" rel="nofollow" className={sortType === 'price-desc' ? 'current' : ''} onClick={() => setSortType('price-desc')}><div className="tabs__content">Ακριβότερα</div></a>
                  <a data-type="merchants_desc" rel="nofollow" className={sortType === 'merchants_desc' ? 'current' : ''} onClick={() => setSortType('merchants_desc')}><div className="tabs__content">Αριθμός καταστημάτων</div></a>
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
