import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { products as allMockProducts, Product } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import NotFound from '@/pages/NotFound';

// --- Reusable definitions ---
const primaryRecipientCategories = [
    { slug: 'adults', titleKey: 'giftsForAdults', nameKey: 'recipient_group_adults', imgBase: 'adult-both' },
    { slug: 'men', titleKey: 'giftsForMen', nameKey: 'men', imgBase: 'men' },
    { slug: 'women', titleKey: 'giftsForWomen', nameKey: 'women', imgBase: 'women' },
    { slug: 'teens', titleKey: 'giftsForTeens', nameKey: 'teens', imgBase: 'teens' },
    { slug: 'kids-9-11', titleKey: 'giftsForKids9_11', nameKey: 'kids9_11', imgBase: 'kids-9-11' },
    { slug: 'kids-6-8', titleKey: 'giftsForKids6_8', nameKey: 'kids6_8', imgBase: 'kids-6-8' },
    { slug: 'toddlers', titleKey: 'giftsForToddlers', nameKey: 'toddlers', imgBase: 'toddlers' },
    { slug: 'babies', titleKey: 'giftsForBabies', nameKey: 'babies', imgBase: 'babies' },
];

const genderImages: Record<string, Record<string, string>> = {
    adults: { all: 'adult-both'},
    men:    { all: 'men' },
    women:  { all: 'women' },
    teens: { boys: 'teen-m', girls: 'teen-f', all: 'teens' },
    'kids-9-11': { boys: 'kid0911-m', girls: 'kid0911-f', all: 'kids-9-11' },
    'kids-6-8': { boys: 'kid0608-m', girls: 'kid0608-f', all: 'kids-6-8' },
    toddlers: { boys: 'kid0305-m', girls: 'kid0305-f', all: 'toddlers' },
    babies: { boys: 'baby-m', girls: 'baby-f', all: 'babies' },
};

const mainRecipientGroups = [
    { slug: 'adults', nameKey: 'recipient_group_adults', defaultNavigationSlug: 'adults'},
    { slug: 'teens', nameKey: 'recipient_group_teens', defaultNavigationSlug: 'teens'},
    { slug: 'kids9-11', nameKey: 'recipient_group_kids9_11', defaultNavigationSlug: 'kids-9-11'},
    { slug: 'kids6-8', nameKey: 'recipient_group_kids6_8', defaultNavigationSlug: 'kids-6-8'},
    { slug: 'toddlers', nameKey: 'recipient_group_toddlers', defaultNavigationSlug: 'toddlers'},
    { slug: 'babies', nameKey: 'recipient_group_babies', defaultNavigationSlug: 'babies'},
];

