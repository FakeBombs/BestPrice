import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products, Category, Product } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import PriceAlertModal from '@/components/PriceAlertModal';
import ScrollableSlider from '@/components/ScrollableSlider';

const CategoryPage: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const { toast } = useToast();
  const { user } = useAuth();

  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [sortType, setSortType] = useState('rating-desc');
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState(false);

  // Combines main and subcategories for easier lookup
  const allCategories = [...mainCategories, ...categories];

  const findCategory = (identifier: string): Category | undefined => {
    return allCategories.find(
      (cat) => cat.id.toString() === identifier || cat.slug === identifier
    );
  };

  const defaultCategoryId = mainCategories.length > 0 ? mainCategories[0].id : null;

  useEffect(() => {
    if (pathSegments.length < 2 || pathSegments[0] !== 'cat') {
      if (defaultCategoryId !== null) {
        const defaultCat = mainCategories.find(cat => cat.id === defaultCategoryId);
        setCurrentCategory(defaultCat);
        setFilteredProducts([]);
      } else {
        setCurrentCategory(undefined);
        setFilteredProducts([]);
      }
      return;
    }

    const segments = pathSegments.slice(1);
    const lastSegment = segments[segments.length - 1];
    let matchedCategory = findCategory(lastSegment);

    if (matchedCategory) {
      setCurrentCategory(matchedCategory);

      if (matchedCategory.parentId !== null || !matchedCategory.isMain) {
          const productsToDisplay = products.filter(p =>
            p.categoryIds?.includes(matchedCategory.id)
          );
          setFilteredProducts(productsToDisplay);
      } else {
          setFilteredProducts([]);
      }
    } else {
      if (defaultCategoryId !== null) {
        const defaultCat = mainCategories.find(cat => cat.id === defaultCategoryId);
        setCurrentCategory(defaultCat);
      } else {
        setCurrentCategory(undefined);
      }
      setFilteredProducts([]); // Clear products on fallback
    }
  }, [location.pathname, defaultCategoryId]);

  if (
    pathSegments.length >= 2 &&
    pathSegments[0] === 'cat' &&
    currentCategory === undefined
  ) {
    return <NotFound />;
  }

  const sortProducts = (productsList: any[]) => {
    // Added checks for potentially undefined a.prices or b.prices
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
          const avgA = (a.ratingSum || 0) / Math.max(a.numReviews || 1, 1);
          const avgB = (b.ratingSum || 0) / Math.max(b.numReviews || 1, 1);
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
      toast({ title: 'Login Required', description: 'Please log in to set a price alert', variant: 'destructive' });
      return;
    }
    if (currentCategory) {
        setIsPriceAlertModalOpen(true);
    } else {
        toast({ title: 'Error', description: 'Cannot set alert, category not selected.', variant: 'destructive' });
    }
  };

  const renderBreadcrumbs = () => {
    const trailItems: React.ReactNode[] = [];
    trailItems.push(
      <li key="home"><Link to="/" rel="home"><span>BestPrice</span></Link></li>
    );

    if (currentCategory && currentCategory.parentId !== null && !currentCategory.isMain) {
        const ancestors: Category[] = [];
        let category: Category | undefined = currentCategory;

        while (category && category.parentId !== null) {
            const parent = allCategories.find((cat) => cat.id === category?.parentId);
            if (parent) {
                 ancestors.unshift(parent);
                 category = parent;
            } else {
                 category = undefined;
            }
        }

        ancestors.forEach((cat) => {
            trailItems.push(
                <li key={cat.id}><Link to={`/cat/${cat.id}/${cat.slug}`}>{cat.name}</Link></li>
            );
        });
    }

    return (
      <div id="trail">
        <nav className="breadcrumb">
          <ol>
            {trailItems.reduce((acc, item, index) => (
              <React.Fragment key={index}>
                {acc}
                {trailItems.length > 1 && index > 0 && <span className="trail__breadcrumb-separator">›</span>}
                {item}
              </React.Fragment>
            ), null)}
          </ol>
        </nav>
      </div>
    );
  };

  const renderMainCategories = () => {
    if (!currentCategory || currentCategory.parentId !== null || !currentCategory.isMain) {
      return null; 
    }

    const mainCat = currentCategory;
    const subcategories = categories.filter(cat => cat.parentId === mainCat.id);

    return (
      <>
        {subcategories.length > 0 && (
          <div className="page-header">
            <div className="hgroup">
              <div className="page-header__title-wrapper">
                <h1>{mainCat.name}</h1>
              </div>
            </div>
          </div>
        )}

        <div className="root-category__categories">
          {subcategories.length > 0 ? (
            subcategories.map((subCat) => (
              <div key={subCat.id} className="root-category__category">
                <Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover">
                  <img src={subCat.image || '/dist/images/cat/placeholder.webp'} alt={subCat.name} title={subCat.name} />
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
                          <Link to={`/cat/${linkedSubCat.id}/${linkedSubCat.slug}`}>{linkedSubCat.name}</Link>
                          {index < arr.length - 1 && ', '}
                        </React.Fragment>
                      ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
             <p>Δεν υπάρχουν υποκατηγορίες για αυτήν την κατηγορία.</p>
          )}
        </div>

        <div className="sections"></div>
        <div className="p__products-section">
          <div className="alerts">
            <button data-url={`/cat/${mainCat.id}/${mainCat.slug}`} data-title={mainCat.name} data-max-price="0" className="alerts__button pressable" onClick={handlePriceAlert}>
              <svg aria-hidden="true" className="icon" width={20} height={20}><use href="/dist/images/icons/icons.svg#icon-notification-outline-20" /></svg>
              <span className="alerts__label">Ειδοποίηση</span>
            </button>
            <div className="alerts__prompt">σε <span className="alerts__title">{mainCat.name}</span></div>
          </div>
        </div>
      </>
    );
  };

  const renderSubcategories = (category: Category) => {
    if (!category || category.parentId === null || category.isMain) {
        return null;
    }

    const childCategories = categories.filter(cat => cat.parentId === category.id);
    const parentCategory = allCategories.find(cat => cat.id === category.parentId);

    return (
      <>
        {childCategories.length > 0 && (
          <div className="page-header">
            <div className="hgroup">
              <div className="page-header__title-wrapper">
                {parentCategory && (
                   <Link className="trail__back pressable" title={`Επιστροφή σε ${parentCategory.name}`} to={`/cat/${parentCategory.id}/${parentCategory.slug}`}>
                      <svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-right-thin-16" /></svg>
                   </Link>
                )}
                <h1>{category.name}</h1>
              </div>
            </div>
          </div>
        )}

        {childCategories.length > 0 ? (
            <div className="root-category__categories">
            {childCategories.map((subCat) => (
                <div key={subCat.id} className="root-category__category">
                <Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover">
                    <img src={subCat.image || '/dist/images/cat/placeholder.webp'} alt={subCat.name} title={subCat.name} />
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
                            <Link to={`/cat/${linkedSubCat.id}/${linkedSubCat.slug}`}>{linkedSubCat.name}</Link>
                            {index < arr.length - 1 && ', '}
                        </React.Fragment>
                        ))}
                    </div>
                </div>
                </div>
            ))}
            </div>
        ) : (
            renderProducts()
        )}

        <div className="sections"></div>
        <div className="p__products-section">
          <div className="alerts">
            <button data-url={`/cat/${category.id}/${category.slug}`} data-title={category.name} data-max-price="0" className="alerts__button pressable" onClick={handlePriceAlert}>
              <svg aria-hidden="true" className="icon" width={20} height={20}><use href="/dist/images/icons/icons.svg#icon-notification-outline-20" /></svg>
              <span className="alerts__label">Ειδοποίηση</span>
            </button>
            <div className="alerts__prompt">σε <span className="alerts__title">{category.name}</span></div>
          </div>
        </div>
      </>
    );
  };

  const renderProducts = () => {
    const sortedProducts = sortProducts(filteredProducts);
    const showProductHeader = sortedProducts.length > 0;

    return (
        <div className="page-products">
        <aside className="page-products__filters"></aside>
        <main className="page-products__main">
            {showProductHeader && (
                <header className="page-header">
                    {/* Optional: Featured offers slider */}
                    {/* <div className="page-header__title-wrapper"> ... </div> */}

                    {/* Sorting Tabs */}
                    <div className="page-header__sorting">
                    <div className="tabs">
                        <div className="tabs-wrapper">
                        <nav>
                            <a href="#" data-type="rating-desc" rel="nofollow" className={sortType === 'rating-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); setSortType('rating-desc'); }}><div className="tabs__content">Δημοφιλέστερα</div></a>
                            <a href="#" data-type="price-asc" rel="nofollow" className={sortType === 'price-asc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); setSortType('price-asc'); }}><div className="tabs__content">Φθηνότερα</div></a>
                            <a href="#" data-type="price-desc" rel="nofollow" className={sortType === 'price-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); setSortType('price-desc'); }}><div className="tabs__content">Ακριβότερα</div></a>
                            <a href="#" data-type="merchants_desc" rel="nofollow" className={sortType === 'merchants_desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); setSortType('merchants_desc'); }}><div className="tabs__content">Αριθμός καταστημάτων</div></a>
                        </nav>
                        </div>
                    </div>
                    </div>
                </header>
            )}
            {/* Product Grid */}
            <div className="page-products__main-wrapper">
            <div className="p__products" data-pagination="">
                {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))
                ) : (
                // Check if we are in a category context before showing "no products"
                currentCategory && !currentCategory.isMain && <p>Δεν υπάρχουν προϊόντα για αυτήν την κατηγορία.</p>
                )}
            </div>
            </div>
        </main>
        </div>
    );
   };

  // Main component render structure
  return (
    <div className="root__wrapper root-category__root">
      <div className="root">
        {renderBreadcrumbs()}

        {/* Render the main category view (shows its subcategories) IF currentCategory is a main one */}
        {renderMainCategories()}

        {/* Render the subcategory view (shows its children or products) IF currentCategory is a subcategory */}
        {currentCategory && (currentCategory.parentId !== null && !currentCategory.isMain) && renderSubcategories(currentCategory)}

        {/* Conditionally render the Price Alert Modal */}
        {isPriceAlertModalOpen && currentCategory && (
          <PriceAlertModal isOpen={isPriceAlertModalOpen} onClose={() => setIsPriceAlertModalOpen(false)} categoryName={currentCategory.name} categoryId={currentCategory.id} />
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
