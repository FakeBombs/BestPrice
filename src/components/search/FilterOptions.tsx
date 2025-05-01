
import React from 'react';
import { Link } from 'react-router-dom';

interface FilterOptionsProps {
  query: string;
  inStockOnly?: boolean;
  isCertified?: boolean;
}

const FilterOptions = ({ query, inStockOnly = false, isCertified = false }: FilterOptionsProps) => {
  return (
    <div className="filter-limit default-list" data-filter-name="limit">
      <div className="filter__header">
        <h4>Εμφάνιση μόνο</h4>
      </div>
      <div className="filter-container">
        <ol>
          <li data-filter="certified">
            <Link 
              title="Πιστοποιημένα καταστήματα" 
              to={`/search?q=${encodeURIComponent(query)}&certified=${isCertified ? '0' : '1'}`}
              className={isCertified ? 'active' : ''}
            >
              <svg aria-hidden="true" className="icon" width="16" height="16">
                <use xlinkHref="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-certified-16"></use>
              </svg>
              <span>Πιστοποιημένα καταστήματα</span>
            </Link>
          </li>
          <li id="filter-nearby" className="nearby-location">
            <Link title="Κοντά μου" to={`/search?q=${encodeURIComponent(query)}&nearby=1`}>
              Κοντά μου (20 χλμ)
            </Link>
            <div className="filter-nearby__options">Επιλογές</div>
          </li>
          <li data-filter="in-stock">
            <Link 
              title="Άμεσα διαθέσιμα" 
              to={`/search?q=${encodeURIComponent(query)}&instock=${inStockOnly ? '0' : '1'}`}
              className={inStockOnly ? 'active' : ''}
            >
              <span>Άμεσα διαθέσιμα</span>
            </Link>
          </li>
          <li data-filter="boxnow">
            <Link title="Παράδοση" to={`/search?q=${encodeURIComponent(query)}&boxnow=1`}>
              <svg aria-hidden="true" className="icon" width="24" height="24">
                <use xlinkHref="//www.bestprice.gr/public/dist/images/icons/partners.svg#icon-boxnow"></use>
              </svg>
              <span className="help" data-tooltip-left="" data-tooltip="Προϊόντα από καταστήματα που υποστηρίζουν παράδοση με BOXNOW">
                <svg aria-hidden="true" className="icon help" width="16" height="16">
                  <use xlinkHref="//www.bestprice.gr//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-info-16"></use>
                </svg>
              </span>
              <span>Παράδοση</span>
            </Link>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default FilterOptions;
