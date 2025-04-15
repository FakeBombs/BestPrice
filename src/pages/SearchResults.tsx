import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';
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
  
  const handleVendorFilter = (vendors: string[]) => {
    if (vendors.length === 0) {
      setFilteredProducts(products);
      return;
    }
    
    const filtered = products.filter(product => 
      product.prices.some(price => vendors.includes(price.vendorId))
    );
    
    setFilteredProducts(filtered);
  };
  
  const handlePriceRangeFilter = (min: number, max: number) => {
    const filtered = products.filter(product => {
      const minPrice = product.prices.length ? Math.min(...product.prices.map(p => p.price)) : 0;
      return minPrice >= min && minPrice <= max;
    });
    
    setFilteredProducts(filtered);
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
                <div className="filters__header"><div className="filters__header-title filters__header-title--filters">Κατηγορίες</div></div>
              </div>
              
              <div className="filters__header"><div className="filters__header-title filters__header-title--filters">Φίλτρα</div></div>
              
              <div class="filter-store filter-collapsed default-list" data-filter-name="Πιστοποιημένα καταστήματα" data-filter-id="store" data-type="store" data-key="store">
                <div class="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div>
                <div class="filter-container">
                  <ol data-total="15" data-hidden="10">
                    <li><a data-l="3" rel="nofollow" href="/search?q=rcf&amp;store=passadena.gr"><span>Passadena</span></a></li>
                    <li><a data-l="3" rel="nofollow" href="/search?q=rcf&amp;store=pinguin.gr"><span>Pinguin</span></a></li>
                    <li><a data-l="3" rel="nofollow" href="/search?q=rcf&amp;store=e-dructer.com"><span>e-dructer</span></a></li>
                    <li><a data-l="3" rel="nofollow" href="/search?q=rcf&amp;store=egalaxy.gr"><span>Egalaxy</span></a></li>
                    <li class="hidden"><a data-l="3" rel="nofollow" href="/search?q=rcf&amp;store=fotistika4u.gr"><span>Fotistika4u</span></a></li>
                    <li class="hidden"><a data-l="3" rel="nofollow" href="/search?q=rcf&amp;store=beegadget.gr"><span>Beegadget</span></a></li>
                    <li class="hidden"><a data-l="3" rel="nofollow" href="/search?q=rcf&amp;store=mahatmahome.gr"><span>MahatmaHome</span></a></li>
                    <li class="hidden"><a data-l="3" rel="nofollow" href="/search?q=rcf&amp;store=ekos.gr"><span>Ekos</span></a></li>
                    <li class="hidden"><a data-l="3" rel="nofollow" href="/search?q=rcf&amp;store=symbolofashion.gr"><span>Symbolofashion</span></a></li>
                    <li class="hidden"><a data-l="3" rel="nofollow" href="/search?q=rcf&amp;store=vrepair.gr"><span>Vrepair</span></a></li>
                    <li class="hidden"><a data-l="2" rel="nofollow" href="/search?q=rcf&amp;store=odes.gr"><span>Odes</span></a></li>
                    <li class="hidden"><a data-l="2" rel="nofollow" href="/search?q=rcf&amp;store=3dmall.gr"><span>3dMall</span></a></li>
                    <li class="hidden"><a data-l="2" rel="nofollow" href="/search?q=rcf&amp;store=ledcity.gr"><span>LedCity</span></a></li>
                    <li class="hidden"><a data-l="1" rel="nofollow" href="/search?q=rcf&amp;store=techstores.gr"><span>Techstores</span></a></li>
                    <li class="hidden"><a data-l="1" rel="nofollow" href="/search?q=rcf&amp;store=buychoice.gr"><span>Buychoice</span></a></li>
                  </ol>
                  <div id="filter-store-prompt" class="filters-more-prompt" title="Εμφάνιση όλων των πιστοποιημένων καταστημάτων">
                    <svg aria-hidden="true" class="icon" width="100%" height="100%"><use xlink:href="/public/dist/images/icons/icons.svg#icon-plus-more"></use></svg> 
                    Εμφάνιση όλων
                  </div>
                </div>
              </div>
              
            </div>
            <div className="ads" data-max="0" data-ip="31.152.199.61"></div>
          </aside>

          <main className="page-products__main">
            <div className="page-header">
              <div className="page-header__title-wrapper">
                <div className="page-header__title-main">
                  <h1>{searchQuery}</h1>
                  <div className="page-header__count-wrapper">
                    <div className="page-header__count">{filteredProducts.length} προϊόντα</div>
                    <div data-url="/search?q=rcf&amp;qid=9K0xx2vNRFF_fb47e" data-title="rcf" data-max-price="0" className="alerts-minimal">
                      <svg aria-hidden="true" className="icon" width="20" height="20" viewBox="0 0 20 20" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M2.16821 14.5654C2.16821 14.8698 2.27889 15.1133 2.50024 15.2959C2.7216 15.4785 3.02873 15.5698 3.42163 15.5698H6.92456C6.9467 16.1066 7.09058 16.6019 7.3562 17.0557C7.62736 17.5094 7.98983 17.8747 8.4436 18.1514C8.89738 18.4336 9.41479 18.5747 9.99585 18.5747C10.5824 18.5747 11.1026 18.4364 11.5564 18.1597C12.0102 17.883 12.3699 17.515 12.6355 17.0557C12.9067 16.6019 13.0533 16.1066 13.0754 15.5698H16.5784C16.9713 15.5698 17.2784 15.4785 17.4998 15.2959C17.7211 15.1133 17.8318 14.8698 17.8318 14.5654C17.8318 14.2887 17.7515 14.0203 17.5911 13.7603C17.4306 13.5002 17.2286 13.2456 16.9851 12.9966C16.7472 12.7476 16.5092 12.4985 16.2712 12.2495C16.0886 12.0614 15.9447 11.8151 15.8396 11.5107C15.74 11.2064 15.6653 10.8826 15.6155 10.5396C15.5657 10.1965 15.5297 9.86442 15.5076 9.54346C15.491 8.45329 15.3748 7.49593 15.1589 6.67139C14.9486 5.84131 14.6194 5.14958 14.1711 4.59619C13.7229 4.04281 13.1308 3.6333 12.3948 3.36768C12.2564 2.82536 11.9742 2.36605 11.5481 1.98975C11.1275 1.61344 10.6101 1.42529 9.99585 1.42529C9.38713 1.42529 8.86971 1.61344 8.4436 1.98975C8.02303 2.36605 7.74357 2.82536 7.60522 3.36768C6.86922 3.6333 6.27433 4.04281 5.82056 4.59619C5.37231 5.14958 5.04305 5.84131 4.83276 6.67139C4.62248 7.49593 4.50903 8.45329 4.49243 9.54346C4.4703 9.86442 4.43433 10.1965 4.38452 10.5396C4.33472 10.8826 4.25724 11.2064 4.1521 11.5107C4.05249 11.8151 3.91138 12.0614 3.72876 12.2495C3.4908 12.4985 3.25008 12.7476 3.00659 12.9966C2.76864 13.2456 2.56942 13.5002 2.40894 13.7603C2.24845 14.0203 2.16821 14.2887 2.16821 14.5654ZM3.77856 14.3164V14.2168C3.82837 14.1393 3.91138 14.0369 4.02759 13.9097C4.1438 13.7769 4.27384 13.633 4.41772 13.478C4.56714 13.3231 4.71379 13.1654 4.85767 13.0049C5.00708 12.8389 5.13713 12.6479 5.2478 12.4321C5.35848 12.2108 5.45256 11.9618 5.53003 11.6851C5.6075 11.4084 5.66838 11.1012 5.71265 10.7637C5.75692 10.4261 5.79012 10.0553 5.81226 9.65137C5.83439 8.44499 5.9589 7.48763 6.18579 6.7793C6.41268 6.07096 6.71427 5.54525 7.09058 5.20215C7.47241 4.85352 7.90129 4.61279 8.3772 4.47998C8.48234 4.45784 8.56258 4.41911 8.61792 4.36377C8.67326 4.3029 8.70369 4.21989 8.70923 4.11475C8.72583 3.68311 8.84757 3.33171 9.07446 3.06055C9.30688 2.78385 9.61401 2.64551 9.99585 2.64551C10.3832 2.64551 10.6903 2.78385 10.9172 3.06055C11.1497 3.33171 11.2742 3.68311 11.2908 4.11475C11.2908 4.21989 11.3184 4.3029 11.3738 4.36377C11.4347 4.41911 11.5149 4.45784 11.6145 4.47998C12.0904 4.61279 12.5165 4.85352 12.8928 5.20215C13.2747 5.54525 13.579 6.07096 13.8059 6.7793C14.0383 7.48763 14.1656 8.44499 14.1877 9.65137C14.2043 10.0553 14.2348 10.4261 14.2791 10.7637C14.3289 11.1012 14.3897 11.4084 14.4617 11.6851C14.5391 11.9618 14.6332 12.2108 14.7439 12.4321C14.8546 12.6479 14.9846 12.8389 15.134 13.0049C15.2834 13.1654 15.4301 13.3231 15.574 13.478C15.7234 13.633 15.8534 13.7769 15.9641 13.9097C16.0803 14.0369 16.1633 14.1393 16.2131 14.2168V14.3164H3.77856ZM8.21948 15.5698H11.7805C11.7473 16.1343 11.5675 16.5798 11.241 16.9062C10.9145 17.2383 10.4994 17.4043 9.99585 17.4043C9.4978 17.4043 9.08276 17.2383 8.75073 16.9062C8.42423 16.5798 8.24715 16.1343 8.21948 15.5698Z"/></svg>
                      <div className="alerts-minimal__label"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      
      <ProductFilter
        onSortChange={handleSortChange}
        onVendorFilter={handleVendorFilter}
        onPriceRangeFilter={handlePriceRangeFilter}
        onInStockOnly={handleInStockOnly}
      />
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Δεν βρέθηκαν προϊόντα που να ταιριάζουν με την αναζήτησή σας.
          </p>
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
