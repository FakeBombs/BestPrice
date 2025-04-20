import React from 'react';
import { useParams } from 'react-router-dom';
import { products } from '@/data/mockData'; // Adjust the path according to your data structure
import ProductCard from '@/components/ProductCard'; // Assuming you have a ProductCard component to render products

const BrandPage = () => {
    const { brandId } = useParams(); // Get the brandId from the URL
    const brandIdNumber = parseInt(brandId, 10); // Convert to number if needed 

    // Filter products by brandId
    const filteredProducts = products.filter(product => product.brandId === brandIdNumber);

    return (
        <div className="brand-page">
            <h1>Products for Brand ID: {brandId}</h1>
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
