import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import NotFound from '@/pages/NotFound';
import {
  categories, mainCategories, products as allMockProducts, Category, Product, vendors, brands, PaymentMethod, Vendor, Brand
} from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import PriceAlertModal from '@/components/PriceAlertModal';
import ScrollableSlider from '@/components/ScrollableSlider';
import { useTranslation } from '@/hooks/useTranslation';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';

const MAX_DISPLAY_COUNT = 10;
const DEFAULT_SORT_TYPE = 'rating-desc';

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
}

// Define available category structure (not used for filtering here)
interface AvailableCategory {
    id: number; category: string; slug: string; count: number; image: string | null; parentId: number | null;
}

// Known non-spec URL parameters for THIS page
const RESERVED_PARAMS_CAT = new Set(['brand', 'store', 'deals', 'certified', 'nearby', 'boxnow', 'instock', 'sort']);


const CategoryPage: React.FC = () => {
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
  useHtmlAttributes(classNamesForHtml, 'page-cat');
  useBodyAttributes(classNamesForBody, '');
  // --- End Document Attributes ---

  // --- Precompute Vendor Maps ---
  const vendorIdMap = useMemo(() => new Map(vendors.map(v => [v.id, v])), []);
  const vendorDomainMap = useMemo(() => { const map = new Map<string, Vendor>(); vendors.forEach(v => { const domain = cleanDomainName(v.url).toLowerCase(); if (domain) { map.set(domain, v); } }); return map; }, []);

  // --- State Definitions ---
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [baseCategoryProducts, setBaseCategoryProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [availableBrands, setAvailableBrands] = useState<Record<string, number>>({});
  const [availableSpecs, setAvailableSpecs] = useState<Record<string, Set<string>>>({});
  const [certifiedVendors, setCertifiedVendors] = useState<Vendor[]>([]);
  const [sliderProducts, setSliderProducts] = useState<Product[]>([]);
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const [showMoreSpecs, setShowMoreSpecs] = useState<Record<string, boolean>>({});
  const [showMoreVendors, setShowMoreVendors] = useState(false);
  const [sortType, setSortType] = useState<string>(() => searchParams.get('sort') || DEFAULT_SORT_TYPE);
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState(false);
  const [priceAlertContext, setPriceAlertContext] = useState<{ categoryId: number; categoryName: string; filters: ActiveFiltersState } | null>(null);

  // Helper for case-insensitive key find
  const findOriginalCaseKey = (map: Record<string, any> | Map<string, any>, lowerCaseKey: string): string | undefined => { const mapKeys = map instanceof Map ? Array.from(map.keys()) : Object.keys(map); return mapKeys.find(k => k.toLowerCase() === lowerCaseKey); };
  // Helper for case-insensitive value find
  const findOriginalCaseValue = (set: Set<string> | undefined, lowerCaseValue: string): string | undefined => { if (!set) return undefined; return Array.from(set).find(v => v.toLowerCase() === lowerCaseValue); };

  // Reads URL params directly (lowercase/IDs)
  const getFiltersFromUrl = (): ActiveFiltersState => {
        const params = searchParams;
        const storeDomains = params.get('store')?.toLowerCase().split(',').filter(Boolean) || [];
        const vendorIdsFromUrl = storeDomains.map(domain => vendorDomainMap.get(domain)?.id).filter((id): id is number => id !== undefined);
        const brandsFromUrl = params.get('brand')?.toLowerCase().split(',').filter(Boolean) || [];
        const specsFromUrl = Array.from(params.entries()).reduce((acc, [key, value]) => { const lowerKey = key.toLowerCase(); if (!RESERVED_PARAMS_CAT.has(lowerKey)) { acc[lowerKey] = value.toLowerCase().split(',').filter(Boolean); } return acc; }, {} as Record<string, string[]>);
        return { brands: brandsFromUrl, specs: specsFromUrl, vendorIds: vendorIdsFromUrl, deals: params.get('deals') === '1', certified: params.get('certified') === '1', nearby: params.get('nearby') === '1', boxnow: params.get('boxnow') === '1', instock: params.get('instock') === '1' };
    };

  // Active filters state - Initialize empty, synced via Effect 3
  const [activeFilters, setActiveFilters] = useState<ActiveFiltersState>({ brands: [], specs: {}, vendorIds: [], deals: false, certified: false, nearby: false, boxnow: false, instock: false });

  // --- ** CORRECT LOCATION for shouldShowBrandSort calculation ** ---
  const shouldShowBrandSort = useMemo(() => {
      // Calculate based on currently FILTERED products state
      return new Set(filteredProducts.map(p => p.brand).filter(Boolean)).size > 1;
  }, [filteredProducts]); // Depend on filteredProducts state
  // --- END CORRECT LOCATION ---

  // --- Helper Data & Category Logic ---
  const allCategories = [...mainCategories, ...categories];
  const findCategory = (identifier: string): Category | undefined => allCategories.find(cat => cat.id.toString() === identifier || cat.slug === identifier);
  const defaultCategoryId = mainCategories.length > 0 ? mainCategories[0].id : null;

  // --- URL Sync Function ---
  const updateUrlParams = (filters: ActiveFiltersState, currentSortType: string) => {
    const params = new URLSearchParams(); // Start fresh for category page
    ['brand', 'store', 'deals', 'certified', 'nearby', 'boxnow', 'instock', 'sort'].forEach(p => params.delete(p));
    Array.from(params.keys()).forEach(key => { if (!RESERVED_PARAMS_CAT.has(key.toLowerCase())) params.delete(key); });
    if (filters.brands.length > 0) params.set('brand', filters.brands.map(b => b.toLowerCase()).join(','));
    if (filters.vendorIds.length > 0) { const domains = filters.vendorIds.map(id => vendorIdMap.get(id)?.url).filter((url): url is string => !!url).map(cleanDomainName).map(d => d.toLowerCase()).filter(Boolean); if (domains.length > 0) { params.set('store', domains.join(',')); } }
    Object.entries(filters.specs).forEach(([key, values]) => { if (values.length > 0) { params.set(key.toLowerCase(), values.map(v => v.toLowerCase()).join(',')); } });
    if (filters.deals) params.set('deals', '1');
    if (filters.certified) params.set('certified', '1');
    if (filters.nearby) params.set('nearby', '1');
    if (filters.boxnow) params.set('boxnow', '1');
    if (filters.instock) params.set('instock', '1');
    if (currentSortType !== DEFAULT_SORT_TYPE) { params.set('sort', currentSortType); } else { params.delete('sort'); }
    setSearchParams(params, { replace: true });
  };

  // Effect 1: Load Category Data & Initial Products
  useEffect(() => {
    setCurrentCategory(undefined);
    setBaseCategoryProducts([]);
    setFilteredProducts([]);
    setAvailableBrands({});
    setAvailableSpecs({});
    setCertifiedVendors([]);
    setSliderProducts([]);
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length < 2 || pathSegments[0] !== 'cat') { if (defaultCategoryId !== null) { setCurrentCategory(mainCategories.find(cat => cat.id === defaultCategoryId)); } return; }
    const segments = pathSegments.slice(1);
    const lastSegment = segments[segments.length - 1];
    let matchedCategory = findCategory(lastSegment);
    if (matchedCategory) {
      setCurrentCategory(matchedCategory);
      if (matchedCategory.parentId !== null || !matchedCategory.isMain) {
          const productsForCategory = allMockProducts.filter(p => p.categoryIds?.includes(matchedCategory.id));
          setBaseCategoryProducts(productsForCategory);
          extractAvailableFilters(productsForCategory);
          updateCertifiedVendors(productsForCategory);
          // Let Effect 3 sync state from URL
      }
    } else {
        // Category not found
        // if (defaultCategoryId !== null) { setCurrentCategory(mainCategories.find(cat => cat.id === defaultCategoryId)); }
    }
  }, [location.pathname, defaultCategoryId]);

  // --- Filter Extraction Logic ---
  const extractAvailableFilters = (sourceProducts: Product[]) => {
      const brandsCount: Record<string, number> = {};
      const specs: Record<string, Set<string>> = {};
      sourceProducts.forEach((product) => { if (product.brand) { brandsCount[product.brand] = (brandsCount[product.brand] || 0) + 1; } Object.keys(product.specifications || {}).forEach((specKey) => { const specValue = product.specifications[specKey]; if (specValue != null) { const originalKey = specKey; const originalValue = String(specValue); if (!specs[originalKey]) { specs[originalKey] = new Set(); } specs[originalKey].add(originalValue); } }); });
      setAvailableBrands(brandsCount);
      setAvailableSpecs(specs);
      setShowMoreSpecs(Object.keys(specs).reduce((acc, key) => { acc[key] = false; return acc; }, {} as Record<string, boolean>));
  };
  const updateCertifiedVendors = (sourceProducts: Product[]) => {
      const vendorMap = new Map<number, Vendor>();
      sourceProducts.forEach(product => { (product.prices || []).forEach(price => { const vendor = vendorIdMap.get(price.vendorId); if (vendor && vendor.certification) { vendorMap.set(vendor.id, vendor); } }); });
      const vendorArray = Array.from(vendorMap.values()).sort((a, b) => { const levels: Record<string, number> = { Gold: 3, Silver: 2, Bronze: 1 }; return (levels[b.certification] || 0) - (levels[a.certification] || 0); });
      setCertifiedVendors(vendorArray);
  };
  // Removed extractCategories

  // --- Sorting Logic ---
  const sortProducts = (productsList: Product[]) => {
    const sorted = [...productsList];
    switch (sortType) {
      case 'price-asc': sorted.sort((a, b) => Math.min(...(a.prices || []).filter(p => p.inStock).map(p => p.price), Infinity) - Math.min(...(b.prices || []).filter(p => p.inStock).map(p => p.price), Infinity)); break;
      case 'price-desc': sorted.sort((a, b) => Math.max(...(b.prices || []).filter(p => p.inStock).map(p => p.price), 0) - Math.max(...(a.prices || []).filter(p => p.inStock).map(p => p.price), 0)); break;
      case 'alpha-asc': sorted.sort((a, b) => (a.title || '').localeCompare(b.title || '')); break;
      case 'reviews-desc': sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0)); break;
      case 'brand-asc': sorted.sort((a, b) => (a.brand || '').localeCompare(b.brand || '')); break;
      case 'merchants_desc': sorted.sort((a, b) => (b.prices || []).filter(p => p.inStock).length - (a.prices || []).filter(p => p.inStock).length); break;
      case 'newest-desc': sorted.sort((a, b) => { const dateA = new Date(a.releaseDate || a.dateAdded || 0).getTime(); const dateB = new Date(b.releaseDate || b.dateAdded || 0).getTime(); return dateB - dateA; }); break;
      case 'rating-desc': default: sorted.sort((a, b) => { const rA = a.rating || 0; const rB = b.rating || 0; const revA = a.reviews || 0; const revB = b.reviews || 0; return (rB - rA) || (revB - revA); }); break;
    }
    return sorted;
  };

  // --- Effect 2: Apply Filters and Sorting ---
  useEffect(() => {
    let productsToFilter = [...baseCategoryProducts];
    const currentFilters = activeFilters;
    if (currentFilters.instock) { productsToFilter = productsToFilter.filter(p => (p.prices || []).some(price => price.inStock)); }
    if (currentFilters.deals) { console.warn("Deals Filter Placeholder"); productsToFilter = productsToFilter.filter(p => p.prices.some(price => price.discountPrice && price.discountPrice < price.price)); }
    if (currentFilters.certified) { productsToFilter = productsToFilter.filter(p => (p.prices || []).some(price => vendorIdMap.get(price.vendorId)?.certification)); }
    if (currentFilters.nearby) { console.warn("Nearby Filter Placeholder"); }
    if (currentFilters.boxnow) { productsToFilter = productsToFilter.filter(p => (p.prices || []).some(price => vendorIdMap.get(price.vendorId)?.paymentMethods?.includes(PaymentMethod.PickupVia))); }
    if (currentFilters.brands.length > 0) { const lowerCaseFilterBrands = currentFilters.brands.map(b => b.toLowerCase()); productsToFilter = productsToFilter.filter(p => p.brand && lowerCaseFilterBrands.includes(p.brand.toLowerCase())); }
    if (currentFilters.vendorIds.length > 0) { productsToFilter = productsToFilter.filter(p => (p.prices || []).some(price => currentFilters.vendorIds.includes(price.vendorId))); }
    if (Object.keys(currentFilters.specs).length > 0) { productsToFilter = productsToFilter.filter(p => Object.entries(currentFilters.specs).every(([filterKey, filterValues]) => { if (!filterValues || filterValues.length === 0) return true; const productSpecKey = Object.keys(p.specifications || {}).find(pk => pk.toLowerCase() === filterKey.toLowerCase()); if (!productSpecKey || p.specifications[productSpecKey] === undefined) return false; const productValueLower = String(p.specifications[productSpecKey]).toLowerCase(); const filterValuesLower = filterValues.map(v => v.toLowerCase()); return filterValuesLower.includes(productValueLower); }) ); }

    const sortedAndFiltered = sortProducts(productsToFilter);
    setFilteredProducts(sortedAndFiltered);

    // Update Slider Products
    let sliderData = baseCategoryProducts.filter(p => p.prices.some(pr => pr.discountPrice && pr.discountPrice < pr.price)).slice(0, 10);
    if (sliderData.length === 0) { sliderData = baseCategoryProducts.filter(p => p.isFeatured).slice(0, 10); }
    if (sliderData.length === 0 && baseCategoryProducts.length > 0) { sliderData = [...baseCategoryProducts].sort((a,b) => (b.rating || 0) - (a.rating || 0)).slice(0,10); }
    setSliderProducts(sliderData);

  }, [activeFilters, baseCategoryProducts, sortType, vendorIdMap]);

 // --- Helper Function to Reconcile URL Filters with Available Options ---
 const reconcileFilters = (
      filtersFromUrl: ActiveFiltersState, // Contains lowercase/IDs from URL
      currentAvailableBrands: Record<string, number>, // Original case
      currentAvailableSpecs: Record<string, Set<string>> // Original case keys/values
      ): ActiveFiltersState => {
          const reconciledBrands = filtersFromUrl.brands.map(lb => Object.keys(currentAvailableBrands).find(b => b.toLowerCase() === lb)).filter((b): b is string => b !== undefined);
          const reconciledSpecs = Object.entries(filtersFromUrl.specs).reduce((acc, [lowerKey, lowerValues]) => { const originalKey = Object.keys(currentAvailableSpecs).find(ak => ak.toLowerCase() === lowerKey); if (originalKey) { const originalValues = lowerValues.map(lv => Array.from(currentAvailableSpecs[originalKey] || new Set<string>()).find(av => av.toLowerCase() === lv)).filter((v): v is string => v !== undefined); if (originalValues.length > 0) { acc[originalKey] = originalValues; } } return acc; }, {} as Record<string, string[]>);
          return { ...filtersFromUrl, brands: reconciledBrands, specs: reconciledSpecs };
      };


  // Effect 3: Update activeFilters state AND sortType when URL parameters change OR when available options change
  useEffect(() => {
      // Only run reconciliation if available options have been populated OR category products loaded
      if (Object.keys(availableBrands).length > 0 || Object.keys(availableSpecs).length > 0 || baseCategoryProducts.length > 0) {
        const filtersFromUrl = getFiltersFromUrl(availableSpecs); // Reads URL (lowercase/IDs)
        const reconciledState = reconcileFilters(filtersFromUrl, availableBrands, availableSpecs); // Gets state with original casing

        const sortFromUrl = searchParams.get('sort') || DEFAULT_SORT_TYPE;
        if (sortFromUrl !== sortType) { setSortType(sortFromUrl); }

        if (JSON.stringify(reconciledState) !== JSON.stringify(activeFilters)) {
            setActiveFilters(reconciledState);
        }
      }
  }, [searchParams, availableBrands, availableSpecs, baseCategoryProducts]); // React to URL and available options

  // --- Filter Event Handlers ---
  const handleLinkFilterClick = (event: React.MouseEvent<HTMLAnchorElement>, handler: () => void) => { event.preventDefault(); handler(); };
  const createToggleHandler = (filterKey: keyof Omit<ActiveFiltersState, 'brands' | 'specs' | 'vendorIds'>) => { return () => { const newFilters = { ...activeFilters, [filterKey]: !activeFilters[filterKey] }; setActiveFilters(newFilters); updateUrlParams(newFilters, sortType); }; };
  const handleDealsToggle = createToggleHandler('deals');
  const handleCertifiedToggle = createToggleHandler('certified');
  const handleNearbyToggle = createToggleHandler('nearby');
  const handleBoxnowToggle = createToggleHandler('boxnow');
  const handleInstockToggle = createToggleHandler('instock');
  const handleBrandFilter = (brand: string) => { const currentBrands = activeFilters.brands; const newBrands = currentBrands.includes(brand) ? currentBrands.filter(b => b !== brand) : [...currentBrands, brand]; const newFilters = { ...activeFilters, brands: newBrands }; setActiveFilters(newFilters); updateUrlParams(newFilters, sortType); };
  const handleSpecFilter = (specKey: string, specValue: string) => { const currentSpecs = { ...activeFilters.specs }; const specValues = currentSpecs[specKey] || []; const newSpecValues = specValues.includes(specValue) ? specValues.filter(v => v !== specValue) : [...specValues, specValue]; if (newSpecValues.length === 0) { delete currentSpecs[specKey]; } else { currentSpecs[specKey] = newSpecValues; } const newFilters = { ...activeFilters, specs: currentSpecs }; setActiveFilters(newFilters); updateUrlParams(newFilters, sortType); };
  const handleVendorFilter = (vendor: Vendor) => { const currentVendorIds = activeFilters.vendorIds; const newVendorIds = currentVendorIds.includes(vendor.id) ? currentVendorIds.filter(id => id !== vendor.id) : [...currentVendorIds, vendor.id]; const newFilters = { ...activeFilters, vendorIds: newVendorIds }; setActiveFilters(newFilters); updateUrlParams(newFilters, sortType); };
  const handleResetFilters = () => { const resetState: ActiveFiltersState = { brands: [], specs: {}, vendorIds: [], deals: false, certified: false, nearby: false, boxnow: false, instock: false }; setActiveFilters(resetState); updateUrlParams(resetState, DEFAULT_SORT_TYPE); setSortType(DEFAULT_SORT_TYPE); };

  // Handler for changing sort type
  const handleSortChange = (newSortType: string) => {
      setSortType(newSortType);
      updateUrlParams(activeFilters, newSortType);
  };

  // --- Scroll To Top Effect ---
  const isInitialSyncDone = useRef(false);
  useEffect(() => { const timer = setTimeout(() => { if (isInitialSyncDone.current) { window.scrollTo({ top: 0, behavior: 'smooth' }); } else { isInitialSyncDone.current = true; } }, 100); return () => clearTimeout(timer); }, [activeFilters, sortType]);


  // --- Misc Helper/UI Logic ---
  const displayedBrand = activeFilters.brands.length === 1 ? brands.find(b => b.name === activeFilters.brands[0]) : null;
  const handlePriceAlert = () => { if (!user) { toast({ title: 'Login Required', description: 'Please log in to set a price alert', variant: 'destructive' }); return; } if (currentCategory) { setPriceAlertContext({ categoryId: currentCategory.id, categoryName: currentCategory.name, filters: activeFilters }); setIsPriceAlertModalOpen(true); } else { toast({ title: 'Error', description: 'Cannot set alert, category context is missing.', variant: 'destructive' }); } };

   // --- Rendering Functions ---

  const renderBreadcrumbs = () => {
    const trailItems: React.ReactNode[] = [];
    trailItems.push(<li key="home"><Link to="/" rel="home"><span>BestPrice</span></Link></li>);
    if (currentCategory && currentCategory.parentId !== null && !currentCategory.isMain) {
        const ancestors: Category[] = [];
        let category: Category | undefined = currentCategory;
        while (category && category.parentId !== null) { const parent = allCategories.find((cat) => cat.id === category?.parentId); if (parent) { ancestors.unshift(parent); category = parent; } else { category = undefined; } }
        ancestors.forEach((cat) => { trailItems.push(<li key={cat.id}><Link to={`/cat/${cat.id}/${cat.slug}`}>{cat.name}</Link></li>); });
        trailItems.push(<li key={currentCategory.id}><span>{currentCategory.name}</span></li>);
    } else if (currentCategory && (currentCategory.isMain || currentCategory.parentId === null)) {
         trailItems.push(<li key={currentCategory.id}><span>{currentCategory.name}</span></li>);
    }
    return ( <div id="trail"> <nav className="breadcrumb"><ol>{trailItems.reduce((acc, item, index) => (<React.Fragment key={index}>{acc}{trailItems.length > 1 && index > 0 && <span className="trail__breadcrumb-separator">›</span>}{item}</React.Fragment>), null)}</ol></nav> </div> );
  };

  const renderMainCategories = () => {
    if (!currentCategory || currentCategory.parentId !== null || !currentCategory.isMain) { return null; }
    const mainCat = currentCategory;
    const subcategories = categories.filter(cat => cat.parentId === mainCat.id);
    return (
      <>
        {subcategories.length > 0 && (<div className="page-header"><div className="hgroup"><div className="page-header__title-wrapper"><h1>{mainCat.name}</h1></div></div></div>)}
        <div className="root-category__categories">
          {subcategories.length > 0 ? (subcategories.map((subCat) => (<div key={subCat.id} className="root-category__category"><Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover"><img src={subCat.image || '/dist/images/cat/placeholder.webp'} alt={subCat.name} title={subCat.name} loading="lazy" /></Link><h3 className="root-category__category-title"><Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link></h3><div className="root-category__footer"><div className="root-category__links">{categories.filter(linkedSubCat => linkedSubCat.parentId === subCat.id).slice(0, 5).map((linkedSubCat, index, arr) => (<React.Fragment key={linkedSubCat.id}><Link to={`/cat/${linkedSubCat.id}/${linkedSubCat.slug}`}>{linkedSubCat.name}</Link>{index < arr.length - 1 && ', '}</React.Fragment>))}</div></div></div>))) : (<p>Δεν υπάρχουν υποκατηγορίες για αυτήν την κατηγορία.</p>)}
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
        {childCategories.length > 0 ? (<div className="root-category__categories">{childCategories.map((subCat) => (<div key={subCat.id} className="root-category__category"><Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover"><img src={subCat.image || '/dist/images/cat/placeholder.webp'} alt={subCat.name} title={subCat.name} loading="lazy"/></Link><h3 className="root-category__category-title"><Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link></h3><div className="root-category__footer"><div className="root-category__links">{categories.filter(linkedSubCat => linkedSubCat.parentId === subCat.id).slice(0, 5).map((linkedSubCat, index, arr) => (<React.Fragment key={linkedSubCat.id}><Link to={`/cat/${linkedSubCat.id}/${linkedSubCat.slug}`}>{linkedSubCat.name}</Link>{index < arr.length - 1 && ', '}</React.Fragment>))}</div></div></div>))}</div>) : (renderProducts())}
        <div className="sections"></div>
        <div className="p__products-section">
          <div className="alerts"><button data-url={`/cat/${category.id}/${category.slug}`} data-title={category.name} data-max-price="0" className="alerts__button pressable" onClick={handlePriceAlert}><svg aria-hidden="true" className="icon" width={20} height={20}><use href="/dist/images/icons/icons.svg#icon-notification-outline-20" /></svg><span className="alerts__label">Ειδοποίηση</span></button><div className="alerts__prompt">σε <span className="alerts__title">{category.name}</span></div></div>
        </div>
      </>
    );
  };

  const renderAppliedFilters = () => {
        const { brands, specs, vendorIds, deals, certified, nearby, boxnow, instock } = activeFilters;
        const isAnyFilterActive = brands.length > 0 || Object.values(specs).some(v => v.length > 0) || vendorIds.length > 0 || deals || certified || nearby || boxnow || instock;
        if (!isAnyFilterActive) return null;

        return ( <div className="applied-filters"> {instock && (<h2 className="applied-filters__filter" key="instock"><a className="pressable" onClick={handleInstockToggle} title="Αφαίρεση φίλτρου άμεσα διαθέσιμων προϊόντων"><span className="applied-filters__label">Άμεσα διαθέσιμα</span><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)} {deals && (<h2 className="applied-filters__filter" key="deals"><a className="pressable" onClick={handleDealsToggle} title="Αφαίρεση φίλτρου προσφορών"><span className="applied-filters__label">Προσφορές</span><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)} {certified && (<h2 className="applied-filters__filter" key="certified"><a className="pressable" onClick={handleCertifiedToggle} title="Αφαίρεση φίλτρου πιστοποιημένων καταστημάτων"><span className="applied-filters__label">Πιστοποιημένα καταστήματα</span><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)} {nearby && (<h2 className="applied-filters__filter" key="nearby"><a className="pressable" onClick={handleNearbyToggle} title="Αφαίρεση φίλτρου για καταστήματα κοντά μου"><span className="applied-filters__label">Κοντά μου</span><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)} {boxnow && (<h2 className="applied-filters__filter" key="boxnow"><a className="pressable" onClick={handleBoxnowToggle} title="Αφαίρεση φίλτρου παράδοσης προϊόντων με Box Now"><span className="applied-filters__label">Παράδοση με Box Now</span><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)} {brands.map((brand) => (<h2 className="applied-filters__filter" key={`brand-${brand}`}><a className="pressable" onClick={() => handleBrandFilter(brand)} title={`Αφαίρεση φίλτρου του κατασκευαστή ${brand}`}><span className="applied-filters__label">{brand}</span><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>))} {Object.entries(specs).flatMap(([specKey, specValues]) => specValues.map((specValue) => (<h2 className="applied-filters__filter" key={`spec-${specKey}-${specValue}`}><a className="pressable" onClick={() => handleSpecFilter(specKey, specValue)} title={`Αφαίρεση φίλτρου ${specKey}: ${specValue}`}><span className="applied-filters__label">{`${specKey}: ${specValue}`}</span><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)))} {vendorIds.map((vendorId) => { const vendor = vendorIdMap.get(vendorId); return vendor ? (<h2 className="applied-filters__filter" key={`vendor-${vendor.id}`}><a className="pressable" onClick={() => handleVendorFilter(vendor)} title={`Αφαίρεση φίλτρου από το κατάστημα ${vendor.name}`}><span className="applied-filters__label">{vendor.name}</span><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>) : null; })} <button className="applied-filters__reset pressable" onClick={handleResetFilters} title="Επαναφορά όλων των φίλτρων"><svg aria-hidden="true" className="icon" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-refresh"></use></svg><span>Καθαρισμός όλων</span></button> </div> );
    };

  // Renders the main content area including sidebar and product grid for Category Page
  const renderProducts = () => {
    const { brands: activeBrandFilters, specs: activeSpecFilters, vendorIds: activeVendorIds, ...restActiveFilters } = activeFilters;
    const isAnyFilterActive = activeBrandFilters.length > 0 || Object.values(activeSpecFilters).some(v => v.length > 0) || activeVendorIds.length > 0 || Object.values(restActiveFilters).some(v => v === true);
    const sortedAvailableBrandKeys = useMemo(() => Object.keys(availableBrands).sort(), [availableBrands]);
    const sortedAvailableSpecKeys = useMemo(() => Object.keys(availableSpecs).sort(), [availableSpecs]);
    // ** Calculation moved to component scope **
    // const shouldShowBrandSort = useMemo(() => new Set(filteredProducts.map(p => p.brand).filter(Boolean)).size > 1, [filteredProducts]);

    return (
      <div className="page-products">
         {/* ASIDE FILTERS */}
         {baseCategoryProducts.length > 0 && currentCategory && (
            <aside className="page-products__filters">
            <div id="filters" role="complementary" aria-labelledby="filters-header" data-label={currentCategory.name}>
              <div className="filters__header">
                <h3 className="filters__header-title filters__header-title--filters">Φίλτρα</h3>
                {isAnyFilterActive && ( <Link to="#" onClick={(e) => handleLinkFilterClick(e, handleResetFilters)} className="pressable filters__header-remove popup-anchor" data-tooltip="Αφαίρεση όλων των φίλτρων" data-tooltip-no-border="" data-tooltip-small="true">Καθαρισμός</Link> )}
              </div>

              {/* "Εμφάνιση μόνο" Section */}
              <div className="filter-limit default-list" data-filter-name="limit" data-filter-id data-type data-key="limit">
                 <div className="filter__header"><h4>Εμφάνιση μόνο</h4></div>
                 <div className="filter-container"> <ol>
                    <li data-filter="deals" className={`pressable ${activeFilters.deals ? 'selected' : ''}`}><Link to="#" title="Προσφορές" rel="nofollow" onClick={(e) => handleLinkFilterClick(e, handleDealsToggle)}><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-flame-16"></use></svg><span>Προσφορές</span></Link></li>
                    <li data-filter="certified" className={`pressable ${activeFilters.certified ? 'selected' : ''}`}><Link to="#" title="Πιστοποιημένα καταστήματα" rel="nofollow" onClick={(e) => handleLinkFilterClick(e, handleCertifiedToggle)}><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-certified-16"></use></svg><span>Πιστοποιημένα</span></Link></li>
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
                       {sortedAvailableBrandKeys.length > MAX_DISPLAY_COUNT && ( <div className="filters-more-prompt pressable" onClick={() => setShowMoreBrands(prev => !prev)} title={showMoreBrands ? "Λιγότεροι κατασκευαστές" : "Όλοι οι κατασκευαστές"}> <svg aria-hidden="true" className="icon" width={10} height={10} viewBox="0 0 10 10"><path fillRule="evenodd" d={showMoreBrands ? "M9.5 6H0.5C0.224 6 0 5.776 0 5.5V4.5C0 4.224 0.224 4 0.5 4H9.5C9.776 4 10 4.224 10 4.5V5.5C10 5.776 9.776 6 9.5 6Z" : "M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"} /></svg> {showMoreBrands ? "Εμφάνιση λιγότερων" : "Εμφάνιση όλων"} </div> )}
                    </div>
                 </div>
              )}

              {/* Specs Filters with Show More */}
               {sortedAvailableSpecKeys.length > 0 && ( sortedAvailableSpecKeys.map((specKey) => { const specValuesSet = availableSpecs[specKey]; const specValuesArray = Array.from(specValuesSet).sort(); const isExpanded = showMoreSpecs[specKey] || false; if (specValuesArray.length === 0) return null; return ( <div key={specKey} className={`filter-${specKey.toLowerCase()} default-list`} data-filter-name={specKey.toLowerCase()} data-key={specKey.toLowerCase()}> <div className="filter__header"><h4>{specKey}</h4></div> <div className="filter-container"> <ol aria-expanded={isExpanded}> {specValuesArray.slice(0, isExpanded ? specValuesArray.length : MAX_DISPLAY_COUNT).map((specValue) => ( <li key={specValue} className={`pressable ${activeFilters.specs[specKey]?.includes(specValue) ? 'selected' : ''}`} onClick={() => handleSpecFilter(specKey, specValue)}> <span>{specValue}</span> </li> ))} </ol> {specValuesArray.length > MAX_DISPLAY_COUNT && ( <div className="filters-more-prompt pressable" onClick={() => setShowMoreSpecs(prev => ({...prev, [specKey]: !prev[specKey]}))} title={isExpanded ? `Λιγότερες επιλογές ${specKey}` : `Όλες οι επιλογές ${specKey}`}> <svg aria-hidden="true" className="icon" width={10} height={10} viewBox="0 0 10 10"><path fillRule="evenodd" d={isExpanded ? "M9.5 6H0.5C0.224 6 0 5.776 0 5.5V4.5C0 4.224 0.224 4 0.5 4H9.5C9.776 4 10 4.224 10 4.5V5.5C10 5.776 9.776 6 9.5 6Z" : "M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"} /></svg> {isExpanded ? "Εμφάνιση λιγότερων" : "Εμφάνιση όλων"} </div> )} </div> </div> ) }) )}

              {/* Certified Vendors Filter with Show More */}
              {certifiedVendors.length > 0 && ( <div className="filter-store filter-collapsed default-list" data-filter-name="Πιστοποιημένα καταστήματα" data-filter-id="store" data-type="store" data-key="store"> <div className="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div> <div className="filter-container"> <ol aria-expanded={showMoreVendors}> {certifiedVendors.slice(0, showMoreVendors ? certifiedVendors.length : MAX_DISPLAY_COUNT).map(vendor => ( <li key={vendor.id} title={`Το κατάστημα ${vendor.name} (${cleanDomainName(vendor.url)}) διαθέτει ${vendor.certification} πιστοποίηση`} className={`pressable ${activeFilters.vendorIds.includes(vendor.id) ? 'selected' : ''}`}> <Link to="#" data-l={vendor.certification === 'Gold' ? '3' : vendor.certification === 'Silver' ? '2' : '1'} onClick={(e) => handleLinkFilterClick(e, () => handleVendorFilter(vendor))}> <span>{vendor.name}</span> </Link> </li> ))} </ol> {certifiedVendors.length > MAX_DISPLAY_COUNT && ( <div className="filters-more-prompt pressable" onClick={() => setShowMoreVendors(prev => !prev)}> <svg aria-hidden="true" className="icon" width={10} height={10} viewBox="0 0 10 10"><path fillRule="evenodd" d={showMoreVendors ? "M9.5 6H0.5C0.224 6 0 5.776 0 5.5V4.5C0 4.224 0.224 4 0.5 4H9.5C9.776 4 10 4.224 10 4.5V5.5C10 5.776 9.776 6 9.5 6Z" : "M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"} /></svg> {showMoreVendors ? "Εμφάνιση λιγότερων" : "Εμφάνιση όλων"} </div> )} </div> </div> )}

            </div>
            </aside>
         )}
         {/* END ASIDE FILTERS */}

        <main className="page-products__main">
          {/* Header */}
          {filteredProducts.length > 0 && currentCategory && ( // Use filteredProducts length for header visibility
            <header className="page-header">
              <div className="page-header__title-wrapper">
                <div className="page-header__title-main">
                  <h1>{currentCategory.name}</h1>
                  <div className="page-header__count-wrapper">
                    <div className="page-header__count">{filteredProducts.length} {filteredProducts.length === 1 ? 'προϊόν' : 'προϊόντα'}</div>
                    {/* Price alert trigger */}
                    {(isAnyFilterActive || baseCategoryProducts.length > 0) && filteredProducts.length > 0 && (
                      <div data-url={location.pathname + location.search} data-title={currentCategory.name} data-max-price="0" className="alerts-minimal pressable" onClick={handlePriceAlert}>
                          <svg aria-hidden="true" className="icon" width={20} height={20}><use href="/dist/images/icons/icons.svg#icon-notification-outline-20"></use></svg>
                          <div className="alerts-minimal__label"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="page-header__title-aside">
                  {displayedBrand && displayedBrand.logo && ( <Link to={`/b/${displayedBrand.id}/${displayedBrand.slug || displayedBrand.name.toLowerCase()}.html`} title={displayedBrand.name} className="page-header__brand"><img src={displayedBrand.logo} alt={`${displayedBrand.name} logo`} height="70" loading="lazy"/></Link> )}
                </div>
              </div>
              {renderAppliedFilters()}
              {/* Product Slider Section */}
              {sliderProducts.length > 0 && (
                  <section className="section">
                    <header className="section__header">
                        <hgroup className="section__hgroup">
                            <h2 className="section__title">{activeFilters.deals ? 'Προσφορές στην Κατηγορία' : 'Δημοφιλή στην Κατηγορία'}</h2>
                        </hgroup>
                    </header>
                    <ScrollableSlider>
                        {sliderProducts.map(prod => ( <ProductCard key={`slider-${prod.id}`} product={prod} /> ))}
                    </ScrollableSlider>
                  </section>
              )}
              {/* Sorting Tabs */}
              {filteredProducts.length > 0 && (
                // ** REMOVED STICKY wrapper, refs and classes **
                <div className="page-header__sorting">
                    <div className="tabs"><div className="tabs-wrapper"><nav>
                      <a href="#" data-type="rating-desc" rel="nofollow" className={sortType === 'rating-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('rating-desc'); }}><div className="tabs__content">Δημοφιλέστερα</div></a>
                      <a href="#" data-type="newest-desc" rel="nofollow" className={sortType === 'newest-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('newest-desc'); }}><div className="tabs__content">Νεότερα</div></a>
                      <a href="#" data-type="price-asc" rel="nofollow" className={sortType === 'price-asc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('price-asc'); }}><div className="tabs__content">Φθηνότερα</div></a>
                      <a href="#" data-type="price-desc" rel="nofollow" className={sortType === 'price-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('price-desc'); }}><div className="tabs__content">Ακριβότερα</div></a>
                      <a href="#" data-type="alpha-asc" rel="nofollow" className={sortType === 'alpha-asc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('alpha-asc'); }}><div className="tabs__content">Αλφαβητικά</div></a>
                      <a href="#" data-type="reviews-desc" rel="nofollow" className={sortType === 'reviews-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('reviews-desc'); }}><div className="tabs__content">Περισσότερες Αξιολογήσεις</div></a>
                      {shouldShowBrandSort && ( <a href="#" data-type="brand-asc" rel="nofollow" className={sortType === 'brand-asc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('brand-asc'); }}><div className="tabs__content">Ανά κατασκευαστή</div></a> )}
                      <a href="#" data-type="merchants_desc" rel="nofollow" className={sortType === 'merchants_desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('merchants_desc'); }}><div className="tabs__content">Αριθμός Καταστημάτων</div></a>
                    </nav></div></div>
                </div>
              )}
            </header>
          )}

          {/* Product Grid */}
          <div className="page-products__main-wrapper">
            {filteredProducts.length > 0 ? (
              <div className="p__products" data-pagination="">
                {filteredProducts.map((product) => ( <ProductCard key={product.id} product={product} /> ))}
              </div>
            ) : (
              currentCategory && !currentCategory.isMain ? (
                  baseCategoryProducts.length > 0 ? (
                      <div id="no-results">
                          <h3>Δεν βρέθηκαν προϊόντα στην κατηγορία <strong>{currentCategory.name}</strong> που να πληρούν τις επιλογές αναζήτησης.</h3>
                          <div id="no-results-suggestions">
                              <p><strong>Προτάσεις:</strong></p>
                              <ul>
                                  <li>Δες <Link to={`/cat/${currentCategory.id}/${currentCategory.slug}`} onClick={(e) => { e.preventDefault(); handleResetFilters(); /* Consider navigation if needed */ history.pushState({}, '', `/cat/${currentCategory.id}/${currentCategory.slug}`); }}>όλα τα προϊόντα της κατηγορίας</Link>.</li>
                                  <li>Δοκίμασε να <Link to="#" onClick={(e) => { e.preventDefault(); handleResetFilters(); }}>αφαιρέσεις κάποιο φίλτρο</Link>.</li>
                                  <li>Επέστρεψε στην <Link to="/">αρχική σελίδα του BestPrice</Link>.</li>
                              </ul>
                          </div>
                      </div>
                  ) : ( <p>Δεν υπάρχουν προϊόντα για αυτήν την κατηγορία.</p> )
              ) : null
            )}
          </div>
        </main>
      </div>
    );
   };

  // --- Merchant Info Rendering ---
  const renderMerchantInformation = () => {
    const selectedVendor: Vendor | null = useMemo(() => { if (activeFilters.vendorIds.length === 1) { return vendorIdMap.get(activeFilters.vendorIds[0]) || null; } return null; }, [activeFilters.vendorIds, vendorIdMap]);
    if (!selectedVendor) { return null; }
    const vendor = selectedVendor;
    const removeThisVendorFilter = (e: React.MouseEvent) => { e.preventDefault(); handleVendorFilter(vendor); };
    return ( <div className="root__wrapper information information--center" data-type="merchant-brand"> <div className="root"> <div data-tooltip-no-border="" data-tooltip={`Πληροφορίες για το πιστοποιημένο (${vendor.certification}) κατάστημα ${vendor.name}`}> <div className="merchant-logo"> <Link to={`/m/${vendor.id}/${vendor.name?.toLowerCase()}`}> <img loading="lazy" src={vendor.logo} width={90} height={30} alt={`${vendor.name} logo`} /> </Link> <svg aria-hidden="true" className="icon merchant__certification" width={22} height={22}><use href={`/dist/images/icons/certification.svg#icon-${vendor.certification?.toLowerCase()}-22`}></use></svg> </div> </div> <div className="information__content"> <p>Εμφανίζονται προϊόντα από το κατάστημα <strong><Link to={`/m/${vendor.id}/${vendor.name?.toLowerCase()}`}>{vendor.name}</Link></strong></p> <p><Link to="#" onClick={removeThisVendorFilter}>Αφαίρεση φίλτρου</Link></p> </div> <span><svg aria-hidden="true" className="icon information__close pressable" width={12} height={12} onClick={removeThisVendorFilter}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></span> </div> </div> );
  };

  // --- Main Return Structure ---
  // Show NotFound if category wasn't matched after initial load attempt
  if (location.pathname.startsWith('/cat/') && !currentCategory && defaultCategoryId === null) { // Only show NotFound if no category AND no default exists
      return <NotFound />;
  }

  return (
    <>
      {renderMerchantInformation()}
      <div className="root__wrapper root-category__root">
        <div className="root">
          {renderBreadcrumbs()}
          {renderMainCategories()}
          {currentCategory && (currentCategory.parentId !== null && !currentCategory.isMain) && renderSubcategories(currentCategory)}
          {/* Price Alert Modal */}
           {isPriceAlertModalOpen && priceAlertContext && currentCategory && (
               <PriceAlertModal isOpen={isPriceAlertModalOpen} onClose={() => setIsPriceAlertModalOpen(false)} alertType="category" categoryId={priceAlertContext.categoryId} categoryName={priceAlertContext.categoryName} categoryFilters={priceAlertContext.filters} />
           )}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
