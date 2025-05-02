import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import PriceAlertModal from '@/components/PriceAlertModal';
import ScrollableSlider from '@/components/ScrollableSlider';
import useProductFilters from '@/hooks/useProductFilters';
import { ProductResultsProps } from '@/components/search/ProductResults';
import { fetchFeaturedProducts, fetchDeals, fetchNewArrivals } from '@/data/mockData';
import ProductCarousel from '@/components/ProductCarousel';

// Main component
const CategoryPage: React.FC = () => {
  const { mainCatSlug, subCatSlug, subSubCatSlug, extraSubSubCatSlug, anotherSubSubCatSlug } = useParams<{
    mainCatSlug?: string;
    subCatSlug?: string;
    subSubCatSlug?: string;
    extraSubSubCatSlug?: string;
    anotherSubSubCatSlug?: string;
  }>(); 

  const { toast } = useToast();
  const { user } = useAuth();
  
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [currentCategory, setCurrentCategory] = useState<any | undefined>(undefined);
  const [sortType, setSortType] = useState('rating-desc');
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState(false);
  const [topOffers, setTopOffers] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [hotSales, setHotSales] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [popularBrands, setPopularBrands] = useState<any[]>([]);

  const { products: filteredResults, handleSortChange, handleVendorFilter, handlePriceRangeFilter, handleInStockOnly } = useProductFilters(filteredProducts);

  useEffect(() => {
    // Find the category by ID, not by slug
    let categoryId = mainCatSlug;
    // Check if mainCatSlug is a valid ID
    let foundCategory = mainCategories.find(cat => cat.id === categoryId) || 
                      categories.find(cat => cat.id === categoryId);
                      
    if (!foundCategory) {
      // If not found by ID, try to find by slug as fallback
      foundCategory = mainCategories.find(cat => cat.slug === mainCatSlug);
    }

    setCurrentCategory(foundCategory);

    // Load related data
    if (foundCategory) {
      // Load category products
      const productsToDisplay = products.filter(product => 
        (product.categoryId && product.categoryId === Number(foundCategory.id))
      );
      setFilteredProducts(productsToDisplay);

      // Load top offers/deals
      fetchDeals().then(deals => {
        const categoryDeals = deals.filter(deal => 
          deal.categoryId === Number(foundCategory.id)
        );
        setTopOffers(categoryDeals);
      });

      // Load new arrivals
      fetchNewArrivals().then(arrivals => {
        const categoryArrivals = arrivals.filter(arrival => 
          arrival.categoryId === Number(foundCategory.id)
        );
        setNewArrivals(categoryArrivals);
      });

      // Load hot sales (using featured products as a substitute)
      fetchFeaturedProducts().then(featured => {
        const categoryFeatured = featured.filter(item => 
          item.categoryId === Number(foundCategory.id)
        );
        setHotSales(categoryFeatured);
      });

      // Load recently viewed (using the last few products as a substitute)
      const mockRecentlyViewed = products.slice(-5).filter(product =>
        product.categoryId === Number(foundCategory.id)
      );
      setRecentlyViewed(mockRecentlyViewed);

      // Load popular brands
      // This would normally come from an API, but for now we'll mock it
      const extractedBrands = [...new Set(productsToDisplay.map(product => product.brand))];
      const brandObjects = extractedBrands
        .filter(Boolean)
        .map(brand => ({ name: brand, id: brand }));
      setPopularBrands(brandObjects);
    }
  }, [mainCatSlug, subCatSlug, subSubCatSlug, extraSubSubCatSlug, anotherSubSubCatSlug]);

  if (!currentCategory) {
    return <NotFound />;
  }

  const handlePriceAlert = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to set a price alert",
      });
      return;
    }

    setIsPriceAlertModalOpen(true);
  };

  function renderBreadcrumbs() {
    const breadcrumbs = [];
    const mainCategory = mainCategories.find(cat => cat.id === mainCatSlug || cat.slug === mainCatSlug);

    if (!mainCategory) return null;

    // Add the main category link if there's a current category with a parent
    if (!(currentCategory && !currentCategory.parentId)) {
      breadcrumbs.push(
        <li key={mainCategory.slug}><Link to={`/cat/${mainCategory.id}/${mainCategory.slug}`}>{mainCategory.name}</Link></li>
      );
    }

    // Create a Set to keep track of slugged categories
    const categoryTrail = [];

    // Build the breadcrumb trail from currentCategory up to the main category
    let category = currentCategory;

    while (category) {
      categoryTrail.unshift(category);  // Prepend to create the trail
      category = categories.find(cat => cat.id === category.parentId);  // Move up the category tree
    }

    // Add categories to breadcrumbs (excluding current category)
    categoryTrail.forEach((cat, index) => {
      if (index !== categoryTrail.length - 1) { // Exclude current category
        breadcrumbs.push(
          <li key={cat.slug}><Link to={`/cat/${cat.id}/${cat.slug}`}>{cat.name}</Link></li>
        );
      }
    });

    // Render Breadcrumbs
    return (
      <div id="trail">
        <nav className="breadcrumb">
          <ol>
            <li>
              <Link to="/" rel="home"><span>BestPrice</span></Link>
              {/* Only show the separator if there are additional breadcrumbs */}
              {breadcrumbs.length > 0 && <span className="trail__breadcrumb-separator">›</span>}
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
  }

  function renderMainCategories() {
    const subcategories = categories.filter(cat => cat.parentId === currentCategory?.id) || [];
    return (
      <>
        <div className="page-header">
          <div className="hgroup">
            <div className="page-header__title-wrapper">
              <Link className="trail__back pressable" title="BestPrice" to="/"><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-right-thin-16"></use></svg></Link>
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
        <div className="sections"></div>
        <div className="p__products-section">
          <div className="alerts">
            <button data-url={`/cat/${mainCatSlug}`} data-title={currentCategory?.name} data-max-price="0" className="alerts__button pressable" onClick={handlePriceAlert}>
              <svg aria-hidden="true" className="icon" width="20" height="20"><use href="/dist/images/icons/icons.svg#icon-notification-outline-20"></use></svg>
              <span className="alerts__label">Ειδοποίηση</span>
            </button>
            <div className="alerts__prompt"> σε <span className="alerts__title">{currentCategory?.name}</span></div>
          </div>
        </div>

        {/* Additional sections */}
        {topOffers.length > 0 && (
          <div className="section">
            <h2 className="section-title">Top Offers in {currentCategory?.name}</h2>
            <div className="products-grid">
              {topOffers.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {newArrivals.length > 0 && (
          <div className="section">
            <h2 className="section-title">New Arrivals in {currentCategory?.name}</h2>
            <div className="products-grid">
              {newArrivals.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {hotSales.length > 0 && (
          <div className="section">
            <h2 className="section-title">Hot Sales in {currentCategory?.name}</h2>
            <div className="products-grid">
              {hotSales.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {recentlyViewed.length > 0 && (
          <div className="section">
            <h2 className="section-title">Recently Viewed in {currentCategory?.name}</h2>
            <div className="products-grid">
              {recentlyViewed.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {popularBrands.length > 0 && (
          <div className="section">
            <h2 className="section-title">Popular Brands in {currentCategory?.name}</h2>
            <div className="brands-list">
              {popularBrands.slice(0, 8).map((brand, index) => (
                <Link key={index} to={`/brand/${brand.id}/${brand.name}`} className="brand-item">
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        )}

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
  }

  function renderSubcategories(currentCategory) {
    // The same function as before but updated to use IDs in URLs
    return (
      <>
        <div className="page-header">
          <div className="hgroup">
            <div className="page-header__title-wrapper">
              <Link className="trail__back pressable" title={currentCategory.name} to={`/cat/${currentCategory.id}/${currentCategory.slug}`}>
                <svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-right-thin-16"></use></svg>
              </Link>
              <h1>{currentCategory.name}</h1>
            </div>
          </div>
        </div>
        <div className="root-category__categories">
          {categories.filter(cat => cat.parentId === currentCategory?.id).length > 0 ? (
            categories.filter(cat => cat.parentId === currentCategory?.id).map((subCat) => {
              return (
                <div key={subCat.id} className="root-category__category">
                  <Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover">
                    <img src={subCat.image} alt={subCat.name} title={subCat.name} />
                  </Link>
                  <h2 className="root-category__category-title">
                    <Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
                  </h2>
                  <div className="root-category__footer">
                    <div className="root-category__links">
                      {categories
                        .filter(linkedSubCat => linkedSubCat.parentId === subCat.id)
                        .slice(0, 5)
                        .map((linkedSubCat, index, arr) => {
                          return (
                            <React.Fragment key={linkedSubCat.id}>
                              <Link to={`/cat/${linkedSubCat.id}/${linkedSubCat.slug}`}>
                                {linkedSubCat.name}
                              </Link>
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
            renderProducts()
          )}
        </div>
        <div className="sections"></div>
        <div className="p__products-section">
          <div className="alerts">
            <button data-url={`/cat/${currentCategory.id}/${currentCategory.slug}`} data-title={currentCategory.name} data-max-price="0" className="alerts__button pressable" onClick={handlePriceAlert}>
              <svg aria-hidden="true" className="icon" width="20" height="20"><use href="/dist/images/icons/icons.svg#icon-notification-outline-20"></use></svg>
              <span className="alerts__label">Ειδοποίηση</span>
            </button>
            <div className="alerts__prompt"> σε <span className="alerts__title">{currentCategory.name}</span></div>
          </div>
        </div>
        
        {/* Additional sections for subcategories */}
        {topOffers.length > 0 && (
          <div className="section">
            <h2 className="section-title">Top Offers in {currentCategory?.name}</h2>
            <div className="products-grid">
              {topOffers.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {newArrivals.length > 0 && (
          <div className="section">
            <h2 className="section-title">New Arrivals in {currentCategory?.name}</h2>
            <div className="products-grid">
              {newArrivals.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {hotSales.length > 0 && (
          <div className="section">
            <h2 className="section-title">Hot Sales in {currentCategory?.name}</h2>
            <div className="products-grid">
              {hotSales.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {recentlyViewed.length > 0 && (
          <div className="section">
            <h2 className="section-title">Recently Viewed in {currentCategory?.name}</h2>
            <div className="products-grid">
              {recentlyViewed.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {popularBrands.length > 0 && (
          <div className="section">
            <h2 className="section-title">Popular Brands in {currentCategory?.name}</h2>
            <div className="brands-list">
              {popularBrands.slice(0, 8).map((brand, index) => (
                <Link key={index} to={`/brand/${brand.id}/${brand.name}`} className="brand-item">
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        )}
        
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
  }

  function renderProducts() {
    return (
      <div className="page-products">
        <aside className="page-products__filters"></aside>
        <main className="page-products__main">
          <header className="page-header">
            <div className="page-header__title-wrapper">
              <div className="products-wrapper">
                <div className="products-wrapper__header"><div className="products-wrapper__title">Επιλεγμένες Προσφορές</div></div>
                <ScrollableSlider>{null}</ScrollableSlider>
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
              {filteredResults.length > 0 ? (
                filteredResults.map(product => (
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
  }

  return (
    <div className="category-page">
      {renderBreadcrumbs()}
      
      {currentCategory.parentId ? 
        renderSubcategories(currentCategory) : 
        renderMainCategories()
      }
      
      {isPriceAlertModalOpen && (
        <PriceAlertModal 
          isOpen={isPriceAlertModalOpen}
          onClose={() => setIsPriceAlertModalOpen(false)}
          categoryName={currentCategory.name}
          categoryId={currentCategory.id}
        />
      )}
    </div>
  );
};

export default CategoryPage;
