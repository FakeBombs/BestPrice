
import React from 'react';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';
import { Product } from '@/data/mockData';

interface ProductResultsProps {
  filteredResults: Product[];
  onSortChange: (value: string) => void;
  onVendorFilter: (vendors: string[]) => void;
  onPriceRangeFilter: (min: number, max: number) => void;
  onInStockOnly: (inStockOnly: boolean) => void;
}

const ProductResults = ({
  filteredResults,
  onSortChange,
  onVendorFilter,
  onPriceRangeFilter,
  onInStockOnly
}: ProductResultsProps) => {
  return (
    <div className="p__products" data-pagination="">
      <ProductFilter 
        onSortChange={onSortChange} 
        onVendorFilter={onVendorFilter} 
        onPriceRangeFilter={onPriceRangeFilter} 
        onInStockOnly={onInStockOnly} 
      />
      
      {filteredResults.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No products found matching your search.</p>
        </div>
      ) : (
        filteredResults.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
};

export default ProductResults;
