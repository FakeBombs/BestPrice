
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
    <div id="root" class="clr">
      <div data-trackga4="event|link_click|position: topStripe, title: bp-credits-club-generic-25, type: promo, id: bp-credits-club-generic-25" data-trackga4onload="event|promo_viewed|position: topStripe, title: bp-credits-club-generic-25" class="bp-credits-club-generic-25">
        <a rel="nofollow noopener" target="_blank" href="/credits-club" data-adman="69521"></a>
      </div>
      <div class="root__wrapper item-wrapper">
        <div class="root">
          {/* Breadcrumb */}
          <ProductBreadcrumb product={product} />
          <div class="item-layout__wrapper">
            <div className="item-layout">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <ProductImageGallery 
            mainImage={product.image} 
            images={[product.image]} 
            title={product.title}
            onImageChange={setMainImage}
          />
        </div>
        
        {/* Product Details */}
        <div>
          <ProductHeader
            product={product}
            onAddToFavorites={handleAddToFavorites}
            onShareProduct={handleShareProduct}
          />
          
          <ProductEssentialInfo
            product={product}
            bestPrice={bestPrice}
            onNotifyMe={handleNotifyMe}
          />
          
          <ProductHighlights specifications={product.specifications} />
          
          <Separator className="my-6" />
          
          <ProductVendors product={product} />
        </div>
      </div>
      
      {/* Product Information Tabs */}
      <ProductTabsSection product={product} />
      
      {/* Price History Chart */}
      <div className="mt-8">
        <PriceHistoryChart 
          productId={product.id} 
          basePrice={bestPrice ? bestPrice.price : 0}
        />
      </div>
      
      {/* Related Products Sections */}
      <ProductRelatedSections
        similarProducts={similarProducts}
        categoryDeals={categoryDeals}
        recentlyViewed={recentlyViewed}
        productId={product.id}
      />
      
      {/* Price Alert Modal */}
      <PriceAlertModal 
        isOpen={isAlertModalOpen} 
        onClose={() => setIsAlertModalOpen(false)}
        product={product}
        currentPrice={bestPrice ? bestPrice.price : 0}
      />
      </div>
      </div>
     </div>
    </div>
  </div>
  );
};

export default ProductDetail;
