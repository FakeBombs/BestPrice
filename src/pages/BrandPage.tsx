import React, { useState, useEffect, useMemo, useCallback } from 'react'; // Added useCallback
import { useSearchParams, Link, useParams, useNavigate } from 'react-router-dom';
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

const MAX_DISPLAY_COUNT = 10;
const DEFAULT_SORT_TYPE = 'rating-desc';

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
    inStock: boolean;
}

const BrandPage = () => {
    const { t, language } = useTranslation();
    const { brandId: brandIdParam } = useParams<{ brandId: string }>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [currentBrand, setCurrentBrand] = useState<Brand | null | undefined>(undefined);
    const [baseBrandProducts, setBaseBrandProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    
    const [activeFilters, setActiveFilters] = useState<ActiveBrandPageFilters>(() => {
        const catsFromUrl = searchParams.get('categories')?.split(',').map(Number).filter(id => !isNaN(id)) || [];
        const vendorsFromUrl = searchParams.get('vendors')?.split(',').map(Number).filter(id => !isNaN(id)) || [];
        const specsFromUrl = JSON.parse(searchParams.get('specs') || '{}');
        return {
            categoryIds: catsFromUrl,
            vendorIds: vendorsFromUrl,
            specs: specsFromUrl,
            deals: searchParams.get('deals') === '1',
            certified: searchParams.get('certified') === '1',
            inStock: searchParams.get('instock') === '1',
        };
    });

    const [availableCategories, setAvailableCategories] = useState<{ id: number; name: string; slug: string; count: number; image: string | null; parentId: number | null | undefined }[]>([]);
    const [availableVendors, setAvailableVendors] = useState<{ id: number; name: string; count: number; certification?: string | '' }[]>([]);
    const [availableSpecs, setAvailableSpecs] = useState<Record<string, { value: string; count: number }[]>>({});
    
    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const [showMoreSpecs, setShowMoreSpecs] = useState<Record<string, boolean>>({});
    const [showMoreVendors, setShowMoreVendors] = useState(false);

    const [sortType, setSortType] = useState<string>(() => searchParams.get('sort') || DEFAULT_SORT_TYPE);
    const [loading, setLoading] = useState(true);

    const vendorIdMap = useMemo(() => new Map(allVendors.map(v => [v.id, v])), [allVendors]);
    
    const isAnyFilterActive = useMemo(() => {
        return activeFilters.categoryIds.length > 0 ||
               activeFilters.vendorIds.length > 0 ||
               Object.values(activeFilters.specs).some(v => (v as string[]).length > 0) ||
               activeFilters.deals || activeFilters.certified || activeFilters.inStock;
    }, [activeFilters]);

    useEffect(() => {
        setLoading(true);
        setCurrentBrand(undefined);
        setBaseBrandProducts([]);
        const numericBrandId = brandIdParam ? parseInt(brandIdParam, 10) : NaN;
        if (isNaN(numericBrandId)) {
            setCurrentBrand(null); setLoading(false); return;
        }
        const fetchedBrand = getBrandById(numericBrandId);
        setCurrentBrand(fetchedBrand || null);
        if (fetchedBrand) {
            const productsForBrand = allMockProducts.filter(p => p.brand?.toLowerCase() === fetchedBrand.name.toLowerCase());
            setBaseBrandProducts(productsForBrand);
        }
        setLoading(false);
    }, [brandIdParam]);

    useEffect(() => {
        if (baseBrandProducts.length === 0 && !loading) { // Ensure not to clear if still loading brand products
            setAvailableCategories([]);
            setAvailableVendors([]);
            setAvailableSpecs({});
            return;
        }
        const categoryCounts: Record<number, number> = {};
        const vendorCounts: Record<number, { count: number, vendor: Vendor | undefined }> = {};
        const specCounts: Record<string, Record<string, number>> = {};

        baseBrandProducts.forEach(product => {
            product.categoryIds.forEach(catId => {
                categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
            });
            product.prices.forEach(price => {
                if (!vendorCounts[price.vendorId]) {
                    vendorCounts[price.vendorId] = { count: 0, vendor: vendorIdMap.get(price.vendorId) };
                }
                vendorCounts[price.vendorId].count++;
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
                return { id: parseInt(idStr), name: category ? t(category.slug, category.name) : 'Unknown', slug: category?.slug || '', count, image: category?.image || null, parentId: category?.parentId };
            }).filter(cat => cat.name !== 'Unknown').sort((a,b) => b.count - a.count)
        );
        setAvailableVendors(
            Object.values(vendorCounts)
            .filter(vc => vc.vendor) 
            .map(vc => ({
                id: vc.vendor!.id, name: vc.vendor!.name, count: vc.count, certification: vc.vendor!.certification
            })).sort((a,b) => b.count - a.count)
        );
        const specsForState: Record<string, { value: string; count: number }[]> = {};
        Object.entries(specCounts).forEach(([specKey, valueCounts]) => {
            specsForState[specKey] = Object.entries(valueCounts)
                .map(([value, count]) => ({ value, count }))
                .sort((a, b) => b.count - a.count);
        });
        setAvailableSpecs(specsForState);
        setShowMoreSpecs(Object.keys(specsForState).reduce((acc, key) => { acc[key] = false; return acc; }, {} as Record<string, boolean>));
    }, [baseBrandProducts, t, vendorIdMap, loading]); // Added loading dependency

    useEffect(() => {
        let productsToProcess = [...baseBrandProducts];
        if (activeFilters.categoryIds.length > 0) {
            productsToProcess = productsToProcess.filter(p =>
                activeFilters.categoryIds.some(catId => p.categoryIds.includes(catId))
            );
        }
        if (activeFilters.vendorIds.length > 0) {
            productsToProcess = productsToProcess.filter(p =>
                p.prices.some(price => activeFilters.vendorIds.includes(price.vendorId))
            );
        }
        if (Object.keys(activeFilters.specs).length > 0) {
            productsToProcess = productsToProcess.filter(p =>
                Object.entries(activeFilters.specs).every(([filterKey, filterValues]) => {
                    if (!filterValues || filterValues.length === 0) return true;
                    const productSpecValue = p.specifications?.[filterKey];
                    return productSpecValue !== undefined && filterValues.includes(String(productSpecValue));
                })
            );
        }
        if (activeFilters.inStock) {
            productsToProcess = productsToProcess.filter(p => p.prices.some(price => price.inStock));
        }
        if (activeFilters.deals) {
            productsToProcess = productsToProcess.filter(p => p.prices.some(price => price.discountPrice && price.discountPrice < price.price));
        }
        if (activeFilters.certified) {
            productsToProcess = productsToProcess.filter(p => p.prices.some(price => vendorIdMap.get(price.vendorId)?.certification));
        }
        const sorted = [...productsToProcess];
        switch (sortType) {
            case 'price-asc': sorted.sort((a, b) => getEffectiveLowestPrice(a) - getEffectiveLowestPrice(b)); break;
            case 'price-desc': sorted.sort((a, b) => getEffectiveLowestPrice(b) - getEffectiveLowestPrice(a)); break;
            case 'merchants_desc': sorted.sort((a,b) => (b.prices?.filter(p => p.inStock).length || 0) - (a.prices?.filter(p => p.inStock).length || 0)); break;
            case 'rating-desc': default: sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0)); break;
        }
        setFilteredProducts(sorted);
    }, [activeFilters, sortType, baseBrandProducts, vendorIdMap]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (activeFilters.categoryIds.length > 0) params.set('categories', activeFilters.categoryIds.join(','));
        if (activeFilters.vendorIds.length > 0) params.set('vendors', activeFilters.vendorIds.join(','));
        if (Object.keys(activeFilters.specs).length > 0) params.set('specs', JSON.stringify(activeFilters.specs));
        if (activeFilters.deals) params.set('deals', '1');
        if (activeFilters.certified) params.set('certified', '1');
        if (activeFilters.inStock) params.set('instock', '1');
        if (sortType !== DEFAULT_SORT_TYPE) params.set('sort', sortType);
        
        const currentRelevantParams = new URLSearchParams(searchParams.toString());
        // Preserve any non-filter params if necessary, or start fresh like this
        // currentRelevantParams.delete('brandId'); // Assuming brandId is not a searchParam we manage here

        if (params.toString() !== currentRelevantParams.toString()) {
            setSearchParams(params, { replace: true });
        }
    }, [activeFilters, sortType, setSearchParams, searchParams]);

    const isInitialLoad = React.useRef(true);
    useEffect(() => {
        if (isInitialLoad.current) {
            isInitialLoad.current = false; return;
        }
        if(!loading){ // Only scroll if not in initial loading phase
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [activeFilters, sortType, loading]);

    const handleLinkFilterClick = (event: React.MouseEvent<HTMLAnchorElement>, handler: () => void) => { event.preventDefault(); handler(); };
    const createBooleanToggleHandler = (filterKey: keyof Pick<ActiveBrandPageFilters, 'deals' | 'certified' | 'inStock'>) => {
        return () => setActiveFilters(prev => ({ ...prev, [filterKey]: !prev[filterKey] }));
    };
    const handleDealsToggle = createBooleanToggleHandler('deals');
    const handleCertifiedToggle = createBooleanToggleHandler('certified');
    const handleInStockToggle = createBooleanToggleHandler('inStock');
    const handleCategoryFilter = (categoryId: number) => {
        setActiveFilters(prev => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter(id => id !== categoryId)
                : [categoryId] 
        }));
    };
    const handleVendorFilter = (vendorId: number) => {
        setActiveFilters(prev => ({
            ...prev,
            vendorIds: prev.vendorIds.includes(vendorId)
                ? prev.vendorIds.filter(id => id !== vendorId)
                : [vendorId] 
        }));
    };
    const handleSpecFilter = (specKey: string, specValue: string) => {
        setActiveFilters(prev => {
            const currentValues = prev.specs[specKey] || [];
            const newSpecValues = currentValues.includes(specValue)
                ? currentValues.filter((v: string) => v !== specValue)
                : [specValue]; 
            const updatedSpecs = { ...prev.specs };
            if (newSpecValues.length > 0) {
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
        if (newSortType !== sortType) setSortType(newSortType);
    };
    
    const selectedVendorForInfo = useMemo(() => {
        if (activeFilters.vendorIds.length === 1) {
            return findVendorById(activeFilters.vendorIds[0]);
        }
        return null;
    }, [activeFilters.vendorIds]);

    // **** DEFINE renderMerchantInformation ****
    const renderMerchantInformation = useCallback(() => {
        if (!selectedVendorForInfo) return null;
        const vendor = selectedVendorForInfo;
        const removeThisVendorFilter = (e: React.MouseEvent) => {
            e.preventDefault();
            handleVendorFilter(vendor.id); // This should deselect the vendor
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
    }, [selectedVendorForInfo, t, handleVendorFilter]); // Added handleVendorFilter to dependencies

    // **** DEFINE renderAppliedFilters ****
    const renderAppliedFilters = useCallback(() => {
        if (!isAnyFilterActive) return null; // Use the memoized isAnyFilterActive

        const { categoryIds, vendorIds, specs, deals, certified, inStock } = activeFilters;
        const renderChip = (key: string, title: string, label: string, onRemove: () => void) => (
            <h2 className="applied-filters__filter" key={key}>
                <a className="pressable" onClick={(e) => { e.preventDefault(); onRemove(); }} title={title}>
                    <span className="applied-filters__label">{label}</span>
                    <svg aria-hidden="true" className="icon applied-filters__x" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg>
                </a>
            </h2>
        );
        const allCatsMap = new Map([...mainCategories, ...categories].map(c => [c.id, c]));
        
        return (
            <div className="applied-filters">
                {inStock && renderChip('instock', t('remove_instock_filter', 'Remove In Stock filter'), t('instock_label', 'In Stock'), handleInStockToggle)}
                {deals && renderChip('deals', t('remove_deals_filter', 'Remove Deals filter'), t('deals_label', 'Deals'), handleDealsToggle)}
                {certified && renderChip('certified', t('remove_certified_filter', 'Remove Certified filter'), t('certified_label', 'Certified'), handleCertifiedToggle)}
                
                {categoryIds.map((catId) => {
                    const category = allCatsMap.get(catId);
                    const catName = category ? t(category.slug, category.name) : `ID: ${catId}`;
                    return renderChip(`category-${catId}`, `${t('remove_category_filter', 'Remove category filter')} ${catName}`, catName, () => handleCategoryFilter(catId));
                })}

                {vendorIds.map((vendorId) => {
                    const vendor = findVendorById(vendorId); // findVendorById should be imported
                    const vendorName = vendor ? vendor.name : `ID: ${vendorId}`;
                    return renderChip(`vendor-${vendorId}`, `${t('remove_vendor_filter', 'Remove store filter')} ${vendorName}`, vendorName, () => handleVendorFilter(vendorId));
                })}

                {Object.entries(specs).flatMap(([specKey, specValues]) =>
                    (specValues as string[]).map((specValue) => // Cast specValues to string[]
                        renderChip(
                            `spec-${specKey}-${specValue}`,
                            `${t('remove_spec_filter', 'Remove spec filter')} ${t(specKey.toLowerCase().replace(/\s+/g, '-'), specKey)}: ${specValue}`,
                            `${t(specKey.toLowerCase().replace(/\s+/g, '-'), specKey)}: ${specValue}`,
                            () => handleSpecFilter(specKey, specValue)
                        )
                    )
                )}
                <button className="applied-filters__reset pressable" onClick={handleResetFilters} title={t('reset_all_filters', 'Reset all filters')}>
                    <svg aria-hidden="true" className="icon" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-refresh"></use></svg>
                    <span>{t('clear_all_filters', 'Clear All')}</span>
                </button>
            </div>
        );
    }, [activeFilters, t, isAnyFilterActive, handleInStockToggle, handleDealsToggle, handleCertifiedToggle, handleCategoryFilter, handleVendorFilter, handleSpecFilter, handleResetFilters]);


    if (loading) return <div className="flex justify-center items-center h-screen">{t('loading_brand_data', 'Loading Brand Data...')}</div>;
    if (!currentBrand) return <NotFound />;

    return (
        <>
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

                            {availableVendors.length > 0 && (
                                <div className="filter-store filter-collapsed default-list" data-filter-name={t('certified_stores_title')} data-type="store" data-key="store">
                                    <div className="filter__header"><h4>{t('certified_stores_title')}</h4></div>
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
                                        <div className="page-header__count">
                                            {filteredProducts.length === 1 
                                                ? t('product_singular', { count: 1 })
                                                : t('product_plural', { count: filteredProducts.length })
                                            }
                                        </div>
                                    </div>
                                </div>
                                {currentBrand.logo && (
                                    <div className="page-header__title-aside">
                                        <Link to={`/b/${currentBrand.id}/${currentBrand.slug || currentBrand.name.toLowerCase().replace(/\s+/g, '-')}`} title={currentBrand.name} className="page-header__brand">
                                            <img itemProp="logo" title={`${currentBrand.name} logo`} alt={`${currentBrand.name} logo`} height="70" loading="lazy" src={currentBrand.logo} />
                                        </Link>
                                    </div>
                                )}
                            </div>
                            {renderAppliedFilters()}
                            
                            {availableCategories.length > 0 && (
                                <section className="section">
                                    <header className="section__header">
                                        <hgroup className="section__hgroup">
                                            <h2 className="section__title">{t('categories_for_brand', 'Categories for {{brandName}}', { brandName: currentBrand.name })}</h2>
                                        </hgroup>
                                    </header>
                                    <ScrollableSlider>
                                        <div className="categories categories--scrollable scroll__content">
                                            {availableCategories.map((item) => (
                                                <Link key={item.id} to={`/cat/${item.id}/${item.slug}?brand=${currentBrand.name}`} className="categories__category">
                                                    {item.image && <img width="200" height="200" className="categories__image" src={item.image} alt={item.name} loading="lazy" />}
                                                    <h2 className="categories__title">{item.name}</h2>
                                                    <div className="categories__cnt">
                                                        {item.count === 1 
                                                            ? t('product_singular', { count: 1 }) 
                                                            : t('product_plural', { count: item.count })
                                                        }
                                                    </div>
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
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {loading && filteredProducts.length === 0 ? (
                             <p>{t('loading_products', 'Loading products...')}</p>
                        ) : filteredProducts.length === 0 ? (
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
