import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge'; // Assuming used elsewhere or keep if needed
import { Product, ProductPrice, getBestPrice, getVendorById, categories } from '@/data/mockData';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "p p--row p--force-ratio"
}: ProductCardProps) => {

  // --- Calculations INSIDE the component ---
  const bestPriceInfo = getBestPrice(product); // Use the imported helper

  // Generate slug from title if product.slug is missing (or use title directly)
  const productSlug = product.slug || product.title.toLowerCase()
                          .replace(/\s+/g, '-') // Replace spaces with -
                          .replace(/[^\w-]+/g, ''); // Remove all non-word chars except -

  // Calculate rating percentage (handle missing/zero rating)
  const ratingPercentage = product.rating ? ((product.rating / 5) * 100).toFixed(2) : '0';

  // Calculate vendor count based on IN-STOCK prices
  const vendorCount = product.prices.filter(p => p.inStock).length;

  // --- Category Lookup (Efficient approach) ---
  // Create the lookup map ONCE outside or pass it as prop if categories list is huge
  // For simplicity here, keeping it inside, but consider memoization if performance is critical
  const categoryLookup = useMemo(() => {
      return categories.reduce((acc, category) => {
          acc[category.id] = category.name;
          return acc;
      }, {} as Record<number, string>); // Type assertion for accumulator
  }, []); // Empty dependency array means this runs once per component instance

  const firstCategoryId = product.categoryIds?.[0]; // Use optional chaining
  const categoryName = firstCategoryId ? categoryLookup[firstCategoryId] : 'Χωρίς Κατηγορία'; // Fallback text
  // --- End Category Lookup ---

  return (
    <div className={className}>
      {/* Use Link for cover */}
      <Link to={`/item/${product.id}/${productSlug}`} className="p__cover">
        <picture>
          <img
            src={product.image || '/dist/images/placeholder.png'} // Add placeholder
            alt={product.title}
            loading="lazy" // Keep lazy loading
            onError={(e) => { (e.target as HTMLImageElement).src = '/dist/images/placeholder.png'; }} // Fallback on error
          />
        </picture>
      </Link>
      <div className="p__main">
        <div className="p__meta">
          {/* Display category name */}
          <div className="p__category">{categoryName}</div>
          <h3 className="p__title p__title--lines p__title--lines-2">
            <Link to={`/item/${product.id}/${productSlug}`} title={product.title}>{product.title}</Link>
          </h3>
        </div>
      </div>
      {/* Footer - Render only if there's price info */}
      {bestPriceInfo && (
        <div className="p__footer">
          {/* Rating Section - Render only if rating and reviews exist */}
          {product.rating !== undefined && product.reviews !== undefined && (
            <div className="p__rating popup-anchor" data-breakdown=""> {/* Corrected class to className */}
              <Link to={`/item/${product.id}/${productSlug}#reviews`} className="p__rating-link"> {/* Corrected class to className */}
                <div className="simple-rating">
                  <div className="simple-rating__inner">
                    <div className="simple-rating__stars"><svg aria-hidden="true" className="icon" width={80} height={16}><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg></div>
                    <div className="simple-rating__rated" style={{ width: `${ratingPercentage}%` }}>
                      <div className="simple-rating__stars"><svg aria-hidden="true" className="icon" width={80} height={16}><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg></div>
                    </div>
                  </div>
                  {/* Show review count only if > 0 */}
                  {product.reviews > 0 && (
                       <div className="simple-rating__total">({product.reviews})</div>
                  )}
                </div>
                <svg aria-hidden="true" className="icon p__rating-arrow" width={10} height={10}><use href="/dist/images/icons/arrows.svg#icon-more-12"></use></svg>
              </Link>
            </div>
          )}
          {/* Price and Merchant Info */}
          <div className="p__price-merchants">
            <Link className="p__price" to={`/item/${product.id}/${productSlug}`}>
              <div className="p__price--current">
                 {bestPriceInfo.price.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })} {/* Format Price */}
              </div>
              {/* Optional: Display original price if discount exists */}
              {bestPriceInfo.discountPrice && bestPriceInfo.discountPrice < bestPriceInfo.price && (
                   <del className="p__price--before">
                       {bestPriceInfo.price.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}
                   </del>
               )}
            </Link>
          </div>
          <div className="p__merchants">{vendorCount} {vendorCount === 1 ? 'κατάστημα' : 'καταστήματα'}</div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
