import { vendors } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

const Stores = () => {
  const { t } = useTranslation();
  return (
    <div className="root__wrapper">
      <div className="root">
        <div id="trail"><nav className="breadcrumb"><ol><li><Link to="/" rel="home"><span>BestPrice</span></Link><span className="trail__breadcrumb-separator">›</span></li><li><span>Καταστήματα</span></li></ol></nav></div>

        <header className="page-header">
          <div className="page-header__thead"><h1>{vendors.length} καταστήματα</h1></div>
          <div className="page-header__sorting">
            <span className="right" id="merchant-search">
              <span className="autocomplete__wrapper" style={{ position: 'relative', display: 'inline-block', verticalAlign: 'top', zIndex: 500000000 }}>
                <input type="search" id="merchant-search-q" placeholder="Γρήγορη εύρεση καταστήματος" autoFocus autoComplete="off" autoCorrect="off" spellCheck="false" />
                <div className="autocomplete autocomplete--minimal" style={{ display: 'none' }}></div>
              </span>
            </span>
            <div className="tabs">
              <div className="tabs-wrapper">
                <nav>
                  <a data-type="" href="/m" className="current">Δημοφιλία</a>
                  <a data-type="title:asc" href="/m?o=title%3Aasc">Αλφαβητικά</a>
                  <a data-type="level:desc" href="/m?o=level%3Adesc">Πιστοποίηση</a>
                  <a data-type="orders" href="/m?o=orders">
                    <svg aria-hidden="true" className="icon" width="16" height="16">
                      <path xmlns="http://www.w3.org/2000/svg" d="M14.0001 4.69998L8.0171 7.99698C8.01193 7.99997 8.00607 8.00154 8.0001 8.00154C7.99413 8.00154 7.98827 7.99997 7.9831 7.99698L2.0001 4.70098M8.0001 7.99998V14.666M8.0001 14.666C8.00289 14.666 8.00564 14.6653 8.0081 14.664L13.9901 11.338V11.34C13.9933 11.338 13.996 11.3352 13.9977 11.3319C13.9995 11.3285 14.0003 11.3248 14.0001 11.321V4.70898C14.0001 4.70098 13.9961 4.69398 13.9901 4.68998L8.0081 1.33598C8.00564 1.33467 8.00289 1.33398 8.0001 1.33398C7.99731 1.33398 7.99456 1.33467 7.9921 1.33598L2.0101 4.68898C2.0041 4.69298 2.0001 4.69998 2.0001 4.70798V11.32C1.99971 11.3239 2.00045 11.3279 2.00222 11.3314C2.00399 11.335 2.00672 11.3379 2.0101 11.34L7.9921 14.664C7.99456 14.6653 7.99731 14.666 8.0001 14.666Z"/>
                    </svg>
                    Αποθήκευση παραγγελίας
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </header>

        <div className="tools__sentinel tools__sentinel--up"></div>
        <div className="tools tools--has-sorting tools--has-search tools--sticky">
          <div className="tools__button" data-id="sorting">
            <svg aria-hidden="true" className="icon tools__icon" width="18" height="18">
              <path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" d="M1.89126 3.08579C1.24441 3.70874 0.594486 4.33467 0 5C0.679463 5.04667 1.36084 5.0542 2 5C2.10749 8.00866 2.10749 10.9895 2 14C1.36084 13.942 0.679463 13.9514 0 14C0.589638 14.6587 1.23382 15.2794 1.87543 15.8977L1.87544 15.8977C2.25514 16.2635 2.63394 16.6285 3 17C3.47102 16.4716 3.98288 15.9905 4.4904 15.5135L4.49041 15.5135L4.49042 15.5134C5.01489 15.0205 5.53471 14.5319 6 14C5.31862 13.9533 4.63532 13.9458 4 14C3.92706 10.9838 3.92706 8.01242 4 5C4.63532 5.05231 5.31862 5.04479 6 5C5.53346 4.46457 5.01037 3.97339 4.48286 3.47807C3.97734 3.00339 3.46776 2.5249 3 2C2.63902 2.36565 2.26565 2.72522 1.89126 3.08579ZM18 3C14.3327 3.00231 10.6673 3.00231 7 3C7.00393 3.66667 7.00393 4.33333 7 5C8.83366 4.99885 10.6668 4.99942 12.5 5C14.3332 5.00058 16.1663 5.00115 18 5C17.9961 4.33103 17.9961 3.66667 18 3ZM10.2712 8.99854H10.2714C11.5141 8.9945 12.7568 8.99046 14 9C13.9963 9.67298 13.9963 10.327 14 11C12.7568 11.0095 11.5141 11.0055 10.2714 11.0015H10.2714C9.18105 10.9979 8.09073 10.9944 7 11C7.00372 10.3316 7.00372 9.66607 7 9C8.09069 9.00562 9.18097 9.00208 10.2712 8.99854ZM8.38387 13.9996C7.92258 14.0004 7.46129 14.0012 7 14C7.00327 14.6669 7.00327 15.3335 7 16C7.44443 15.999 7.88886 15.9998 8.33329 16.0006C8.88886 16.0016 9.44443 16.0026 10 16C9.99673 15.3311 9.99673 14.6669 10 14C9.46129 13.9977 8.92258 13.9987 8.38387 13.9996Z"/>
            </svg>
            <div className="tools__label">Δημοφιλία</div>
          </div>
          <div className="tools__search" data-id="search">
            <span className="autocomplete__wrapper" style={{ position: 'relative', display: 'inline-block', verticalAlign: 'top', zIndex: 500000000 }}>
              <input id="tools__search" placeholder="Αναζήτηση ..." type="search" autoComplete="off" autoCorrect="off" spellCheck="false"/>
              <div className="autocomplete autocomplete--minimal" style={{ display: 'none' }}></div>
            </span>
          </div>
        </div>
        <div className="tools__sentinel tools__sentinel--down"></div>

        <main id="merchant-listing">
          <ul className="merchants-listing grid" data-pagination="">
            {vendors.map((vendor) => {
            const vendorSlug = vendor.name.toLowerCase().replace(/\s+/g, '-');
              return (
                <li className="merchants__merchant g-1 g-lg-2" key={vendor.id}>
                  <div className="merchants-listing__thumb-container" data-id={vendor.id}>
                    <svg aria-hidden="true" className="icon merchants-listing__certification-icon" width="22" height="22">
                      {/* SVG paths here */}
                    </svg>
                    <Link className="merchants-listing__thumb" to={`/m/${vendor.id}/${vendorSlug}.html`}>
                      <img src={vendor.logo} loading="lazy" alt={vendor.name} />
                    </Link>
                  </div>
                  <div className="merchants-listing__details">
                    <h3>
                      <Link to={`/m/${vendor.id}/${vendorSlug}.html`} title={vendor.name}>
                        {vendor.name}
                      </Link>
                    </h3>
                    <p className="merchants-listing__counts">
                      {vendor.productCount} προϊόντα<span className="hide-mobile"> σε {vendor.categoryCount} κατηγορίες</span>
                    </p>
                    <Link className="merchant__rating" aria-label="Merchant reviews" to={`/m/${vendor.id}/${vendorSlug}.html#reviews`}>
                      <span className="rating rating-all" data-total="519">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="text-sm">{vendor.rating.toFixed(1)}/5.0</span>
                      </span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </main>
      </div>
    </div>
  );
};

export default Stores;
