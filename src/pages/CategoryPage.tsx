import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom'; 
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import PriceAlertModal from '@/components/PriceAlertModal';
import ScrollableSlider from '@/components/ScrollableSlider';

const CategoryPage: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean); // e.g., ["cat", "1", "technology"]
  
  const { toast } = useToast();
  const { user } = useAuth();

  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [currentCategory, setCurrentCategory] = useState<any | undefined>(undefined);
  const [sortType, setSortType] = useState('rating-desc');
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState(false);

  // Helper: find category by id or slug
  const findCategory = (identifier: string) => {
    return [...mainCategories, ...categories].find(
      (cat) =>
        cat.id.toString() === identifier || cat.slug === identifier
    );
  };

  // Main logic: resolve category from URL segments
useEffect(() => {
  if (pathSegments.length < 2 || pathSegments[0] !== 'cat') {
    setCurrentCategory(undefined);
    return;
  }
  const segments = pathSegments.slice(1); // after "/cat"
  let foundCategory = null;

  // Try to match full URL segments (for nested categories)
  for (let i = segments.length - 1; i >= 0; i--) {
    const segmentToMatch = segments[i];
    foundCategory = findCategory(segmentToMatch);
    if (foundCategory) break;
  }

  // If no category found, and segments length=1, check mainCategories
  if (!foundCategory && segments.length === 1) {
    foundCategory = mainCategories.find(
      cat => cat.id.toString() === segments[0] || cat.slug === segments[0]
    );
  }

  setCurrentCategory(foundCategory);

  if (foundCategory) {
    const productsToDisplay = products.filter(p => 
      p.categoryId && p.categoryId.toString() === foundCategory.id.toString()
    );
    setFilteredProducts(productsToDisplay);
  } else {
    setFilteredProducts([]);
  }
}, [pathSegments]);

// Show NotFound only if URL indicates a category but no match found
if (
  pathSegments.length >= 2 &&
  pathSegments[0] === 'cat' &&
  currentCategory === undefined
) {
  return <NotFound />;
}

// Function for sorting products
const sortProducts = (productsList: any[]) => {
  switch (sortType) {
    case 'price-asc':
      return [...productsList].sort((a, b) => {
        const minPriceA = Math.min(...(a.prices || []).filter(p => p.inStock).map(p => p.price), Infinity);
        const minPriceB = Math.min(...(b.prices || []).filter(p => p.inStock).map(p => p.price), Infinity);
        return minPriceA - minPriceB;
      });
    case 'price-desc':
      return [...productsList].sort((a, b) => {
        const maxPriceA = Math.max(...(a.prices || []).filter(p => p.inStock).map(p => p.price), 0);
        const maxPriceB = Math.max(...(b.prices || []).filter(p => p.inStock).map(p => p.price), 0);
        return maxPriceB - maxPriceA;
      });
    case 'rating-desc':
    default:
      return [...productsList].sort((a, b) => {
        const avgA = a.ratingSum / Math.max(a.numReviews, 1);
        const avgB = b.ratingSum / Math.max(b.numReviews, 1);
        return avgB - avgA;
      });
    case 'merchants_desc':
      return [...productsList].sort((a, b) => {
        const vendorsA = (a.prices || []).filter(p => p.inStock).length;
        const vendorsB = (b.prices || []).filter(p => p.inStock).length;
        return vendorsB - vendorsA;
      });
  }
};

const handlePriceAlert = () => {
  if (!user) {
    toast({ title: 'Login Required', description: 'Please log in to set a price alert' });
    return;
  }
  setIsPriceAlertModalOpen(true);
};

