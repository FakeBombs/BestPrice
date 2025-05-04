import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import {
    vendors, Category, Product, Vendor, Brand, PaymentMethod,
    searchProducts, // Assuming this might be needed for related products/deals
    brands as allBrands,
    products as allMockProducts,
    mainCategories,
    categories,
    OpeningHours // Ensure this type is exported from mockData
} from '@/data/mockData';
import ScrollableSlider from '@/components/ScrollableSlider';
import PaymentMethodsComponent from '@/components/PaymentMethods';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';
import ProductCard from '@/components/ProductCard';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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

interface VendorPageProps { } // Keep interface, even if empty for now

const VendorPage: React.FC<VendorPageProps> = () => {
    // --- Hooks & Initial Setup ---
    const { vendorId, vendorName } = useParams<{ vendorId?: string, vendorName?: string }>();
    const { toast } = useToast(); // Assuming needed for potential actions
    const { user } = useAuth();   // Assuming needed for potential actions
    const { t } = useTranslation(); // Assuming needed

    // --- State Definitions ---
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null | undefined>(undefined); // undefined: initial, null: not found, Vendor: found
    const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
    const [vendorDeals, setVendorDeals] = useState<Product[]>([]);
    const [vendorPopularCategories, setVendorPopularCategories] = useState<AvailableCategory[]>([]);
    const [vendorBrands, setVendorBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);

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

    // --- Precompute Vendor Maps ---
    const vendorIdMap = useMemo(() => new Map(vendors.map(v => [v.id, v])), []);
    const vendorDomainMap = useMemo(() => { const map = new Map<string, Vendor>(); vendors.forEach(v => { const domain = cleanDomainName(v.url).toLowerCase(); if (domain) { map.set(domain, v); } }); return map; }, []);


    // --- Find Vendor Effect ---
    useEffect(() => {
        setLoading(true);
        let foundVendor: Vendor | undefined = undefined;

        if (vendorId) {
            const id = parseInt(vendorId, 10);
            if (!isNaN(id)) {
                 foundVendor = vendorIdMap.get(id);
            }
        } else if (vendorName) {
            const cleanedName = vendorName.toLowerCase();
            // Try finding by slug first if it exists, then name match, then domain part
            foundVendor = vendors.find(v =>
                v.slug === cleanedName || // Check slug first
                v.name.toLowerCase().replace(/\s+/g, '-') === cleanedName || // Check generated slug
                cleanDomainName(v.url).split('.')[0] === cleanedName // Check first part of domain
            );
        }

        setSelectedVendor(foundVendor || null); // Set found vendor or explicit null if not found
        setLoading(false);

    }, [vendorId, vendorName, vendorIdMap]); // Rerun when params or map change

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
            setVendorProducts([]);
            setVendorDeals([]);
            setVendorPopularCategories([]);
            setVendorBrands([]);
        }
    }, [selectedVendor]); // Rerun when the selected vendor changes

    // --- Helper Function for Opening Status ---
    const getOpeningStatus = (openingHours: OpeningHours[] | undefined): { text: string, isOpen: boolean } => {
        if (!openingHours || openingHours.length === 0) { return { text: "Πληροφορίες ωραρίου μη διαθέσιμες", isOpen: false }; }
        try {
            const now = new Date();
            const currentDayIndex = now.getDay(); // 0 = Sunday, 1 = Monday, ...
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const currentDayName = days[currentDayIndex] as OpeningHours['dayOfWeek'];
            const currentTime = now.getHours() * 100 + now.getMinutes();

            const todayHours = openingHours.find(h => h.dayOfWeek === currentDayName);

            if (!todayHours || !todayHours.opens || !todayHours.closes) { return { text: "Κλειστό σήμερα", isOpen: false }; }

            const opensTime = parseInt(todayHours.opens.replace(':', ''), 10);
            const closesTime = parseInt(todayHours.closes.replace(':', ''), 10);

            if (!isNaN(opensTime) && !isNaN(closesTime)) { // Check if parsing worked
                if (currentTime >= opensTime && currentTime < closesTime) { return { text: `Ανοιχτό μέχρι τις ${todayHours.closes}`, isOpen: true }; }
                else if (currentTime < opensTime) { return { text: `Κλειστό - Ανοίγει στις ${todayHours.opens}`, isOpen: false }; }
                else { return { text: "Κλειστό για σήμερα", isOpen: false }; }
            } else {
                 return { text: "Σφάλμα ωραρίου", isOpen: false }; // Indicate parsing error
            }
        } catch (error) {
            console.error("Error calculating opening status:", error);
            return { text: "Σφάλμα ωραρίου", isOpen: false };
        }
    };
    // --- End Helper Function ---

    // --- Calculate derived data *after* selectedVendor might be set ---
    // ** Calculate openingStatus HERE, depending on selectedVendor state **
    const openingStatus = useMemo(() => {
        // Pass selectedVendor directly to the helper
        return getOpeningStatus(selectedVendor?.openingHours);
    }, [selectedVendor]); // Depend on the state variable

    // ** Calculate additionalAddresses HERE **
    const additionalAddresses = useMemo(() => {
        if (!selectedVendor || !selectedVendor.address || selectedVendor.address.length <= 1) { return 0; }
        return selectedVendor.address.length - 1;
    }, [selectedVendor]);


    // --- Loading / Not Found ---
    if (loading) { return <div className="loading-placeholder">Φόρτωση καταστήματος...</div>; } // Added a loading indicator
    if (!selectedVendor) { return <NotFound />; } // Vendor truly not found
    // If we reach here, selectedVendor is guaranteed to be a Vendor object
    const vendor = selectedVendor;

    // --- Render ---
    return (
        <div id="root" className="clr"> {/* Restored outer div */}
            <section className="merchant-hero root_wrapper" style={{ background: 'var(--colors-themed-card-bg)', borderBottom: 0 }}>
                <div className="root">
                    <div className="merchant-trail">
                        <div id="trail">
                            <nav className="breadcrumb">
                                <ol>
                                    <li><Link to="/" rel="home"><span>BestPrice</span></Link><span className="trail__breadcrumb-separator">›</span></li>
                                    <li><Link to="/m"><span>Καταστήματα</span></Link><span className="trail__breadcrumb-separator">›</span></li>
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
                                                                let iconId = `icon-${platform.toLowerCase()}`;
                                                                let tooltip = platform.charAt(0).toUpperCase() + platform.slice(1);
                                                                // Add specific mappings if needed
                                                                if (platform === 'youtube') tooltip = 'YouTube';
                                                                if (platform === 'linkedin') tooltip = 'LinkedIn';

                                                                return ( <a key={platform} className="pressable new-icon" data-tooltip={tooltip} rel="external nofollow noopener" target="_blank" href={url}> <svg aria-hidden="true" className="icon icon--outline" width="16" height="16"> <use href={`/dist/images/icons/social.svg#${iconId}`}></use> </svg> </a> );
                                                            })}
                                                        </span>
                                                    </li>
                                                )}
                                                {/* Opening Status */}
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
                                                    <img className="ratio__content" itemProp="image" alt={`${vendor.name} Screenshot`} src={`//image.thum.io/get/width/600/crop/1200/viewport/1920/noanimate/${vendor.url}`} onError={(e) => { (e.target as HTMLImageElement).src = '/images/no-image.svg'; (e.target as HTMLImageElement).classList.add('no-image'); }} loading="lazy" />
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
                                        <Link key={cat.id} title={cat.name} className="categories__category" to={`/cat/${cat.id}/${cat.slug}?store=${cleanDomainName(vendor.url).toLowerCase()}`}>
                                            <img width="200" height="200" className="categories__image" src={cat.image || '/dist/images/cat/placeholder.webp'} alt={cat.name} loading="lazy"/>
                                            <h2 className="categories__title">{cat.name}</h2>
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
                                                 <svg aria-hidden="true" className="icon" style={{ clipPath: `inset(0 ${10 - (vendor.rating * 2)}em 0 0)`, width: '5em', height: '1em' }}>
                                                     <use href="/dist/images/icons/stars.svg#icon-stars-all"></use>
                                                 </svg>
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
        </div> // Closing the id="root" div
    );
};

export default VendorPage;
