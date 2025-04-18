import { useState, useEffect } from 'react';
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
import PriceHistoryChart from '@/components/PriceHistoryChart';
import PriceAlertModal from '@/components/PriceAlertModal';
import { useAuth } from '@/hooks/useAuth';
import { useBodyAttributes, useHtmlAttributes } from '@/hooks/useDocumentAttributes';
import { useTranslation } from '@/hooks/useTranslation';

const formatProductSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const ProductDetail = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const [jsEnabled, setJsEnabled] = useState(false);
  let classNamesForBody = '';
  let classNamesForHtml = '';

  // Check for ad blockers
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

  // Determine device type
  if (userAgent.includes('windows')) {
    classNamesForHtml = 'windows no-touch not-touch supports-webp supports-ratio supports-flex-gap supports-lazy supports-assistant is-desktop is-modern flex-in-button is-prompting-to-add-to-home';
  } else if (userAgent.includes('mobile')) {
    classNamesForHtml = 'is-mobile';
    classNamesForBody = 'mobile';
  } else if (userAgent.includes('tablet')) {
    classNamesForHtml = 'is-tablet';
    classNamesForBody = 'tablet';
  } else {
    classNamesForHtml = 'unknown-device';
  }

  // Handle ad blockers
  classNamesForHtml += isAdBlocked ? ' adblocked' : ' adallowed';

  // Set JavaScript enabled state
  useEffect(() => {
    const handleLoad = () => {
      setJsEnabled(true);
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  // Add JS enabled/disabled class
  classNamesForHtml += jsEnabled ? ' js-enabled' : ' js-disabled';

  // Set attributes
  const newIdForBody = ''; // Keeping body ID empty
  const newIdForHtml = 'page-item';

  useHtmlAttributes(classNamesForHtml, newIdForHtml);
  useBodyAttributes(classNamesForBody, newIdForBody);

  const { productId, productSlug } = useParams<{ productId: string; productSlug?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [similarProducts, setSimilarProducts] = useState([]);
  const [categoryDeals, setCategoryDeals] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState(false);
  const { t } = useTranslation();

  // Redirect legacy URLs to new format
  useEffect(() => {
    if (productId && product && !productSlug) {
      const correctSlug = formatProductSlug(product.title);
      navigate(`/item/${productId}/${correctSlug}.html`, { replace: true });
    }
  }, [productId, product, productSlug, navigate]);

  useEffect(() => {
    if (productId) {
      const productData = getProductById(productId);
      if (productData) {
        setProduct(productData);
        setCurrentImage(productData.image);

        // Get similar products
        setSimilarProducts(getSimilarProducts(productId));

        // Get category deals - in a real app, this would filter for actual deals
        setCategoryDeals(getProductsByCategory(productData.category).slice(0, 5));

        // Get recently viewed from localStorage
        const recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const recentlyViewedProducts = recentlyViewedIds
          .map(id => getProductById(id))
          .filter(p => p); // Remove any nulls
        setRecentlyViewed(recentlyViewedProducts);

        // Update recently viewed in localStorage
        if (!recentlyViewedIds.includes(productId)) {
          const updatedRecentlyViewed = [productId, ...recentlyViewedIds].slice(0, 10);
          localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
        }
      }
    }
  }, [productId]);

  if (!product) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  const bestPrice = getBestPrice(product);

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
                <button className="item-actions__button">
                  <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" d="M7 1C8.10457 1 9 1.89826 9 2.99791V4H12V8H9V10H7V14H2V4H5V2.99791C5 1.8945 5.88773 1 7 1ZM8 2.99791V4.00209H6V2.99791C6 2.44375 6.44304 2 7 2C7.55093 2 8 2.44919 8 2.99791ZM10 9H12V11H14V13H12V15H10V13H8V11H10V9Z"/></svg>
                  <span className="item-actions__label">Προσθήκη στη Λίστα Αγορών</span>
                </button>
                <button className="item-actions__button" data-id="compare">
                  <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" d="M7.85103 0V2.90727H6L8.51483 6.34L11.0316 2.90727H9.17862V0H7.85103ZM9.17764 15.34V12.4327H11.03L8.51405 9L6 12.4327H7.85046V15.34H9.17764ZM13.8103 7H3V8.27273H13.8103V7Z"/></svg>
                  <span className="item-actions__label">Προσθήκη στη σύγκριση</span>
                </button>
                <button className="item-actions__button" data-id="want">
                  <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" d="M5 2C6 2 7.27586 2.91379 8 4C8.73603 2.89595 10 2 11 2C12.9797 2 15 3.47207 15 6C15 10 8 14 8 14C8 14 1 10 1 6C1 3.44827 3 2 5 2Z"/></svg>
                  <span className="item-actions__label">Το θέλω</span><span className="item-actions__count">25</span>
                </button>
                <button className="item-actions__button" data-id="have">
                  <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M0 8L6 15L16 4L13 1L6 8L3 5L0 8Z"/></svg>
                  <span className="item-actions__label">Το έχω</span>
                </button>
                <button className="item-actions__button" onClick={handlePriceAlert}>
                  <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" d="M13 8C13 4 11 1 8 1C5 1 3 4 3 8C3 9 1 12 1 12H15C15 12 13 9 13 8ZM10 13C10 13 10 15 8 15C6 15 6 13 6 13H10Z"/></svg>
                  <span className="item-actions__label">Ειδοποίηση για πτώση τιμής</span>
                </button>
                <button className="item-actions__button">
                  <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" d="M1 3H14V6H1V3ZM16 10H14V8H12V10H10V12H12V14H14V12H16V10ZM9 11V13H10V14H1V11H9ZM1 7H11V9H9V10H1V7Z"/></svg>
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
                  <PriceHistoryChart productId={product.id} basePrice={bestPrice?.price || 999} />
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
