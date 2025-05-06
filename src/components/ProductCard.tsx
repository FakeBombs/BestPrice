import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge'; // Assuming used elsewhere or keep if needed
import { Product, ProductPrice, getBestPrice, getVendorById, categories } from '@/data/mockData';

interface ProductCardProps {
  product: Product;
  className?: string;
  activeVendorFilterDomain?: string | null; // <-- Added prop
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "p p--row p--force-ratio",
  activeVendorFilterDomain // <-- Destructure prop
}: ProductCardProps) => {

  // --- Calculations ---
  const bestPriceInfo = getBestPrice(product);
  const productSlug = product.slug || product.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  const ratingPercentage = product.rating ? ((product.rating / 5) * 100).toFixed(2) : '0';
  const vendorCount = product.prices.filter(p => p.inStock).length;

  // --- Category Lookup ---
  const categoryLookup = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {} as Record<number, string>);
  }, []);
  const firstCategoryId = product.categoryIds?.[0];
  const categoryName = firstCategoryId ? categoryLookup[firstCategoryId] : 'Χωρίς Κατηγορία';

  // --- Construct Target URL ---
  const baseProductUrl = `/item/${product.id}/${productSlug}`;
  const targetUrl = activeVendorFilterDomain
    ? `${baseProductUrl}?filter=store:${activeVendorFilterDomain}` // Append filter
    : baseProductUrl;                                             // Use base URL

  return (
    <div className={className}>
      {/* Use targetUrl for Links */}
      <Link to={targetUrl} className="p__cover">
        <picture>
          <img src={product.image || '/dist/images/placeholder.png'} alt={product.title} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = '/dist/images/placeholder.png'; }}/>
        </picture>
      </Link>
      <div className="p__main">
        <div className="p__meta">
          <div className="p__category">{categoryName}</div>
          <h3 className="p__title p__title--lines p__title--lines-2">
            {/* Use targetUrl */}
            <Link to={targetUrl} title={product.title}>{product.title}</Link>
          </h3>
        </div>
      </div>
      {bestPriceInfo && (
        <div className="p__footer">
          {product.rating !== undefined && product.reviews !== undefined && (
            <div className="p__rating popup-anchor" data-breakdown="">
              {/* Use targetUrl (maybe append #reviews directly if needed) */}
              <Link to={`${targetUrl}#reviews`} className="p__rating-link">
                <div className="simple-rating">
                  <div className="simple-rating__inner">
                    <div className="simple-rating__stars"><svg aria-hidden="true" className="icon" width={80} height={16}><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg></div>
                    <div className="simple-rating__rated" style={{ width: `${ratingPercentage}%` }}>
                      <div className="simple-rating__stars"><svg aria-hidden="true" className="icon" width={80} height={16}><use href="/dist/images/icons/stars.svg#icon-stars-all"></use></svg></div>
                    </div>
                  </div>
                  {product.reviews > 0 && (<div className="simple-rating__total">({product.reviews})</div>)}
                </div>
                <svg aria-hidden="true" className="icon p__rating-arrow" width={10} height={10}><use href="/dist/images/icons/arrows.svg#icon-more-12"></use></svg>
              </Link>
            </div>
          )}
          <div className="p__price-merchants">
            {/* Use targetUrl */}
            <Link className="p__price" to={targetUrl}>
              <div className="p__price--current">
                 {bestPriceInfo.price.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}
              </div>
              {bestPriceInfo.discountPrice && bestPriceInfo.discountPrice < bestPriceInfo.price && (
                 <del className="p__price--before">{bestPriceInfo.price.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</del>
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
