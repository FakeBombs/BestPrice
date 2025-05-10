import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import { Product, ProductPrice } from '@/data/productData';
import { products as allMockProducts } from '@/data/productData';
import { Category, mainCategories, categories as subCategories } from '@/data/categoriesData';
import { Vendor, vendors, PaymentMethod, OpeningHours } from '@/data/vendorData';
import { Brand, brands as allBrands } from '@/data/brandData';
import { searchProducts } from '@/data/helpers';
import ScrollableSlider from '@/components/ScrollableSlider';
import PaymentMethodsComponent from '@/components/PaymentMethods';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';
import ProductCard from '@/components/ProductCard';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const MAX_DISPLAY_COUNT = 10;

const cleanDomainName = (url: string): string => {
  if (!url) return '';
  try { const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`); return parsedUrl.hostname.replace(/^www\./i, ''); }
  catch (e) { return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]; }
};

interface AvailableCategory {
    id: number; category: string; slug: string; count: number; image: string | null; parentId: number | null;
}

interface VendorPageProps { }

// Moved useOpeningStatus hook here from ProductDetail for reuse or define it in a shared utils file
const useOpeningStatus = () => {
    const { t } = useTranslation();
    const getStatus = useCallback((openingHours: OpeningHours[] | undefined): { text: string, isOpen: boolean } => {
        if (!openingHours || openingHours.length === 0) { return { text: t('openingHoursNotAvailable', "Opening hours information not available"), isOpen: false }; }
        try {
            const now = new Date();
            const currentDayIndex = now.getDay();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const currentDayName = days[currentDayIndex] as OpeningHours['dayOfWeek'];
            const currentTime = now.getHours() * 100 + now.getMinutes();
            const todayHours = openingHours.find(h => h.dayOfWeek === currentDayName);
            if (!todayHours || !todayHours.opens || !todayHours.closes) { return { text: t('closedToday', "Closed today"), isOpen: false }; }
            const opensTime = parseInt(todayHours.opens.replace(':', ''), 10);
            const closesTime = parseInt(todayHours.closes.replace(':', ''), 10);
            if (!isNaN(opensTime) && !isNaN(closesTime)) {
                if (currentTime >= opensTime && currentTime < closesTime) { return { text: t('openUntil', { time: todayHours.closes }), isOpen: true }; }
                else if (currentTime < opensTime) { return { text: t('closedOpensAt', { time: todayHours.opens }), isOpen: false }; }
                else { return { text: t('closedForToday', "Closed for today"), isOpen: false }; }
            } else { return { text: t('openingHoursError', "Error in opening hours"), isOpen: false }; }
        } catch (error) {
            console.error("Error calculating opening status:", error);
            return { text: t('openingHoursError', "Error in opening hours"), isOpen: false };
        }
    }, [t]);
    return getStatus;
};


const VendorPage: React.FC<VendorPageProps> = () => {
    const { vendorId, vendorName: routeVendorName } = useParams<{ vendorId?: string, vendorName?: string }>(); // Renamed vendorName from params
    const { toast } = useToast();
    const { user } = useAuth();
    const { t, language } = useTranslation(); // Added language for toLocaleDateString
    const getOpeningStatusForVendor = useOpeningStatus();
    const navigate = useNavigate(); // For potential slug redirection

    const [selectedVendor, setSelectedVendor] = useState<Vendor | null | undefined>(undefined);
    const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
    const [vendorDeals, setVendorDeals] = useState<Product[]>([]);
    const [vendorPopularCategories, setVendorPopularCategories] = useState<AvailableCategory[]>([]);
    const [vendorBrands, setVendorBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);

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
    useHtmlAttributes(classNamesForHtml, 'page-merchant');
    useBodyAttributes(classNamesForBody, '');

    const vendorIdMap = useMemo(() => new Map(vendors.map(v => [v.id, v])), []);

    const formatVendorSlug = (name: string): string => name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

    useEffect(() => {
        setLoading(true);
        let foundVendor: Vendor | undefined = undefined;
        const numericId = vendorId ? parseInt(vendorId, 10) : NaN;

        if (!isNaN(numericId)) {
            foundVendor = vendorIdMap.get(numericId);
        } else if (routeVendorName) {
            const cleanedName = routeVendorName.toLowerCase();
            foundVendor = vendors.find(v =>
                v.slug === cleanedName ||
                formatVendorSlug(v.name) === cleanedName ||
                cleanDomainName(v.url).split('.')[0] === cleanedName
            );
        }

        setSelectedVendor(foundVendor || null);
        setLoading(false);

        // Slug redirection logic
        if (foundVendor && routeVendorName && (foundVendor.slug || formatVendorSlug(foundVendor.name)) !== routeVendorName) {
            const correctSlug = foundVendor.slug || formatVendorSlug(foundVendor.name);
            navigate(`/m/${foundVendor.id}/${correctSlug}`, { replace: true });
        } else if (foundVendor && !routeVendorName && vendorId) { // If accessed by ID but no name in URL
             const correctSlug = foundVendor.slug || formatVendorSlug(foundVendor.name);
             navigate(`/m/${foundVendor.id}/${correctSlug}`, { replace: true });
        }

    }, [vendorId, routeVendorName, vendorIdMap, navigate]);

    useEffect(() => {
        if (selectedVendor) {
            const productsFromVendor = allMockProducts.filter(p => p.prices.some(price => price.vendorId === selectedVendor.id));
            setVendorProducts(productsFromVendor);

            const deals = productsFromVendor.filter(p => p.prices.some(pr => pr.vendorId === selectedVendor.id && pr.discountPrice && pr.discountPrice < pr.price)).slice(0, 10);
            setVendorDeals(deals);

            const categoryCounts: Record<number, number> = {};
            productsFromVendor.forEach(p => { (p.categoryIds || []).forEach(catId => { categoryCounts[catId] = (categoryCounts[catId] || 0) + 1; }); });
            const allCatsMap = new Map([...mainCategories, ...subCategories].map(c => [c.id, c]));
            const popularCats = Object.entries(categoryCounts)
                .map(([idStr, count]) => {
                    const id = parseInt(idStr, 10);
                    const categoryData = allCatsMap.get(id);
                    return categoryData ? { id: categoryData.id, category: categoryData.name, slug: categoryData.slug, count, image: categoryData.image, parentId: categoryData.parentId } : null;
                })
                .filter((cat): cat is AvailableCategory => cat !== null)
                .sort((a, b) => b.count - a.count)
                .slice(0, 6);
            setVendorPopularCategories(popularCats);

            const brandNames = new Set<string>();
            productsFromVendor.forEach(p => { if (p.brand) brandNames.add(p.brand); });
            setVendorBrands(allBrands.filter(b => brandNames.has(b.name)).slice(0, 10));
        } else {
            setVendorProducts([]); setVendorDeals([]); setVendorPopularCategories([]); setVendorBrands([]);
        }
    }, [selectedVendor]);

    const openingStatus = useMemo(() => getOpeningStatusForVendor(selectedVendor?.openingHours), [selectedVendor, getOpeningStatusForVendor]);
    const additionalAddresses = useMemo(() => (!selectedVendor || !selectedVendor.address || selectedVendor.address.length <= 1) ? 0 : selectedVendor.address.length - 1, [selectedVendor]);

    if (loading) { return <div className="loading-placeholder">{t('loadingVendor', 'Loading store...')}</div>; }
    if (!selectedVendor) { return <NotFound />; }
    const vendor = selectedVendor; // Alias for convenience

    return (
        <div id="root" className="clr">
            <section className="merchant-hero root_wrapper" style={{ background: 'var(--colors-themed-card-bg)', borderBottom: 0 }}>
                <div className="root">
                    <div className="merchant-trail">
                        <div id="trail">
                            <nav className="breadcrumb">
                                <ol>
                                    <li><Link to="/" rel="home"><span>{t('breadcrumbHome', 'BestPrice')}</span></Link><span className="trail__breadcrumb-separator">›</span></li>
                                    <li><Link to="/m"><span>{t('allStores', 'Stores')}</span></Link></li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="merchant-logo">
                        <img src={vendor.logo} alt={t('logoFor', { name: vendor.name }) || `${vendor.name} logo`} title={vendor.name} loading="lazy" />
                        {vendor.certification && (
                            <span className="merchant-logo--certification" data-certification={vendor.certification.toLowerCase()}>
                                <svg aria-hidden="true" className="icon" width="22" height="22"><use href={`/dist/images/icons/certification.svg#icon-${vendor.certification.toLowerCase()}-22`}></use></svg>
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {vendor.certification && (
            <div className={`merchant-certified--wrapper merchant-certified--${vendor.certification.toLowerCase()} root__wrapper`}>
                <div className="root merchant-certified">
                    <svg aria-hidden="true" className="icon" width={22} height={22}><use href={`/dist/images/icons/certification.svg#icon-${vendor.certification.toLowerCase()}-22`}></use></svg>
                    <span className="hide-tablet">{t('certifiedStoreLinkText', {certificationLevel: vendor.certification})}</span>
                    <span className="hide-mobile">{t('certifiedStoreFullText', {vendorName: vendor.name, certificationLevel: vendor.certification})}</span>
                </div>
            </div>
            )}

            <div className="masthead__wrapper root__wrapper">
                <div className="root">
                    <div className="masthead">
                        <div className="masthead__main">
                            <div className="id">
                                <div className="id__title">
                                    <h1 itemProp="name">{vendor.name}</h1>
                                </div>
                                <div className="masthead__id">
                                    <div className="masthead__id-section">
                                        <div>
                                            {vendor.rating && (
                                                <div className="id__rating-wrapper">
                                                    <a className="id__rating" href={`#merchant-reviews`} title={t('ratingTooltip', {rating: vendor.rating.toFixed(1), count: vendor.numberOfRatings || '?'})}>
                                                        <span className="rating rating-all" data-total={vendor.rating.toFixed(1)}>
                                                            <svg aria-hidden="true" className="icon" style={{ clipPath: `inset(0 ${10 - (vendor.rating * 2)}em 0 0)`, width: '5em', height: '1em' }}><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                                                        </span>
                                                        {vendor.numberOfRatings && <span className="id__rating-count">({vendor.numberOfRatings})</span>}
                                                    </a>
                                                </div>
                                            )}
                                            <ul className="id__meta">
                                                {vendor.dateJoined && ( <li data-type="joined"><span className="ui-kit__text ui-kit__muted">{t('memberSinceDate', { date: new Date(vendor.dateJoined).toLocaleDateString(language, { day: '2-digit', month: '2-digit', year: 'numeric'}) })}</span></li> )}
                                                {vendor.socialLinks && Object.keys(vendor.socialLinks).length > 0 && (
                                                    <li data-type="social" style={{ display: 'flex' }}>
                                                        <span className="social-links">
                                                            {Object.entries(vendor.socialLinks).map(([platform, url]) => (
                                                               <a key={platform} className="pressable new-icon" data-tooltip={t(`social_${platform.toLowerCase()}`, platform.charAt(0).toUpperCase() + platform.slice(1))} rel="external nofollow noopener" target="_blank" href={url}>
                                                                <svg aria-hidden="true" className="icon icon--outline" width="16" height="16"><use href={`/dist/images/icons/social.svg#icon-${platform.toLowerCase()}`}></use></svg>
                                                               </a>
                                                            ))}
                                                        </span>
                                                    </li>
                                                )}
                                                <li>
                                                    <span className={`id__status id__status--ready ${openingStatus.isOpen ? 'id__status--open' : 'id__status--closed'}`}>
                                                        <span className="status-dot"></span>
                                                        <span className="ui-kit__small">{openingStatus.text}</span>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <ul className="id__meta">
                                                <li data-type="url" itemProp="url" content={vendor.url}>
                                                    <a className="ui-kit__text" target="_blank" href={vendor.url} rel="external nofollow noopener">
                                                        <svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-world-16"></use></svg>
                                                        {cleanDomainName(vendor.url)}
                                                    </a>
                                                </li>
                                                {vendor.telephone && vendor.telephone.length > 0 && (
                                                    <li data-type="telephone">
                                                        <svg aria-hidden="true" className="icon icon--outline" width={14} height={14}><use href="/dist/images/icons/icons.svg#icon-phone-14"></use></svg>
                                                        <span className="ui-kit__text">
                                                            {vendor.telephone.map((tel, index) => ( <React.Fragment key={tel}>{index > 0 && ', '}<a href={`tel:${tel}`}>{tel}</a></React.Fragment> ))}
                                                        </span>
                                                    </li>
                                                )}
                                                 {vendor.address && vendor.address.length > 0 && (
                                                    <li data-type="address">
                                                        <a href={`#merchant-map`}>
                                                            <svg aria-hidden="true" className="icon icon--outline" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-pin-12"></use></svg>
                                                            <span className="ui-kit__text">{vendor.address[0]}</span>
                                                        </a>
                                                    </li>
                                                )}
                                                {additionalAddresses > 0 && (
                                                    <li data-type="storesCount">
                                                        <a href={`#merchant-map`}>
                                                            <small className="ui-kit__small ui-kit__muted">{t('additionalStores', { count: additionalAddresses })}</small>
                                                        </a>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    {vendorBrands.length > 0 && (
                                        <div className="masthead__id-section">
                                            <ul className="id__meta">
                                                <li data-type="brands">
                                                    <h4 className="ui-kit__secondary ui-kit__pb-4">{t('authorizedReseller', 'Authorized Reseller')}</h4>
                                                    <div>
                                                        {vendorBrands.map((brand) => (
                                                            <Link key={brand.id} to={`/b/${brand.id}/${brand.slug || brand.name.toLowerCase()}.html`} title={brand.name}>
                                                                <img width="56" height="56" alt={t('logoFor', { name: brand.name }) || `${brand.name} logo`} src={brand.logo} loading="lazy" />
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="root__wrapper root--merchant-main-wrapper">
                <div className="root root--merchant">
                    <div className="sections">
                        <section id="merchant-shipping-payment">
                            <section>
                                {vendor.url && (
                                    <>
                                     <h2 className="ui-kit__secondary">{t('previewWebsite', 'Preview Website')}</h2>
                                        <div className="merchant__screenshot">
                                            <a href={vendor.url} target="_blank" rel="noopener noreferrer nofollow external">
                                            <div className="ratio__wrapper">
                                                <div className="ratio">
                                                    <img className="ratio__content" itemProp="image" alt={t('screenshotFor', { name: vendor.name }) || `${vendor.name} Screenshot`} src={`//image.thum.io/get/width/600/crop/1200/viewport/1920/noanimate/${vendor.url}`} onError={(e) => { (e.target as HTMLImageElement).src = '/images/no-image.svg'; (e.target as HTMLImageElement).classList.add('no-image'); }} loading="lazy" />
                                                </div>
                                            </div>
                                            </a>
                                        </div>
                                    </>
                                )}
                            </section>
                            {vendor.paymentMethods && vendor.paymentMethods.length > 0 && (
                                 <PaymentMethodsComponent paymentMethods={vendor.paymentMethods} />
                            )}
                        </section>

                        {vendorDeals.length > 0 && (
                            <section className="section">
                                <header className="section__header">
                                    <hgroup className="section__hgroup">
                                        <h2 className="section__title"><Link to={`/search?store=${cleanDomainName(vendor.url).toLowerCase()}&deals=1`}>{t('dealsFromVendor', { vendorName: vendor.name })}</Link></h2>
                                    </hgroup>
                                </header>
                                <ScrollableSlider>
                                  <div className="p__products--scroll scroll__content">
                                      {vendorDeals.map(dealProduct => (
                                         <ProductCard key={`deal-${dealProduct.id}`} product={dealProduct} />
                                      ))}
                                  </div>
                                </ScrollableSlider>
                            </section>
                        )}

                        {vendorPopularCategories.length > 0 && (
                            <section className="section">
                                <header className="section__header">
                                    <hgroup className="section__hgroup">
                                        <h2 className="section__title">{t('popularCategoriesInVendor', { vendorName: vendor.name })}</h2>
                                    </hgroup>
                                </header>
                                <div className="categories">
                                    {vendorPopularCategories.map(cat => (
                                        <Link key={cat.id} title={t(cat.slug, cat.category)} className="categories__category" to={`/cat/${cat.id}/${cat.slug}?store=${cleanDomainName(vendor.url).toLowerCase()}`}>
                                            <img width="200" height="200" className="categories__image" src={cat.image || '/images/no-image.svg'} alt={t(cat.slug, cat.category)} loading="lazy"/>
                                            <h2 className="categories__title">{t(cat.slug, cat.category)}</h2>
                                            <div className="categories__cnt">{cat.count} {cat.count === 1 ? t('productCountSingular', 'product') : t('productCountPlural', { count: cat.count })}</div>
                                        </Link>
                                    ))}
                                </div>
                                <div id="popular-categories" className="popular-categories">
                                    <div className="expand popular-categories__view-wrapper">
                                        <Link className="button popular-categories__view-all" rel="nofollow" to={`/search?store=${cleanDomainName(vendor.url).toLowerCase()}`}>
                                            <span dangerouslySetInnerHTML={{ __html: t('viewAllVendorProducts', 'View all products<span class="hide-mobile"> of the store</span>') }} />
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        )}

                        <div id="merchant-reviews">
                            <section className="section">
                                <header className="section__header">
                                    <hgroup className="section__hgroup">
                                        <h2 className="section__title">{t('storeReviewsTitle', { vendorName: vendor.name })}</h2>
                                    </hgroup>
                                </header>
                                <div>
                                    {vendor.rating && vendor.numberOfRatings && (
                                        <div className="rating-summary">
                                            <div className="average-rating">{vendor.rating.toFixed(1)}</div>
                                            <div className="review-count">{t('reviewCount', { count: vendor.numberOfRatings })}</div>
                                             <span className="rating rating-all" data-total={vendor.rating.toFixed(1)} style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '5px' }}>
                                                 <svg aria-hidden="true" className="icon" style={{ clipPath: `inset(0 ${10 - (vendor.rating * 2)}em 0 0)`, width: '5em', height: '1em' }}>
                                                     <use href="/dist/images/icons/stars.svg#icon-stars-all"></use>
                                                 </svg>
                                             </span>
                                        </div>
                                    )}
                                    <Link data-review-src="reviews-overview" to={`/m/${vendor.id}/${vendor.slug || formatVendorSlug(vendor.name)}/review`} className="button">{t('rateIt', 'Rate It')}</Link>
                                    <div className="reviews-list" style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
                                        <p><i>{t('reviewsPlaceholder', '(Reviews display - Implementation needed)')}</i></p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {vendor.address && vendor.address.length > 0 && (
                            <section id="merchant-map" className="section">
                                <header className="section__header">
                                    <hgroup className="section__hgroup">
                                        <h2 className="section__title">{t('servicePointsTitle', { vendorName: vendor.name })}</h2>
                                        {vendor.address.length > 1 && <p className="section__subtitle">{t('servicePointsCount', { count: vendor.address.length })}</p>}
                                    </hgroup>
                                </header>
                                <div id="merchant-map-placeholder">
                                    <div className="geo__open-map leaflet-container leaflet-touch leaflet-retina leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom" tabIndex={0} style={{ position: 'relative', height: '300px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                        <span>{t('mapPlaceholderText', 'Map Placeholder - Requires Map Library')}</span>
                                    </div>
                                </div>
                                {vendor.address.length > 1 && (
                                <ScrollableSlider>
                                    <div className="merchant-map__pops grid scroll__content">
                                        {vendor.address.map((addr, index) => (
                                        <div className="merchant-map__pop-wrapper" key={`${vendor.id}-${index}`}>
                                            <div className="merchant-map__pop pressable" data-id={vendor.id}>
                                            <div className="merchant-map__pop-meta">
                                                <address itemProp="address" className="ui-kit__tertiary ui-kit__pb-2">{addr}</address>
                                                <small className="ui-kit__small ui-kit__muted">{t('storeAndPickup', 'Store / Pickup Point')}</small>
                                            </div>
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                </ScrollableSlider>
                                )}
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorPage;
