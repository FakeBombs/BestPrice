import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { products as allMockProducts, Product } from '@/data/mockData'; // Assuming Product type is here
import ProductCard from '@/components/ProductCard';
import NotFound from '@/pages/NotFound'; // Import a NotFound component if you have one

// --- Reusable definitions (can be moved to a shared file) ---
const giftRecipientCategories = [
    { slug: 'men', titleKey: 'giftsForMen', nameKey: 'men', imgBase: 'adult-m' },
    { slug: 'women', titleKey: 'giftsForWomen', nameKey: 'women', imgBase: 'adult-f' },
    { slug: 'teens', titleKey: 'giftsForTeens', nameKey: 'teens', imgBase: 'teen-both' },
    { slug: 'kids-9-11', titleKey: 'giftsForKids9_11', nameKey: 'kids9_11', imgBase: 'kid0911-both' },
    { slug: 'kids-6-8', titleKey: 'giftsForKids6_8', nameKey: 'kids6_8', imgBase: 'kid0608-both' },
    { slug: 'toddlers', titleKey: 'giftsForToddlers', nameKey: 'toddlers', imgBase: 'kid0305-both' },
    { slug: 'babies', titleKey: 'giftsForBabies', nameKey: 'babies', imgBase: 'baby-both' },
];

const priceRanges = [
    { value: '10', labelKey: 'price_upto_10' },
    { value: '20', labelKey: 'price_upto_20' },
    { value: '30', labelKey: 'price_upto_30' },
    { value: '50', labelKey: 'price_upto_50' },
    { value: '100', labelKey: 'price_upto_100' },
    { value: '250', labelKey: 'price_upto_250' },
];

const sortOptions = [
    { value: 'id_desc', labelKey: 'sort_recent' },
    { value: 'popularity_desc', labelKey: 'sort_most_popular' },
    { value: 'price_asc', labelKey: 'sort_cheapest' },
    { value: 'price_desc', labelKey: 'sort_most_expensive' },
];

// Helper function (same as in Gifts.tsx)
const getEffectiveLowestPrice = (product: Product, forSortDesc: boolean = false): number => {
    if (!product.prices || product.prices.length === 0) {
        return forSortDesc ? 0 : Infinity;
    }
    const inStockPrices = product.prices.filter(pr => pr.inStock);
    const pricesToConsider = inStockPrices.length > 0 ? inStockPrices : product.prices;
    if (pricesToConsider.length === 0) {
        return forSortDesc ? 0 : Infinity;
    }
    return Math.min(...pricesToConsider.map(pr => pr.discountPrice ?? pr.price));
};
// --- End Reusable definitions ---


