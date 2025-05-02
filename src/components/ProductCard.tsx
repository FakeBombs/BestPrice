
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Product, getBestPrice } from '@/services/productService';
import { formatPrice } from '@/utils/formatters';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({
  product,
  className = "p p--row p--force-ratio" // Default class as requested
}: ProductCardProps) => {
  const bestPrice = getBestPrice(product);
  const vendorCount = product.prices ? product.prices.filter(p => p.in_stock || p.inStock).length : 0;
  const productTitle = product.title || product.name;
  const productSlug = product.slug;
  const productImage = product.image_url || product.imageUrl || product.image || '';
  
  // Get the category name if available
  const categoryName = product.categories && product.categories.length > 0 
    ? product.categories[0]?.name 
    : 'Άγνωστη Κατηγορία';

  return (
    <div className={className}>
      <Link to={`/item/${product.id}/${productSlug}`} className="p__cover">
        <picture><img src={productImage} alt={productTitle} /></picture>
      </Link>
      <div className="p__main">
        <div className="p__meta">
          <div className="p__category">{categoryName}</div>
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({product.review_count || product.reviewCount || 0})</span>
          <h3 className="p__title p__title--lines p__title--lines-2">
            <Link to={`/item/${product.id}/${productSlug}`} title={productTitle}>{productTitle}</Link>
          </h3>
        </div>
      </div>
      {bestPrice && (
        <div className="p__footer">
          <div className="p__price-merchants">
            <Link className="p__price" to={`/item/${product.id}/${productSlug}`}>
              <div className="p__price--current">{formatPrice(bestPrice.price)}</div>
            </Link>
          </div>
          <div className="p__merchants">{vendorCount} {vendorCount === 1 ? 'κατάστημα' : 'καταστήματα'}</div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
