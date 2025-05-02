
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDownAZ, ArrowUpAZ, ArrowDownUp } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/services/productService';

interface ProductResultsProps {
  products: Product[];
  onSort: (value: string) => void;
}

const ProductResults = ({ products, onSort }: ProductResultsProps) => {
  const [sortOption, setSortOption] = useState('default');
  
  const handleSortChange = (value: string) => {
    setSortOption(value);
    onSort(value);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{products.length}</span> results
          </p>
        </div>
        
        <Select value={sortOption} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">
              <div className="flex items-center">
                <ArrowDownUp className="mr-2 h-4 w-4" />
                <span>Default</span>
              </div>
            </SelectItem>
            <SelectItem value="price-asc">
              <div className="flex items-center">
                <ArrowUpAZ className="mr-2 h-4 w-4" />
                <span>Price: Low to High</span>
              </div>
            </SelectItem>
            <SelectItem value="price-desc">
              <div className="flex items-center">
                <ArrowDownAZ className="mr-2 h-4 w-4" />
                <span>Price: High to Low</span>
              </div>
            </SelectItem>
            <SelectItem value="rating">
              <div className="flex items-center">
                <ArrowDownAZ className="mr-2 h-4 w-4" />
                <span>Highest Rated</span>
              </div>
            </SelectItem>
            <SelectItem value="popularity">
              <div className="flex items-center">
                <ArrowDownAZ className="mr-2 h-4 w-4" />
                <span>Most Popular</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Product grid */}
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-lg text-gray-500">No products found</p>
          <p className="text-sm text-gray-400">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default ProductResults;