const GENDER_SUB_SLUGS = ['boys', 'girls'];
const PRIMARY_GENDER_SLUGS = ['men', 'women'];

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

    const { baseRecipientSlug, genderSlugFromPath, activeInterestSlugs } = useMemo(() => {
        if (!combinedSlug) return { baseRecipientSlug: undefined, genderSlugFromPath: undefined, activeInterestSlugs: [] };
        let tempCombinedSlug = combinedSlug;
        let foundBaseRecipientSlug: string | undefined = undefined;
        let foundGenderSlug: string | undefined = undefined;
        let interests: string[] = [];
        const sortedPrimarySlugs = [...primaryRecipientCategories]
            .map(cat => cat.slug)
            .sort((a, b) => b.length - a.length);

        for (const primarySlug of sortedPrimarySlugs) {
            if (tempCombinedSlug.startsWith(primarySlug)) {
                foundBaseRecipientSlug = primarySlug;
                tempCombinedSlug = tempCombinedSlug.substring(primarySlug.length);
                if (tempCombinedSlug.startsWith('-')) {
                    tempCombinedSlug = tempCombinedSlug.substring(1);
                }
                break;
            }
        }

        if (!foundBaseRecipientSlug) return { baseRecipientSlug: undefined, genderSlugFromPath: undefined, activeInterestSlugs: [] };

        if (!PRIMARY_GENDER_SLUGS.includes(foundBaseRecipientSlug) && foundBaseRecipientSlug !== 'adults') {
            const partsAfterBase = tempCombinedSlug.split('-');
            if (partsAfterBase.length > 0 && GENDER_SUB_SLUGS.includes(partsAfterBase[0])) {
                foundGenderSlug = partsAfterBase[0];
                tempCombinedSlug = partsAfterBase.slice(1).join('-');
            }
        } else if (PRIMARY_GENDER_SLUGS.includes(foundBaseRecipientSlug)) {
            foundGenderSlug = foundBaseRecipientSlug;
        } else if (foundBaseRecipientSlug === 'adults') {
            foundGenderSlug = 'all';
        }

        if (tempCombinedSlug) {
            interests = tempCombinedSlug.split('-').filter(Boolean);
        }
        return { baseRecipientSlug: foundBaseRecipientSlug, genderSlugFromPath: foundGenderSlug, activeInterestSlugs: interests };
    }, [combinedSlug]);

    const recipientInfo = useMemo(() => {
        if (!baseRecipientSlug) return undefined;
        return primaryRecipientCategories.find(cat => cat.slug === baseRecipientSlug);
    }, [baseRecipientSlug]);

    const currentRecipientGroupSlug = useMemo(() => {
        if (!recipientInfo) return '';
        if (['adults', 'men', 'women'].includes(recipientInfo.slug)) return 'adults';
        const group = mainRecipientGroups.find(g => g.defaultNavigationSlug === recipientInfo.slug);
        return group ? group.slug : recipientInfo.slug;
    }, [recipientInfo]);

    const selectedGenderForDropdown = genderSlugFromPath || 'all';

    const [headerImage, setHeaderImage] = useState<string>('');
    const [showDealsOnly, setShowDealsOnly] = useState(() => searchParams.get('deals') === '1');
    const [selectedPriceMax, setSelectedPriceMax] = useState(() => searchParams.get('price_max') || '');
    const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || 'id_desc');

    useEffect(() => {
        if (!recipientInfo) {
            setHeaderImage('/dist/images/placeholder.webp'); return;
        }
        let imageBaseToUse = recipientInfo.imgBase;
        const currentGenderDisplay = genderSlugFromPath || 'all';
        if (currentGenderDisplay === 'all') {
            const groupForImage = currentRecipientGroupSlug;
            if (genderImages[groupForImage] && genderImages[groupForImage]['all']) {
                imageBaseToUse = genderImages[groupForImage]['all'];
            } else {
                imageBaseToUse = recipientInfo.imgBase;
            }
        } else if (genderImages[baseRecipientSlug!] && genderImages[baseRecipientSlug!][currentGenderDisplay]) {
            imageBaseToUse = genderImages[baseRecipientSlug!][currentGenderDisplay];
        } else if (currentGenderDisplay === 'men' && genderImages.men?.all) {
            imageBaseToUse = genderImages.men.all;
        } else if (currentGenderDisplay === 'women' && genderImages.women?.all) {
            imageBaseToUse = genderImages.women.all;
        }
        setHeaderImage(`/dist/images/${imageBaseToUse}.webp`);
    }, [recipientInfo, baseRecipientSlug, genderSlugFromPath, currentRecipientGroupSlug]);

    const filteredAndSortedProducts = useMemo(() => {
        if (!baseRecipientSlug) return [];
        let productsToFilter = allMockProducts;
        let filtered: Product[];

        if (baseRecipientSlug === 'adults') {
            filtered = productsToFilter.filter(p =>
                p.giftAttributes?.recipient?.includes('men') ||
                p.giftAttributes?.recipient?.includes('women')
            );
            if (genderSlugFromPath === 'men') {
                filtered = filtered.filter(p => p.giftAttributes?.recipient?.includes('men'));
            } else if (genderSlugFromPath === 'women') {
                filtered = filtered.filter(p => p.giftAttributes?.recipient?.includes('women'));
            }
        } else {
            filtered = productsToFilter.filter(p =>
                p.giftAttributes?.recipient?.includes(baseRecipientSlug)
            );
            if (genderSlugFromPath === 'boys' || genderSlugFromPath === 'girls') {
                const target = genderSlugFromPath === 'boys' ? 'male' : 'female';
                filtered = filtered.filter(p =>
                    p.giftAttributes?.genderTarget === target ||
                    !p.giftAttributes?.genderTarget ||
                    p.giftAttributes?.genderTarget === 'unisex'
                );
            }
        }
        if (activeInterestSlugs.length > 0) {
            filtered = filtered.filter(p =>
                activeInterestSlugs.every(interest =>
                    p.giftAttributes?.interest?.includes(interest)
                )
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
    }, [baseRecipientSlug, genderSlugFromPath, activeInterestSlugs, showDealsOnly, selectedPriceMax, sortBy]);

     useEffect(() => {
        const params = new URLSearchParams();
        if (showDealsOnly) params.set('deals', '1');
        if (selectedPriceMax) params.set('price_max', selectedPriceMax);
        if (sortBy && sortBy !== 'id_desc') params.set('sort', sortBy);
        // Gender is now part of the path slug, so no longer a query parameter.
        const currentParamsString = searchParams.toString();
        const newParamsString = params.toString();
        if (newParamsString !== currentParamsString) {
            setSearchParams(params, { replace: true });
        }
    }, [showDealsOnly, selectedPriceMax, sortBy, setSearchParams, searchParams]);

    const handleDealsToggle = (event: React.ChangeEvent<HTMLInputElement>) => setShowDealsOnly(event.target.checked);
    const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedPriceMax(event.target.value);
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSortBy(event.target.value);

    const handleRecipientGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGroupSlug = event.target.value;
        const groupInfo = mainRecipientGroups.find(g => g.slug === selectedGroupSlug);
        if (groupInfo) {
            let targetSlug = groupInfo.defaultNavigationSlug;
            // If current genderSlugFromPath is 'boys' or 'girls' and the new target group supports them
            if ((genderSlugFromPath === 'boys' || genderSlugFromPath === 'girls') &&
                !['adults', 'men', 'women'].includes(targetSlug) && // Target is teens, kids etc.
                genderOptions.some(opt => opt.value === genderSlugFromPath) // Check if new group has this gender option
            ) {
                 targetSlug = `${targetSlug}-${genderSlugFromPath}`;
            }
            // Interests are cleared when changing main recipient group
            navigate(`/gifts/${targetSlug}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
        }
    };

    const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newGenderValue = event.target.value;
        let newCombinedSlugPart = baseRecipientSlug!;

        if (currentRecipientGroupSlug === 'adults') {
            if (newGenderValue === 'all') newCombinedSlugPart = 'adults';
            else if (newGenderValue === 'men') newCombinedSlugPart = 'men';
            else if (newGenderValue === 'women') newCombinedSlugPart = 'women';
            else newCombinedSlugPart = 'adults';
        } else {
            if (newGenderValue === 'boys' || newGenderValue === 'girls') {
                newCombinedSlugPart = `${baseRecipientSlug}-${newGenderValue}`;
            }
            // If 'all', newCombinedSlugPart remains baseRecipientSlug
        }
        // When gender changes, interests are cleared from the path.
        navigate(`/gifts/${newCombinedSlugPart}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
    };

    const handleInterestToggle = (interestToToggle: string) => {
        if (!baseRecipientSlug) return;
        let currentPathBaseWithGender = baseRecipientSlug;
        if (genderSlugFromPath && genderSlugFromPath !== 'all' && GENDER_SUB_SLUGS.includes(genderSlugFromPath)) {
            currentPathBaseWithGender = `${baseRecipientSlug}-${genderSlugFromPath}`;
        } else if (PRIMARY_GENDER_SLUGS.includes(baseRecipientSlug)) {
             currentPathBaseWithGender = baseRecipientSlug;
        } else if (baseRecipientSlug === 'adults' && (genderSlugFromPath === 'all' || !genderSlugFromPath) ) {
             currentPathBaseWithGender = 'adults';
        }

        const newInterestSlugs = new Set(activeInterestSlugs);
        if (newInterestSlugs.has(interestToToggle)) {
            newInterestSlugs.delete(interestToToggle);
        } else {
            newInterestSlugs.add(interestToToggle);
        }
        const sortedNewInterests = Array.from(newInterestSlugs).sort();
        let newPath = `/gifts/${currentPathBaseWithGender}`;
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

    if (!baseRecipientSlug || !recipientInfo) {
        return <NotFound />;
    }

    const renderBreadcrumbs = () => (
        <div className="sc-dFaThA UNbCZ">
            <div id="trail">
                <nav itemType="https://schema.org/BreadcrumbList" className="breadcrumb">
                    <ol>
                        <li itemProp="itemListElement" itemType="https://schema.org/ListItem">
                            <Link itemProp="item" to="/" rel="home"><span itemProp="name">{t('breadcrumbHome', 'BestPrice')}</span></Link>
                            <meta itemProp="position" content="1" />
                        </li>
                        <li itemProp="itemListElement" itemType="https://schema.org/ListItem">
                            <span itemProp="position" content="2"> › </span> {/* Corrected itemprop */}
                            <Link itemProp="item" to="/gifts" className='inline-flex items-center'>
                                <svg className="icon trail__arrow mr-1" aria-hidden="true" width="16" height="16"><use href="/dist/images/icons/icons.svg#icon-backwards-16"></use></svg>
                                <span itemProp="name">{t('gifts', 'Δώρα')}</span>
                            </Link>
                            <meta itemProp="position" content="2" />
                        </li>
                        {recipientInfo && (
                            <li itemProp="itemListElement" itemType="https://schema.org/ListItem">
                                <span itemProp="position" content="3"> › </span> {/* Corrected itemprop */}
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
        const initialProducts = allMockProducts.filter(p => {
            if (baseRecipientSlug === 'adults') {
                return p.giftAttributes?.recipient?.includes('men') || p.giftAttributes?.recipient?.includes('women');
            }
            return p.giftAttributes?.recipient?.includes(baseRecipientSlug!);
        });
        initialProducts.forEach(p => {
            p.giftAttributes?.interest?.forEach(interest => interests.add(interest));
        });
        return Array.from(interests).sort();
    }, [baseRecipientSlug]);

    const genderOptions = useMemo(() => {
        if (!recipientInfo) return [{ value: 'all', labelKey: 'gender_all' }];
        if (currentRecipientGroupSlug === 'adults') {
            return [
                { value: 'all', labelKey: 'gender_all' },
                { value: 'men', labelKey: 'gender_men' },
                { value: 'women', labelKey: 'gender_women' },
            ];
        } else if (primaryRecipientCategories.some(cat => cat.slug === baseRecipientSlug && !PRIMARY_GENDER_SLUGS.includes(cat.slug) && cat.slug !== 'adults')) {
            return [
                { value: 'all', labelKey: 'gender_all' },
                { value: 'boys', labelKey: 'gender_boys_target' },
                { value: 'girls', labelKey: 'gender_girls_target' },
            ];
        }
        return [{ value: 'all', labelKey: 'gender_all' }];
    }, [recipientInfo, baseRecipientSlug, currentRecipientGroupSlug]);

    const h1PageTitle = useMemo(() => {
        if (!recipientInfo) return '';
        let titleKey = recipientInfo.titleKey;
        let titleOptions: Record<string, string> = { recipient: t(recipientInfo.nameKey).toLowerCase() };

        if (baseRecipientSlug === 'adults') {
            if (genderSlugFromPath === 'men') titleKey = 'giftsForMen';
            else if (genderSlugFromPath === 'women') titleKey = 'giftsForWomen';
            else titleKey = 'giftsForAdults';
            titleOptions = { recipient: t(genderSlugFromPath && genderSlugFromPath !== 'all' && PRIMARY_GENDER_SLUGS.includes(genderSlugFromPath) ? genderSlugFromPath : 'recipient_group_adults').toLowerCase() };
        } else if (genderSlugFromPath === 'boys') {
            const specificKey = `giftsForMale${recipientInfo.nameKey.charAt(0).toUpperCase() + recipientInfo.nameKey.slice(1).replace(/-/g, '')}`;
            return t(specificKey, `${t('gifts_label','Gifts')} ${t('for_interest','for')} ${t('gender_boys_target','Boys')} ${t(recipientInfo.nameKey)}`);
        } else if (genderSlugFromPath === 'girls') {
            const specificKey = `giftsForFemale${recipientInfo.nameKey.charAt(0).toUpperCase() + recipientInfo.nameKey.slice(1).replace(/-/g, '')}`;
            return t(specificKey, `${t('gifts_label','Gifts')} ${t('for_interest','for')} ${t('gender_girls_target','Girls')} ${t(recipientInfo.nameKey)}`);
        }
        return t(titleKey, titleOptions);
    }, [recipientInfo, baseRecipientSlug, genderSlugFromPath, t]);

    const countRecipientName = useMemo(() => {
        if (!recipientInfo) return '';
        if (baseRecipientSlug === 'adults') {
            if (genderSlugFromPath === 'men') return t('men').toLowerCase();
            if (genderSlugFromPath === 'women') return t('women').toLowerCase();
            return t('recipient_group_adults').toLowerCase();
        }
        if (genderSlugFromPath === 'boys') return `${t('gender_boys_target')} ${t(recipientInfo.nameKey)}`.toLowerCase();
        if (genderSlugFromPath === 'girls') return `${t('gender_girls_target')} ${t(recipientInfo.nameKey)}`.toLowerCase();
        return t(recipientInfo.nameKey).toLowerCase();
    }, [recipientInfo, baseRecipientSlug, genderSlugFromPath, t]);

    return (
        <div id="gift-finder" className="gift-finder">
            <div className="sc-jScdur iyzBDo root__wrapper">
                <div className="sc-dcKlJK cquxZx root">
                    {renderBreadcrumbs()}
                    <div className="bjpNBM flex items-center w-full mt-4">
                        <img alt={h1PageTitle} width="92" height="92" src={headerImage || `/dist/images/placeholder.webp`} loading="eager" className="rounded-full mr-4"/>
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
                                    <select value={selectedGenderForDropdown} onChange={handleGenderChange}>
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
                                            className={`sc-kThouk lmQiLZ pressable ${isActive ? 'bg-blue-500 text-white font-bold' : 'hover:bg-gray-100'}`}
                                        >
                                            {t(`interest_${interest}`, interest)}
                                        </button>
                                    );
                                })}
                            </div>
                            {activeInterestSlugs.length > 0 && (
                                <Link 
                                    to={`/gifts/${baseRecipientSlug}${genderSlugFromPath && genderSlugFromPath !== 'all' && GENDER_SUB_SLUGS.includes(genderSlugFromPath) ? `-${genderSlugFromPath}` : (PRIMARY_GENDER_SLUGS.includes(baseRecipientSlug!) ? '' : (baseRecipientSlug === 'adults' && (genderSlugFromPath === 'men' || genderSlugFromPath === 'women') ? '' : (baseRecipientSlug === 'adults' ? '' : '')))}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
                                    className="sc-llIIlC zAYuO pressable"
                                >
                                    {t('clear_all_interest_filters', 'Clear Interests')}
                                </Link>
                            )}
                        </div>
                    )}

                    <p haspreset={h1PageTitle} className="sc-dACwDz dsWkau">
                        {t('gifts_total_count', {
                            count: filteredAndSortedProducts.length,
                            recipient: countRecipientName
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
                                    <option value="">{t('price_filter_label', 'Price')}</option>
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
