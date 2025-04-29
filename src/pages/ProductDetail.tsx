import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getProductById, getSimilarProducts, getProductsByCategory, getBestPrice } from '@/data/mockData';
import ProductBreadcrumb from '@/components/product/ProductBreadcrumb';
import ProductHeader from '@/components/product/ProductHeader';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductEssentialInfo from '@/components/product/ProductEssentialInfo';
import ProductHighlights from '@/components/product/ProductHighlights';
import ProductTabsSection from '@/components/product/ProductTabsSection';
import ProductVendors from '@/components/ProductVendors';
import ProductRelatedSections from '@/components/product/ProductRelatedSections';
import PriceAlertModal from '@/components/PriceAlertModal';
import { useAuth } from '@/hooks/useAuth';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';
import { useTranslation } from '@/hooks/useTranslation';

const ProductDetail = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const [jsEnabled, setJsEnabled] = useState(false);
  let classNamesForBody = '';
  let classNamesForHtml = '';
  
  const checkAdBlockers = () => {
    const adElementsToCheck = ['.adsbox', '.ad-banner', '.video-ad'];
    return adElementsToCheck.some(selector => {
      const adElement = document.createElement('div');
      adElement.className = selector.slice(1);
      document.body.appendChild(adElement);
      const isBlocked = adElement.offsetHeight === 0 || getComputedStyle(adElement).display === 'none';
      document.body.removeChild(adElement);
      return isBlocked;
    });
  };

  const isAdBlocked = checkAdBlockers();

  if (userAgent.includes('windows')) {
    classNamesForHtml = 'windows no-touch not-touch supports-webp supports-ratio supports-flex-gap supports-lazy supports-assistant is-desktop is-modern flex-in-button is-prompting-to-add-to-home';
  } else if (userAgent.includes('mobile')) {
    classNamesForHtml = 'supports-webp supports-ratio supports-flex-gap supports-lazy supports-assistant is-mobile is-modern flex-in-button is-prompting-to-add-to-home';
    classNamesForBody = 'mobile';
  } else if (userAgent.includes('tablet')) {
    classNamesForHtml = 'supports-webp supports-ratio supports-flex-gap supports-lazy supports-assistant is-tablet is-modern flex-in-button is-prompting-to-add-to-home';
    classNamesForBody = 'tablet';
  } else {
    classNamesForHtml = 'supports-webp supports-ratio supports-flex-gap supports-lazy supports-assistant unknown-device is-modern flex-in-button is-prompting-to-add-to-home';
  }

  classNamesForHtml += isAdBlocked ? ' adblocked' : ' adallowed';

  useEffect(() => {
    const handleLoad = () => {
      setJsEnabled(true);
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  classNamesForHtml += jsEnabled ? ' js-enabled' : ' js-disabled';

  const newIdForBody = '';
  const newIdForHtml = 'page-item';

  useHtmlAttributes(classNamesForHtml, newIdForHtml);
  useBodyAttributes(classNamesForBody, newIdForBody);

  const { productId, productSlug } = useParams<{ productId: string; productSlug?: string }>();
  const numericProductId = Number(productId);
  const navigate = useNavigate();

  useEffect(() => {
    if (productSlug && productSlug !== productSlug.toLowerCase()) {
      navigate(`/item/${numericProductId}/${productSlug.toLowerCase()}`, { replace: true });
    } else if (!productSlug) {
      navigate(`/item/${numericProductId}/`, { replace: true });
    }
  }, [numericProductId, productSlug, navigate]);

  const { toast } = useToast();
  const { user } = useAuth();
  const [product, setProduct] = useState<any | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [categoryDeals, setCategoryDeals] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (productId && product && !productSlug) {
      const correctSlug = formatProductSlug(product.title);
      navigate(`/item/${productId}/${correctSlug}.html`, { replace: true });
    }
  }, [productId, product, productSlug, navigate]);

  useEffect(() => {
    if (productId) {
      const productData = getProductById(numericProductId);
      if (productData) {
        setProduct(productData);
        setCurrentImage(productData.image);
        
        setSimilarProducts(getSimilarProducts(productId));
        setCategoryDeals(getProductsByCategory(productData.category).slice(0, 5));

        const recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const recentlyViewedProducts = recentlyViewedIds
          .map(id => getProductById(id))
          .filter(p => p);
        setRecentlyViewed(recentlyViewedProducts);

        if (!recentlyViewedIds.includes(productId)) {
          const updatedRecentlyViewed = [productId, ...recentlyViewedIds].slice(0, 10);
          localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
        }
      }
    }
  }, [productId]);

  if (!product) {
    return <div className="flex justify-center items-center h-96">Product not found. Please check the URL.</div>;
  }

  const bestPrice = getBestPrice(product);
  if (!bestPrice) return <div>Price data unavailable</div>;

  const handleImageChange = (image: string) => {
    setCurrentImage(image);
  };

  const handleAddToFavorites = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add this product to your favorites",
      });
      return;
    }

    toast({
      title: "Added to Favorites",
      description: `${product.title} has been added to your favorites`,
    });
  };

  const handleShareProduct = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Product link has been copied to clipboard",
    });
  };

  const handlePriceAlert = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to set a price alert",
      });
      return;
    }

    setIsPriceAlertModalOpen(true);
  };

  return (
    <div className="root__wrapper item-wrapper">
      <div className="root">
        <div id="trail" style={{ position: "relative" }}>
          <nav className="breadcrumb"><ProductBreadcrumb product={product} /></nav>
          <div className="comparison__placeholder">
            {/* Comparison UI remains unchanged but can be adjusted based on actual product data */}
          </div>
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
                <button className="item-actions__button" onClick={handleAddToFavorites}>
                  <svg aria-hidden="true" className="icon" width="16" height="16"><use href="/dist/images/icons/actions.svg#icon-shortlist-16"></use></svg>
                  <span className="item-actions__label">Προσθήκη στη Λίστα Αγορών</span>
                </button>
                <button className="item-actions__button" data-id="compare">
                  <svg aria-hidden="true" className="icon" width="16" height="16"><use href="/dist/images/icons/actions.svg#icon-compare-16"></use></svg>
                  <span className="item-actions__label">Προσθήκη στη σύγκριση</span>
                </button>
                <button className="item-actions__button" data-id="want">
                  <svg aria-hidden="true" className="icon" width="16" height="16"><use href="/dist/images/icons/actions.svg#icon-want-16"></use></svg>
                  <span className="item-actions__label">Το θέλω</span><span className="item-actions__count">25</span>
                </button>
                <button className="item-actions__button" data-id="have">
                  <svg aria-hidden="true" className="icon" width="16" height="16"><use href="/dist/images/icons/actions.svg#icon-have-16"></use></svg>
                  <span className="item-actions__label">Το έχω</span>
                </button>
                <button className="item-actions__button" onClick={handlePriceAlert}>
                  <svg aria-hidden="true" className="icon" width="16" height="16"><use href="/dist/images/icons/actions.svg#icon-alert-16"></use></svg>
                  <span className="item-actions__label">Ειδοποίηση για πτώση τιμής</span>
                </button>
                <button className="item-actions__button">
                  <svg aria-hidden="true" className="icon" width="16" height="16"><use href="/dist/images/icons/actions.svg#icon-collection-16"></use></svg>
                  <span className="item-actions__label">Προσθήκη σε συλλογή</span>
                </button>
              </div>
            </aside>
            <main className="item-main">
              <div className="item-header__wrapper">
                <div className="item-header">
                  <ProductHeader product={product} onAddToFavorites={handleAddToFavorites} onShareProduct={handleShareProduct} />
                  <div className="item-price-button">
                    <div className="item-price-button__label">Από <strong>${bestPrice.price.toFixed(2)}</strong> σε {product.prices.length} καταστήματα</div>
                    <svg width="17" height="20" viewBox="0 0 17 20" role="img" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.75 1.5C7.75 1.08579 8.08579 0.75 8.5 0.75C8.91421 0.75 9.25 1.08579 9.25 1.5L9.25 18.5C9.25 18.9142 8.91421 19.25 8.5 19.25C8.08579 19.25 7.75 18.9142 7.75 18.5L7.75 1.5ZM8.5 17.4393L14.9697 10.9697C15.2626 10.6768 15.7374 10.6768 16.0303 10.9697C16.3232 11.2626 16.3232 11.7374 16.0303 12.0303L9.03033 19.0303C8.73744 19.3232 8.26256 19.3232 7.96967 19.0303L0.96967 12.0303C0.676776 11.7374 0.676776 11.2626 0.96967 10.9697C1.26256 10.6768 1.73744 10.6768 2.03033 10.9697L8.5 17.4393Z"></path></svg>
                  </div>
                  <ProductHighlights specifications={product.specifications} />
                </div>
                <div className="product-overview product-overview--deal"><ProductEssentialInfo product={product} bestPrice={bestPrice} onNotifyMe={handlePriceAlert} /></div>
              </div>

              <div className="sections item-sections">
                <section id="item-prices" className="section">
                  <ProductVendors product={product} />
                </section>
                <section id="item-graph" className="section">
                  
                </section>
                <section id="item-content" className="section">
                  <ProductTabsSection product={product} />
                </section>
              </div>

              {isPriceAlertModalOpen && bestPrice && (
                <PriceAlertModal isOpen={isPriceAlertModalOpen} onClose={() => setIsPriceAlertModalOpen(false)} product={product} currentPrice={bestPrice.price} />
              )}
            </main>
          </div>
        </div>
        <ProductRelatedSections similarProducts={similarProducts} categoryDeals={categoryDeals} recentlyViewed={recentlyViewed} productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetail;
