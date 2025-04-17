import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { categories, products as allProducts, rootCategories } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ScrollableSlider from '@/components/ScrollableSlider';

const CategoryPage: React.FC = () => {
  const { rootCategorySlug } = useParams<{ rootCategorySlug: string }>();
  const [activeFilters, setActiveFilters] = useState({ vendors: [], brands: [], specs: {}, inStockOnly: false });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [availableVendors, setAvailableVendors] = useState([]);
  const [availableBrands, setAvailableBrands] = useState({});
  const [availableSpecs, setAvailableSpecs] = useState({});
  const [sortType, setSortType] = useState('rating-desc');

  // Find the root category based on the slug
  const rootCategory = rootCategories.find(rootCat => rootCat.slug === rootCategorySlug);

  if (!rootCategory) {
    return <h1>Category Not Found</h1>;
  }

  // Fetch the relevant subcategories matching the root category
  const subcategories = categories.filter(cat => cat.rootCategoryId === rootCategory.id);
  
  const products = allProducts.filter(product => subcategories.some(cat => cat.name === product.category));

  useEffect(() => {
    const sortedResults = sortProducts(products);
    setFilteredProducts(sortedResults);
    extractAvailableFilters(sortedResults);
  }, [products]);

  useEffect(() => {
    filterProducts(activeFilters.vendors, activeFilters.brands, activeFilters.specs, activeFilters.inStockOnly, products);
  }, [activeFilters, sortType, products]);

  const extractAvailableFilters = (results) => {
    const vendors = new Set();
    const brandsCount = {};
    const specs = {};

    results.forEach((product) => {
      if (product.vendor) {
        vendors.add(product.vendor);
      }
      if (product.brand) {
        brandsCount[product.brand] = (brandsCount[product.brand] || 0) + 1;
      }
      Object.keys(product.specifications).forEach((specKey) => {
        if (!specs[specKey]) {
          specs[specKey] = new Set();
        }
        specs[specKey].add(product.specifications[specKey]);
      });
    });

    setAvailableVendors(Array.from(vendors));
    setAvailableBrands(brandsCount);
    setAvailableSpecs(specs);
  };

  const filterProducts = (vendors, brands, specs, inStockOnly, results) => {
    let filtered = results;

    if (inStockOnly) {
      filtered = filtered.filter((product) => product.prices.some((price) => price.inStock));
    }
    if (vendors.length > 0) {
      filtered = filtered.filter((product) => vendors.includes(product.vendor));
    }
    if (brands.length > 0) {
      filtered = filtered.filter((product) => brands.includes(product.brand));
    }
    if (Object.keys(specs).length > 0) {
      filtered = filtered.filter((product) => {
        return Object.entries(specs).every(([key, values]) => {
          return values.includes(product.specifications[key]);
        });
      });
    }

    filtered = sortProducts(filtered);
    setFilteredProducts(filtered);
    extractAvailableFilters(filtered);
  };

  const sortProducts = (products) => {
    switch (sortType) {
      case 'price-asc':
        return [...products].sort((a, b) => a.prices[0].price - b.prices[0].price);
      case 'price-desc':
        return [...products].sort((a, b) => b.prices[0].price - a.prices[0].price);
      case 'rating-desc':
      default:
        return [...products].sort((a, b) => b.rating - a.rating);
    }
  };

  const handleVendorFilter = (vendor) => {
    const newVendors = activeFilters.vendors.includes(vendor)
      ? activeFilters.vendors.filter((v) => v !== vendor)
      : [...activeFilters.vendors, vendor];
    setActiveFilters((prev) => ({ ...prev, vendors: newVendors }));
  };

  const handleBrandFilter = (brand) => {
    const newBrands = activeFilters.brands.includes(brand)
      ? activeFilters.brands.filter((b) => b !== brand)
      : [...activeFilters.brands, brand];
    setActiveFilters((prev) => ({ ...prev, brands: newBrands }));
  };

  const handleSpecFilter = (specKey, specValue) => {
    const currentSpecs = { ...activeFilters.specs };
    const specValues = currentSpecs[specKey] || [];
    if (specValues.includes(specValue)) {
      currentSpecs[specKey] = specValues.filter((v) => v !== specValue);
      if (currentSpecs[specKey].length === 0) delete currentSpecs[specKey];
    } else {
      currentSpecs[specKey] = [...specValues, specValue];
    }
    setActiveFilters((prev) => ({ ...prev, specs: currentSpecs }));
  };

  const renderAppliedFilters = () => {
    return (
      (activeFilters.brands.length > 0 || Object.keys(activeFilters.specs).some(specKey => activeFilters.specs[specKey].length > 0)) && (
        <div className="applied-filters">
          {activeFilters.brands.map((brand) => (
            <h2 className="applied-filters__filter" key={brand}>
              <a onClick={() => handleBrandFilter(brand)}>
                <span className="applied-filters__label">{brand}</span>
              </a>
            </h2>
          ))}
          {Object.entries(activeFilters.specs).map(([specKey, specValues]) =>
            specValues.map((specValue) => (
              <h2 className="applied-filters__filter" key={`${specKey}-${specValue}`}>
                <a onClick={() => handleSpecFilter(specKey, specValue)}>
                  <span className="applied-filters__label">{`${specKey}: ${specValue}`}</span>
                </a>
              </h2>
            ))
          )}
        </div>
      )
    );
  };

  return (
    <div className="root__wrapper">
      <div className="root">
        <div className="page-products">
          <aside id="filters-aside" className="page-products__filters">
            <div id="filters" data-label={rootCategory.name}>
              <div className="filters__header">
                <h3 className="filters__header-title filters__header-title--filters">Φίλτρα</h3>
              </div>
              {availableVendors.length > 0 && (
                <div className="filter-vendor default-list">
                  <div className="filter__header"><h4>Vendors</h4></div>
                  <div className="filter-container">
                    <ol>
                      {availableVendors.map((vendor) => (
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
                  <div className="filter__header"><h4>Κατασκευαστής</h4></div>
                  <div className="filter-container">
                    <ol>
                      {Object.keys(availableBrands).map((brand) => (
                        <li key={brand} className={activeFilters.brands.includes(brand) ? 'selected' : ''} onClick={() => handleBrandFilter(brand)}>
                          <span>{brand} ({availableBrands[brand]})</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
              {Object.keys(availableSpecs).length > 0 && (
                Object.keys(availableSpecs).map((specKey) => (
                  <div key={specKey} className={`filter-${specKey.toLowerCase()} default-list`}>
                    <div className="filter__header"><h4>{specKey}</h4></div>
                    <div className="filter-container">
                      <ol>
                        {Array.from(availableSpecs[specKey]).map((specValue) => (
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
                    <input
                      type="checkbox"
                      checked={activeFilters.inStockOnly}
                      onChange={() => {
                        const newInStockOnly = !activeFilters.inStockOnly;
                        setActiveFilters((prev) => ({ ...prev, inStockOnly: newInStockOnly }));
                        filterProducts(activeFilters.vendors, activeFilters.brands, activeFilters.specs, newInStockOnly, products);
                      }} 
                    />
                    Show only in-stock products
                  </label>
                </div>
              </div>
              <button className="button button--outline" id="filters__scrollback">
                <svg className="icon" aria-hidden="true" width="12" height="12">
                  <use xlinkHref="/public/dist/images/icons/icons.svg#icon-up-12"></use>
                </svg>
                <div>Φίλτρα</div>
              </button>
            </div>
          </aside>
          <main>
            <header className="page-header">
              <div className="page-header__title-wrapper">
                <div className="page-header__title-main">
                  <h1>{rootCategory.name}</h1>
                  <div>{filteredProducts.length} products</div>
                </div>
              </div>
              {renderAppliedFilters()}
              <div className="page-header__sorting">
                <div className="tabs">
                  <div className="tabs-wrapper">
                    <nav>
                      <a data-type="rating-desc" rel="nofollow" className={sortType === 'rating-desc' ? 'current' : ''} onClick={() => setSortType('rating-desc')}>
                          <div className="tabs__content">Δημοφιλέστερα</div>
                      </a>
                      <a data-type="price-asc" rel="nofollow" className={sortType === 'price-asc' ? 'current' : ''} onClick={() => setSortType('price-asc')}>
                          <div className="tabs__content">Φθηνότερα</div>
                      </a>
                      <a data-type="price-desc" rel="nofollow" className={sortType === 'price-desc' ? 'current' : ''} onClick={() => setSortType('price-desc')}>
                          <div className="tabs__content">Ακριβότερα</div>
                      </a>
                      <a data-type="merchants_desc" rel="nofollow" className={sortType === 'merchants_desc' ? 'current' : ''} onClick={() => setSortType('merchants_desc')}>
                          <div className="tabs__content">Αριθμός καταστημάτων</div>
                      </a>
                    </nav>
                  </div>
                </div>
              </div>
            </header>
            {filteredProducts.length === 0 ? (<p>No products found matching your search.</p>) : (
              <div className="page-products__main-wrapper">
                <div className="p__products" data-pagination="">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
