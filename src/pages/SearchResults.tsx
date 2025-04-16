import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';

const SearchResults = () => {
  const [activeFilters, setActiveFilters] = useState({ vendors: [], inStockOnly: false });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [availableVendors, setAvailableVendors] = useState(new Set());

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    if (searchQuery) {
      const results = searchProducts(searchQuery);
      setProducts(results);
      setFilteredProducts(results); // Show all products by default
      extractAvailableVendors(results); // Extract unique vendors from search results
    }
  }, [searchQuery]);

  const extractAvailableVendors = (results) => {
    const vendors = new Set();
    results.forEach(product => {
      product.prices.forEach(price => {
        if (price.inStock) {
          vendors.add(price.vendorId); // Collect only in-stock vendors
        }
      });
    });
    setAvailableVendors(vendors);
  };

  const handleVendorFilter = (vendor) => {
    const newVendors = activeFilters.vendors.includes(vendor)
      ? activeFilters.vendors.filter(v => v !== vendor)
      : [...activeFilters.vendors, vendor];

    setActiveFilters(prev => ({ ...prev, vendors: newVendors }));

    // Filter based on selected vendors
    filterProducts(newVendors, activeFilters.inStockOnly);
  };

  const handleInStockOnly = () => {
    const newInStockOnly = !activeFilters.inStockOnly;
    setActiveFilters(prev => ({ ...prev, inStockOnly: newInStockOnly }));

    // Filtering products based on both vendor selection and in-stock only
    filterProducts(activeFilters.vendors, newInStockOnly);
  };

  const filterProducts = (vendors, inStockOnly) => {
    let filtered = products;

    // Apply in-stock filter if selected
    if (inStockOnly) {
      filtered = filtered.filter(product => product.prices.some(price => price.inStock));
    }

    // Apply vendor filter if vendors are selected
    if (vendors.length > 0) {
      filtered = filtered.filter(product => product.prices.some(price => vendors.includes(price.vendorId)));
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="root__wrapper">
      <div className="root">
        <div className="page-products">
          <aside className="page-products__filters">
            <div id="filters">
              <div className="filter-limit default-list">
                <div className="filter__header"><h4>Εμφάνιση μόνο</h4></div>
                <div className="filter-container">
                  <ol>
                    <li 
                      data-filter="in-stock" 
                      className={activeFilters.inStockOnly ? 'selected' : ''} 
                      onClick={handleInStockOnly}>
                      <span>{activeFilters.inStockOnly ? "Όλα τα προιόντα" : "Άμεσα Διαθέσιμα"}</span>
                    </li>
                  </ol>
                </div>
              </div>
              <div className="filter-store filter-collapsed default-list">
                <div className="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div>
                <div className="filter-container">
                  <ol>
                    {Array.from(availableVendors).map(vendor => (
                      <li key={vendor} className={activeFilters.vendors.includes(vendor) ? 'selected' : ''} onClick={() => handleVendorFilter(vendor)}><span>{vendor}</span></li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </aside>

          <main className="page-products__main">
            <div className="page-header">
              <h1>{searchQuery}</h1>
              <div>{filteredProducts.length} προϊόντα</div>
            </div>
            {filteredProducts.length === 0 ? (
              <p>Δεν βρέθηκαν προϊόντα που να ταιριάζουν με την αναζήτησή σας.</p>
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
