import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { products as allMockProducts, Product } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import NotFound from '@/pages/NotFound';

// --- Reusable definitions ---
const giftRecipientCategories = [
    { slug: 'men', titleKey: 'giftsForMen', nameKey: 'men', imgBase: 'adult-m', groupKey: 'recipient_group_adults' },
    { slug: 'women', titleKey: 'giftsForWomen', nameKey: 'women', imgBase: 'adult-f', groupKey: 'recipient_group_adults' },
    { slug: 'teens', titleKey: 'giftsForTeens', nameKey: 'teens', imgBase: 'teen-both', groupKey: 'recipient_group_teens' },
    { slug: 'kids-9-11', titleKey: 'giftsForKids9_11', nameKey: 'kids9_11', imgBase: 'kid0911-both', groupKey: 'recipient_group_kids9_11' },
    { slug: 'kids-6-8', titleKey: 'giftsForKids6_8', nameKey: 'kids6_8', imgBase: 'kid0608-both', groupKey: 'recipient_group_kids6_8' },
    { slug: 'toddlers', titleKey: 'giftsForToddlers', nameKey: 'toddlers', imgBase: 'kid0305-both', groupKey: 'recipient_group_toddlers' },
    { slug: 'babies', titleKey: 'giftsForBabies', nameKey: 'babies', imgBase: 'baby-both', groupKey: 'recipient_group_babies' },
];

const mainRecipientGroups = [
    { slug: 'adults', nameKey: 'recipient_group_adults', childrenSlugs: ['men', 'women'] },
    { slug: 'teens', nameKey: 'recipient_group_teens', childrenSlugs: ['teens'] },
    { slug: 'kids9-11', nameKey: 'recipient_group_kids9_11', childrenSlugs: ['kids-9-11'] },
    { slug: 'kids6-8', nameKey: 'recipient_group_kids6_8', childrenSlugs: ['kids-6-8'] },
    { slug: 'toddlers', nameKey: 'recipient_group_toddlers', childrenSlugs: ['toddlers'] },
    { slug: 'babies', nameKey: 'recipient_group_babies', childrenSlugs: ['babies'] },
];

const priceRanges = [
    { value: '10', labelKey: 'price_upto_10' }, { value: '20', labelKey: 'price_upto_20' },
    { value: '30', labelKey: 'price_upto_30' }, { value: '50', labelKey: 'price_upto_50' },
    { value: '100', labelKey: 'price_upto_100' }, { value: '250', labelKey: 'price_upto_250' },
];

const sortOptions = [
    { value: 'id_desc', labelKey: 'sort_recent' }, { value: 'popularity_desc', labelKey: 'sort_most_popular' },
    { value: 'price_asc', labelKey: 'sort_cheapest' }, { value: 'price_desc', labelKey: 'sort_most_expensive' },
];

const getEffectiveLowestPrice = (product: Product, forSortDesc: boolean = false): number => {
    if (!product.prices || product.prices.length === 0) return forSortDesc ? 0 : Infinity;
    const inStockPrices = product.prices.filter(pr => pr.inStock);
    const pricesToConsider = inStockPrices.length > 0 ? inStockPrices : product.prices;
    if (pricesToConsider.length === 0) return forSortDesc ? 0 : Infinity;
    return Math.min(...pricesToConsider.map(pr => pr.discountPrice ?? pr.price));
};
// --- End Reusable definitions ---

