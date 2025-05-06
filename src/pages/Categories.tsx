import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation, Link, useSearchParams, useNavigate } from 'react-router-dom'; // Added useNavigate for history manipulation
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import NotFound from '@/pages/NotFound';
import { categories, mainCategories, products as allMockProducts, Category, Product, vendors, brands, PaymentMethod, Vendor, Brand } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
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
    // Fallback for invalid URLs that might still represent a domain fragment
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
  }
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

// Known non-spec URL parameters for THIS page
const RESERVED_PARAMS_CAT = new Set(['brand', 'store', 'deals', 'certified', 'nearby', 'boxnow', 'instock', 'sort']);


const CategoryPage: React.FC = () => {
  // --- Hooks & Initial Setup ---
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate for programmatic navigation
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
  const [sliderProducts, setSliderProducts] = useState<Product[]>([]); // For Deals/Featured Slider
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const [showMoreSpecs, setShowMoreSpecs] = useState<Record<string, boolean>>({});
  const [showMoreVendors, setShowMoreVendors] = useState(false);
  const [sortType, setSortType] = useState<string>(() => searchParams.get('sort') || DEFAULT_SORT_TYPE);
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState(false);
  const [priceAlertContext, setPriceAlertContext] = useState<{ categoryId: number; categoryName: string; filters: ActiveFiltersState } | null>(null);

  // Reads URL params directly (lowercase/IDs)
  const getFiltersFromUrl = (currentAvailableSpecs: Record<string, Set<string>>): ActiveFiltersState => { // Pass availableSpecs for reconciliation context
        const params = searchParams;
        const storeDomains = params.get('store')?.toLowerCase().split(',').filter(Boolean) || [];
        const vendorIdsFromUrl = storeDomains.map(domain => vendorDomainMap.get(domain)?.id).filter((id): id is number => id !== undefined);
        const brandsFromUrl = params.get('brand')?.toLowerCase().split(',').filter(Boolean) || [];

        // Reconcile spec keys from URL against available keys (case-insensitive)
        const specsFromUrl = Array.from(params.entries()).reduce((acc, [key, value]) => {
            const lowerKey = key.toLowerCase();
            if (!RESERVED_PARAMS_CAT.has(lowerKey)) {
                // Find the original case key from availableSpecs if it exists
                const originalKey = Object.keys(currentAvailableSpecs).find(ak => ak.toLowerCase() === lowerKey);
                if (originalKey) { // Only add specs that are actually available for this category
                    acc[originalKey] = value.toLowerCase().split(',').filter(Boolean);
                }
            }
            return acc;
        }, {} as Record<string, string[]>);

        return {
            brands: brandsFromUrl,
            specs: specsFromUrl,
            vendorIds: vendorIdsFromUrl,
            deals: params.get('deals') === '1',
            certified: params.get('certified') === '1',
            nearby: params.get('nearby') === '1',
            boxnow: params.get('boxnow') === '1',
            instock: params.get('instock') === '1'
        };
    };


  // Active filters state - Initialize empty, synced via Effect 3
  const [activeFilters, setActiveFilters] = useState<ActiveFiltersState>({ brands: [], specs: {}, vendorIds: [], deals: false, certified: false, nearby: false, boxnow: false, instock: false });

  // ** MOVED Calculation to Top Level **
  const shouldShowBrandSort = useMemo(() => new Set(filteredProducts.map(p => p.brand).filter(Boolean)).size > 1, [filteredProducts]);
  const sortedAvailableBrandKeys = useMemo(() => Object.keys(availableBrands).sort(), [availableBrands]);
  const sortedAvailableSpecKeys = useMemo(() => Object.keys(availableSpecs).sort(), [availableSpecs]);
  const selectedVendor: Vendor | null = useMemo(() => {
    // Only return a vendor if exactly one ID is selected
    if (activeFilters.vendorIds.length === 1) {
      return vendorIdMap.get(activeFilters.vendorIds[0]) || null;
    }
    return null;
  }, [activeFilters.vendorIds, vendorIdMap]);
  // --- End Moved Calculations ---

  // --- Helper Data & Category Logic ---
  const allCategories = [...mainCategories, ...categories];
  const findCategory = (identifier: string): Category | undefined => allCategories.find(cat => cat.id.toString() === identifier || cat.slug === identifier);
  const defaultCategoryId = mainCategories.length > 0 ? mainCategories[0].id : null;

  // --- URL Sync Function ---
  const updateUrlParams = (filters: ActiveFiltersState, currentSortType: string) => {
    const params = new URLSearchParams(searchParams); // Start with existing params to preserve others if needed
    // Clear known category page filters first
    RESERVED_PARAMS_CAT.forEach(p => params.delete(p));
    // Clear any potentially remaining spec filters (case-insensitive check might be safer but complex)
    Object.keys(filters.specs).forEach(key => params.delete(key.toLowerCase())); // Remove based on keys we *might* have set
    Array.from(params.keys()).forEach(key => { // Second pass to clean any remaining non-reserved params (maybe from old filters)
        if (!RESERVED_PARAMS_CAT.has(key.toLowerCase()) && !Object.keys(availableSpecs).some(specKey => specKey.toLowerCase() === key.toLowerCase())) {
           params.delete(key);
        }
    });


    // Set new filters
    if (filters.brands.length > 0) params.set('brand', filters.brands.map(b => b.toLowerCase()).join(','));
    if (filters.vendorIds.length > 0) { const domains = filters.vendorIds.map(id => vendorIdMap.get(id)?.url).filter((url): url is string => !!url).map(cleanDomainName).map(d => d.toLowerCase()).filter(Boolean); if (domains.length > 0) { params.set('store', domains.join(',')); } }
    Object.entries(filters.specs).forEach(([key, values]) => { if (values.length > 0) { params.set(key.toLowerCase(), values.map(v => v.toLowerCase()).join(',')); } });
    if (filters.deals) params.set('deals', '1');
    if (filters.certified) params.set('certified', '1');
    if (filters.nearby) params.set('nearby', '1');
    if (filters.boxnow) params.set('boxnow', '1');
    if (filters.instock) params.set('instock', '1');
    if (currentSortType !== DEFAULT_SORT_TYPE) { params.set('sort', currentSortType); } else { params.delete('sort'); } // Explicitly delete default sort

    setSearchParams(params, { replace: true });
  };

  // Effect 1: Load Category Data & Initial Products
  useEffect(() => {
    // Reset states relevant to category change
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
    // Don't reset activeFilters or sortType here, let Effect 3 handle sync from URL

    const pathSegments = location.pathname.split('/').filter(Boolean);
    let matchedCategory: Category | undefined;

    if (pathSegments.length >= 2 && pathSegments[0] === 'cat') {
      const segments = pathSegments.slice(1);
      const lastSegment = segments[segments.length - 1];
      matchedCategory = findCategory(lastSegment);
    } else if (defaultCategoryId !== null) {
      // Fallback to default main category if path is not a valid category path
      matchedCategory = mainCategories.find(cat => cat.id === defaultCategoryId);
    }

    if (matchedCategory) {
      setCurrentCategory(matchedCategory);
      // Only load products etc. if it's not a main category page showing subcategories
      if (matchedCategory.parentId !== null || !matchedCategory.isMain) {
          const productsForCategory = allMockProducts.filter(p => p.categoryIds?.includes(matchedCategory.id));
          setBaseCategoryProducts(productsForCategory);
          extractAvailableFilters(productsForCategory);
          updateCertifiedVendors(productsForCategory);
          // Let Effect 3 sync activeFilters state from URL after available options are set
      }
    } else {
      // Category not found or invalid path
      setCurrentCategory(undefined); // Explicitly set to undefined for NotFound check later
    }
  }, [location.pathname, defaultCategoryId]); // Rerun only when path changes or default ID is determined

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
              if (specValue != null && String(specValue).trim() !== '') { // Ensure value exists and isn't empty
                  const originalKey = specKey; // Keep original casing
                  const originalValue = String(specValue);
                  if (!specs[originalKey]) {
                      specs[originalKey] = new Set();
                  }
                  specs[originalKey].add(originalValue);
              }
          });
      });
      setAvailableBrands(brandsCount);
      setAvailableSpecs(specs);
      // Reset showMoreSpecs state based on newly available specs
      setShowMoreSpecs(Object.keys(specs).reduce((acc, key) => { acc[key] = false; return acc; }, {} as Record<string, boolean>));
  };

  const updateCertifiedVendors = (sourceProducts: Product[]) => {
      const vendorMap = new Map<number, Vendor>();
      sourceProducts.forEach(product => {
          (product.prices || []).forEach(price => {
              const vendor = vendorIdMap.get(price.vendorId);
              if (vendor && vendor.certification) {
                  vendorMap.set(vendor.id, vendor);
              }
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
      case 'price-asc': sorted.sort((a, b) => Math.min(...(a.prices || []).filter(p => p.inStock).map(p => p.discountPrice || p.price), Infinity) - Math.min(...(b.prices || []).filter(p => p.inStock).map(p => p.discountPrice || p.price), Infinity)); break;
      case 'price-desc': sorted.sort((a, b) => Math.max(...(b.prices || []).filter(p => p.inStock).map(p => p.discountPrice || p.price), 0) - Math.max(...(a.prices || []).filter(p => p.inStock).map(p => p.discountPrice || p.price), 0)); break;
      case 'alpha-asc': sorted.sort((a, b) => (a.title || '').localeCompare(b.title || '')); break;
      case 'reviews-desc': sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0)); break;
      case 'brand-asc': sorted.sort((a, b) => (a.brand || '').localeCompare(b.brand || '')); break;
      case 'merchants_desc': sorted.sort((a, b) => (b.prices || []).filter(p => p.inStock).length - (a.prices || []).filter(p => p.inStock).length); break;
      case 'newest-desc': sorted.sort((a, b) => { const dateA = new Date(a.releaseDate || a.dateAdded || 0).getTime(); const dateB = new Date(b.releaseDate || b.dateAdded || 0).getTime(); return dateB - dateA; }); break;
      case 'rating-desc': default: sorted.sort((a, b) => { const rA = a.rating || 0; const rB = b.rating || 0; const revA = a.reviews || 0; const revB = b.reviews || 0; return (rB - rA) || (revB - revA); }); break; // Default sort by rating then reviews
    }
    return sorted;
  };

  // --- Effect 2: Apply Filters and Sorting ---
  useEffect(() => {
    let productsToFilter = [...baseCategoryProducts];
    const currentFilters = activeFilters; // Use the state variable

    // Apply boolean filters
    if (currentFilters.instock) { productsToFilter = productsToFilter.filter(p => (p.prices || []).some(price => price.inStock)); }
    if (currentFilters.deals) { productsToFilter = productsToFilter.filter(p => (p.prices || []).some(price => price.discountPrice && price.discountPrice < price.price)); }
    if (currentFilters.certified) { productsToFilter = productsToFilter.filter(p => (p.prices || []).some(price => vendorIdMap.get(price.vendorId)?.certification)); }
    if (currentFilters.nearby) { console.warn("Nearby Filter Placeholder - Not implemented"); /* Add nearby logic if available */ }
    if (currentFilters.boxnow) { productsToFilter = productsToFilter.filter(p => (p.prices || []).some(price => vendorIdMap.get(price.vendorId)?.paymentMethods?.includes(PaymentMethod.PickupVia))); } // Assuming PickupVia relates to BoxNow

    // Apply multi-select filters (Brands)
    if (currentFilters.brands.length > 0) {
        const lowerCaseFilterBrands = currentFilters.brands.map(b => b.toLowerCase());
        productsToFilter = productsToFilter.filter(p => p.brand && lowerCaseFilterBrands.includes(p.brand.toLowerCase()));
    }

    // Apply multi-select filters (Vendors) - This applies ANY selected vendor
    if (currentFilters.vendorIds.length > 0) {
        productsToFilter = productsToFilter.filter(p =>
            (p.prices || []).some(price => currentFilters.vendorIds.includes(price.vendorId))
        );
    }

    // Apply multi-select filters (Specs)
    if (Object.keys(currentFilters.specs).length > 0) {
        productsToFilter = productsToFilter.filter(p =>
            Object.entries(currentFilters.specs).every(([filterKey, filterValues]) => {
                if (!filterValues || filterValues.length === 0) return true; // Skip if no values selected for this spec

                // Find the product's spec key matching the filter key (case-insensitive)
                const productSpecKey = Object.keys(p.specifications || {}).find(pk => pk.toLowerCase() === filterKey.toLowerCase());
                if (!productSpecKey || p.specifications[productSpecKey] === undefined || p.specifications[productSpecKey] === null) return false; // Product doesn't have this spec

                const productValueLower = String(p.specifications[productSpecKey]).toLowerCase();
                const filterValuesLower = filterValues.map(v => v.toLowerCase());

                return filterValuesLower.includes(productValueLower);
            })
        );
    }

    const sortedAndFiltered = sortProducts(productsToFilter);
    setFilteredProducts(sortedAndFiltered);

    // Update Slider Products based on deals/featured from BASE category products
    let sliderData = baseCategoryProducts.filter(p => p.prices.some(pr => pr.discountPrice && pr.discountPrice < pr.price)).slice(0, 10);
    if (sliderData.length === 0) { sliderData = baseCategoryProducts.filter(p => p.isFeatured).slice(0, 10); }
    if (sliderData.length === 0 && baseCategoryProducts.length > 0) { sliderData = [...baseCategoryProducts].sort((a,b) => (b.rating || 0) - (a.rating || 0)).slice(0,10); }
    setSliderProducts(sliderData);

  }, [activeFilters, baseCategoryProducts, sortType, vendorIdMap]); // Trigger on filters, base data, or sort change

  // --- Helper Function to Reconcile URL Filters with Available Options ---
  const reconcileFilters = (
      filtersFromUrl: ActiveFiltersState, // Contains lowercase/IDs from URL, spec keys might be original case now
      currentAvailableBrands: Record<string, number>, // Original case keys
      currentAvailableSpecs: Record<string, Set<string>> // Original case keys/values
  ): ActiveFiltersState => {
      // Reconcile Brands: Find original case brand name for each lowercase brand from URL
      const reconciledBrands = filtersFromUrl.brands
          .map(lowerBrand => Object.keys(currentAvailableBrands).find(b => b.toLowerCase() === lowerBrand))
          .filter((b): b is string => b !== undefined); // Filter out brands not actually available

      // Reconcile Specs: Match URL spec keys (already original case from getFiltersFromUrl) and values
      const reconciledSpecs = Object.entries(filtersFromUrl.specs).reduce((acc, [originalKey, lowerValuesFromUrl]) => {
          const availableValuesSet = currentAvailableSpecs[originalKey]; // Use original key
          if (availableValuesSet) {
              // Find original case values for each lowercase value from URL
              const originalValues = lowerValuesFromUrl
                  .map(lowerValue => Array.from(availableValuesSet).find(av => av.toLowerCase() === lowerValue))
                  .filter((v): v is string => v !== undefined); // Filter out values not actually available for this spec

              if (originalValues.length > 0) {
                  acc[originalKey] = originalValues; // Store with original key and original values
              }
          }
          return acc;
      }, {} as Record<string, string[]>);

      // Reconcile Vendor IDs: Ensure IDs from URL correspond to actual vendors
      const reconciledVendorIds = filtersFromUrl.vendorIds.filter(id => vendorIdMap.has(id));

      return {
          ...filtersFromUrl, // Keep boolean flags as they were from URL
          brands: reconciledBrands,
          specs: reconciledSpecs,
          vendorIds: reconciledVendorIds
      };
  };


  // Effect 3: Update activeFilters state AND sortType when URL parameters change OR when available options change
  useEffect(() => {
      // Only run reconciliation if available options have been populated OR category products loaded (relevant for initial load)
      if (Object.keys(availableBrands).length > 0 || Object.keys(availableSpecs).length > 0 || (currentCategory && !currentCategory.isMain)) {
          const filtersFromUrl = getFiltersFromUrl(availableSpecs); // Pass availableSpecs here
          const reconciledState = reconcileFilters(filtersFromUrl, availableBrands, availableSpecs);
          const sortFromUrl = searchParams.get('sort') || DEFAULT_SORT_TYPE;

          let stateChanged = false;

          // Update sort type if different
          if (sortFromUrl !== sortType) {
              setSortType(sortFromUrl);
              // Note: sort change will trigger Effect 2 automatically if needed
          }

          // Update active filters if different after reconciliation
          // Deep comparison needed for objects/arrays
          if (JSON.stringify(reconciledState) !== JSON.stringify(activeFilters)) {
              setActiveFilters(reconciledState);
              stateChanged = true;
          }

          // If the URL had filters that were removed during reconciliation (e.g., invalid brand/spec),
          // update the URL to reflect the clean state. Only do this if the state actually changed.
          if (stateChanged && JSON.stringify(filtersFromUrl) !== JSON.stringify(reconciledState)) {
             // Check if the *intended* state (from URL) differs from the *actual* state (reconciled)
             // This indicates some URL params were invalid/unavailable and got cleaned up.
             updateUrlParams(reconciledState, sortFromUrl);
          }
      }
  }, [searchParams, availableBrands, availableSpecs, baseCategoryProducts, currentCategory]); // React to URL, available options, and category loading


  // --- Filter Event Handlers ---
  const handleLinkFilterClick = (event: React.MouseEvent<HTMLAnchorElement>, handler: () => void) => { event.preventDefault(); handler(); };
  const createToggleHandler = (filterKey: keyof Omit<ActiveFiltersState, 'brands' | 'specs' | 'vendorIds'>) => {
      return () => {
          const newFilters = { ...activeFilters, [filterKey]: !activeFilters[filterKey] };
          setActiveFilters(newFilters);
          updateUrlParams(newFilters, sortType);
      };
  };
  const handleDealsToggle = createToggleHandler('deals');
  const handleCertifiedToggle = createToggleHandler('certified'); // General certified toggle
  const handleNearbyToggle = createToggleHandler('nearby');
  const handleBoxnowToggle = createToggleHandler('boxnow');
  const handleInstockToggle = createToggleHandler('instock');
  const handleBrandFilter = (brand: string) => {
      const currentBrands = activeFilters.brands;
      const newBrands = currentBrands.includes(brand)
          ? currentBrands.filter(b => b !== brand)
          : [...currentBrands, brand];
      const newFilters = { ...activeFilters, brands: newBrands };
      setActiveFilters(newFilters);
      updateUrlParams(newFilters, sortType);
  };
  const handleSpecFilter = (specKey: string, specValue: string) => {
      const currentSpecs = { ...activeFilters.specs };
      const specValues = currentSpecs[specKey] || [];
      const newSpecValues = specValues.includes(specValue)
          ? specValues.filter(v => v !== specValue)
          : [...specValues, specValue];

      if (newSpecValues.length === 0) {
          delete currentSpecs[specKey]; // Remove the key if no values are selected
      } else {
          currentSpecs[specKey] = newSpecValues;
      }
      const newFilters = { ...activeFilters, specs: currentSpecs };
      setActiveFilters(newFilters);
      updateUrlParams(newFilters, sortType);
  };

  // RENAMED: Handles generic add/remove for vendor IDs (multi-select behavior)
  // Used by Applied Filters removal
  const handleMultiVendorToggle = (vendor: Vendor) => {
    const currentVendorIds = activeFilters.vendorIds;
    // Standard toggle logic: add if not present, remove if present.
    const newVendorIds = currentVendorIds.includes(vendor.id)
        ? currentVendorIds.filter(id => id !== vendor.id)
        : [...currentVendorIds, vendor.id];
    const newFilters = { ...activeFilters, vendorIds: newVendorIds };
    setActiveFilters(newFilters);
    updateUrlParams(newFilters, sortType);
  };

  // NEW: Handles single-select logic for the Certified Vendors list
  const handleCertifiedVendorSelect = (vendor: Vendor) => {
    const currentVendorIds = activeFilters.vendorIds;
    let newVendorIds: number[];

    // If the *only* currently selected vendor is the one being clicked, deselect it.
    if (currentVendorIds.length === 1 && currentVendorIds[0] === vendor.id) {
        newVendorIds = [];
    } else {
        // Otherwise, select *only* this vendor, replacing any existing selection.
        newVendorIds = [vendor.id];
    }

    // Update state and URL
    // We only modify vendorIds here. The 'certified' boolean filter remains independent.
    const newFilters = { ...activeFilters, vendorIds: newVendorIds };
    setActiveFilters(newFilters);
    updateUrlParams(newFilters, sortType);
  };


  const handleResetFilters = () => {
      const resetState: ActiveFiltersState = { brands: [], specs: {}, vendorIds: [], deals: false, certified: false, nearby: false, boxnow: false, instock: false };
      setActiveFilters(resetState);
      setSortType(DEFAULT_SORT_TYPE); // Also reset sort type
      updateUrlParams(resetState, DEFAULT_SORT_TYPE);
  };

  // Handler for changing sort type
  const handleSortChange = (newSortType: string) => {
      if (newSortType !== sortType) {
        setSortType(newSortType);
        updateUrlParams(activeFilters, newSortType);
      }
  };

  // --- Scroll To Top Effect ---
  const isInitialSyncDone = useRef(false); // To prevent scroll on initial load/sync
  useEffect(() => {
      // Only scroll if it's not the very first render cycle after sync completes
      if (isInitialSyncDone.current) {
          const timer = setTimeout(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100); // Small delay to allow rendering updates
          return () => clearTimeout(timer);
      } else {
          // Mark initial sync as done after the first run of Effect 3 completes
          isInitialSyncDone.current = true;
      }
  }, [activeFilters, sortType]); // Scroll when filters or sort change (after initial load)


  // --- Misc Helper/UI Logic ---
  const displayedBrand = activeFilters.brands.length === 1 ? brands.find(b => b.name === activeFilters.brands[0]) : null;
  const handlePriceAlert = () => { if (!user) { toast({ title: 'Login Required', description: 'Please log in to set a price alert', variant: 'destructive' }); return; } if (currentCategory) { setPriceAlertContext({ categoryId: currentCategory.id, categoryName: currentCategory.name, filters: activeFilters }); setIsPriceAlertModalOpen(true); } else { toast({ title: 'Error', description: 'Cannot set alert, category context is missing.', variant: 'destructive' }); } };

   // --- Rendering Functions ---

  const renderBreadcrumbs = () => {
    const trailItems: React.ReactNode[] = [];
    trailItems.push(<li key="home"><Link to="/" rel="home"><span>BestPrice</span></Link></li>);

    if (currentCategory) {
        const ancestors: Category[] = [];
        let category: Category | undefined = currentCategory;

        // Traverse up the parent chain, excluding the current category itself initially
        while (category && category.parentId !== null) {
            const parent = allCategories.find((cat) => cat.id === category?.parentId);
            if (parent) {
                ancestors.unshift(parent); // Add parent to the beginning
                category = parent;
            } else {
                category = undefined; // Stop if parent not found
            }
        }

        // Add links for all ancestors
        ancestors.forEach((cat) => {
            trailItems.push(
                <li key={cat.id}>
                    <Link to={`/cat/${cat.id}/${cat.slug}`}>{cat.name}</Link>
                </li>
            );
        });

        // Add the current category name (not as a link)
        trailItems.push(
            <li key={currentCategory.id}>
                <span>{currentCategory.name}</span>
            </li>
        );
    }

    // Add separators between items
    return (
        <div id="trail">
            <nav className="breadcrumb">
                <ol>
                    {trailItems.reduce((acc: React.ReactNode[], item, index) => {
                        if (index > 0) {
                            // Add separator before items other than the first
                           acc.push(<span key={`sep-${index}`} className="trail__breadcrumb-separator">›</span>);
                        }
                        acc.push(item);
                        return acc;
                    }, [])}
                </ol>
            </nav>
        </div>
    );
  };


  const renderMainCategories = () => {
    if (!currentCategory || !currentCategory.isMain) { // Only render if it IS a main category
        return null;
    }
    const mainCat = currentCategory;
    const subcategories = categories.filter(cat => cat.parentId === mainCat.id);
    return (
      <>
        <div className="page-header">
            <div className="hgroup">
                <div className="page-header__title-wrapper">
                    <h1>{mainCat.name}</h1>
                </div>
            </div>
        </div>
        <div className="root-category__categories">
          {subcategories.length > 0 ? (
                subcategories.map((subCat) => (
                    <div key={subCat.id} className="root-category__category">
                        <Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover">
                            <img src={subCat.image || '/dist/images/cat/placeholder.webp'} alt={subCat.name} title={subCat.name} loading="lazy" width="200" height="150" />
                        </Link>
                        <h3 className="root-category__category-title">
                            <Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
                        </h3>
                        <div className="root-category__footer">
                           {/* Optionally show links to grandchildren */}
                           {/*
                            <div className="root-category__links">
                                {categories.filter(linkedSubCat => linkedSubCat.parentId === subCat.id).slice(0, 5).map((linkedSubCat, index, arr) => (
                                    <React.Fragment key={linkedSubCat.id}>
                                        <Link to={`/cat/${linkedSubCat.id}/${linkedSubCat.slug}`}>{linkedSubCat.name}</Link>
                                        {index < arr.length - 1 && ', '}
                                    </React.Fragment>
                                ))}
                            </div>
                           */}
                        </div>
                    </div>
                ))
          ) : (
              <p>Δεν υπάρχουν υποκατηγορίες για αυτήν την κατηγορία.</p>
          )}
        </div>
        <div className="sections"></div>
        {/* No price alert button on main category page */}
        {/* <div className="p__products-section"> ... </div> */}
      </>
    );
  };

  // Renders content for a subcategory page (either more subcategories or products)
  const renderSubcategoryContent = () => {
    if (!currentCategory || currentCategory.isMain) { // Only render if it's NOT a main category
        return null;
    }
    const childCategories = categories.filter(cat => cat.parentId === currentCategory.id);
    const parentCategory = allCategories.find(cat => cat.id === currentCategory.parentId);

    return (
      <>
        {/* Header with Back button */}
        <div className="page-header">
            <div className="hgroup">
                <div className="page-header__title-wrapper">
                    {parentCategory && (
                        <Link className="trail__back pressable" title={`Επιστροφή σε ${parentCategory.name}`} to={`/cat/${parentCategory.id}/${parentCategory.slug}`}>
                            <svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-right-thin-16" /></svg>
                        </Link>
                    )}
                    <h1>{currentCategory.name}</h1>
                </div>
            </div>
        </div>

        {/* Conditionally render child categories OR products */}
        {childCategories.length > 0 ? (
            // Display Child Categories Grid
            <div className="root-category__categories">
                {childCategories.map((subCat) => (
                    <div key={subCat.id} className="root-category__category">
                        <Link to={`/cat/${subCat.id}/${subCat.slug}`} className="root-category__cover">
                            <img src={subCat.image || '/dist/images/cat/placeholder.webp'} alt={subCat.name} title={subCat.name} loading="lazy" width="200" height="150"/>
                        </Link>
                        <h3 className="root-category__category-title">
                            <Link to={`/cat/${subCat.id}/${subCat.slug}`}>{subCat.name}</Link>
                        </h3>
                         {/* Optional grandchildren links */}
                         {/* <div className="root-category__footer"> ... </div> */}
                    </div>
                ))}
            </div>
        ) : (
            // Display Product Listing for this leaf category
            renderProducts()
        )}

        <div className="sections"></div>
        {/* Price Alert only if showing products */}
        {childCategories.length === 0 && baseCategoryProducts.length > 0 && (
            <div className="p__products-section">
                <div className="alerts">
                    <button data-url={`/cat/${currentCategory.id}/${currentCategory.slug}`} data-title={currentCategory.name} data-max-price="0" className="alerts__button pressable" onClick={handlePriceAlert}>
                        <svg aria-hidden="true" className="icon" width={20} height={20}><use href="/dist/images/icons/icons.svg#icon-notification-outline-20" /></svg>
                        <span className="alerts__label">Ειδοποίηση</span>
                    </button>
                    <div className="alerts__prompt">σε <span className="alerts__title">{currentCategory.name}</span></div>
                </div>
            </div>
        )}
      </>
    );
  };


  const renderAppliedFilters = () => {
        const { brands, specs, vendorIds, deals, certified, nearby, boxnow, instock } = activeFilters;
        const isAnyFilterActive = brands.length > 0 || Object.values(specs).some(v => v.length > 0) || vendorIds.length > 0 || deals || certified || nearby || boxnow || instock;
        if (!isAnyFilterActive) return null;

        // Helper to render a filter chip
        const renderChip = (key: string, title: string, label: string, onRemove: () => void) => (
            <h2 className="applied-filters__filter" key={key}>
                <a className="pressable" onClick={(e) => { e.preventDefault(); onRemove(); }} title={title}>
                    <span className="applied-filters__label">{label}</span>
                    <svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg>
                </a>
            </h2>
        );

        return (
            <div className="applied-filters">
                {instock && renderChip('instock', 'Αφαίρεση φίλτρου άμεσα διαθέσιμων προϊόντων', 'Άμεσα διαθέσιμα', handleInstockToggle)}
                {deals && renderChip('deals', 'Αφαίρεση φίλτρου προσφορών', 'Προσφορές', handleDealsToggle)}
                {certified && renderChip('certified', 'Αφαίρεση φίλτρου πιστοποιημένων καταστημάτων', 'Πιστοποιημένα', handleCertifiedToggle)}
                {nearby && renderChip('nearby', 'Αφαίρεση φίλτρου για καταστήματα κοντά μου', 'Κοντά μου', handleNearbyToggle)}
                {boxnow && renderChip('boxnow', 'Αφαίρεση φίλτρου παράδοσης προϊόντων με Box Now', 'Παράδοση με Box Now', handleBoxnowToggle)}
                {brands.map((brand) => renderChip(`brand-${brand}`, `Αφαίρεση φίλτρου του κατασκευαστή ${brand}`, brand, () => handleBrandFilter(brand)))}
                {Object.entries(specs).flatMap(([specKey, specValues]) =>
                    specValues.map((specValue) =>
                        renderChip(`spec-${specKey}-${specValue}`, `Αφαίρεση φίλτρου ${specKey}: ${specValue}`, `${specKey}: ${specValue}`, () => handleSpecFilter(specKey, specValue))
                    )
                )}
                {/* VENDOR FILTERS - Use the multi-toggle handler for removal */}
                {vendorIds.map((vendorId) => {
                    const vendor = vendorIdMap.get(vendorId);
                    return vendor ? renderChip(`vendor-${vendor.id}`, `Αφαίρεση φίλτρου από το κατάστημα ${vendor.name}`, vendor.name, () => handleMultiVendorToggle(vendor)) : null;
                })}

                <button className="applied-filters__reset pressable" onClick={handleResetFilters} title="Επαναφορά όλων των φίλτρων">
                    <svg aria-hidden="true" className="icon" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-refresh"></use></svg>
                    <span>Καθαρισμός όλων</span>
                </button>
            </div>
        );
    };

  // Renders the main content area including sidebar and product grid for Category Page
  const renderProducts = () => {
    const { brands: activeBrandFilters, specs: activeSpecFilters, vendorIds: activeVendorIds, ...restActiveFilters } = activeFilters;
    const isAnyFilterActive = activeBrandFilters.length > 0 || Object.values(activeSpecFilters).some(v => v.length > 0) || activeVendorIds.length > 0 || Object.values(restActiveFilters).some(v => v === true);

    // Early return if no base products to filter from
    if (!currentCategory || baseCategoryProducts.length === 0) {
        return (
            <main className="page-products__main">
                <p>Δεν υπάρχουν διαθέσιμα προϊόντα για αυτήν την κατηγορία αυτή τη στιγμή.</p>
            </main>
        );
    }

    return (
      <div className="page-products">
         {/* ASIDE FILTERS */}
         <aside className="page-products__filters">
            <div id="filters" role="complementary" aria-labelledby="filters-header" data-label={currentCategory.name}>
              <div className="filters__header">
                <div className="filters__header-title filters__header-title--filters">Φίλτρα</div>
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
                        {sortedAvailableBrandKeys.slice(0, showMoreBrands ? sortedAvailableBrandKeys.length : MAX_DISPLAY_COUNT).map((brand) => (
                          <li key={brand} className={`pressable ${activeFilters.brands.includes(brand) ? 'selected' : ''}`}>
                            {/* Use onClick on li or a button inside for better semantics */}
                            <a href="#" onClick={(e) => { e.preventDefault(); handleBrandFilter(brand); }} data-c={availableBrands[brand]}>
                                {brand}
                            </a>
                          </li>
                        ))}
                      </ol>
                       {sortedAvailableBrandKeys.length > MAX_DISPLAY_COUNT && (
                          <div className="filters-more-prompt pressable" onClick={() => setShowMoreBrands(prev => !prev)} title={showMoreBrands ? "Λιγότεροι κατασκευαστές" : "Όλοι οι κατασκευαστές"}>
                            <svg aria-hidden="true" className="icon" width={10} height={10} viewBox="0 0 10 10"><path fillRule="evenodd" d={showMoreBrands ? "M9.5 6H0.5C0.224 6 0 5.776 0 5.5V4.5C0 4.224 0.224 4 0.5 4H9.5C9.776 4 10 4.224 10 4.5V5.5C10 5.776 9.776 6 9.5 6Z" : "M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"} /></svg>
                            {showMoreBrands ? "Εμφάνιση λιγότερων" : "Εμφάνιση όλων"}
                          </div>
                       )}
                    </div>
                 </div>
              )}

              {/* Specs Filters with Show More */}
               {sortedAvailableSpecKeys.length > 0 && (
                    sortedAvailableSpecKeys.map((specKey) => {
                        const specValuesSet = availableSpecs[specKey];
                        if (!specValuesSet || specValuesSet.size === 0) return null; // Skip if no values for this spec
                        const specValuesArray = Array.from(specValuesSet).sort(); // Sort values alphabetically
                        const isExpanded = showMoreSpecs[specKey] || false;

                        return (
                            <div key={specKey} className={`filter-${specKey.toLowerCase().replace(/\s+/g, '-')} default-list`} data-filter-name={specKey} data-key={specKey.toLowerCase()}>
                                <div className="filter__header"><h4>{specKey}</h4></div>
                                <div className="filter-container">
                                    <ol aria-expanded={isExpanded}>
                                        {specValuesArray.slice(0, isExpanded ? specValuesArray.length : MAX_DISPLAY_COUNT).map((specValue) => (
                                            <li key={specValue} className={`pressable ${activeFilters.specs[specKey]?.includes(specValue) ? 'selected' : ''}`}>
                                              <a href="#" onClick={(e) => {e.preventDefault(); handleSpecFilter(specKey, specValue); }}>
                                                <span>{specValue}</span>
                                              </a>
                                            </li>
                                        ))}
                                    </ol>
                                    {specValuesArray.length > MAX_DISPLAY_COUNT && (
                                        <div className="filters-more-prompt pressable" onClick={() => setShowMoreSpecs(prev => ({...prev, [specKey]: !prev[specKey]}))} title={isExpanded ? `Λιγότερες επιλογές ${specKey}` : `Όλες οι επιλογές ${specKey}`}>
                                            <svg aria-hidden="true" className="icon" width={10} height={10} viewBox="0 0 10 10"><path fillRule="evenodd" d={isExpanded ? "M9.5 6H0.5C0.224 6 0 5.776 0 5.5V4.5C0 4.224 0.224 4 0.5 4H9.5C9.776 4 10 4.224 10 4.5V5.5C10 5.776 9.776 6 9.5 6Z" : "M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"} /></svg>
                                            {isExpanded ? "Εμφάνιση λιγότερων" : "Εμφάνιση όλων"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}

              {/* Certified Vendors Filter with Show More - SINGLE SELECT */}
              {certifiedVendors.length > 0 && (
                  <div className="filter-store filter-collapsed default-list" data-filter-name="Πιστοποιημένα καταστήματα" data-filter-id="store" data-type="store" data-key="store">
                      <div className="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div>
                      <div className="filter-container">
                          <ol aria-expanded={showMoreVendors}>
                              {certifiedVendors.slice(0, showMoreVendors ? certifiedVendors.length : MAX_DISPLAY_COUNT).map(vendor => (
                                  <li key={vendor.id}
                                      title={`Το κατάστημα ${vendor.name} (${cleanDomainName(vendor.url)}) διαθέτει ${vendor.certification} πιστοποίηση`}
                                      // UPDATED selected class logic for single-select visual feedback
                                      className={`pressable ${activeFilters.vendorIds.length === 1 && activeFilters.vendorIds[0] === vendor.id ? 'selected' : ''}`}
                                    >
                                      {/* UPDATED onClick to use the new single-select handler */}
                                      <Link to="#"
                                          data-l={vendor.certification === 'Gold' ? '3' : vendor.certification === 'Silver' ? '2' : '1'}
                                          onClick={(e) => handleLinkFilterClick(e, () => handleCertifiedVendorSelect(vendor))} // Use NEW handler
                                        >
                                          <span>{vendor.name}</span>
                                      </Link>
                                  </li>
                              ))}
                          </ol>
                          {certifiedVendors.length > MAX_DISPLAY_COUNT && (
                              <div className="filters-more-prompt pressable" onClick={() => setShowMoreVendors(prev => !prev)}>
                                  <svg aria-hidden="true" className="icon" width={10} height={10} viewBox="0 0 10 10"><path fillRule="evenodd" d={showMoreVendors ? "M9.5 6H0.5C0.224 6 0 5.776 0 5.5V4.5C0 4.224 0.224 4 0.5 4H9.5C9.776 4 10 4.224 10 4.5V5.5C10 5.776 9.776 6 9.5 6Z" : "M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"} /></svg>
                                  {showMoreVendors ? "Εμφάνιση λιγότερων" : "Εμφάνιση όλων"}
                              </div>
                          )}
                      </div>
                  </div>
              )}

            </div>
            </aside>
         {/* END ASIDE FILTERS */}

        <main className="page-products__main">
          {/* Header for Product List */}
          <header className="page-header">
              <div className="page-header__title-wrapper">
                <div className="page-header__title-main">
                  {/* Title and count are already rendered in renderSubcategoryContent header */}
                  {/* We only need the count and alert button here potentially */}
                   <div className="page-header__count-wrapper">
                    <div className="page-header__count">{filteredProducts.length} {filteredProducts.length === 1 ? 'προϊόν' : 'προϊόντα'}</div>
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
                <div className="products-wrapper">
                    <div className="products-wrapper__header">
                        <div className="products-wrapper__title">
                            {activeFilters.deals ? 'Επιλεγμένες προσφορές' : 'Δημοφιλή επιλογές'}
                        </div>
                    </div>
                    <ScrollableSlider>
                        <div className="p__products--scroll p__products--inline scroll__content">
                            {sliderProducts.map(prod => (
                                <InlineProductItem key={`slider-${prod.id}`} product={prod} bpref="cat-slider-inline"/>
                            ))}
                        </div>
                    </ScrollableSlider>
                </div>
              )}
              {/* Sorting Tabs */}
              {filteredProducts.length > 0 && (
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

          {/* Product Grid / No Results */}
          <div className="page-products__main-wrapper">
            {filteredProducts.length > 0 ? (
              <div className="p__products" data-pagination="">
                {filteredProducts.map((product) => ( <ProductCard key={product.id} product={product} /> ))}
              </div>
            ) : (
              // Only show "no results" if filters *were* applied to an existing base set
              isAnyFilterActive && baseCategoryProducts.length > 0 ? (
                  <div id="no-results">
                      <h3>Δεν βρέθηκαν προϊόντα στην κατηγορία <strong>{currentCategory.name}</strong> που να πληρούν τις επιλογές αναζήτησης.</h3>
                      <div id="no-results-suggestions">
                          <p><strong>Προτάσεις:</strong></p>
                          <ul>
                              <li>Δες <Link to={location.pathname} onClick={(e) => { e.preventDefault(); handleResetFilters(); }}>όλα τα προϊόντα της κατηγορίας</Link>.</li>
                              <li>Δοκίμασε να <Link to="#" onClick={(e) => { e.preventDefault(); handleResetFilters(); }}>αφαιρέσεις κάποιο φίλτρο</Link>.</li>
                              <li>Επέστρεψε στην <Link to="/">αρχική σελίδα του BestPrice</Link>.</li>
                          </ul>
                      </div>
                  </div>
              ) : (
                  // This case should ideally be covered by the check at the start of renderProducts
                  // but keep as a fallback.
                  <p>Δεν υπάρχουν προϊόντα για αυτήν την κατηγορία.</p>
              )
            )}
          </div>
        </main>
      </div>
    );
   };

  // --- Merchant Info Rendering ---
  const renderMerchantInformation = () => {
    // Uses `selectedVendor` which is calculated based on activeFilters.vendorIds
    if (!selectedVendor) { return null; }
    const vendor = selectedVendor; // Already confirmed it's a single vendor
    const removeThisVendorFilter = (e: React.MouseEvent) => {
        e.preventDefault();
        // Use the multi-toggle handler to simply remove this ID
        handleMultiVendorToggle(vendor);
    };
    return (
        <div className="root__wrapper information information--center" data-type="merchant-brand">
            <div className="root">
                <div data-tooltip-no-border="" data-tooltip={`Πληροφορίες για το πιστοποιημένο (${vendor.certification}) κατάστημα ${vendor.name}`}>
                    <div className="merchant-logo">
                        <Link to={`/m/${vendor.id}/${vendor.name?.toLowerCase().replace(/\s+/g, '-')}`}>
                            <img loading="lazy" src={vendor.logo} width={90} height={30} alt={`${vendor.name} logo`} />
                        </Link>
                        <svg aria-hidden="true" className="icon merchant__certification" width={22} height={22}><use href={`/dist/images/icons/certification.svg#icon-${vendor.certification?.toLowerCase()}-22`}></use></svg>
                    </div>
                </div>
                <div className="information__content">
                    <p>Εμφανίζονται προϊόντα από το κατάστημα <strong><Link to={`/m/${vendor.id}/${vendor.name?.toLowerCase().replace(/\s+/g, '-')}`}>{vendor.name}</Link></strong></p>
                    <p><Link to="#" onClick={removeThisVendorFilter}>Αφαίρεση φίλτρου</Link></p>
                </div>
                <span><svg aria-hidden="true" className="icon information__close pressable" width={12} height={12} onClick={removeThisVendorFilter}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></span>
            </div>
        </div>
    );
  };

  // --- Main Return Structure ---
  // Show NotFound if the path looks like a category but no category was matched after Effect 1
  if (location.pathname.startsWith('/cat/') && !currentCategory && !defaultCategoryId) {
      return <NotFound />;
  }
  // Also handle case where default category couldn't be found
  if (!location.pathname.startsWith('/cat/') && defaultCategoryId && !currentCategory) {
       return <NotFound />; // Or a specific error page / loading state
  }


  return (
    <>
      {renderMerchantInformation()}
      <div className="root__wrapper root-category__root">
        <div className="root">
          {renderBreadcrumbs()}
          {currentCategory?.isMain ? renderMainCategories() : renderSubcategoryContent()}

           {/* Price Alert Modal (Rendered conditionally inside based on context) */}
           {isPriceAlertModalOpen && priceAlertContext && (
               <PriceAlertModal
                 isOpen={isPriceAlertModalOpen}
                 onClose={() => setIsPriceAlertModalOpen(false)}
                 alertType="category"
                 categoryId={priceAlertContext.categoryId}
                 categoryName={priceAlertContext.categoryName}
                 categoryFilters={priceAlertContext.filters} // Pass the active filters at time of opening
                />
           )}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
