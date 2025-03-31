
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  ChevronRight, 
  ShoppingCart, 
  Heart,
  Share2,
  Bell,
  Clock,
  ThumbsUp,
  ThumbsDown,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  getProductById, 
  getBestPrice, 
  getVendorById, 
  getProductsByCategory,
  getProductsByCategoryWithDiscount
} from '@/data/mockData';
import ProductVendors from '@/components/ProductVendors';
import ProductCarousel from '@/components/ProductCarousel';
import PriceHistoryChart from '@/components/PriceHistoryChart';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import ProductImageGallery from '@/components/ProductImageGallery';
import UserReviews from '@/components/UserReviews';
import ProductSpecTable from '@/components/ProductSpecTable';
import SimilarProductsSlider from '@/components/SimilarProductsSlider';
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import PriceAlertModal from '@/components/PriceAlertModal';

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
  const bestVendor = bestPrice ? getVendorById(bestPrice.vendorId) : null;
  
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
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-6">
        <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/categories" className="text-muted-foreground hover:text-primary">Categories</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link 
          to={`/categories/${product.categoryId}`} 
          className="text-muted-foreground hover:text-primary"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
      </div>
      
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
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex space-x-2">
              <Button 
                onClick={handleAddToFavorites} 
                variant="outline" 
                size="icon"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button 
                onClick={handleShareProduct} 
                variant="outline" 
                size="icon"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-400 mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${i < Math.round(product.rating) ? 'fill-current' : ''}`} 
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating.toFixed(1)} ({product.reviews} reviews)
            </span>
          </div>
          
          {/* Essential Info Card */}
          <div className="bg-muted/30 p-4 rounded-lg mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
              <div>
                <Badge className="mb-2 bg-green-500">Best Price</Badge>
                {bestPrice && (
                  <div className="text-3xl font-bold text-primary">${bestPrice.price.toFixed(2)}</div>
                )}
              </div>
              
              <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleNotifyMe}
                  variant="outline"
                  className="flex items-center"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Price Alert
                </Button>
                <Button className="flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Compare Prices
                </Button>
              </div>
            </div>
            
            {bestVendor && (
              <div className="text-sm">
                Best price from <span className="font-medium">{bestVendor.name}</span>
                {bestPrice.shippingCost > 0 
                  ? ` + $${bestPrice.shippingCost.toFixed(2)} shipping` 
                  : ' with free shipping'}
              </div>
            )}
            
            <div className="mt-4 text-sm text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Last price update: {new Date().toLocaleDateString()}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Highlights</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
                <li key={key}>
                  <span className="font-medium">{key}:</span> {value}
                </li>
              ))}
            </ul>
          </div>
          
          <Separator className="my-6" />
          
          <ProductVendors product={product} />
        </div>
      </div>
      
      {/* Price History Chart */}
      <div className="mt-8">
        <PriceHistoryChart 
          productId={product.id} 
          basePrice={bestPrice ? bestPrice.price : 0}
        />
      </div>
      
      {/* Product Information Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="specifications">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="specifications" className="p-4 border rounded-lg mt-4">
            <ProductSpecTable specifications={product.specifications} />
          </TabsContent>
          <TabsContent value="description" className="p-4 border rounded-lg mt-4">
            <h3 className="text-xl font-medium mb-4">Product Description</h3>
            <div className="prose max-w-none">
              <p className="mb-4">{product.description}</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu 
                pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-4 border rounded-lg mt-4">
            <UserReviews productId={product.id} rating={product.rating} reviewCount={product.reviews} />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Similar Products */}
      <SimilarProductsSlider title="Similar Products" products={similarProducts} />
      
      {/* Deals in this Category */}
      <ProductCarousel 
        title={`Deals in ${product.category}`} 
        products={categoryDeals} 
        emptyMessage="No deals found in this category"
      />
      
      {/* Recently Viewed Products */}
      <ProductCarousel 
        title="Recently Viewed" 
        products={recentlyViewed.filter(p => p.id !== product.id)} 
        emptyMessage="No recently viewed products"
      />
      
      {/* Price Alert Modal */}
      <PriceAlertModal 
        isOpen={isAlertModalOpen} 
        onClose={() => setIsAlertModalOpen(false)}
        product={product}
        currentPrice={bestPrice ? bestPrice.price : 0}
      />
    </div>
  );
};

export default ProductDetail;
