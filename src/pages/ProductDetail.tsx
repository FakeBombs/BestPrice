import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getProductById, getSimilarProducts, getProductsByCategory, getBestPrice, Product, Vendor, vendors, PaymentMethod, OpeningHours, Brand, categories, mainCategories, ProductPrice } from '@/data/mockData';
import ProductBreadcrumb from '@/components/product/ProductBreadcrumb';
import ProductHeader from '@/components/product/ProductHeader';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductEssentialInfo from '@/components/product/ProductEssentialInfo';
import ProductHighlights from '@/components/product/ProductHighlights';
import ProductTabsSection from '@/components/product/ProductTabsSection';
import { VendorPriceCard } from '@/components/ProductVendors';
import ProductRelatedSections from '@/components/product/ProductRelatedSections';
import PriceAlertModal from '@/components/PriceAlertModal';
import { useAuth } from '@/hooks/useAuth';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';
import { useTranslation } from '@/hooks/useTranslation';
import { TopVendorAd } from '@/components/ads/TopVendorAd';
import NotFound from '@/pages/NotFound';

// Helper to clean domain name
const cleanDomainName = (url: string): string => {
  if (!url) return '';
  try { const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`); return parsedUrl.hostname.replace(/^www\./i, ''); }
  catch (e) { return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]; }
};

// Helper Function to Determine Current Opening Status
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

const ProductDetail = () => {
  // --- Hooks & Initial Setup ---
  const { productId, productSlug } = useParams<{ productId: string; productSlug?: string }>();
  const numericProductId = Number(productId);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation(); // Added location for potential use

  // --- Document Attributes Logic ---
  const userAgent = navigator.userAgent.toLowerCase();
  const [jsEnabled, setJsEnabled] = useState(false);
  let classNamesForBody = '';
  let classNamesForHtml = 'page';
  const checkAdBlockers = (): boolean => { try { const testAd = document.createElement('div'); testAd.innerHTML = ' '; testAd.className = 'adsbox'; testAd.style.position = 'absolute'; testAd.style.left = '-9999px'; testAd.style.height = '1px'; document.body.appendChild(testAd); const isBlocked = !testAd.offsetHeight; document.body.removeChild(testAd); return isBlocked; } catch (e) { return false; } };
  const isAdBlocked = useMemo(checkAdBlockers, []);
  if (userAgent.includes('windows')) { classNamesForHtml += ' windows no-touch'; } else if (userAgent.includes('android')) { classNamesForHtml += ' android touch'; classNamesForBody = 'mobile'; } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) { classNamesForHtml += ' ios touch'; classNamesForBody = userAgent.includes('ipad') ? 'tablet' : 'mobile'; } else if (userAgent.includes('mac os x')) { classNamesForHtml += ' macos no-touch'; } else { classNamesForHtml += ' unknown-device'; }
  classNamesForHtml += isAdBlocked ? ' adblocked' : ' adallowed'; classNamesForHtml += ' supports-webp supports-ratio supports-flex-gap supports-lazy supports-assistant is-desktop is-modern flex-in-button is-prompting-to-add-to-home';
  useEffect(() => { setJsEnabled(true); }, []); classNamesForHtml += jsEnabled ? ' js-enabled' : ' js-disabled';
  useHtmlAttributes(classNamesForHtml, 'page-item'); useBodyAttributes(classNamesForBody, '');
  // --- End Document Attributes ---

  // --- State Definitions ---
  const [product, setProduct] = useState<Product | null | undefined>(undefined); // undefined: initial, null: not found
  const [currentImage, setCurrentImage] = useState<string>('');
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [categoryDeals, setCategoryDeals] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [isVendorPopupVisible, setIsVendorPopupVisible] = useState(false);
  // ** State holds both Vendor and ProductPrice for the popup **
  const [popupContent, setPopupContent] = useState<{ vendor: Vendor; priceInfo: ProductPrice; } | null>(null);

  // --- Slug Formatting ---
   const formatProductSlug = (title: string): string => title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  // --- Data Fetching & Slug Handling ---
  useEffect(() => {
    setLoading(true);
    let productData: Product | undefined = undefined;
    const numericId = parseInt(productId || '', 10); // Ensure productId is parsed safely

    if (!isNaN(numericId)) {
      productData = getProductById(numericId);
    }

    if (productData) {
      setProduct(productData);
      setCurrentImage(productData.image);
      setSimilarProducts(getSimilarProducts(numericId));
      setCategoryDeals(getProductsByCategory(productData.categoryIds[0]).filter(p => p.id !== numericId).slice(0, 5));

      // Recently Viewed Logic
      try {
        const recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]') as number[];
        const validIds = recentlyViewedIds.filter(id => typeof id === 'number');
        const recentProducts = validIds.map(id => getProductById(id)).filter((p): p is Product => p !== undefined && p.id !== numericId);
        setRecentlyViewed(recentProducts);
        if (!validIds.includes(numericId)) {
          const updatedRecentlyViewed = [numericId, ...validIds].slice(0, 10);
          localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
        }
      } catch (error) { console.error("Error handling recently viewed:", error); localStorage.removeItem('recentlyViewed'); }

      // Check and redirect if slug is incorrect or missing AFTER data is set
      const correctSlug = productData.slug || formatProductSlug(productData.title);
      if (!productSlug || productSlug !== correctSlug) {
         navigate(`/item/${numericId}/${correctSlug}${location.search}`, { replace: true }); // Preserve query string
      }
      setLoading(false); // End loading after success
    } else {
      setProduct(null); // Not found
      setLoading(false); // End loading on failure
    }
  }, [productId, navigate, location.search]); // Depend on productId and search (in case of reload)

  // --- Calculations after product is loaded ---
  const bestPriceInfo = useMemo(() => getBestPrice(product!), [product]); // Use ! assertion as we check product below

  // --- Opening Status Calculation (Moved here) ---
  const openingStatus = useMemo(() => getOpeningStatus(popupContent?.vendor?.openingHours), [popupContent?.vendor?.openingHours]);

  // --- Event Handlers ---
  const handleImageChange = (image: string) => { setCurrentImage(image); };
  const handleAddToFavorites = () => { if (!user) { toast({ title: "Login Required", description: "Please log in to add this product to your favorites", variant: "destructive" }); return; } toast({ title: "Added to Favorites", description: `${product?.title} has been added to your favorites` }); };
  const handleShareProduct = () => { navigator.clipboard.writeText(window.location.href).then(() => toast({ title: "Link Copied", description: "Product link copied to clipboard" })).catch(err => toast({ title: "Copy Failed", description: "Could not copy link", variant: "destructive" })); };
  const handlePriceAlert = () => { if (!user) { toast({ title: "Login Required", description: "Please log in to set a price alert", variant: "destructive" }); return; } setIsPriceAlertModalOpen(true); };

  // Popup Handlers
  const handleOpenVendorPopup = (vendorData: Vendor, priceData: ProductPrice) => { setPopupContent({ vendor: vendorData, priceInfo: priceData }); setIsVendorPopupVisible(true); };
  const handleCloseVendorPopup = () => { setIsVendorPopupVisible(false); setPopupContent(null); };

  // --- Loading / Not Found ---
  if (loading) { return <div className="loading-placeholder flex justify-center items-center h-96">Φόρτωση Προϊόντος...</div>; }
  if (!product) { return <NotFound />; }

  // Derived value - safe to use product here
  const productSlugForURL = product.slug || formatProductSlug(product.title);


  return (
    <div className="root__wrapper item-wrapper">
      <div className="root">
        <div id="trail" style={{ position: "relative" }}>
          <nav className="breadcrumb"><ProductBreadcrumb product={product} /></nav>
          {/* <div className="comparison__placeholder"></div> */}
        </div>
        <div className="item-layout__wrapper">
          <div className="item-layout">
            <aside className="item-aside stick-to-bottom">
              <div className="item__image-wrapper">
                <div className="item__image">
                  <ProductImageGallery mainImage={product.image} images={product.images} title={product.title} onImageChange={handleImageChange} />
                </div>
              </div>

              <div className="item-actions-buttons">
                 <button className="item-actions__button" onClick={handleAddToFavorites}><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/actions.svg#icon-shortlist-16"></use></svg><span className="item-actions__label">Προσθήκη στη Λίστα Αγορών</span></button>
                <button className="item-actions__button" data-id="compare"><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/actions.svg#icon-compare-16"></use></svg><span className="item-actions__label">Προσθήκη στη σύγκριση</span></button>
                <button className="item-actions__button" data-id="want"><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/actions.svg#icon-want-16"></use></svg><span className="item-actions__label">Το θέλω</span><span className="item-actions__count">25</span></button>
                <button className="item-actions__button" data-id="have"><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/actions.svg#icon-have-16"></use></svg><span className="item-actions__label">Το έχω</span></button>
                <button className="item-actions__button" onClick={handlePriceAlert}><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/actions.svg#icon-alert-16"></use></svg><span className="item-actions__label">Ειδοποίηση για πτώση τιμής</span></button>
                <button className="item-actions__button"><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/actions.svg#icon-collection-16"></use></svg><span className="item-actions__label">Προσθήκη σε συλλογή</span></button>
              </div>
            </aside>
            <main className="item-main">
              <div className="item-header__wrapper">
                <div className="item-header">
                  <ProductHeader product={product} onAddToFavorites={handleAddToFavorites} onShareProduct={handleShareProduct} />
                  {bestPriceInfo && (
                      <a href="#item-prices" className="item-price-button">
                          <div className="item-price-button__label">Από <strong>{bestPriceInfo.price.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</strong> σε {product.prices.filter(p=>p.inStock).length} καταστήματα</div>
                          <svg width="17" height="20"><path d="M7.75 1.5C7.75 1.08579 8.08579 0.75 8.5 0.75C8.91421 0.75 9.25 1.08579 9.25 1.5L9.25 18.5C9.25 18.9142 8.91421 19.25 8.5 19.25C8.08579 19.25 7.75 18.9142 7.75 18.5L7.75 1.5ZM8.5 17.4393L14.9697 10.9697C15.2626 10.6768 15.7374 10.6768 16.0303 10.9697C16.3232 11.2626 16.3232 11.7374 16.0303 12.0303L9.03033 19.0303C8.73744 19.3232 8.26256 19.3232 7.96967 19.0303L0.96967 12.0303C0.676776 11.7374 0.676776 11.2626 0.96967 10.9697C1.26256 10.6768 1.73744 10.6768 2.03033 10.9697L8.5 17.4393Z"></path></svg>
                      </a>
                  )}
                  <ProductHighlights specifications={product.specifications} product={product} />
                  <div className="item-description">{product.description}</div>
                </div>
                <div className="product-overview product-overview--deal"><ProductEssentialInfo product={product} bestPrice={bestPriceInfo} onNotifyMe={handlePriceAlert} /></div>
              </div>

              <div className="sections item-sections">
                {/* --- Product Vendors Section --- */}
                <section id="item-prices" className="section">
                    <header className="section__header">
                        <hgroup className="section__hgroup">
                        <h2 className="section__title">Καταστήματα <small><span>({product.prices.length})</span></small></h2>
                        </hgroup>
                        {/* Add Filter Controls Here if needed */}
                    </header>

                    <TopVendorAd productId={product.id} />

                    <div className="prices" data-merchants={product.prices.length}>
                        {product.prices
                            .sort((a, b) => a.price - b.price)
                            .map((priceInfo) => (
                                <VendorPriceCard key={priceInfo.vendorId} priceInfo={priceInfo} product={product} openPopup={handleOpenVendorPopup} />
                        ))}
                    </div>
                </section>
                {/* --- End Product Vendors Section --- */}

                <ProductRelatedSections categoryDeals={categoryDeals} productId={numericProductId} />

                <section id="item-graph" className="section">
                    <header className="section__header"><hgroup className="section__hgroup"><h2 className="section__title">Ιστορικό Τιμών</h2></hgroup></header>
                    <div style={{padding: '20px', border: '1px dashed #ccc', textAlign: 'center', color: '#888'}}>Price History Graph Placeholder</div>
                </section>

                <ProductRelatedSections similarProducts={similarProducts} productId={numericProductId} />

                <section id="item-content" className="section">
                  <ProductTabsSection product={product} />
                </section>
              </div>

              {/* Product Price Alert Modal */}
              {isPriceAlertModalOpen && bestPriceInfo && (
                <PriceAlertModal isOpen={isPriceAlertModalOpen} onClose={() => setIsPriceAlertModalOpen(false)} alertType="product" productId={product.id} productName={product.title} currentPrice={bestPriceInfo.price} />
              )}

              {/* Vendor Info Popup Modal */}
              {isVendorPopupVisible && popupContent && (
                <div className="popup-placeholder minfo__popup--placeholder popup-placeholder--modal" style={{ position: 'fixed', inset: 0, zIndex: 2147483570 }}>
                <div className="popup-flex-center popup-flex-center--top" style={{ zIndex: 2147483571 }}>
                    <div className="popup-backdrop open is-modal minfo__popup-backdrop" style={{ zIndex: 2147483571, transitionDuration: '150ms' }} onClick={handleCloseVendorPopup}></div>
                    <div className="minfo__popup popup open has-close has-close--inside is-modal" style={{ transitionDuration: '150ms', zIndex: 2147483571 }}>
                    <div className="popup-body">
                        <div role="button" className="close-button__wrapper pressable popup-close" onClick={handleCloseVendorPopup}>
                        <div className="close-button"><svg className="icon" aria-hidden="true" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></div>
                        </div>
                        <div className="minfo minfo--info">
                        <aside className="minfo__aside">
                            <div className="minfo__screen" style={{backgroundImage: `url(//image.thum.io/get/width/600/crop/800/noanimate/${popupContent.vendor.url})`}}></div>
                        </aside>
                        <main className="minfo__main">
                            <header className="minfo__header">
                            <h2 className="minfo__title">{popupContent.vendor.name}</h2>
                            <div className="minfo__header-props" data-id={popupContent.vendor.id}>
                                {popupContent.vendor.rating && (
                                <div className="simple-rating simple-rating--with-link pressable">
                                    <Link className="simple-rating__inner" to={`/m/${popupContent.vendor.id}/${popupContent.vendor.slug || popupContent.vendor.name.toLowerCase().replace(/\s+/g, '-')}#merchant-reviews`}>
                                    <div className="simple-rating__stars">
                                        <svg height="16" width="80" className="icon" aria-hidden="true"><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                                        <div className="simple-rating__rated" style={{ width: `${(popupContent.vendor.rating / 5) * 100}%` }}>
                                        <svg height="16" width="80" className="icon" aria-hidden="true"><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                                        </div>
                                    </div>
                                    <div className="simple-rating__avg">{popupContent.vendor.rating.toFixed(1)}</div>
                                    </Link>
                                    {/* <Link to={`/m/.../review`} className="simple-rating__new">Αξιολόγησέ το</Link> */}
                                </div>
                                )}
                                {popupContent.vendor.certification && (
                                    <div className="minfo__badge-container">
                                    <div className="tooltip__anchor minfo__certification">
                                        <svg aria-hidden="true" className="icon" width="22" height="22"><use href={`/dist/images/icons/certification.svg#icon-${popupContent.vendor.certification.toLowerCase()}-22`}></use></svg>
                                        <div data-certification={popupContent.vendor.certification.toLowerCase()} className="minfo__certification-wrapper pressable">Πιστοποίηση: {popupContent.vendor.certification}</div>
                                    </div>
                                    </div>
                                )}
                            </div>
                            </header>
                            <div className="minfo__tabs">
                                <div className="minfo__tab minfo__tab--info minfo__tab--selected">Πληροφορίες</div>
                            </div>
                            <div className="minfo__view minfo__view--info">
                                <div className="minfo__buttons">
                                    {popupContent.vendor.address && popupContent.vendor.address.length > 0 ? (
                                        <div className="minfo__button pressable">
                                            <svg width={18} height={18} className="icon minfo__button-icon" aria-hidden="true"><use href="/dist/images/icons/icons.svg#icon-pin-14"></use></svg>
                                            <div className="minfo__button-label">{popupContent.vendor.address[0]}</div>
                                        </div>
                                    ) : (
                                        <div className="minfo__button minfo__button--disabled">
                                            <svg width={18} height={18} className="icon minfo__button-icon" aria-hidden="true"><use href="/dist/images/icons/icons.svg#icon-world-16"></use></svg>
                                            <div className="minfo__button-label">Μόνο Ηλεκτρονικό κατάστημα</div>
                                        </div>
                                    )}
                                    {/* Use openingStatus calculated for the popup vendor */}
                                    <div className={`minfo__button-info minfo__sign ${getOpeningStatus(popupContent.vendor.openingHours).isOpen ? 'minfo__sign--open' : 'minfo__sign--closed'}`}>{getOpeningStatus(popupContent.vendor.openingHours).text}</div>
                                </div>
                                <div className="minfo__lists">
                                    {popupContent.vendor.paymentMethods && popupContent.vendor.paymentMethods.length > 0 && (
                                        <div className="minfo__list">
                                            <h3 className="minfo__list-header"><Link to={`/m/${popupContent.vendor.id}/${popupContent.vendor.slug || popupContent.vendor.name.toLowerCase().replace(/\s+/g, '-')}#merchant-shipping-payment`}>ΤΡΟΠΟΙ ΠΛΗΡΩΜΗΣ</Link></h3>
                                            <ul>
                                                {Object.values(PaymentMethod).map(method => (
                                                    <li key={method} className={popupContent.vendor.paymentMethods?.includes(method) ? 'minfo__yes' : ''}>
                                                        {method}
                                                        {popupContent.vendor.paymentMethods?.includes(method) ? (
                                                            <svg className="icon" aria-hidden="true" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-check-full-16"></use></svg>
                                                        ) : (
                                                            <svg className="icon" aria-hidden="true" width={16} height={16}><use href="/dist/images/icons/icons.svg#icon-check-empty-16"></use></svg>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {/* Add other lists (e.g., shipping) dynamically */}
                                </div>
                                <div className="minfo__actions">
                                    <Link to={`/m/${popupContent.vendor.id}/${popupContent.vendor.slug || popupContent.vendor.name.toLowerCase()}`} className="button button--outline">Μάθε περισσότερα</Link>
                                    {/* Conditionally Render Link based on priceInfo stored in popupContent */}
                                    {popupContent.priceInfo?.productUrl && (
                                        <a href={popupContent.priceInfo.productUrl} rel="nofollow noreferrer noopener external" target="_blank" className="button minfo__product-link">Προβολή στο κατάστημα</a>
                                    )}
                                </div>
                            </div>
                        </main>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            )}
             {/* End Vendor Info Popup Modal */}
            </main>
          </div>
        </div>
        <ProductRelatedSections recentlyViewed={recentlyViewed} productId={numericProductId} />
      </div>
    </div>
  );
};

export default ProductDetail;
