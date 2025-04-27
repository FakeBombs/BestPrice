import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProducts, categories, vendors, brands } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ScrollableSlider from '@/components/ScrollableSlider';

// Debounce function
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const MAX_DISPLAY_COUNT = 10;

const SearchResults = () => {
    const [activeFilters, setActiveFilters] = useState({ brands: [], specs: {}, inStockOnly: false, vendorIds: [] });
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [availableBrands, setAvailableBrands] = useState({});
    const [availableSpecs, setAvailableSpecs] = useState({});
    const [availableCategories, setAvailableCategories] = useState([]);
    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const [showMoreVendors, setShowMoreVendors] = useState(false);
    const [certifiedVendors, setCertifiedVendors] = useState([]);
    const [sortType, setSortType] = useState('rating-desc');
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    const debouncedSearchQuery = useDebounce(searchQuery, 300); // Using debounce

    useEffect(() => {
        const results = searchProducts(debouncedSearchQuery);
        setProducts(results);
        setActiveFilters({ brands: [], specs: {}, inStockOnly: false, vendorIds: [] });
        extractAvailableFilters(results);
        extractCategories(results);
        updateCertifiedVendors(results);
        const sortedResults = sortProducts(results);
        setFilteredProducts(sortedResults);
    }, [debouncedSearchQuery]);

    useEffect(() => {
        filterProducts(activeFilters.brands, activeFilters.specs, activeFilters.inStockOnly, products, activeFilters.vendorIds);
    }, [activeFilters, products]);

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
        const validCategoryIds = new Set();
        results.forEach((product) => {
            (product.categoryIds || []).forEach(categoryId => {
                categoryCount[categoryId] = (categoryCount[categoryId] || 0) + 1;
                validCategoryIds.add(categoryId); 
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
        }).filter(cat => cat.id && validCategoryIds.has(cat.id));

        setAvailableCategories(categoriesArray);
    };

    const updateCertifiedVendors = (results) => {
        const vendorMap = new Map();
        results.forEach(product => {
            product.prices.forEach(price => {
                const vendor = vendors.find(v => v.id === price.vendorId);
                if (vendor && vendor.certification) {
                    vendorMap.set(vendor.id, vendor);
                }
            });
        });
        const vendorArray = Array.from(vendorMap.values()).sort((a, b) => {
            const levels = { Gold: 3, Silver: 2, Bronze: 1 };
            return levels[b.certification] - levels[a.certification];
        });
        setCertifiedVendors(vendorArray);
    };

    const filterProducts = (brands, specs, inStockOnly, results, vendorIds) => {
        let filtered = results;

        if (inStockOnly) {
            filtered = filtered.filter((product) => product.prices.some((price) => price.inStock));
        }

        if (brands.length > 0) {
            filtered = filtered.filter((product) => brands.includes(product.brand));
        }

        if (vendorIds.length > 0) {
            filtered = filtered.filter(product =>
                (product.prices || []).some(price => {
                    const vendor = vendors.find(v => v.id === price.vendorId);
                    return vendor && vendorIds.includes(vendor.id);
                })
            );
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
        const newVendorIds = activeFilters.vendorIds.includes(vendor.id)
            ? activeFilters.vendorIds.filter(id => id !== vendor.id)
            : [...activeFilters.vendorIds, vendor.id];

        setActiveFilters((prev) => ({ ...prev, vendorIds: newVendorIds }));
    };

    const handleResetFilters = () => {
        setActiveFilters({ brands: [], specs: {}, inStockOnly: false, vendorIds: [] });
    };

    const displayedBrand = activeFilters.brands.length === 1 ? brands.find((brand) => brand.name === activeFilters.brands[0]) : null;

    const renderAppliedFilters = () => {
        return (
            (activeFilters.brands.length > 0 || Object.keys(activeFilters.specs).some(specKey => activeFilters.specs[specKey].length > 0) || activeFilters.vendorIds.length > 0) && (
                <div className="applied-filters">
                    {activeFilters.brands.map((brand) => (
                        <h2 className="applied-filters__filter" key={brand}>
                            <a data-scrollto="" data-filter-key="brand" data-value-id={brand} className="pressable" onClick={() => handleBrandFilter(brand)}>
                                <span className="applied-filters__label">{brand}</span>
                                <svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12" viewBox="0 0 12 12" role="img" aria-label={`Remove filter of ${brand}`} onClick={() => handleBrandFilter(brand)}>
                                    <path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" d="M6.87335 6.00839L11.8052 1.098C12.0416 0.863692 12.0416 0.484357 11.8052 0.250643C11.5693 0.01633 11.1862 0.01633 10.9504 0.250643L6.02275 5.15683L1.04963 0.177533C0.813788 -0.0591775 0.430688 -0.0591775 0.194842 0.177533C-0.0410036 0.414842 -0.0410036 0.798971 0.194842 1.03568L5.16436 6.01139L0.176884 10.9769C-0.0589614 11.2112 -0.0589614 11.5906 0.176884 11.8243C0.41273 12.0586 0.79583 12.0586 1.03168 11.8243L6.01497 6.86294L10.9683 11.8225C11.2042 12.0592 11.5873 12.0592 11.8231 11.8225C12.059 11.5852 12.059 11.201 11.8231 10.9643L6.87335 6.00839Z"/>
                                </svg>
                            </a>
                        </h2>
                    ))}
                    {Object.entries(activeFilters.specs).map(([specKey, specValues]) =>
                      specValues.map((specValue) => (
                        <h2 className="applied-filters__filter" key={`${specKey}-${specValue}`}>
                            <a data-scrollto="" data-filter-key="spec" data-value-id={`${specKey}-${specValue}`} className="pressable" onClick={() => handleSpecFilter(specKey, specValue)}>
                                <span className="applied-filters__label">{`${specKey}: ${specValue}`}</span>
                                <svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12" viewBox="0 0 12 12" role="img" aria-label={`Remove ${specKey}-${specValue} filter`}>
                                    <path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" d="M6.87335 6.00839L11.8052 1.098C12.0416 0.863692 12.0416 0.484357 11.8052 0.250643C11.5693 0.01633 11.1862 0.01633 10.9504 0.250643L6.02275 5.15683L1.04963 0.177533C0.813788 -0.0591775 0.430688 -0.0591775 0.194842 0.177533C-0.0410036 0.414842 -0.0410036 0.798971 0.194842 1.03568L5.16436 6.01139L0.176884 10.9769C-0.0589614 11.2112 -0.0589614 11.5906 0.176884 11.8243C0.41273 12.0586 0.79583 12.0586 1.03168 11.8243L6.01497 6.86294L10.9683 11.8225C11.2042 12.0592 11.5873 12.0592 11.8231 11.8225C12.059 11.5852 12.059 11.201 11.8231 10.9643L6.87335 6.00839Z"/>
                                </svg>
                            </a>
                        </h2>
                      ))
                    )}
                    {activeFilters.vendorIds.map((vendorId) => {
                      const vendor = certifiedVendors.find(v => v.id === vendorId);
                      return vendor ? (
                          <h2 className="applied-filters__filter" key={vendor.id}>
                              <a data-scrollto="" data-filter-key={vendor.name} data-value-id={vendor.name} className="pressable" onClick={() => handleVendorFilter(vendor)}>
                                  <span className="applied-filters__label">{vendor.name}</span>
                                  <svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12" viewBox="0 0 12 12" role="img" aria-label={`Remove filter of ${vendor.name}`}>
                                      <path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" d="M6.87335 6.00839L11.8052 1.098C12.0416 0.863692 12.0416 0.484357 11.8052 0.250643C11.5693 0.01633 11.1862 0.01633 10.9504 0.250643L6.02275 5.15683L1.04963 0.177533C0.813788 -0.0591775 0.430688 -0.0591775 0.194842 0.177533C-0.0410036 0.414842 -0.0410036 0.798971 0.194842 1.03568L5.16436 6.01139L0.176884 10.9769C-0.0589614 11.2112 -0.0589614 11.5906 0.176884 11.8243C0.41273 12.0586 0.79583 12.0586 1.03168 11.8243L6.01497 6.86294L10.9683 11.8225C11.2042 12.0592 11.5873 12.0592 11.8231 11.8225C12.059 11.5852 12.059 11.201 11.8231 10.9643L6.87335 6.00839Z"/>
                                  </svg>
                              </a>
                          </h2>
                      ) : null;
                    })}
                    <button onClick={handleResetFilters}>
                        <svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12" role="img" aria-label="Reset all filters">
                            <use xlinkHref="/public/dist/images/icons/icons.svg#icon-refresh"></use>
                        </svg>
                        Reset Filters
                    </button>
                </div>
            )
        );
    };

    return (
        <div className="root__wrapper">
            <div className="root">
                <div id="trail">
                    <nav className="breadcrumb">
                        <ol>
                            <li>
                                <Link to="/" rel="home" data-no-info="">
                                    <span>BestPrice</span>
                                </Link>
                                <span className="trail__breadcrumb-separator">›</span>
                            </li>
                            <li>
                                <span data-no-info="" className="trail__last">{searchQuery || 'All Products'}</span>
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="page-products">
                    <aside className="page-products__filters">
                        <div id="filters" role="complementary" aria-labelledby="filters-header">
                            <div className="filters__categories" data-filter-name="categories">
                                <div className="filters__header">
                                    <div className="filters__header-title filters__header-title--filters">Κατηγορίες</div>
                                </div>
                                <ol aria-expanded={showMoreCategories}>
                                    {/* Group parent categories */}
                                    {Array.from(new Set(availableCategories.map(item => item.parentId))).map(parentId => {
                                        // Fetch all subcategories by parentId, not just those with products
                                        const subcategories = availableCategories.filter(item => item.parentId === parentId);
                                        const parentCategory = categories.find(cat => cat.id === parentId); // Get the main category
                                        return (
                                            <div key={parentId}>
                                                {/* Map over all subcategories */}
                                                {subcategories.slice(0, showMoreCategories ? subcategories.length : MAX_DISPLAY_COUNT).map(item => (
                                                    parentCategory ? (
                                                        // Create URL with both main category and subcategory slug
                                                        <li key={item.id}>
                                                            <Link to={`/cat/${parentCategory.slug}/${item.slug}`} className="filters__link">
                                                                <span>{item.category} ({item.count})</span>
                                                            </Link>
                                                        </li>
                                                    ) : null // Prevent accessing if parentCategory is undefined
                                                ))}
                                            </div>
                                        );
                                    })}
                                </ol>
                                {availableCategories.length > MAX_DISPLAY_COUNT && (
                                    <div className="filters-more-prompt" onClick={() => setShowMoreCategories(prev => !prev)} title={showMoreCategories ? "Εμφάνιση λιγότερων κατηγοριών" : "Εμφάνιση όλων των κατηγοριών"}>
                                        <svg aria-hidden="true" className="icon" width="100%" height="100%" viewBox="0 0 10 10" role="img">
                                            <path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" d="M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"/>
                                        </svg>
                                        {showMoreCategories ? "Εμφάνιση λιγότερων" : "Εμφάνιση όλων"}
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

                            <div className="filter-store filter-collapsed default-list" data-filter-name="Πιστοποιημένα καταστήματα" data-filter-id="store" data-type="store" data-key="store">
                                <div className="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div>
                                <div className="filter-container">
                                    <ol>
                                        {certifiedVendors.slice(0, showMoreVendors ? certifiedVendors.length : MAX_DISPLAY_COUNT).map(vendor => (
                                            <li key={vendor.id} title={`Το κατάστημα ${vendor.name} διαθέτει ${vendor.certification} πιστοποίηση`} 
                                                className={activeFilters.vendorIds.includes(vendor.id) ? 'selected' : ''}
                                                onClick={() => handleVendorFilter(vendor)}>
                                                <a href="#" data-l={vendor.certification === 'Gold' ? '3' : vendor.certification === 'Silver' ? '2' : '1'}>
                                                    <span>{vendor.name}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ol>
                                    {certifiedVendors.length > MAX_DISPLAY_COUNT && (
                                        <div id="filter-store-prompt" className="filters-more-prompt" title="Εμφάνιση όλων των πιστοποιημένων καταστημάτων" 
                                            onClick={() => setShowMoreVendors(prev => !prev)}>
                                            <svg aria-hidden="true" className="icon" width="100%" height="100%" viewBox="0 0 10 10" role="img">
                                                <path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" d="M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"/>
                                            </svg>
                                            {showMoreVendors ? "Εμφάνιση λιγότερων" : "Εμφάνιση όλων"}
                                        </div>
                                    )}
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
                                                filterProducts(
                                                    activeFilters.brands, 
                                                    activeFilters.specs, 
                                                    newInStockOnly, 
                                                    products,
                                                    activeFilters.vendorIds
                                                ); 
                                            }} 
                                        />Άμεσα διαθέσιμα
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
                                <div className="page-header__title-aside">
                                    {displayedBrand && (
                                        <Link to={`/b/${displayedBrand.id}/${displayedBrand.name.toLowerCase()}.html`} title={displayedBrand.name} className="page-header__brand">
                                            <img itemProp="logo" title={`${displayedBrand.name} logo`} alt={`${displayedBrand.name} logo`} height="70" loading="lazy" src={displayedBrand.logo} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                            {renderAppliedFilters()}
                            <section className="section">
                                <header className="section__header">
                                    <hgroup className="section__hgroup">
                                        <h2 className="section__title">Κατηγορίες</h2>
                                    </hgroup>
                                </header>
                                <ScrollableSlider>
    <div className="categories categories--scrollable scroll__content">
        {Array.from(new Set(availableCategories.map(item => item.parentId))).map(parentId => {
            const subcategories = availableCategories.filter(item => item.parentId === parentId);
            const mainCategory = categories.find(cat => cat.id === parentId); // Get the main category slug for top-level categories

            return (
                <div key={parentId}>
                    {subcategories.map(item => {
                        // Get the full slug based on the main category and subcategories
                        const mainCatSlug = mainCategory ? mainCategory.slug : ''; // Ensure we have the main category slug
                        const subCatSlugs = [];

                        let currentCategory = item;
                        // Build the hierarchy of subcategory slugs
                        while (currentCategory.parentId !== null) {
                            const parent = categories.find(cat => cat.id === currentCategory.parentId);
                            if (parent) {
                                subCatSlugs.push(parent.slug); // Collect subcategory slug
                                currentCategory = parent;
                            } else {
                                break;
                            }
                        }

                        subCatSlugs.reverse(); // Reverse to maintain order from top-level to current
                        subCatSlugs.push(item.slug); // Add current item's slug
                        
                        // Combine to create the final slug array
                        const finalSlug = [mainCatSlug, ...subCatSlugs];

                        return (
                            <Link 
                                key={item.id} 
                                to={`/cat/${finalSlug.join('/')}`} // Build the URL correctly
                                className="categories__category"
                            >
                                <img width="200" height="200" className="categories__image" src={item.image} alt={`Category: ${item.category}`} />
                                <h2 className="categories__title">{item.category}</h2>
                                <div className="categories__cnt">{item.count} προϊόντα</div>
                            </Link>
                        );
                    })}
                </div>
            );
        })}
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
                                <div className="p__products" role="list">
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