const GiftsFiltered: React.FC = () => {
    const { t, language } = useTranslation();
    const { recipientSlug } = useParams<{ recipientSlug: string }>(); // Get slug from URL
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Find recipient details based on slug
    const recipientInfo = useMemo(() => {
        return giftRecipientCategories.find(cat => cat.slug === recipientSlug);
    }, [recipientSlug]);

    // State for Filters & Sorting (initialized from URL search params)
    const [showDealsOnly, setShowDealsOnly] = useState(() => searchParams.get('deals') === '1');
    const [selectedPriceMax, setSelectedPriceMax] = useState(() => searchParams.get('price_max') || '');
    const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || 'id_desc');

    // --- Filtering and Sorting Logic for SPECIFIC RECIPIENT ---
    const filteredAndSortedProducts = useMemo(() => {
        if (!recipientSlug) return []; // Should not happen with route setup, but safety check

        // 1. Start with products marked for the specific recipient
        let filtered = allMockProducts.filter(p =>
            p.giftAttributes?.recipient?.includes(recipientSlug)
        );

        // 2. Filter by Deals (same as Gifts.tsx)
        if (showDealsOnly) {
            filtered = filtered.filter(p =>
                p.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null) ||
                p.variants?.some(variant => variant.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null))
            );
        }

        // 3. Filter by Price (same as Gifts.tsx)
        if (selectedPriceMax) {
            const maxPrice = parseInt(selectedPriceMax, 10);
            if (!isNaN(maxPrice)) {
                filtered = filtered.filter(p => {
                    const effectivePrice = getEffectiveLowestPrice(p);
                    return effectivePrice <= maxPrice;
                });
            }
        }

        // 4. Sorting (same as Gifts.tsx)
        const sorted = [...filtered];
        switch (sortBy) {
             case 'popularity_desc': sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0)); break;
            case 'price_asc': sorted.sort((a, b) => getEffectiveLowestPrice(a) - getEffectiveLowestPrice(b)); break;
            case 'price_desc': sorted.sort((a, b) => getEffectiveLowestPrice(b) - getEffectiveLowestPrice(a)); break;
            case 'id_desc': default: sorted.sort((a, b) => b.id - a.id); break;
        }
        return sorted;
    }, [recipientSlug, showDealsOnly, selectedPriceMax, sortBy]); // Dependencies
    // --- End Filtering and Sorting ---


    // --- Update URL Params when filters change (same as Gifts.tsx) ---
     useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (showDealsOnly) params.set('deals', '1'); else params.delete('deals');
        if (selectedPriceMax) params.set('price_max', selectedPriceMax); else params.delete('price_max');
        if (sortBy && sortBy !== 'id_desc') params.set('sort', sortBy); else params.delete('sort');

        if (params.toString() !== searchParams.toString()) {
            setSearchParams(params, { replace: true });
        }
    }, [showDealsOnly, selectedPriceMax, sortBy, setSearchParams, searchParams]);
    // --- End URL Sync ---

    // --- Event Handlers (same as Gifts.tsx) ---
    const handleDealsToggle = (event: React.ChangeEvent<HTMLInputElement>) => setShowDealsOnly(event.target.checked);
    const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedPriceMax(event.target.value);
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSortBy(event.target.value);
    // --- End Event Handlers ---

    // Calculate deal count within the currently displayed (recipient-filtered) products
    const currentDealCount = useMemo(() => {
        return filteredAndSortedProducts.filter(p =>
            p.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null) ||
            p.variants?.some(variant => variant.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null))
        ).length;
    }, [filteredAndSortedProducts]);

    // Handle invalid recipient slug
    if (!recipientInfo) {
        // Option 1: Show NotFound page
        return <NotFound />;
        // Option 2: Redirect to main gifts page
        // useEffect(() => { navigate('/gifts', { replace: true }); }, [navigate]);
        // return null; // Or a loading indicator while redirecting
    }

    // --- Render Breadcrumbs ---
    // You might want a more sophisticated breadcrumb component later
    const renderBreadcrumbs = () => (
        <div className="sc-dFaThA UNbCZ"> {/* Mimicking HTML structure */}
            <div id="trail">
                <nav itemType="https://schema.org/BreadcrumbList" className="breadcrumb">
                    <ol>
                        <li itemProp="itemListElement" itemType="https://schema.org/ListItem">
                            <Link itemProp="item" to="/" rel="home">
                                <span itemProp="name">{t('breadcrumbHome', 'BestPrice.gr')}</span>
                            </Link>
                            {/* You might need a separator logic */}
                            <span> › </span>
                        </li>
                        <li itemProp="itemListElement" itemType="https://schema.org/ListItem">
                             {/* Link back to the main Gifts page */}
                            <Link itemProp="item" to="/gifts" className='inline-flex items-center'>
                                {/* Optional Back Arrow */}
                                {/* <svg className="icon trail__arrow mr-1" aria-hidden="true" width="16" height="16"><use href="/dist/images/icons/icons.svg#icon-backwards-16"></use></svg> */}
                                <span itemProp="name">{t('gifts', 'Δώρα')}</span>
                            </Link>
                             {/* Separator for the current page */}
                            <span> › </span>
                        </li>
                        {/* Current page - not a link */}
                         <li itemProp="itemListElement" itemType="https://schema.org/ListItem">
                            <span itemProp="name">{t(recipientInfo.titleKey, `Gifts for ${recipientInfo.nameKey}`)}</span>
                         </li>
                    </ol>
                </nav>
            </div>
        </div>
    );

    // --- TODO: Extract unique interests for the current recipient's gifts ---
    const availableInterests = useMemo(() => {
        const interests = new Set<string>();
        // Use the initial recipient-filtered list *before* price/deals filters
        // to show all possible interests for this recipient type.
        const recipientProducts = allMockProducts.filter(p =>
            p.giftAttributes?.recipient?.includes(recipientSlug!)
        );
        recipientProducts.forEach(p => {
            p.giftAttributes?.interest?.forEach(interest => interests.add(interest));
        });
        return Array.from(interests).sort(); // Example: ['tech', 'books', 'fashion']
    }, [recipientSlug]);
    // --- End Interest Extraction ---


    return (
        // Using custom classes structure from Gifts.tsx and example HTML
        <div id="gift-finder" className="gift-finder">
            {/* --- Top Section (Image, Title, Recipient Links) --- */}
            <div className="sc-jScdur iyzBDo root__wrapper">
                <div className="sc-dcKlJK cquxZx root">
                    {renderBreadcrumbs()} {/* Add Breadcrumbs */}

                    {/* Header with dynamic image and title */}
                    <div className="sc-fjUQFl bjpNBM flex items-center mt-4"> {/* Added flex for alignment */}
                        <img
                            alt={t(recipientInfo.titleKey, `Gifts for ${recipientInfo.nameKey}`)}
                            width="92"
                            height="92"
                            // Assuming images are named like adult-m.webp, etc. in public/dist/images/gifts/
                            src={`/dist/images/gifts/${recipientInfo.imgBase}.webp`}
                            // You might need srcset for retina if you have @2x images
                            // srcSet={`/dist/images/gifts/${recipientInfo.imgBase}@2x.webp 2x`}
                            loading="eager" // Load header image eagerly
                            className="rounded-full mr-4" // Added margin
                        />
                        <div>
                             {/* Dynamic H1 */}
                            <h1 className="sc-jPkiSJ cFyVWT">{t(recipientInfo.titleKey, `Gifts for ${recipientInfo.nameKey}`)}</h1>
                            {/* Optional: Dropdowns from example HTML - Implementation needed if required */}
                            {/* <div className="sc-etfXYe dyQwJK">...</div> */}
                        </div>
                    </div>

                    {/* Optional: Interest Filters - Implementation needed */}
                    {/* Map availableInterests to clickable elements */}
                    {availableInterests.length > 0 && (
                        <div className="sc-cXawGu bBKEWZ mt-4"> {/* Added margin */}
                            <div className="sc-cUiCeM fxEzXA flex flex-wrap gap-2"> {/* Added flex for layout */}
                                {availableInterests.map(interest => (
                                    // TODO: Implement interest filtering logic if needed
                                    // This currently just displays them. Clicking would need state/URL updates.
                                    <h2 key={interest} className="sc-jMsorb lngZA-D pressable border px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-100">
                                        {t(`interest_${interest}`, interest)} {/* Assumes keys like interest_tech */}
                                    </h2>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* Dynamic Count */}
                    <p className="sc-cZSric dQdioU mt-4"> {/* Added margin */}
                        {t('gifts_total_count', `Fallback: ${filteredAndSortedProducts.length} items`, { count: filteredAndSortedProducts.length })}
                    </p>
                </div>
            </div>

            {/* --- Main Content Wrapper (Filters & Products Grid) --- */}
            <div className="root__wrapper">
                <div className="root">
                    <div className="gift-finder__content">
                        {/* Filter Bar (Reused from Gifts.tsx) */}
                        <div className="sc-hZARmv MylkP">
                             <select value={sortBy} onChange={handleSortChange} aria-label={t('sort_by_label', 'Sort by')}>
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {t(option.labelKey, option.labelKey.replace(/_/g, ' '))}
                                    </option>
                                ))}
                            </select>
                            <div className="sc-dKKIkQ bqWucv">
                                <label className="bhTOi9I4I2nIIKPU_JUz flex items-center"> {/* Added flex */}
                                    <input type="checkbox" checked={showDealsOnly} onChange={handleDealsToggle} className="mr-1"/>
                                    {t('deals_label', 'Deals')} ({currentDealCount})
                                </label>
                                <select value={selectedPriceMax} onChange={handlePriceChange} aria-label={t('price_filter_label', 'Price')}>
                                    <option value="">{t('price_filter_all_label', 'All Prices')}</option>
                                    {priceRanges.map(range => (
                                        <option key={range.value} value={range.value}>
                                            {t(range.labelKey, `Up to €${range.value}`)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* End Filter Bar */}

                        {/* Separator/Placeholder div from example HTML */}
                        {/* <div /> */}

                        {/* Product Grid (Reused from Gifts.tsx) */}
                        {/* Use appropriate grid classes for layout */}
                        <div className="p__products p__products--full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                           {filteredAndSortedProducts.length > 0 ? (
                                filteredAndSortedProducts.map(product => (
                                    <ProductCard key={product.id} product={product} className="p"/>
                                ))
                           ) : (
                                <p className="col-span-full text-center py-10 text-gray-500">{t('no_gifts_found', 'Δεν βρέθηκαν δώρα με αυτά τα κριτήρια.')}</p>
                           )}
                        </div>
                        {/* End Product Grid */}

                        {/* Placeholder div from example HTML */}
                        <div style={{ height: '1px' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiftsFiltered;
