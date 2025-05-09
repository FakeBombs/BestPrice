import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import PriceHistoryChart from '@/components/PriceHistoryChart';
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
import ScrollableSlider from '@/components/ScrollableSlider';

// Helper to clean domain name
const cleanDomainName = (url: string): string => {
  if (!url) return '';
  try { const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`); return parsedUrl.hostname.replace(/^www\./i, ''); }
  catch (e) { return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]; }
};

// Helper Function to Determine Current Opening Status (NOW USES t for translations)
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
                if (currentTime >= opensTime && currentTime < closesTime) {
                    return { text: t('openUntil', { time: todayHours.closes }), isOpen: true };
                } else if (currentTime < opensTime) {
                    return { text: t('closedOpensAt', { time: todayHours.opens }), isOpen: false };
                } else {
                    return { text: t('closedForToday', "Closed for today"), isOpen: false };
                }
            } else {
                return { text: t('openingHoursError', "Error in opening hours"), isOpen: false };
            }
        } catch (error) {
            console.error("Error calculating opening status:", error);
            return { text: t('openingHoursError', "Error in opening hours"), isOpen: false };
        }
    }, [t]);
    return getStatus;
};


const ProductDetail = () => {
  const { productId: productIdParam, productSlug } = useParams<{ productId: string; productSlug?: string }>();
  const numericProductId = useMemo(() => parseInt(productIdParam || '', 10), [productIdParam]);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const location = useLocation();
  const getOpeningStatusForVendor = useOpeningStatus();

  const userAgent = navigator.userAgent.toLowerCase();
  const [jsEnabled, setJsEnabled] = useState(false);
  let classNamesForBody = '';
  let classNamesForHtml = 'page';
  const checkAdBlockers = useCallback((): boolean => { try { const testAd = document.createElement('div'); testAd.innerHTML = ' '; testAd.className = 'adsbox'; testAd.style.position = 'absolute'; testAd.style.left = '-9999px'; testAd.style.height = '1px'; document.body.appendChild(testAd); const isBlocked = !testAd.offsetHeight; document.body.removeChild(testAd); return isBlocked; } catch (e) { return false; } }, []);
  const isAdBlocked = useMemo(checkAdBlockers, [checkAdBlockers]);
  if (userAgent.includes('windows')) { classNamesForHtml += ' windows no-touch'; } else if (userAgent.includes('android')) { classNamesForHtml += ' android touch'; classNamesForBody = 'mobile'; } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) { classNamesForHtml += ' ios touch'; classNamesForBody = userAgent.includes('ipad') ? 'tablet' : 'mobile'; } else if (userAgent.includes('mac os x')) { classNamesForHtml += ' macos no-touch'; } else { classNamesForHtml += ' unknown-device'; }
  classNamesForHtml += isAdBlocked ? ' adblocked' : ' adallowed'; classNamesForHtml += ' supports-webp supports-ratio supports-flex-gap supports-lazy supports-assistant is-desktop is-modern flex-in-button is-prompting-to-add-to-home';
  useEffect(() => { setJsEnabled(true); }, []); classNamesForHtml += jsEnabled ? ' js-enabled' : ' js-disabled';
  useHtmlAttributes(classNamesForHtml, 'page-item'); useBodyAttributes(classNamesForBody, '');

  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [similarProductsState, setSimilarProductsState] = useState<Product[]>([]);
  const [categoryDeals, setCategoryDeals] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [isVendorPopupVisible, setIsVendorPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState<{ vendor: Vendor; priceInfo: ProductPrice; } | null>(null);
  
  // **** ADD State for PriceHistoryChart ****
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y'>('1m');

  const formatProductSlug = useCallback((title: string): string => title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'), []);

  useEffect(() => {
    setLoading(true);
    if (isNaN(numericProductId)) {
        setProduct(null);
        setLoading(false);
        return;
    }
    const productData = getProductById(numericProductId);
    if (productData) {
      setProduct(productData);
      setCurrentImage(productData.image || '');
      setSimilarProductsState(getSimilarProducts(numericProductId));
      if (productData.categoryIds && productData.categoryIds.length > 0) {
        setCategoryDeals(getProductsByCategory(productData.categoryIds[0]).filter(p => p.id !== numericProductId).slice(0, 5));
      } else {
        setCategoryDeals([]);
      }
      try {
        const recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]') as number[];
        const validIds = recentlyViewedIds.filter(id => typeof id === 'number');
        const recentProducts = validIds.map(id => getProductById(id)).filter((p): p is Product => !!p && p.id !== numericProductId);
        setRecentlyViewed(recentProducts);
        if (!validIds.includes(numericProductId)) {
          const updatedRecentlyViewed = [numericProductId, ...validIds].slice(0, 10);
          localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
        }
      } catch (error) { console.error("Error handling recently viewed:", error); localStorage.removeItem('recentlyViewed'); }
      const correctSlug = productData.slug || formatProductSlug(productData.title);
      if (productSlug && productSlug !== correctSlug) { 
         navigate(`/item/${numericProductId}/${correctSlug}${location.search}`, { replace: true });
      }
    } else {
      setProduct(null);
    }
    setLoading(false);
  }, [numericProductId, productSlug, navigate, location.search, formatProductSlug]);


  const bestPriceInfo = useMemo(() => { // Kept your original variable name
    if (!product) return null;
    return getBestPrice(product);
  }, [product]);

  const primaryCategory = useMemo(() => {
    if (!product || !product.categoryIds || product.categoryIds.length === 0) return null;
    const primaryCategoryId = product.categoryIds[0];
    const allCatsMap = new Map([...mainCategories, ...categories].map(c => [c.id, c]));
    return allCatsMap.get(primaryCategoryId) || null;
  }, [product]);

  // **** ADD currentActualPriceForHistory calculation ****
  const currentActualPriceForHistory = useMemo(() => {
    if (bestPriceInfo) { // Use bestPriceInfo as per your original structure
        if (typeof bestPriceInfo.discountPrice === 'number') return bestPriceInfo.discountPrice;
        if (typeof bestPriceInfo.price === 'number') return bestPriceInfo.price;
    }
    if (product && typeof product.lowestPrice === 'number') {
        return product.lowestPrice;
    }
    return 0;
  }, [bestPriceInfo, product]);


  const handleImageChange = (image: string) => { setCurrentImage(image); };
  const handleAddToFavorites = () => {
    if (!user) {
      toast({ title: t("loginRequired", "Login Required"), description: t("loginToAddToFavorites", "Please log in to add this product to your favorites"), variant: "destructive" });
      return;
    }
    if (product) { // Ensure product is not null
        toast({ title: t("addedToFavorites", "Added to Favorites"), description: t("productAddedToFavorites", { productName: product.title }) });
    }
  };
  const handleShareProduct = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast({ title: t("linkCopied", "Link Copied"), description: t("productLinkCopied", "Product link copied to clipboard") }))
      .catch(err => toast({ title: t("copyFailed", "Copy Failed"), description: t("couldNotCopyLink", "Could not copy link"), variant: "destructive" }));
  };
  const handlePriceAlert = () => {
    if (!user) {
      toast({ title: t("loginRequired", "Login Required"), description: t("loginToSetPriceAlert", "Please log in to set a price alert"), variant: "destructive" });
      return;
    }
    if (product) { // Ensure product exists
        setIsPriceAlertModalOpen(true);
    }
  };
  const handleOpenVendorPopup = (vendorData: Vendor, priceData: ProductPrice) => { setPopupContent({ vendor: vendorData, priceInfo: priceData }); setIsVendorPopupVisible(true); };
  const handleCloseVendorPopup = () => { setIsVendorPopupVisible(false); setPopupContent(null); };

  if (loading) { return <div className="loading-placeholder flex justify-center items-center h-96">{t('loadingProduct', 'Loading Product...')}</div>; }
  if (!product) { return <NotFound />; }

  return (
    <div className="root__wrapper item-wrapper">
      <div className="root">
        <div id="trail" style={{ position: "relative" }}>
          <nav className="breadcrumb"><ProductBreadcrumb product={product} /></nav>
        </div>
        <div className="item-layout__wrapper">
          <aside className="item-aside stick-to-bottom">
            <div className="item__image-wrapper">
              <div className="item__image">
                <ProductImageGallery mainImage={currentImage || product.image} images={product.images} title={product.title} onImageChange={handleImageChange} />
              </div>
            </div>
            <div className="item-actions-buttons">
              <button className="item-actions__button" onClick={handleAddToFavorites}><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/actions.svg#icon-shortlist-16"></use></svg><span className="item-actions__label">{t('addToShoppingList', 'Add to Shopping List')}</span></button>
              <button className="item-actions__button" data-id="compare"><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/actions.svg#icon-compare-16"></use></svg><span className="item-actions__label">{t('addToComparison', 'Add to Comparison')}</span></button>
              <button className="item-actions__button" data-id="want"><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/actions.svg#icon-want-16"></use></svg><span className="item-actions__label">{t('iWantIt', 'I Want It')}</span><span className="item-actions__count">25</span></button>
              <button className="item-actions__button" data-id="have"><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/actions.svg#icon-have-16"></use></svg><span className="item-actions__label">{t('iHaveIt', 'I Have It')}</span></button>
              <button className="item-actions__button" onClick={handlePriceAlert}><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/actions.svg#icon-alert-16"></use></svg><span className="item-actions__label">{t('notifyPriceDrop', 'Notify for Price Drop')}</span></button>
              <button className="item-actions__button"><svg aria-hidden="true" className="icon" width={16} height={16}><use href="/dist/images/icons/actions.svg#icon-collection-16"></use></svg><span className="item-actions__label">{t('addToCollection', 'Add to Collection')}</span></button>
            </div>
          </aside>
          <main className="item-main">
            <div className="item-header__wrapper">
              <div className="item-header">
                <ProductHeader product={product} onAddToFavorites={handleAddToFavorites} onShareProduct={handleShareProduct} />
                {bestPriceInfo && (
                    <a href="#item-prices" className="item-price-button">
                        <div className="item-price-button__label">{t('priceFrom', 'From')} <strong>{(bestPriceInfo.discountPrice ?? bestPriceInfo.price).toLocaleString(language, { style: 'currency', currency: 'EUR' })}</strong> {t('inStores', { count: product.prices.filter(p=>p.inStock).length })}</div>
                        <svg width="17" height="20"><path d="M7.75 1.5C7.75 1.08579 8.08579 0.75 8.5 0.75C8.91421 0.75 9.25 1.08579 9.25 1.5L9.25 18.5C9.25 18.9142 8.91421 19.25 8.5 19.25C8.08579 19.25 7.75 18.9142 7.75 18.5L7.75 1.5ZM8.5 17.4393L14.9697 10.9697C15.2626 10.6768 15.7374 10.6768 16.0303 10.9697C16.3232 11.2626 16.3232 11.7374 16.0303 12.0303L9.03033 19.0303C8.73744 19.3232 8.26256 19.3232 7.96967 19.0303L0.96967 12.0303C0.676776 11.7374 0.676776 11.2626 0.96967 10.9697C1.26256 10.6768 1.73744 10.6768 2.03033 10.9697L8.5 17.4393Z"></path></svg>
                    </a>
                )}
                <ProductHighlights specifications={product.specifications} product={product} />
                <div className="item-description">{product.description}</div>
              </div>
              <div className="product-overview product-overview--deal"><ProductEssentialInfo product={product} bestPrice={bestPriceInfo} onNotifyMe={handlePriceAlert} /></div>
            </div>

            <div className="sections item-sections">
              <section id="item-prices" className="section">
                <header className="section__header">
                  <hgroup className="section__hgroup">
                    <h2 className="section__title">{t('storesCount', { count: product.prices.length })} <div className="price-filters__clear undefined dotted-link">{t('clearPriceFilters', 'Clear filters')}</div> </h2>
                  </hgroup>
                  <div className="section__side">
                    <label data-type="priceFull" data-always-available="" className="price-filters__filter">
                      <input type="checkbox" />
                      <svg aria-hidden="true" className="icon" width={12} height={12}><use href="/dist/images/icons/cluster.svg#icon-calc-12"></use></svg>
                      <span className="price-filters__label">{t('finalPrice', 'Final Price')}</span>
                    </label>
                    </div>
                  </header>
                  <ScrollableSlider>
                  <div className="filter-wrapper">
                    <div data-count={product.prices.length} className="price-filters scroll__content">
                      <label data-type="in-stock" className="price-filters__filter"><input type="checkbox" /><span className="price-filters__label">{t('available', 'Available')}</span></label>
                      <label data-type="nearby" data-always-available="" className="price-filters__filter"><input type="checkbox" /><svg aria-hidden="true" className="icon" width={12} height={12}><use href="/dist/images/icons/cluster.svg#icon-pin-12"></use></svg><span className="price-filters__label">{t('nearMe', 'Near Me')}</span></label>
                      <label data-type="certified" data-tooltip={t('certifiedStoresTooltip', "Show only products from certified stores")} className="price-filters__filter"><input type="checkbox" /><svg aria-hidden="true" className="icon" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-certified-outline-12"></use></svg><span className="price-filters__label">{t('certified', 'Certified')}</span></label>
                      <label data-type="boxnow" className="price-filters__filter"><input type="checkbox" /><span className="price-filters__label">{t('deliveryWithService', {serviceName: 'BOX NOW'})} <svg aria-hidden="true" className="icon" width="100%" height="100%"><use href="/dist/images/icons/partners.svg#icon-boxnow"></use></svg></span></label>
                      <label data-type="coupons" className="price-filters__filter"><input type="checkbox" /><svg aria-hidden="true" className="icon" width={20} height={20}><use href="/dist/images/icons/icons.svg#icon-coupon-20"></use></svg><span className="price-filters__label">{t('coupons', 'Coupons')}</span></label>
                      <label data-type="color" data-options='["desert","black","white","grey","gold"]' className="price-filters__filter is-inline"><input type="checkbox" /><span className="price-filters__label">{t('color', 'Color')}</span></label>
                      <label data-type="authorized" className="price-filters__filter"><input type="checkbox" /><span className="price-filters__label">{t('officialResellers', 'Official Resellers')}</span></label>
                    </div>
                  </div>
                  </ScrollableSlider>
                  <TopVendorAd productId={product.id} />
                  <div className="prices" data-merchants={product.prices.length}>
                      {product.prices
                          .sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price))
                          .map((priceInfo) => (
                              <VendorPriceCard key={priceInfo.vendorId} priceInfo={priceInfo} product={product} openPopup={handleOpenVendorPopup} />
                      ))}
                  </div>
                </section>

                <ProductRelatedSections categoryDeals={categoryDeals} similarProducts={similarProductsState} productId={numericProductId} currentCategoryName={primaryCategory ? t(primaryCategory.slug, primaryCategory.name) : undefined} />

                {/* **** START OF PRICE HISTORY SECTION (Your Original Structure) **** */}
                <section id="item-graph" className="section">
                    <header className="section__header"><hgroup className="section__hgroup"><h2 className="section__title">{t('priceHistoryTitle', 'Price History')}</h2></hgroup></header>
                    {/* Conditional rendering for PriceHistoryChart */}
                    {currentActualPriceForHistory > 0 ? (
                        <PriceHistoryChart 
                            productId={product.id} 
                            basePrice={currentActualPriceForHistory} 
                            timeRange={timeRange} 
                            setTimeRange={setTimeRange} 
                        />
                    ) : (
                        <div style={{padding: '20px', border: '1px dashed #ccc', textAlign: 'center', color: '#888'}}>
                            {t('price_history_unavailable_product', 'Price history is currently unavailable for this product.')}
                        </div>
                    )}
                </section>
                {/* **** END OF PRICE HISTORY SECTION **** */}

                <ProductRelatedSections similarProducts={similarProductsState} productId={numericProductId} />
                
                <section id="item-content" className="section">
                  <ProductTabsSection product={product} />
                </section>
              </div>

              {isPriceAlertModalOpen && bestPriceInfo && (
                <PriceAlertModal isOpen={isPriceAlertModalOpen} onClose={() => setIsPriceAlertModalOpen(false)} alertType="product" productId={product.id} productName={product.title} currentPrice={bestPriceInfo.discountPrice ?? bestPriceInfo.price} />
              )}

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
                                </div>
                                )}
                                {popupContent.vendor.certification && (
                                    <div className="minfo__badge-container">
                                    <div className="tooltip__anchor minfo__certification">
                                        <svg aria-hidden="true" className="icon" width="22" height="22"><use href={`/dist/images/icons/certification.svg#icon-${popupContent.vendor.certification.toLowerCase()}-22`}></use></svg>
                                        <div data-certification={popupContent.vendor.certification.toLowerCase()} className="minfo__certification-wrapper pressable">{t('vendorPopupCertification', {certificationType: popupContent.vendor.certification})}</div>
                                    </div>
                                    </div>
                                )}
                            </div>
                            </header>
                            <div className="minfo__tabs">
                                <div className="minfo__tab minfo__tab--info minfo__tab--selected">{t('vendorPopupInformation', 'Information')}</div>
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
                                            <div className="minfo__button-label">{t('vendorPopupAddressNotAvailable', 'Online Only Store')}</div>
                                        </div>
                                    )}
                                    <div className={`minfo__button-info minfo__sign ${getOpeningStatusForVendor(popupContent.vendor.openingHours).isOpen ? 'minfo__sign--open' : 'minfo__sign--closed'}`}>{getOpeningStatusForVendor(popupContent.vendor.openingHours).text}</div>
                                </div>
                                <div className="minfo__lists">
                                    {popupContent.vendor.paymentMethods && popupContent.vendor.paymentMethods.length > 0 && (
                                        <div className="minfo__list">
                                            <h3 className="minfo__list-header"><Link to={`/m/${popupContent.vendor.id}/${popupContent.vendor.slug || popupContent.vendor.name.toLowerCase().replace(/\s+/g, '-')}#merchant-shipping-payment`}>{t('vendorPopupPaymentMethods', 'PAYMENT METHODS')}</Link></h3>
                                            <ul>
                                                {Object.values(PaymentMethod).map(method => (
                                                    <li key={method} className={popupContent.vendor.paymentMethods?.includes(method) ? 'minfo__yes' : ''}>
                                                        {t(`paymentMethod_${method.toLowerCase().replace(/\s+/g, '_').replace(/€/g, 'euro')}`, method)} 
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
                                </div>
                                <div className="minfo__actions">
                                    <Link to={`/m/${popupContent.vendor.id}/${popupContent.vendor.slug || popupContent.vendor.name.toLowerCase()}`} className="button button--outline">{t('vendorPopupLearnMore', 'Learn More')}</Link>
                                    {popupContent.priceInfo?.productUrl && (
                                        <a href={popupContent.priceInfo.productUrl} rel="nofollow noreferrer noopener external" target="_blank" className="button minfo__product-link">{t('vendorPopupViewInStore', 'View in Store')}</a>
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
          </main>
        </div>
      </div>
      <ProductRelatedSections recentlyViewed={recentlyViewed} productId={numericProductId} />
    </div>
  );
};

export default ProductDetail;
