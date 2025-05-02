
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/services/productService';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="p__products" data-pagination="">
      {products.length > 0 ? (
        products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>No products available for this category</p>
      )}
    </div>
  );
};

export default ProductGrid;
