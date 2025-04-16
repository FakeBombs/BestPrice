import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

const SearchResults = () => {
  const [activeFilters, setActiveFilters] = useState({ vendors: [], brands: [], models: [], specs: {}, inStockOnly: false });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [availableVendors, setAvailableVendors] = useState(new Set());
  const [availableBrands, setAvailableBrands] = useState(new Set());
  const [availableModels, setAvailableModels] = useState(new Set());
  const [availableSpecs, setAvailableSpecs] = useState({});

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    if (searchQuery) {
      const results = searchProducts(searchQuery);
      setProducts(results);
      setFilteredProducts(results);
      extractAvailableFilters(results);
    }
  }, [searchQuery]);

  const extractAvailableFilters = (results) => {
    const vendors = new Set();
    const brands = new Set();
    const models = new Set();
    const specs = {};

    results.forEach(product => {
      if (product.vendor) vendors.add(product.vendor); // Check if vendor exists
      brands.add(product.brand);
      models.add(product.model);
      Object.keys(product.specifications).forEach(specKey => {
        if (!specs[specKey]) {
          specs[specKey] = new Set();
        }
        specs[specKey].add(product.specifications[specKey]);
      });
    });

    setAvailableVendors(vendors);
    setAvailableBrands(brands);
    setAvailableModels(models);
    setAvailableSpecs(specs);
  };

  const handleVendorFilter = (vendor) => {
    const newVendors = activeFilters.vendors.includes(vendor)
      ? activeFilters.vendors.filter(v => v !== vendor)
      : [...activeFilters.vendors, vendor];

    setActiveFilters(prev => ({ ...prev, vendors: newVendors }));
    filterProducts(newVendors, activeFilters.brands, activeFilters.models, activeFilters.specs, activeFilters.inStockOnly);
  };

  const handleBrandFilter = (brand) => {
    const newBrands = activeFilters.brands.includes(brand)
      ? activeFilters.brands.filter(b => b !== brand)
      : [...activeFilters.brands, brand];

    setActiveFilters(prev => ({ ...prev, brands: newBrands }));
    filterProducts(activeFilters.vendors, newBrands, activeFilters.models, activeFilters.specs, activeFilters.inStockOnly);
  };

  const handleModelFilter = (model) => {
    const newModels = activeFilters.models.includes(model)
      ? activeFilters.models.filter(m => m !== model)
      : [...activeFilters.models, model];

    setActiveFilters(prev => ({ ...prev, models: newModels }));
    filterProducts(activeFilters.vendors, activeFilters.brands, newModels, activeFilters.specs, activeFilters.inStockOnly);
  };

  const handleSpecFilter = (specKey, specValue) => {
    const currentSpecs = { ...activeFilters.specs };
    const specValues = currentSpecs[specKey] || [];

    if (specValues.includes(specValue)) {
      currentSpecs[specKey] = specValues.filter(v => v !== specValue);
      if (currentSpecs[specKey].length === 0) delete currentSpecs[specKey]; 
    } else {
      currentSpecs[specKey] = [...specValues, specValue];
    }

    setActiveFilters(prev => ({ ...prev, specs: currentSpecs }));
    filterProducts(activeFilters.vendors, activeFilters.brands, activeFilters.models, currentSpecs, activeFilters.inStockOnly);
  };

  const filterProducts = (vendors, brands, models, specs, inStockOnly) => {
    let filtered = products;

    // Apply in-stock filter
    if (inStockOnly) {
      filtered = filtered.filter(product => product.prices.some(price => price.inStock));
    }

    // Apply vendor filter
    if (vendors.length > 0) {
      filtered = filtered.filter(product => vendors.includes(product.vendor));
    }

    // Apply brand filter
    if (brands.length > 0) {
      filtered = filtered.filter(product => brands.includes(product.brand));
    }

    // Apply model filter
    if (models.length > 0) {
      filtered = filtered.filter(product => models.includes(product.model));
    }

    // Apply specification filters
    if (Object.keys(specs).length > 0) {
      filtered = filtered.filter(product => {
        return Object.entries(specs).every(([key, values]) => {
          return values.includes(product.specifications[key]);
        });
      });
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="root__wrapper">
      <div className="root">
        <div className="page-products">
          <aside className="page-products__filters">
            <div id="filters">
              {availableVendors.size > 0 && (
                <div className="filter-vendor default-list">
                  <div className="filter__header"><h4>Vendors</h4></div>
                  <div className="filter-container">
                    <ol>
                      {Array.from(availableVendors).map(vendor => (
                        <li 
                          key={vendor} 
                          className={activeFilters.vendors.includes(vendor) ? 'selected' : ''} 
                          onClick={() => handleVendorFilter(vendor)}>
                          <span>{vendor}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {availableBrands.size > 0 && (
                <div className="filter-brand default-list">
                  <div className="filter__header"><h4>Brands</h4></div>
                  <div className="filter-container">
                    <ol>
                      {Array.from(availableBrands).map(brand => (
                        <li 
                          key={brand} 
                          className={activeFilters.brands.includes(brand) ? 'selected' : ''} 
                          onClick={() => handleBrandFilter(brand)}>
                          <span>{brand}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {availableModels.size > 0 && (
                <div className="filter-model default-list">
                  <div className="filter__header"><h4>Models</h4></div>
                  <div className="filter-container">
                    <ol>
                      {Array.from(availableModels).map(model => (
                        <li 
                          key={model} 
                          className={activeFilters.models.includes(model) ? 'selected' : ''} 
                          onClick={() => handleModelFilter(model)}>
                          <span>{model}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {Object.keys(availableSpecs).length > 0 && (
                Object.keys(availableSpecs).map(specKey => (
                  <div key={specKey} className="filter-specification default-list">
                    <div className="filter__header"><h4>{specKey}</h4></div>
                    <div className="filter-container">
                      <ol>
                        {Array.from(availableSpecs[specKey]).map(specValue => (
                          <li 
                            key={specValue} 
                            className={activeFilters.specs[specKey]?.includes(specValue) ? 'selected' : ''} 
                            onClick={() => handleSpecFilter(specKey, specValue)}>
                            <span>{specValue}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          <main className="page-products__main">
            <div className="page-header">
              <h1>{searchQuery}</h1>
              <div>{filteredProducts.length} products</div>
            </div>
            {filteredProducts.length === 0 ? (
              <p>No products found matching your search.</p>
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
