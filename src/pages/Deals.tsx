import { useState, useEffect } from 'react';
import { fetchDeals } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';
import { useTranslation } from '@/hooks/useTranslation';

const Deals = () => {

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
      classNamesForBody = 'has-sorting-filters pagination-controlled';
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
  const newIdForHtml = 'page-deals';

  useHtmlAttributes(classNamesForHtml, newIdForHtml);
  useBodyAttributes(classNamesForBody, newIdForBody);

  
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const { t } = useTranslation();
  
  useEffect(() => {
    const dealsData = fetchDeals();
    setDeals(dealsData);
    setFilteredDeals(dealsData);
  }, []);
  
  // Filter and sort functions
  const handleSortChange = (value: string) => {
    const sorted = [...filteredDeals];
    
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
    
    setFilteredDeals(sorted);
  };
  
  const handleVendorFilter = (vendors: string[]) => {
    if (vendors.length === 0) {
      setFilteredDeals(deals);
      return;
    }
    
    const filtered = deals.filter(product => 
      product.prices.some(price => vendors.includes(price.vendorId))
    );
    
    setFilteredDeals(filtered);
  };
  
  const handlePriceRangeFilter = (min: number, max: number) => {
    const filtered = deals.filter(product => {
      const minPrice = product.prices.length ? Math.min(...product.prices.map(p => p.price)) : 0;
      return minPrice >= min && minPrice <= max;
    });
    
    setFilteredDeals(filtered);
  };
  
  const handleInStockOnly = (inStockOnly: boolean) => {
    if (!inStockOnly) {
      setFilteredDeals(deals);
      return;
    }
    
    const filtered = deals.filter(product => 
      product.prices.some(price => price.inStock)
    );
    
    setFilteredDeals(filtered);
  };
  
  return (
    <div className="root__wrapper">
      <div className="root">

        <div className="deals-tabs">
          <a className="deals-tabs__tab deals-tabs__tab--selected" href="/deals">{t('deals')}</a>
          <a className="deals-tabs__tab" href="/deals/c">Ανά κατηγορία</a>
          <a className="deals-tabs__tab" href="/deals/my">Οι Προσφορές μου</a>
          <a className="deals-tabs__tab" href="/deals/m">Ανά κατάστημα</a>
          <a className="deals-tabs__tab" href="/deals/b">Ανά κατασκευαστή</a>
        </div>

        <header className="page-header">
          <h1>{t('deals')} & Εκπτώσεις</h1>
          <p>6.551 προϊόντα με μεγάλη πτώση τιμής</p>
        </header>
      
        <ProductFilter onSortChange={handleSortChange} onVendorFilter={handleVendorFilter} onPriceRangeFilter={handlePriceRangeFilter} onInStockOnly={handleInStockOnly} />
        
        <div className="page-products">
          <main className="page-products__main">

            <div className="deals-distr__wrapper">
              <div className="deals-distr deals-distr--center">
                <div className="scroll scroll--center scroll--small">
                  <div className="scroll__clip">
                    <div className="scroll__scroller">
                      <div className="scroll__content">
                        <div className="deals-distr__cats">
                          <a data-id="6989" data-cnt="1131" className="deals-distr__cat" href="/deals/6989/technology.html" title="Προσφορές σε Τεχνολογία">
                            <svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img">
                              <path d="M17 2H7C6.44772 2 6 2.44772 6 3V21C6 21.5523 6.44772 22 7 22H17C17.5523 22 18 21.5523 18 21V3C18 2.44772 17.5523 2 17 2ZM12.5 4H14M10 4H10.5" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M12.5 19.5C12.5 19.7761 12.2761 20 12 20 11.7239 20 11.5 19.7761 11.5 19.5 11.5 19.2239 11.7239 19 12 19 12.2761 19 12.5 19.2239 12.5 19.5ZM15.25 6.5 8.5 13.25M12.2605 6.5 8.5 10.2316" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span>{t('technology')}</span>
                          </a>
                          <a data-id="2185" data-cnt="1720" className="deals-distr__cat" href="/deals/2185/home-garden.html" title="Προσφορές σε Σπίτι & Κήπος">
                            <svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img">
                              <path fill-rule="evenodd" d="M6 2H18L20 12H4L6 2Z" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M12 12V19.2543M16 12V16M5 20.5C5 19.9477 5.44772 19.5 6 19.5H18C18.5523 19.5 19 19.9477 19 20.5V22H5V20.5Z" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span>Σπίτι & Κήπος</span>
                          </a>
                          <a data-id="2068" data-cnt="2190" className="deals-distr__cat" href="/deals/2068/fashion.html" title="Προσφορές σε Μόδα">
                            <svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img">
                              <path d="M5.8777 7.5C5.93812 8.06394 5.97559 8.72578 5.97559 9.5V22H17.9756V9.5C17.9756 8.72578 18.0131 8.06394 18.0735 7.5M18.5 11.0626L22 10.0626L18.9756 4.5L14.9756 2H8.97559L4.97559 4.5L2 10.0626L5.5 11.0626" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M8.97559 2.25C8.97559 3.90685 10.3187 5.25 11.9756 5.25C13.6324 5.25 14.9756 3.90685 14.9756 2.25" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span>Μόδα</span>
                          </a>
                          <a data-id="583" data-cnt="511" className="deals-distr__cat" href="/deals/583/health-beauty.html" title="Προσφορές σε Υγεία & Ομορφιά">
                            <svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img">
                              <path d="M6 4 8 18V21C8 21.5523 8.44772 22 9 22H15C15.5523 22 16 21.5523 16 21V18L18 4V2H6V4ZM8 18H15.75M6.5 4.5H11.5M14 4.5H15" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span>Υγεία & Ομορφιά</span>
                          </a>
                          <a data-id="2175" data-cnt="526" className="deals-distr__cat" href="/deals/2175/paidika-brefika.html" title="Προσφορές σε Παιδικά - Βρεφικά">
                            <svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img">
                              <path d="M12.5 15.75C12.5 18.7876 10.0376 21.25 7 21.25 3.96243 21.25 1.5 18.7876 1.5 15.75 1.5 12.7124 3.96243 10.25 7 10.25 10.0376 10.25 12.5 12.7124 12.5 15.75ZM22.5 17.75C22.5 19.683 20.933 21.25 19 21.25 17.067 21.25 15.5 19.683 15.5 17.75 15.5 15.817 17.067 14.25 19 14.25 20.933 14.25 22.5 15.817 22.5 17.75Z" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M7 15.75L8.72147 5.4212C8.8822 4.45683 9.71658 3.75 10.6943 3.75H13.5" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M8.5 7.25C8.5 7.25 19.0288 8.87521 19.0288 17.7441" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M15.9683 10.75C15.9683 10.75 18.4683 10.3628 18.4683 8.25M16.7214 7.06104 19.4505 5.57244C19.9974 5.27412 20.681 5.54309 20.878 6.1341L21.0613 6.68376C21.2771 7.33129 20.7951 7.99998 20.1126 7.99998H16.9608C16.4428 7.99998 16.2666 7.30908 16.7214 7.06104Z" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span>Παιδικά - Βρεφικά</span>
                          </a>
                          <a data-id="3058" data-cnt="269" className="deals-distr__cat" href="/deals/3058/sports-hobbies.html" title="Προσφορές σε Hobby, Αθλητισμός">
                            <svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img">
                              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M12.015 20.9723C11.1004 16.0277 13.8957 12.3469 10.5431 9.51942C8.07443 7.43744 5.42553 8.4672 3.05798 12.1731" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M18.4781 5.75014C17.2699 4.54196 13.4412 6.41178 9.92649 9.92649C6.41178 13.4412 4.54196 17.2699 5.75014 18.4781" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M18.3028 18.3816C20.3896 16.2947 19.2321 11.7537 15.7174 8.23899C12.2027 4.72427 7.66169 3.56676 5.57483 5.65363" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span>Hobby, Αθλητισμός</span>
                          </a>
                          <a data-id="3204" data-cnt="204" className="deals-distr__cat" href="/deals/3204/auto-moto.html" title="Προσφορές σε Μηχανοκίνηση">
                            <svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img">
                              <path d="M18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12Z" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M16 12C16 14.2091 14.2091 16 12 16 9.79086 16 8 14.2091 8 12 8 9.79086 9.79086 8 12 8 14.2091 8 16 9.79086 16 12ZM6.49663 3.64925 7.84375 3.8125M6.49663 3.64925C7.92433 2.70646 9.60802 2.11998 11.421 2.01648M6.49663 3.64925C5.04056 4.61077 3.85076 5.94291 3.0616 7.51129M11.421 2.01648C11.6126 2.00554 11.8057 2 12 2 13.6147 2 15.1401 2.38271 16.4903 3.06238M11.421 2.01648 12.5 2.83594M16.4903 3.06238 17.0156 4.3125M16.4903 3.06238C18.0599 3.85252 19.3929 5.044 20.3543 6.50207M20.3543 6.50207 20.1875 7.84766M20.3543 6.50207C21.2953 7.92896 21.8804 9.61115 21.9836 11.4224M21.9836 11.4224C21.9945 11.6135 22 11.8061 22 12 22 13.6141 21.6176 15.1389 20.9384 16.4887M21.9836 11.4224 21.168 12.5M20.9384 16.4887 19.6953 17.0117M20.9384 16.4887C20.1484 18.0587 18.957 19.392 17.4989 20.3537M17.4989 20.3537 16.1562 20.1914M17.4989 20.3537C16.0739 21.2936 14.3942 21.8787 12.5856 21.9831M12.5856 21.9831C12.3919 21.9943 12.1966 22 12 22 10.3871 22 8.86346 21.6182 7.51442 20.94M12.5856 21.9831 11.5039 21.1641M7.51442 20.94 6.98828 19.6875M7.51442 20.94C5.94598 20.1515 4.61361 18.9624 3.65162 17.507M3.65162 17.507 3.81641 16.1484M3.65162 17.507C2.70796 16.0793 2.12071 14.3954 2.01665 12.582M2.01665 12.582C2.0056 12.3894 2 12.1953 2 12 2 10.3859 2.38242 8.8611 3.0616 7.51129M2.01665 12.582 2.83594 11.5039M3.0616 7.51129 4.3125 6.98828" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span>Μηχανοκίνηση</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="deals__picks">
              <header className="deals__picks-header">
                <h2 className="section__title">{t('deals')} της ημέρας</h2>
                <div className="descr">Επιλεγμένες προσφορές από την ομάδα του BestPrice</div>
              </header>
            </section>

            <div className="deals-black-filter__wrapper">
              <div className="deals-black-filter">
                <div className="deals-black-filter__label">
                  <svg aria-hidden="true" className="icon" width="18" height="18" viewBox="0 0 18 18" role="img"><g xmlns="http://www.w3.org/2000/svg" clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.80311 17.9993C5.60911 17.8723 8.95611 10.8393 8.84111 10.5303C8.72511 10.2213 5.17611 9.09426 5.00311 8.55126C4.82911 8.00826 12.0101 -0.155736 12.1991 0.00226364C12.3871 0.160264 9.07011 7.24026 9.16011 7.47126C9.25111 7.70126 12.8881 8.87526 12.9981 9.45026C13.1091 10.0253 5.99611 18.1263 5.80311 17.9993Z" fill="url(#b)"/></g></svg>
                  <span>Black {t('deals')}</span>
                </div>
                <input readOnly type="checkbox" />
              </div>
            </div>

            <header className="page-header page-header--deals-default">
              <div className="page-header__sorting">
                <div className="tabs">
                  <div className="tabs-wrapper">
                    <nav>
                      <a href="/deals" rel="nofollow" className="current">Επιλεγμένες</a>
                      <a href="/deals?o=pop" rel="nofollow">Δημοφιλέστερες</a>
                      <a href="/deals?o=ts%3Adesc" rel="nofollow">Νεότερες</a>
                      <a href="/deals?o=pc%3Adesc" rel="nofollow">Μεγαλύτερη πτώση</a>
                      <a href="/deals?o=price" rel="nofollow">Φθηνότερα</a>
                      <a href="/deals?o=price%3Adesc" rel="nofollow">Ακριβότερα</a>
                    </nav>
                  </div>
                </div>
                
                <select className="deals-drop-range">
                  <option value="0">Ποσοστό πτώσης τιμής</option>
                  <option value="15">15% ή περισσότερο</option>
                  <option value="20">20% ή περισσότερο</option>
                  <option value="25">25% ή περισσότερο</option>
                  <option value="30">30% ή περισσότερο</option>
                  <option value="50">50% ή περισσότερο</option>
                </select>
              </div>
            </header>

            <div className="tools__sentinel tools__sentinel--up"></div>
            <div className="tools tools--has-drop tools--has-sorting tools--sticky">
              <div className="tools__button" data-id="drop">
                <div className="tools__label">Πτώση %</div>
              </div>
              <div className="tools__button" data-id="sorting">
                <div className="tools__label">Επιλεγμένες</div>
              </div>
            </div>
            <div className="tools__sentinel tools__sentinel--down"></div>

            <div className="p__products" data-pagination="">
              {filteredDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Deals;
