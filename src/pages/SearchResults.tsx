import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';

const SearchResults = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const [jsEnabled, setJsEnabled] = useState(false);
  
  const [activeFilters, setActiveFilters] = useState({ vendors: [], inStockOnly: false });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [vendorAvailability, setVendorAvailability] = useState(new Map());  // Track vendor availability

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  // Set attributes
  useHtmlAttributes('...', 'page-cat');
  useBodyAttributes('...', '');

  useEffect(() => {
    if (searchQuery) {
      const results = searchProducts(searchQuery);
      setProducts(results);
      setFilteredProducts(results); // Initially show all products
      calculateVendorAvailability(results); // Calculate vendor availability
    }
  }, [searchQuery]);

  // Calculate vendor availability mapping
  const calculateVendorAvailability = (results) => {
    let availabilityMap = new Map();
    results.forEach((product) => {
      product.prices.forEach((price) => {
        if (price.inStock) {
          if (!availabilityMap.has(price.vendorId)) {
            availabilityMap.set(price.vendorId, []);
          }
          availabilityMap.get(price.vendorId).push(product);
        }
      });
    });
    setVendorAvailability(availabilityMap);
  };

  const handleVendorFilter = (vendor) => {
    const newVendors = activeFilters.vendors.includes(vendor)
      ? activeFilters.vendors.filter(v => v !== vendor)
      : [...activeFilters.vendors, vendor];

    setActiveFilters(prev => ({ ...prev, vendors: newVendors }));

    const filtered = newVendors.length === 0 
      ? products 
      : products.filter(product => product.prices.some(price => newVendors.includes(price.vendorId)));

    setFilteredProducts(filtered);
  };

  const handleInStockOnly = () => {
    const newInStockOnly = !activeFilters.inStockOnly;
    setActiveFilters(prev => ({ ...prev, inStockOnly: newInStockOnly }));

    // Filter the products based on in-stock availability
    const filtered = newInStockOnly 
      ? products.filter(product => product.prices.some(price => price.inStock)) 
      : products;

    setFilteredProducts(filtered);
  };

  return (
    <div className="root__wrapper">
      <div className="root">
        <div className="page-products">
          <aside className="page-products__filters">
            <div id="filters">
              {/* Filters UI remains the same */}
              <div className="filter-limit default-list">
                <div className="filter__header"><h4>Εμφάνιση μόνο</h4></div>
                <div className="filter-container">
                  <ol>
                    <li data-filter="in-stock" className={activeFilters.inStockOnly ? 'selected' : ''} onClick={handleInStockOnly}>
                      <span>{activeFilters.inStockOnly ? "Όλα τα προιόντα" : "Άμεσα Διαθέσιμα"}</span>
                    </li>
                  </ol>
                </div>
              </div>
              <div className="filter-store filter-collapsed default-list">
                <div className="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div>
                <div className="filter-container">
                  <ol>
                    {Array.from(vendorAvailability.keys()).map(vendor => (
                      <li key={vendor} className={activeFilters.vendors.includes(vendor) ? 'selected' : ''} onClick={() => handleVendorFilter(vendor)}>
                        <span>{vendor}</span>
                      </li>
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
