import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { Product, ProductPrice } from '@/data/productData';
import { categories as allCategories } from '@/data/categoriesData';
import { getBestPrice } from '@/data/helpers';

interface ProductCardProps {
  product: Product;
  className?: string;
  activeVendorFilterDomain?: string | null;
}

// --- Currency/Locale Formatting ---
// Define mappings from language code to locale and currency
// Adjust these based on the languages and currencies you support
const localeCurrencyMap: Record<string, { locale: string; currency: string }> = {
  el: { locale: 'el-GR', currency: 'EUR' },
  en: { locale: 'en-GB', currency: 'GBP' }, // Example: British English, Pound
  de: { locale: 'de-DE', currency: 'EUR' }, // Example: German, Euro
  es: { locale: 'es-ES', currency: 'EUR' }, // Example: Spanish, Euro
  fr: { locale: 'fr-FR', currency: 'EUR' }, // Example: French, Euro
  // Add more mappings as needed
};
const defaultLocale = 'el-GR'; // Fallback locale
const defaultCurrency = 'EUR';  // Fallback currency
// --- End Currency/Locale Formatting ---

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "p p--row p--force-ratio",
  activeVendorFilterDomain
}: ProductCardProps) => {

  const { t, language } = useTranslation(); // Get t function and current language

  // --- Determine Locale and Currency ---
  const currentLocale = localeCurrencyMap[language]?.locale || defaultLocale;
  const currentCurrency = localeCurrencyMap[language]?.currency || defaultCurrency;

  // Helper function for formatting currency
  const formatCurrency = (value: number) => {
    try {
      // Basic options, you can add minimumFractionDigits etc. if needed
      const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: currentCurrency
      };
      return value.toLocaleString(currentLocale, options);
    } catch (e) {
      console.error(`Error formatting currency for locale ${currentLocale}, currency ${currentCurrency}:`, e);
      // Fallback to default formatting on error
      return value.toLocaleString(defaultLocale, { style: 'currency', currency: defaultCurrency });
    }
  };
  // --- End Currency Helpers ---

  // --- Calculations ---
  const bestPriceInfo = getBestPrice(product); // Assuming getBestPrice is correct
  const productSlug = product.slug || product.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  const ratingPercentage = product.rating ? ((product.rating / 5) * 100).toFixed(2) : '0';
  const vendorCount = product.prices.filter(p => p.inStock).length;

  // --- Category Lookup & Translation ---
  // Find the category object using the first ID
  const firstCategoryId = product.categoryIds?.[0];
  const categoryData = useMemo(() => {
      if (!firstCategoryId) return null;
      // Create a map for faster lookups if categories list is large, otherwise find is fine
      // const categoryMap = new Map(allCategories.map(c => [c.id, c]));
      // return categoryMap.get(firstCategoryId);
      return allCategories.find(c => c.id === firstCategoryId);
  }, [firstCategoryId]);

  // Translate the category name using its slug as the key
  const categoryName = categoryData
    ? t(categoryData.slug, categoryData.name) // Use slug as key, name as fallback
    : t('category_unknown', 'Uncategorized'); // Use a generic fallback key

  // --- Construct Target URL (no changes needed here) ---
  const baseProductUrl = `/item/${product.id}/${productSlug}`;
  const targetUrl = activeVendorFilterDomain
    ? `${baseProductUrl}?filter=store:${activeVendorFilterDomain}`
    : baseProductUrl;

  return (
    <div className={className}>
      <Link to={targetUrl} className="p__cover" title={product.title}> {/* Added title here */}
        <picture>
          <img src={product.image || '/dist/images/placeholder.png'} alt={product.title} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = '/dist/images/placeholder.png'; }}/>
        </picture>
      </Link>
      <div className="p__main">
        <div className="p__meta">
          <div className="p__category">{categoryName}</div> {/* Translated category */}
          <h3 className="p__title p__title--lines p__title--lines-2">
            <Link to={targetUrl} title={product.title}>{product.title}</Link>
          </h3>
        </div>
      </div>
      {/* Use 'bestPriceInfo &&' to ensure footer only renders if price info exists */}
      {bestPriceInfo && (
        <div className="p__footer">
          {product.rating !== undefined && product.reviews !== undefined && product.reviews >= 0 && ( // Check reviews >= 0
            <div className="p__rating popup-anchor" data-breakdown="">
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
            <Link className="p__price" to={targetUrl} title={product.title}> {/* Added title */}
              <div className="p__price--current">
                 {/* Use dynamic currency formatting */}
                 {formatCurrency(bestPriceInfo.price)}
              </div>
              {/* Check discountPrice exists AND is less than price */}
              {bestPriceInfo.discountPrice !== undefined && bestPriceInfo.discountPrice < bestPriceInfo.price && (
                 <del className="p__price--before">
                    {/* Use dynamic currency formatting */}
                    {formatCurrency(bestPriceInfo.price)}
                 </del>
               )}
            </Link>
          </div>
          {/* Use translated store count with pluralization */}
          <div className="p__merchants">
            {t('stores_count_label', { count: vendorCount })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
