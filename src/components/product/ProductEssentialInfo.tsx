
import React, { useState } from 'react';
import { Star, Heart, Share, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductHighlights from './ProductHighlights';
import ProductImageGallery from '../ProductImageGallery';
import PriceHistoryChart from '../PriceHistoryChart';
import { useTranslation } from '../../hooks/useTranslation';

interface ProductEssentialInfoProps {
  product: any;
}

const ProductEssentialInfo: React.FC<ProductEssentialInfoProps> = ({ product }) => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y'>('6m');
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  
  const togglePriceHistory = () => {
    setShowPriceHistory(!showPriceHistory);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="product-gallery">
        <ProductImageGallery images={product.images || []} />
      </div>
      
      <div className="product-info space-y-4">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            Brand: <span className="font-medium">{product.brand}</span>
          </div>
          <div className="text-sm text-gray-500">
            SKU: <span className="font-medium">{product.sku || product.id}</span>
          </div>
        </div>
        
        <div className="price-section">
          <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={togglePriceHistory}>
              Price History
            </Button>
            <Button variant="outline" size="sm">
              <Info className="h-4 w-4 mr-1" /> Price Alert
            </Button>
          </div>
        </div>
        
        {showPriceHistory && (
          <div className="price-history-chart">
            <PriceHistoryChart 
              productId={product.id} 
              basePrice={product.price} 
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />
          </div>
        )}
        
        <div className="rating flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm">({product.reviewCount || 0} reviews)</span>
        </div>
        
        <ProductHighlights product={product} />
        
        <div className="action-buttons flex gap-2 pt-4">
          <Button variant="outline" className="flex items-center">
            <Heart className="h-4 w-4 mr-2" />
            {t('Add to Wishlist')}
          </Button>
          <Button variant="outline" className="flex items-center">
            <Share className="h-4 w-4 mr-2" />
            {t('Share')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductEssentialInfo;
