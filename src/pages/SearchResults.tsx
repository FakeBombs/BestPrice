import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';

const SearchResults = () => {

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
    const handleLoad = () => setJsEnabled(true);
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  // Add JS enabled/disabled class
  classNamesForHtml += jsEnabled ? ' js-enabled' : ' js-disabled';

  // Set attributes
  useHtmlAttributes(classNamesForHtml, 'page-cat');
  useBodyAttributes(classNamesForBody, '');

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      const results = searchProducts(searchQuery);
      setProducts(results);
      setFilteredProducts(results);
    }
  }, [searchQuery]);

  // Filter and sort functions
  const handleSortChange = (value) => {
    const sorted = [...filteredProducts];
    switch (value) {
      case 'price-asc':
        sorted.sort((a, b) => Math.min(...a.prices.map(p => p.price)) - Math.min(...b.prices.map(p => p.price)));
        break;
      case 'price-desc':
        sorted.sort((a, b) => Math.min(...b.prices.map(p => p.price)) - Math.min(...a.prices.map(p => p.price)));
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

  const handleVendorFilter = (vendors) => {
    const filtered = vendors.length === 0 ? products : products.filter(product => product.prices.some(price => vendors.includes(price.vendorId)));
    setFilteredProducts(filtered);
  };

  const handlePriceRangeFilter = (min, max) => {
    const filtered = products.filter(product => {
      const minPrice = product.prices.length ? Math.min(...product.prices.map(p => p.price)) : 0;
      return minPrice >= min && minPrice <= max;
    });
    setFilteredProducts(filtered);
  };

  const handleInStockOnly = (inStockOnly) => {
    const filtered = inStockOnly ? products.filter(product => product.prices.some(price => price.inStock)) : products;
    setFilteredProducts(filtered);
  };

  return (
    <div className="root__wrapper">
      <div className="root">
        <div className="page-products">
          <aside className="page-products__filters">
            <div id="filters">
              <div className="filters__header">
                <div className="filters__header-title filters__header-title--filters">Φίλτρα</div>
              </div>
              <div class="filter-limit default-list" data-filter-name="limit" data-filter-id="" data-type="" data-key="limit">
                <div class="filter__header"><h4>Εμφάνιση μόνο</h4></div>
                <div class="filter-container">
                  <ol>
                    <li data-filter="certified"><a title="Πιστοποιημένα καταστήματα" rel="nofollow" href="/search?q=rcf&amp;certified=1"><svg aria-hidden="true" class="icon" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-certified-16"></use></svg><span>Πιστοποιημένα καταστήματα</span></a></li>
                    <li id="filter-nearby" class="nearby-location is-set"><a title="Κοντά μου" rel="nofollow" href="/search?q=rcf&amp;nearby=1">Κοντά μου (20 χλμ)</a><div class="filter-nearby__options">Επιλογές</div></li>
                    <li data-filter="in-stock" onClick={() => handleInStockOnly(true)}><a title="Άμεσα διαθέσιμα" rel="nofollow"><span>Άμεσα διαθέσιμα</span></a></li>
                    <li data-filter="boxnow"><a title="Παράδοση" rel="nofollow" href="/search?q=rcf&amp;boxnow=1"><svg aria-hidden="true" class="icon" width="24" height="24"><use xlink:href="/public/dist/images/icons/partners.svg#icon-boxnow"></use></svg><span class="help" data-tooltip-left="" data-tooltip="Προϊόντα από καταστήματα που υποστηρίζουν παράδοση με BOXNOW"><svg aria-hidden="true" class="icon help" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-info-16"></use></svg></span><span>Παράδοση</span></a></li>
                  </ol>
                </div>
              </div>
              <ol>
                <li onClick={() => handleSortChange('price-asc')}>Τιμή: Χαμηλότερη προς Υψηλότερη</li>
                <li onClick={() => handleSortChange('price-desc')}>Τιμή: Υψηλότερη προς Χαμηλότερη</li>
                <li onClick={() => handleInStockOnly(true)}>Άμεσα διαθέσιμα</li>
                {/* Add vendor filtering here dynamically based on your vendor data */}
                {/* e.g., <li onClick={() => handleVendorFilter(['vendorId'])}>Vendor Name</li> */}
              </ol>
              <div className="filter-store filter-collapsed default-list">
                <div className="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div>
                <div className="filter-container">
                  <ol>
                    {/* Example hardcoded vendor list */}
                    <li onClick={() => handleVendorFilter(['passadena.gr'])}><span>Passadena</span></li>
                    <li onClick={() => handleVendorFilter(['pinguin.gr'])}><span>Pinguin</span></li>
                    {/* Continue for other vendors... */}
                  </ol>
                </div>
              </div>
            </div>
          </aside>

          <main className="page-products__main">
            <div className="page-header">
              <div className="page-header__title-wrapper">
                <div className="page-header__title-main">
                  <h1>{searchQuery}</h1>
                  <div className="page-header__count">{filteredProducts.length} προϊόντα</div>
                </div>
              </div>
              <div class="page-header__sorting">
                <div class="tabs">
                  <div class="tabs-wrapper">
                    <nav>
                      <a href="/search?q=${searchQuery}" rel="nofollow" class="current"><div class="tabs__content">Σχετικότερα</div></a>
                      <a onClick={() => handleSortChange('price-asc')} rel="nofollow"><div class="tabs__content">Φθηνότερα</div></a>
                      <a onClick={() => handleSortChange('price-desc')} rel="nofollow"><div class="tabs__content">Ακριβότερα</div></a>
                    </nav>
                  </div>
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Δεν βρέθηκαν προϊόντα που να ταιριάζουν με την αναζήτησή σας.</p>
              </div>
            ) : (
              <div className="product-grid mt-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
