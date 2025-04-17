import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProducts, categories, rootCategories, brands } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ScrollableSlider from '@/components/ScrollableSlider';

const SearchResults = () => {
    const [activeFilters, setActiveFilters] = useState({ vendors: [], brands: [], specs: {}, inStockOnly: false });
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [availableVendors, setAvailableVendors] = useState([]);
    const [availableBrands, setAvailableBrands] = useState({});
    const [availableSpecs, setAvailableSpecs] = useState({});
    const [availableCategories, setAvailableCategories] = useState([]);
    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const [sortType, setSortType] = useState('rating-desc');
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        const results = searchProducts(searchQuery);
        setProducts(results);
        setActiveFilters({ vendors: [], brands: [], specs: {}, inStockOnly: false });
        extractAvailableFilters(results);
        extractCategories(results);
        
        const sortedResults = sortProducts(results);
        setFilteredProducts(sortedResults);
    }, [searchQuery]);

    useEffect(() => {
        filterProducts(activeFilters.vendors, activeFilters.brands, activeFilters.specs, activeFilters.inStockOnly, products);
    }, [activeFilters, sortType, products]);

    const extractAvailableFilters = (results) => {
        const vendors = new Set();
        const brandsCount = {};
        const specs = {};

        results.forEach((product) => {
            if (product.vendor) {
                vendors.add(product.vendor); // Collect unique vendors
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

        setAvailableVendors(Array.from(vendors)); // Store vendors as an array
        setAvailableBrands(brandsCount);
        setAvailableSpecs(specs);
    };

    const extractCategories = (results) => {
        const categoryCount = {};
        results.forEach((product) => {
            if (product.category) {
                categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
            }
        });

        const categoriesArray = Object.entries(categoryCount).map(([category, count]) => {
            const categoryData = categories.find((cat) => cat.name === category);
            const rootCategoryData = categoryData
                ? rootCategories.find((rootCat) => rootCat.id === categoryData.rootCategoryId)
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
        extractCategories(filtered);
    };

    const sortProducts = (products) => {
        switch (sortType) {
            case 'price-asc':
                return [...products].sort((a, b) => {
                    const minPriceA = Math.min(...a.prices.filter((p) => p.inStock).map((p) => p.price), Infinity);
                    const minPriceB = Math.min(...b.prices.filter((p) => p.inStock).map((p) => p.price), Infinity);
                    return minPriceA - minPriceB;
                });
            case 'price-desc':
                return [...products].sort((a, b) => {
                    const maxPriceA = Math.max(...a.prices.filter((p) => p.inStock).map((p) => p.price), 0);
                    const maxPriceB = Math.max(...b.prices.filter((p) => p.inStock).map((p) => p.price), 0);
                    return maxPriceB - maxPriceA;
                });
            case 'rating-desc':
            default:
                return [...products].sort((a, b) => {
                    const averageRatingA = a.ratingSum / Math.max(a.numReviews, 1);
                    const averageRatingB = b.ratingSum / Math.max(b.numReviews, 1);
                    return averageRatingB - averageRatingA;
                });
            case 'merchants_desc':
                return [...products].sort((a, b) => {
                    const availableVendorsA = a.prices.filter((price) => price.inStock).length;
                    const availableVendorsB = b.prices.filter((price) => price.inStock).length;
                    return availableVendorsB - availableVendorsA;
                });
        }
    };

    const displayedBrand = activeFilters.brands.length === 1 ? brands.find((brand) => brand.name === activeFilters.brands[0]) : null;

    const renderAppliedFilters = () => {
      return (
        (activeFilters.brands.length > 0 || Object.keys(activeFilters.specs).some(specKey => activeFilters.specs[specKey].length > 0)) && (
            <div className="applied-filters">
                {activeFilters.brands.map((brand) => (
                    <h2 className="applied-filters__filter" key={brand}>
                        <a data-scrollto="" data-filter-key="brand" data-value-id={brand} className="pressable" onClick={() => handleBrandFilter(brand)}>
                            <span className="applied-filters__label">{brand}</span>
                            <svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12">
                                <use xlinkHref="/public/dist/images/icons/icons.svg#icon-x-12"></use>
                            </svg>
                        </a>
                    </h2>
                ))}

                {Object.entries(activeFilters.specs).map(([specKey, specValues]) =>
                    specValues.map((specValue) => (
                        <h2 className="applied-filters__filter" key={`${specKey}-${specValue}`}>
                            <a data-scrollto="" data-filter-key="spec" data-value-id={`${specKey}-${specValue}`} className="pressable" onClick={() => handleSpecFilter(specKey, specValue)}>
                                <span className="applied-filters__label">{`${specKey}: ${specValue}`}</span>
                                <svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12">
                                    <use xlinkHref="/public/dist/images/icons/icons.svg#icon-x-12"></use>
                                </svg>
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
                    <aside className="page-products__filters">
                        <div id="filters">
                            <div className="filters__categories" data-filter-name="categories">
                                <div className="filters__header">
                                    <div className="filters__header-title filters__header-title--filters">Κατηγορίες</div>
                                </div>
                                <ol>
                                    {availableCategories.slice(0, showMoreCategories ? availableCategories.length : 8).map((item) => (
                                        <li key={item.id}>
                                            <Link to={`/cat/${item.id}/${item.slug}`}>
                                                <span>{item.category} ({item.count})</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ol>
                                {availableCategories.length > 8 && (
                                    <div className="filters-more-prompt" onClick={() => setShowMoreCategories((prev) => !prev)} title="Show all categories">
                                        <svg aria-hidden="true" className="icon" width="100%" height="100%">
                                            <use xlinkHref="/public/dist/images/icons/icons.svg#icon-plus-more"></use>
                                        </svg>
                                        Show all
                                    </div>
                                )}
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
                                <div className="filter-brand default-list" data-filter-name data-type data-key>
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
                                    <div key={specKey} className={`filter-${specKey.toLowerCase()} default-list`} data-filter-name={specKey.toLowerCase()} data-type data-key={specKey.toLowerCase()}>
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
                            <button className="button button--outline" id="filters__scrollback"><svg className="icon" aria-hidden="true" width="12" height="12"><use xlinkHref="/public/dist/images/icons/icons.svg#icon-up-12"></use></svg><div>Φίλτρα</div></button>
                        </div>
                    </aside>

                    <main className="page-products__main">
                        <header className="page-header">
                            <div className="page-header__title-wrapper">
                                <div className="page-header__title-main">
                                    <h1>{searchQuery || 'All Products'}</h1>
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
                                            <a key={item.id} title={item.category} className="categories__category" href={`/cat/${item.id}/${item.slug}`}>
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

                        {filteredProducts.length === 0 ? (
                            <p>No products found matching your search.</p> 
                        ) : (
                            <div className="page-products__main-wrapper">
                                <div class="p__products" data-pagination="">
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

export default SearchResults;
