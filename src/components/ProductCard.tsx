
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Product, getBestPrice, getVendorById } from '@/data/mockData';

interface ProductCardProps {
  product: Product;
  className?: string; // Adding this to allow custom classes
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
  const vendorCount = product.prices.filter(p => p.inStock).length;
  const productSlug = formatProductSlug(product.title);
  
  return (
    <div className={className}>
      <Link to={`/item/${product.id}/${productSlug}.html`}>
        <picture>
          <img src={product.image} alt={product.title} />
        </picture>
        <div className="p-4">
          <div className="flex items-center space-x-1 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>
          <h3 className="font-medium line-clamp-2 mb-2">{product.title}</h3>
          
          {bestPrice && <div className="mt-2">
              <div className="price-tag">${bestPrice.price.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground mt-1">
                from {vendorCount} {vendorCount === 1 ? 'vendor' : 'vendors'}
              </div>
            </div>}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
