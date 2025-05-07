// src/pages/GiftsFiltered.tsx
// Displays filtered gift products based on URL slug.
// Uses specific class names from DOM example for layout.

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageContext } from '@/context/LanguageContext';
import { products as allMockProducts, Product, Category, mainCategories, categories, brands, Brand } from '@/data/mockData'; // Import necessary types/data
import ProductCard from '@/components/ProductCard'; // Assuming path is correct

// --- Helper Functions ---
const calculateDiscountPercentage = (originalPrice?: number, discountPrice?: number): number | null => {
    if (typeof discountPrice !== 'number' || typeof originalPrice !== 'number' || originalPrice <= 0 || discountPrice >= originalPrice) { return null; }
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};
const formatPrice = (price?: number, locale: string = 'el-GR'): string => {
    if (typeof price !== 'number') return '';
    try { return price.toLocaleString(locale.replace('_', '-'), { style: 'currency', currency: 'EUR' }); }
    catch (e) { return price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }); }
};
// --- End Helper Functions ---

// Define mapping for URL slugs back to recipient keys used in giftAttributes
const slugToRecipientMap: Record<string, string> = {
    'andres': 'men',
    'gynaikes': 'women',
    'efhboi': 'teens',
    'paidia-9-11': 'kids9-11',
    'paidia-6-8': 'kids6-8',
    'nhpia': 'toddlers',
    'mwra': 'babies',
};

// Define mapping for recipient keys to translation keys for the title
const recipientTitleKeys: Record<string, string> = {
    'men': 'giftsForMen',
    'women': 'giftsForWomen',
    'teens': 'giftsForTeens',
    'kids9-11': 'giftsForKids9_11',
    'kids6-8': 'giftsForKids6_8',
    'toddlers': 'giftsForToddlers',
    'babies': 'giftsForBabies',
};

// Define Price Range Options
const priceRanges = [
    { value: '10', labelKey: 'price_upto_10' },
    { value: '20', labelKey: 'price_upto_20' },
    { value: '30', labelKey: 'price_upto_30' },
    { value: '50', labelKey: 'price_upto_50' },
    { value: '100', labelKey: 'price_upto_100' },
    { value: '250', labelKey: 'price_upto_250' },
];

// Define Sort Options
const sortOptions = [
    { value: 'id_desc', labelKey: 'sort_recent' },
    { value: 'popularity_desc', labelKey: 'sort_most_popular' },
    { value: 'price_asc', labelKey: 'sort_cheapest' },
    { value: 'price_desc', labelKey: 'sort_most_expensive' },
];

// Define gift recipient categories for header image lookup
const giftRecipientCategories = [
    { slug: 'men', imgBase: 'adult-m' },
    { slug: 'women', imgBase: 'adult-f' },
    { slug: 'teens', imgBase: 'teen-both' },
    { slug: 'kids-9-11', imgBase: 'kid0911-both' },
    { slug: 'kids-6-8', imgBase: 'kid0608-both' },
    { slug: 'toddlers', imgBase: 'kid0305-both' },
    { slug: 'babies', imgBase: 'baby-both' },
];

