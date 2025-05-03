import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products as allMockProducts, Category, Product, vendors, brands, PaymentMethod, Vendor, Brand } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import PriceAlertModal from '@/components/PriceAlertModal';
import ScrollableSlider from '@/components/ScrollableSlider';
import { useTranslation } from '@/hooks/useTranslation';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';

const MAX_DISPLAY_COUNT = 10;

// Helper to clean domain name
const cleanDomainName = (url: string): string => {
  if (!url) return '';
  try {
    const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`);
    // Remove 'www.' if it exists at the start of the hostname
    return parsedUrl.hostname.replace(/^www\./i, '');
  } catch (e) {
    // Fallback for invalid URLs: remove common prefixes
    return url
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
      .split('/')[0]; // Get part before first slash
  }
};

// Define the structure for active filters state accurately
interface ActiveFiltersState {
  brands: string[];
  specs: Record<string, string[]>;
  vendorIds: number[]; // Internally tracks IDs for filtering logic
  deals: boolean;
  certified: boolean;
  nearby: boolean; // Still needs real logic
  boxnow: boolean;
  instock: boolean;
}

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
  let classNamesForHtml = 'page'; // Base class

  // Basic Ad blocker check - reliable detection is very hard
  const checkAdBlockers = (): boolean => {
      try {
          const testAd = document.createElement('div');
          testAd.innerHTML = ' ';
          testAd.className = 'adsbox'; // Common ad class name
          testAd.style.position = 'absolute';
          testAd.style.left = '-9999px';
          testAd.style.height = '1px'; // Give it some height to check offsetHeight
          document.body.appendChild(testAd);
          const isBlocked = !testAd.offsetHeight;
          document.body.removeChild(testAd);
          return isBlocked;
      } catch (e) {
          return false; // Assume not blocked if check fails
      }
  };

  const isAdBlocked = useMemo(checkAdBlockers, []); // Check once on mount

  if (userAgent.includes('windows')) { classNamesForHtml += ' windows no-touch'; }
  else if (userAgent.includes('android')) { classNamesForHtml += ' android touch'; classNamesForBody = 'mobile'; }
  else if (userAgent.includes('iphone') || userAgent.includes('ipad')) { classNamesForHtml += ' ios touch'; classNamesForBody = userAgent.includes('ipad') ? 'tablet' : 'mobile'; }
  else if (userAgent.includes('mac os x')) { classNamesForHtml += ' macos no-touch'; }
  else { classNamesForHtml += ' unknown-device'; }

  classNamesForHtml += isAdBlocked ? ' adblocked' : ' adallowed';
  // Add other feature detection classes as needed based on your setup
  classNamesForHtml += ' supports-webp supports-ratio supports-flex-gap supports-lazy supports-assistant is-desktop is-modern flex-in-button is-prompting-to-add-to-home';

  useEffect(() => { setJsEnabled(true); }, []); // Set JS enabled on mount
  classNamesForHtml += jsEnabled ? ' js-enabled' : ' js-disabled';
  useHtmlAttributes(classNamesForHtml, 'page-cat'); // Use page-cat as HTML ID
  useBodyAttributes(classNamesForBody, ''); // Keep body ID empty
  // --- End Document Attributes ---

  // --- Precompute Vendor Maps for efficient lookups ---
  const vendorIdMap = useMemo(() => new Map(vendors.map(v => [v.id, v])), []);
  const vendorDomainMap = useMemo(() => {
      const map = new Map<string, Vendor>();
      vendors.forEach(v => {
          const domain = cleanDomainName(v.url);
          if (domain) { // Only map if domain is valid
              map.set(domain, v);
          }
      });
      return map;
  }, []);


  // --- State Definitions ---
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]); // Raw products for the category
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Products after filtering/sorting

  // Initialize filters FROM URL on mount/load
  const initialFilters = useMemo((): ActiveFiltersState => {
      const params = searchParams;
      // Parse store parameter (domain names) into vendor IDs
      const storeDomains = params.get('store')?.split(',').filter(Boolean) || [];
      const initialVendorIds = storeDomains
            .map(domain => vendorDomainMap.get(domain)?.id) // Find vendor by domain, get ID
            .filter((id): id is number => id !== undefined); // Filter out undefined IDs (not found vendors)

      return {
        brands: params.get('brand')?.split(',').filter(Boolean) || [],
        specs: Array.from(params.entries()).reduce((acc, [key, value]) => {
                 if (key.startsWith('spec_')) {
                     const specKey = key.substring(5);
                     acc[specKey] = value.split(',').filter(Boolean);
                 }
                 return acc;
             }, {} as Record<string, string[]>),
        vendorIds: initialVendorIds, // Use parsed IDs
        deals: params.get('deals') === '1',
        certified: params.get('certified') === '1',
        nearby: params.get('nearby') === '1',
        boxnow: params.get('boxnow') === '1',
        instock: params.get('instock') === '1',
      };
  }, [searchParams, vendorDomainMap]); // Add vendorDomainMap dependency

  // Use the initialized state
  const [activeFilters, setActiveFilters] = useState<ActiveFiltersState>(initialFilters);

  // Other states...
  const [availableBrands, setAvailableBrands] = useState<Record<string, number>>({});
  const [availableSpecs, setAvailableSpecs] = useState<Record<string, Set<string>>>({});
  const [showMoreVendors, setShowMoreVendors] = useState(false);
  const [certifiedVendors, setCertifiedVendors] = useState<Vendor[]>([]);
  const [sortType, setSortType] = useState('rating-desc');
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState(false);

  // --- Helper Data & Category Logic ---
  const allCategories = [...mainCategories, ...categories];
  const findCategory = (identifier: string): Category | undefined => allCategories.find(cat => cat.id.toString() === identifier || cat.slug === identifier);
  const defaultCategoryId = mainCategories.length > 0 ? mainCategories[0].id : null;

  // --- URL Sync Function ---
  const updateUrlParams = (filters: ActiveFiltersState) => {
    const params = new URLSearchParams();
    if (filters.brands.length > 0) params.set('brand', filters.brands.join(','));

    // Convert vendor IDs back to domain names for the URL 'store' parameter
    if (filters.vendorIds.length > 0) {
        const domains = filters.vendorIds
            .map(id => vendorIdMap.get(id)?.url) // Get URL by ID using the precomputed map
            .filter((url): url is string => !!url) // Filter out cases where vendor wasn't found
            .map(cleanDomainName) // Clean the domain
            .filter(Boolean); // Filter out potentially empty domains after cleaning
        if (domains.length > 0) {
             params.set('store', domains.join(',')); // Set comma-separated domains
        }
    }

    Object.entries(filters.specs).forEach(([key, values]) => { if (values.length > 0) params.set(`spec_${key}`, values.join(',')); });
    if (filters.deals) params.set('deals', '1');
    if (filters.certified) params.set('certified', '1');
    if (filters.nearby) params.set('nearby', '1');
    if (filters.boxnow) params.set('boxnow', '1');
    if (filters.instock) params.set('instock', '1');
    setSearchParams(params, { replace: true }); // Update URL efficiently
  };

  // Effect 1: Load Category Data & Initial Products
  useEffect(() => {
    // Reset non-filter states on path change
    setCurrentCategory(undefined);
    setCategoryProducts([]);
    setFilteredProducts([]);
    setAvailableBrands({});
    setAvailableSpecs({});
    setCertifiedVendors([]);
    // activeFilters state will be updated by Effect 3 reacting to searchParams change

    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length < 2 || pathSegments[0] !== 'cat') {
      if (defaultCategoryId !== null) {
        const defaultCat = mainCategories.find(cat => cat.id === defaultCategoryId);
        setCurrentCategory(defaultCat);
      }
      return;
    }

    const segments = pathSegments.slice(1);
    const lastSegment = segments[segments.length - 1];
    let matchedCategory = findCategory(lastSegment);

    if (matchedCategory) {
      setCurrentCategory(matchedCategory);
      if (matchedCategory.parentId !== null || !matchedCategory.isMain) {
          const productsForCategory = allMockProducts.filter(p => p.categoryIds?.includes(matchedCategory.id));
          setCategoryProducts(productsForCategory);
          extractAvailableFilters(productsForCategory);
          updateCertifiedVendors(productsForCategory);
          // Filtering/sorting is handled by Effect 2 reacting to this state change & activeFilters change
      }
    } else {
      if (defaultCategoryId !== null) {
        const defaultCat = mainCategories.find(cat => cat.id === defaultCategoryId);
        setCurrentCategory(defaultCat);
      }
    }
  }, [location.pathname, defaultCategoryId]); // Depend only on path

  // --- Filter Extraction Logic ---
  const extractAvailableFilters = (sourceProducts: Product[]) => {
        const brandsCount: Record<string, number> = {};
        const specs: Record<string, Set<string>> = {};
        sourceProducts.forEach((product) => {
            if (product.brand) { brandsCount[product.brand] = (brandsCount[product.brand] || 0) + 1; }
            Object.keys(product.specifications || {}).forEach((specKey) => {
                const specValue = product.specifications[specKey];
                if (specValue != null) {
                    if (!specs[specKey]) { specs[specKey] = new Set(); }
                    specs[specKey].add(String(specValue));
                }
            });
        });
        setAvailableBrands(brandsCount);
        setAvailableSpecs(specs);
  };

  const updateCertifiedVendors = (sourceProducts: Product[]) => {
        const vendorMap = new Map<number, Vendor>();
        sourceProducts.forEach(product => {
            (product.prices || []).forEach(price => {
                // Use precomputed map for efficiency
                const vendor = vendorIdMap.get(price.vendorId);
                if (vendor && vendor.certification) { vendorMap.set(vendor.id, vendor); }
            });
        });
        const vendorArray = Array.from(vendorMap.values()).sort((a, b) => {
            const levels: Record<string, number> = { Gold: 3, Silver: 2, Bronze: 1 };
            return (levels[b.certification] || 0) - (levels[a.certification] || 0);
        });
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
    let productsToFilter = [...categoryProducts];
    const currentFilters = activeFilters; // Use state directly

    // Apply filters based on currentFilters state
    if (currentFilters.instock) { productsToFilter = productsToFilter.filter(p => (p.prices || []).some(price => price.inStock)); }
    if (currentFilters.deals) { console.warn("Deals Filter Placeholder - Add actual logic"); /* Placeholder */ }
    if (currentFilters.certified) { productsToFilter = productsToFilter.filter(p => (p.prices || []).some(price => vendorIdMap.get(price.vendorId)?.certification)); }
    if (currentFilters.nearby) { console.warn("Nearby Filter Placeholder - Add actual logic"); /* Placeholder */ }
    if (currentFilters.boxnow) { productsToFilter = productsToFilter.filter(p => (p.prices || []).some(price => vendorIdMap.get(price.vendorId)?.paymentMethods?.includes(PaymentMethod.PickupVia))); }
    if (currentFilters.brands.length > 0) { productsToFilter = productsToFilter.filter(p => p.brand && currentFilters.brands.includes(p.brand)); }
    if (currentFilters.vendorIds.length > 0) { productsToFilter = productsToFilter.filter(p => (p.prices || []).some(price => currentFilters.vendorIds.includes(price.vendorId))); } // Filter by ID
    if (Object.keys(currentFilters.specs).length > 0) {
        productsToFilter = productsToFilter.filter(p => Object.entries(currentFilters.specs).every(([key, values]) => {
            if (!values || values.length === 0) return true;
            if (!p.specifications || p.specifications[key] === undefined) return false;
            return values.includes(String(p.specifications[key]));
        }));
    }

    const sortedAndFiltered = sortProducts(productsToFilter);
    setFilteredProducts(sortedAndFiltered);

  }, [activeFilters, categoryProducts, sortType, vendorIdMap]); // Add vendorIdMap dependency

  // Effect 3: Update activeFilters state when URL parameters change directly
  useEffect(() => {
    // Parse domains from URL param back to IDs
    const storeDomains = searchParams.get('store')?.split(',').filter(Boolean) || [];
    const vendorIdsFromUrl = storeDomains
        .map(domain => vendorDomainMap.get(domain)?.id)
        .filter((id): id is number => id !== undefined);

    const filtersFromUrl: ActiveFiltersState = {
        brands: searchParams.get('brand')?.split(',').filter(Boolean) || [],
        specs: Array.from(searchParams.entries()).reduce((acc, [key, value]) => { if (key.startsWith('spec_')) { acc[key.substring(5)] = value.split(',').filter(Boolean); } return acc; }, {} as Record<string, string[]>),
        vendorIds: vendorIdsFromUrl, // Use IDs parsed from domains
        deals: searchParams.get('deals') === '1',
        certified: searchParams.get('certified') === '1',
        nearby: searchParams.get('nearby') === '1',
        boxnow: searchParams.get('boxnow') === '1',
        instock: searchParams.get('instock') === '1',
      };

      // Update state only if it differs from URL derived filters
      if (JSON.stringify(filtersFromUrl) !== JSON.stringify(activeFilters)) {
          setActiveFilters(filtersFromUrl);
      }
  }, [searchParams, activeFilters, vendorDomainMap]); // Add map dependency


  // --- Filter Event Handlers ---
  const handleLinkFilterClick = (event: React.MouseEvent<HTMLAnchorElement>, handler: () => void) => {
      event.preventDefault(); // Stop default Link navigation
      handler(); // Execute state update logic
  };

  const createToggleHandler = (filterKey: keyof ActiveFiltersState) => {
      return () => {
          const newFilters = { ...activeFilters, [filterKey]: !activeFilters[filterKey] };
          setActiveFilters(newFilters);
          updateUrlParams(newFilters);
      };
  };

  // Create handlers using the factory
  const handleDealsToggle = createToggleHandler('deals');
  const handleCertifiedToggle = createToggleHandler('certified');
  const handleNearbyToggle = createToggleHandler('nearby');
  const handleBoxnowToggle = createToggleHandler('boxnow');
  const handleInstockToggle = createToggleHandler('instock');

  // Specific handlers for multi-value filters
  const handleBrandFilter = (brand: string) => {
      const currentBrands = activeFilters.brands;
      const newBrands = currentBrands.includes(brand) ? currentBrands.filter(b => b !== brand) : [...currentBrands, brand];
      const newFilters = { ...activeFilters, brands: newBrands };
      setActiveFilters(newFilters);
      updateUrlParams(newFilters);
  };

  const handleSpecFilter = (specKey: string, specValue: string) => {
      const currentSpecs = { ...activeFilters.specs };
      const specValues = currentSpecs[specKey] || [];
      const newSpecValues = specValues.includes(specValue) ? specValues.filter(v => v !== specValue) : [...specValues, specValue];
      if (newSpecValues.length === 0) { delete currentSpecs[specKey]; }
      else { currentSpecs[specKey] = newSpecValues; }
      const newFilters = { ...activeFilters, specs: currentSpecs };
      setActiveFilters(newFilters);
      updateUrlParams(newFilters);
  };

  // Vendor filter toggles the ID internally
  const handleVendorFilter = (vendor: Vendor) => {
      const currentVendorIds = activeFilters.vendorIds;
      const newVendorIds = currentVendorIds.includes(vendor.id) ? currentVendorIds.filter(id => id !== vendor.id) : [...currentVendorIds, vendor.id];
      const newFilters = { ...activeFilters, vendorIds: newVendorIds };
      setActiveFilters(newFilters); // Update ID state
      updateUrlParams(newFilters); // Update URL (will convert IDs to domains)
  };

  // Reset handler clears state and URL params
  const handleResetFilters = () => {
      const resetState: ActiveFiltersState = { brands: [], specs: {}, vendorIds: [], deals: false, certified: false, nearby: false, boxnow: false, instock: false };
      setActiveFilters(resetState);
      updateUrlParams(resetState);
  };

  // --- Misc Helper/UI Logic ---
  const displayedBrand = activeFilters.brands.length === 1 ? brands.find(b => b.name === activeFilters.brands[0]) : null;
  const handlePriceAlert = () => {
    if (!user) { toast({ title: 'Login Required', description: 'Please log in to set a price alert', variant: 'destructive' }); return; }
    if (currentCategory) { setIsPriceAlertModalOpen(true); }
    else { toast({ title: 'Error', description: 'Cannot set alert, category not selected.', variant: 'destructive' }); }
  };

   // --- Rendering Functions ---
  const renderBreadcrumbs = () => {
    const trailItems: React.ReactNode[] = [];
    trailItems.push(<li key="home"><Link to="/" rel="home"><span>BestPrice</span></Link></li>);
    if (currentCategory && currentCategory.parentId !== null && !currentCategory.isMain) {
        const ancestors: Category[] = [];
        let category: Category | undefined = currentCategory;
        while (category && category.parentId !== null) {
            const parent = allCategories.find((cat) => cat.id === category?.parentId);
            if (parent) { ancestors.unshift(parent); category = parent; }
            else { category = undefined; }
        }
        ancestors.forEach((cat) => { trailItems.push(<li key={cat.id}><Link to={`/cat/${cat.id}/${cat.slug}`}>{cat.name}</Link></li>); });
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
        const { brands, specs, vendorIds, deals, certified, nearby, boxnow, instock } = activeFilters;
        const isAnyFilterActive = brands.length > 0 || Object.values(specs).some(v => v.length > 0) || vendorIds.length > 0 || deals || certified || nearby || boxnow || instock;
        if (!isAnyFilterActive) return null;

        return (
            <div className="applied-filters">
                {instock && (<h2 className="applied-filters__filter" key="instock"><a className="pressable" onClick={handleInstockToggle} title="Αφαίρεση φίλτρου άμεσα διαθέσιμων προϊόντων"><span className="applied-filters__label">Άμεσα διαθέσιμα</span><svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)}
                {deals && (<h2 className="applied-filters__filter" key="deals"><a className="pressable" onClick={handleDealsToggle} title="Αφαίρεση φίλτρου προσφορών"><span className="applied-filters__label">Προσφορές</span><svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)}
                {certified && (<h2 className="applied-filters__filter" key="certified"><a className="pressable" onClick={handleCertifiedToggle} title="Αφαίρεση φίλτρου πιστοποιημένων καταστημάτων"><span className="applied-filters__label">Πιστοποιημένα καταστήματα</span><svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)}
                {nearby && (<h2 className="applied-filters__filter" key="nearby"><a className="pressable" onClick={handleNearbyToggle} title="Αφαίρεση φίλτρου για καταστήματα κοντά μου"><span className="applied-filters__label">Κοντά μου</span><svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)}
                {boxnow && (<h2 className="applied-filters__filter" key="boxnow"><a className="pressable" onClick={handleBoxnowToggle} title="Αφαίρεση φίλτρου BOX NOW"><span className="applied-filters__label">BOX NOW</span><svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)}
                {brands.map((brand) => (<h2 className="applied-filters__filter" key={`brand-${brand}`}><a className="pressable" onClick={() => handleBrandFilter(brand)} title={`Αφαίρεση φίλτρου του κατασκευαστή ${brand}`}><span className="applied-filters__label">{brand}</span><svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>))}
                {Object.entries(specs).flatMap(([specKey, specValues]) => specValues.map((specValue) => (<h2 className="applied-filters__filter" key={`spec-${specKey}-${specValue}`}><a className="pressable" onClick={() => handleSpecFilter(specKey, specValue)} title={`Αφαίρεση φίλτρου ${specKey}: ${specValue}`}><span className="applied-filters__label">{`${specKey}: ${specValue}`}</span><svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>)))}
                {vendorIds.map((vendorId) => { const vendor = vendorIdMap.get(vendorId); return vendor ? (<h2 className="applied-filters__filter" key={`vendor-${vendor.id}`}><a className="pressable" onClick={() => handleVendorFilter(vendor)} title={`Αφαίρεση φίλτρου από το κατάστημα ${vendor.name}`}><span className="applied-filters__label">{vendor.name}</span><svg aria-hidden="true" className="icon applied-filters__x" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></a></h2>) : null; })}
                <button className="applied-filters__reset pressable" onClick={handleResetFilters} title="Επαναφορά όλων των φίλτρων"><svg aria-hidden="true" className="icon" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-refresh"></use></svg><span>Καθαρισμός όλων</span></button>
            </div>
        );
    };

  const renderProducts = () => {
    const showProductHeader = filteredProducts.length > 0 && currentCategory;

    return (
      <div className="page-products">
        {/* ASIDE FILTERS */}
        {categoryProducts.length > 0 && currentCategory && (
          <aside className="page-products__filters">
            <div id="filters" role="complementary" aria-labelledby="filters-header" data-label={currentCategory.name}>
              <div className="filters__header"><h3 className="filters__header-title filters__header-title--filters">Φίλτρα</h3></div>

              {/* "Εμφάνιση μόνο" Section */}
              <div className="filter-limit default-list" data-filter-name="limit" data-key="limit">
                <div className="filter__header"><h4>Εμφάνιση μόνο</h4></div>
                <div className="filter-container">
                  <ol>
                    <li data-filter="deals" className={`pressable ${activeFilters.deals ? 'selected' : ''}`}>
                      <Link to="#" title="Προσφορές" rel="nofollow" onClick={(e) => handleLinkFilterClick(e, handleDealsToggle)}>
                        <svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-flame-16"></use></svg>
                        <span>Προσφορές</span>
                      </Link>
                    </li>
                    <li data-filter="certified" className={`pressable ${activeFilters.certified ? 'selected' : ''}`}>
                      <Link to="#" title="Πιστοποιημένα καταστήματα" rel="nofollow" onClick={(e) => handleLinkFilterClick(e, handleCertifiedToggle)}>
                        <svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-certified-16"></use></svg>
                        <span>Πιστοποιημένα καταστήματα</span>
                      </Link>
                    </li>
                    {/* Nearby (Commented) <li id="filter-nearby" className={`nearby-location pressable ${activeFilters.nearby ? 'selected' : ''}`} onClick={(e) => handleLinkFilterClick(e, handleNearbyToggle)}>...</li> */}
                    <li data-filter="in-stock" className={`pressable ${activeFilters.instock ? 'selected' : ''}`}>
                       <Link to="#" title="Άμεσα διαθέσιμα" rel="nofollow" onClick={(e) => handleLinkFilterClick(e, handleInstockToggle)}>
                           <span>Άμεσα διαθέσιμα</span>
                       </Link>
                    </li>
                    <li data-filter="boxnow" className={`pressable ${activeFilters.boxnow ? 'selected' : ''}`}>
                      <Link to="#" title="Παράδοση με BoxNow" rel="nofollow" onClick={(e) => handleLinkFilterClick(e, handleBoxnowToggle)}>
                        <svg aria-hidden="true" className="icon" width={24} height={24}><use href="/dist/images/icons/partners.svg#icon-boxnow"></use></svg>
                        <span className="help" data-tooltip-left="" data-tooltip="Προϊόντα από καταστήματα που υποστηρίζουν παράδοση με BOX NOW"><svg aria-hidden="true" className="icon help" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-info-16"></use></svg></span>
                        <span>Παράδοση</span>
                      </Link>
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
                        {Object.keys(availableBrands).sort().map((brand) => (
                          <li key={brand} className={`pressable ${activeFilters.brands.includes(brand) ? 'selected' : ''}`} onClick={() => handleBrandFilter(brand)}><a data-c={availableBrands[brand]}>{brand}</a></li> 
                        ))} 
                      </ol>
                    </div>
                 </div>
              )}

              {/* Specs Filters */}
               {Object.keys(availableSpecs).length > 0 && ( Object.entries(availableSpecs).map(([specKey, specValuesSet]) => { const specValuesArray = Array.from(specValuesSet).sort(); if (specValuesArray.length === 0) return null; return ( <div key={specKey} className={`filter-${specKey.toLowerCase()} default-list`} data-filter-name={specKey.toLowerCase()} data-type="select" data-key={specKey.toLowerCase()}> <div className="filter__header"><h4>{specKey}</h4></div> <div className="filter-container"> <ol> {specValuesArray.map((specValue) => ( <li key={specValue} className={`pressable ${activeFilters.specs[specKey]?.includes(specValue) ? 'selected' : ''}`} onClick={() => handleSpecFilter(specKey, specValue)}> <span>{specValue}</span> </li> ))} </ol> </div> </div> ) }) )}

              {/* Certified Vendors Filter */}
              {certifiedVendors.length > 0 && (
                <div className="filter-store filter-collapsed default-list" data-filter-name="Πιστοποιημένα καταστήματα" data-key="store">
                  <div className="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div>
                  <div className="filter-container">
                    <ol aria-expanded={showMoreVendors}>
                      {certifiedVendors.slice(0, showMoreVendors ? certifiedVendors.length : MAX_DISPLAY_COUNT).map(vendor => (
                        <li key={vendor.id} title={`Το κατάστημα ${vendor.name} (${cleanDomainName(vendor.url)}) διαθέτει ${vendor.certification} πιστοποίηση`} className={`pressable ${activeFilters.vendorIds.includes(vendor.id) ? 'selected' : ''}`}>
                          {/* Link 'to' prop is now more semantic, uses domain */}
                          <Link
                              to={`?store=${cleanDomainName(vendor.url)}`} // Example href, might need adjustment based on how you want URL to look *semantically*
                              data-l={vendor.certification === 'Gold' ? '3' : vendor.certification === 'Silver' ? '2' : '1'}
                              onClick={(e) => handleLinkFilterClick(e, () => handleVendorFilter(vendor))} // onClick drives the actual state/URL update via ID
                          >
                            <span>{vendor.name}</span>
                          </Link>
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
            </div>
          </aside>
        )}
        {/* END ASIDE FILTERS */}

        <main className="page-products__main">
          {/* Header */}
          {showProductHeader && currentCategory && (
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
                  {displayedBrand && displayedBrand.logo && (
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

          {/* Product Grid */}
          <div className="page-products__main-wrapper">
            <div className="p__products" data-pagination="">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                currentCategory && !currentCategory.isMain && categoryProducts.length > 0 ?
                <p>Δεν βρέθηκαν προϊόντα που να ταιριάζουν με τα επιλεγμένα φίλτρα.</p> :
                currentCategory && !currentCategory.isMain && categoryProducts.length === 0 ?
                <p>Δεν υπάρχουν προϊόντα για αυτήν την κατηγορία.</p> : null
              )}
            </div>
          </div>
        </main>
      </div>
    );
   };

  // --- Main Return ---
  return (
    <div className="root__wrapper root-category__root">
      <div className="root">
        {renderBreadcrumbs()}
        {renderMainCategories()}
        {currentCategory && (currentCategory.parentId !== null && !currentCategory.isMain) && renderSubcategories(currentCategory)}
        {isPriceAlertModalOpen && currentCategory && ( <PriceAlertModal isOpen={isPriceAlertModalOpen} onClose={() => setIsPriceAlertModalOpen(false)} categoryName={currentCategory.name} categoryId={currentCategory.id} /> )}
      </div>
    </div>
  );
};

export default CategoryPage;
