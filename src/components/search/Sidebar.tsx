
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CategoryFilters from './CategoryFilters';
import FilterOptions from './FilterOptions';
import { Brand } from '@/services/brandService';
import { Vendor } from '@/services/vendorService';

interface SidebarProps {
  query: string;
  brands: Brand[];
  vendors: Vendor[];
}

const Sidebar = ({ query, brands, vendors }: SidebarProps) => {
  const [searchParams] = useSearchParams();
  
  // Get the current filters
  const currentStore = searchParams.get('store') || '';
  const currentBrand = searchParams.get('brand') || '';
  const inStockOnly = searchParams.get('instock') === '1';
  const isCertified = searchParams.get('certified') === '1';
  
  return (
    <aside className="page-products__filters">
      <div id="filters">
        <CategoryFilters query={query} />

        <div className="filters__header">
          <div className="filters__header-title filters__header-title--filters">Φίλτρα</div>
        </div>

        <FilterOptions query={query} inStockOnly={inStockOnly} isCertified={isCertified} />
        
        {/* Brand Filter */}
        <div className="filter-brand filter-collapsed default-list" data-filter-name="Κατασκευαστής">
          <div className="filter__header"><h4>Κατασκευαστής</h4></div>
          <div className="filter-container">
            <ol>
              {brands.map(brand => (
                <li key={brand.id}>
                  <Link 
                    to={`/search?q=${encodeURIComponent(query)}&brand=${encodeURIComponent(brand.name.toLowerCase())}`}
                    className={currentBrand === brand.name.toLowerCase() ? 'active' : ''}
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
        
        {/* Store Filter */}
        <div className="filter-store filter-collapsed default-list" data-filter-name="Πιστοποιημένα καταστήματα">
          <div className="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div>
          <div className="filter-container">
            <ol>
              {vendors.map(vendor => {
                // Extract domain from URL (remove http:// or https://)
                const domain = vendor.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
                
                return (
                  <li key={vendor.id}>
                    <Link 
                      to={`/search?q=${encodeURIComponent(query)}&store=${encodeURIComponent(domain)}`}
                      className={currentStore === domain ? 'active' : ''}
                    >
                      <span>{vendor.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
        
        <div className="filters__buttons">
          <Link to={`/search?q=${encodeURIComponent(query)}`} className="button">Εμφάνιση των προϊόντων</Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
