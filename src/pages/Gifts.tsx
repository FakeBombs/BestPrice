import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { products as allMockProducts, Product } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

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

// Helper to get the effective lowest price for a product
const getEffectiveLowestPrice = (product: Product, forSortDesc: boolean = false): number => {
    // Use pre-calculated lowestPrice if available and reliable
    // For this example, we'll always calculate dynamically for accuracy with filters
    // if (product.lowestPrice !== undefined && product.lowestPrice !== null) {
    //     return product.lowestPrice;
    // }

    if (!product.prices || product.prices.length === 0) {
        return forSortDesc ? 0 : Infinity; // Handle products with no price info
    }

    const inStockPrices = product.prices.filter(pr => pr.inStock);
    const pricesToConsider = inStockPrices.length > 0 ? inStockPrices : product.prices;

    if (pricesToConsider.length === 0) { // Should not happen if product.prices has items
        return forSortDesc ? 0 : Infinity;
    }

    return Math.min(...pricesToConsider.map(pr => pr.discountPrice ?? pr.price));
};


const Gifts: React.FC = () => {
    const { t, language } = useTranslation(); // language from useTranslation
    const [searchParams, setSearchParams] = useSearchParams();

    const [showDealsOnly, setShowDealsOnly] = useState(() => searchParams.get('deals') === '1');
    const [selectedPriceMax, setSelectedPriceMax] = useState(() => searchParams.get('price_max') || '');
    const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || 'id_desc');

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = allMockProducts.filter(p => p.giftAttributes);

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
                    const effectivePrice = getEffectiveLowestPrice(p);
                    return effectivePrice <= maxPrice;
                });
            }
        }

        const sorted = [...filtered];
        switch (sortBy) {
             case 'popularity_desc': sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0)); break;
            case 'price_asc': sorted.sort((a, b) => getEffectiveLowestPrice(a) - getEffectiveLowestPrice(b)); break;
            case 'price_desc': sorted.sort((a, b) => getEffectiveLowestPrice(b) - getEffectiveLowestPrice(a)); break;
            case 'id_desc': default: sorted.sort((a, b) => b.id - a.id); break;
        }
        return sorted;
    }, [showDealsOnly, selectedPriceMax, sortBy, allMockProducts]); // Added allMockProducts

     useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (showDealsOnly) params.set('deals', '1'); else params.delete('deals');
        if (selectedPriceMax) params.set('price_max', selectedPriceMax); else params.delete('price_max');
        if (sortBy && sortBy !== 'id_desc') params.set('sort', sortBy); else params.delete('sort');
        
        if (params.toString() !== searchParams.toString()) {
            setSearchParams(params, { replace: true });
        }
    }, [showDealsOnly, selectedPriceMax, sortBy, setSearchParams, searchParams]);

    const handleDealsToggle = (event: React.ChangeEvent<HTMLInputElement>) => setShowDealsOnly(event.target.checked);
    const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedPriceMax(event.target.value);
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSortBy(event.target.value);

    const currentDealCount = useMemo(() => {
        return filteredAndSortedProducts.filter(p =>
            p.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null) ||
            p.variants?.some(variant => variant.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null))
        ).length;
    }, [filteredAndSortedProducts]);

    return (
        <div id="gift-finder" className="gift-finder">
            <div className="sc-jScdur iyzBDo root__wrapper">
                <div className="sc-dcKlJK cquxZx root">
                    <img alt={t('gifts_page_alt', 'Gift Ideas at BestPrice')} width="200" height="108" className="sc-guGTOK irbLXu" src="/assets/gift.svg" loading="eager"/>
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
                        {t('gifts_total_count', { count: filteredAndSortedProducts.length, recipient: t('recipient_everyone') })}
                    </p>
                </div>
            </div>

            <div className="root__wrapper">
                <div className="root">
                    <div className="gift-finder__content">
                        <div className="sc-hZARmv MylkP"> {/* Filter Bar */}
                             <select value={sortBy} onChange={handleSortChange} aria-label={t('sort_by_label', 'Sort by')}>
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {t(option.labelKey, option.labelKey.replace(/_/g, ' '))}
                                    </option>
                                ))}
                            </select>
                            <div className="sc-dKKIkQ bqWucv"> {/* Other filters */}
                                <label className="bhTOi9I4I2nIIKPU_JUz">
                                    {t('deals_label', 'Deals')} ({currentDealCount})
                                    <input type="checkbox" checked={showDealsOnly} onChange={handleDealsToggle} className="mr-1"/>
                                </label>
                                <select value={selectedPriceMax} onChange={handlePriceChange} aria-label={t('price_filter_label', 'Price')}>
                                    <option value="">{t('price_filter_label', 'Τιμή')}</option>
                                    {priceRanges.map(range => (
                                        <option key={range.value} value={range.value}>
                                            {t(range.labelKey, `Up to €${range.value}`)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="p__products p__products--full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                           {filteredAndSortedProducts.length > 0 ? (
                                filteredAndSortedProducts.map(product => (
                                    <ProductCard key={product.id} product={product} className="p"/>
                                ))
                           ) : (
                                <p className="col-span-full text-center py-10 text-gray-500">{t('no_gifts_found', 'Δεν βρέθηκαν δώρα με αυτά τα κριτήρια.')}</p>
                           )}
                        </div>
                        <div style={{ height: '1px' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gifts;
