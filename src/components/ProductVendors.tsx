
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, ExternalLink } from 'lucide-react';
import { Product, ProductPrice, getVendorById } from '@/data/mockData';

interface ProductVendorsProps {
  product: Product;
}

const ProductVendors = ({ product }: ProductVendorsProps) => {
  // Sort prices from lowest to highest
  const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-medium mb-4">Available from {product.prices.length} vendors</h3>
      <div className="space-y-4">
        {sortedPrices.map((priceInfo) => (
          <VendorPriceCard key={priceInfo.vendorId} priceInfo={priceInfo} product={product} />
        ))}
      </div>
    </div>
  );
};

interface VendorPriceCardProps {
  priceInfo: ProductPrice;
  product: Product;
}

const VendorPriceCard = ({ priceInfo, product }: VendorPriceCardProps) => {
  const vendor = getVendorById(priceInfo.vendorId);
  
  if (!vendor) return null;
  
  const totalPrice = priceInfo.price + priceInfo.shippingCost;
  
  return (
    <Card className={!priceInfo.inStock ? 'opacity-70' : ''}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 mr-4">
              <img 
                src={vendor.logo} 
                alt={vendor.name} 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h4 className="font-medium">{vendor.name}</h4>
              <div className="flex items-center text-sm text-muted-foreground">
                Rating: {vendor.rating.toFixed(1)}/5.0
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:items-end">
            <div className="price-tag">${priceInfo.price.toFixed(2)}</div>
            <div className="text-sm">
              {priceInfo.shippingCost > 0 
                ? `+ $${priceInfo.shippingCost.toFixed(2)} shipping` 
                : 'Free shipping'}
            </div>
            <div className="flex items-center mt-1">
              {priceInfo.inStock 
                ? <span className="text-green-600 flex items-center text-sm"><Check className="h-4 w-4 mr-1" /> In stock</span>
                : <span className="text-red-500 flex items-center text-sm"><X className="h-4 w-4 mr-1" /> Out of stock</span>
              }
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 md:ml-4">
            <Button disabled={!priceInfo.inStock} className="w-full md:w-auto">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Offer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductVendors;
