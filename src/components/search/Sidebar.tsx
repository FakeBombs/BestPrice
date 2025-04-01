
import React from 'react';
import CategoryFilters from './CategoryFilters';
import FilterOptions from './FilterOptions';
import BrandFilterSection from './BrandFilterSection';
import StoreFilterSection from './StoreFilterSection';

interface SidebarProps {
  query: string;
}

const Sidebar = ({ query }: SidebarProps) => {
  return (
    <aside className="page-products__filters">
      <div id="filters">
        <CategoryFilters query={query} />

        <div className="filters__header">
          <div className="filters__header-title filters__header-title--filters">Φίλτρα</div>
        </div>

        <FilterOptions query={query} />
        <BrandFilterSection query={query} />
        <StoreFilterSection query={query} />
        
        <div className="filters__buttons">
          <button className="button" data-filters-close="">Εμφάνιση των προϊόντων</button>
        </div>
        <div className="filters__md-toggler" hidden role="button">
          <h5>
            <svg aria-hidden="true" className="icon" width="18" height="18">
              <use xlinkHref="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-filters-18"></use>
            </svg>
            ΦΙΛΤΡΑ
          </h5>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
