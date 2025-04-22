import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProducts, categories, vendors } from '@/data/mockData'; // Ensure `vendors` is imported
import ProductCard from '@/components/ProductCard';
import ScrollableSlider from '@/components/ScrollableSlider';

const SearchResults = () => {
    const [activeFilters, setActiveFilters] = useState({ brands: [], specs: {}, inStockOnly: false, certification: [] });
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [availableBrands, setAvailableBrands] = useState({});
    const [availableSpecs, setAvailableSpecs] = useState({});
    const [availableCategories, setAvailableCategories] = useState([]);
    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const [certifiedVendors, setCertifiedVendors] = useState([]); // State to hold certified vendors
    const [sortType, setSortType] = useState('rating-desc');
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        const results = searchProducts(searchQuery);
        setProducts(results);
        setActiveFilters({ brands: [], specs: {}, inStockOnly: false, certification: [] });
        extractAvailableFilters(results);
        extractCategories(results);
        const sortedResults = sortProducts(results);
        setFilteredProducts(sortedResults);
        updateCertifiedVendors(results); // Updated to pass all results here
    }, [searchQuery]);

    useEffect(() => {
        filterProducts(activeFilters.brands, activeFilters.specs, activeFilters.inStockOnly, products);
    }, [activeFilters, sortType, products]);

    const extractAvailableFilters = (results) => {
        const brandsCount = {};
        const specs = {};
        results.forEach((product) => {
            if (product.brand) {
                brandsCount[product.brand] = (brandsCount[product.brand] || 0) + 1;
            }
            Object.keys(product.specifications || {}).forEach((specKey) => {
                if (!specs[specKey]) {
                    specs[specKey] = new Set();
                }
                specs[specKey].add(product.specifications[specKey]);
            });
        });
        setAvailableBrands(brandsCount);
        setAvailableSpecs(specs);
    };

    const extractCategories = (results) => {
        const categoryCount = {};
        results.forEach((product) => {
            (product.categoryIds || []).forEach(categoryId => {
                categoryCount[categoryId] = (categoryCount[categoryId] || 0) + 1;
            });
        });

        const categoriesArray = Object.entries(categoryCount).map(([id, count]) => {
            const categoryData = categories.find(cat => cat.id === parseInt(id));
            return {
                id: categoryData ? categoryData.id : '',
                category: categoryData ? categoryData.name : '',
                slug: categoryData ? categoryData.slug : '',
                count,
                image: categoryData ? categoryData.image : '',
                parentId: categoryData ? categoryData.parentId : null,
            };
        }).filter(cat => cat.id && cat.parentId);

        setAvailableCategories(categoriesArray);
    };

    const updateCertifiedVendors = (results) => {
    const vendorMap = new Map();
    results.forEach(product => {
        console.log("Checking product:", product); // Log products
        (product.vendors || []).forEach(vendorId => {
            const vendor = vendors.find(v => v.id === vendorId);
            if (vendor && vendor.certification) {
                console.log("Found vendor:", vendor); // Log found vendors
                vendorMap.set(vendor.id, vendor);
            }
        });
    });
    const vendorArray = Array.from(vendorMap.values()).sort((a, b) => {
        const levels = { Gold: 3, Silver: 2, Bronze: 1 };
        return levels[b.certification] - levels[a.certification];
    });
    setCertifiedVendors(vendorArray);
    console.log("Certified vendors:", vendorArray); // Log certified vendors found
};

        // Convert the Map to an array and sort by certification type
        const vendorArray = Array.from(vendorMap.values()).sort((a, b) => {
            const levels = { Gold: 3, Silver: 2, Bronze: 1 };
            return levels[b.certification] - levels[a.certification]; // Sort by certification level
        });

        setCertifiedVendors(vendorArray);
    };

    const filterProducts = (brands, specs, inStockOnly, results) => {
        let filtered = results;
        if (inStockOnly) {
            filtered = filtered.filter((product) => product.prices.some((price) => price.inStock));
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
        updateCertifiedVendors(filtered);
    };

    const sortProducts = (products) => {
        switch (sortType) {
            case 'price-asc':
                return [...products].sort((a, b) => {
                    const minPriceA = Math.min(...(a.prices || []).filter((p) => p.inStock).map((p) => p.price), Infinity);
                    const minPriceB = Math.min(...(b.prices || []).filter((p) => p.inStock).map((p) => p.price), Infinity);
                    return minPriceA - minPriceB;
                });
            case 'price-desc':
                return [...products].sort((a, b) => {
                    const maxPriceA = Math.max(...(a.prices || []).filter((p) => p.inStock).map((p) => p.price), 0);
                    const maxPriceB = Math.max(...(b.prices || []).filter((p) => p.inStock).map((p) => p.price), 0);
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
                    const availableVendorsA = (a.prices || []).filter((price) => price.inStock).length;
                    const availableVendorsB = (b.prices || []).filter((price) => price.inStock).length;
                    return availableVendorsB - availableVendorsA;
                });
        }
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

    const handleVendorFilter = (vendor) => {
        const newCertification = activeFilters.certification.includes(vendor.certification)
            ? activeFilters.certification.filter((l) => l !== vendor.certification)
            : [vendor.certification];

        setActiveFilters((prev) => ({ ...prev, certification: newCertification }));
        filterProducts(activeFilters.brands, activeFilters.specs, activeFilters.inStockOnly, products.filter(product =>
            (product.vendors || []).includes(vendor.id) 
        ));
    };

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
                                <ol aria-expanded={showMoreCategories}>
                                    {availableCategories.slice(0, showMoreCategories ? availableCategories.length : 8).map((item) => (
                                        <li key={item.id}>
                                            <Link to={`/cat/${item.id}/${item.slug}`} className="filters__link">
                                                <span>{item.category} ({item.count})</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ol>
                                {availableCategories.length > 8 && (
                                    <div className="filters-more-prompt" onClick={() => setShowMoreCategories((prev) => !prev)} title={showMoreCategories ? "Show less categories" : "Show all categories"}>
                                        <svg aria-hidden="true" className="icon" width="100%" height="100%">
                                            <use xlinkHref="/public/dist/images/icons/icons.svg#icon-plus-more"></use>
                                        </svg>
                                        {showMoreCategories ? "Show less" : "Show all"}
                                    </div>
                                )}
                            </div>

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

                            {/* Show list of certified vendors */}
                            <div className="filter-store filter-collapsed default-list" data-filter-name="Πιστοποιημένα καταστήματα" data-filter-id="store" data-type="store" data-key="store">
                                <div className="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div>
                                <div className="filter-container">
                                    <ol>
                                        {certifiedVendors.length > 0 ? certifiedVendors.map(vendor => (
                                            <li key={vendor.id} onClick={() => handleVendorFilter(vendor)} style={{ cursor: 'pointer' }}>
                                                <span>{vendor.name} ({vendor.certification})</span>
                                            </li>
                                        )) : <li>No certified vendors found.</li>}
                                    </ol>
                                </div>
                            </div>

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
                                                filterProducts(activeFilters.brands, activeFilters.specs, newInStockOnly, products);
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

                    <main className="page-products__main">
                        <header className="page-header">
                            <div className="page-header__title-wrapper">
                                <div className="page-header__title-main">
                                    <h1>{searchQuery || 'All Products'}</h1>
                                    <div className="page-header__count-wrapper">
                                        <div className="page-header__count">{filteredProducts.length} προϊόντα</div>
                                    </div>
                                </div>
                            </div>
                            {renderAppliedFilters()}
                            <section className="section">
                                <header className="section__header"><hgroup className="section__hgroup"><h2 className="section__title">Κατηγορίες</h2></hgroup></header>
                                <ScrollableSlider>
                                    <div className="categories categories--scrollable scroll__content">
                                        {availableCategories.map((item) => (
                                            <Link key={item.id} to={`/cat/${item.id}/${item.slug}`} className="categories__category">
                                                <img width="200" height="200" className="categories__image" src={item.image} alt={item.category} />
                                                <h2 className="categories__title">{item.category}</h2>
                                                <div className="categories__cnt">{item.count} προϊόντα</div>
                                            </Link>
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

export default SearchResults;
