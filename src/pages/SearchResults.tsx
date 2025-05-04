import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
// Assuming NotFound is not directly needed
// import NotFound from '@/pages/NotFound'; // Adjust path if needed
import { categories, mainCategories, products as allMockProducts, Category, Product, vendors, brands, PaymentMethod, Vendor, Brand, searchProducts } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import PriceAlertModal from '@/components/PriceAlertModal';
import ScrollableSlider from '@/components/ScrollableSlider';
import { useTranslation } from '@/hooks/useTranslation';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';

// --- Debounce Hook ---
const useDebounce = (value: string, delay: number): string => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => { const handler = setTimeout(() => { setDebouncedValue(value); }, delay); return () => { clearTimeout(handler); }; }, [value, delay]);
    return debouncedValue;
};
// --- End Debounce Hook ---


const MAX_DISPLAY_COUNT = 10;

// Helper to clean domain name
const cleanDomainName = (url: string): string => {
  if (!url) return '';
  try { const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`); return parsedUrl.hostname.replace(/^www\./i, ''); }
  catch (e) { return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]; }
};

// Define the structure for active filters state accurately
interface ActiveFiltersState {
  brands: string[];
  specs: Record<string, string[]>;
  vendorIds: number[];
  deals: boolean;
  certified: boolean;
  nearby: boolean;
  boxnow: boolean;
  instock: boolean;
  // Removed categoryIds as filter now navigates away
}

// Define available category structure
interface AvailableCategory {
    id: number; category: string; slug: string; count: number; image: string | null; parentId: number | null;
}

const SearchResults: React.FC = () => {
  // --- Hooks & Initial Setup ---
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

  // --- Document Attributes Logic ---
  const userAgent = navigator.userAgent.toLowerCase();
  const [jsEnabled, setJsEnabled] = useState(false);
  let classNamesForBody = '';
  let classNamesForHtml = 'page';
  const checkAdBlockers = (): boolean => { try { const testAd = document.createElement('div'); testAd.innerHTML = ' '; testAd.className = 'adsbox'; testAd.style.position = 'absolute'; testAd.style.left = '-9999px'; testAd.style.height = '1px'; document.body.appendChild(testAd); const isBlocked = !testAd.offsetHeight; document.body.removeChild(testAd); return isBlocked; } catch (e) { return false; } };
  const isAdBlocked = useMemo(checkAdBlockers, []);
  if (userAgent.includes('windows')) { classNamesForHtml += ' windows no-touch'; }
  else if (userAgent.includes('android')) { classNamesForHtml += ' android touch'; classNamesForBody = 'mobile'; }
  else if (userAgent.includes('iphone') || userAgent.includes('ipad')) { classNamesForHtml += ' ios touch'; classNamesForBody = userAgent.includes('ipad') ? 'tablet' : 'mobile'; }
  else if (userAgent.includes('mac os x')) { classNamesForHtml += ' macos no-touch'; }
  else { classNamesForHtml += ' unknown-device'; }
  classNamesForHtml += isAdBlocked ? ' adblocked' : ' adallowed';
  classNamesForHtml += ' supports-webp supports-ratio supports-flex-gap supports-lazy supports-assistant is-desktop is-modern flex-in-button is-prompting-to-add-to-home';
  useEffect(() => { setJsEnabled(true); }, []);
  classNamesForHtml += jsEnabled ? ' js-enabled' : ' js-disabled';
  useHtmlAttributes(classNamesForHtml, 'page-search');
  useBodyAttributes(classNamesForBody, '');
  // --- End Document Attributes ---

  // --- Precompute Vendor Maps ---
  const vendorIdMap = useMemo(() => new Map(vendors.map(v => [v.id, v])), []);
  const vendorDomainMap = useMemo(() => { const map = new Map<string, Vendor>(); vendors.forEach(v => { const domain = cleanDomainName(v.url).toLowerCase(); if (domain) { map.set(domain, v); } }); return map; }, []);

  // --- State Definitions ---
  const [baseSearchResults, setBaseSearchResults] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [availableBrands, setAvailableBrands] = useState<Record<string, number>>({});
  const [availableSpecs, setAvailableSpecs] = useState<Record<string, Set<string>>>({});
  const [availableCategories, setAvailableCategories] = useState<AvailableCategory[]>([]);
  const [sliderCategories, setSliderCategories] = useState<AvailableCategory[]>([]);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const [showMoreSpecs, setShowMoreSpecs] = useState<Record<string, boolean>>({});
  const [certifiedVendors, setCertifiedVendors] = useState<Vendor[]>([]);
  const [showMoreVendors, setShowMoreVendors] = useState(false);
  const [sortType, setSortType] = useState('rating-desc');
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState(false);

  // Search Query State
  const searchQuery = searchParams.get('q') || '';
  const debouncedSearchQuery = useDebounce(searchQuery, 1);

  // Derive initial filter state directly from URL params
  const getFiltersFromUrl = (): ActiveFiltersState => {
        const params = searchParams;
        const storeDomains = params.get('store')?.toLowerCase().split(',').filter(Boolean) || [];
        const vendorIdsFromUrl = storeDomains.map(domain => vendorDomainMap.get(domain)?.id).filter((id): id is number => id !== undefined);
        const brandsFromUrl = params.get('brand')?.toLowerCase().split(',').filter(Boolean) || [];
        const specsFromUrl = Array.from(params.entries()).reduce((acc, [key, value]) => { if (key.startsWith('spec_')) { acc[key.substring(5).toLowerCase()] = value.toLowerCase().split(',').filter(Boolean); } return acc; }, {} as Record<string, string[]>);
        // Removed categoryIds parsing here
        return { brands: brandsFromUrl, specs: specsFromUrl, vendorIds: vendorIdsFromUrl, deals: params.get('deals') === '1', certified: params.get('certified') === '1', nearby: params.get('nearby') === '1', boxnow: params.get('boxnow') === '1', instock: params.get('instock') === '1' };
    };

  // Active filters state - holds ORIGINAL CASING from user interaction
  const [activeFilters, setActiveFilters] = useState<ActiveFiltersState>(getFiltersFromUrl());

  // --- Helper Data & Category Logic ---
  const allCategories = [...mainCategories, ...categories];
  const findCategory = (identifier: string): Category | undefined => allCategories.find(cat => cat.id.toString() === identifier || cat.slug === identifier);

  // --- URL Sync Function - Writes lowercase parameters (preserves 'q', removes 'cat') ---
  const updateUrlParams = (filters: ActiveFiltersState) => {
    const params = new URLSearchParams(searchParams);
    ['brand', 'store', 'deals', 'certified', 'nearby', 'boxnow', 'instock', 'cat'].forEach(p => params.delete(p));
    Array.from(params.keys()).forEach(key => { if (key.startsWith('spec_')) params.delete(key); });
    if (filters.brands.length > 0) params.set('brand', filters.brands.map(b => b.toLowerCase()).join(','));
    if (filters.vendorIds.length > 0) { const domains = filters.vendorIds.map(id => vendorIdMap.get(id)?.url).filter((url): url is string => !!url).map(cleanDomainName).map(d => d.toLowerCase()).filter(Boolean); if (domains.length > 0) { params.set('store', domains.join(',')); } }
    Object.entries(filters.specs).forEach(([key, values]) => { if (values.length > 0) { params.set(`spec_${key.toLowerCase()}`, values.map(v => v.toLowerCase()).join(',')); } });
    // Removed categoryIds writing
    if (filters.deals) params.set('deals', '1');
    if (filters.certified) params.set('certified', '1');
    if (filters.nearby) params.set('nearby', '1');
    if (filters.boxnow) params.set('boxnow', '1');
    if (filters.instock) params.set('instock', '1');
    setSearchParams(params, { replace: true });
  };

  // Effect 1: Fetch Search Results or Load All Products & Extract Base Filters
  useEffect(() => {
    let results: Product[] = [];
    if (searchQuery) { results = searchProducts(searchQuery); }
    else { results = allMockProducts; } // Load all products if query is empty

    setBaseSearchResults(results);
    extractAvailableFilters(results); // For sidebar options
    extractCategories(results, setAvailableCategories); // **MODIFIED: For sidebar category links**
    updateCertifiedVendors(results);
    // Let Effect 3 sync activeFilters state from URL
  }, [searchQuery]); // Rerun only when actual search query changes

  // --- Filter Extraction Logic (Stores original case) ---
  const extractAvailableFilters = (sourceProducts: Product[]) => {
      const brandsCount: Record<string, number> = {};
      const specs: Record<string, Set<string>> = {};
      sourceProducts.forEach((product) => { if (product.brand) { brandsCount[product.brand] = (brandsCount[product.brand] || 0) + 1; } Object.keys(product.specifications || {}).forEach((specKey) => { const specValue = product.specifications[specKey]; if (specValue != null) { const originalKey = specKey; const originalValue = String(specValue); if (!specs[originalKey]) { specs[originalKey] = new Set(); } specs[originalKey].add(originalValue); } }); });
      setAvailableBrands(brandsCount);
      setAvailableSpecs(specs);
      setShowMoreSpecs(Object.keys(specs).reduce((acc, key) => { acc[key] = false; return acc; }, {} as Record<string, boolean>));
  };
  // **MODIFIED: extractCategories now accepts a setter**
  const extractCategories = (results: Product[], setter: React.Dispatch<React.SetStateAction<AvailableCategory[]>>) => {
        const categoryCount: Record<number, number> = {};
        results.forEach((product) => { (product.categoryIds || []).forEach(categoryId => { categoryCount[categoryId] = (categoryCount[categoryId] || 0) + 1; }); });
        const allCatsMap = new Map([...mainCategories, ...categories].map(c => [c.id, c]));
        const categoriesArray: AvailableCategory[] = Object.entries(categoryCount).map(([idStr, count]) => { const id = parseInt(idStr, 10); const categoryData = allCatsMap.get(id); return categoryData ? { id: categoryData.id, category: categoryData.name, slug: categoryData.slug, count, image: categoryData.image, parentId: categoryData.parentId } : null; }).filter((cat): cat is AvailableCategory => cat !== null).sort((a, b) => b.count - a.count);
        setter(categoriesArray); // Use the provided setter
    };
  const updateCertifiedVendors = (sourceProducts: Product[]) => {
      const vendorMap = new Map<number, Vendor>();
      sourceProducts.forEach(product => { (product.prices || []).forEach(price => { const vendor = vendorIdMap.get(price.vendorId); if (vendor && vendor.certification) { vendorMap.set(vendor.id, vendor); } }); });
      const vendorArray = Array.from(vendorMap.values()).sort((a, b) => { const levels: Record<string, number> = { Gold: 3, Silver: 2, Bronze: 1 }; return (levels[b.certification] || 0) - (levels[a.certification] || 0); });
      setCertifiedVendors(vendorArray);
  };

  // --- Sorting Logic ---
  const sortProducts = (productsList: Product[]) => {
    const sorted = [...productsList];
    switch (sortType) {
      case 'price-asc': sorted.sort((a, b) => Math.min(...(a.prices || []).filter(p => p.inStock).map(p => p.price), Infinity) - Math.min(...(b.prices || []).filter(p => p.inStock).map(p => p.price), Infinity)); break;
      case 'price-desc': sorted.sort((a, b) => Math.max(...(b.prices || []).filter(p => p.inStock).map(p => p.price), 0) - Math.max(...(a.prices || []).filter(p => p.inStock).map(p => p.price), 0)); break;
      case 'rating-desc': default: sorted.sort((a, b) => ((b.ratingSum || 0) / Math.max(b.numReviews || 1, 1)) - ((a.ratingSum || 0) / Math.max(a.numReviews || 1, 1))); break;
      case 'merchants_desc': sorted.sort((a, b) => (b.prices || []).filter(p => p.inStock).length - (a.prices || []).filter(p => p.inStock).length); break;
    }
    return sorted;
  };

  // --- Effect 2: Apply Filters and Sorting ---
  useEffect(() => {
    let productsToFilter = [...baseSearchResults];
    const currentFilters = activeFilters;

    // Apply filters... (removed categoryIds filter application)
    if (currentFilters.instock) { productsToFilter = productsToFilter.filter(p => (p.prices || []).some(price => price.inStock)); }
    if (currentFilters.deals) { console.warn("Deals Filter Placeholder"); }
    if (currentFilters.certified) { productsToFilter = productsToFilter.filter(p => (p.prices || []).some(price => vendorIdMap.get(price.vendorId)?.certification)); }
    if (currentFilters.nearby) { console.warn("Nearby Filter Placeholder"); }
    if (currentFilters.boxnow) { productsToFilter = productsToFilter.filter(p => (p.prices || []).some(price => vendorIdMap.get(price.vendorId)?.paymentMethods?.includes(PaymentMethod.PickupVia))); }
    if (currentFilters.brands.length > 0) { const lowerCaseFilterBrands = currentFilters.brands.map(b => b.toLowerCase()); productsToFilter = productsToFilter.filter(p => p.brand && lowerCaseFilterBrands.includes(p.brand.toLowerCase())); }
    if (currentFilters.vendorIds.length > 0) { productsToFilter = productsToFilter.filter(p => (p.prices || []).some(price => currentFilters.vendorIds.includes(price.vendorId))); }
    if (Object.keys(currentFilters.specs).length > 0) { productsToFilter = productsToFilter.filter(p => Object.entries(currentFilters.specs).every(([filterKey, filterValues]) => { if (!filterValues || filterValues.length === 0) return true; const productSpecKey = Object.keys(p.specifications || {}).find(pk => pk.toLowerCase() === filterKey.toLowerCase()); if (!productSpecKey || p.specifications[productSpecKey] === undefined) return false; const productValueLower = String(p.specifications[productSpecKey]).toLowerCase(); const filterValuesLower = filterValues.map(v => v.toLowerCase()); return filterValuesLower.includes(productValueLower); }) ); }

    const sortedAndFiltered = sortProducts(productsToFilter);
    setFilteredProducts(sortedAndFiltered);

    // --- Scroll to top whenever filtered products change ---
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Use smooth scroll

    // --- Update Slider Categories based on the *filtered* results ---
    extractCategories(sortedAndFiltered, setSliderCategories);


  }, [activeFilters, baseSearchResults, sortType, vendorIdMap]); // Added sortType

  // Effect 3: Update activeFilters state when URL parameters change OR when available options change
  useEffect(() => {
      const filtersFromUrl = getFiltersFromUrl(); // Reads URL, gets lowercase/IDs

      // Reconcile URL state with internal state (find original case)
      const reconciledBrands = filtersFromUrl.brands.map(lb => Object.keys(availableBrands).find(b => b.toLowerCase() === lb)).filter((b): b is string => b !== undefined);
      const reconciledSpecs = Object.entries(filtersFromUrl.specs).reduce((acc, [lowerKey, lowerValues]) => { const originalKey = Object.keys(availableSpecs).find(ak => ak.toLowerCase() === lowerKey); if (originalKey) { const originalValues = lowerValues.map(lv => Array.from(availableSpecs[originalKey] || new Set<string>()).find(av => av.toLowerCase() === lv)).filter((v): v is string => v !== undefined); if (originalValues.length > 0) { acc[originalKey] = originalValues; } } return acc; }, {} as Record<string, string[]>);
      // Reconstruct the state based on reconciled values + boolean flags from URL
      const reconciledState: ActiveFiltersState = { ...filtersFromUrl, brands: reconciledBrands, specs: reconciledSpecs, categoryIds: undefined }; // Ensure categoryIds is not set here

      if (JSON.stringify(reconciledState) !== JSON.stringify(activeFilters)) {
          setActiveFilters(reconciledState);
      }
  }, [searchParams, activeFilters, vendorDomainMap, availableBrands, availableSpecs]);


  // --- Filter Event Handlers (Update state with original casing) ---
  const handleLinkFilterClick = (event: React.MouseEvent<HTMLAnchorElement>, handler: () => void) => { event.preventDefault(); handler(); };
  const createToggleHandler = (filterKey: keyof Omit<ActiveFiltersState, 'categoryIds'>) => { return () => { const newFilters = { ...activeFilters, [filterKey]: !activeFilters[filterKey] }; setActiveFilters(newFilters); updateUrlParams(newFilters); }; };
  const handleDealsToggle = createToggleHandler('deals');
  const handleCertifiedToggle = createToggleHandler('certified');
  const handleNearbyToggle = createToggleHandler('nearby');
  const handleBoxnowToggle = createToggleHandler('boxnow');
  const handleInstockToggle = createToggleHandler('instock');
  const handleBrandFilter = (brand: string) => { const currentBrands = activeFilters.brands; const newBrands = currentBrands.includes(brand) ? currentBrands.filter(b => b !== brand) : [...currentBrands, brand]; const newFilters = { ...activeFilters, brands: newBrands }; setActiveFilters(newFilters); updateUrlParams(newFilters); };
  const handleSpecFilter = (specKey: string, specValue: string) => { const currentSpecs = { ...activeFilters.specs }; const specValues = currentSpecs[specKey] || []; const newSpecValues = specValues.includes(specValue) ? specValues.filter(v => v !== specValue) : [...specValues, specValue]; if (newSpecValues.length === 0) { delete currentSpecs[specKey]; } else { currentSpecs[specKey] = newSpecValues; } const newFilters = { ...activeFilters, specs: currentSpecs }; setActiveFilters(newFilters); updateUrlParams(newFilters); };
  const handleVendorFilter = (vendor: Vendor) => { const currentVendorIds = activeFilters.vendorIds; const newVendorIds = currentVendorIds.includes(vendor.id) ? currentVendorIds.filter(id => id !== vendor.id) : [...currentVendorIds, vendor.id]; const newFilters = { ...activeFilters, vendorIds: newVendorIds }; setActiveFilters(newFilters); updateUrlParams(newFilters); };
  const handleResetFilters = () => { const resetState: ActiveFiltersState = { brands: [], specs: {}, vendorIds: [], deals: false, certified: false, nearby: false, boxnow: false, instock: false, categoryIds: [] }; setActiveFilters(resetState); updateUrlParams(resetState); };

  // --- Misc Helper/UI Logic ---
  const displayedBrand = activeFilters.brands.length === 1 ? brands.find(b => b.name === activeFilters.brands[0]) : null;
  const handlePriceAlert = () => { if (!user) { toast({ title: 'Login Required', description: 'Please log in to set a price alert', variant: 'destructive' }); return; } if (currentCategory) { setIsPriceAlertModalOpen(true); } else { toast({ title: 'Error', description: 'Cannot set alert, category not selected.', variant: 'destructive' }); } };

   // --- Rendering Functions ---

  // Renders the list of applied filter tags above the results
  const renderAppliedFilters = () => {
        const { brands, specs, vendorIds, deals, certified, nearby, boxnow, instock } = activeFilters;
        const isAnyFilterActive = brands.length > 0 || Object.values(specs).some(v => v.length > 0) || vendorIds.length > 0 || deals || certified || nearby || boxnow || instock;
        if (!isAnyFilterActive) return null;

        return (
            <div className="applied-filters">
                {instock && (<h2 className="applied-filters__filter" key="instock"><a className="pressable" onClick={handleInstockToggle} title="Αφαίρεση φίλτρου άμεσα διαθέσιμων προϊόντων"><span className="applied-filters__label">Άμεσα διαθέσιμα</span><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)}
                {deals && (<h2 className="applied-filters__filter" key="deals"><a className="pressable" onClick={handleDealsToggle} title="Αφαίρεση φίλτρου προσφορών"><span className="applied-filters__label">Προσφορές</span><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)}
                {certified && (<h2 className="applied-filters__filter" key="certified"><a className="pressable" onClick={handleCertifiedToggle} title="Αφαίρεση φίλτρου πιστοποιημένων καταστημάτων"><span className="applied-filters__label">Πιστοποιημένα καταστήματα</span><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)}
                {nearby && (<h2 className="applied-filters__filter" key="nearby"><a className="pressable" onClick={handleNearbyToggle} title="Αφαίρεση φίλτρου για καταστήματα κοντά μου"><span className="applied-filters__label">Κοντά μου</span><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)}
                {boxnow && (<h2 className="applied-filters__filter" key="boxnow"><a className="pressable" onClick={handleBoxnowToggle} title="Αφαίρεση φίλτρου παράδοσης προϊόντων με Box Now"><span className="applied-filters__label">Παράδοση με Box Now</span><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)}
                {brands.map((brand) => (<h2 className="applied-filters__filter" key={`brand-${brand}`}><a className="pressable" onClick={() => handleBrandFilter(brand)} title={`Αφαίρεση φίλτρου του κατασκευαστή ${brand}`}><span className="applied-filters__label">{brand}</span><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>))}
                {Object.entries(specs).flatMap(([specKey, specValues]) => specValues.map((specValue) => (<h2 className="applied-filters__filter" key={`spec-${specKey}-${specValue}`}><a className="pressable" onClick={() => handleSpecFilter(specKey, specValue)} title={`Αφαίρεση φίλτρου ${specKey}: ${specValue}`}><span className="applied-filters__label">{`${specKey}: ${specValue}`}</span><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)))}
                {vendorIds.map((vendorId) => { const vendor = vendorIdMap.get(vendorId); return vendor ? (<h2 className="applied-filters__filter" key={`vendor-${vendor.id}`}><a className="pressable" onClick={() => handleVendorFilter(vendor)} title={`Αφαίρεση φίλτρου από το κατάστημα ${vendor.name}`}><span className="applied-filters__label">{vendor.name}</span><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>) : null; })}
                <button className="applied-filters__reset pressable" onClick={handleResetFilters} title="Επαναφορά όλων των φίλτρων"><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-refresh"></use></svg><span>Καθαρισμός όλων</span></button>
            </div>
        );
    };

  // Renders the main content area including sidebar and product grid
  const renderSearchResultsContent = () => {
    const { brands: activeBrandFilters, specs: activeSpecFilters, vendorIds: activeVendorIds, ...restActiveFilters } = activeFilters;
    const isAnyFilterActive = activeBrandFilters.length > 0 || Object.values(activeSpecFilters).some(v => v.length > 0) || activeVendorIds.length > 0 || Object.values(restActiveFilters).some(v => v === true);
    const sortedAvailableBrandKeys = useMemo(() => Object.keys(availableBrands).sort(), [availableBrands]);
    const sortedAvailableSpecKeys = useMemo(() => Object.keys(availableSpecs).sort(), [availableSpecs]);

    return (
      <div className="page-products">
         {/* ASIDE FILTERS */}
         {baseSearchResults.length > 0 && (
            <aside className="page-products__filters">
            <div id="filters" role="complementary" aria-labelledby="filters-header">

               {/* Categories Filter (Links to Category Page) */}
               {availableCategories.length > 0 && (
                    <div className="filters__categories filter-categories default-list" data-filter-name="categories">
                      <div className="filter__header"><h4>Κατηγορίες</h4></div>
                      <div className="filter-container">
                          <ol aria-expanded={showMoreCategories}>
                            {availableCategories.slice(0, showMoreCategories ? availableCategories.length : MAX_DISPLAY_COUNT).map((item) => (
                               <li key={item.id} className={`pressable`}>
                                   <Link to={`/cat/${item.id}/${item.slug}`} className="filters__link" data-c={item.count}>
                                       <span>{item.category}</span>
                                    </Link>
                               </li>
                            ))}
                          </ol>
                          {availableCategories.length > MAX_DISPLAY_COUNT && (
                            <div className="filters-more-prompt pressable" onClick={() => setShowMoreCategories(prev => !prev)} title={showMoreCategories ? "Λιγότερες κατηγορίες" : "Όλες οι κατηγορίες"}>
                                <svg aria-hidden="true" className="icon" width={10} height={10} viewBox="0 0 10 10" viewBox="0 0 10 10"><path fillRule="evenodd" d={showMoreCategories ? "M9.5 6H0.5C0.224 6 0 5.776 0 5.5V4.5C0 4.224 0.224 4 0.5 4H9.5C9.776 4 10 4.224 10 4.5V5.5C10 5.776 9.776 6 9.5 6Z" : "M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"} /></svg>
                                {showMoreCategories ? "Εμφάνιση λιγότερων" : "Εμφάνιση όλων"}
                            </div>
                          )}
                      </div>
                    </div>
               )}
              
              <div className="filters__header">
                <div className="filters__header-title filters__header-title--filters">Φίλτρα</div>
                {isAnyFilterActive && ( <Link to="#" onClick={(e) => handleLinkFilterClick(e, handleResetFilters)} className="pressable filters__header-remove popup-anchor" data-tooltip="Αφαίρεση όλων των φίλτρων" data-tooltip-no-border="" data-tooltip-small="true">Καθαρισμός</Link> )}
              </div>

              {/* "Εμφάνιση μόνο" Section */}
              <div className="filter-limit default-list" data-filter-name="limit" data-filter-id data-type data-key="limit">
                 <div className="filter__header"><h4>Εμφάνιση μόνο</h4></div>
                 <div className="filter-container"> <ol>
                    <li data-filter="deals" className={`pressable ${activeFilters.deals ? 'selected' : ''}`}><Link to="#" title="Προσφορές" rel="nofollow" onClick={(e) => handleLinkFilterClick(e, handleDealsToggle)}><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-flame-16"></use></svg><span>Προσφορές</span></Link></li>
                    <li data-filter="certified" className={`pressable ${activeFilters.certified ? 'selected' : ''}`}><Link to="#" title="Πιστοποιημένα καταστήματα" rel="nofollow" onClick={(e) => handleLinkFilterClick(e, handleCertifiedToggle)}><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-certified-16"></use></svg><span>Πιστοποιημένα καταστήματα</span></Link></li>
                    {/* <li id="filter-nearby" ...> ... </li> */}
                    <li data-filter="in-stock" className={`pressable ${activeFilters.instock ? 'selected' : ''}`}><Link to="#" title="Άμεσα διαθέσιμα" rel="nofollow" onClick={(e) => handleLinkFilterClick(e, handleInstockToggle)}><span>Άμεσα διαθέσιμα</span></Link></li>
                    <li data-filter="boxnow" className={`pressable ${activeFilters.boxnow ? 'selected' : ''}`}><Link to="#" title="Παράδοση με BoxNow" rel="nofollow" onClick={(e) => handleLinkFilterClick(e, handleBoxnowToggle)}><svg aria-hidden="true" className="icon" width={24} height={24}><use href="/dist/images/icons/partners.svg#icon-boxnow"></use></svg><span className="help" data-tooltip-left="" data-tooltip="Προϊόντα από καταστήματα που υποστηρίζουν παράδοση με BOX NOW"><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-info-16"></use></svg></span><span>Παράδοση</span></Link></li>
                 </ol> </div>
              </div>

              {/* Brand Filter with Show More */}
              {Object.keys(availableBrands).length > 0 && (
                 <div className="filter-brand default-list" data-filter-name="Κατασκευαστής" data-type="brand" data-key="brand">
                    <div className="filter__header"><h4>Κατασκευαστής</h4></div>
                    <div className="filter-container">
                      <ol aria-expanded={showMoreBrands}>
                        {sortedAvailableBrandKeys.slice(0, showMoreBrands ? sortedAvailableBrandKeys.length : MAX_DISPLAY_COUNT).map((brand) => ( <li key={brand} className={`pressable ${activeFilters.brands.includes(brand) ? 'selected' : ''}`} onClick={() => handleBrandFilter(brand)}> <a data-c={availableBrands[brand]}>{brand}</a> </li> ))}
                      </ol>
                       {sortedAvailableBrandKeys.length > MAX_DISPLAY_COUNT && ( <div className="filters-more-prompt pressable" onClick={() => setShowMoreBrands(prev => !prev)} title={showMoreBrands ? "Λιγότεροι κατασκευαστές" : "Όλοι οι κατασκευαστές"}> <svg aria-hidden="true" className="icon" width={10} height={10} viewBox="0 0 10 10"><path d={showMoreBrands ? "M9.5 6H0.5C0.224 6 0 5.776 0 5.5V4.5C0 4.224 0.224 4 0.5 4H9.5C9.776 4 10 4.224 10 4.5V5.5C10 5.776 9.776 6 9.5 6Z" : "M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"} /></svg> {showMoreBrands ? "Εμφάνιση λιγότερων" : "Εμφάνιση όλων"} </div> )}
                    </div>
                 </div>
              )}

              {/* Specs Filters with Show More */}
               {sortedAvailableSpecKeys.length > 0 && ( sortedAvailableSpecKeys.map((specKey) => { const specValuesSet = availableSpecs[specKey]; const specValuesArray = Array.from(specValuesSet).sort(); const isExpanded = showMoreSpecs[specKey] || false; if (specValuesArray.length === 0) return null; return ( <div key={specKey} className={`filter-${specKey.toLowerCase()} default-list`} data-filter-name={specKey.toLowerCase()} data-key={specKey.toLowerCase()}> <div className="filter__header"><h4>{specKey}</h4></div> <div className="filter-container"> <ol aria-expanded={isExpanded}> {specValuesArray.slice(0, isExpanded ? specValuesArray.length : MAX_DISPLAY_COUNT).map((specValue) => ( <li key={specValue} className={`pressable ${activeFilters.specs[specKey]?.includes(specValue) ? 'selected' : ''}`} onClick={() => handleSpecFilter(specKey, specValue)}> <span>{specValue}</span> </li> ))} </ol> {specValuesArray.length > MAX_DISPLAY_COUNT && ( <div className="filters-more-prompt pressable" onClick={() => setShowMoreSpecs(prev => ({...prev, [specKey]: !prev[specKey]}))} title={isExpanded ? `Λιγότερες επιλογές ${specKey}` : `Όλες οι επιλογές ${specKey}`}> <svg aria-hidden="true" className="icon" width={10} height={10} viewBox="0 0 10 10"><path d={isExpanded ? "M9.5 6H0.5C0.224 6 0 5.776 0 5.5V4.5C0 4.224 0.224 4 0.5 4H9.5C9.776 4 10 4.224 10 4.5V5.5C10 5.776 9.776 6 9.5 6Z" : "M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"} /></svg> {isExpanded ? "Εμφάνιση λιγότερων" : "Εμφάνιση όλων"} </div> )} </div> </div> ) }) )}

              {/* Certified Vendors Filter with Show More */}
              {certifiedVendors.length > 0 && ( <div className="filter-store filter-collapsed default-list" data-filter-name="Πιστοποιημένα καταστήματα" data-filter-id="store" data-type="store" data-key="store"> <div className="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div> <div className="filter-container"> <ol aria-expanded={showMoreVendors}> {certifiedVendors.slice(0, showMoreVendors ? certifiedVendors.length : MAX_DISPLAY_COUNT).map(vendor => ( <li key={vendor.id} title={`Το κατάστημα ${vendor.name} (${cleanDomainName(vendor.url)}) διαθέτει ${vendor.certification} πιστοποίηση`} className={`pressable ${activeFilters.vendorIds.includes(vendor.id) ? 'selected' : ''}`}> <Link to="#" data-l={vendor.certification === 'Gold' ? '3' : vendor.certification === 'Silver' ? '2' : '1'} onClick={(e) => handleLinkFilterClick(e, () => handleVendorFilter(vendor))}> <span>{vendor.name}</span> </Link> </li> ))} </ol> {certifiedVendors.length > MAX_DISPLAY_COUNT && ( <div className="filters-more-prompt pressable" onClick={() => setShowMoreVendors(prev => !prev)}> <svg aria-hidden="true" className="icon" width={10} height={10} viewBox="0 0 10 10"><path d={showMoreVendors ? "M9.5 6H0.5C0.224 6 0 5.776 0 5.5V4.5C0 4.224 0.224 4 0.5 4H9.5C9.776 4 10 4.224 10 4.5V5.5C10 5.776 9.776 6 9.5 6Z" : "M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"} /></svg> {showMoreVendors ? "Εμφάνιση λιγότερων" : "Εμφάνιση όλων"} </div> )} </div> </div> )}

            </div>
            </aside>
         )}
         {/* END ASIDE FILTERS */}

        <main className="page-products__main">
          {/* Header */}
          {(searchQuery || baseSearchResults.length > 0) && ( // Show header if query exists or showing all products
            <header className="page-header">
              <div className="page-header__title-wrapper">
                <div className="page-header__title-main">
                  <h1>{searchQuery ? `Αποτελέσματα για "${searchQuery}"` : 'Όλα τα προϊόντα'}</h1>
                  <div className="page-header__count-wrapper">
                    <div className="page-header__count">{filteredProducts.length} {filteredProducts.length === 1 ? 'προϊόν' : 'προϊόντα'}</div>
                    <div data-url={`/cat/${currentCategory.id}/${currentCategory.slug}`} data-title={currentCategory.name} data-max-price="0" className="alerts-minimal pressable" onClick={handlePriceAlert}>
                      <svg aria-hidden="true" className="icon" width={20} height={20}><use href="/dist/images/icons/icons.svg#icon-notification-outline-20"></use></svg>
                      <div class="alerts-minimal__label"></div>
                    </div>
                  </div>
                </div>
                 <div className="page-header__title-aside">
                    {displayedBrand && displayedBrand.logo && ( <Link to={`/b/${displayedBrand.id}/${displayedBrand.slug || displayedBrand.name.toLowerCase()}.html`} title={displayedBrand.name} className="page-header__brand"><img src={displayedBrand.logo} alt={`${displayedBrand.name} logo`} height="70" loading="lazy"/></Link> )}
                 </div>
              </div>
              {renderAppliedFilters()}
              {/* Category Slider based on *Filtered* Results */}
              {sliderCategories.length > 0 && (
                  <section className="section">
                    <header className="section__header">
                        <hgroup className="section__hgroup">
                            <h2 className="section__title">Κατηγορίες</h2>
                        </hgroup>
                    </header>
                    <ScrollableSlider>
                        <div className="categories categories--scrollable scroll__content">
                            {sliderCategories.map((item) => (
                                <Link key={item.id} to={`/cat/${item.id}/${item.slug}`} className="categories__category">
                                    <img width="200" height="200" className="categories__image" src={item.image || '/dist/images/cat/placeholder.webp'} alt={`Κατηγορία: ${item.category}`} loading="lazy" />
                                    <h2 className="categories__title">{item.category}</h2>
                                    <div className="categories__cnt">{item.count} {item.count === 1 ? 'προϊόν' : 'προϊόντα'}</div>
                                </Link>
                            ))}
                        </div>
                    </ScrollableSlider>
                  </section>
              )}
              {/* Sorting Tabs */}
              {filteredProducts.length > 0 && (
                <div className="page-header__sorting">
                    <div className="tabs"><div className="tabs-wrapper"><nav>
                      <a href="#" data-type="rating-desc" rel="nofollow" className={sortType === 'rating-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); setSortType('rating-desc'); }}><div className="tabs__content">Δημοφιλέστερα</div></a>
                      <a href="#" data-type="price-asc" rel="nofollow" className={sortType === 'price-asc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); setSortType('price-asc'); }}><div className="tabs__content">Φθηνότερα</div></a>
                      <a href="#" data-type="price-desc" rel="nofollow" className={sortType === 'price-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); setSortType('price-desc'); }}><div className="tabs__content">Ακριβότερα</div></a>
                      <a href="#" data-type="merchants_desc" rel="nofollow" className={sortType === 'merchants_desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); setSortType('merchants_desc'); }}><div className="tabs__content">Αριθμός καταστημάτων</div></a>
                    </nav></div></div>
                </div>
              )}
            </header>
          )}

          {/* Product Grid / No Results Messages */}
          <div className="page-products__main-wrapper">
            {!searchQuery && baseSearchResults.length === 0 && !isAnyFilterActive && <p>Φόρτωση προϊόντων...</p>} {/* Loading all products */}
            {searchQuery && baseSearchResults.length === 0 && <p>Δεν βρέθηκαν προϊόντα για τον όρο "{searchQuery}".</p>} {/* No initial search results */}
            {baseSearchResults.length > 0 && filteredProducts.length === 0 && ( /* Initial results existed, but filters cleared them */
                 <div id="no-results">
                    <h3>Δεν βρέθηκαν προϊόντα {searchQuery ? `για τον όρο "${searchQuery}"` : ''} που να πληρούν τα επιλεγμένα φίλτρα.</h3>
                    <div id="no-results-suggestions">
                         <p><strong>Προτάσεις:</strong></p>
                         <ul>
                             <li>Δοκίμασε να <Link to="#" onClick={(e) => { e.preventDefault(); handleResetFilters(); }}>αφαιρέσεις κάποιο φίλτρο</Link>.</li>
                             {searchQuery && <li>Έλεγξε τον όρο αναζήτησης για τυχόν λάθη κατά την πληκτρολόγηση.</li>}
                             {searchQuery && <li>Δοκίμασε έναν πιο γενικό όρο αναζήτησης.</li>}
                             <li>Επέστρεψε στην <Link to="/">αρχική σελίδα του BestPrice</Link>.</li>
                         </ul>
                     </div>
                 </div>
            )}
            {filteredProducts.length > 0 && (
              <div className="p__products" data-pagination="">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
   };

  // --- Merchant Info Rendering (Conditional on single vendor filter) ---
  const renderMerchantInformation = () => {
    const selectedVendor: Vendor | null = useMemo(() => { if (activeFilters.vendorIds.length === 1) { return vendorIdMap.get(activeFilters.vendorIds[0]) || null; } return null; }, [activeFilters.vendorIds, vendorIdMap]);
    if (!selectedVendor) { return null; }
    const vendor = selectedVendor;
    const removeThisVendorFilter = (e: React.MouseEvent) => { e.preventDefault(); handleVendorFilter(vendor); };
    return ( <div className="information information--center" data-type="merchant-brand"> <div className="root"> <div data-tooltip-no-border="" data-tooltip={`Πληροφορίες για το πιστοποιημένο (${vendor.certification}) κατάστημα ${vendor.name}`}> <div className="merchant-logo"> <Link to={`/m/${vendor.id}/${vendor.name?.toLowerCase()}`}> <img loading="lazy" src={vendor.logo} width={90} height={30} alt={`${vendor.name} logo`} /> </Link> <svg aria-hidden="true" className="icon merchant__certification" width={22} height={22}><use href={`/dist/images/icons/certification.svg#icon-${vendor.certification?.toLowerCase()}-22`}></use></svg> </div> </div> <div className="information__content"> <p>Εμφανίζονται προϊόντα από το κατάστημα <strong><Link to={`/m/${vendor.id}/${vendor.name?.toLowerCase()}`}>{vendor.name}</Link></strong></p> <p><Link to="#" onClick={removeThisVendorFilter}>Αφαίρεση φίλτρου</Link></p> </div> <span><svg aria-hidden="true" className="icon information__close pressable" width={12} height={12} onClick={removeThisVendorFilter}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></span> </div> </div> );
  };

  // --- Main Return Structure ---
  return (
    <>
      {renderMerchantInformation()}
      <div className="root__wrapper search-results__root">
        <div className="root">
           <div id="trail">
               <nav className="breadcrumb">
                   <ol>
                       <li><Link to="/" rel="home"><span>BestPrice</span></Link></li>
                       <li><span className="trail__breadcrumb-separator">›</span><span className="trail__last">{searchQuery ? `Αναζήτηση: "${searchQuery}"` : 'Όλα τα προϊόντα'}</span></li>
                   </ol>
               </nav>
           </div>
           {renderSearchResultsContent()}
           {/* {isPriceAlertModalOpen && ... } */}
        </div>
      </div>
    </>
  );
};

export default SearchResults;
