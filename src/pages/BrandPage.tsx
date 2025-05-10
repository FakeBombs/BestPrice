import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link, useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Brand, brands, getBrandById } from '@/data/brandData';
import { Category, categories, mainCategories } from '@/data/categoriesData';
import { Product, products as allMockProducts, ProductPrice } from '@/data/productData';
import { Vendor, vendors as allVendors, PaymentMethod } from '@/data/vendorData';
import { getProductsByBrandName, getVendorById as findVendorById } from '@/data/helpers';
import NotFound from '@/pages/NotFound';
import ProductCard from '@/components/ProductCard';
import ScrollableSlider from '@/components/ScrollableSlider';
import { useTranslation } from '@/hooks/useTranslation';
import { cleanDomainName } from '@/utils/textFormatters';

const MAX_DISPLAY_COUNT = 10; // For filters like categories, specs
const DEFAULT_SORT_TYPE = 'rating-desc';

// Helper to get effective lowest price (copied from GiftsFiltered.tsx or helpers.ts)
const getEffectiveLowestPrice = (product: Product): number => {
    if (!product.prices || product.prices.length === 0) return Infinity;
    const inStockPrices = product.prices.filter(pr => pr.inStock);
    const pricesToConsider = inStockPrices.length > 0 ? inStockPrices : product.prices;
    if (pricesToConsider.length === 0) return Infinity;
    return Math.min(...pricesToConsider.map(pr => pr.discountPrice ?? pr.price));
};


interface ActiveBrandPageFilters {
    categoryIds: number[];
    vendorIds: number[];
    specs: Record<string, string[]>;
    deals: boolean;
    certified: boolean;
    // nearby: boolean; // Not implemented here for brevity
    // boxnow: boolean; // Not implemented here for brevity
    inStock: boolean;
}

