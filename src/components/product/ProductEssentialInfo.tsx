
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ShoppingCart } from 'lucide-react';
import { Product, ProductPrice, getVendorById } from '@/data/mockData';

interface ProductEssentialInfoProps {
  product: Product;
  bestPrice: ProductPrice | undefined;
  onNotifyMe: () => void;
}

const ProductEssentialInfo = ({ product, bestPrice, onNotifyMe }: ProductEssentialInfoProps) => {
  const bestVendor = bestPrice ? getVendorById(bestPrice.vendorId) : null;
  
  return (
    <div className="product-overview__section">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
        <div>
          <Badge className="mb-2 bg-green-500">Best Price</Badge>
          {bestPrice && (
            <div className="text-3xl font-bold text-primary">${bestPrice.price.toFixed(2)}</div>
          )}
        </div>
        
        <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
          <Button onClick={onNotifyMe} variant="outline" className="flex items-center"><Bell className="h-4 w-4 mr-2" />Price Alert</Button>
          <Button className="flex items-center"><ShoppingCart className="h-4 w-4 mr-2" />Compare Prices</Button>
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
  );
};

export default ProductEssentialInfo;