// Render breadcrumbs, with main category included if applicable
const renderBreadcrumbs = () => {
  if (!currentCategory) {
    return (
      <div id="trail">
        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="/" rel="home"><span>BestPrice</span></Link>
            </li>
          </ol>
        </nav>
      </div>
    );
  }

  // Find the main category for the current category
  const mainCategory = mainCategories.find(
    cat =>
      cat.id.toString() === currentCategory.parentId?.toString() ||
      cat.slug === currentCategory.parentId
  );

  // Check if current category is a main category
  const isMainCategory = mainCategory && currentCategory.id === mainCategory.id;

  // If on main category page, show only Home and Main Category
  if (isMainCategory) {
    return (
      <div id="trail">
        <nav className="breadcrumb">
          <ol>
            <li key="home">
              <Link to="/" rel="home"><span>BestPrice</span></Link>
            </li>
            <span className="trail__breadcrumb-separator">›</span>
            <li>
              <Link to={`/cat/${mainCategory.id}/${mainCategory.slug}`}>
                {mainCategory.name}
              </Link>
            </li>
          </ol>
        </nav>
      </div>
    );
  }

  // Build breadcrumb trail: always start with home and main category
  const breadcrumbItems = [
    <li key="home">
      <Link to="/" rel="home"><span>BestPrice</span></Link>
    </li>,
  ];

  if (mainCategory) {
    breadcrumbItems.push(
      <li key={mainCategory.slug}>
        <Link to={`/cat/${mainCategory.id}/${mainCategory.slug}`}>
          {mainCategory.name}
        </Link>
      </li>
    );
  }

  // Traverse up from current category to main category, excluding current category
  const trail = [];
  let category = currentCategory;
  while (
    category &&
    (!mainCategory || category.id !== mainCategory.id)
  ) {
    trail.unshift(category);
    category = categories.find(cat => cat.id === category.parentId);
  }

  // Add categories in trail except the current category
  trail.forEach((cat) => {
    if (cat.id !== currentCategory.id) {
      breadcrumbItems.push(
        <li key={cat.slug}>
          <Link to={`/cat/${cat.id}/${cat.slug}`}>{cat.name}</Link>
        </li>
      );
    }
  });

  // Render the breadcrumb
  return (
    <div id="trail">
      <nav className="breadcrumb">
        <ol>
          {breadcrumbItems.reduce((acc, crumb, index) => (
            <React.Fragment key={index}>
              {acc}
              {index > 0 && <span className="trail__breadcrumb-separator">›</span>}
              {crumb}
            </React.Fragment>
          ), null)}
        </ol>
      </nav>
    </div>
  );
};

