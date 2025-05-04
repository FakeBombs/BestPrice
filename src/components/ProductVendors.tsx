import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import {
    vendors, Category, Product, Vendor, Brand, PaymentMethod,
    searchProducts, // Or a function like getProductsByVendor
    brands as allBrands,
    products as allMockProducts,
    mainCategories,
    categories,
    OpeningHours // Import OpeningHours
} from '@/data/mockData';
import ScrollableSlider from '@/components/ScrollableSlider';
import PaymentMethodsComponent from '@/components/PaymentMethods';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';
import ProductCard from '@/components/ProductCard';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import PriceAlertModal from '@/components/PriceAlertModal'; // Import if using price alert

const MAX_DISPLAY_COUNT = 10; // For "Show More" lists

// Helper to clean domain name
const cleanDomainName = (url: string): string => {
  if (!url) return '';
  try { const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`); return parsedUrl.hostname.replace(/^www\./i, ''); }
  catch (e) { return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]; }
};

// Define available category structure
interface AvailableCategory {
    id: number; category: string; slug: string; count: number; image: string | null; parentId: number | null;
}

interface VendorPageProps { }

const VendorPage: React.FC<VendorPageProps> = () => {
    // --- Hooks & Initial Setup ---
    const { vendorId, vendorName } = useParams<{ vendorId?: string, vendorName?: string }>();
    const { toast } = useToast(); // Assuming needed for potential actions
    const { user } = useAuth();   // Assuming needed for potential actions
    const { t } = useTranslation(); // Assuming needed

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
    useHtmlAttributes(classNamesForHtml, 'page-merchant');
    useBodyAttributes(classNamesForBody, '');
    // --- End Document Attributes ---

    // --- State Definitions ---
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null | undefined>(undefined);
    const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
    const [vendorDeals, setVendorDeals] = useState<Product[]>([]);
    const [vendorPopularCategories, setVendorPopularCategories] = useState<AvailableCategory[]>([]);
    const [vendorBrands, setVendorBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPopupVisible, setIsPopupVisible] = useState(false); // For vendor info popup
    const [popupContent, setPopupContent] = useState<Vendor | null>(null); // Store full Vendor object for popup

    // --- Precompute Vendor Maps ---
    const vendorIdMap = useMemo(() => new Map(vendors.map(v => [v.id, v])), []);
    const vendorDomainMap = useMemo(() => { const map = new Map<string, Vendor>(); vendors.forEach(v => { const domain = cleanDomainName(v.url).toLowerCase(); if (domain) { map.set(domain, v); } }); return map; }, []);


    // --- Find Vendor Effect ---
    useEffect(() => {
        setLoading(true);
        let foundVendor: Vendor | undefined = undefined;
        if (vendorId) { const id = parseInt(vendorId, 10); if (!isNaN(id)) { foundVendor = vendorIdMap.get(id); } }
        else if (vendorName) { const cleanedName = vendorName.toLowerCase(); foundVendor = vendors.find(v => v.slug === cleanedName || v.name.toLowerCase().replace(/\s+/g, '-') === cleanedName || cleanDomainName(v.url).split('.')[0] === cleanedName ); }
        setSelectedVendor(foundVendor || null);
        setLoading(false);
    }, [vendorId, vendorName, vendorIdMap]);

    // --- Fetch Vendor-Specific Data Effect ---
    useEffect(() => {
        if (selectedVendor) {
            const productsFromVendor = allMockProducts.filter(p => p.prices.some(price => price.vendorId === selectedVendor.id));
            setVendorProducts(productsFromVendor);
            const deals = productsFromVendor.filter(p => p.prices.some(pr => pr.vendorId === selectedVendor.id && pr.discountPrice && pr.discountPrice < pr.price)).slice(0, 10);
            setVendorDeals(deals);
            const categoryCounts: Record<number, number> = {};
            productsFromVendor.forEach(p => { (p.categoryIds || []).forEach(catId => { categoryCounts[catId] = (categoryCounts[catId] || 0) + 1; }); });
            const allCatsMap = new Map([...mainCategories, ...categories].map(c => [c.id, c]));
            const popularCats = Object.entries(categoryCounts).map(([idStr, count]) => { const id = parseInt(idStr, 10); const categoryData = allCatsMap.get(id); return categoryData ? { id: categoryData.id, category: categoryData.name, slug: categoryData.slug, count, image: categoryData.image, parentId: categoryData.parentId } : null; }).filter((cat): cat is AvailableCategory => cat !== null).sort((a, b) => b.count - a.count).slice(0, 6);
            setVendorPopularCategories(popularCats);
            const brandNames = new Set<string>();
            productsFromVendor.forEach(p => { if (p.brand) brandNames.add(p.brand); });
            setVendorBrands(allBrands.filter(b => brandNames.has(b.name)).slice(0, 10));
        } else {
            setVendorProducts([]); setVendorDeals([]); setVendorPopularCategories([]); setVendorBrands([]);
        }
    }, [selectedVendor]);

    // --- Helper Function to Determine Current Opening Status ---
    const getOpeningStatus = (openingHours: OpeningHours[] | undefined): { text: string, isOpen: boolean } => {
        if (!openingHours || openingHours.length === 0) { return { text: "Πληροφορίες ωραρίου μη διαθέσιμες", isOpen: false }; }
        try {
            const now = new Date();
            const currentDayIndex = now.getDay();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const currentDayName = days[currentDayIndex] as OpeningHours['dayOfWeek'];
            const currentTime = now.getHours() * 100 + now.getMinutes();
            const todayHours = openingHours.find(h => h.dayOfWeek === currentDayName);
            if (!todayHours || !todayHours.opens || !todayHours.closes) { return { text: "Κλειστό σήμερα", isOpen: false }; }
            const opensTime = parseInt(todayHours.opens.replace(':', ''), 10);
            const closesTime = parseInt(todayHours.closes.replace(':', ''), 10);
            if (!isNaN(opensTime) && !isNaN(closesTime)) { if (currentTime >= opensTime && currentTime < closesTime) { return { text: `Ανοιχτό μέχρι τις ${todayHours.closes}`, isOpen: true }; } else if (currentTime < opensTime) { return { text: `Κλειστό - Ανοίγει στις ${todayHours.opens}`, isOpen: false }; } else { return { text: "Κλειστό για σήμερα", isOpen: false }; } }
            else { return { text: "Σφάλμα ωραρίου", isOpen: false }; }
        } catch (error) { console.error("Error calculating opening status:", error); return { text: "Σφάλμα ωραρίου", isOpen: false }; }
    };

    // --- Calculate openingStatus ---
    const openingStatus = useMemo(() => getOpeningStatus(selectedVendor?.openingHours), [selectedVendor?.openingHours]);

    // --- Dynamic Calculation for Address Count ---
    const additionalAddresses = useMemo(() => { if (!selectedVendor || !selectedVendor.address || selectedVendor.address.length <= 1) { return 0; } return selectedVendor.address.length - 1; }, [selectedVendor]);

    // --- Popup Handlers ---
    const openPopup = (vendorData: Vendor) => { // Expect Vendor object
      setPopupContent(vendorData);
      setIsPopupVisible(true);
    };
    const closePopup = () => {
      setIsPopupVisible(false);
      setPopupContent(null); // Clear content on close
    };

    // --- Loading / Not Found ---
    if (loading) { return <div className="loading-placeholder">Φόρτωση καταστήματος...</div>; }
    if (!selectedVendor) { return <NotFound />; }
    const vendor = selectedVendor; // Vendor is guaranteed to exist here

    // --- Render ---
    return (
        <div id="root" className="clr">
            <section className="merchant-hero root_wrapper" style={{ background: vendor.brandColor || 'var(--colors-themed-card-bg)', borderBottom: 0 }}>
                <div className="root">
                    <div className="merchant-trail">
                        <div id="trail">
                            <nav className="breadcrumb">
                                <ol>
                                    <li><Link to="/" rel="home"><span>BestPrice</span></Link><span className="trail__breadcrumb-separator">›</span></li>
                                    <li><Link to="/m"><span>Καταστήματα</span></Link><span className="trail__breadcrumb-separator">›</span></li>
                                    <li><span className="trail__last">{vendor.name}</span></li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="merchant-logo">
                        <img src={vendor.logo} alt={`${vendor.name} logo`} title={vendor.name} loading="lazy" />
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
                    <span className="hide-tablet">Certified Store (<Link to="/certification">{vendor.certification}</Link>)</span>
                    <span className="hide-mobile">{vendor.name} is a certified store (<b data-certification={vendor.certification.toLowerCase()}>{vendor.certification}</b>)</span>
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
                                                    <a className="id__rating" href={`#merchant-reviews`} title={`${vendor.rating.toFixed(1)} αστέρια από ${vendor.numberOfRatings || '?'} αξιολογήσεις`}>
                                                        <span className="rating rating-all" data-total={vendor.rating.toFixed(1)}>
                                                            <svg aria-hidden="true" className="icon" style={{ clipPath: `inset(0 ${10 - (vendor.rating * 2)}em 0 0)`, width: '5em', height: '1em' }}><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                                                        </span>
                                                        {vendor.numberOfRatings && <span className="id__rating-count">({vendor.numberOfRatings})</span>}
                                                    </a>
                                                </div>
                                            )}
                                            {/* --- UPDATED Meta List --- */}
                                            <ul className="id__meta">
                                                {vendor.dateJoined && ( <li data-type="joined"><span className="ui-kit__text ui-kit__muted">Στο BestPrice από {new Date(vendor.dateJoined).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric'})}</span></li> )}
                                                {vendor.socialLinks && Object.keys(vendor.socialLinks).length > 0 && (
                                                    <li data-type="social" style={{ display: 'flex' }}>
                                                        <span className="social-links">
                                                            {Object.entries(vendor.socialLinks).map(([platform, url]) => {
                                                                let iconId = `icon-${platform.toLowerCase()}`; let tooltip = platform.charAt(0).toUpperCase() + platform.slice(1);
                                                                if (platform === 'youtube') tooltip = 'YouTube'; if (platform === 'linkedin') tooltip = 'LinkedIn'; // Add more if needed
                                                                return ( <a key={platform} className="pressable new-icon" data-tooltip={tooltip} rel="external nofollow noopener" target="_blank" href={url}> <svg aria-hidden="true" className="icon icon--outline" width="16" height="16"> <use href={`/dist/images/icons/social.svg#${iconId}`}></use> </svg> </a> );
                                                            })}
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
                                            {/* --- END UPDATED Meta List --- */}
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
                                                            <small className="ui-kit__small ui-kit__muted">{additionalAddresses} ακόμη {additionalAddresses === 1 ? 'κατάστημα' : 'καταστήματα'}</small>
                                                        </a>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    {/* Dynamic Brands Section */}
                                    {vendorBrands.length > 0 && (
                                        <div className="masthead__id-section">
                                            <ul className="id__meta">
                                                <li data-type="brands">
                                                    <h4 className="ui-kit__secondary ui-kit__pb-4">Authorized Reseller</h4>
                                                    <div>
                                                        {vendorBrands.map((brand) => (
                                                            <Link key={brand.id} to={`/b/${brand.id}/${brand.slug || brand.name.toLowerCase()}.html`} title={brand.name}>
                                                                <img width="56" height="56" alt={`${brand.name} logo`} src={brand.logo} loading="lazy" />
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
                        {/* Shipping Payment Section */}
                        <section id="merchant-shipping-payment">
                            <section>
                                {vendor.url && (
                                    <>
                                     <h2 className="ui-kit__secondary">Preview Website</h2>
                                        <div className="merchant__screenshot">
                                            <a href={vendor.url} target="_blank" rel="noopener noreferrer nofollow external">
                                            <div className="ratio__wrapper">
                                                <div className="ratio">
                                                    <img className="ratio__content" itemProp="image" alt={`${vendor.name} Screenshot`} width="600" height="550" src={`//image.thum.io/get/width/600/crop/800/noanimate/${vendor.url}`} onError={(e) => { (e.target as HTMLImageElement).src = '/images/no-image.svg'; (e.target as HTMLImageElement).classList.add('no-image'); }} loading="lazy" />
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

                        {/* Deals Section - Dynamic */}
                        {vendorDeals.length > 0 && (
                            <section className="section">
                                <header className="section__header">
                                    <hgroup className="section__hgroup">
                                        <h2 className="section__title"><Link to={`/search?store=${cleanDomainName(vendor.url).toLowerCase()}&deals=1`}>Προσφορές από {vendor.name}</Link></h2>
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

                        {/* Popular Categories Section - Dynamic */}
                        {vendorPopularCategories.length > 0 && (
                            <section className="section">
                                <header className="section__header">
                                    <hgroup className="section__hgroup">
                                        <h2 className="section__title">Δημοφιλείς Κατηγορίες από {vendor.name}</h2>
                                    </hgroup>
                                </header>
                                <div className="categories">
                                    {vendorPopularCategories.map(cat => (
                                        <Link key={cat.id} title={cat.category} className="categories__category" to={`/cat/${cat.id}/${cat.slug}?store=${cleanDomainName(vendor.url).toLowerCase()}`}>
                                            <img width="200" height="200" className="categories__image" src={cat.image || '/dist/images/cat/placeholder.webp'} alt={cat.category} loading="lazy"/>
                                            <h2 className="categories__title">{cat.category}</h2>
                                            <div className="categories__cnt">{cat.count} {cat.count === 1 ? 'προϊόν' : 'προϊόντα'}</div>
                                        </Link>
                                    ))}
                                </div>
                                <div id="popular-categories" className="popular-categories">
                                    <div className="expand popular-categories__view-wrapper">
                                        <Link className="button popular-categories__view-all" rel="nofollow" to={`/search?store=${cleanDomainName(vendor.url).toLowerCase()}`}>
                                            <span>Δες όλα τα προϊόντα<span className="hide-mobile"> του καταστήματος</span></span>
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Reviews Section */}
                        <div id="merchant-reviews">
                            <section className="section">
                                <header className="section__header">
                                    <hgroup className="section__hgroup">
                                        <h2 className="section__title">Αξιολογήσεις Καταστήματος {vendor.name}</h2>
                                    </hgroup>
                                </header>
                                <div>
                                    {vendor.rating && vendor.numberOfRatings && (
                                        <div className="rating-summary">
                                            <div className="average-rating">{vendor.rating.toFixed(1)}</div>
                                            <div className="review-count">{vendor.numberOfRatings} αξιολογήσεις</div>
                                             <span className="rating rating-all" data-total={vendor.rating.toFixed(1)} style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '5px' }}>
                                                 <svg aria-hidden="true" className="icon" style={{ clipPath: `inset(0 ${10 - (vendor.rating * 2)}em 0 0)`, width: '5em', height: '1em' }}><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                                             </span>
                                        </div>
                                    )}
                                    <Link data-review-src="reviews-overview" to={`/m/${vendor.id}/${vendor.slug || vendor.name?.toLowerCase()}/review`} className="button">Αξιολόγησε το</Link>
                                    <div className="reviews-list" style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
                                        <p><i>(Προβολή αξιολογήσεων - Χρειάζεται Υλοποίηση)</i></p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Map Section */}
                        {vendor.address && vendor.address.length > 0 && (
                            <section id="merchant-map" className="section">
                                <header className="section__header">
                                    <hgroup className="section__hgroup">
                                        <h2 className="section__title">Σημεία Εξυπηρέτησης {vendor.name}</h2>
                                        {vendor.address.length > 1 && <p className="section__subtitle">{vendor.address.length} σημεία</p>}
                                    </hgroup>
                                </header>
                                <div id="merchant-map-placeholder">
                                    <div className="geo__open-map leaflet-container leaflet-touch leaflet-retina leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom" tabIndex={0} style={{ position: 'relative', height: '300px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                        <span>Map Placeholder - Requires Map Library</span>
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
                                                <small className="ui-kit__small ui-kit__muted">Κατάστημα / Παραλαβή</small>
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
             {/* Vendor Info Popup (Modal) - Logic moved outside main return for clarity */}
             {isPopupVisible && popupContent && (
                <div className="popup-placeholder minfo__popup--placeholder popup-placeholder--modal" style={{ /* Adjust styling as needed */ position: 'fixed', inset: 0 }}>
                <div className="popup-flex-center popup-flex-center--top" style={{ zIndex: 2147483571 }}>
                    <div className="popup-backdrop open is-modal minfo__popup-backdrop" style={{ zIndex: 2147483571, transitionDuration: '150ms' }} onClick={closePopup}></div>
                    <div className="minfo__popup popup open has-close has-close--inside is-modal" style={{ transitionDuration: '150ms', zIndex: 2147483571 }}>
                    <div className="popup-body">
                        <div role="button" className="close-button__wrapper pressable popup-close" onClick={closePopup}>
                        <div className="close-button"><svg className="icon" aria-hidden="true" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></div>
                        </div>
                        <div className="minfo minfo--info">
                        <aside className="minfo__aside">
                            {/* Use actual vendor logo or a placeholder */}
                            <div className="minfo__screen" style={{ backgroundImage: `url('${popupContent.logo || '/images/placeholder.png'}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}></div>
                        </aside>
                        <main className="minfo__main">
                            <header className="minfo__header">
                            <h2 className="minfo__title">{popupContent.name}</h2>
                            <div className="minfo__header-props" data-id={popupContent.id}>
                                {popupContent.rating && (
                                <div className="simple-rating simple-rating--with-link pressable">
                                    <Link className="simple-rating__inner" to={`/m/${popupContent.id}/${popupContent.slug || popupContent.name.toLowerCase().replace(/\s+/g, '-')}#merchant-reviews`}>
                                    <div className="simple-rating__stars">
                                        <svg height="16" width="80" className="icon" aria-hidden="true"><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                                        <div className="simple-rating__rated" style={{ width: `${(popupContent.rating / 5) * 100}%` }}>
                                        <svg height="16" width="80" className="icon" aria-hidden="true"><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                                        </div>
                                    </div>
                                    <div className="simple-rating__avg">{popupContent.rating.toFixed(1)}</div>
                                    </Link>
                                    {/* <Link to={`/m/${popupContent.id}/${popupContent.slug || popupContent.name.toLowerCase()}/review?src=minfo`} className="simple-rating__new">Αξιολόγησέ το</Link> */}
                                </div>
                                )}
                                {popupContent.certification && (
                                    <div className="minfo__badge-container">
                                    <div className="tooltip__anchor minfo__certification">
                                        <svg aria-hidden="true" className="icon" width="22" height="22"><use href={`/dist/images/icons/certification.svg#icon-${popupContent.certification.toLowerCase()}-22`}></use></svg>
                                        <div data-certification={popupContent.certification.toLowerCase()} className="minfo__certification-wrapper pressable">Πιστοποίηση: {popupContent.certification}</div>
                                    </div>
                                    </div>
                                )}
                            </div>
                            </header>
                            <div className="minfo__tabs">
                                <div className="minfo__tab minfo__tab--info minfo__tab--selected">Πληροφορίες</div>
                                {/* Add logic to switch tabs if needed */}
                                {/* <div className="minfo__tab minfo__tab--pops">Χάρτης ({popupContent.address?.length || 0})</div> */}
                            </div>
                            <div className="minfo__view minfo__view--info" style={{ /* Adjust height? */ }}>
                                <div className="minfo__buttons">
                                    {popupContent.address && popupContent.address.length > 0 ? (
                                        <div className="minfo__button pressable">
                                            <svg width="18" height="18" className="icon minfo__button-icon" aria-hidden="true"><use href="/dist/images/icons/icons.svg#icon-pin-14"></use></svg>
                                            <div className="minfo__button-label">{popupContent.address[0]}</div>
                                        </div>
                                    ) : (
                                        <div className="minfo__button minfo__button--disabled">
                                            <svg width="18" height="18" className="icon minfo__button-icon" aria-hidden="true"><use href="/dist/images/icons/icons.svg#icon-world-16"></use></svg>
                                            <div className="minfo__button-label">Μόνο Ηλεκτρονικό κατάστημα</div>
                                        </div>
                                    )}
                                     {/* Display calculated opening status */}
                                    <div className={`minfo__button-info minfo__sign ${getOpeningStatus(popupContent.openingHours).isOpen ? 'minfo__sign--open' : 'minfo__sign--closed'}`}>{getOpeningStatus(popupContent.openingHours).text}</div>
                                </div>

                                {/* Dynamically render payment methods list */}
                                <div className="minfo__lists">
                                    {popupContent.paymentMethods && popupContent.paymentMethods.length > 0 && (
                                        <div className="minfo__list">
                                            <h3 className="minfo__list-header"><Link to={`/m/${popupContent.id}/${popupContent.slug || popupContent.name.toLowerCase()}/#merchant-shipping-payment`}>ΤΡΟΠΟΙ ΠΛΗΡΩΜΗΣ</Link></h3>
                                            <ul>
                                                {Object.values(PaymentMethod).map(method => (
                                                    <li key={method} className={popupContent.paymentMethods?.includes(method) ? 'minfo__yes' : ''}>
                                                        {method}
                                                        {popupContent.paymentMethods?.includes(method) ? (
                                                            <svg className="icon" aria-hidden="true" width="16" height="16"><use href="/dist/images/icons/icons.svg#icon-check-full-16"></use></svg>
                                                        ) : (
                                                            <svg className="icon" aria-hidden="true" width="16" height="16"><use href="/dist/images/icons/icons.svg#icon-check-empty-16"></use></svg>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {/* Add other lists dynamically if data exists */}
                                </div>
                                <div className="minfo__actions">
                                    <Link to={`/m/${popupContent.id}/${popupContent.slug || popupContent.name.toLowerCase()}`} className="button button--outline">Μάθε περισσότερα</Link>
                                    {/* The "Buy Product" link needs context about *which* product triggered this popup, which isn't passed here. Keep it simple for now */}
                                    {/* <a href={...} rel="nofollow noreferrer noopener" className="button minfo__product-link">Αγόρασε το προϊόν</a> */}
                                </div>
                            </div>
                             {/* Add map view if needed */}
                             {/* <div hidden className="minfo__view minfo__view--pops"> ... </div> */}
                        </main>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            )}
        </div> // End of id="root"
    );
};

// --- Vendor Price Card Component (Needs reference to VendorPage's openPopup) ---
interface VendorPriceCardProps {
  priceInfo: ProductPrice;
  product: Product;
  openPopup: (vendor: Vendor) => void; // Expects Vendor object
}

const VendorPriceCard = ({ priceInfo, product, openPopup }: VendorPriceCardProps) => {
  const vendor = useMemo(() => vendors.find(v => v.id === priceInfo.vendorId), [priceInfo.vendorId]); // Find vendor once
  const vendorAddress = Array.isArray(vendor?.address) && vendor.address.length > 0 ? vendor.address[0] : '';

  if (!vendor) return null; // Don't render if vendor not found

  const displayPrice = priceInfo.discountPrice ?? priceInfo.price;
  const hasDiscount = priceInfo.discountPrice && priceInfo.discountPrice < priceInfo.price;
  const priceDropPercentage = hasDiscount ? Math.round(((priceInfo.price - priceInfo.discountPrice!) / priceInfo.price) * 100) : 0;
  const dropClass = priceDropPercentage >= 40 ? 'drop--40' : priceDropPercentage >= 30 ? 'drop--30' : priceDropPercentage >= 10 ? 'drop--10' : '';


  return (
    <Card className={`prices__card ${!priceInfo.inStock ? 'is-unavailable' : ''}`}> {/* Add class for styling */}
      <CardContent className="p-0"> {/* Adjust padding if needed */}
        <div className="prices__group" data-id={vendor.id} data-price={Math.round(displayPrice * 100)} data-mid={vendor.id} data-domain={vendor.url} data-mrating={vendor.rating?.toFixed(4) || '0'}>
          <div className="prices__root">
            <div className="prices__merchant">
              <div className="prices__merchant-meta">
                <a aria-label={vendor.name} className="prices__merchant-logo" rel="nofollow" href={priceInfo.productUrl || vendor.url} target="_blank"> {/* Use productUrl if available */}
                  <img width="90" height="30" loading="lazy" src={vendor.logo} alt={vendor.name} title={vendor.name} />
                </a>
                <Link
                    data-tooltip={`Πληροφορίες για το ${vendor.name}`}
                    className="prices__merchant-link popup-anchor"
                    data-mid={vendor.id}
                    to={`/m/${vendor.id}/${vendor.slug || vendor.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={(e) => { e.preventDefault(); openPopup(vendor); }} // Pass vendor object
                >
                  <svg aria-hidden="true" className="icon" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-info-12"></use></svg>
                  <em>{vendor.name}</em>
                </Link>
                <div className="prices__merchant-props">
                  {vendor.rating && (
                    <Link className="merchant__rating" aria-label="Αξιολογήσεις καταστήματος" to={`/m/${vendor.id}/${vendor.slug || vendor.name.toLowerCase().replace(/\s+/g, '-')}/reviews`}>
                      <span className="rating rating-all" data-total={vendor.rating.toFixed(1)}>
                          <svg aria-hidden="true" className="icon" style={{ clipPath: `inset(0 ${10 - (vendor.rating * 2)}em 0 0)`, width: '5em', height: '1em' }}><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                      </span>
                    </Link>
                  )}
                  {vendor.certification && (
                     <span className="merchant__certification-inline" data-tooltip={vendor.certification}>
                       <svg aria-hidden="true" className="icon"><use href={`/dist/images/icons/certification.svg#icon-${vendor.certification.toLowerCase()}-22`}></use></svg>
                     </span>
                  )}
                </div>
              </div>
            </div>

          <div className="prices__products">
            <div className="prices__product" data-in-stock={priceInfo.inStock ? '' : undefined}> {/* Use data-in-stock */}
              <div className="prices__main">
                <div className="prices__title">
                  {/* Link to vendor's product page */}
                  <a data-price={Math.round(displayPrice * 100)} title={product.title} rel="nofollow noopener" target="_blank" href={priceInfo.productUrl || vendor.url}>
                    {/* Don't repeat title if it's obvious from context */}
                    {/* <h3>{product.title}</h3> */}
                  </a>
                </div>
                <div className="prices__props">
                  <span data-status={priceInfo.inStock ? "IN_STOCK" : "OUT_OF_STOCK"} className={`av ${priceInfo.inStock ? 'av--instock' : 'av--unavailable'}`}>
                    <small>
                      {priceInfo.inStock ? <span>Άμεσα διαθέσιμο</span> : <span>Εξαντλημένο</span>}
                    </small>
                  </span>
                </div>
                {/* Variation button logic needs data from product.variants if implemented */}
                {/* <div role="button" aria-label="All variations from store" data-id="45" className="prices__group-variations-button prices__group-variations-button--inside">...</div> */}
                {/* Product report trigger can be added if needed */}
              </div>

              <div className="prices__price">
                <div className="prices__price-wrapper">
                  <a title={product.title} rel="nofollow" href={priceInfo.productUrl || vendor.url} target="_blank">
                     {displayPrice.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}
                  </a>
                 {hasDiscount && (
                      <del className="p__price--before prices__price--before">
                          {priceInfo.price.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}
                      </del>
                  )}
                  {priceDrop > 0 && (
                      <div className="pi__drop prices__price--drop">
                          <strong className={dropClass}>-{priceDropPercentage}%</strong>
                      </div>
                  )}
                </div>
                <div className="prices__costs">
                  <div className="prices__cost-label">Μεταφορικά</div>
                  <div className="prices__cost-value">{priceInfo.shippingCost ? `+ ${priceInfo.shippingCost.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}` : 'Δωρεάν'}</div>
                  {/* Total Price Calculation */}
                  <div className="prices__cost-total">Τελική τιμή: <strong>{(displayPrice + (priceInfo.shippingCost || 0)).toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</strong></div>
                </div>
              </div>

              <div className="prices__buttons">
                <div className="prices__button">
                  <a title={product.title} rel="nofollow noreferrer noopener" target="_blank" href={priceInfo.productUrl || vendor.url} className={`button ${!priceInfo.inStock ? 'button--disabled' : ''}`} disabled={!priceInfo.inStock}>
                    <span>Δες το στο κατάστημα</span><svg aria-hidden="true" className="icon" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-right-12"></use></svg>
                  </a>
                </div>
              </div>

              {/* Removed redundant rating display here */}
              </div>
            </div>
          </div>

          {/* Footer section - Dynamic based on vendor payment methods etc. */}
          {(vendor.paymentMethods || vendor.certification) && ( // Show footer if there's something to display
          <div className="prices__footer">
            <div className="prices__footer-items">
              {/* Loyalty points - placeholder */}
              {/* <div data-tooltip="Με την αγορά κερδίζεις..." className="prices__footer-item prices__footer-item--loyalty ...">...</div> */}
              {/* Certification link */}
              {vendor.certification && (
              <Link data-tooltip="Απόκτησε δωρεάν Ασφάλιση Αγοράς" to="/programma-asfaleias-agoron" className="prices__footer-item prices__footer-item--certification popup-anchor">
                <svg aria-hidden="true" className="icon" width="17" height="17"><use href={`/dist/images/icons/certification.svg#icon-${vendor.certification.toLowerCase()}-22`}></use></svg>
                <span>Ασφάλιση Αγοράς</span>
              </Link>
              )}
              {/* Vendor address link in footer */}
              {vendorAddress && (
                   <Link className="prices__footer-item" data-mid={vendor.id} to={`/m/${vendor.id}/${vendor.slug || vendor.name.toLowerCase().replace(/\s+/g, '-')}#merchant-map`} onClick={(e) => { e.preventDefault(); openPopup(vendor); }}><div className="dotted-link">{vendorAddress}</div></Link>
              )}
              {/* Authorized Reseller - Needs data */}
              {/* <div className="prices__footer-item prices__footer-item--authorized">...</div> */}
              {/* Payment Method Icons - Example for Klarna */}
              {vendor.paymentMethods?.includes("Klarna" as any) && ( // Cast to any if "Klarna" isn't in enum
                   <div className="prices__footer-item popup-anchor" data-tooltip-left="" data-tooltip-no-border="" data-tooltip="Δυνατότητα πληρωμής με άτοκες δόσεις μέσω της Klarna"><div className="prices__klarna-logo"><img src="/images/logos/Klarna/logo.svg" alt="Klarna logo" width="40" height="20"/></div></div>
              )}
               {/* BOX NOW Icon */}
              {vendor.paymentMethods?.includes(PaymentMethod.PickupVia) && ( // Check for PickupVia specifically
                  <div className="prices__footer-item" data-tooltip-left="" data-tooltip-no-border="" data-tooltip="Δυνατότητα παραλαβής δέματος μέσω των αυτόματων μηχανημάτων (lockers) της BOX NOW">
                    <div className="prices__boxnow-logo"> <img src="/dist/images/icons/partners.svg#icon-boxnow" alt="BOX NOW logo" width="27" height="20"/> </div>
                  </div>
              )}
              {/* Epistrofi Icon - Placeholder */}
              {/* <a className="prices__footer-item" ...><div className="prices__epistrofi-logo">...</div></a> */}
            </div>
          </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
