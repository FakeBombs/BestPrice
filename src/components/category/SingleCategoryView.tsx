
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductsByCategory, formatSlug } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface SingleCategoryViewProps {
  category: any;
  onSortChange: (value: string) => void;
  onVendorFilter: (vendors: number[]) => void;
  onPriceRangeFilter: (min: number, max: number) => void;
  onInStockOnly: (inStockOnly: boolean) => void;
}

const SingleCategoryView = ({
  category,
  onSortChange,
  onVendorFilter,
  onPriceRangeFilter,
  onInStockOnly
}: SingleCategoryViewProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [inStock, setInStock] = useState(false);

  useEffect(() => {
    if (category) {
      setLoading(true);
      const categoryProducts = getProductsByCategory(String(category.id));
      setProducts(categoryProducts);
      setLoading(false);
    }
  }, [category]);

  const handleSortChange = (value: string) => {
    onSortChange(value);
  };

  const handlePriceRangeChange = (values: number[]) => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
    onPriceRangeFilter(values[0], values[1]);
  };

  const handleInStockChange = (checked: boolean) => {
    setInStock(checked);
    onInStockOnly(checked);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar filters */}
        <div className="w-full md:w-1/4 space-y-6">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-4">Filters</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Sort By</h4>
                <Select onValueChange={handleSortChange} defaultValue="relevance">
                  <SelectTrigger>
                    <SelectValue placeholder="Select sorting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Customer Rating</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Price Range</h4>
                <div className="px-2">
                  <Slider
                    defaultValue={[minPrice, maxPrice]}
                    max={1000}
                    step={10}
                    onValueChange={handlePriceRangeChange}
                    className="my-6"
                  />
                  <div className="flex justify-between text-sm">
                    <span>${minPrice}</span>
                    <span>${maxPrice}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Availability</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="in-stock" 
                    checked={inStock} 
                    onCheckedChange={(checked) => handleInStockChange(!!checked)}
                  />
                  <Label htmlFor="in-stock">In Stock Only</Label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content - Product grid */}
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-lg border p-4">
            <h1 className="text-2xl font-bold mb-6">{category.name}</h1>
            <p className="text-gray-600 mb-6">{category.description}</p>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">No products found in this category.</p>
                <Button className="mt-4" asChild>
                  <Link to="/categories">Browse All Categories</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCategoryView;
