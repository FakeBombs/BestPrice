
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
      <style data-scope="promos" data-bundle="bp-credits-club-generic-25" data-promo-js-empty="" data-promo-css="bp-credits-club-generic-25">.bp-credits-club-generic-25 a{background-color:#000;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;overflow:hidden;width:100%}.bp-credits-club-generic-25 a::before{background:url(https://bp.pstatic.gr/public/dist/3060de25534eddceb78a.png) center/contain no-repeat;content:'';display:-webkit-flex;display:-ms-flexbox;display:flex;max-width:1024px;min-height:64px;width:100%}.supports-webp .bp-credits-club-generic-25 a::before{background-image:url(https://bp.pstatic.gr/public/dist/dd589ece7d1ba3f5ed40.webp)}@media only screen{.bp-credits-club-generic-25 a::before{background-image:url(https://bp.pstatic.gr/public/dist/a8d46a8418bf26e29b8a.png)}.supports-webp .bp-credits-club-generic-25 a::before{background-image:url(https://bp.pstatic.gr/public/dist/7479cc2e3f7c90c3eb3d.webp)}}@media only screen and (min-width:48em){.bp-credits-club-generic-25 a::before{min-height:72px;background-image:url(https://bp.pstatic.gr/public/dist/37ec6101ba30bb474e81.png)}.supports-webp .bp-credits-club-generic-25 a::before{background-image:url(https://bp.pstatic.gr/public/dist/0d9ed72f4a5228b21c65.webp)}}@media only screen and (min-width:48em) and (-webkit-min-device-pixel-ratio:2),only screen and (min-width:48em) and (min-resolution:192dpi),only screen and (min-width:48em) and (-webkit-min-device-pixel-ratio:1.25),only screen and (min-width:48em) and (min-resolution:120dpi){.bp-credits-club-generic-25 a::before{background-image:url(https://bp.pstatic.gr/public/dist/7a11a8fc75f5f0d794f7.png)}.supports-webp .bp-credits-club-generic-25 a::before{background-image:url(https://bp.pstatic.gr/public/dist/c39f81ac22fb7bff378d.webp)}}@media only screen and (min-width:64em){.bp-credits-club-generic-25 a::before{min-height:80px;background-image:url(https://bp.pstatic.gr/public/dist/607185a48d95553c3f78.png)}.supports-webp .bp-credits-club-generic-25 a::before{background-image:url(https://bp.pstatic.gr/public/dist/c37f020db4efec4b4866.webp)}.bp-credits-club-generic-25 a::before{background-image:url(https://bp.pstatic.gr/public/dist/acbb956bd7fe6d1c3f06.png)}.supports-webp .bp-credits-club-generic-25 a::before{background-image:url(https://bp.pstatic.gr/public/dist/c0340d7fff5147b00426.webp)}}@media only screen and (min-width:64em){}</style>
      <div className="container py-8">
      {/* Breadcrumb */}
      <ProductBreadcrumb product={product} />
      
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
  );
};

export default ProductDetail;
