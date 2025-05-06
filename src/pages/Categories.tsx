import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products as allMockProducts, Category, Product, vendors, brands, PaymentMethod, Vendor, Brand } from '@/data/mockData';
import ProductCard from '@/components/ProductCard'; // Assuming ProductCard accepts the prop
import InlineProductItem from '@/components/InlineProductItem';
import PriceAlertModal from '@/components/PriceAlertModal';
import ScrollableSlider from '@/components/ScrollableSlider';
import { useTranslation } from '@/hooks/useTranslation';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';

const MAX_DISPLAY_COUNT = 10;
const DEFAULT_SORT_TYPE = 'rating-desc';

// Helper to clean domain name
const cleanDomainName = (url: string): string => {
  if (!url) return '';
  try {
    const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`);
    return parsedUrl.hostname.replace(/^www\./i, '');
  } catch (e) {
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
  }
};

// Define the structure for active filters state accurately
interface ActiveFiltersState {
  brands: string[];
  specs: Record<string, string[]>;
  vendorIds: number[]; // Will typically hold 0 or 1 ID when using certified filter
  deals: boolean;
  certified: boolean;
  nearby: boolean;
  boxnow: boolean;
  instock: boolean;
}

// Known non-spec URL parameters for THIS page
const RESERVED_PARAMS_CAT = new Set(['brand', 'store', 'deals', 'certified', 'nearby', 'boxnow', 'instock', 'sort']);

// *** RENAMED Component ***
const Categories: React.FC = () => {
  // --- Hooks & Initial Setup ---
  const location = useLocation();
  const navigate = useNavigate();
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

  // --- Active Filters State ---
  const [activeFilters, setActiveFilters] = useState<ActiveFiltersState>({ brands: [], specs: {}, vendorIds: [], deals: false, certified: false, nearby: false, boxnow: false, instock: false });

  // --- Derived State & Calculations ---
  const shouldShowBrandSort = useMemo(() => new Set(filteredProducts.map(p => p.brand).filter(Boolean)).size > 1, [filteredProducts]);
  const sortedAvailableBrandKeys = useMemo(() => Object.keys(availableBrands).sort(), [availableBrands]);
  const sortedAvailableSpecKeys = useMemo(() => Object.keys(availableSpecs).sort(), [availableSpecs]);
  const selectedVendor: Vendor | null = useMemo(() => { return activeFilters.vendorIds.length === 1 ? (vendorIdMap.get(activeFilters.vendorIds[0]) || null) : null; }, [activeFilters.vendorIds, vendorIdMap]);
  const activeVendorDomainForProductLink: string | null = useMemo(() => { return selectedVendor ? cleanDomainName(selectedVendor.url).toLowerCase() : null; }, [selectedVendor]);
  const isSingleVendorSelected = useMemo(() => activeFilters.vendorIds.length === 1, [activeFilters.vendorIds]);
  const singleSelectedVendorId = useMemo(() => isSingleVendorSelected ? activeFilters.vendorIds[0] : null, [isSingleVendorSelected, activeFilters.vendorIds]);

  // --- Helper Data & Category Logic ---
  const allCategories = [...mainCategories, ...categories];
  const findCategory = (identifier: string): Category | undefined => allCategories.find(cat => cat.id.toString() === identifier || cat.slug === identifier);
  const defaultCategoryId = mainCategories.length > 0 ? mainCategories[0].id : null;

  // Reads URL params directly (lowercase/IDs)
  const getFiltersFromUrl = (currentAvailableSpecs: Record<string, Set<string>>): ActiveFiltersState => {
    const params = searchParams;
    const storeDomains = params.get('store')?.toLowerCase().split(',').filter(Boolean) || [];
    const vendorIdsFromUrl = storeDomains.map(domain => vendorDomainMap.get(domain)?.id).filter((id): id is number => id !== undefined);
    const brandsFromUrl = params.get('brand')?.toLowerCase().split(',').filter(Boolean) || [];
    const specsFromUrl = Array.from(params.entries()).reduce((acc, [key, value]) => {
      const lowerKey = key.toLowerCase();
      if (!RESERVED_PARAMS_CAT.has(lowerKey)) {
        const originalKey = Object.keys(currentAvailableSpecs).find(ak => ak.toLowerCase() === lowerKey);
        if (originalKey) acc[originalKey] = value.toLowerCase().split(',').filter(Boolean);
      }
      return acc;
    }, {} as Record<string, string[]>);
    const finalVendorIds = vendorIdsFromUrl.length > 1 ? [vendorIdsFromUrl[0]] : vendorIdsFromUrl;
    return {
      brands: brandsFromUrl,
      specs: specsFromUrl,
      vendorIds: finalVendorIds,
      deals: params.get('deals') === '1',
      certified: params.get('certified') === '1',
      nearby: params.get('nearby') === '1',
      boxnow: params.get('boxnow') === '1',
      instock: params.get('instock') === '1'
    };
  };

  // --- URL Sync Function ---
  const updateUrlParams = (filters: ActiveFiltersState, currentSortType: string) => {
    const params = new URLSearchParams(searchParams);
    RESERVED_PARAMS_CAT.forEach(p => params.delete(p));
    Object.keys(activeFilters.specs).forEach(key => params.delete(key.toLowerCase()));
    Array.from(params.keys()).forEach(key => { if (!RESERVED_PARAMS_CAT.has(key.toLowerCase()) && !Object.keys(availableSpecs).some(specKey => specKey.toLowerCase() === key.toLowerCase())) params.delete(key); });
    if (filters.brands.length > 0) params.set('brand', filters.brands.map(b => b.toLowerCase()).join(','));
    if (filters.vendorIds.length > 0) { const domain = vendorIdMap.get(filters.vendorIds[0])?.url; if (domain) params.set('store', cleanDomainName(domain).toLowerCase()); }
    Object.entries(filters.specs).forEach(([key, values]) => { if (values.length > 0) params.set(key.toLowerCase(), values.map(v => v.toLowerCase()).join(',')); });
    if (filters.deals) params.set('deals', '1'); else params.delete('deals');
    if (filters.certified) params.set('certified', '1'); else params.delete('certified');
    if (filters.nearby) params.set('nearby', '1'); else params.delete('nearby');
    if (filters.boxnow) params.set('boxnow', '1'); else params.delete('boxnow');
    if (filters.instock) params.set('instock', '1'); else params.delete('instock');
    if (currentSortType !== DEFAULT_SORT_TYPE) params.set('sort', currentSortType); else params.delete('sort');
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
    setShowMoreBrands(false);
    setShowMoreSpecs({});
    setShowMoreVendors(false);
    const pathSegments = location.pathname.split('/').filter(Boolean);
    let matchedCategory: Category | undefined;
    if (pathSegments.length >= 2 && pathSegments[0] === 'cat') { const lastSegment = pathSegments[pathSegments.length - 1]; matchedCategory = findCategory(lastSegment); }
    else if (defaultCategoryId !== null) { matchedCategory = mainCategories.find(cat => cat.id === defaultCategoryId); }
    if (matchedCategory) {
      setCurrentCategory(matchedCategory);
      if (!matchedCategory.isMain) {
        const productsForCategory = allMockProducts.filter(p => p.categoryIds?.includes(matchedCategory.id));
        setBaseCategoryProducts(productsForCategory);
        extractAvailableFilters(productsForCategory);
        updateCertifiedVendors(productsForCategory);
      }
    } else { setCurrentCategory(undefined); }
  }, [location.pathname, defaultCategoryId]);

  // --- Filter Extraction Logic ---
  const extractAvailableFilters = (sourceProducts: Product[]) => {
    const brandsCount: Record<string, number> = {};
    const specs: Record<string, Set<string>> = {};
    sourceProducts.forEach((product) => {
      if (product.brand) brandsCount[product.brand] = (brandsCount[product.brand] || 0) + 1;
      Object.entries(product.specifications || {}).forEach(([specKey, specValue]) => {
        if (specValue != null && String(specValue).trim() !== '') { if (!specs[specKey]) specs[specKey] = new Set(); specs[specKey].add(String(specValue)); }
      });
    });
    setAvailableBrands(brandsCount);
    setAvailableSpecs(specs);
    setShowMoreSpecs(Object.keys(specs).reduce((acc, key) => { acc[key] = false; return acc; }, {} as Record<string, boolean>));
  };
  const updateCertifiedVendors = (sourceProducts: Product[]) => {
    const vendorMap = new Map<number, Vendor>();
    sourceProducts.forEach(product => { (product.prices || []).forEach(price => { const vendor = vendorIdMap.get(price.vendorId); if (vendor?.certification) vendorMap.set(vendor.id, vendor); }); });
    const vendorArray = Array.from(vendorMap.values()).sort((a, b) => { const levels: Record<string, number> = { Gold: 3, Silver: 2, Bronze: 1 }; return (levels[b.certification!] || 0) - (levels[a.certification!] || 0); });
    setCertifiedVendors(vendorArray);
  };

  // --- Sorting Logic ---
  const sortProducts = (productsList: Product[]) => {
    const sorted = [...productsList];
    const getPrice = (p: ProductPrice) => p.discountPrice || p.price;
    const getMinPrice = (prod: Product) => Math.min(...(prod.prices || []).filter(p => p.inStock).map(getPrice), Infinity);
    const getMaxPrice = (prod: Product) => Math.max(...(prod.prices || []).filter(p => p.inStock).map(getPrice), 0);
    const getStockCount = (prod: Product) => (prod.prices || []).filter(p => p.inStock).length;
    const getDate = (prod: Product) => new Date(prod.releaseDate || prod.dateAdded || 0).getTime();
    const getRating = (prod: Product) => ({ r: prod.rating || 0, rev: prod.reviews || 0 });
    switch (sortType) {
      case 'price-asc': sorted.sort((a, b) => getMinPrice(a) - getMinPrice(b)); break;
      case 'price-desc': sorted.sort((a, b) => getMaxPrice(b) - getMaxPrice(a)); break;
      case 'alpha-asc': sorted.sort((a, b) => (a.title || '').localeCompare(b.title || '')); break;
      case 'reviews-desc': sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0)); break;
      case 'brand-asc': sorted.sort((a, b) => (a.brand || '').localeCompare(b.brand || '')); break;
      case 'merchants_desc': sorted.sort((a, b) => getStockCount(b) - getStockCount(a)); break;
      case 'newest-desc': sorted.sort((a, b) => getDate(b) - getDate(a)); break;
      case 'rating-desc': default: sorted.sort((a, b) => { const ra = getRating(a); const rb = getRating(b); return (rb.r - ra.r) || (rb.rev - ra.rev); }); break;
    }
    return sorted;
  };

  // --- Effect 2: Apply Filters and Sorting ---
  useEffect(() => {
    let productsToFilter = [...baseCategoryProducts];
    const currentFilters = activeFilters;
    if (currentFilters.instock) productsToFilter = productsToFilter.filter(p => (p.prices || []).some(pr => pr.inStock));
    if (currentFilters.deals) productsToFilter = productsToFilter.filter(p => (p.prices || []).some(pr => pr.discountPrice && pr.discountPrice < pr.price));
    if (currentFilters.certified) productsToFilter = productsToFilter.filter(p => (p.prices || []).some(pr => vendorIdMap.get(pr.vendorId)?.certification));
    if (currentFilters.nearby) console.warn("Nearby Filter Placeholder");
    if (currentFilters.boxnow) productsToFilter = productsToFilter.filter(p => (p.prices || []).some(pr => vendorIdMap.get(pr.vendorId)?.paymentMethods?.includes(PaymentMethod.PickupVia)));
    if (currentFilters.brands.length > 0) { const lowerBrands = currentFilters.brands.map(b => b.toLowerCase()); productsToFilter = productsToFilter.filter(p => p.brand && lowerBrands.includes(p.brand.toLowerCase())); }
    if (currentFilters.vendorIds.length > 0) productsToFilter = productsToFilter.filter(p => (p.prices || []).some(pr => currentFilters.vendorIds.includes(pr.vendorId)));
    if (Object.keys(currentFilters.specs).length > 0) {
      productsToFilter = productsToFilter.filter(p =>
        Object.entries(currentFilters.specs).every(([fKey, fVals]) => {
          if (!fVals || fVals.length === 0) return true;
          const pKey = Object.keys(p.specifications || {}).find(pk => pk.toLowerCase() === fKey.toLowerCase());
          if (!pKey || p.specifications[pKey] == null) return false;
          const pValLower = String(p.specifications[pKey]).toLowerCase();
          const fValsLower = fVals.map(v => v.toLowerCase());
          return fValsLower.includes(pValLower);
        })
      );
    }
    const sortedAndFiltered = sortProducts(productsToFilter);
    setFilteredProducts(sortedAndFiltered);
    let sliderData = baseCategoryProducts.filter(p => p.prices.some(pr => pr.discountPrice && pr.discountPrice < pr.price)).slice(0, 10);
    if (sliderData.length === 0) sliderData = baseCategoryProducts.filter(p => p.isFeatured).slice(0, 10);
    if (sliderData.length === 0 && baseCategoryProducts.length > 0) sliderData = [...baseCategoryProducts].sort((a,b) => (b.rating || 0) - (a.rating || 0)).slice(0,10);
    setSliderProducts(sliderData);
  }, [activeFilters, baseCategoryProducts, sortType, vendorIdMap]);

  // --- Filter Reconciliation ---
  const reconcileFilters = (
    filtersFromUrl: ActiveFiltersState,
    currentAvailableBrands: Record<string, number>,
    currentAvailableSpecs: Record<string, Set<string>>
  ): ActiveFiltersState => {
    const reconciledBrands = filtersFromUrl.brands.map(lb => Object.keys(currentAvailableBrands).find(b => b.toLowerCase() === lb)).filter((b): b is string => !!b);
    const reconciledSpecs = Object.entries(filtersFromUrl.specs).reduce((acc, [keyFromUrl, valsFromUrl]) => {
      const originalKey = Object.keys(currentAvailableSpecs).find(ak => ak.toLowerCase() === keyFromUrl.toLowerCase());
      if (originalKey) {
        const availableValuesSet = currentAvailableSpecs[originalKey];
        if (availableValuesSet) {
          const originalValues = valsFromUrl.map(lv => Array.from(availableValuesSet).find(av => av.toLowerCase() === lv)).filter((v): v is string => !!v);
          if (originalValues.length > 0) acc[originalKey] = originalValues;
        }
      }
      return acc;
    }, {} as Record<string, string[]>);
    return { ...filtersFromUrl, brands: reconciledBrands, specs: reconciledSpecs, };
  };

  // Effect 3: Sync State from URL & Available Options
  useEffect(() => {
    const shouldSync = (currentCategory && !currentCategory.isMain) || Object.keys(availableBrands).length > 0 || Object.keys(availableSpecs).length > 0;
    if (shouldSync) {
      const filtersFromUrl = getFiltersFromUrl(availableSpecs);
      const reconciledState = reconcileFilters(filtersFromUrl, availableBrands, availableSpecs);
      const sortFromUrl = searchParams.get('sort') || DEFAULT_SORT_TYPE;
      let stateChanged = false;
      if (sortFromUrl !== sortType) setSortType(sortFromUrl);
      if (JSON.stringify(reconciledState) !== JSON.stringify(activeFilters)) { setActiveFilters(reconciledState); stateChanged = true; }
      if (stateChanged && JSON.stringify(filtersFromUrl) !== JSON.stringify(reconciledState)) { updateUrlParams(reconciledState, sortFromUrl); }
    }
  }, [searchParams, availableBrands, availableSpecs, currentCategory]);

  // --- Filter Event Handlers ---
  const handleLinkFilterClick = (event: React.MouseEvent<HTMLAnchorElement>, handler: () => void) => { event.preventDefault(); handler(); };
  const createToggleHandler = (filterKey: keyof Omit<ActiveFiltersState, 'brands' | 'specs' | 'vendorIds'>) => {
    return () => { const newFilters = { ...activeFilters, [filterKey]: !activeFilters[filterKey] }; setActiveFilters(newFilters); updateUrlParams(newFilters, sortType); };
  };
  const handleDealsToggle = createToggleHandler('deals');
  const handleCertifiedToggle = createToggleHandler('certified');
  const handleNearbyToggle = createToggleHandler('nearby');
  const handleBoxnowToggle = createToggleHandler('boxnow');
  const handleInstockToggle = createToggleHandler('instock');
  const handleBrandFilter = (brand: string) => {
    const currentBrands = activeFilters.brands; const newBrands = currentBrands.includes(brand) ? currentBrands.filter(b => b !== brand) : [...currentBrands, brand]; const newFilters = { ...activeFilters, brands: newBrands }; setActiveFilters(newFilters); updateUrlParams(newFilters, sortType);
  };
  const handleSpecFilter = (specKey: string, specValue: string) => {
    const currentSpecs = { ...activeFilters.specs }; const specValues = currentSpecs[specKey] || []; const newSpecValues = specValues.includes(specValue) ? specValues.filter(v => v !== specValue) : [...specValues, specValue]; if (newSpecValues.length === 0) delete currentSpecs[specKey]; else currentSpecs[specKey] = newSpecValues; const newFilters = { ...activeFilters, specs: currentSpecs }; setActiveFilters(newFilters); updateUrlParams(newFilters, sortType);
  };
  const handleMultiVendorToggle = (vendor: Vendor) => { // Used by MerchantInfo & AppliedFilters (though vendor chip removed from applied)
    const newFilters = { ...activeFilters, vendorIds: [] }; setActiveFilters(newFilters); updateUrlParams(newFilters, sortType);
  };
  const handleCertifiedVendorSelect = (vendor: Vendor) => { // Used by Certified Vendor List
    const currentVendorIds = activeFilters.vendorIds; const newVendorIds = (currentVendorIds.length === 1 && currentVendorIds[0] === vendor.id) ? [] : [vendor.id]; const newFilters = { ...activeFilters, vendorIds: newVendorIds }; setActiveFilters(newFilters); updateUrlParams(newFilters, sortType);
  };
  const handleResetFilters = () => {
    const resetState: ActiveFiltersState = { brands: [], specs: {}, vendorIds: [], deals: false, certified: false, nearby: false, boxnow: false, instock: false }; setActiveFilters(resetState); setSortType(DEFAULT_SORT_TYPE); updateUrlParams(resetState, DEFAULT_SORT_TYPE);
  };
  const handleSortChange = (newSortType: string) => { if (newSortType !== sortType) { setSortType(newSortType); updateUrlParams(activeFilters, newSortType); } };

  // --- Scroll To Top Effect ---
  const isInitialLoad = useRef(true);
  useEffect(() => { if (isInitialLoad.current) { isInitialLoad.current = false; return; } const timer = setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 100); return () => clearTimeout(timer); }, [activeFilters, sortType]);

  // --- Misc Helper/UI Logic ---
  const displayedBrand = useMemo(() => activeFilters.brands.length === 1 ? brands.find(b => b.name === activeFilters.brands[0]) : null, [activeFilters.brands]);
  const handlePriceAlert = () => { if (!user) { toast({ title: 'Login Required', description: 'Please log in to set a price alert', variant: 'destructive' }); return; } if (currentCategory) { setPriceAlertContext({ categoryId: currentCategory.id, categoryName: currentCategory.name, filters: activeFilters }); setIsPriceAlertModalOpen(true); } else { toast({ title: 'Error', description: 'Cannot set alert, category context is missing.', variant: 'destructive' }); } };

  // --- Rendering Functions ---
  const renderBreadcrumbs = () => {
    const trailItems: React.ReactNode[] = []; trailItems.push(<li key="home"><Link to="/" rel="home"><span>BestPrice</span></Link></li>);
    if (currentCategory) { const ancestors: Category[] = []; let category: Category | undefined = currentCategory; while (category?.parentId !== null && category?.parentId !== undefined) { const parent = allCategories.find((cat) => cat.id === category?.parentId); if (parent) { ancestors.unshift(parent); category = parent; } else category = undefined; } ancestors.forEach((cat) => { trailItems.push(<li key={cat.id}><Link to={`/cat/${cat.id}/${cat.slug}`}>{cat.name}</Link></li>); }); trailItems.push(<li key={currentCategory.id}><span>{currentCategory.name}</span></li>); }
    return (<div id="trail"><nav className="breadcrumb"><ol>{trailItems.reduce((acc: React.ReactNode[], item, index) => { if (index > 0) acc.push(<span key={`sep-${index}`} className="trail__breadcrumb-separator">›</span>); acc.push(item); return acc; }, [])}</ol></nav></div>);
  };
  const renderMainCategories = () => {
    if (!currentCategory || !currentCategory.isMain) return null; const subcategories = categories.filter(cat => cat.parentId === currentCategory.id);
    return (<><div className="page-header"><div className="hgroup"><div className="page-header__title-wrapper"><h1>{currentCategory.name}</h1></div></div></div><div className="root-category__categories">{subcategories.length > 0 ? (subcategories.map((subCat) => (<div key={subCat.id} className="root-category__category"><Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover"><img src={subCat.image || '/dist/images/cat/placeholder.webp'} alt={subCat.name} title={subCat.name} loading="lazy" width="200" height="150" /></Link><h3 className="root-category__category-title"><Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link></h3><div className="root-category__footer"></div></div>))) : (<p>Δεν υπάρχουν υποκατηγορίες.</p>)}</div><div className="sections"></div></>);
  };
  const renderSubcategoryContent = () => {
    if (!currentCategory || currentCategory.isMain) return null; const childCategories = categories.filter(cat => cat.parentId === currentCategory.id); const parentCategory = allCategories.find(cat => cat.id === currentCategory.parentId);
    return (<><div className="page-header"><div className="hgroup"><div className="page-header__title-wrapper">{parentCategory && (<Link className="trail__back pressable" title={`Επιστροφή σε ${parentCategory.name}`} to={`/cat/${parentCategory.id}/${parentCategory.slug}`}><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-right-thin-16" /></svg></Link>)}<h1>{currentCategory.name}</h1></div></div></div>{childCategories.length > 0 ? (<div className="root-category__categories">{childCategories.map((subCat) => (<div key={subCat.id} className="root-category__category"><Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover"><img src={subCat.image || '/dist/images/cat/placeholder.webp'} alt={subCat.name} title={subCat.name} loading="lazy" width="200" height="150"/></Link><h3 className="root-category__category-title"><Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link></h3></div>))}</div>) : (renderProducts())}<div className="sections"></div>{childCategories.length === 0 && baseCategoryProducts.length > 0 && (<div className="p__products-section"><div className="alerts"><button data-url={`/cat/${currentCategory.id}/${currentCategory.slug}`} data-title={currentCategory.name} data-max-price="0" className="alerts__button pressable" onClick={handlePriceAlert}><svg aria-hidden="true" className="icon" width={20} height={20}><use href="/dist/images/icons/icons.svg#icon-notification-outline-20" /></svg><span className="alerts__label">Ειδοποίηση</span></button><div className="alerts__prompt">σε <span className="alerts__title">{currentCategory.name}</span></div></div></div>)}</>);
  };
  const renderAppliedFilters = () => {
    const { brands, specs, vendorIds, deals, certified, nearby, boxnow, instock } = activeFilters;
    // *** REMOVED vendorIds from check - don't show bar just for selected vendor ***
    const isAnyFilterActive = brands.length > 0 || Object.values(specs).some(v => v.length > 0) || deals || certified || nearby || boxnow || instock;
    if (!isAnyFilterActive) return null;
    const renderChip = (key: string, title: string, label: string, onRemove: () => void) => (<h2 className="applied-filters__filter" key={key}><a className="pressable" onClick={(e) => { e.preventDefault(); onRemove(); }} title={title}><span className="applied-filters__label">{label}</span><svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>);
    return (<div className="applied-filters">{instock && renderChip('instock', 'Αφαίρεση φίλτρου άμεσα διαθέσιμων', 'Άμεσα διαθέσιμα', handleInstockToggle)}{deals && renderChip('deals', 'Αφαίρεση φίλτρου προσφορών', 'Προσφορές', handleDealsToggle)}{certified && renderChip('certified', 'Αφαίρεση φίλτρου πιστοποιημένων', 'Πιστοποιημένα', handleCertifiedToggle)}{nearby && renderChip('nearby', 'Αφαίρεση φίλτρου κοντά μου', 'Κοντά μου', handleNearbyToggle)}{boxnow && renderChip('boxnow', 'Αφαίρεση φίλτρου Box Now', 'Παράδοση με Box Now', handleBoxnowToggle)}{brands.map((brand) => renderChip(`brand-${brand}`, `Αφαίρεση φίλτρου ${brand}`, brand, () => handleBrandFilter(brand)))}{Object.entries(specs).flatMap(([specKey, specValues]) => specValues.map((specValue) => renderChip(`spec-${specKey}-${specValue}`, `Αφαίρεση φίλτρου ${specKey}: ${specValue}`, `${specKey}: ${specValue}`, () => handleSpecFilter(specKey, specValue))))}{/* *** REMOVED VENDOR CHIP RENDERING HERE *** */}{/* Vendor chip removed as requested */} <button className="applied-filters__reset pressable" onClick={handleResetFilters} title="Επαναφορά όλων των φίλτρων"><svg aria-hidden="true" className="icon" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-refresh"></use></svg><span>Καθαρισμός όλων</span></button></div>);
  };
  const renderProducts = () => {
    const { brands: activeBrandFilters, specs: activeSpecFilters, vendorIds: activeVendorIds, ...restActiveFilters } = activeFilters;
    const isAnyFilterActive = activeBrandFilters.length > 0 || Object.values(activeSpecFilters).some(v => v.length > 0) || activeVendorIds.length > 0 || Object.values(restActiveFilters).some(v => v === true);
    // isSingleVendorSelected and singleSelectedVendorId derived state used below
    if (!currentCategory || baseCategoryProducts.length === 0) { return (<main className="page-products__main"><p>Δεν υπάρχουν διαθέσιμα προϊόντα για αυτήν την κατηγορία αυτή τη στιγμή.</p></main>); }
    return (
      <div className="page-products">
        <aside className="page-products__filters">
          <div id="filters" role="complementary" aria-labelledby="filters-header" data-label={currentCategory.name}>
            <div className="filters__header"><div className="filters__header-title filters__header-title--filters">Φίλτρα</div>{isAnyFilterActive && ( <Link to="#" onClick={(e) => handleLinkFilterClick(e, handleResetFilters)} className="pressable filters__header-remove popup-anchor" data-tooltip="Αφαίρεση όλων των φίλτρων" data-tooltip-no-border="" data-tooltip-small="true">Καθαρισμός</Link> )}</div>
            {/* Limit Filters */}
            <div className="filter-limit default-list"><div className="filter__header"><h4>Εμφάνιση μόνο</h4></div><div className="filter-container"><ol><li data-filter="deals" className={`pressable ${activeFilters.deals ? 'selected' : ''}`}><Link to="#" title="Προσφορές" rel="nofollow" onClick={(e) => handleLinkFilterClick(e, handleDealsToggle)}><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-flame-16"></use></svg><span>Προσφορές</span></Link></li><li data-filter="certified" className={`pressable ${activeFilters.certified ? 'selected' : ''}`}><Link to="#" title="Πιστοποιημένα καταστήματα" rel="nofollow" onClick={(e) => handleLinkFilterClick(e, handleCertifiedToggle)}><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-certified-16"></use></svg><span>Πιστοποιημένα</span></Link></li><li data-filter="in-stock" className={`pressable ${activeFilters.instock ? 'selected' : ''}`}><Link to="#" title="Άμεσα διαθέσιμα" rel="nofollow" onClick={(e) => handleLinkFilterClick(e, handleInstockToggle)}><span>Άμεσα διαθέσιμα</span></Link></li><li data-filter="boxnow" className={`pressable ${activeFilters.boxnow ? 'selected' : ''}`}><Link to="#" title="Παράδοση με BoxNow" rel="nofollow" onClick={(e) => handleLinkFilterClick(e, handleBoxnowToggle)}><svg aria-hidden="true" className="icon" width={24} height={24}><use href="/dist/images/icons/partners.svg#icon-boxnow"></use></svg><span className="help" data-tooltip-left="" data-tooltip="Προϊόντα με παράδοση BOX NOW"><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-info-16"></use></svg></span><span>Παράδοση</span></Link></li></ol></div></div>
            {/* Brand Filters */}
            {Object.keys(availableBrands).length > 0 && (<div className="filter-brand default-list"><div className="filter__header"><h4>Κατασκευαστής</h4></div><div className="filter-container"><ol aria-expanded={showMoreBrands}>{sortedAvailableBrandKeys.slice(0, showMoreBrands ? sortedAvailableBrandKeys.length : MAX_DISPLAY_COUNT).map((brand) => (<li key={brand} className={`pressable ${activeFilters.brands.includes(brand) ? 'selected' : ''}`}><a href="#" onClick={(e) => { e.preventDefault(); handleBrandFilter(brand); }} data-c={availableBrands[brand]}>{brand}</a></li>))}</ol>{sortedAvailableBrandKeys.length > MAX_DISPLAY_COUNT && (<div className="filters-more-prompt pressable" onClick={() => setShowMoreBrands(prev => !prev)} title={showMoreBrands ? "Λιγότεροι" : "Όλοι"}><svg aria-hidden="true" className="icon" width={10} height={10} viewBox="0 0 10 10"><path fillRule="evenodd" d={showMoreBrands ? "M9.5 6H0.5C0.224 6 0 5.776 0 5.5V4.5C0 4.224 0.224 4 0.5 4H9.5C9.776 4 10 4.224 10 4.5V5.5C10 5.776 9.776 6 9.5 6Z" : "M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"} /></svg>{showMoreBrands ? "Λιγότερα" : "Όλα"}</div>)}</div></div>)}
            {/* Spec Filters */}
            {sortedAvailableSpecKeys.length > 0 && (sortedAvailableSpecKeys.map((specKey) => { const specValuesSet = availableSpecs[specKey]; if (!specValuesSet || specValuesSet.size === 0) return null; const specValuesArray = Array.from(specValuesSet).sort(); const isExpanded = showMoreSpecs[specKey] || false; return (<div key={specKey} className={`filter-${specKey.toLowerCase().replace(/\s+/g, '-')} default-list`}><div className="filter__header"><h4>{specKey}</h4></div><div className="filter-container"><ol aria-expanded={isExpanded}>{specValuesArray.slice(0, isExpanded ? specValuesArray.length : MAX_DISPLAY_COUNT).map((specValue) => (<li key={specValue} className={`pressable ${activeFilters.specs[specKey]?.includes(specValue) ? 'selected' : ''}`}><a href="#" onClick={(e) => {e.preventDefault(); handleSpecFilter(specKey, specValue); }}><span>{specValue}</span></a></li>))}</ol>{specValuesArray.length > MAX_DISPLAY_COUNT && (<div className="filters-more-prompt pressable" onClick={() => setShowMoreSpecs(prev => ({...prev, [specKey]: !prev[specKey]}))} title={isExpanded ? `Λιγότερες ${specKey}` : `Όλες οι ${specKey}`}><svg aria-hidden="true" className="icon" width={10} height={10} viewBox="0 0 10 10"><path fillRule="evenodd" d={isExpanded ? "M9.5 6H0.5C0.224 6 0 5.776 0 5.5V4.5C0 4.224 0.224 4 0.5 4H9.5C9.776 4 10 4.224 10 4.5V5.5C10 5.776 9.776 6 9.5 6Z" : "M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"} /></svg>{isExpanded ? "Λιγότερα" : "Όλα"}</div>)}</div></div>)}))}
            {/* Certified Vendors Filter - Visual Single Select */}
            {certifiedVendors.length > 0 && (<div className="filter-store filter-collapsed default-list"><div className="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div><div className="filter-container"><ol aria-expanded={!isSingleVendorSelected && showMoreVendors}>{(isSingleVendorSelected ? certifiedVendors.filter(v => v.id === singleSelectedVendorId) : certifiedVendors).slice(0, isSingleVendorSelected ? 1 : (showMoreVendors ? certifiedVendors.length : MAX_DISPLAY_COUNT)).map(vendor => (<li key={vendor.id} title={`${vendor.name} (${cleanDomainName(vendor.url)}) - ${vendor.certification}`} className={`pressable ${singleSelectedVendorId === vendor.id ? 'selected' : ''}`}><Link to="#" data-l={vendor.certification === 'Gold' ? '3' : vendor.certification === 'Silver' ? '2' : '1'} onClick={(e) => handleLinkFilterClick(e, () => handleCertifiedVendorSelect(vendor))}><span>{vendor.name}</span></Link></li>))}</ol>{!isSingleVendorSelected && certifiedVendors.length > MAX_DISPLAY_COUNT && (<div className="filters-more-prompt pressable" onClick={() => setShowMoreVendors(prev => !prev)}><svg aria-hidden="true" className="icon" width={10} height={10} viewBox="0 0 10 10"><path fillRule="evenodd" d={showMoreVendors ? "M9.5 6H0.5C0.224 6 0 5.776 0 5.5V4.5C0 4.224 0.224 4 0.5 4H9.5C9.776 4 10 4.224 10 4.5V5.5C10 5.776 9.776 6 9.5 6Z" : "M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"} /></svg>{showMoreVendors ? "Λιγότερα" : "Όλα"}</div>)}</div></div>)}
          </div>
        </aside>
        <main className="page-products__main">
          <header className="page-header">
            <div className="page-header__title-wrapper"><div className="page-header__title-main"><div className="page-header__count-wrapper"><div className="page-header__count">{filteredProducts.length} {filteredProducts.length === 1 ? 'προϊόν' : 'προϊόντα'}</div>{(isAnyFilterActive || baseCategoryProducts.length > 0) && filteredProducts.length > 0 && (<div data-url={location.pathname + location.search} data-title={currentCategory?.name} data-max-price="0" className="alerts-minimal pressable" onClick={handlePriceAlert}><svg aria-hidden="true" className="icon" width={20} height={20}><use href="/dist/images/icons/icons.svg#icon-notification-outline-20"></use></svg><div className="alerts-minimal__label"></div></div>)}</div></div><div className="page-header__title-aside">{displayedBrand && displayedBrand.logo && ( <Link to={`/b/${displayedBrand.id}/${displayedBrand.slug || displayedBrand.name.toLowerCase()}.html`} title={displayedBrand.name} className="page-header__brand"><img src={displayedBrand.logo} alt={`${displayedBrand.name} logo`} height="70" loading="lazy"/></Link> )}</div></div>
            {renderAppliedFilters()}
            {sliderProducts.length > 0 && (<div className="products-wrapper"><div className="products-wrapper__header"><div className="products-wrapper__title">{activeFilters.deals ? 'Επιλεγμένες προσφορές' : 'Δημοφιλή επιλογές'}</div></div><ScrollableSlider><div className="p__products--scroll p__products--inline scroll__content">{sliderProducts.map(prod => (<InlineProductItem key={`slider-${prod.id}`} product={prod} bpref="cat-slider-inline"/>))}</div></ScrollableSlider></div>)}
            {filteredProducts.length > 0 && (<div className="page-header__sorting"><div className="tabs"><div className="tabs-wrapper"><nav><a href="#" data-type="rating-desc" rel="nofollow" className={sortType === 'rating-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('rating-desc'); }}><div className="tabs__content">Δημοφιλέστερα</div></a><a href="#" data-type="newest-desc" rel="nofollow" className={sortType === 'newest-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('newest-desc'); }}><div className="tabs__content">Νεότερα</div></a><a href="#" data-type="price-asc" rel="nofollow" className={sortType === 'price-asc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('price-asc'); }}><div className="tabs__content">Φθηνότερα</div></a><a href="#" data-type="price-desc" rel="nofollow" className={sortType === 'price-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('price-desc'); }}><div className="tabs__content">Ακριβότερα</div></a><a href="#" data-type="alpha-asc" rel="nofollow" className={sortType === 'alpha-asc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('alpha-asc'); }}><div className="tabs__content">Αλφαβητικά</div></a><a href="#" data-type="reviews-desc" rel="nofollow" className={sortType === 'reviews-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('reviews-desc'); }}><div className="tabs__content">Αξιολογήσεις</div></a>{shouldShowBrandSort && ( <a href="#" data-type="brand-asc" rel="nofollow" className={sortType === 'brand-asc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('brand-asc'); }}><div className="tabs__content">Κατασκευαστή</div></a> )}<a href="#" data-type="merchants_desc" rel="nofollow" className={sortType === 'merchants_desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('merchants_desc'); }}><div className="tabs__content">Καταστήματα</div></a></nav></div></div></div>)}
          </header>
          <div className="page-products__main-wrapper">
            {filteredProducts.length > 0 ? (<div className="p__products" data-pagination="">{filteredProducts.map((product) => (<ProductCard key={product.id} product={product} activeVendorFilterDomain={activeVendorDomainForProductLink}/>))}</div>) : (isAnyFilterActive && baseCategoryProducts.length > 0 ? (<div id="no-results"><h3>Δεν βρέθηκαν προϊόντα για <strong>{currentCategory?.name || 'αυτή την κατηγορία'}</strong> με αυτά τα φίλτρα.</h3><div id="no-results-suggestions"><p><strong>Προτάσεις:</strong></p><ul><li>Δες <Link to={location.pathname} onClick={(e) => { e.preventDefault(); handleResetFilters(); }}>όλα τα προϊόντα</Link>.</li><li><Link to="#" onClick={(e) => { e.preventDefault(); handleResetFilters(); }}>Αφαίρεσε κάποιο φίλτρο</Link>.</li><li>Επιστροφή στην <Link to="/">αρχική</Link>.</li></ul></div></div>) : currentCategory && !currentCategory.isMain ? ( <p>Δεν υπάρχουν προϊόντα για αυτήν την κατηγορία.</p> ) : null)}
          </div>
        </main>
      </div>
    );
   };
  const renderMerchantInformation = () => {
    if (!selectedVendor) return null; const vendor = selectedVendor; const removeThisVendorFilter = (e: React.MouseEvent) => { e.preventDefault(); handleMultiVendorToggle(vendor); };
    return (<div className="root__wrapper information information--center" data-type="merchant-brand"><div className="root"><div data-tooltip-no-border="" data-tooltip={`Πληροφορίες: ${vendor.name} (${vendor.certification})`}><div className="merchant-logo"><Link to={`/m/${vendor.id}/${vendor.name?.toLowerCase().replace(/\s+/g, '-') || vendor.id}`}> <img loading="lazy" src={vendor.logo} width={90} height={30} alt={`${vendor.name} logo`} /> </Link><svg aria-hidden="true" className="icon merchant__certification" width={22} height={22}><use href={`/dist/images/icons/certification.svg#icon-${vendor.certification?.toLowerCase()}-22`}></use></svg></div></div><div className="information__content"><p>Προϊόντα από: <strong><Link to={`/m/${vendor.id}/${vendor.name?.toLowerCase().replace(/\s+/g, '-') || vendor.id}`}>{vendor.name}</Link></strong></p><p><Link to="#" onClick={removeThisVendorFilter}>Αφαίρεση φίλτρου</Link></p></div><span><svg aria-hidden="true" className="icon information__close pressable" width={12} height={12} onClick={removeThisVendorFilter}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></span></div></div>);
  };

  // --- Main Return Structure ---
  const isLoading = !currentCategory && location.pathname.startsWith('/cat/'); if (isLoading && defaultCategoryId === null) return <NotFound />; if (!isLoading && !currentCategory) return <NotFound />;

  return (
    <>{renderMerchantInformation()}<div className="root__wrapper root-category__root"><div className="root">{renderBreadcrumbs()}{currentCategory?.isMain ? renderMainCategories() : renderSubcategoryContent()}{isPriceAlertModalOpen && priceAlertContext && (<PriceAlertModal isOpen={isPriceAlertModalOpen} onClose={() => setIsPriceAlertModalOpen(false)} alertType="category" categoryId={priceAlertContext.categoryId} categoryName={priceAlertContext.categoryName} filters={priceAlertContext.filters} />)}</div></div></>
  );
};

export default Categories;
