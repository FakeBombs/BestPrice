import React from 'react';
import { useParams } from 'react-router-dom';
import { products } from '@/data/mockData'; // Adjust the path according to your data structure
import ProductCard from '@/components/ProductCard'; // Assuming you have a ProductCard component to render products

const BrandPage = () => {
    const { brandId, brandName } = useParams(); // Get both brandId and brandName from the URL
    // Optional: Normalize the brandName for comparison (e.g., lowercase)
    const normBrandName = brandName?.toLowerCase();

    // Filter products by brand name (case insensitive)
    const filteredProducts = products.filter(product => 
        product.brand.toLowerCase() === normBrandName
    );

    return (
        <div className="brand-page">
            <h1>Products for {brandName}</h1>
            {filteredProducts.length > 0 ? (
                <div className="product-list">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div>No products available for this brand.</div>
            )}
        </div>
    );
};

export default BrandPage;