// Render main categories view (for top-level categories)
const renderMainCategories = () => {
  if (!currentCategory) return null;
  const mainCat = mainCategories.find(
    (cat) =>
      cat.id.toString() === currentCategory.parentId?.toString() ||
      cat.slug === currentCategory.parentId
  );
  if (!mainCat) return null;
  const subcategories = categories.filter(cat => cat.parentId === currentCategory?.id) || [];
  return (
    <>
      {/* header with back button to main category */}
      <div className="page-header">
        <div className="hgroup">
          <div className="page-header__title-wrapper">
            <Link
              className="trail__back pressable"
              title="Back"
              to={`/cat/${mainCat.id}/${mainCat.slug}`}
            >
              <svg aria-hidden="true" className="icon" width={16} height={16}>
                <use href="/dist/images/icons/icons.svg#icon-right-thin-16" />
              </svg>
            </Link>
            <h1>{currentCategory?.name}</h1>
          </div>
        </div>
      </div>
      {/* subcategories or products */}
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
                    .map((linkedSubCat, index, arr) => (
                      <React.Fragment key={linkedSubCat.id}>
                        <Link to={`/cat/${linkedSubCat.id}/${linkedSubCat.slug}`}>
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
      {/* footer with alert button & modal */}
      <div className="sections"></div>
      <div className="p__products-section">
        <div className="alerts">
          <button
            data-url={`/cat/${mainCat.id}/${mainCat.slug}`}
            data-title={currentCategory?.name}
            data-max-price="0"
            className="alerts__button pressable"
            onClick={handlePriceAlert}
          >
            <svg aria-hidden="true" className="icon" width={20} height={20}>
              <use href="/dist/images/icons/icons.svg#icon-notification-outline-20" />
            </svg>
            <span className="alerts__label">Ειδοποίηση</span>
          </button>
          <div className="alerts__prompt">
            σε <span className="alerts__title">{currentCategory?.name}</span>
          </div>
        </div>
      </div>
      {isPriceAlertModalOpen && (
        <PriceAlertModal
          isOpen={isPriceAlertModalOpen}
          onClose={() => setIsPriceAlertModalOpen(false)}
          categoryName={currentCategory?.name}
          categoryId={currentCategory?.id}
        />
      )}
    </>
  );
};

// Render subcategories view
const renderSubcategories = (category) => {
  if (!category) return null;
  return (
    <>
      {/* header with back button to current category */}
      <div className="page-header">
        <div className="hgroup">
          <div className="page-header__title-wrapper">
            <Link
              className="trail__back pressable"
              title={category.name}
              to={`/cat/${category.id}/${category.slug}`}
            >
              <svg aria-hidden="true" className="icon" width={16} height={16}>
                <use href="/dist/images/icons/icons.svg#icon-right-thin-16" />
              </svg>
            </Link>
            <h1>{category.name}</h1>
          </div>
        </div>
      </div>
      {/* subcategories */}
      <div className="root-category__categories">
        {categories
          .filter((cat) => cat.parentId === category?.id)
          .length > 0 ? (
          categories
            .filter((cat) => cat.parentId === category?.id)
            .map((subCat) => (
              <div key={subCat.id} className="root-category__category">
                <Link
                  to={`/cat/${subCat.id}/${subCat.slug}`}
                  className="root-category__cover"
                >
                  <img src={subCat.image} alt={subCat.name} title={subCat.name} />
                </Link>
                <h2 className="root-category__category-title">
                  <Link to={`/cat/${subCat.id}/${subCat.slug}`}>
                    {subCat.name}
                  </Link>
                </h2>
                <div className="root-category__footer">
                  <div className="root-category__links">
                    {categories
                      .filter(
                        (linkedSubCat) => linkedSubCat.parentId === subCat.id
                      )
                      .slice(0, 5)
                      .map((linkedSubCat, index, arr) => (
                        <React.Fragment key={linkedSubCat.id}>
                          <Link
                            to={`/cat/${linkedSubCat.id}/${linkedSubCat.slug}`}
                          >
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
      {/* footer with alert button & modal */}
      <div className="sections"></div>
      <div className="p__products-section">
        <div className="alerts">
          <button
            data-url={`/cat/${category.id}/${category.slug}`}
            data-title={category.name}
            data-max-price="0"
            className="alerts__button pressable"
            onClick={handlePriceAlert}
          >
            <svg aria-hidden="true" className="icon" width={20} height={20}>
              <use href="/dist/images/icons/icons.svg#icon-notification-outline-20" />
            </svg>
            <span className="alerts__label">Ειδοποίηση</span>
          </button>
          <div className="alerts__prompt">
            σε <span className="alerts__title">{category.name}</span>
          </div>
        </div>
      </div>
      {isPriceAlertModalOpen && (
        <PriceAlertModal
          isOpen={isPriceAlertModalOpen}
          onClose={() => setIsPriceAlertModalOpen(false)}
          categoryName={category?.name}
          categoryId={category?.id}
        />
      )}
    </>
  );
};

// Render products list
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
            <ScrollableSlider>{null}</ScrollableSlider>
          </div>
        </div>
        <div className="page-header__sorting">
          <div className="tabs">
            <div className="tabs-wrapper">
              <nav>
                <a
                  data-type="rating-desc"
                  rel="nofollow"
                  className={sortType === 'rating-desc' ? 'current' : ''}
                  onClick={() => setSortType('rating-desc')}
                >
                  <div className="tabs__content">Δημοφιλέστερα</div>
                </a>
                <a
                  data-type="price-asc"
                  rel="nofollow"
                  className={sortType === 'price-asc' ? 'current' : ''}
                  onClick={() => setSortType('price-asc')}
                >
                  <div className="tabs__content">Φθηνότερα</div>
                </a>
                <a
                  data-type="price-desc"
                  rel="nofollow"
                  className={sortType === 'price-desc' ? 'current' : ''}
                  onClick={() => setSortType('price-desc')}
                >
                  <div className="tabs__content">Ακριβότερα</div>
                </a>
                <a
                  data-type="merchants_desc"
                  rel="nofollow"
                  className={sortType === 'merchants_desc' ? 'current' : ''}
                  onClick={() => setSortType('merchants_desc')}
                >
                  <div className="tabs__content">Αριθμός καταστημάτων</div>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>
      <div className="page-products__main-wrapper">
        <div className="p__products" data-pagination="">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
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
      {currentCategory?.parentId ? renderSubcategories(currentCategory) : renderMainCategories()}
      {isPriceAlertModalOpen && (
        <PriceAlertModal
          isOpen={isPriceAlertModalOpen}
          onClose={() => setIsPriceAlertModalOpen(false)}
          categoryName={currentCategory?.name}
          categoryId={currentCategory?.id}
        />
      )}
    </div>
  </div>
);
};

export default CategoryPage;
