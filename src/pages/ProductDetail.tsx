
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Star, 
  ChevronRight, 
  ShoppingCart, 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { getProductById, getBestPrice, getVendorById } from '@/data/mockData';
import ProductVendors from '@/components/ProductVendors';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { toast } = useToast();
  const [mainImage, setMainImage] = useState<string | null>(null);
  
  if (!productId) {
    return <div className="container py-8">Product not found</div>;
  }
  
  const product = getProductById(productId);
  
  if (!product) {
    return <div className="container py-8">Product not found</div>;
  }
  
  const bestPrice = getBestPrice(product);
  const bestVendor = bestPrice ? getVendorById(bestPrice.vendorId) : null;
  
  const handleNotifyMe = () => {
    toast({
      title: "Price Alert Set",
      description: "We'll notify you when the price drops.",
    });
  };

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-6">
        <a href="/" className="text-muted-foreground hover:text-primary">Home</a>
        <ChevronRight className="h-4 w-4 mx-1" />
        <a href="/categories" className="text-muted-foreground hover:text-primary">Categories</a>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground">{product.title}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="border rounded-lg overflow-hidden mb-4 aspect-square bg-white">
            <img 
              src={mainImage || product.image} 
              alt={product.title} 
              className="w-full h-full object-contain"
            />
          </div>
          {/* If we had multiple images, we would show thumbnails here */}
        </div>
        
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          
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
          
          {bestPrice && (
            <div className="mb-6">
              <div className="text-3xl font-bold text-primary">${bestPrice.price.toFixed(2)}</div>
              {bestVendor && (
                <div className="text-sm mt-1">
                  Best price from {bestVendor.name}
                  {bestPrice.shippingCost > 0 
                    ? ` + $${bestPrice.shippingCost.toFixed(2)} shipping` 
                    : ' with free shipping'}
                </div>
              )}
              <div className="mt-4 flex space-x-3">
                <Button onClick={handleNotifyMe}>
                  Set Price Alert
                </Button>
              </div>
            </div>
          )}
          
          <p className="text-muted-foreground mb-6">{product.description}</p>
          
          <ProductVendors product={product} />
        </div>
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
            <h3 className="text-xl font-medium mb-4">Technical Specifications</h3>
            <div className="space-y-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-4 py-2 border-b last:border-0">
                  <div className="font-medium">{key}</div>
                  <div className="col-span-2">{value}</div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="description" className="p-4 border rounded-lg mt-4">
            <h3 className="text-xl font-medium mb-4">Product Description</h3>
            <p className="mb-4">{product.description}</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu 
              pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.
            </p>
          </TabsContent>
          <TabsContent value="reviews" className="p-4 border rounded-lg mt-4">
            <h3 className="text-xl font-medium mb-4">Customer Reviews</h3>
            <div className="flex items-center mb-6">
              <div className="text-4xl font-bold mr-4">{product.rating.toFixed(1)}</div>
              <div>
                <div className="flex items-center text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.round(product.rating) ? 'fill-current' : ''}`} 
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">Based on {product.reviews} reviews</div>
              </div>
            </div>
            <p className="text-muted-foreground">User reviews would be displayed here.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;
