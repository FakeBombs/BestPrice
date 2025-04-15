import { useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { searchProducts } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';

const SearchResults = ({ initialProducts, initialVendorList }) => {
  const userAgent = navigator.userAgent.toLowerCase();
  const [jsEnabled, setJsEnabled] = useState(false);
  let classNamesForBody = '';
  let classNamesForHtml = '';

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

  classNamesForHtml += isAdBlocked ? ' adblocked' : ' adallowed';

  useEffect(() => {
    const handleLoad = () => {
      setJsEnabled(true);
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  classNamesForHtml += jsEnabled ? ' js-enabled' : ' js-disabled';
    
  const newIdForBody = '';
  const newIdForHtml = 'page-cat';
  useHtmlAttributes(classNamesForHtml, newIdForHtml);
  useBodyAttributes(classNamesForBody, newIdForBody);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [products, setProducts] = useState(initialProducts || []);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [vendorList, setVendorList] = useState(initialVendorList || []);

  useEffect(() => {
    let filteredResults = products;

    if (searchQuery) {
      filteredResults = filteredResults.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (vendorList.length > 0) {
      filteredResults = filteredResults.filter(product =>
        product.prices.some(price => vendorList.includes(price.vendorId))
      );
    }

    setFilteredProducts(filteredResults);
  }, [searchQuery, products, vendorList]);

  const handleSort = (sortOption) => {
    const sorted = [...filteredProducts];

    if (sortOption === 'price-asc') {
      sorted.sort((a, b) => Math.min(...a.prices.map(p => p.price)) - Math.min(...b.prices.map(p => p.price)));
    } else if (sortOption === 'price-desc') {
      sorted.sort((a, b) => Math.min(...b.prices.map(p => p.price)) - Math.min(...a.prices.map(p => p.price)));
    }

    setFilteredProducts(sorted);
  };

  const handleInStockOnly = (inStockOnly) => {
    if (inStockOnly) {
      setFilteredProducts(products.filter(product => product.prices.some(price => price.inStock)));
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <div className="root__wrapper">
      <div className="root">
        <div className="page-products">
          <aside className="page-products__filters">
            <div id="filters">
              {/* Existing filter categories */}
              <div className="filters__header">
                <div className="filters__header-title">Φίλτρα</div>
              </div>
              <div className="filter-options">
                <h4>Ταξινόμηση κατά:</h4>
                <ol>
                  <li onClick={() => handleSort('price-asc')}>
                    <Link to={`/search?q=${searchQuery}&sort=price-asc`}>Τιμή: Χαμηλότερη προς Υψηλότερη</Link>
                  </li>
                  <li onClick={() => handleSort('price-desc')}>
                    <Link to={`/search?q=${searchQuery}&sort=price-desc`}>Τιμή: Υψηλότερη προς Χαμηλότερη</Link>
                  </li>
                </ol>
              </div>
              <div className="filter-limit default-list">
                <div className="filter__header"><h4>Εμφάνιση μόνο</h4></div>
                <div className="filter-container">
                  <ol>
                    <li data-filter="in-stock">
                      <Link onClick={() => handleInStockOnly(true)} to={`/search?q=${searchQuery}&instock=1`}>Άμεσα διαθέσιμα</Link>
                    </li>
                    {/* Other existing filters */}
                  </ol>
                </div>
              </div>
              <div className="filter-store filter-collapsed default-list">
                <div className="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div>
                <div className="filter-container">
                  <ol data-total={vendorList.length}>
                    {vendorList.map((vendor, index) => (
                      <li key={vendor.id}>
                        <Link to={`/search?q=${searchQuery}&store=${vendor.id}`}><span>{vendor.name}</span></Link>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </aside>

          <main className="page-products__main">
            <div className="page-header">
              <div className="page-header__title-main">
                <h1>{searchQuery}</h1>
                <div className="page-header__count">{filteredProducts.length} προϊόντα</div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Δεν βρέθηκαν προϊόντα που να ταιριάζουν με την αναζήτησή σας.</p>
              </div>
            ) : (
              <div className="product-grid mt-6">
                {filteredProducts.map((product) => (
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
