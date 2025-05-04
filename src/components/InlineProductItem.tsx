import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Product, ProductPrice } from '@/data/mockData';

interface InlineProductItemProps {
    product: Product;
    bpref?: string; // Optional tracking parameter
}

export const InlineProductItem: React.FC<InlineProductItemProps> = ({ product, bpref }) => {
    // Find the best price (you might already have a function for this)
    const bestPriceInfo = useMemo(() => {
        if (!product || !product.prices || product.prices.length === 0) return null;
        const inStockPrices = product.prices.filter(price => price.inStock);
        if (inStockPrices.length === 0) return null; // Only show in-stock for slider? Or show lowest out-of-stock? Decide here.
        return inStockPrices.reduce((best, current) => (current.price < best.price) ? current : best, inStockPrices[0]);
    }, [product]);

    // Placeholder for price drop calculation - THIS NEEDS REAL LOGIC
    const calculatePriceDrop = () => {
        // Example: Check if discountPrice exists
        if (bestPriceInfo?.discountPrice && bestPriceInfo.price > bestPriceInfo.discountPrice) {
            const dropPercentage = Math.round(((bestPriceInfo.price - bestPriceInfo.discountPrice) / bestPriceInfo.price) * 100);
            // Simple class logic, adjust as needed
            const dropClass = dropPercentage >= 40 ? 'drop--40' : dropPercentage >= 30 ? 'drop--30' : dropPercentage >= 10 ? 'drop--10' : '';
            if (dropPercentage >= 10) {
                 return { percentage: dropPercentage, className: `drop ${dropClass}` };
            }
        }
        // Add more complex logic here if you track historical prices
        return null;
    };

    const priceDrop = calculatePriceDrop();
    const displayPrice = bestPriceInfo?.discountPrice || bestPriceInfo?.price;

    if (!bestPriceInfo || displayPrice === undefined) {
        return null; // Don't render if no price info
    }

    const formatPrice = (price: number) => {
        // Simple formatter, adjust for your currency/locale needs
        return price.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' });
    };

    return (
        <Link
            data-id={product.id}
            data-cid={product.categoryIds[0]} // Assuming first category ID is relevant
            data-price={Math.round(displayPrice * 100)} // Price in cents? Adjust if needed
            className={`pi ${priceDrop ? 'pi--deal' : ''}`} // Add pi--deal class if there's a drop
            to={`/item/${product.id}/${product.slug || product.title.toLowerCase().replace(/\s+/g, '-')}.html?bpref=${bpref || 'cat-slider'}`}
        >
            <div className="pi__image">
                <img width={70} height={70} alt={product.title} src={product.image} loading="lazy" />
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
