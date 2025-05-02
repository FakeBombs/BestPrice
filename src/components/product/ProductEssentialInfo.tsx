import { Button } from '@/components/ui/button';
import { Product, ProductPrice, getVendorById } from '@/data/mockData';
import { useTranslation } from '@/hooks/useTranslation';

interface ProductEssentialInfoProps {
  product: Product;
  bestPrice: ProductPrice | undefined;
  onNotifyMe: () => void;
};

const ProductVendors = ({ product }: ProductVendorsProps) => {
  // Sort prices from lowest to highest
  const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price);
};

const ProductEssentialInfo = ({ product, bestPrice, onNotifyMe }: ProductEssentialInfoProps) => {
  const bestVendor = bestPrice ? getVendorById(bestPrice.vendorId) : null;
  const { t } = useTranslation();
  
  return (
  <>
    <div className="product-overview__section">
      <div className="product-overview__section-title">Η καλύτερη τιμή</div>
      <div className="product-overview__price">{bestPrice && (<span>${bestPrice.price.toFixed(2)}</span>)}</div>
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
    </div>
    
    <div class="product-overview__section"><div class="product-overview__section-title">Διατίθεται από</div><div class="product-overview__merchants">{product.prices.length} καταστήματα</div></div>
    <div className="product-overview__section">
      <div class="product-overview__section-title">Πτώση τιμής</div>
      <div class="item-mini-graph__placeholder" data-intersected=""></div>
      <div className="mt-4 text-sm text-muted-foreground flex items-center">
        Last price update: {new Date().toLocaleDateString()}
      </div>
    </div>
    <div className="product-overview__button">
      <button className="item-actions__button">
        <svg aria-hidden="true" className="icon" width="16" height="16"><use href="/dist/images/icons/actions.svg#icon-shortlist-16"></use></svg>
        <span className="item-actions__label">Λίστα Αγορών</span>
      </button>
    </div>
  </>
  );
};

export default ProductEssentialInfo;
