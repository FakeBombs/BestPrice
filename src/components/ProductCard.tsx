
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Product, getBestPrice, getVendorById, categories } from '@/data/mockData';

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

  // Assuming you want to display the first category only
  const firstCategoryId = product.categoryIds[0];
  const categoryName = firstCategoryId ? categories[firstCategoryId] : 'Άγνωστη Κατηγορία'; // Fallback if no category
  
  return (
    <div className={className}>
  <Link to={`/item/${product.id}/${productSlug}`} className="p__cover">
    <picture>
      <img src={product.image} alt={product.title} />
    </picture>
  </Link>
  <div className="p__main">
    <div className="p__meta">
      <div className="p__category">{categoryName}</div>
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground">({product.reviews})</span>
      <h3 className="p__title p__title--lines p__title--lines-2">
        <Link to={`/item/${product.id}/${productSlug}`} title={product.title}>{product.title}</Link>
      </h3>
    </div>
  </div>
  {bestPrice && (
    <div className="p__footer">
      <div className="p__price-merchants">
        <a className="p__price" href={`/item/${product.id}/${productSlug}`}>
          <div className="p__price--current">${bestPrice.price.toFixed(2)}</div>
        </a>
      </div>
      <div className="p__merchants">
        {vendorCount} {vendorCount === 1 ? 'κατάστημα' : 'καταστήματα'}
      </div>
    </div>
  )}
</div>
  );
};

export default ProductCard;
