import { useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { searchProducts } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';

const SearchResults = ({ initialProducts, initialVendorList }) => {
  const userAgent = navigator.userAgent.toLowerCase();
  const [jsEnabled, setJsEnabled] = useState(false);
  let classNamesForBody = '';
  let classNamesForHtml = '';

  // Check for ad blockers
  const checkAdBlockers = () => {
    const adElementsToCheck = ['.adsbox', '.ad-banner', '.video-ad'];
    return adElementsToCheck.some(selector => {
      const adElement = document.createElement('div');
      adElement.className = selector.slice(1);
      document.body.appendChild(adElement);
      const isBlocked = adElement.offsetHeight === 0 || getComputedStyle(adElement).display === 'none';
      document.body.removeChild(adElement);
      return isBlocked;
    });
  };

  const isAdBlocked = checkAdBlockers();

  // Determine device type
  if (userAgent.includes('windows')) {
    classNamesForHtml = 'windows no-touch not-touch supports-webp supports-ratio supports-flex-gap supports-lazy supports-assistant is-desktop is-modern flex-in-button is-prompting-to-add-to-home';
    classNamesForBody = 'has-filters-selected pagination-controlled';
  } else if (userAgent.includes('mobile')) {
    classNamesForHtml = 'is-mobile';
    classNamesForBody = 'mobile';
  } else if (userAgent.includes('tablet')) {
    classNamesForHtml = 'is-tablet';
    classNamesForBody = 'tablet';
  } else {
    classNamesForHtml = 'unknown-device';
  }

  // Handle ad blockers
  classNamesForHtml += isAdBlocked ? ' adblocked' : ' adallowed';

  // Set JavaScript enabled state
  useEffect(() => {
    const handleLoad = () => {
      setJsEnabled(true);
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  // Add JS enabled/disabled class
  classNamesForHtml += jsEnabled ? ' js-enabled' : ' js-disabled';

  // Set attributes
  const newIdForBody = ''; // Keeping body ID empty
  const newIdForHtml = 'page-cat';
  useHtmlAttributes(classNamesForHtml, newIdForHtml);
  useBodyAttributes(classNamesForBody, newIdForBody);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [products, setProducts] = useState(initialProducts || []);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [vendorList, setVendorList] = useState(initialVendorList || []);

  useEffect(() => {
    let filteredResults = products; // Start with all products

    // Step 1: Filter by search query
    if (searchQuery) {
      filteredResults = filteredResults.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Step 2: Filter by vendor list if available
    if (vendorList.length > 0) {
      filteredResults = filteredResults.filter(product =>
        product.prices.some(price => vendorList.includes(price.vendorId))
      );
    }

    // Set filtered products based on combined criteria
    setFilteredProducts(filteredResults);
  }, [searchQuery, products, vendorList]);

  // Filter and sort functions
  const handleSortChange = (value: string) => {
    const sorted = [...filteredProducts];

    switch (value) {
      case 'price-asc':
        sorted.sort((a, b) => {
          const aPrice = a.prices.length ? Math.min(...a.prices.map(p => p.price)) : 0;
          const bPrice = b.prices.length ? Math.min(...b.prices.map(p => p.price)) : 0;
          return aPrice - bPrice;
        });
        break;
      case 'price-desc':
        sorted.sort((a, b) => {
          const aPrice = a.prices.length ? Math.min(...a.prices.map(p => p.price)) : 0;
          const bPrice = b.prices.length ? Math.min(...b.prices.map(p => p.price)) : 0;
          return bPrice - aPrice;
        });
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews-desc':
        sorted.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }

    setFilteredProducts(sorted);
  };

  const handleInStockOnly = (inStockOnly: boolean) => {
    if (!inStockOnly) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.prices.some(price => price.inStock)
    );

    setFilteredProducts(filtered);
  };

  return (
    <div className="root__wrapper">
      <div className="root">
        <div className="page-products">
          <aside className="page-products__filters">
            <div id="filters">
              <div className="filters__categories" data-filter-name="categories">
                <div className="filters__header">
                  <div className="filters__header-title filters__header-title--filters">Κατηγορίες</div>
                </div>
              </div>
              <div className="filters__header">
                <div className="filters__header-title filters__header-title--filters">Φίλτρα</div>
              </div>
              <div class="filter-limit default-list" data-filter-name="limit" data-filter-id="" data-type="" data-key="limit">
                <div class="filter__header"><h4>Εμφάνιση μόνο</h4></div>
                <div class="filter-container">
                  <ol>
                    <li data-filter="certified">
                      <Link title="Πιστοποιημένα καταστήματα" rel="nofollow" to="/search?q=${searchQuery}&amp;certified=1">
                        <svg aria-hidden="true" class="icon" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-certified-16"></use></svg>
                        <span>Πιστοποιημένα καταστήματα</span>
                      </Link>
                    </li>
                    <li id="filter-nearby" class="nearby-location is-set">
                      <Link title="Κοντά μου" rel="nofollow" to="/search?q=${searchQuery}&amp;nearby=1">Κοντά μου (20 χλμ)</Link>
                      <div class="filter-nearby__options">Επιλογές</div>
                    </li>
                    <li data-filter="in-stock">
                      <Link title="Άμεσα διαθέσιμα" rel="nofollow" to="/search?q=${searchQuery}&amp;instock=1"><span>Άμεσα διαθέσιμα</span></Link>
                    </li>
                    <li data-filter="boxnow">
                      <Link title="Παράδοση" rel="nofollow" to="/search?q=${searchQuery}&amp;boxnow=1">
                        <svg aria-hidden="true" class="icon" width="24" height="24"><use xlink:href="/public/dist/images/icons/partners.svg#icon-boxnow"></use></svg>
                        <span class="help" data-tooltip-left="" data-tooltip="Προϊόντα από καταστήματα που υποστηρίζουν παράδοση με BOXNOW">
                          <svg aria-hidden="true" class="icon help" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-info-16"></use></svg>
                        </span>
                        <span>Παράδοση</span>
                      </Link>
                    </li>
                  </ol>
                </div>
              </div>
              <div className="filter-store filter-collapsed default-list" data-filter-name="Πιστοποιημένα καταστήματα" data-filter-id="store" data-type="store" data-key="store">
                <div className="filter__header">
                  <h4>Πιστοποιημένα καταστήματα</h4>
                </div>
                <div className="filter-container">
                  <ol data-total={vendorList.length} data-hidden={vendorList.length > 5 ? vendorList.length - 5 : 0}>
                    {vendorList.map((vendor, index) => (
                      <li key={vendor.id} className={index >= 5 && !isExpanded ? "hidden" : ""}>
                        <Link data-l={3} rel="nofollow" to={`/search?q=${searchQuery}&store=${vendor.id}`}>
                          <span>{vendor.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                  {vendorList.length > 5 && (
                    <div
                      id="filter-store-prompt"
                      className="filters-more-prompt"
                      title="Εμφάνιση όλων των πιστοποιημένων καταστημάτων"
                      role="button"
                    >
                      <svg aria-hidden="true" className="icon" width="100%" height="100%">
                        <use xlinkHref="/public/dist/images/icons/icons.svg#icon-plus-more"></use>
                      </svg>
                      Εμφάνιση όλων
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          <main className="page-products__main">
            <div className="page-header">
              <div className="page-header__title-wrapper">
                <div className="page-header__title-main">
                  <h1>{searchQuery}</h1>
                  <div className="page-header__count-wrapper">
                    <div className="page-header__count">{filteredProducts.length} προϊόντα</div>
                  </div>
                </div>
              </div>
            </div>

            <ProductFilter
              onSortChange={handleSortChange}
              onInStockOnly={handleInStockOnly}
            />

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Δεν βρέθηκαν προϊόντα που να ταιριάζουν με την αναζήτησή σας.
                </p>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Προσπαθήστε να αλλάξετε τα κριτήρια αναζήτησής σας ή διαγράψτε κάποιο φίλτρο.
                  </p>
                )}
              </div>
            ) : (
              <div className="product-grid mt-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {filteredProducts.length > 0 && (
                  <p className="text-lg text-muted-foreground mt-4">
                    Βρέθηκαν {filteredProducts.length} προϊόντα.
                  </p>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
