
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
  <>
    <div className="product-overview__section">
      <div className="product-overview__section-title">Η καλύτερη τιμή</div>
      <div className="product-overview__price">{bestPrice && ( ${bestPrice.price.toFixed(2)} )}</div>
      <div className="product-overview__link" data-type="share">Μοιράσου την προσφορά</div>
      <div className="product-overview__link" data-type="notify" onClick={onNotifyMe}>Ειδοποίηση για πτώση τιμής</div>
      
      {bestVendor && (
        <div className="text-sm">
          Best price from <span className="font-medium">{bestVendor.name}</span>
          {bestPrice.shippingCost > 0 
            ? ` + $${bestPrice.shippingCost.toFixed(2)} shipping` 
            : ' with free shipping'}
        </div>
      )}
      
      <div className="mt-4 text-sm text-muted-foreground flex items-center">
        Last price update: {new Date().toLocaleDateString()}
      </div>
    </div>
    
    <div className="product-overview__section"></div>
    <div className="product-overview__section"></div>
    <div className="product-overview__button">
      <button className="item-actions__button">
        <svg aria-hidden="true" className="icon" width="16" height="16"><path xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" d="M7 1C8.10457 1 9 1.89826 9 2.99791V4H12V8H9V10H7V14H2V4H5V2.99791C5 1.8945 5.88773 1 7 1ZM8 2.99791V4.00209H6V2.99791C6 2.44375 6.44304 2 7 2C7.55093 2 8 2.44919 8 2.99791ZM10 9H12V11H14V13H12V15H10V13H8V11H10V9Z"/></svg>
        <span className="item-actions__label">Λίστα Αγορών</span>
      </button>
    </div>
  </>
  );
};

export default ProductEssentialInfo;
