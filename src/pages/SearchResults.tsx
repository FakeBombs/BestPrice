import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts, categories, rootCategories, brands } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ScrollableSlider from '@/components/ScrollableSlider';

const SearchResults = () => {
  const [activeFilters, setActiveFilters] = useState({ vendors: [], brands: [], specs: {}, inStockOnly: false });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [availableVendors, setAvailableVendors] = useState(new Set());
  const [availableBrands, setAvailableBrands] = useState({});
  const [availableSpecs, setAvailableSpecs] = useState({});
  const [availableCategories, setAvailableCategories] = useState([]);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [sortType, setSortType] = useState('0');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    if (searchQuery) {
      const results = searchProducts(searchQuery);
      setProducts(results);
      setActiveFilters({ vendors: [], brands: [], specs: {}, inStockOnly: false });
      setFilteredProducts(results);
      extractAvailableFilters(results);
      extractCategories(results);
    } else {
      setFilteredProducts([]);
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

    const categoriesArray = Object.entries(categoryCount).map(([category, count]) => {
      const categoryData = categories.find(cat => cat.name === category);
      const rootCategoryData = categoryData 
        ? rootCategories.find(rootCat => rootCat.id === categoryData.rootCategoryId) 
        : undefined;

      return {
        category,
        count,
        isRoot: !!rootCategoryData,
        slug: rootCategoryData ? rootCategoryData.slug : categoryData ? categoryData.slug : '',
        id: categoryData ? categoryData.id : rootCategoryData ? rootCategoryData.id : '',
        image: categoryData ? categoryData.image : rootCategoryData ? rootCategoryData.image : '',
      };
    }).slice(0, 8);

    setAvailableCategories(categoriesArray);
  };

  const handleVendorFilter = (vendor) => {
    const newVendors = activeFilters.vendors.includes(vendor)
      ? activeFilters.vendors.filter(v => v !== vendor)
      : [...activeFilters.vendors, vendor];

    setActiveFilters(prev => ({ ...prev, vendors: newVendors }));
    filterProducts(newVendors, activeFilters.brands, activeFilters.specs, activeFilters.inStockOnly, products);
  };

  const handleBrandFilter = (brand) => {
    const newBrands = activeFilters.brands.includes(brand)
      ? activeFilters.brands.filter(b => b !== brand)
      : [...activeFilters.brands, brand];

    setActiveFilters(prev => ({ ...prev, brands: newBrands }));
    filterProducts(activeFilters.vendors, newBrands, activeFilters.specs, activeFilters.inStockOnly, products);
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
    filterProducts(activeFilters.vendors, activeFilters.brands, currentSpecs, activeFilters.inStockOnly, products);
  };

  const filterProducts = (vendors, brands, specs, inStockOnly, results) => {
    let filtered = results;

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

    // Apply sorting based on sortType
    filtered = sortProducts(filtered);

    setFilteredProducts(filtered);
    extractAvailableFilters(filtered);
    extractCategories(filtered);
  };

  const sortProducts = (products) => {
    switch (sortType) {
      case 'price-asc':
        return products.sort((a, b) => {
          const aPrice = a.prices.length ? Math.min(...a.prices.map(p => p.price)) : 0;
          const bPrice = b.prices.length ? Math.min(...b.prices.map(p => p.price)) : 0;
          return aPrice - bPrice;
        });
      case 'price-desc':
        return products.sort((a, b) => {
          const aPrice = a.prices.length ? Math.min(...a.prices.map(p => p.price)) : 0;
          const bPrice = b.prices.length ? Math.min(...b.prices.map(p => p.price)) : 0;
          return bPrice - aPrice;
        });
      case 'rating-desc':
        return products.sort((a, b) => b.rating - a.rating);
      case 'reviews-desc':
        return products.sort((a, b) => b.reviews - a.reviews);
      case '0': // Most Popular
        return products.sort((a, b) => b.popularity - a.popularity);
      case '2': // Cheapest First
        return products.sort((a, b) => {
          const aPrice = a.prices.length ? Math.min(...a.prices.map(p => p.price)) : 0;
          const bPrice = b.prices.length ? Math.min(...b.prices.map(p => p.price)) : 0;
          return aPrice - bPrice;
        });
      case 'release_dt': // Newest First
        return products.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
      case 'discount': // Largest Price Drop
        return products.sort((a, b) => b.priceDrop - a.priceDrop);
      case 'merchants_desc': // Highest Number of Available Vendors
        return products.sort((a, b) => b.availableVendors - a.availableVendors);
      default:
        return products;
    }
  };

  // Determine the selected brand for display in the header
  const displayedBrand = activeFilters.brands.length === 1 ? brands.find(brand => brand.name === activeFilters.brands[0]) : null;

  // Render applied filters for brands and specifications
  const renderAppliedFilters = () => {
    return (
      <div className="applied-filters">
        {activeFilters.brands.map((brand) => (
          <h2 className="applied-filters__filter" key={brand}>
            <a data-scrollto="" data-filter-key="brand" data-value-id={brand} className="pressable" onClick={() => handleBrandFilter(brand)} >
              <span className="applied-filters__label">{brand}</span>
              <svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12">
                <use xlinkHref="/public/dist/images/icons/icons.svg#icon-x-12"></use>
              </svg>
            </a>
          </h2>
        ))}

        {Object.entries(activeFilters.specs).map(([specKey, specValues]) =>
          specValues.map(specValue => (
            <h2 className="applied-filters__filter" key={`${specKey}-${specValue}`}>
              <a data-scrollto="" data-filter-key="spec" data-value-id={`${specKey}-${specValue}`} className="pressable" onClick={() => handleSpecFilter(specKey, specValue)} >
                <span className="applied-filters__label">{`${specKey}: ${specValue}`}</span>
                <svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12">
                  <use xlinkHref="/public/dist/images/icons/icons.svg#icon-x-12"></use>
                </svg>
              </a>
            </h2>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="root__wrapper">
      <div className="root">
        <div className="page-products">
          <aside className="page-products__filters">
            <div id="filters">
              <div className="filters__categories" data-filter-name="categories">
                <div className="filters__header">
                  <div className="filters__header-title filters__header-title--filters">Κατηγορίες</div>
                </div>
                <ol>
                  {availableCategories.slice(0, showMoreCategories ? availableCategories.length : 8).map(item => (
                    <li key={item.category}>
                      <a href={`/cat/${item.id}/${item.slug}`}><span>{item.category} ({item.count})</span></a>
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
                  <div className="filter__header"><h4>Κατασκευαστής</h4></div>
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
                      const newInStockOnly = !activeFilters.inStockOnly;
                      setActiveFilters(prev => ({ ...prev, inStockOnly: newInStockOnly }));
                      filterProducts(activeFilters.vendors, activeFilters.brands, activeFilters.specs, newInStockOnly, products);
                    }} />
                    Show only in-stock products
                  </label>
                </div>
              </div>
            </div>
          </aside>

          <main className="page-products__main">
            <header className="page-header">
              <div className="page-header__title-wrapper">
                <div className="page-header__title-main">
                  <h1>{searchQuery}</h1>
                  <div className="page-header__count-wrapper">
                    <div className="page-header__count">{filteredProducts.length} προϊόντα</div>
                    <div data-url="/cat/6280/smartwatches/f/1_9/apple.html" data-title="{searchQuery}" data-max-price="0" className="alerts-minimal">
                      <svg aria-hidden="true" className="icon" width="20" height="20"><use xlinkHref="/public/dist/images/icons/icons.svg#icon-notification-outline-20"></use></svg>
                      <div className="alerts-minimal__label"></div>
                    </div>
                  </div>
                </div>
                <div className="page-header__title-aside">
                  {displayedBrand && (
                    <a href={`/b/${displayedBrand.id}/${displayedBrand.name.toLowerCase()}.html`} title={displayedBrand.name} className="page-header__brand">
                      <img itemProp="logo" title={`${displayedBrand.name} logo`} alt={`${displayedBrand.name} logo`} height="70" loading="lazy" src={displayedBrand.logo} />
                    </a>
                  )}
                </div>
              </div>
              {renderAppliedFilters()}
              <section className="section">
                <header className="section__header"><hgroup className="section__hgroup"><h2 className="section__title">Κατηγορίες</h2></hgroup></header>
                <ScrollableSlider>
                  <div className="categories categories--scrollable scroll__content">
                    {availableCategories.map((item) => (
                      <a key={item.category} title={item.category} className="categories__category" href={item.isRoot ? `/categories/root/${item.slug}` : `/cat/${item.id}/${item.slug}`}>
                        <img width="200" height="200" className="categories__image" src={item.image} alt={item.category} />
                        <h2 className="categories__title">{item.category}</h2>
                        <div className="categories__cnt">{item.count} προϊόντα</div>
                      </a>
                    ))}
                  </div>
                </ScrollableSlider>
              </section>
              <div className="page-header__sorting">
                <div className="tabs">
                  <div className="tabs-wrapper">
                    <nav>
                      <a data-type="0" rel="nofollow" className={sortType === '0' ? 'current' : ''} onClick={() => setSortType('0')} ><div className="tabs__content">Δημοφιλέστερα</div></a>
                      <a data-type="price-asc" rel="nofollow" className={sortType === 'price-asc' ? 'current' : ''} onClick={() => setSortType('price-asc')} ><div className="tabs__content">Φθηνότερα</div></a>
                      <a data-type="release_dt" rel="nofollow" className={sortType === 'release_dt' ? 'current' : ''} onClick={() => setSortType('release_dt')} ><div className="tabs__content">Νεότερα</div></a>
                      <a data-type="discount" rel="nofollow" className={sortType === 'discount' ? 'current' : ''} onClick={() => setSortType('discount')} >
                        <div className="tabs__content"><svg aria-hidden="true" className="icon" width="16" height="16"><use xlinkHref="/public/dist/images/icons/icons.svg#icon-flame-16"></use></svg> Μεγαλύτερη πτώση</div>
                      </a>
                      <a data-type="merchants_desc" rel="nofollow" className={sortType === 'merchants_desc' ? 'current' : ''} onClick={() => setSortType('merchants_desc')} ><div className="tabs__content">Αριθμός καταστημάτων</div></a>
                    </nav>
                  </div>
                </div>
              </div>
            </header>
            
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
