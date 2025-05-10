import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Product, ProductPrice } from '@/data/productData';

interface InlineProductItemProps {
    product: Product;
    bpref?: string; // Optional tracking parameter
    activeVendorFilterDomain?: string | null; // <-- New prop for vendor filter
}

export const InlineProductItem: React.FC<InlineProductItemProps> = ({
    product,
    bpref,
    activeVendorFilterDomain // <-- Destructure the new prop
}) => {
    // Find the best price (you might already have a function for this)
    const bestPriceInfo = useMemo(() => {
        if (!product || !product.prices || product.prices.length === 0) return null;
        const inStockPrices = product.prices.filter(price => price.inStock);
        if (inStockPrices.length === 0) return null; // Only show in-stock for slider? Or show lowest out-of-stock? Decide here.
        // Find the price object with the lowest price (considering discount)
        return inStockPrices.reduce((best, current) => {
             const bestEffectivePrice = best.discountPrice ?? best.price;
             const currentEffectivePrice = current.discountPrice ?? current.price;
             return currentEffectivePrice < bestEffectivePrice ? current : best;
        }, inStockPrices[0]);
    }, [product]);

    // Placeholder for price drop calculation - THIS NEEDS REAL LOGIC
    const calculatePriceDrop = () => {
        if (bestPriceInfo?.discountPrice && bestPriceInfo.price > bestPriceInfo.discountPrice) {
            const dropPercentage = Math.round(((bestPriceInfo.price - bestPriceInfo.discountPrice) / bestPriceInfo.price) * 100);
            const dropClass = dropPercentage >= 40 ? 'drop--40' : dropPercentage >= 30 ? 'drop--30' : dropPercentage >= 10 ? 'drop--10' : '';
            if (dropPercentage >= 10) {
                 return { percentage: dropPercentage, className: `drop ${dropClass}` };
            }
        }
        return null;
    };

    const priceDrop = calculatePriceDrop();
    // Use the effective price (discount or regular) from the bestPriceInfo object
    const displayPrice = bestPriceInfo?.discountPrice ?? bestPriceInfo?.price;

    if (!bestPriceInfo || displayPrice === undefined) {
        return null; // Don't render if no valid price info
    }

    const formatPrice = (price: number) => {
        return price.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' });
    };

    // --- Construct Target URL ---
    const productSlug = product.slug || product.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || 'product';
    const baseProductUrl = `/item/${product.id}/${productSlug}.html`; // Assuming .html extension based on previous examples

    // Build query parameters string
    const queryParams = new URLSearchParams();
    if (bpref) {
        queryParams.set('bpref', bpref);
    }
    if (activeVendorFilterDomain) {
        queryParams.set('filter', `store:${activeVendorFilterDomain}`);
    }

    const queryString = queryParams.toString();
    const targetUrl = queryString ? `${baseProductUrl}?${queryString}` : baseProductUrl;
    // --- End Construct Target URL ---

    return (
        <Link
            data-id={product.id}
            data-cid={product.categoryIds?.[0]} // Use optional chaining
            data-price={Math.round(displayPrice * 100)}
            className={`pi ${priceDrop ? 'pi--deal' : ''}`}
            to={targetUrl} // Use the dynamically constructed URL
        >
            <div className="pi__image">
                <img width={70} height={70} alt={product.title} src={product.image || '/dist/images/placeholder.png'} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = '/dist/images/placeholder.png'; }}/>
            </div>
            <div className="pi__meta">
                <h3 className="pi__title">{product.title}</h3>
                <div className="pi__price">
                    <div className="pi__price--current">{formatPrice(displayPrice)}</div>
                    {priceDrop && (
                        <div className="pi__drop">
                            <strong className={priceDrop.className}>-{priceDrop.percentage}%</strong> πτώση
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default InlineProductItem;