const GiftsFiltered: React.FC = () => {
    const { t, language } = useTranslation();
    const { combinedSlug } = useParams<{ combinedSlug: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const { recipientSlug, activeInterestSlugs } = useMemo(() => {
        if (!combinedSlug) return { recipientSlug: undefined, activeInterestSlugs: [] };

        let foundRecipientSlug: string | undefined = undefined;
        let remainingSlugForInterests: string = combinedSlug;

        const sortedRecipientSlugs = [...giftRecipientCategories]
            .map(cat => cat.slug)
            .sort((a, b) => b.length - a.length);

        for (const potentialRecipientSlug of sortedRecipientSlugs) {
            if (combinedSlug.startsWith(potentialRecipientSlug)) {
                foundRecipientSlug = potentialRecipientSlug;
                if (combinedSlug.length > potentialRecipientSlug.length && combinedSlug[potentialRecipientSlug.length] === '-') {
                    remainingSlugForInterests = combinedSlug.substring(potentialRecipientSlug.length + 1);
                } else if (combinedSlug.length === potentialRecipientSlug.length) {
                    remainingSlugForInterests = '';
                } else {
                    // This case means combinedSlug starts with potentialRecipientSlug but isn't an exact match
                    // nor followed by a hyphen (e.g. /gifts/kid vs /gifts/kids-9-11).
                    // We matched the longest, so this shouldn't be an issue if 'kids-9-11' is checked before 'kids'.
                    // If only 'kids' matched and the URL was 'kids-stuff', it would be an invalid path.
                    // For now, if it matched via startsWith, it's the recipient.
                    remainingSlugForInterests = ''; 
                }
                break;
            }
        }

        if (!foundRecipientSlug) {
            // This case would mean the combinedSlug doesn't start with ANY known recipient slug.
            // It's an invalid path.
            return { recipientSlug: undefined, activeInterestSlugs: [] };
        }

        const interests = remainingSlugForInterests ? remainingSlugForInterests.split('-').filter(Boolean) : [];
        return { recipientSlug: foundRecipientSlug, activeInterestSlugs: interests };
    }, [combinedSlug]);


    const recipientInfo = useMemo(() => {
        if (!recipientSlug) return undefined;
        return giftRecipientCategories.find(cat => cat.slug === recipientSlug);
    }, [recipientSlug]);

    const currentRecipientGroupSlug = useMemo(() => {
        if (!recipientInfo) return '';
        const group = mainRecipientGroups.find(g => g.childrenSlugs.includes(recipientInfo.slug));
        return group ? group.slug : recipientInfo.slug;
    }, [recipientInfo]);

    const [selectedGender, setSelectedGender] = useState<string>(() => {
        const genderParam = searchParams.get('gender');
        if (genderParam) return genderParam;
        if (recipientSlug === 'men') return 'men';
        if (recipientSlug === 'women') return 'women';
        return 'all';
    });

    const [showDealsOnly, setShowDealsOnly] = useState(() => searchParams.get('deals') === '1');
    const [selectedPriceMax, setSelectedPriceMax] = useState(() => searchParams.get('price_max') || '');
    const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || 'id_desc');

    useEffect(() => {
        const genderParam = searchParams.get('gender');
        if (!genderParam) {
            if (recipientSlug === 'men' && selectedGender !== 'men') {
                setSelectedGender('men');
            } else if (recipientSlug === 'women' && selectedGender !== 'women') {
                setSelectedGender('women');
            } else if (recipientSlug && !['men', 'women'].includes(recipientSlug) && (selectedGender === 'men' || selectedGender === 'women')) {
                setSelectedGender('all');
            }
        } else {
            if (selectedGender !== genderParam) {
                setSelectedGender(genderParam);
            }
        }
    }, [recipientSlug, searchParams, selectedGender]);

    const filteredAndSortedProducts = useMemo(() => {
        if (!recipientSlug) return [];
        let filtered = allMockProducts.filter(p =>
            p.giftAttributes?.recipient?.includes(recipientSlug)
        );

        if (activeInterestSlugs.length > 0) {
            filtered = filtered.filter(p =>
                activeInterestSlugs.every(interest =>
                    p.giftAttributes?.interest?.includes(interest)
                )
            );
        }

        if ((selectedGender === 'boys' || selectedGender === 'girls') &&
            recipientSlug && !['men', 'women'].includes(recipientSlug)) {
            const targetGender = selectedGender === 'boys' ? 'male' : 'female';
            filtered = filtered.filter(p =>
                p.giftAttributes?.genderTarget === targetGender ||
                !p.giftAttributes?.genderTarget ||
                p.giftAttributes?.genderTarget === 'unisex'
            );
        }

        if (showDealsOnly) {
            filtered = filtered.filter(p =>
                p.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null) ||
                p.variants?.some(variant => variant.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null))
            );
        }
        if (selectedPriceMax) {
            const maxPrice = parseInt(selectedPriceMax, 10);
            if (!isNaN(maxPrice)) {
                filtered = filtered.filter(p => getEffectiveLowestPrice(p) <= maxPrice);
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
    }, [recipientSlug, activeInterestSlugs, showDealsOnly, selectedPriceMax, sortBy, selectedGender]);

     useEffect(() => {
        const params = new URLSearchParams();
        if (showDealsOnly) params.set('deals', '1');
        if (selectedPriceMax) params.set('price_max', selectedPriceMax);
        if (sortBy && sortBy !== 'id_desc') params.set('sort', sortBy);
        if ((selectedGender === 'boys' || selectedGender === 'girls') && recipientSlug && !['men', 'women'].includes(recipientSlug)) {
            params.set('gender', selectedGender);
        }
        const currentParamsString = searchParams.toString();
        const newParamsString = params.toString();
        if (newParamsString !== currentParamsString) {
            setSearchParams(params, { replace: true });
        }
    }, [showDealsOnly, selectedPriceMax, sortBy, selectedGender, recipientSlug, setSearchParams, searchParams]);

    const handleDealsToggle = (event: React.ChangeEvent<HTMLInputElement>) => setShowDealsOnly(event.target.checked);
    const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedPriceMax(event.target.value);
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSortBy(event.target.value);

    const handleRecipientGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGroupValue = event.target.value;
        const groupInfo = mainRecipientGroups.find(g => g.slug === selectedGroupValue);
        if (groupInfo && groupInfo.childrenSlugs.length > 0) {
            const targetSlug = groupInfo.childrenSlugs[0];
            const existingParams = new URLSearchParams(searchParams);
            existingParams.delete('gender');
            navigate(`/gifts/${targetSlug}${existingParams.toString() ? `?${existingParams.toString()}` : ''}`);
        }
    };

    const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newGenderValue = event.target.value;
        if (newGenderValue === 'men' && recipientSlug !== 'men') {
            const existingParams = new URLSearchParams(searchParams);
            existingParams.delete('gender');
            navigate(`/gifts/men${existingParams.toString() ? `?${existingParams.toString()}` : ''}`);
        } else if (newGenderValue === 'women' && recipientSlug !== 'women') {
            const existingParams = new URLSearchParams(searchParams);
            existingParams.delete('gender');
            navigate(`/gifts/women${existingParams.toString() ? `?${existingParams.toString()}` : ''}`);
        } else {
             setSelectedGender(newGenderValue);
        }
    };

    const handleInterestToggle = (interestToToggle: string) => {
        if (!recipientSlug) return;
        const newInterestSlugs = new Set(activeInterestSlugs);
        if (newInterestSlugs.has(interestToToggle)) {
            newInterestSlugs.delete(interestToToggle);
        } else {
            newInterestSlugs.add(interestToToggle);
        }
        const sortedNewInterests = Array.from(newInterestSlugs).sort();
        let newPath = `/gifts/${recipientSlug}`;
        if (sortedNewInterests.length > 0) {
            newPath += `-${sortedNewInterests.join('-')}`;
        }
        navigate(`${newPath}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
    };

    const currentDealCount = useMemo(() => {
        return filteredAndSortedProducts.filter(p =>
            p.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null) ||
            p.variants?.some(variant => variant.prices.some(price => price.discountPrice !== undefined && price.discountPrice !== null))
        ).length;
    }, [filteredAndSortedProducts]);

    if (!recipientSlug || !recipientInfo) {
        return <NotFound />;
    }

    const renderBreadcrumbs = () => (
        <div className="sc-dFaThA UNbCZ">
            <div id="trail">
                <nav itemType="https://schema.org/BreadcrumbList" className="breadcrumb">
                    <ol>
                        <li itemProp="itemListElement" itemType="https://schema.org/ListItem">
                            <Link itemProp="item" to="/" rel="home">
                                <span itemProp="name">{t('breadcrumbHome', 'BestPrice')}</span>
                            </Link>
                            <meta itemProp="position" content="1" />
                        </li>
                        <li itemProp="itemListElement" itemType="https://schema.org/ListItem">
                            <span itemprop="position" content="2"> › </span>
                            <Link itemProp="item" to="/gifts" className='inline-flex items-center'>
                                <svg className="icon trail__arrow mr-1" aria-hidden="true" width="16" height="16"><use href="/dist/images/icons/icons.svg#icon-backwards-16"></use></svg>
                                <span itemProp="name">{t('gifts', 'Δώρα')}</span>
                            </Link>
                            <meta itemProp="position" content="2" />
                        </li>
                        {/* Current Recipient Page (the last part of the breadcrumb, not a link) */}
                        {recipientInfo && ( // Ensure recipientInfo exists
                            <li itemProp="itemListElement" itemType="https://schema.org/ListItem">
                                <span itemprop="position" content="3"> › </span>
                                <span itemProp="name">{t(recipientInfo.nameKey)}</span>
                                <meta itemProp="position" content="3" />
                            </li>
                        )}
                    </ol>
                </nav>
            </div>
        </div>
    );

    const availableInterests = useMemo(() => {
        const interests = new Set<string>();
        const baseRecipientProducts = allMockProducts.filter(p =>
            p.giftAttributes?.recipient?.includes(recipientSlug!)
        );
        baseRecipientProducts.forEach(p => {
            p.giftAttributes?.interest?.forEach(interest => interests.add(interest));
        });
        return Array.from(interests).sort();
    }, [recipientSlug]);

    const genderOptions = useMemo(() => {
        if (!recipientInfo) return [{ value: 'all', labelKey: 'gender_all' }];
        if (['men', 'women'].includes(recipientInfo.slug)) {
            return [
                { value: 'all', labelKey: 'gender_all' },
                { value: 'men', labelKey: 'gender_men' },
                { value: 'women', labelKey: 'gender_women' },
            ];
        } else if (['teens', 'kids-9-11', 'kids-6-8', 'toddlers', 'babies'].includes(recipientInfo.slug)) {
            return [
                { value: 'all', labelKey: 'gender_all' },
                { value: 'boys', labelKey: 'gender_boys_target' },
                { value: 'girls', labelKey: 'gender_girls_target' },
            ];
        }
        return [{ value: 'all', labelKey: 'gender_all' }];
    }, [recipientInfo]);

    const translatedRecipientName = t(recipientInfo.nameKey);
    const lowercaseRecipientName = translatedRecipientName.toLowerCase();
    const h1PageTitle = t('giftsForRecipientTitle', { recipient: lowercaseRecipientName });

    return (
        <div id="gift-finder" className="gift-finder">
            <div className="sc-jScdur iyzBDo root__wrapper">
                <div className="sc-dcKlJK cquxZx root">
                    {renderBreadcrumbs()}
                    <div className="bjpNBM flex items-center w-full mt-4">
                        <img alt={h1PageTitle} width="92" height="92" src={`/dist/images/${recipientInfo.slug}.webp`} loading="eager" className="rounded-full mr-4"/>
                        <div>
                            <h1 className="sc-jPkiSJ cFyVWT">{(() => { const w = h1PageTitle.split(' '); if (w.length <= 1) return h1PageTitle; const fW = w[0]; const lR = w.slice(1).join(' '); return `${fW} ${lR.toLowerCase()}`; })()}</h1>
                            <div className="sc-dHKmnV kIiJVY">
                                <div className="sc-hBDmJg iJzdCa">
                                    <select value={currentRecipientGroupSlug} onChange={handleRecipientGroupChange}>
                                        {mainRecipientGroups.map(group => (
                                            <option key={group.slug} value={group.slug}>
                                                {t(group.nameKey)}
                                            </option>
                                        ))}
                                    </select>
                                    <select value={selectedGender} onChange={handleGenderChange}>
                                        {genderOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {t(opt.labelKey)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {availableInterests.length > 0 && (
                        <div className="sc-dTdQuR jfGtLT">
                            <div className="sc-elFkmj gmqSWM flex flex-wrap gap-2">
                                {availableInterests.map(interest => {
                                    const interestSlugified = interest.toLowerCase().replace(/\s+/g, '-');
                                    const isActive = activeInterestSlugs.includes(interestSlugified);
                                    return (
                                        <button
                                            key={interestSlugified}
                                            onClick={() => handleInterestToggle(interestSlugified)}
                                            className={`sc-kThouk lmQiLZ pressable border px-2 py-1 rounded text-sm ${isActive ? 'bg-blue-500 text-white font-bold' : 'hover:bg-gray-100'}`}
                                        >
                                            {t(`interest_${interest}`, interest)}
                                        </button>
                                    );
                                })}
                                {activeInterestSlugs.length > 0 && (
                                    <Link
                                        to={`/gifts/${recipientSlug}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
                                        className="sc-kThouk lmQiLZ pressable text-sm text-gray-500 ml-2 self-center"
                                    >
                                        {t('clear_all_interest_filters', 'Clear Interests')}
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                    <p haspreset={h1PageTitle} className="sc-dACwDz dsWkau">
                        {t('gifts_total_count', {
                            count: filteredAndSortedProducts.length,
                            recipient: lowercaseRecipientName
                        })}
                    </p>
                </div>
            </div>

            <div className="root__wrapper">
                <div className="root">
                    <div className="gift-finder__content">
                        <div className="sc-hZARmv MylkP">
                             <select value={sortBy} onChange={handleSortChange} aria-label={t('sort_by_label', 'Sort by')}>
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {t(option.labelKey, option.labelKey.replace(/_/g, ' '))}
                                    </option>
                                ))}
                            </select>
                            <div className="sc-dKKIkQ bqWucv">
                                <label className="bhTOi9I4I2nIIKPU_JUz flex items-center">
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

                        <div className="p__products p__products--full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                           {filteredAndSortedProducts.length > 0 ? (
                                filteredAndSortedProducts.map(product => (
                                    <ProductCard key={product.id} product={product} className="p"/>
                                ))
                           ) : (
                                <p className="col-span-full text-center py-10 text-gray-500">{t('no_gifts_found', 'No gifts found matching these criteria.')}</p>
                           )}
                        </div>
                        <div style={{ height: '1px' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiftsFiltered;
