
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Product, getBestPrice, getVendorById, categories } from '@/data/mockData';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const formatProductSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const ProductCard = ({
  product,
  className = "p p--row p--force-ratio" // Default class as requested
}: ProductCardProps) => {
  const bestPrice = getBestPrice(product);
  const vendorCount = product.prices ? product.prices.filter(p => p.inStock).length : 0;
  const productTitle = product.title || product.name;
  const productSlug = formatProductSlug(productTitle);
  const productImage = product.image || product.imageUrl || '';

  // Convert categories array to an object for quick access
  const categoryLookup = categories.reduce((acc: Record<number, string>, category) => {
    acc[category.id] = category.name; // Map ID to the name
    return acc;
  }, {});

  // Assuming you want to display the first category only
  const firstCategoryId = product.categoryIds?.[0] || product.categoryId;
  const categoryName = firstCategoryId ? categoryLookup[firstCategoryId] : 'Άγνωστη Κατηγορία';

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
          <span className="text-xs text-muted-foreground">({product.reviews || product.reviewCount || 0})</span>
          <h3 className="p__title p__title--lines p__title--lines-2">
            <Link to={`/item/${product.id}/${productSlug}`} title={productTitle}>{productTitle}</Link>
          </h3>
        </div>
      </div>
      {bestPrice && (
        <div className="p__footer">
          <div className="p__price-merchants">
            <Link className="p__price" to={`/item/${product.id}/${productSlug}`}>
              <div className="p__price--current">${bestPrice.price.toFixed(2)}</div>
            </Link>
          </div>
          <div className="p__merchants">{vendorCount} {vendorCount === 1 ? 'κατάστημα' : 'καταστήματα'}</div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
