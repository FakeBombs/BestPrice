import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import {
    vendors, Category, Product, Vendor, Brand, PaymentMethod,
    searchProducts, // Assuming this can filter by vendor later, or replace with getProductsByVendor
    brands as allBrands,
    products as allMockProducts,
    mainCategories,
    categories
} from '@/data/mockData'; // Adjust path if needed
import ScrollableSlider from '@/components/ScrollableSlider';
import PaymentMethodsComponent from '@/components/PaymentMethods';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';
import ProductCard from '@/components/ProductCard'; // Assuming you want ProductCard in sliders
import { useTranslation } from '@/hooks/useTranslation'; // Assuming used elsewhere or planned
import { useToast } from '@/hooks/use-toast'; // Assuming used elsewhere or planned
import { useAuth } from '@/hooks/useAuth'; // Assuming used elsewhere or planned

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
    const userAgent = navigator.userAgent.toLowerCase();
    const [jsEnabled, setJsEnabled] = useState(false);
    let classNamesForBody = '';
    let classNamesForHtml = 'page';

    // Check for ad blockers
    const checkAdBlockers = (): boolean => { try { const testAd = document.createElement('div'); testAd.innerHTML = ' '; testAd.className = 'adsbox'; testAd.style.position = 'absolute'; testAd.style.left = '-9999px'; testAd.style.height = '1px'; document.body.appendChild(testAd); const isBlocked = !testAd.offsetHeight; document.body.removeChild(testAd); return isBlocked; } catch (e) { return false; } };
    const isAdBlocked = useMemo(checkAdBlockers, []);

    // Determine device type
    if (userAgent.includes('windows')) { classNamesForHtml += ' windows no-touch'; }
    else if (userAgent.includes('android')) { classNamesForHtml += ' android touch'; classNamesForBody = 'mobile'; }
    else if (userAgent.includes('iphone') || userAgent.includes('ipad')) { classNamesForHtml += ' ios touch'; classNamesForBody = userAgent.includes('ipad') ? 'tablet' : 'mobile'; }
    else if (userAgent.includes('mac os x')) { classNamesForHtml += ' macos no-touch'; }
    else { classNamesForHtml += ' unknown-device'; }
    classNamesForHtml += isAdBlocked ? ' adblocked' : ' adallowed';
    classNamesForHtml += ' supports-webp supports-ratio supports-flex-gap supports-lazy supports-assistant is-desktop is-modern flex-in-button is-prompting-to-add-to-home';
    useEffect(() => { setJsEnabled(true); }, []);
    classNamesForHtml += jsEnabled ? ' js-enabled' : ' js-disabled';
    useHtmlAttributes(classNamesForHtml, 'page-merchant'); // Use page-merchant ID
    useBodyAttributes(classNamesForBody, '');
    // --- End Document Attributes ---

    const { vendorId, vendorName } = useParams<{ vendorId?: string, vendorName?: string }>();
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null | undefined>(undefined); // undefined means not checked yet
    const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
    const [vendorDeals, setVendorDeals] = useState<Product[]>([]);
    const [vendorPopularCategories, setVendorPopularCategories] = useState<AvailableCategory[]>([]); // Use AvailableCategory type
    const [vendorBrands, setVendorBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);

    // --- Precompute Vendor Maps --- (Ensure these are defined before use)
    const vendorIdMap = useMemo(() => new Map(vendors.map(v => [v.id, v])), []);
    const vendorDomainMap = useMemo(() => { const map = new Map<string, Vendor>(); vendors.forEach(v => { const domain = cleanDomainName(v.url).toLowerCase(); if (domain) { map.set(domain, v); } }); return map; }, []);


    // --- Find Vendor Effect ---
    useEffect(() => {
        setLoading(true);
        let foundVendor: Vendor | undefined = undefined;

        if (vendorId) {
            foundVendor = vendorIdMap.get(parseInt(vendorId, 10)); // Use map and parse ID
        } else if (vendorName) {
            // Find by cleaned slug-like name
            foundVendor = vendors.find(v =>
                v.name.toLowerCase().replace(/\s+/g, '-') === vendorName ||
                cleanDomainName(v.url).split('.')[0] === vendorName // Check first part of domain
            );
        }

        setSelectedVendor(foundVendor); // Set found vendor or undefined
        setLoading(false);

    }, [vendorId, vendorName, vendorIdMap]); // Add map dependency

    // --- Fetch Vendor-Specific Data Effect ---
    useEffect(() => {
        if (selectedVendor) {
            // 1. Get all products offered by this vendor
            const productsFromVendor = allMockProducts.filter(p =>
                p.prices.some(price => price.vendorId === selectedVendor.id)
            );
            setVendorProducts(productsFromVendor);

            // 2. Find Deals from this vendor's products
            const deals = productsFromVendor
                .filter(p => p.prices.some(pr => pr.vendorId === selectedVendor.id && pr.discountPrice && pr.discountPrice < pr.price))
                .slice(0, 10);
            setVendorDeals(deals);

            // 3. Find Popular Categories for this vendor
            const categoryCounts: Record<number, number> = {};
            productsFromVendor.forEach(p => { (p.categoryIds || []).forEach(catId => { categoryCounts[catId] = (categoryCounts[catId] || 0) + 1; }); });
            const allCatsMap = new Map([...mainCategories, ...categories].map(c => [c.id, c]));
            const popularCats = Object.entries(categoryCounts)
              .map(([idStr, count]) => { const id = parseInt(idStr, 10); const categoryData = allCatsMap.get(id); return categoryData ? { id: categoryData.id, category: categoryData.name, slug: categoryData.slug, count, image: categoryData.image, parentId: categoryData.parentId } : null; })
              .filter((cat): cat is AvailableCategory => cat !== null)
              .sort((a, b) => b.count - a.count)
              .slice(0, 6);
            setVendorPopularCategories(popularCats);

            // 4. Find Brands sold by this vendor
            const brandNames = new Set<string>();
            productsFromVendor.forEach(p => { if (p.brand) brandNames.add(p.brand); });
            setVendorBrands(allBrands.filter(b => brandNames.has(b.name)).slice(0, 10));

        } else {
            setVendorProducts([]);
            setVendorDeals([]);
            setVendorPopularCategories([]);
            setVendorBrands([]);
        }
    }, [selectedVendor]); // Re-run when the selected vendor changes

    // --- Loading / Not Found ---
    if (loading) { return <div>Loading Vendor...</div>; } // Or spinner
    if (!selectedVendor) { return <NotFound />; } // Vendor truly not found
    const vendor = selectedVendor; // Safe to use vendor from here

    // --- Dynamic Calculation for Address Count ---
    const additionalAddresses = (vendor.address?.length || 0) > 1 ? (vendor.address.length - 1) : 0;

    // --- Render ---
    return (
        <div id="root" className="clr">
            <section className="merchant-hero root_wrapper" style={{ background: 'var(--colors-themed-card-bg)', borderBottom: 0 }}>
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
                                                            <svg aria-hidden="true" className="icon" style={{ clipPath: `inset(0 ${10 - (vendor.rating * 2)}em 0 0)` }} width="100%" height="100%">
                                                                <use href="/dist/images/icons/stars.svg#icon-stars-all"></use>
                                                            </svg>
                                                        </span>
                                                        {vendor.numberOfRatings && <span className="id__rating-count">({vendor.numberOfRatings})</span>}
                                                    </a>
                                                    {/* Optional rate link */}
                                                    {/* <a data-review-src="merchant-page-header" href={`/m/${vendor.id}/${vendor.name?.toLowerCase()}/review`} className="id__rating-link">Rate it</a> */}
                                                </div>
                                            )}
                                            <ul className="id__meta">
                                                {/* Add date joined, social links, opening status if available */}
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
                                                    <h4 className="ui-kit__secondary ui-kit__pb-4">Authorized Reseller</h4> {/* Adjust title if needed */}
                                                    <div>
                                                        {vendorBrands.map((brand) => (
                                                            <Link key={brand.id} to={`/b/${brand.id}/${brand.slug || brand.name.toLowerCase()}.html`} title={brand.name}>
                                                                <img width="56" height="56" alt={`${brand.name} logo`} src={brand.logo} loading="lazy" />
                                                            </Link>
                                                        ))}
                                                        {/* Add "more" logic if vendorBrands exceeds limit */}
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
                                    {/* Consider where this link should go */}
                                    <Link data-review-src="reviews-overview" to={`/m/${vendor.id}/${vendor.name?.toLowerCase()}/review`} className="button">Αξιολόγησε το</Link>
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
                                        <span>Map Placeholder - Requires Map Library (e.g., Leaflet, Google Maps)</span>
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
        </div>
    );
};

export default VendorPage;
