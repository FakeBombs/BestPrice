import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Added Link
import { useToast } from '@/hooks/use-toast';
import {
    getProductById, getSimilarProducts, getProductsByCategory, getBestPrice,
    Product, Vendor, vendors as allVendors, // Import Vendor type and vendors array
    PaymentMethod, // Import if used in popup directly
    OpeningHours // Import if used in popup directly
} from '@/data/mockData';
import ProductBreadcrumb from '@/components/product/ProductBreadcrumb';
import ProductHeader from '@/components/product/ProductHeader';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductEssentialInfo from '@/components/product/ProductEssentialInfo';
import ProductHighlights from '@/components/product/ProductHighlights';
import ProductTabsSection from '@/components/product/ProductTabsSection';
// ** CORRECTED IMPORT **
import { VendorPriceCard } from '@/components/ProductVendors'; // Import the correct component
import ProductRelatedSections from '@/components/product/ProductRelatedSections';
import PriceAlertModal from '@/components/PriceAlertModal'; // For product price alerts
import { useAuth } from '@/hooks/useAuth';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';
import { useTranslation } from '@/hooks/useTranslation';
import TopVendorAd from '@/components/ads/TopVendorAd'; // Import Ad component

// Helper to clean domain name (needed for popup)
const cleanDomainName = (url: string): string => {
  if (!url) return '';
  try { const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`); return parsedUrl.hostname.replace(/^www\./i, ''); }
  catch (e) { return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]; }
};

const ProductDetail = () => {
  // --- Document Attributes ---
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
  useHtmlAttributes(classNamesForHtml, 'page-item');
  useBodyAttributes(classNamesForBody, '');
  // --- End Document Attributes ---

  const { productId, productSlug } = useParams<{ productId: string; productSlug?: string }>();
  const numericProductId = Number(productId);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

  // --- State ---
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [categoryDeals, setCategoryDeals] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  // ** NEW: State for Vendor Info Popup **
  const [isVendorPopupVisible, setIsVendorPopupVisible] = useState(false);
  const [popupVendorContent, setPopupVendorContent] = useState<Vendor | null>(null);

   // --- Slug Handling & Data Fetching ---
   const formatProductSlug = (title: string): string => title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  useEffect(() => {
    setLoading(true); // Start loading
    if (productId) {
      const productData = getProductById(numericProductId);
      if (productData) {
        setProduct(productData);
        setCurrentImage(productData.image);
        setSimilarProducts(getSimilarProducts(numericProductId));
        // Assuming getProductsByCategory returns relevant deals or popular items
        setCategoryDeals(getProductsByCategory(productData.categoryIds[0]).filter(p => p.id !== numericProductId).slice(0, 5)); // Example: Get other products from the first category

        // Recently Viewed Logic
        try {
          const recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]') as number[];
          const validIds = recentlyViewedIds.filter(id => typeof id === 'number'); // Ensure IDs are numbers
          const recentlyViewedProducts = validIds.map(id => getProductById(id)).filter((p): p is Product => p !== undefined && p.id !== numericProductId); // Filter out nulls and current product
          setRecentlyViewed(recentlyViewedProducts);

          if (!validIds.includes(numericProductId)) {
            const updatedRecentlyViewed = [numericProductId, ...validIds].slice(0, 10);
            localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
          }
        } catch (error) {
          console.error("Error handling recently viewed:", error);
          localStorage.removeItem('recentlyViewed'); // Clear potentially corrupted data
        }

        // Check and redirect if slug is incorrect or missing
        const correctSlug = productData.slug || formatProductSlug(productData.title);
        if (!productSlug || productSlug !== correctSlug) {
           navigate(`/item/${numericProductId}/${correctSlug}`, { replace: true });
        }

      } else {
        setProduct(null); // Explicitly set to null if not found
      }
    }
    setLoading(false); // End loading
  }, [productId, navigate]); // Remove productSlug from dependency to avoid loop on redirect

  // --- Loading / Not Found ---
  if (loading) { return <div className="flex justify-center items-center h-96">Loading Product...</div>; }
  if (!product) { return <NotFound />; } // Use NotFound component

  // --- Calculations after product is loaded ---
  const bestPriceInfo = getBestPrice(product); // Use optional chaining below

  // --- Event Handlers ---
  const handleImageChange = (image: string) => { setCurrentImage(image); };
  const handleAddToFavorites = () => { if (!user) { toast({ title: "Login Required", description: "Please log in to add this product to your favorites", variant: "destructive" }); return; } toast({ title: "Added to Favorites", description: `${product.title} has been added to your favorites` }); };
  const handleShareProduct = () => { navigator.clipboard.writeText(window.location.href).then(() => toast({ title: "Link Copied", description: "Product link copied to clipboard" })).catch(err => toast({ title: "Copy Failed", description: "Could not copy link", variant: "destructive" })); };
  const handlePriceAlert = () => { if (!user) { toast({ title: "Login Required", description: "Please log in to set a price alert", variant: "destructive" }); return; } setIsPriceAlertModalOpen(true); };

  // ** NEW: Handlers for Vendor Info Popup **
  const handleOpenVendorPopup = (vendorData: Vendor) => {
      setPopupVendorContent(vendorData);
      setIsVendorPopupVisible(true);
  };
  const handleCloseVendorPopup = () => {
      setIsVendorPopupVisible(false);
      setPopupVendorContent(null);
  };

  // Helper function to get opening status (copied from previous answer)
  const getOpeningStatus = (openingHours: OpeningHours[] | undefined): { text: string, isOpen: boolean } => {
        if (!openingHours || openingHours.length === 0) { return { text: "Πληροφορίες ωραρίου μη διαθέσιμες", isOpen: false }; }
        try { const now = new Date(); const currentDayIndex = now.getDay(); const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; const currentDayName = days[currentDayIndex] as OpeningHours['dayOfWeek']; const currentTime = now.getHours() * 100 + now.getMinutes(); const todayHours = openingHours.find(h => h.dayOfWeek === currentDayName); if (!todayHours || !todayHours.opens || !todayHours.closes) { return { text: "Κλειστό σήμερα", isOpen: false }; } const opensTime = parseInt(todayHours.opens.replace(':', ''), 10); const closesTime = parseInt(todayHours.closes.replace(':', ''), 10); if (!isNaN(opensTime) && !isNaN(closesTime)) { if (currentTime >= opensTime && currentTime < closesTime) { return { text: `Ανοιχτό μέχρι τις ${todayHours.closes}`, isOpen: true }; } else if (currentTime < opensTime) { return { text: `Κλειστό - Ανοίγει στις ${todayHours.opens}`, isOpen: false }; } else { return { text: "Κλειστό για σήμερα", isOpen: false }; } } else { return { text: "Σφάλμα ωραρίου", isOpen: false }; } }
        catch (error) { console.error("Error calculating opening status:", error); return { text: "Σφάλμα ωραρίου", isOpen: false }; }
    };

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
                  {/* Pass currentImage if needed by gallery, or let gallery manage it */}
                  <ProductImageGallery mainImage={product.image} images={product.images} title={product.title} onImageChange={handleImageChange} />
                </div>
              </div>

              <div className="item-actions-buttons">
                <button className="item-actions__button" onClick={handleAddToFavorites}><svg><use href="/dist/images/icons/actions.svg#icon-shortlist-16"></use></svg><span className="item-actions__label">Προσθήκη στη Λίστα Αγορών</span></button>
                <button className="item-actions__button" data-id="compare"><svg><use href="/dist/images/icons/actions.svg#icon-compare-16"></use></svg><span className="item-actions__label">Προσθήκη στη σύγκριση</span></button>
                {/* <button className="item-actions__button" data-id="want">...</button> */}
                {/* <button className="item-actions__button" data-id="have">...</button> */}
                <button className="item-actions__button" onClick={handlePriceAlert}><svg><use href="/dist/images/icons/actions.svg#icon-alert-16"></use></svg><span className="item-actions__label">Ειδοποίηση για πτώση τιμής</span></button>
                {/* <button className="item-actions__button">...</button> */}
              </div>
            </aside>
            <main className="item-main">
              <div className="item-header__wrapper">
                <div className="item-header">
                  <ProductHeader product={product} onAddToFavorites={handleAddToFavorites} onShareProduct={handleShareProduct} />
                  {/* Conditionally render price button only if bestPriceInfo exists */}
                  {bestPriceInfo && (
                      <a href="#item-prices" className="item-price-button"> {/* Make it a link to the prices section */}
                          <div className="item-price-button__label">Από <strong>{bestPriceInfo.price.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</strong> σε {product.prices.filter(p=>p.inStock).length} καταστήματα</div>
                          <svg width="17" height="20"><path d="M7.75 1.5C7.75 1.08579 8.08579 0.75 8.5 0.75C8.91421 0.75 9.25 1.08579 9.25 1.5L9.25 18.5C9.25 18.9142 8.91421 19.25 8.5 19.25C8.08579 19.25 7.75 18.9142 7.75 18.5L7.75 1.5ZM8.5 17.4393L14.9697 10.9697C15.2626 10.6768 15.7374 10.6768 16.0303 10.9697C16.3232 11.2626 16.3232 11.7374 16.0303 12.0303L9.03033 19.0303C8.73744 19.3232 8.26256 19.3232 7.96967 19.0303L0.96967 12.0303C0.676776 11.7374 0.676776 11.2626 0.96967 10.9697C1.26256 10.6768 1.73744 10.6768 2.03033 10.9697L8.5 17.4393Z"></path></svg>
                      </a>
                  )}
                  <ProductHighlights specifications={product.specifications} product={product} />
                  <div className="item-description">{product.description}</div>
                </div>
                {/* Remove this section as Essential Info is shown below with Vendors */}
                {/* <div className="product-overview product-overview--deal"><ProductEssentialInfo product={product} bestPrice={bestPriceInfo} onNotifyMe={handlePriceAlert} /></div> */}
              </div>

              <div className="sections item-sections">
                {/* --- Product Vendors Section --- */}
                <section id="item-prices" className="section">
                    <header className="section__header">
                        <hgroup className="section__hgroup">
                        <h2 className="section__title">
                            Καταστήματα <small><span>({product.prices.length})</span></small>
                            {/* Add filter clear logic if filters are implemented here */}
                            {/* <div class="price-filters__clear undefined dotted-link">{t('clearFilters')}</div> */}
                        </h2>
                        </hgroup>
                        <div className="section__side">
                        {/* Add actual filter controls if needed */}
                        {/* <label data-type="priceFull" ...><input type="checkbox"/>...</label> */}
                        </div>
                    </header>
                    {/* Add filter wrapper if needed */}
                    {/* <div className="filter-wrapper">...</div> */}

                    <TopVendorAd productId={product.id} />

                    <div className="prices" data-merchants={product.prices.length}>
                        {product.prices
                            .sort((a, b) => a.price - b.price) // Sort prices here
                            .map((priceInfo) => (
                                <VendorPriceCard
                                    key={priceInfo.vendorId}
                                    priceInfo={priceInfo}
                                    product={product}
                                    openPopup={handleOpenVendorPopup} // Pass the handler
                                />
                        ))}
                    </div>
                </section>
                {/* --- End Product Vendors Section --- */}

                <section id="item-graph" className="section">
                    {/* Placeholder for Price History Graph */}
                    <header className="section__header"><hgroup className="section__hgroup"><h2 className="section__title">Ιστορικό Τιμών</h2></hgroup></header>
                    <div style={{padding: '20px', border: '1px dashed #ccc', textAlign: 'center', color: '#888'}}>Price History Graph Placeholder</div>
                </section>

                <section id="item-content" className="section">
                  <ProductTabsSection product={product} />
                </section>
              </div>

              {/* Product Price Alert Modal */}
              {isPriceAlertModalOpen && bestPriceInfo && (
                <PriceAlertModal
                  isOpen={isPriceAlertModalOpen}
                  onClose={() => setIsPriceAlertModalOpen(false)}
                  // Pass Product context for this modal type
                  alertType="product" // Indicate alert type
                  productId={product.id}
                  productName={product.title}
                  currentPrice={bestPriceInfo.price} // Pass the best current price
                  // Remove category/search props if not needed by modal
                  // categoryId={undefined}
                  // categoryName={undefined}
                  // searchQuery={undefined}
                  // searchFilters={undefined}
                  />
              )}

              {/* Vendor Info Popup Modal */}
              {isVendorPopupVisible && popupVendorContent && (
                <div className="popup-placeholder minfo__popup--placeholder popup-placeholder--modal" style={{ position: 'fixed', inset: 0, zIndex: 2147483570 }}> {/* Ensure high z-index */}
                <div className="popup-flex-center popup-flex-center--top" style={{ zIndex: 2147483571 }}>
                    <div className="popup-backdrop open is-modal minfo__popup-backdrop" style={{ zIndex: 2147483571, transitionDuration: '150ms' }} onClick={handleCloseVendorPopup}></div>
                    <div className="minfo__popup popup open has-close has-close--inside is-modal" style={{ transitionDuration: '150ms', zIndex: 2147483571 }}>
                    <div className="popup-body">
                        <div role="button" className="close-button__wrapper pressable popup-close" onClick={handleCloseVendorPopup}>
                        <div className="close-button"><svg className="icon" aria-hidden="true" width="12" height="12"><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></div>
                        </div>
                        <div className="minfo minfo--info">
                        <aside className="minfo__aside">
                            <div className="minfo__screen" style={{ backgroundImage: `url('${popupVendorContent.logo || '/images/placeholder.png'}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}></div>
                        </aside>
                        <main className="minfo__main">
                            <header className="minfo__header">
                            <h2 className="minfo__title">{popupVendorContent.name}</h2>
                            <div className="minfo__header-props" data-id={popupVendorContent.id}>
                                {popupVendorContent.rating && (
                                <div className="simple-rating simple-rating--with-link pressable">
                                    <Link className="simple-rating__inner" to={`/m/${popupVendorContent.id}/${popupVendorContent.slug || popupVendorContent.name.toLowerCase().replace(/\s+/g, '-')}#merchant-reviews`}>
                                    <div className="simple-rating__stars">
                                        <svg height="16" width="80" className="icon" aria-hidden="true"><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                                        <div className="simple-rating__rated" style={{ width: `${(popupVendorContent.rating / 5) * 100}%` }}>
                                        <svg height="16" width="80" className="icon" aria-hidden="true"><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg>
                                        </div>
                                    </div>
                                    <div className="simple-rating__avg">{popupVendorContent.rating.toFixed(1)}</div>
                                    </Link>
                                    {/* <Link to={`/m/.../review`} className="simple-rating__new">Αξιολόγησέ το</Link> */}
                                </div>
                                )}
                                {popupVendorContent.certification && (
                                    <div className="minfo__badge-container">
                                    <div className="tooltip__anchor minfo__certification">
                                        <svg aria-hidden="true" className="icon" width="22" height="22"><use href={`/dist/images/icons/certification.svg#icon-${popupVendorContent.certification.toLowerCase()}-22`}></use></svg>
                                        <div data-certification={popupVendorContent.certification.toLowerCase()} className="minfo__certification-wrapper pressable">Πιστοποίηση: {popupVendorContent.certification}</div>
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
                                    {popupVendorContent.address && popupVendorContent.address.length > 0 ? (
                                        <div className="minfo__button pressable">
                                            <svg width="18" height="18" className="icon minfo__button-icon" aria-hidden="true"><use href="/dist/images/icons/icons.svg#icon-pin-14"></use></svg>
                                            <div className="minfo__button-label">{popupVendorContent.address[0]}</div>
                                        </div>
                                    ) : (
                                        <div className="minfo__button minfo__button--disabled">
                                            <svg width="18" height="18" className="icon minfo__button-icon" aria-hidden="true"><use href="/dist/images/icons/icons.svg#icon-world-16"></use></svg>
                                            <div className="minfo__button-label">Μόνο Ηλεκτρονικό κατάστημα</div>
                                        </div>
                                    )}
                                    <div className={`minfo__button-info minfo__sign ${getOpeningStatus(popupVendorContent.openingHours).isOpen ? 'minfo__sign--open' : 'minfo__sign--closed'}`}>{getOpeningStatus(popupVendorContent.openingHours).text}</div>
                                </div>
                                <div className="minfo__lists">
                                    {popupVendorContent.paymentMethods && popupVendorContent.paymentMethods.length > 0 && (
                                        <div className="minfo__list">
                                            <h3 className="minfo__list-header"><Link to={`/m/${popupVendorContent.id}/${popupVendorContent.slug || popupVendorContent.name.toLowerCase().replace(/\s+/g, '-')}/#merchant-shipping-payment`}>ΤΡΟΠΟΙ ΠΛΗΡΩΜΗΣ</Link></h3>
                                            <ul>
                                                {Object.values(PaymentMethod).map(method => (
                                                    <li key={method} className={popupVendorContent.paymentMethods?.includes(method) ? 'minfo__yes' : ''}>
                                                        {method}
                                                        {popupVendorContent.paymentMethods?.includes(method) ? (
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
                                    <Link to={`/m/${popupVendorContent.id}/${popupVendorContent.slug || popupVendorContent.name.toLowerCase()}`} className="button button--outline">Μάθε περισσότερα</Link>
                                    {/* Optionally add link to product on vendor site if available in priceInfo */}
                                    {/* <a href={...} rel="nofollow noreferrer noopener" className="button minfo__product-link">Προβολή στο κατάστημα</a> */}
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
        <ProductRelatedSections similarProducts={similarProducts} categoryDeals={categoryDeals} recentlyViewed={recentlyViewed} productId={numericProductId} />
      </div>
    </div>
  );
};

export default ProductDetail;
