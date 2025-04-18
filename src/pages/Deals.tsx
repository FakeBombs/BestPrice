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
                          {categories.map((cat) => (
                            <a key={cat.id} data-id={cat.id} data-cnt={cat.name} className={`deals-distr__cat ${cat.name.toLowerCase().replace(' ', '-')}`} href={`/deals/${cat.id}/${cat.name.toLowerCase().replace(' ', '-').toLowerCase()}.html`} title={`Προσφορές σε ${cat.name}`}>
                              <svg aria-hidden="true" className="icon" width="24" height="24" viewBox="0 0 24 24" role="img"><path d={`M${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)}H${Math.floor(Math.random() * 100)}C${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)}V${Math.floor(Math.random() * 100)}H${Math.floor(Math.random() * 100)}C${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)}V${Math.floor(Math.random() * 100)}C${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)}H${Math.floor(Math.random() * 100)}C${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)}V${Math.floor(Math.random() * 100)}H${Math.floor(Math.random() * 100)}C${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)}V${Math.floor(Math.random() * 100)}C${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)}H${Math.floor(Math.random() * 100)}C${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)}V${Math.floor(Math.random() * 100)}H${Math.floor(Math.random() * 100)}C${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)}V${Math.floor(Math.random() * 100)}C${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)}.path(${cat.id})Z` fill-rule="evenodd" clip-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              <span>{cat.name}</span>
                            </a>
                          ))}
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
                  <svg aria-hidden="true" class="icon" width="18" height="18" viewBox="0 0 18 18" role="img"><g xmlns="http://www.w3.org/2000/svg" clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.80311 C5.60911 ,17.8723 ,8.95611 ,10.8393 ,8.84111 ,10.5303 C8.72511 ,10.2213 ,5.17611 ,9.09426 ,5.00311 ,8.55126 C4.82911 ,8.00826 ,12.0101 ,-0.155736 ,12.1991 ,0.00226364 C12.3871 ,0.160264 ,9.07011 ,7.24026 ,9.16011 ,7.47126 C9.25111 ,7.70126 ,12.8881 ,8.87526 ,12.9981 ,9.45026 C13.1091 ,10.0253 ,5.99611 ,18.1263 ,5.80311 ,17.9993 ZM22.5 ,17.75 C22.5 ,19.683 ,20.933 ,21.25 ,19 ,21.25 C17.067 ,21.25 ,15.5 ,19.683 ,15.5 ,17.75 C15.5 ,15.817 ,17.067 ,14.25 ,19 ,14.25 C20.933 ,14.25 ,22.5 ,15.817 ,22.5 ,17.75 ZM18.4781 ,5.75014 C17.2699 ,4.54196 ,13.4412 ,6.41178 ,9.92649 ,9.92649 C6.41178 ,13.4412 ,4.54196 ,17.2699 ,5.75014 ,18.4781 ZM8.5 C8.5 ,7.25 C19.0288 ,8.87521 C19.0288 C16.7489 C13.4412 C13.4412 C8.8822 C8.8822 V4 M19 V2H4V2H4V21H21V21H21V2H16 ZM16 ZM7 ZM18 V18H3v-3H16v3h2Z"></path></g></svg><span>Black {t('deals')}</span></div><input readonly="" type="checkbox" /></div></div>



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

            <div class="tools__sentinel tools__sentinel--up"></div>
            <div class="tools tools--has-drop tools--has-sorting tools--sticky">
              <div class="tools__button" data-id="drop">
                <div class="tools__label">Πτώση %</div>
              </div>
              <div class="tools__button" data-id="sorting">
                <div class="tools__label">Επιλεγμένες</div>
              </div>
            </div>
            <div class="tools__sentinel tools__sentinel--down"></div>


            <div class="p__products" data-pagination="">
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
