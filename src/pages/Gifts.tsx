import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageContext } from '@/context/LanguageContext';
import { products as allMockProducts, Product } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

// --- Helper Functions --- (Copied from GiftsFiltered logic)
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


// Define the structure for recipient categories
const giftRecipientCategories = [
    { slug: 'men', titleKey: 'giftsForMen', nameKey: 'men', imgBase: 'adult-m' },
    { slug: 'women', titleKey: 'giftsForWomen', nameKey: 'women', imgBase: 'adult-f' },
    { slug: 'teens', titleKey: 'giftsForTeens', nameKey: 'teens', imgBase: 'teen-both' },
    { slug: 'kids-9-11', titleKey: 'giftsForKids9_11', nameKey: 'kids9_11', imgBase: 'kid0911-both' },
    { slug: 'kids-6-8', titleKey: 'giftsForKids6_8', nameKey: 'kids6_8', imgBase: 'kid0608-both' },
    { slug: 'toddlers', titleKey: 'giftsForToddlers', nameKey: 'toddlers', imgBase: 'kid0305-both' },
    { slug: 'babies', titleKey: 'giftsForBabies', nameKey: 'babies', imgBase: 'baby-both' },
];

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


const Gifts: React.FC = () => {
    const { t, language } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    // --- State for Filters & Sorting ---
    const [showDealsOnly, setShowDealsOnly] = useState(() => searchParams.get('deals') === '1');
    const [selectedPriceMax, setSelectedPriceMax] = useState(() => searchParams.get('price_max') || '');
    const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || 'id_desc');

    // --- Filtering and Sorting Logic for ALL gifts ---
    const filteredAndSortedProducts = useMemo(() => {
        // 1. Start with all products that have ANY gift attributes
        let filtered = allMockProducts.filter(p => p.giftAttributes);

        // 2. Filter by Deals
        if (showDealsOnly) {
            filtered = filtered.filter(p =>
                p.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null) ||
                p.variants?.some(variant => variant.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null))
            );
        }

        // 3. Filter by Price
        if (selectedPriceMax) {
            const maxPrice = parseInt(selectedPriceMax, 10);
            if (!isNaN(maxPrice)) {
                filtered = filtered.filter(p => {
                    const lowestValidPrice = p.lowestPrice ?? Math.min(...p.prices.filter(pr => pr.inStock).map(pr => pr.discountPrice ?? pr.price), Infinity);
                    return lowestValidPrice <= maxPrice;
                });
            }
        }

        // 4. Sorting
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
                sorted.sort((a, b) => b.id - a.id); // Simple ID sort for "Recent"
                break;
        }
        return sorted;
    }, [showDealsOnly, selectedPriceMax, sortBy]);
    // --- End Filtering and Sorting ---


    // --- Update URL Params when filters change ---
     useEffect(() => {
        const params = new URLSearchParams();
        if (showDealsOnly) params.set('deals', '1');
        if (selectedPriceMax) params.set('price_max', selectedPriceMax);
        if (sortBy !== 'id_desc') params.set('sort', sortBy);
        setSearchParams(params, { replace: true });
    }, [showDealsOnly, selectedPriceMax, sortBy, setSearchParams]);
    // --- End URL Sync ---

    // --- Event Handlers ---
    const handleDealsToggle = (event: React.ChangeEvent<HTMLInputElement>) => setShowDealsOnly(event.target.checked);
    const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedPriceMax(event.target.value);
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSortBy(event.target.value);
    // --- End Event Handlers ---

    // Calculate deal count within the currently displayed products
    const currentDealCount = filteredAndSortedProducts.filter(p =>
        p.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null) ||
        p.variants?.some(variant => variant.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null))
    ).length;

    return (
        // Using custom classes structure
        <div id="gift-finder" className="gift-finder">
            {/* --- Top Section (Image, Title, Recipient Links) --- */}
            <div className="sc-jScdur iyzBDo root__wrapper">
                <div className="sc-dcKlJK cquxZx root">
                    <img alt={t('gifts_page_alt', 'Gift Ideas at BestPrice')} width="200" height="108" className="sc-guGTOK irbLXu" src="assets/gift.svg" loading="eager"/>
                    <h1 className="sc-jPkiSJ jBXYhC">{t('gifts', 'Δώρα')}</h1>
                    <p className="sc-lixPIL cuyAJX">
                        {t('gifts_page_subtitle', 'Επίλεξε για ποιον ψάχνεις δώρο και δες τα δώρα που έχουμε διαλέξει για σένα.')}
                    </p>
                    <div className="sc-iQQCXo ebbwJS">
                        <div className="sc-gDpztx fknxFk">
                            {giftRecipientCategories.map((cat) => (
                                <Link key={cat.slug} to={`/gifts/${cat.slug}`} title={t(cat.titleKey, `Gifts for ${cat.nameKey}`)} className="sc-kpOvIu kHmeXZ">
                                    <img alt={t(cat.nameKey, cat.nameKey)} width={90} height={90} src={`/dist/images/${cat.slug}.webp`} loading="lazy" className="rounded-full mb-2 group-hover:opacity-80 transition-opacity"/>
                                    <h2>{t(cat.nameKey, cat.nameKey)}</h2>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <p className="sc-cZSric geFCaT">
                        {/* Use the dynamically calculated total gift count */}
                        {t('gifts_total_count', '{{count}} επιλεγμένα δώρα για όλους', { count: filteredAndSortedProducts.length.toLocaleString(language === 'el' ? 'el-GR' : 'de-DE') })}
                    </p>
                </div>
            </div>

            {/* --- Main Content Wrapper (Filters & Products Grid) --- */}
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
                                    {t('deals_label', 'Προσφορές')} ({currentDealCount})
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
                        {/* Using custom class + Tailwind grid */}
                        <div className="p__products p__products--full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                           {filteredAndSortedProducts.length > 0 ? (
                                filteredAndSortedProducts.map(product => (
                                    <ProductCard key={product.id} product={product} className="p"/> // Use your ProductCard
                                ))
                           ) : (
                                <p className="col-span-full text-center py-10 text-gray-500">{t('no_gifts_found', 'Δεν βρέθηκαν δώρα με αυτά τα κριτήρια.')}</p>
                           )}
                        </div>
                        {/* End Product Grid */}
                        {/* Placeholder div for styling or potential pagination/infinite scroll */}
                        <div style={{ height: '1px' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gifts;
