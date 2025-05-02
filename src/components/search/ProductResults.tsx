
import React from 'react';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/services/productService';

export interface ProductResultsProps {
  products: Product[];
  onSortChange: (value: string) => void;
  onVendorFilter: (vendors: string[]) => void;
  onPriceRangeFilter: (min: number, max: number) => void;
  onInStockOnly: (inStockOnly: boolean) => void;
}

const ProductResults: React.FC<ProductResultsProps> = ({ 
  products,
  onSortChange, 
  onVendorFilter, 
  onPriceRangeFilter, 
  onInStockOnly
}) => {
  return (
    <div className="page-products__main-wrapper">
      <ProductGrid products={products} />
    </div>
  );
};

export default ProductResults;
