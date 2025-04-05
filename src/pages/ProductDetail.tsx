import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {getProductById, getSimilarProducts, getProductsByCategory, getBestPrice} from '@/data/mockData';
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

const formatProductSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const ProductDetail = () => {
  const { productId, productSlug } = useParams < { productId: string; productSlug?: string } > ();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [similarProducts, setSimilarProducts] = useState([]);
  const [categoryDeals, setCategoryDeals] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState(false);

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
        <div id="trail" style={{ position: "relative" }}><nav className="breadcrumb"><ProductBreadcrumb product={product} /></nav></div>
        <div className="item-layout__wrapper">
          <div className="item-layout">
            <aside className="item-aside stick-to-bottom">
              <div className="item__image-wrapper">
                <div class="item__image">
                  <ProductImageGallery mainImage={product.image} images={product.images} title={product.title} onImageChange={handleImageChange} />
                </div>
              </div>
            </aside>
            <main className="item-main">
              <div className="item-header__wrapper">
                <ProductHeader product={product} onAddToFavorites={handleAddToFavorites} onShareProduct={handleShareProduct} />
                <ProductEssentialInfo product={product} bestPrice={bestPrice} onNotifyMe={handlePriceAlert} />
                <ProductHighlights specifications={product.specifications} />
              </div>
              
            
              
              <ProductRelatedSections similarProducts={similarProducts} categoryDeals={categoryDeals} recentlyViewed={recentlyViewed} productId={product.id} />
              {isPriceAlertModalOpen && bestPrice && (
                  <PriceAlertModal isOpen={isPriceAlertModalOpen} onClose={() => setIsPriceAlertModalOpen(false)} product={product} currentPrice={bestPrice.price} />
                )
              }

              
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