const BrandPage = () => {
    const { t } = useTranslation();
    const { brandId: brandIdParam } = useParams<{ brandId: string }>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [currentBrand, setCurrentBrand] = useState<Brand | null | undefined>(undefined);
    const [baseBrandProducts, setBaseBrandProducts] = useState<Product[]>([]); // Products of the current brand BEFORE other filters
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    // Filter-related states
    const [activeFilters, setActiveFilters] = useState<ActiveBrandPageFilters>(() => {
        const catsFromUrl = searchParams.get('categories')?.split(',').map(Number).filter(Boolean) || [];
        const vendorsFromUrl = searchParams.get('vendors')?.split(',').map(Number).filter(Boolean) || [];
        // Specs from URL would be more complex to parse here, starting simple
        return {
            categoryIds: catsFromUrl,
            vendorIds: vendorsFromUrl,
            specs: {},
            deals: searchParams.get('deals') === '1',
            certified: searchParams.get('certified') === '1',
            inStock: searchParams.get('instock') === '1',
        };
    });

    const [availableCategories, setAvailableCategories] = useState<{ id: number; name: string; slug: string; count: number; }[]>([]);
    const [availableVendors, setAvailableVendors] = useState<{ id: number; name: string; count: number; certification?: string }[]>([]);
    const [availableSpecs, setAvailableSpecs] = useState<Record<string, { value: string; count: number }[]>>({});
    const [certifiedVendorsForFilter, setCertifiedVendorsForFilter] = useState<Vendor[]>([]);


    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const [showMoreSpecs, setShowMoreSpecs] = useState<Record<string, boolean>>({});
    const [showMoreVendors, setShowMoreVendors] = useState(false);

    const [sortType, setSortType] = useState<string>(() => searchParams.get('sort') || DEFAULT_SORT_TYPE);
    const [loading, setLoading] = useState(true);

    const vendorIdMap = useMemo(() => new Map(allVendors.map(v => [v.id, v])), []);


    // 1. Fetch Brand Details and its base products
    useEffect(() => {
        setLoading(true);
        setCurrentBrand(undefined);
        setBaseBrandProducts([]);

        const numericBrandId = brandIdParam ? parseInt(brandIdParam, 10) : NaN;
        if (isNaN(numericBrandId)) {
            setCurrentBrand(null); setLoading(false); return;
        }
        const fetchedBrand = getBrandById(numericBrandId); // From helpers.ts
        setCurrentBrand(fetchedBrand || null);

        if (fetchedBrand) {
            // If your Product interface has brandId:
            // const productsForBrand = allMockProducts.filter(p => p.brandId === fetchedBrand.id);
            // Otherwise, filter by name (less robust if names aren't unique but IDs are):
            const productsForBrand = allMockProducts.filter(p => p.brand?.toLowerCase() === fetchedBrand.name.toLowerCase());
            setBaseBrandProducts(productsForBrand);
        }
        setLoading(false);
    }, [brandIdParam]);

    // 2. Extract available filters whenever baseBrandProducts change
    useEffect(() => {
        if (baseBrandProducts.length === 0) {
            setAvailableCategories([]);
            setAvailableVendors([]);
            setAvailableSpecs({});
            setCertifiedVendorsForFilter([]);
            return;
        }

        const categoryCounts: Record<number, number> = {};
        const vendorCounts: Record<number, number> = {};
        const specCounts: Record<string, Record<string, number>> = {};
        const tempCertifiedVendors = new Map<number, Vendor>();

        baseBrandProducts.forEach(product => {
            product.categoryIds.forEach(catId => {
                categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
            });
            product.prices.forEach(price => {
                vendorCounts[price.vendorId] = (vendorCounts[price.vendorId] || 0) + 1;
                const vendor = vendorIdMap.get(price.vendorId);
                if (vendor?.certification) {
                    tempCertifiedVendors.set(vendor.id, vendor);
                }
            });
            if (product.specifications) {
                Object.entries(product.specifications).forEach(([key, value]) => {
                    if (!specCounts[key]) specCounts[key] = {};
                    const stringValue = String(value);
                    specCounts[key][stringValue] = (specCounts[key][stringValue] || 0) + 1;
                });
            }
        });

        const allCatsMap = new Map([...mainCategories, ...categories].map(c => [c.id, c]));
        setAvailableCategories(
            Object.entries(categoryCounts).map(([idStr, count]) => {
                const category = allCatsMap.get(parseInt(idStr));
                return { id: parseInt(idStr), name: category ? t(category.slug, category.name) : 'Unknown', slug: category?.slug || '', count };
            }).filter(cat => cat.name !== 'Unknown').sort((a,b) => b.count - a.count)
        );

        setAvailableVendors(
            Object.entries(vendorCounts).map(([idStr, count]) => {
                const vendor = vendorIdMap.get(parseInt(idStr));
                return { id: parseInt(idStr), name: vendor?.name || 'Unknown Vendor', count, certification: vendor?.certification };
            }).filter(v => v.name !== 'Unknown Vendor').sort((a,b) => b.count - a.count)
        );

        const specsForState: Record<string, { value: string; count: number }[]> = {};
        Object.entries(specCounts).forEach(([specKey, valueCounts]) => {
            specsForState[specKey] = Object.entries(valueCounts)
                .map(([value, count]) => ({ value, count }))
                .sort((a, b) => b.count - a.count);
        });
        setAvailableSpecs(specsForState);
        setShowMoreSpecs(Object.keys(specsForState).reduce((acc, key) => { acc[key] = false; return acc; }, {} as Record<string, boolean>));
        
        setCertifiedVendorsForFilter(Array.from(tempCertifiedVendors.values()).sort((a, b) => {
             const levels: Record<string, number> = { Gold: 3, Silver: 2, Bronze: 1 };
             return (levels[b.certification!] || 0) - (levels[a.certification!] || 0);
        }));

    }, [baseBrandProducts, t, vendorIdMap]);


    // 3. Filter and Sort Products when activeFilters, sortType, or baseBrandProducts change
    useEffect(() => {
        let productsToProcess = [...baseBrandProducts];

        // Apply category filters
        if (activeFilters.categoryIds.length > 0) {
            productsToProcess = productsToProcess.filter(p =>
                activeFilters.categoryIds.some(catId => p.categoryIds.includes(catId))
            );
        }
        // Apply vendor filters
        if (activeFilters.vendorIds.length > 0) {
            productsToProcess = productsToProcess.filter(p =>
                p.prices.some(price => activeFilters.vendorIds.includes(price.vendorId))
            );
        }
        // Apply spec filters
        if (Object.keys(activeFilters.specs).length > 0) {
            productsToProcess = productsToProcess.filter(p =>
                Object.entries(activeFilters.specs).every(([filterKey, filterValues]) => {
                    if (!filterValues || filterValues.length === 0) return true;
                    const productSpecValue = p.specifications?.[filterKey];
                    return productSpecValue !== undefined && filterValues.includes(String(productSpecValue));
                })
            );
        }
        // Apply boolean filters
        if (activeFilters.inStock) {
            productsToProcess = productsToProcess.filter(p => p.prices.some(price => price.inStock));
        }
        if (activeFilters.deals) {
            productsToProcess = productsToProcess.filter(p => p.prices.some(price => price.discountPrice && price.discountPrice < price.price));
        }
        if (activeFilters.certified) {
            productsToProcess = productsToProcess.filter(p => p.prices.some(price => vendorIdMap.get(price.vendorId)?.certification));
        }

        // Sort
        const sorted = [...productsToProcess]; // Create a new array for sorting
        switch (sortType) {
            case 'price-asc': sorted.sort((a, b) => getEffectiveLowestPrice(a) - getEffectiveLowestPrice(b)); break;
            case 'price-desc': sorted.sort((a, b) => getEffectiveLowestPrice(b) - getEffectiveLowestPrice(a)); break;
            case 'merchants_desc': sorted.sort((a,b) => (b.prices?.filter(p => p.inStock).length || 0) - (a.prices?.filter(p => p.inStock).length || 0)); break;
            case 'rating-desc': default: sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0)); break;
        }
        setFilteredProducts(sorted);

    }, [activeFilters, sortType, baseBrandProducts, vendorIdMap]);


    // 4. Sync filters and sort to URL
    useEffect(() => {
        const params = new URLSearchParams();
        if (activeFilters.categoryIds.length > 0) params.set('categories', activeFilters.categoryIds.join(','));
        if (activeFilters.vendorIds.length > 0) params.set('vendors', activeFilters.vendorIds.join(','));
        // Specs to URL is more complex, skipping for this example to keep it focused
        if (activeFilters.deals) params.set('deals', '1');
        if (activeFilters.certified) params.set('certified', '1');
        if (activeFilters.inStock) params.set('instock', '1');
        if (sortType !== DEFAULT_SORT_TYPE) params.set('sort', sortType);

        // Only update if params changed
        if (params.toString() !== searchParams.toString().split('&').filter(p => !p.startsWith('brand=')).join('&')) { // Preserve existing non-filter params
            setSearchParams(params, { replace: true });
        }
    }, [activeFilters, sortType, setSearchParams, searchParams]);

    // Scroll to top on filter/sort change
    const isInitialLoad = React.useRef(true);
    useEffect(() => {
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeFilters, sortType]);


    // --- Event Handlers for Filters ---
    const handleLinkFilterClick = (event: React.MouseEvent<HTMLAnchorElement>, handler: () => void) => { event.preventDefault(); handler(); };
    const createToggleHandler = (filterKey: keyof Pick<ActiveBrandPageFilters, 'deals' | 'certified' | 'inStock'>) => {
        return () => setActiveFilters(prev => ({ ...prev, [filterKey]: !prev[filterKey] }));
    };
    const handleDealsToggle = createToggleHandler('deals');
    const handleCertifiedToggle = createToggleHandler('certified');
    const handleInStockToggle = createToggleHandler('inStock');

    const handleCategoryFilter = (categoryId: number) => {
        setActiveFilters(prev => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter(id => id !== categoryId)
                : [...prev.categoryIds, categoryId]
        }));
    };
    const handleVendorFilter = (vendorId: number) => {
        setActiveFilters(prev => ({
            ...prev,
            vendorIds: prev.vendorIds.includes(vendorId)
                ? prev.vendorIds.filter(id => id !== vendorId)
                : [...prev.vendorIds, vendorId]
        }));
    };
    const handleSpecFilter = (specKey: string, specValue: string) => {
        setActiveFilters(prev => {
            const currentSpecs = { ...(prev.specs[specKey] || []) };
            const newSpecValues = currentSpecs[specKey]?.includes(specValue)
                ? currentSpecs[specKey]?.filter((v: string) => v !== specValue)
                : [...(currentSpecs[specKey] || []), specValue];
            
            const updatedSpecs = { ...prev.specs };
            if (newSpecValues && newSpecValues.length > 0) {
                updatedSpecs[specKey] = newSpecValues;
            } else {
                delete updatedSpecs[specKey];
            }
            return { ...prev, specs: updatedSpecs };
        });
    };
    const handleResetFilters = () => {
        setActiveFilters({ categoryIds: [], vendorIds: [], specs: {}, deals: false, certified: false, inStock: false });
        setSortType(DEFAULT_SORT_TYPE);
    };
    const handleSortChange = (newSortType: string) => {
        if (newSortType !== sortType) {
            setSortType(newSortType);
        }
    };
    // --- End Filter Handlers ---

    // --- renderMerchantInformation (Simplified from Categories.tsx) ---
    const selectedVendorForInfo = useMemo(() => {
        if (activeFilters.vendorIds.length === 1) {
            return findVendorById(activeFilters.vendorIds[0]); // Use your helper
        }
        return null;
    }, [activeFilters.vendorIds]);

    const renderMerchantInformation = () => {
        if (!selectedVendorForInfo) return null;
        const vendor = selectedVendorForInfo;
        const removeThisVendorFilter = (e: React.MouseEvent) => {
            e.preventDefault();
            handleVendorFilter(vendor.id); // Deselect this vendor
        };
        const vendorUrl = `/m/${vendor.id}/${vendor.slug || vendor.name?.toLowerCase().replace(/\s+/g, '-') || vendor.id}`;
        return (
            <div className="root__wrapper information information--center" data-type="merchant-brand">
                <div className="root">
                    {vendor.logo && (
                        <div data-tooltip-no-border="" data-tooltip={`${t('info_for_certified_store', 'Information for store')} ${vendor.name} ${vendor.certification ? `(${vendor.certification})` : ''}`}>
                            <div className="merchant-logo">
                                <Link to={vendorUrl}><img loading="lazy" src={vendor.logo} width={90} height={30} alt={`${vendor.name} logo`} /></Link>
                                {vendor.certification && <svg aria-hidden="true" className="icon merchant__certification" width={22} height={22}><use href={`/dist/images/icons/certification.svg#icon-${vendor.certification?.toLowerCase()}-22`}></use></svg>}
                            </div>
                        </div>
                    )}
                    <div className="information__content">
                        <p>{t('showing_products_from_store', 'Showing products from store')} <strong><Link to={vendorUrl}>{vendor.name}</Link></strong></p>
                        <p><a href="#" onClick={removeThisVendorFilter}>{t('remove_filter', 'Remove this filter')}</a></p>
                    </div>
                    <span><svg aria-hidden="true" className="icon information__close pressable" width={12} height={12} onClick={removeThisVendorFilter}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></span>
                </div>
            </div>
        );
    };
    // --- End renderMerchantInformation ---


    if (loading) return <div>{t('loading_brand_data', 'Loading Brand Data...')}</div>;
    if (!currentBrand) return <NotFound />;

    const isAnyFilterActive = activeFilters.categoryIds.length > 0 ||
                             activeFilters.vendorIds.length > 0 ||
                             Object.values(activeFilters.specs).some(v => v.length > 0) ||
                             activeFilters.deals || activeFilters.certified || activeFilters.inStock;

    return (
        <> {/* Added Fragment because renderMerchantInformation is outside the main div */}
        {renderMerchantInformation()}
        <div className="root__wrapper">
            <div className="root">
                <div id="trail">
                    <nav className="breadcrumb">
                        <ol>
                            <li><Link to="/" rel="home"><span>{t('breadcrumbHome', 'BestPrice')}</span></Link><span className="trail__breadcrumb-separator">›</span></li>
                            <li><span>{currentBrand.name}</span></li>
                        </ol>
                    </nav>
                </div>
                <div className="page-products">
                    <aside className="page-products__filters">
                        <div id="filters" role="complementary" aria-labelledby="filters-header">
                            <div className="filters__header">
                                <div className="filters__header-title filters__header-title--filters">{t('filters_title', 'Filters')}</div>
                                {isAnyFilterActive && (
                                    <Link to="#" onClick={(e) => handleLinkFilterClick(e, handleResetFilters)} className="pressable filters__header-remove popup-anchor" data-tooltip={t('remove_all_filters_tooltip','Remove all filters')} data-tooltip-no-border="" data-tooltip-small="true">{t('clear_all_filters','Clear All')}</Link>
                                )}
                            </div>
                            
                            {/* Show Only Filters */}
                            <div className="filter-limit default-list">
                                <div className="filter__header"><h4>{t('show_only_title','Show only')}</h4></div>
                                <div className="filter-container">
                                    <ol>
                                        <li data-filter="deals" className={`pressable ${activeFilters.deals ? 'selected' : ''}`}><Link to="#" title={t('deals_title','Products with significant price drop')} rel="nofollow" onClick={(e) => handleLinkFilterClick(e, handleDealsToggle)}><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-flame-16"></use></svg><span>{t('deals_label','Deals')}</span></Link></li>
                                        <li data-filter="certified" className={`pressable ${activeFilters.certified ? 'selected' : ''}`}><Link to="#" title={t('certified_stores_title','Certified Stores')} rel="nofollow" onClick={(e) => handleLinkFilterClick(e, handleCertifiedToggle)}><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-certified-16"></use></svg><span>{t('certified_label','Certified')}</span></Link></li>
                                        <li data-filter="in-stock" className={`pressable ${activeFilters.inStock ? 'selected' : ''}`}><Link to="#" title={t('instock_title','Only products available in stock')} rel="nofollow" onClick={(e) => handleLinkFilterClick(e, handleInStockToggle)}><span>{t('instock_label','In Stock')}</span></Link></li>
                                    </ol>
                                </div>
                            </div>

                            {/* Categories Filter */}
                            {availableCategories.length > 0 && (
                                <div className="filters__categories default-list" data-filter-name={t('categories', 'Categories')}>
                                    <div className="filter__header"><h4>{t('categories', 'Categories')}</h4></div>
                                    <div className="filter-container">
                                        <ol aria-expanded={showMoreCategories}>
                                            {availableCategories.slice(0, showMoreCategories ? availableCategories.length : MAX_DISPLAY_COUNT).map(cat => (
                                                <li key={cat.id} className={`pressable ${activeFilters.categoryIds.includes(cat.id) ? 'selected' : ''}`}>
                                                    <a href="#" onClick={(e) => { e.preventDefault(); handleCategoryFilter(cat.id); }} data-c={cat.count}>{cat.name}</a>
                                                </li>
                                            ))}
                                        </ol>
                                        {availableCategories.length > MAX_DISPLAY_COUNT && (
                                            <div className="filters-more-prompt pressable" onClick={() => setShowMoreCategories(prev => !prev)} title={showMoreCategories ? t('show_less', 'Show Less') : t('show_all', 'Show All')}>
                                                <svg aria-hidden="true" className="icon" width={10} height={10} viewBox="0 0 10 10"><path fillRule="evenodd" d={showMoreCategories ? "M9.5 6H0.5C0.224 6 0 5.776 0 5.5V4.5C0 4.224 0.224 4 0.5 4H9.5C9.776 4 10 4.224 10 4.5V5.5C10 5.776 9.776 6 9.5 6Z" : "M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"} /></svg>
                                                {showMoreCategories ? t('show_less') : t('show_all')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Specs Filters */}
                            {Object.entries(availableSpecs).map(([specKey, specOptions]) => {
                                if (specOptions.length === 0) return null;
                                const isExpanded = showMoreSpecs[specKey] || false;
                                const translatedSpecKey = t(specKey.toLowerCase().replace(/\s+/g, '-'), specKey);
                                return (
                                    <div key={specKey} className={`filter-${specKey.toLowerCase().replace(/\s+/g, '-')} default-list`} data-filter-name={translatedSpecKey} data-type="list" data-key={specKey.toLowerCase()}>
                                        <div className="filter__header"><h4>{translatedSpecKey}</h4></div>
                                        <div className="filter-container">
                                            <ol aria-expanded={isExpanded}>
                                                {specOptions.slice(0, isExpanded ? specOptions.length : MAX_DISPLAY_COUNT).map(opt => (
                                                    <li key={opt.value} className={`pressable ${activeFilters.specs[specKey]?.includes(opt.value) ? 'selected' : ''}`}>
                                                        <a href="#" onClick={(e) => { e.preventDefault(); handleSpecFilter(specKey, opt.value); }} data-c={opt.count}>{opt.value}</a>
                                                    </li>
                                                ))}
                                            </ol>
                                            {specOptions.length > MAX_DISPLAY_COUNT && (
                                                <div className="filters-more-prompt pressable" onClick={() => setShowMoreSpecs(prev => ({ ...prev, [specKey]: !prev[specKey] }))} title={isExpanded ? `${t('show_less_options','Show less options for')} ${translatedSpecKey}` : `${t('show_all_options','Show all options for')} ${translatedSpecKey}`}>
                                                    <svg aria-hidden="true" className="icon" width={10} height={10} viewBox="0 0 10 10"><path fillRule="evenodd" d={isExpanded ? "M9.5 6H0.5C0.224 6 0 5.776 0 5.5V4.5C0 4.224 0.224 4 0.5 4H9.5C9.776 4 10 4.224 10 4.5V5.5C10 5.776 9.776 6 9.5 6Z" : "M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"} /></svg>
                                                    {isExpanded ? t('show_less') : t('show_all')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                             {/* Vendors Filter (Certified Stores if applicable, or all vendors selling this brand) */}
                            {availableVendors.length > 0 && (
                                <div className="filter-store filter-collapsed default-list" data-filter-name={t('vendors_selling_brand', 'Stores Selling This Brand')} data-type="store" data-key="store">
                                    <div className="filter__header"><h4>{t('vendors_selling_brand', 'Stores Selling This Brand')}</h4></div>
                                    <div className="filter-container">
                                        <ol aria-expanded={showMoreVendors}>
                                            {availableVendors.slice(0, showMoreVendors ? availableVendors.length : MAX_DISPLAY_COUNT).map(vendor => (
                                                <li key={vendor.id} title={`${vendor.name} ${vendor.certification ? `(${vendor.certification})` : ''}`} className={`pressable ${activeFilters.vendorIds.includes(vendor.id) ? 'selected' : ''}`}>
                                                    <Link to="#" data-l={vendor.certification === 'Gold' ? '3' : vendor.certification === 'Silver' ? '2' : '1'} onClick={(e) => handleLinkFilterClick(e, () => handleVendorFilter(vendor.id))}><span>{vendor.name}</span></Link>
                                                </li>
                                            ))}
                                        </ol>
                                        {availableVendors.length > MAX_DISPLAY_COUNT && (
                                            <div className="filters-more-prompt pressable" onClick={() => setShowMoreVendors(prev => !prev)}>
                                                <svg aria-hidden="true" className="icon" width={10} height={10} viewBox="0 0 10 10"><path fillRule="evenodd" d={showMoreVendors ? "M9.5 6H0.5C0.224 6 0 5.776 0 5.5V4.5C0 4.224 0.224 4 0.5 4H9.5C9.776 4 10 4.224 10 4.5V5.5C10 5.776 9.776 6 9.5 6Z" : "M6 4V0.5C6 0.224 5.776 0 5.5 0H4.5C4.224 0 4 0.224 4 0.5V4H0.5C0.224 4 0 4.224 0 4.5V5.5C0 5.776 0.224 6 0.5 6H4V9.5C4 9.776 4.224 10 4.5 10H5.5C5.776 10 6 9.776 6 9.5V6H9.5C9.776 6 10 5.776 10 5.5V4.5C10 4.224 9.776 4 9.5 4H6Z"} /></svg>
                                                {showMoreVendors ? t('show_less') : t('show_all')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    <main className="page-products__main">
                        <header className="page-header">
                            <div className="page-header__title-wrapper">
                                <div className="page-header__title-main">
                                    <h1>{currentBrand.name}</h1>
                                    <div className="page-header__count-wrapper">
                                        <div className="page-header__count">{t('product_plural', `${filteredProducts.length} products`, { count: filteredProducts.length })}</div>
                                    </div>
                                </div>
                                {currentBrand.logo && (
                                    <div className="page-header__title-aside">
                                        <Link to={`/brand/${currentBrand.id}/${currentBrand.slug || currentBrand.name.toLowerCase().replace(/\s+/g, '-')}`} title={currentBrand.name} className="page-header__brand">
                                            <img itemProp="logo" title={`${currentBrand.name} logo`} alt={`${currentBrand.name} logo`} height="70" loading="lazy" src={currentBrand.logo} />
                                        </Link>
                                    </div>
                                )}
                            </div>
                            {renderAppliedFilters()}
                            
                            {/* Category Slider for this Brand */}
                            {availableCategories.length > 0 && (
                                <section className="section">
                                    <header className="section__header">
                                        <hgroup className="section__hgroup">
                                            <h2 className="section__title">{t('categories_for_brand', 'Categories for {{brandName}}', { brandName: currentBrand.name })}</h2>
                                        </hgroup>
                                    </header>
                                    <ScrollableSlider>
                                        <div className="categories categories--scrollable scroll__content" style={{display: 'flex', gap: '1rem'}}>
                                            {availableCategories.map((item) => (
                                                <Link key={item.id} to={`/cat/${item.id}/${item.slug}?brandId=${currentBrand.id}`} className="categories__category" style={{minWidth: '150px', textAlign: 'center'}}>
                                                    {item.image && <img width="120" height="120" className="categories__image" style={{margin: '0 auto', marginBottom: '0.5rem', objectFit: 'contain'}} src={item.image} alt={item.name} />}
                                                    <h3 className="categories__title" style={{fontSize: '0.875rem'}}>{item.name}</h3>
                                                    <div className="categories__cnt" style={{fontSize: '0.75rem', color: '#666'}}>{item.count} {t('product_plural', 'products', {count: item.count})}</div>
                                                </Link>
                                            ))}
                                        </div>
                                    </ScrollableSlider>
                                </section>
                            )}


                            <div className="page-header__sorting">
                                <div className="tabs">
                                    <div className="tabs-wrapper">
                                        <nav>
                                            <a href="#" data-type="rating-desc" rel="nofollow" className={sortType === 'rating-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('rating-desc'); }}>
                                                <div className="tabs__content">{t('sort_most_popular', 'Most Popular')}</div>
                                            </a>
                                            <a href="#" data-type="price-asc" rel="nofollow" className={sortType === 'price-asc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('price-asc'); }}>
                                                <div className="tabs__content">{t('sort_cheapest', 'Cheapest')}</div>
                                            </a>
                                            <a href="#" data-type="price-desc" rel="nofollow" className={sortType === 'price-desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('price-desc'); }}>
                                                <div className="tabs__content">{t('sort_most_expensive', 'Most Expensive')}</div>
                                            </a>
                                            <a href="#" data-type="merchants_desc" rel="nofollow" className={sortType === 'merchants_desc' ? 'current' : ''} onClick={(e) => { e.preventDefault(); handleSortChange('merchants_desc'); }}>
                                                <div className="tabs__content">{t('sort_num_stores', 'Number of Stores')}</div>
                                            </a>
                                            {/* Add other sort options if relevant, e.g., newest, reviews, alphabetical */}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {filteredProducts.length === 0 && !loading ? (
                            <div id="no-results">
                                <h3>{t('no_products_found_brand_filters', `No products from ${currentBrand.name} match your current filters.` , {brandName: currentBrand.name})}</h3>
                                <div id="no-results-suggestions">
                                    <p><strong>{t('suggestions_title','Suggestions')}:</strong></p>
                                    <ul>
                                        <li>{t('suggestion_try_removing_filters_brand', 'Try removing some filters or ')} <Link to={`/brand/${currentBrand.id}/${currentBrand.slug || currentBrand.name.toLowerCase().replace(/\s+/g, '-')}`} onClick={(e) => { e.preventDefault(); handleResetFilters(); }}>{t('view_all_brand_products', `view all products from ${currentBrand.name}`)}</Link>.</li>
                                    </ul>
                                </div>
                            </div>
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
        </>
    );
};

export default BrandPage;
