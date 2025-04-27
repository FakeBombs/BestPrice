import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ScrollableSlider from '@/components/ScrollableSlider';

// Main component
const CategoryPage: React.FC = () => {
  const { mainCatId, mainCatSlug, subCatId, subCatSlug } = useParams<{
    mainCatId: string; // Expecting mainCatId to always be present
    mainCatSlug: string; // Expecting mainCatSlug to always be present
    subCatId?: string; // subCatId is optional
    subCatSlug?: string; // subCatSlug is optional
  }>(); 

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [sortType, setSortType] = useState('rating-desc');

  useEffect(() => {
    const foundMainCategory = mainCategories.find(cat => cat.id.toString() === mainCatId); // Find the main category by ID
    let foundCategory: Category | undefined = foundMainCategory;

    // Check if subCatId was provided to find the subcategory based on its ID
    if (subCatId) {
      foundCategory = categories.find(cat => cat.id.toString() === subCatId && cat.parentId === Number(mainCatId));
    }

    setCurrentCategory(foundCategory || foundMainCategory); // Set the current category (main or sub)
  }, [mainCatId, subCatId]);

  useEffect(() => {
    if (!currentCategory) return;

    // Filter products directly based on current category ID
    const productsToDisplay = products.filter(product => 
      product.categoryIds.includes(currentCategory.id)
    );

    setFilteredProducts(productsToDisplay); // Set filtered products based on the current category
  }, [currentCategory, products]);

  if (!currentCategory) {
    return <NotFound />;
  }

  const renderBreadcrumbs = () => {
    const breadcrumbs = [];
    const mainCategory = mainCategories.find(cat => cat.id.toString() === mainCatId);

    if (!mainCategory) return null;

    // Breadcrumb for main category
    breadcrumbs.push(
      <li key={mainCategory.id}>
        <Link to={`/cat/${mainCategory.id}/${mainCategory.slug}`}>{mainCategory.name}</Link>
      </li>
    );

    // Breadcrumb for subcategory, if present
    if (subCatId) {
      const subCategory = categories.find(cat => cat.id.toString() === subCatId);
      if (subCategory) {
        breadcrumbs.push(
          <li key={subCategory.id}>
            <Link to={`/cat/${mainCategory.id}/${mainCategory.slug}/${subCategory.id}/${subCategory.slug}`}>{subCategory.name}</Link>
          </li>
        );
      }
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

  const renderCategories = (parentId: number | undefined, prefix: string) => {
    const subcategories = categories.filter(cat => cat.parentId === parentId) || [];
    return (
      <div className="root-category__categories">
        {subcategories.length > 0 ? (
          subcategories.map((subCat) => (
            <div key={subCat.id} className="root-category__category">
              <Link to={`/cat/${mainCatId}/${mainCatSlug}/${subCat.id}/${subCat.slug}`} className="root-category__cover">
                <img src={subCat.image} alt={subCat.name} title={subCat.name} />
              </Link>
              <h3 className="root-category__category-title">
                <Link to={`/cat/${mainCatId}/${mainCatSlug}/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
              </h3>
              <div className="root-category__footer">
                <div className="root-category__links">
                  {categories
                    .filter(linkedSubCat => linkedSubCat.parentId === subCat.id)
                    .slice(0, 5)
                    .map((linkedSubCat, index, arr) => (
                      <React.Fragment key={linkedSubCat.id}>
                        <Link to={`/cat/${mainCatId}/${mainCatSlug}/${subCat.id}/${subCat.slug}/${linkedSubCat.id}/${linkedSubCat.slug}`}>
                          {linkedSubCat.name}
                        </Link>
                        {index < arr.length - 1 && ', '}
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </div>
          ))
        ) : null }
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
              <ScrollableSlider />
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
          ? renderCategories(currentCategory.id, `${currentCategory.slug}`) 
          : renderCategories(currentCategory?.id, mainCatSlug)
        }
        {renderProducts()}
      </div>
    </div>
  );
};

export default CategoryPage;