const GiftsFiltered: React.FC = () => {
    const { recipientSlug } = useParams<{ recipientSlug: string }>();
    const { t, language } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [showDealsOnly, setShowDealsOnly] = useState(() => searchParams.get('deals') === '1');
    const [selectedPriceMax, setSelectedPriceMax] = useState(() => searchParams.get('price_max') || '');
    const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || 'id_desc');

    const currentRecipientKey = recipientSlug ? slugToRecipientMap[recipientSlug] : undefined;
    const pageTitleKey = currentRecipientKey ? recipientTitleKeys[currentRecipientKey] : 'gifts';

    const filteredAndSortedProducts = useMemo(() => {
        if (!currentRecipientKey) {
            return allMockProducts.filter(p => p.giftAttributes); // Show all gifts if no specific recipient
        }

        let filtered = allMockProducts.filter(p =>
            p.giftAttributes?.recipient?.includes(currentRecipientKey)
        );

        if (showDealsOnly) {
            filtered = filtered.filter(p =>
                p.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null) ||
                p.variants?.some(variant => variant.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null))
            );
        }

        if (selectedPriceMax) {
            const maxPrice = parseInt(selectedPriceMax, 10);
            if (!isNaN(maxPrice)) {
                filtered = filtered.filter(p => {
                    const lowestValidPrice = p.lowestPrice ?? Math.min(...p.prices.filter(pr => pr.inStock).map(pr => pr.discountPrice ?? pr.price), Infinity);
                    return lowestValidPrice <= maxPrice;
                });
            }
        }

        const sorted = [...filtered];
        switch (sortBy) {
            case 'popularity_desc':
                sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0));
                break;
            case 'price_asc':
                 sorted.sort((a, b) => (a.lowestPrice ?? Infinity) - (b.lowestPrice ?? Infinity));
                 break;
            case 'price_desc':
                 sorted.sort((a, b) => (b.lowestPrice ?? 0) - (a.lowestPrice ?? 0));
                 break;
            case 'id_desc':
            default:
                sorted.sort((a, b) => b.id - a.id);
                break;
        }
        return sorted;
    }, [currentRecipientKey, showDealsOnly, selectedPriceMax, sortBy]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (showDealsOnly) params.set('deals', '1');
        if (selectedPriceMax) params.set('price_max', selectedPriceMax);
        if (sortBy !== 'id_desc') params.set('sort', sortBy);
        setSearchParams(params, { replace: true });
    }, [showDealsOnly, selectedPriceMax, sortBy, setSearchParams]);

    const handleDealsToggle = (event: React.ChangeEvent<HTMLInputElement>) => setShowDealsOnly(event.target.checked);
    const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedPriceMax(event.target.value);
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSortBy(event.target.value);

    const renderBreadcrumbs = () => (
        <div id="trail" className="sc-dFaThA UNbCZ">
            <nav className="breadcrumb">
                <ol>
                    <li><Link to="/"><span>BestPrice.gr</span></Link><span className="mx-1">›</span></li>
                    <li><Link to="/gifts"><svg className="icon trail__arrow inline-block align-middle mr-1" aria-hidden="true" width="16" height="16"><use href="/dist/images/icons/icons.svg#icon-backwards-16"></use></svg><span>{t('gifts', 'Δώρα')}</span></Link></li>
                </ol>
            </nav>
        </div>
    );

    const headerImageBase = giftRecipientCategories.find(cat => cat.slug === recipientSlug)?.imgBase; // Find image based on English slug

    return (
        <div id="gift-finder" className="gift-finder">
            {/* Header section with specific classes */}
            <div className="sc-jScdur iyzBDo root__wrapper">
                <div className="sc-dcKlJK cquxZx root">
                    {renderBreadcrumbs()}
                    <div className="sc-fjUQFl bjpNBM">
                        {headerImageBase && (
                             <img
                                alt={t(pageTitleKey, `Gifts for ${currentRecipientKey}`)}
                                width="92" height="92"
                                srcSet={`//bp.pstatic.gr/pages/giftFinder/assets/presets/${headerImageBase}@2x.webp 2x`}
                                src={`//bp.pstatic.gr/pages/giftFinder/assets/presets/${headerImageBase}.webp`}
                            />
                        )}
                        <div>
                            <h1 className="sc-jPkiSJ cFyVWT">
                                {t(pageTitleKey, `Gifts for ${currentRecipientKey || 'All'}`)}
                            </h1>
                            {/* Optional: Gender/Age selectors if needed later */}
                            {/* <div className="sc-etfXYe dyQwJK"><div className="sc-icnseD iJnWlB">...</div></div> */}
                        </div>
                    </div>
                    {/* Optional: Interest buttons if needed later */}
                    {/* <div className="sc-cXawGu bBKEWZ"><div className="sc-cUiCeM fxEzXA">...</div></div> */}
                    <p className="sc-cZSric dQdioU">
                         {t('gifts_filtered_count', '{{count}} επιλεγμένα δώρα', { count: filteredAndSortedProducts.length })}
                    </p>
                </div>
            </div>

            {/* Main Content Wrapper */}
            <div className="root__wrapper">
                <div className="root">
                    <div className="gift-finder__content">
                        {/* Filter Bar */}
                        <div className="sc-hZARmv MylkP">
                             <select value={sortBy} onChange={handleSortChange}>
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {t(option.labelKey, option.labelKey.replace('_', ' '))}
                                    </option>
                                ))}
                            </select>
                            <div className="sc-dKKIkQ bqWucv">
                                <label className="bhTOi9I4I2nIIKPU_JUz">
                                    {t('deals_label', 'Προσφορές')} ({filteredAndSortedProducts.filter(p => p.prices.some(pr => pr.discountPrice)).length}) {/* Show accurate deal count for *this* view */}
                                    <input type="checkbox" checked={showDealsOnly} onChange={handleDealsToggle} />
                                </label>
                                <select value={selectedPriceMax} onChange={handlePriceChange}>
                                    <option value="">{t('price_filter_label', 'Τιμή')}</option>
                                    {priceRanges.map(range => (
                                        <option key={range.value} value={range.value}>
                                            {t(range.labelKey, `Up to €${range.value}`)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* End Filter Bar */}

                        {/* Product Grid */}
                        {/* Using Tailwind for the grid layout itself, but custom classes for the product card container */}
                        <div className="p__products p__products--full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                           {filteredAndSortedProducts.length > 0 ? (
                                filteredAndSortedProducts.map(product => (
                                    // Render your ProductCard component
                                    <ProductCard key={product.id} product={product} className="p"/>
                                ))
                           ) : (
                                <p className="col-span-full text-center py-10 text-gray-500">{t('no_gifts_found', 'Δεν βρέθηκαν δώρα με αυτά τα κριτήρια.')}</p>
                           )}
                        </div>
                        {/* End Product Grid */}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiftsFiltered;
