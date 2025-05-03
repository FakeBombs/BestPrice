import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import NotFound from '@/pages/NotFound';
// Import the full product list, vendors, brands etc.
import { categories, mainCategories, products as allMockProducts, Category, Product, vendors, brands } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import PriceAlertModal from '@/components/PriceAlertModal';
import ScrollableSlider from '@/components/ScrollableSlider';

const MAX_DISPLAY_COUNT = 10; // For filters

const CategoryPage: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const { toast } = useToast();
  const { user } = useAuth();

  // State for the current category context
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);

  // State for products related to the current category
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]); // Raw products for the category
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Products after applying filters & sort

  // State for filtering UI and logic
  const [activeFilters, setActiveFilters] = useState<{
    brands: string[];
    specs: Record<string, string[]>; // Changed from {} to be more specific
    inStockOnly: boolean;
    vendorIds: number[]; // Changed from []
  }>({ brands: [], specs: {}, inStockOnly: false, vendorIds: [] });
  const [availableBrands, setAvailableBrands] = useState<Record<string, number>>({}); // Changed type
  const [availableSpecs, setAvailableSpecs] = useState<Record<string, Set<string>>>({}); // Changed type
  // const [availableCategories, setAvailableCategories] = useState([]); // Removed - not needed here
  // const [showMoreCategories, setShowMoreCategories] = useState(false); // Removed
  const [showMoreVendors, setShowMoreVendors] = useState(false);
  const [certifiedVendors, setCertifiedVendors] = useState<typeof vendors>([]); // Use Vendor type if available

  // State for sorting
  const [sortType, setSortType] = useState('rating-desc');

  // State for modal
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState(false);

  // --- Helper Data ---
  const allCategories = [...mainCategories, ...categories];

  // --- Category Logic ---
  const findCategory = (identifier: string): Category | undefined => {
    return allCategories.find(
      (cat) => cat.id.toString() === identifier || cat.slug === identifier
    );
  };

  const defaultCategoryId = mainCategories.length > 0 ? mainCategories[0].id : null;

  // Effect 1: Determine current category and load its initial products
  useEffect(() => {
    // Reset states on path change before processing
    setCurrentCategory(undefined);
    setCategoryProducts([]);
    setFilteredProducts([]);
    setActiveFilters({ brands: [], specs: {}, inStockOnly: false, vendorIds: [] }); // Reset filters
    setAvailableBrands({});
    setAvailableSpecs({});
    setCertifiedVendors([]);


    if (pathSegments.length < 2 || pathSegments[0] !== 'cat') {
      // Not a category path, load default main category (no products/filters needed)
      if (defaultCategoryId !== null) {
        const defaultCat = mainCategories.find(cat => cat.id === defaultCategoryId);
        setCurrentCategory(defaultCat);
      }
      return; // Exit early
    }

    // It IS a category path /cat/...
    const segments = pathSegments.slice(1);
    const lastSegment = segments[segments.length - 1];
    let matchedCategory = findCategory(lastSegment);

    if (matchedCategory) {
      setCurrentCategory(matchedCategory); // Set the identified category

      // If it's a subcategory (potential product page)
      if (matchedCategory.parentId !== null || !matchedCategory.isMain) {
          // Find products belonging to this category from the master list
          const productsForCategory = allMockProducts.filter(p =>
            p.categoryIds?.includes(matchedCategory.id)
          );
          setCategoryProducts(productsForCategory); // Store the raw list
          setFilteredProducts(productsForCategory); // Initialize filtered list

          // Extract available filters based on these initial products
          extractAvailableFilters(productsForCategory);
          // extractCategories(productsForCategory); // No need for category filter here
          updateCertifiedVendors(productsForCategory);
      }
      // If it's a main category, products/filters remain empty (handled by initial reset)

    } else {
      // No match, load default main category (if available)
      if (defaultCategoryId !== null) {
        const defaultCat = mainCategories.find(cat => cat.id === defaultCategoryId);
        setCurrentCategory(defaultCat);
      }
      // No products/filters needed for default main category
    }
  }, [location.pathname, defaultCategoryId]); // Rerun when URL changes

  // --- Filter Extraction Logic ---
  const extractAvailableFilters = (sourceProducts: Product[]) => {
        const brandsCount: Record<string, number> = {};
        const specs: Record<string, Set<string>> = {};
        sourceProducts.forEach((product) => {
            if (product.brand) {
                brandsCount[product.brand] = (brandsCount[product.brand] || 0) + 1;
            }
            Object.keys(product.specifications || {}).forEach((specKey) => {
                const specValue = product.specifications[specKey];
                if (specValue != null) { // Check for null/undefined spec values
                    if (!specs[specKey]) {
                        specs[specKey] = new Set();
                    }
                    specs[specKey].add(String(specValue)); // Ensure value is a string if needed
                }
            });
        });
        setAvailableBrands(brandsCount);
        setAvailableSpecs(specs);
  };

  const updateCertifiedVendors = (sourceProducts: Product[]) => {
        const vendorMap = new Map<number, typeof vendors[0]>(); // Use Vendor type if available
        sourceProducts.forEach(product => {
            (product.prices || []).forEach(price => {
                const vendor = vendors.find(v => v.id === price.vendorId);
                if (vendor && vendor.certification) {
                    vendorMap.set(vendor.id, vendor);
                }
            });
        });
        const vendorArray = Array.from(vendorMap.values()).sort((a, b) => {
            const levels = { Gold: 3, Silver: 2, Bronze: 1 };
            // Provide default level 0 if certification is unexpected
            return (levels[b.certification] || 0) - (levels[a.certification] || 0);
        });
        setCertifiedVendors(vendorArray);
    };

  // --- Sorting Logic ---
  const sortProducts = (productsList: Product[]) => {
    const sorted = [...productsList]; // Create a copy to sort
    switch (sortType) {
      case 'price-asc':
        sorted.sort((a, b) => {
          const minPriceA = Math.min(...(a.prices || []).filter(p => p.inStock).map(p => p.price), Infinity);
          const minPriceB = Math.min(...(b.prices || []).filter(p => p.inStock).map(p => p.price), Infinity);
          return minPriceA - minPriceB;
        });
        break; // Add break statements
      case 'price-desc':
        sorted.sort((a, b) => {
          const maxPriceA = Math.max(...(a.prices || []).filter(p => p.inStock).map(p => p.price), 0);
          const maxPriceB = Math.max(...(b.prices || []).filter(p => p.inStock).map(p => p.price), 0);
          return maxPriceB - maxPriceA;
        });
        break;
      case 'rating-desc':
      default:
        sorted.sort((a, b) => {
          const avgA = (a.ratingSum || 0) / Math.max(a.numReviews || 1, 1);
          const avgB = (b.ratingSum || 0) / Math.max(b.numReviews || 1, 1);
          return avgB - avgA;
        });
        break;
      case 'merchants_desc':
        sorted.sort((a, b) => {
          const vendorsA = (a.prices || []).filter(p => p.inStock).length;
          const vendorsB = (b.prices || []).filter(p => p.inStock).length;
          return vendorsB - vendorsA;
        });
        break;
    }
    return sorted;
  };

  // --- Effect 2: Apply Filters and Sorting ---
  useEffect(() => {
    let productsToFilter = [...categoryProducts]; // Start with the raw category products

    // Apply "In Stock Only" filter
    if (activeFilters.inStockOnly) {
        productsToFilter = productsToFilter.filter((product) =>
            (product.prices || []).some((price) => price.inStock)
        );
    }

    // Apply "Brands" filter
    if (activeFilters.brands.length > 0) {
        productsToFilter = productsToFilter.filter((product) =>
            product.brand && activeFilters.brands.includes(product.brand)
        );
    }

    // Apply "Vendor" filter
    if (activeFilters.vendorIds.length > 0) {
        productsToFilter = productsToFilter.filter(product =>
            (product.prices || []).some(price =>
                activeFilters.vendorIds.includes(price.vendorId)
            )
        );
    }

    // Apply "Specs" filter
    if (Object.keys(activeFilters.specs).length > 0) {
        productsToFilter = productsToFilter.filter((product) => {
            return Object.entries(activeFilters.specs).every(([key, selectedValues]) => {
                 // If a spec key has selected values AND the product has that spec defined...
                 if (selectedValues.length > 0 && product.specifications && product.specifications[key] !== undefined) {
                    // ...check if the product's spec value is included in the selected values for that key.
                    // Ensure comparison is consistent (e.g., both strings)
                    return selectedValues.includes(String(product.specifications[key]));
                 } else if (selectedValues.length === 0) {
                    // If no values are selected for this spec key, it doesn't filter out the product.
                    return true;
                 } else {
                    // If values are selected but the product doesn't have this spec, it's filtered out.
                    return false;
                 }
            });
        });
    }

    // Apply Sorting
    const sortedAndFiltered = sortProducts(productsToFilter);

    // Update the final state
    setFilteredProducts(sortedAndFiltered);

  }, [activeFilters, categoryProducts, sortType]); // Rerun when filters, source products, or sort type change

  // --- Filter Event Handlers ---
  const handleBrandFilter = (brand: string) => {
        setActiveFilters((prev) => {
            const currentBrands = prev.brands;
            const newBrands = currentBrands.includes(brand)
                ? currentBrands.filter((b) => b !== brand)
                : [...currentBrands, brand];
            return { ...prev, brands: newBrands };
        });
  };

  const handleSpecFilter = (specKey: string, specValue: string) => {
        setActiveFilters((prev) => {
            const currentSpecs = { ...prev.specs };
            const specValues = currentSpecs[specKey] || [];
            const newSpecValues = specValues.includes(specValue)
                ? specValues.filter((v) => v !== specValue)
                : [...specValues, specValue];

            if (newSpecValues.length === 0) {
                delete currentSpecs[specKey]; // Remove key if no values selected
            } else {
                currentSpecs[specKey] = newSpecValues;
            }
            return { ...prev, specs: currentSpecs };
        });
  };

   const handleVendorFilter = (vendor: typeof vendors[0]) => { // Use Vendor type
        setActiveFilters((prev) => {
            const currentVendorIds = prev.vendorIds;
            const newVendorIds = currentVendorIds.includes(vendor.id)
                ? currentVendorIds.filter(id => id !== vendor.id)
                : [...currentVendorIds, vendor.id];
            return { ...prev, vendorIds: newVendorIds };
        });
  };

  const handleInStockToggle = () => {
       setActiveFilters((prev) => ({
           ...prev,
           inStockOnly: !prev.inStockOnly
       }));
   };

  const handleResetFilters = () => {
    setActiveFilters({ brands: [], specs: {}, inStockOnly: false, vendorIds: [] });
  };

  // --- Misc Helper/UI Logic ---
  const displayedBrand = activeFilters.brands.length === 1 ? brands.find((brand) => brand.name === activeFilters.brands[0]) : null;

  const handlePriceAlert = () => {
    if (!user) {
      toast({ title: 'Login Required', description: 'Please log in to set a price alert', variant: 'destructive' });
      return;
    }
    if (currentCategory) {
        setIsPriceAlertModalOpen(true);
    } else {
        toast({ title: 'Error', description: 'Cannot set alert, category not selected.', variant: 'destructive' });
    }
  };

   // --- Rendering Functions ---

  const renderBreadcrumbs = () => {
    const trailItems: React.ReactNode[] = [];
    trailItems.push(
      <li key="home"><Link to="/" rel="home"><span>BestPrice</span></Link></li>
    );
    if (currentCategory && currentCategory.parentId !== null && !currentCategory.isMain) {
        const ancestors: Category[] = [];
        let category: Category | undefined = currentCategory;
        while (category && category.parentId !== null) {
            const parent = allCategories.find((cat) => cat.id === category?.parentId);
            if (parent) {
                 ancestors.unshift(parent);
                 category = parent;
            } else { category = undefined; }
        }
        ancestors.forEach((cat) => {
            trailItems.push(
                <li key={cat.id}><Link to={`/cat/${cat.id}/${cat.slug}`}>{cat.name}</Link></li>
            );
        });
    }
    return (
      <div id="trail">
        <nav className="breadcrumb"><ol>{trailItems.reduce((acc, item, index) => (<React.Fragment key={index}>{acc}{trailItems.length > 1 && index > 0 && <span className="trail__breadcrumb-separator">›</span>}{item}</React.Fragment>), null)}</ol></nav>
      </div>
    );
  };

  const renderMainCategories = () => {
    if (!currentCategory || currentCategory.parentId !== null || !currentCategory.isMain) { return null; }
    const mainCat = currentCategory;
    const subcategories = categories.filter(cat => cat.parentId === mainCat.id);
    return (
      <>
        {subcategories.length > 0 && (<div className="page-header"><div className="hgroup"><div className="page-header__title-wrapper"><h1>{mainCat.name}</h1></div></div></div>)}
        <div className="root-category__categories">
          {subcategories.length > 0 ? (subcategories.map((subCat) => (<div key={subCat.id} className="root-category__category"><Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover"><img src={subCat.image || '/dist/images/cat/placeholder.webp'} alt={subCat.name} title={subCat.name} /></Link><h3 className="root-category__category-title"><Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link></h3><div className="root-category__footer"><div className="root-category__links">{categories.filter(linkedSubCat => linkedSubCat.parentId === subCat.id).slice(0, 5).map((linkedSubCat, index, arr) => (<React.Fragment key={linkedSubCat.id}><Link to={`/cat/${linkedSubCat.id}/${linkedSubCat.slug}`}>{linkedSubCat.name}</Link>{index < arr.length - 1 && ', '}</React.Fragment>))}</div></div></div>))) : (<p>Δεν υπάρχουν υποκατηγορίες για αυτήν την κατηγορία.</p>)}
        </div>
        <div className="sections"></div>
        <div className="p__products-section">
          <div className="alerts"><button data-url={`/cat/${mainCat.id}/${mainCat.slug}`} data-title={mainCat.name} data-max-price="0" className="alerts__button pressable" onClick={handlePriceAlert}><svg aria-hidden="true" className="icon" width={20} height={20}><use href="/dist/images/icons/icons.svg#icon-notification-outline-20" /></svg><span className="alerts__label">Ειδοποίηση</span></button><div className="alerts__prompt">σε <span className="alerts__title">{mainCat.name}</span></div></div>
        </div>
      </>
    );
  };

  const renderSubcategories = (category: Category) => {
    if (!category || category.parentId === null || category.isMain) { return null; }
    const childCategories = categories.filter(cat => cat.parentId === category.id);
    const parentCategory = allCategories.find(cat => cat.id === category.parentId);
    return (
      <>
        {childCategories.length > 0 && (<div className="page-header"><div className="hgroup"><div className="page-header__title-wrapper">{parentCategory && (<Link className="trail__back pressable" title={`Επιστροφή σε ${parentCategory.name}`} to={`/cat/${parentCategory.id}/${parentCategory.slug}`}><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-right-thin-16" /></svg></Link>)}<h1>{category.name}</h1></div></div></div>)}
        {childCategories.length > 0 ? (<div className="root-category__categories">{childCategories.map((subCat) => (<div key={subCat.id} className="root-category__category"><Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover"><img src={subCat.image || '/dist/images/cat/placeholder.webp'} alt={subCat.name} title={subCat.name} /></Link><h3 className="root-category__category-title"><Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link></h3><div className="root-category__footer"><div className="root-category__links">{categories.filter(linkedSubCat => linkedSubCat.parentId === subCat.id).slice(0, 5).map((linkedSubCat, index, arr) => (<React.Fragment key={linkedSubCat.id}><Link to={`/cat/${linkedSubCat.id}/${linkedSubCat.slug}`}>{linkedSubCat.name}</Link>{index < arr.length - 1 && ', '}</React.Fragment>))}</div></div></div>))}</div>) : (renderProducts())}
        <div className="sections"></div>
        <div className="p__products-section">
          <div className="alerts"><button data-url={`/cat/${category.id}/${category.slug}`} data-title={category.name} data-max-price="0" className="alerts__button pressable" onClick={handlePriceAlert}><svg aria-hidden="true" className="icon" width={20} height={20}><use href="/dist/images/icons/icons.svg#icon-notification-outline-20" /></svg><span className="alerts__label">Ειδοποίηση</span></button><div className="alerts__prompt">σε <span className="alerts__title">{category.name}</span></div></div>
        </div>
      </>
    );
  };

  const renderAppliedFilters = () => {
    // Check if any filter is active
    const isAnyFilterActive = activeFilters.brands.length > 0 ||
                              Object.values(activeFilters.specs).some(v => v.length > 0) ||
                              activeFilters.vendorIds.length > 0 ||
                              activeFilters.inStockOnly;

    if (!isAnyFilterActive) return null; // Render nothing if no filters are active

    return (
        <div className="applied-filters">
            {/* In Stock Filter */}
            {activeFilters.inStockOnly && (
                 <h2 className="applied-filters__filter" key="inStockOnly">
                    <a className="pressable" onClick={handleInStockToggle} title="Αφαίρεση φίλτρου άμεσα διαθέσιμων">
                        <span className="applied-filters__label">Άμεσα διαθέσιμα</span>
                        <svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg>
                    </a>
                </h2>
            )}
            {/* Brand Filters */}
            {activeFilters.brands.map((brand) => (
                <h2 className="applied-filters__filter" key={`brand-${brand}`}>
                    <a className="pressable" onClick={() => handleBrandFilter(brand)} title={`Αφαίρεση φίλτρου ${brand}`}>
                        <span className="applied-filters__label">{brand}</span>
                        <svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg>
                    </a>
                </h2>
            ))}
             {/* Spec Filters */}
            {Object.entries(activeFilters.specs).flatMap(([specKey, specValues]) =>
              specValues.map((specValue) => (
                <h2 className="applied-filters__filter" key={`spec-${specKey}-${specValue}`}>
                    <a className="pressable" onClick={() => handleSpecFilter(specKey, specValue)} title={`Αφαίρεση φίλτρου ${specKey}: ${specValue}`}>
                        <span className="applied-filters__label">{`${specKey}: ${specValue}`}</span>
                        <svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg>
                    </a>
                </h2>
              ))
            )}
            {/* Vendor Filters */}
            {activeFilters.vendorIds.map((vendorId) => {
              const vendor = certifiedVendors.find(v => v.id === vendorId);
              return vendor ? (
                  <h2 className="applied-filters__filter" key={`vendor-${vendor.id}`}>
                      <a className="pressable" onClick={() => handleVendorFilter(vendor)} title={`Αφαίρεση φίλτρου ${vendor.name}`}>
                          <span className="applied-filters__label">{vendor.name}</span>
                          <svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg>
                      </a>
                  </h2>
              ) : null;
            })}
            {/* Reset Button */}
            <button className="applied-filters__reset pressable" onClick={handleResetFilters} title="Επαναφορά όλων των φίλτρων">
                <svg aria-hidden="true" className="icon" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-refresh"></use></svg>
                <span>Καθαρισμός όλων</span>
            </button>
        </div>
    );
  };

  const renderProducts = () => {
    // Note: sortedProducts are now calculated in the useEffect hook and stored in filteredProducts state.
    const showProductHeader = filteredProducts.length > 0 && currentCategory;

    return (
        <div className="page-products">
         {/* --- ASIDE FILTERS --- */}
         {categoryProducts.length > 0 && currentCategory && (
            <aside className="page-products__filters">
            <div id="filters" role="complementary" aria-labelledby="filters-header" data-label={currentCategory.name}>
              <div class="filters__header"><h3 class="filters__header-title filters__header-title--filters">Φίλτρα</h3></div>

              <div class="filter-limit default-list" data-filter-name="limit" data-filter-id="" data-type="" data-key="limit">
                <div class="filter__header"><h4>Εμφάνιση μόνο</h4></div>
                <div class="filter-container">
                  <ol>
                    <li data-filter="deals">
                      <a title="Προσφορές" data-c="38" rel="nofollow" href="/cat/806/mobile-phones.html?deals=1">
                        <svg aria-hidden="true" class="icon" width="16" height="16"><use href="/dist/images/icons/icons.svg#icon-flame-16"></use></svg>
                        <span>Προσφορές</span>
                      </a>
                    </li>
                    <li data-filter="certified">
                      <a title="Πιστοποιημένα καταστήματα" rel="nofollow" href="/cat/806/mobile-phones.html?certified=1">
                        <svg aria-hidden="true" class="icon" width="16" height="16"><use href="/dist/images/icons/icons.svg#icon-certified-16"></use></svg>
                        <span>Πιστοποιημένα καταστήματα</span>
                      </a>
                    </li>
                    <li id="filter-nearby" class="nearby-location is-set">
                      <a title="Κοντά μου" rel="nofollow" href="/cat/806/mobile-phones.html?nearby=1">Κοντά μου (20 χλμ)</a>
                      <div class="filter-nearby__options">Επιλογές</div>
                    </li>
                    <li data-filter="in-stock">
                      <label className="pressable">
                        <input type="checkbox" checked={activeFilters.inStockOnly} onChange={handleInStockToggle} />
                         <span>Άμεσα διαθέσιμα</span>
                      </label>
                    </li>
                    <li data-filter="boxnow">
                      <a title="Παράδοση" rel="nofollow" href="/cat/806/mobile-phones.html?boxnow=1">
                        <svg aria-hidden="true" class="icon" width="24" height="24"><use href="/dist/images/icons/partners.svg#icon-boxnow"></use></svg>
                        <span class="help" data-tooltip-left="" data-tooltip="Προϊόντα από καταστήματα που υποστηρίζουν παράδοση με BOXNOW">
                          <svg aria-hidden="true" class="icon help" width="16" height="16"><use xlink:href="/public/dist/images/icons/icons.svg#icon-info-16"></use></svg>
                        </span><span>Παράδοση</span>
                      </a>
                    </li>
                  </ol>
                </div>
              </div>

              {/* Brand Filter */}
              {Object.keys(availableBrands).length > 0 && (
              <div className="filter-brand default-list" data-filter-name="brand" data-type="select" data-key="brand">
                    <div className="filter__header"><h4>Κατασκευαστής</h4></div>
                    <div className="filter-container">
                    <ol>
                        {/* Sort brands alphabetically for display */}
                        {Object.keys(availableBrands).sort().map((brand) => (
                          <li key={brand} className={activeFilters.brands.includes(brand) ? 'selected' : ''} onClick={() => handleBrandFilter(brand)}><span>{brand} ({availableBrands[brand]})</span></li>
                        ))}
                    </ol>
                    </div>
              </div>
              )}

              {/* Specs Filters */}
              {Object.keys(availableSpecs).length > 0 && (
                    Object.entries(availableSpecs).map(([specKey, specValuesSet]) => {
                        const specValuesArray = Array.from(specValuesSet).sort(); // Sort values
                        if (specValuesArray.length === 0) return null; // Skip empty spec sets
                        return (
                            <div key={specKey} className={`filter-${specKey.toLowerCase()} default-list`} data-filter-name={specKey.toLowerCase()} data-type="select" data-key={specKey.toLowerCase()}>
                                <div className="filter__header"><h4>{specKey}</h4></div>
                                <div className="filter-container">
                                <ol>
                                    {specValuesArray.map((specValue) => (
                                    <li key={specValue} className={`pressable ${activeFilters.specs[specKey]?.includes(specValue) ? 'selected' : ''}`} onClick={() => handleSpecFilter(specKey, specValue)}>
                                        <span>{specValue}</span>
                                    </li>
                                    ))}
                                </ol>
                                </div>
                            </div>
                        )
                    })
              )}

              {/* Certified Vendors Filter */}
              {certifiedVendors.length > 0 && (
                    <div className="filter-store filter-collapsed default-list" data-filter-name="Πιστοποιημένα καταστήματα" data-filter-id="store" data-type="store" data-key="store">
                        <div className="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div>
                        <div className="filter-container">
                            <ol aria-expanded={showMoreVendors}>
                            {certifiedVendors.slice(0, showMoreVendors ? certifiedVendors.length : MAX_DISPLAY_COUNT).map(vendor => (
                                <li key={vendor.id} title={`Το κατάστημα ${vendor.name} διαθέτει ${vendor.certification} πιστοποίηση`} className={`pressable ${activeFilters.vendorIds.includes(vendor.id) ? 'selected' : ''}`} onClick={() => handleVendorFilter(vendor)}>
                                  <a href="#" data-l={vendor.certification === 'Gold' ? '3' : vendor.certification === 'Silver' ? '2' : '1'}>
                                    <span>{vendor.name}</span>
                                  </a>
                                </li>
                            ))}
                            </ol>
                            {certifiedVendors.length > MAX_DISPLAY_COUNT && (
                                <div className="filters-more-prompt pressable" title={showMoreVendors ? "Λιγότερα καταστήματα" : "Περισσότερα καταστήματα"} onClick={() => setShowMoreVendors(prev => !prev)}>
                                    <svg aria-hidden="true" className="icon" width="10" height="10" viewBox="0 0 10 10"><path fillRule="evenodd" d={showMoreVendors ? "M9.5 6H0.5C0.224 6 0 5.776 0 5.5V4.5C0 4.224 0.224 4 0.5 4H9.5C9.776 4 10 4.224 10 4.5V5.5C10 5.776 9.776 6 9.5 6Z" : "M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"} /></svg>
                                    {showMoreVendors ? "Εμφάνιση λιγότερων" : "Εμφάνιση όλων"}
                                </div>
                            )}
                        </div>
                    </div>
              )}

              {/* In Stock Filter */}
              <div className="filter-in-stock default-list">
                    <div className="filter-container">
                    <label className="pressable">
                        <input type="checkbox" checked={activeFilters.inStockOnly} onChange={handleInStockToggle} />
                         <span>Άμεσα διαθέσιμα</span>
                    </label>
                    </div>
              </div>

              {/* Scrollback button - consider its functionality */}
              {/* <button className="button button--outline" id="filters__scrollback">
                    <svg className="icon" aria-hidden="true" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-up-12"></use></svg><div>Φίλτρα</div>
                </button> */}
            </div>
            </aside>
         )}
         {/* --- END ASIDE FILTERS --- */}

        <main className="page-products__main">
            {filteredProducts.length > 0 && currentCategory && (
                <header className="page-header">
                    <div className="page-header__title-wrapper">
                      <div className="page-header__title-main">
                        <h1>{currentCategory.name}</h1>
                        <div className="page-header__count-wrapper">
                          <div className="page-header__count">{filteredProducts.length} προϊόντα</div>
                          <div data-url={`/cat/${currentCategory.id}/${currentCategory.slug}`} data-title={currentCategory.name} data-max-price="0" className="alerts-minimal pressable" onClick={handlePriceAlert}>
                            <svg aria-hidden="true" className="icon" width={20} height={20}><use href="/dist/images/icons/icons.svg#icon-notification-outline-20"></use></svg>
                            <div class="alerts-minimal__label"></div>
                          </div>
                        </div>
                      </div>
                        
                      <div className="page-header__title-aside">
                        {displayedBrand && displayedBrand.logo && ( // Check if logo exists
                          <Link to={`/b/${displayedBrand.id}/${displayedBrand.slug || displayedBrand.name.toLowerCase()}.html`} title={displayedBrand.name} className="page-header__brand">
                            <img alt={`${displayedBrand.name} logo`} height="70" loading="lazy" src={displayedBrand.logo} />
                          </Link>
                        )}
                      </div>
                    </div>
                    {renderAppliedFilters()}
                    <div className="page-header__sorting">
                      <div className="tabs">
                        <div className="tabs-wrapper">
                          <nav>
                            <a href="#" data-type="rating-desc" rel="nofollow" className={sortType === 'rating-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); setSortType('rating-desc'); }}><div className="tabs__content">Δημοφιλέστερα</div></a>
                            <a href="#" data-type="price-asc" rel="nofollow" className={sortType === 'price-asc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); setSortType('price-asc'); }}><div className="tabs__content">Φθηνότερα</div></a>
                            <a href="#" data-type="price-desc" rel="nofollow" className={sortType === 'price-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); setSortType('price-desc'); }}><div className="tabs__content">Ακριβότερα</div></a>
                            <a href="#" data-type="merchants_desc" rel="nofollow" className={sortType === 'merchants_desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); setSortType('merchants_desc'); }}><div className="tabs__content">Αριθμός καταστημάτων</div></a>
                          </nav>
                        </div>
                      </div>
                    </div>
                </header>
            )}

            <div className="page-products__main-wrapper">
            <div className="p__products" data-pagination="">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    currentCategory && !currentCategory.isMain && categoryProducts.length > 0 &&
                    <p>Δεν βρέθηκαν προϊόντα που να ταιριάζουν με τα επιλεγμένα φίλτρα.</p>
                )}
                 {currentCategory && !currentCategory.isMain && categoryProducts.length === 0 &&
                    <p>Δεν υπάρχουν προϊόντα για αυτήν την κατηγορία.</p>
                 }
            </div>
            </div>
        </main>
        </div>
    );
   };

  return (
    <div className="root__wrapper root-category__root">
      <div className="root">
        {renderBreadcrumbs()}
        {renderMainCategories()}
        {currentCategory && (currentCategory.parentId !== null && !currentCategory.isMain) && renderSubcategories(currentCategory)}
        {isPriceAlertModalOpen && currentCategory && (
          <PriceAlertModal isOpen={isPriceAlertModalOpen} onClose={() => setIsPriceAlertModalOpen(false)} categoryName={currentCategory.name} categoryId={currentCategory.id} />
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
