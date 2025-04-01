
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  getProductById, 
  getBestPrice, 
  getProductsByCategory,
  getProductsByCategoryWithDiscount
} from '@/data/mockData';
import { Separator } from "@/components/ui/separator";
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductVendors from '@/components/ProductVendors';
import PriceHistoryChart from '@/components/PriceHistoryChart';
import PriceAlertModal from '@/components/PriceAlertModal';
import ProductBreadcrumb from '@/components/product/ProductBreadcrumb';
import ProductHeader from '@/components/product/ProductHeader';
import ProductEssentialInfo from '@/components/product/ProductEssentialInfo';
import ProductHighlights from '@/components/product/ProductHighlights';
import ProductTabsSection from '@/components/product/ProductTabsSection';
import ProductRelatedSections from '@/components/product/ProductRelatedSections';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { toast } = useToast();
  const [mainImage, setMainImage] = useState<string | null>(null);
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const { user } = useAuth();
  
  if (!productId) {
    return <div className="container py-8">Product not found</div>;
  }
  
  const product = getProductById(productId);
  
  if (!product) {
    return <div className="container py-8">Product not found</div>;
  }
  
  const bestPrice = getBestPrice(product);
  
  // Get similar products (products in the same category)
  const similarProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 8);
  
  // Get deals for this category
  const categoryDeals = getProductsByCategoryWithDiscount(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 8);
  
  // Add product to recently viewed
  useEffect(() => {
    if (productId) {
      addToRecentlyViewed(productId);
    }
  }, [productId, addToRecentlyViewed]);
  
  const handleNotifyMe = () => {
    if (user) {
      setIsAlertModalOpen(true);
    } else {
      toast({
        title: "Login Required",
        description: "Please log in to set price alerts",
      });
    }
  };

  const handleAddToFavorites = () => {
    if (user) {
      toast({
        title: "Added to Favorites",
        description: "This product has been added to your favorites.",
      });
    } else {
      toast({
        title: "Login Required",
        description: "Please log in to add products to your favorites",
      });
    }
  };

  const handleShareProduct = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Product link has been copied to clipboard",
    });
  };

  return (
      <div className="root__wrapper item-wrapper">
        <div className="root">
          
          {/* Breadcrumb */}
          <ProductBreadcrumb product={product} />
          
          <div className="item-layout__wrapper">
            <div className="item-layout">
              <aside className="item-aside stick-to-bottom">
                <div className="item__image-wrapper">
                  {/* Product Images */}
                  <ProductImageGallery mainImage={product.image} images={[product.image]} title={product.title} onImageChange={setMainImage} />
                </div>

                <div id="item-image-gallery">
                  <div className="scroll scroll--center scroll--small">
                    <div className="scroll__clip">
                      <div className="scroll__scroller"></div>
                    </div>
                  </div>
                </div>

                <div className="item-actions-buttons">
                  <button className="item-actions__button">
                    <svg aria-hidden="true" className="icon" width="16" height="16">
                      <use xlinkHref="/public/dist/images/icons/actions.svg#icon-shortlist-16"></use>
                    </svg>
                    <span className="item-actions__label">Προσθήκη στη Λίστα Αγορών</span>
                  </button>
                  <button className="item-actions__button" data-id="compare">
                    <svg aria-hidden="true" className="icon" width="16" height="16">
                      <use xlinkHref="/public/dist/images/icons/actions.svg#icon-compare-16"></use>
                    </svg>
                    <span className="item-actions__label">Προσθήκη στη σύγκριση</span>
                  </button>
                  <button className="item-actions__button" data-id="want">
                    <svg aria-hidden="true" className="icon" width="16" height="16">
                      <use xlinkHref="/public/dist/images/icons/actions.svg#icon-want-16"></use>
                    </svg>
                    <span className="item-actions__label">Το θέλω</span>
                    <span className="item-actions__count">8</span>
                  </button>
                  <button className="item-actions__button" data-id="have">
                    <svg aria-hidden="true" className="icon" width="16" height="16">
                      <use xlinkHref="/public/dist/images/icons/actions.svg#icon-have-16"></use>
                    </svg>
                    <span className="item-actions__label">Το έχω</span>
                    <span className="item-actions__count"></span>
                  </button>
                  <button className="item-actions__button">
                    <svg aria-hidden="true" className="icon" width="16" height="16">
                      <use xlinkHref="/public/dist/images/icons/actions.svg#icon-alert-16"></use>
                    </svg>
                    <span className="item-actions__label">Ειδοποίηση για πτώση τιμής</span>
                  </button>
                  <button className="item-actions__button">
                    <svg aria-hidden="true" className="icon" width="16" height="16">
                      <use xlinkHref="/public/dist/images/icons/actions.svg#icon-collection-16"></use>
                    </svg>
                    <span className="item-actions__label">Προσθήκη σε συλλογή</span>
                  </button>
                </div>
              </aside>
              <main className="item-main">
                
                <div className="item-header__wrapper">
                  <div className="item-header">
                    {/* Product Details */}
                    <ProductHeader product={product} onAddToFavorites={handleAddToFavorites} onShareProduct={handleShareProduct} />
                    <ProductEssentialInfo product={product} bestPrice={bestPrice} onNotifyMe={handleNotifyMe} />
                    <ProductHighlights specifications={product.specifications} />
                  </div>
                  
                  <div className="product-overview">
                    <div className="product-overview__section">
                      <div className="product-overview__section-title">Η καλύτερη τιμή</div>
                      <div className="product-overview__price">{bestPrice ? bestPrice.price : 0}</div>
                      <div className="product-overview__link" data-type="notify">Ειδοποίηση για πτώση τιμής</div>
                    </div>
                    
                    <div className="product-overview__section">
                      <div className="product-overview__section-title">Διατίθεται από</div>
                      <div className="product-overview__merchants">Electroholic και 3 ακόμα καταστήματα</div>
                    </div>
                    
                    <div className="product-overview__button">
                      <button className="item-actions__button">
                        <svg aria-hidden="true" className="icon" width="16" height="16"><use xlinkHref="//bestprice.gr/public/dist/images/icons/actions.svg#icon-shortlist-16"></use></svg>
                        <span className="item-actions__label">Λίστα Αγορών</span>
                      </button>
                    </div>
                  </div>
                </div>
                  
                <div className="sections item-sections">
                  <ProductVendors product={product} />
                  
                  {/* Price History Chart */}
                  <PriceHistoryChart productId={product.id} basePrice={bestPrice ? bestPrice.price : 0} />
                    
                  {/* Product Information Tabs */}
                  <ProductTabsSection product={product} />
                </div>
                  
              </main>

              <div className="history__placeholder" data-intersected="">
                <div className="root__wrapper">
                  <div className="root">
                    <section className="section history__products">
                      <header className="section__header">
                        <hgroup className="section__hgroup">
                          <h3 className="section__title">Είδες πρόσφατα</h3>
                        </hgroup>
                      </header>

                      <div className="scroll">
                        {/* Related Products Sections */}
                        <ProductRelatedSections recentlyViewed={recentlyViewed} categoryDeals={categoryDeals} similarProducts={similarProducts} productId={product.id} />
                      </div>
                    </section>
                  </div>
                </div>
              </div>
              
              {/* Price Alert Modal */}
              <PriceAlertModal isOpen={isAlertModalOpen} onClose={() => setIsAlertModalOpen(false)} product={product} currentPrice={bestPrice ? bestPrice.price : 0} />
              </div>
            </div>
          </div>
        </div>
    );
};

export default ProductDetail;
