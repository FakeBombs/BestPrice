import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ScrollableSlider from '@/components/ScrollableSlider';

const SearchResults = ({ availableCategories }) => {
  const [activeFilters, setActiveFilters] = useState({ vendors: [], brands: [], specs: {}, inStockOnly: false });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [availableVendors, setAvailableVendors] = useState(new Set());
  const [availableBrands, setAvailableBrands] = useState({});
  const [availableSpecs, setAvailableSpecs] = useState({});
  const [categories, setAvailableCategories] = useState([]);
  const [showMoreCategories, setShowMoreCategories] = useState(false);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    if (searchQuery) {
      const results = searchProducts(searchQuery);
      setProducts(results);
      setFilteredProducts(results);
      extractAvailableFilters(results);
      extractCategories(results);
    }
  }, [searchQuery]);

  const extractAvailableFilters = (results) => {
    const vendors = new Set();
    const brandsCount = {};
    const specs = {};

    results.forEach(product => {
      if (product.vendor) vendors.add(product.vendor);
      if (product.brand) {
        brandsCount[product.brand] = (brandsCount[product.brand] || 0) + 1;
      }
      Object.keys(product.specifications).forEach(specKey => {
        if (!specs[specKey]) {
          specs[specKey] = new Set();
        }
        specs[specKey].add(product.specifications[specKey]);
      });
    });

    setAvailableVendors(vendors);
    setAvailableBrands(brandsCount);
    setAvailableSpecs(specs);
  };

  const extractCategories = (results) => {
    const categoryCount = {};
    
    results.forEach(product => {
      if (product.category) {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
      }
    });

    // Convert object to array and sort, with a placeholder image if not available
    const categoriesArray = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
      image: 'https://placehold.co/200x200' // Placeholder for categories without images
    })).slice(0, 8);
    
    setAvailableCategories(categoriesArray);
  };

  const handleVendorFilter = (vendor) => {
    const newVendors = activeFilters.vendors.includes(vendor)
      ? activeFilters.vendors.filter(v => v !== vendor)
      : [...activeFilters.vendors, vendor];

    setActiveFilters(prev => ({ ...prev, vendors: newVendors }));
    filterProducts(newVendors, activeFilters.brands, activeFilters.specs, activeFilters.inStockOnly);
  };

  const handleBrandFilter = (brand) => {
    const newBrands = activeFilters.brands.includes(brand)
      ? activeFilters.brands.filter(b => b !== brand)
      : [...activeFilters.brands, brand];

    setActiveFilters(prev => ({ ...prev, brands: newBrands }));
    filterProducts(activeFilters.vendors, newBrands, activeFilters.specs, activeFilters.inStockOnly);
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
    filterProducts(activeFilters.vendors, activeFilters.brands, currentSpecs, activeFilters.inStockOnly);
  };

  const filterProducts = (vendors, brands, specs, inStockOnly) => {
    let filtered = products;

    if (inStockOnly) {
      filtered = filtered.filter(product => product.prices.some(price => price.inStock));
    }

    if (vendors.length > 0) {
      filtered = filtered.filter(product => vendors.includes(product.vendor));
    }

    if (brands.length > 0) {
      filtered = filtered.filter(product => brands.includes(product.brand));
    }

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
              
              <div className="filters__categories" data-filter-name="categories">
                <div className="filters__header">
                  <div className="filters__header-title filters__header-title--filters">Categories</div>
                </div>
                <ol>
                  {availableCategories.slice(0, showMoreCategories ? availableCategories.length : 8).map(item => (
                    <li key={item.category}>
                      <a href={`/#`}><span>{item.category} ({item.count})</span></a>
                    </li>
                  ))}
                </ol>
                {availableCategories.length > 8 && (
                  <div className="filters-more-prompt" onClick={() => setShowMoreCategories(prev => !prev)} title="Show all categories">
                    <svg aria-hidden="true" className="icon" width="100%" height="100%"><use xlinkHref="/public/dist/images/icons/icons.svg#icon-plus-more"></use></svg> 
                    Show all
                  </div>
                )}
              </div>

              {availableVendors.size > 0 && (
                <div className="filter-vendor default-list">
                  <div className="filter__header"><h4>Vendors</h4></div>
                  <div className="filter-container">
                    <ol>
                      {Array.from(availableVendors).map(vendor => (
                        <li key={vendor} className={activeFilters.vendors.includes(vendor) ? 'selected' : ''} onClick={() => handleVendorFilter(vendor)}>
                          <span>{vendor}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {Object.keys(availableBrands).length > 0 && (
                <div className="filter-brand default-list">
                  <div className="filter__header"><h4>Brands</h4></div>
                  <div className="filter-container">
                    <ol>
                      {Object.keys(availableBrands).map(brand => (
                        <li key={brand} className={activeFilters.brands.includes(brand) ? 'selected' : ''} onClick={() => handleBrandFilter(brand)}>
                          <span>{brand} ({availableBrands[brand]})</span>
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
                          <li key={specValue} className={activeFilters.specs[specKey]?.includes(specValue) ? 'selected' : ''} onClick={() => handleSpecFilter(specKey, specValue)}>
                            <span>{specValue}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))
              )}

              <div className="filter-in-stock default-list">
                <div className="filter__header"><h4>In Stock</h4></div>
                <div className="filter-container">
                  <label>
                    <input type="checkbox" checked={activeFilters.inStockOnly} onChange={() => {
                      setActiveFilters(prev => ({ ...prev, inStockOnly: !prev.inStockOnly }));
                      filterProducts(activeFilters.vendors, activeFilters.brands, activeFilters.specs, !activeFilters.inStockOnly);
                    }} />
                    Show only in-stock products
                  </label>
                </div>
              </div>

            </div>
          </aside>

          <main className="page-products__main">
            <div className="page-header">
              <h1>{searchQuery}</h1>
              <div>{filteredProducts.length} products</div>
            </div>
            <section className="section">
                <header className="section__header">
                  <hgroup className="section__hgroup">
                    <h2 className="section__title">Κατηγορίες</h2>
                  </hgroup>
                </header>

                  <div className="categories categories--scrollable scroll__content">
                    {availableCategories.length > 0 && availableCategories.map((item) => (
                      <a key={item.category} title={item.category} className="categories__category" href={`/#`}>
                        <img width="200" height="200" className="categories__image" src={item.image} alt={item.category} />
                        <h2 className="categories__title">{item.category}</h2>
                        <div className="categories__cnt">{item.count} προϊόντα</div>
                      </a>
                    ))}
                  </div>

              </section>
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
