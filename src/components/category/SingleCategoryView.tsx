
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CategoryBreadcrumb from "@/components/category/CategoryBreadcrumb";
import ProductCard from "@/components/ProductCard";
import { useTranslation } from "@/hooks/useTranslation";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export interface SingleCategoryViewProps {
  category: any;
  onSortChange: (value: string) => void;
  onVendorFilter: (vendors: number[]) => void;
  onPriceRangeFilter: (min: number, max: number) => void;
  onInStockOnly: (inStockOnly: boolean) => void;
}

const SingleCategoryView: React.FC<SingleCategoryViewProps> = ({ 
  category,
  onSortChange,
  onVendorFilter,
  onPriceRangeFilter,
  onInStockOnly
}) => {
  const { t } = useTranslation();
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // In a real implementation, these would be loaded dynamically
  const products = [];
  const vendors = [
    { id: 1, name: "Vendor 1" },
    { id: 2, name: "Vendor 2" },
    { id: 3, name: "Vendor 3" }
  ];

  // Handle filter checkbox changes
  const handleVendorFilterChange = (vendorId: number) => {
    // In a real implementation, you would update a state with selected vendors
    // and then call the parent's onVendorFilter method
    onVendorFilter([vendorId]);
  };

  // Handle price range change
  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values);
    onPriceRangeFilter(values[0], values[1]);
  };

  // Handle in-stock only toggle
  const handleInStockChange = (checked: boolean) => {
    setInStockOnly(checked);
    onInStockOnly(checked);
  };

  return (
    <div>
      <CategoryBreadcrumb category={category} />
      
      <h1 className="text-2xl font-bold mb-6">{category.name}</h1>
      <p className="text-gray-600 mb-6">{category.description}</p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters - Mobile toggle */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full"
          >
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Filters - Sidebar */}
        <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block md:w-1/4`}>
          <div className="border rounded-lg p-4 space-y-6">
            <div>
              <h3 className="font-medium mb-2">Price Range</h3>
              <Slider 
                defaultValue={[priceRange[0], priceRange[1]]} 
                max={1000} 
                step={10}
                onValueChange={handlePriceRangeChange}
                className="my-4"
              />
              <div className="flex justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Vendors</h3>
              <div className="space-y-2">
                {vendors.map(vendor => (
                  <div key={vendor.id} className="flex items-center space-x-2">
                    <Checkbox id={`vendor-${vendor.id}`} onCheckedChange={(checked) => {
                      if (checked) handleVendorFilterChange(vendor.id);
                    }} />
                    <label htmlFor={`vendor-${vendor.id}`} className="text-sm">
                      {vendor.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="in-stock"
                  checked={inStockOnly}
                  onCheckedChange={(checked) => handleInStockChange(checked as boolean)}
                />
                <label htmlFor="in-stock" className="text-sm">
                  In Stock Only
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="md:w-3/4">
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {products.length} products
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Sort by:</span>
              <Select defaultValue="popular" onValueChange={onSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Popular" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded">
              <p>No products found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleCategoryView;
