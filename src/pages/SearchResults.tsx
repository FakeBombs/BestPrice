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

  // State for active filters
  const [activeFilters, setActiveFilters] = useState({ vendors: [], inStockOnly: false });

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

  const handleVendorFilter = (vendor) => {
    if (activeFilters.inStockOnly) {
      const newVendors = activeFilters.vendors.includes(vendor)
        ? activeFilters.vendors.filter(v => v !== vendor)
        : [...activeFilters.vendors, vendor];

      setActiveFilters(prev => ({ ...prev, vendors: newVendors }));

      // Update filtered products
      const filtered = newVendors.length === 0 
        ? products.filter(product => product.prices.some(price => price.inStock)) 
        : products.filter(product => product.prices.some(price => price.vendorId === vendor && price.inStock));

      setFilteredProducts(filtered);
    }
  };

  const handleInStockOnly = () => {
    const newInStockOnly = !activeFilters.inStockOnly;
    setActiveFilters(prev => {
      // If inStockOnly is being enabled, keep current vendors
      const vendors = newInStockOnly ? prev.vendors : [];
      return { ...prev, inStockOnly: newInStockOnly, vendors };
    });

    const filtered = newInStockOnly 
      ? products.filter(product => product.prices.some(price => price.inStock)) 
      : products;

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
              <div className="filter-limit default-list" data-filter-name="limit" data-filter-id="" data-type="" data-key="limit">
                <div className="filter__header"><h4>Εμφάνιση μόνο</h4></div>
                <div className="filter-container">
                  <ol>
                    <li data-filter="certified"><a title="Πιστοποιημένα καταστήματα" rel="nofollow" href="/search?q=rcf&certified=1"><svg aria-hidden="true" className="icon" width="16" height="16"><use xlinkHref="/public/dist/images/icons/icons.svg#icon-certified-16"></use></svg><span>Πιστοποιημένα καταστήματα</span></a></li>
                    <li id="filter-nearby" className="nearby-location is-set"><a title="Κοντά μου" rel="nofollow" href="/search?q=rcf&nearby=1">Κοντά μου (20 χλμ)</a><div className="filter-nearby__options">Επιλογές</div></li>
                    <li data-filter="in-stock" className={activeFilters.inStockOnly ? 'selected' : ''} onClick={handleInStockOnly}>
                      <a title={activeFilters.inStockOnly ? "Όλα τα προιόντα" : "Άμεσα Διαθέσιμα"} rel="nofollow">
                        <span>{activeFilters.inStockOnly ? "Όλα τα προιόντα" : "Άμεσα Διαθέσιμα"}</span>
                      </a>
                    </li>
                    <li data-filter="boxnow"><a title="Παράδοση" rel="nofollow" href="/search?q=rcf&boxnow=1"><svg aria-hidden="true" className="icon" width="24" height="24"><use xlinkHref="/public/dist/images/icons/partners.svg#icon-boxnow"></use></svg><span className="help" data-tooltip-left="" data-tooltip="Προϊόντα από καταστήματα που υποστηρίζουν παράδοση με BOXNOW"><svg aria-hidden="true" className="icon help" width="16" height="16"><use xlinkHref="/public/dist/images/icons/icons.svg#icon-info-16"></use></svg></span><span>Παράδοση</span></a></li>
                  </ol>
                </div>
              </div>
              <div className="filter-store filter-collapsed default-list">
                <div className="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div>
                <div className="filter-container">
                  <ol>
                    <li className={activeFilters.vendors.includes('v1') ? 'selected' : ''} onClick={() => handleVendorFilter('v1')}><span>You</span></li>
                    <li className={activeFilters.vendors.includes('v2') ? 'selected' : ''} onClick={() => handleVendorFilter('v2')}><span>Plaisio</span></li>
                    <li className={activeFilters.vendors.includes('v3') ? 'selected' : ''} onClick={() => handleVendorFilter('v3')}><span>Public</span></li>
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
              <div className="page-header__sorting">
                <div className="tabs">
                  <div className="tabs-wrapper">
                    <nav>
                      <a href={`/search?q=${searchQuery}`} rel="nofollow" className="current"><div className="tabs__content">Σχετικότερα</div></a>
                      <a onClick={() => handleSortChange('price-asc')} rel="nofollow"><div className="tabs__content">Φθηνότερα</div></a>
                      <a onClick={() => handleSortChange('price-desc')} rel="nofollow"><div className="tabs__content">Ακριβότερα</div></a>
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
