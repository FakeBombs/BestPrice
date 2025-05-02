
import React from 'react';

interface FilterOptionsProps {
  query: string;
}

const FilterOptions = ({ query }: FilterOptionsProps) => {
  return (
    <div className="filter-limit default-list" data-filter-name="limit" data-filter-id="" data-type="" data-key="limit">
      <div className="filter__header">
        <h4>Εμφάνιση μόνο</h4>
      </div>
      <div className="filter-container">
        <ol>
          <li data-filter="certified">
            <a title="Πιστοποιημένα καταστήματα" rel="nofollow" href={`/search?q=${query}&certified=1`}>
              <svg aria-hidden="true" className="icon" width="16" height="16">
                <use xlinkHref="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-certified-16"></use>
              </svg>
              <span>Πιστοποιημένα καταστήματα</span>
            </a>
          </li>
          <li id="filter-nearby" className="nearby-location is-set">
            <a title="Κοντά μου" rel="nofollow" href={`/search?q=${query}&nearby=1`}>Κοντά μου (20 χλμ)</a>
            <div className="filter-nearby__options">Επιλογές</div>
          </li>
          <li data-filter="in-stock">
            <a title="Άμεσα διαθέσιμα" rel="nofollow" href={`/search?q=${query}&instock=1`}><span>Άμεσα διαθέσιμα</span></a>
          </li>
          <li data-filter="boxnow">
            <a title="Παράδοση" rel="nofollow" href={`/search?q=${query}&boxnow=1`}>
              <svg aria-hidden="true" className="icon" width="24" height="24">
                <use xlinkHref="//www.bestprice.gr/public/dist/images/icons/partners.svg#icon-boxnow"></use>
              </svg>
              <span className="help" data-tooltip-left="" data-tooltip="Προϊόντα από καταστήματα που υποστηρίζουν παράδοση με BOXNOW">
                <svg aria-hidden="true" className="icon help" width="16" height="16">
                  <use xlinkHref="//www.bestprice.gr//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-info-16"></use>
                </svg>
              </span>
              <span>Παράδοση</span>
            </a>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default FilterOptions;
