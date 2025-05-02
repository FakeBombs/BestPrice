
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface SidebarProps {
  vendors: string[];
  selectedVendors: string[];
  priceRange: {min: number, max: number};
  inStockOnly: boolean;
  onVendorChange: (vendors: string[]) => void;
  onPriceChange: (min: number, max: number) => void;
  onInStockChange: (inStock: boolean) => void;
}

const Sidebar = ({ 
  vendors = [], 
  selectedVendors = [], 
  priceRange = {min: 0, max: 10000},
  inStockOnly = false,
  onVendorChange,
  onPriceChange,
  onInStockChange
}: SidebarProps) => {
  const [currentPriceRange, setCurrentPriceRange] = useState([priceRange.min, priceRange.max]);
  const [localVendors, setLocalVendors] = useState<string[]>(selectedVendors);
  const [localInStock, setLocalInStock] = useState(inStockOnly);
  
  // When vendors change from props, update local state
  useEffect(() => {
    setLocalVendors(selectedVendors);
  }, [selectedVendors]);
  
  // When price range changes from props, update local state
  useEffect(() => {
    setCurrentPriceRange([priceRange.min, priceRange.max]);
  }, [priceRange]);
  
  // When in-stock status changes from props, update local state
  useEffect(() => {
    setLocalInStock(inStockOnly);
  }, [inStockOnly]);
  
  // Handle vendor checkbox change
  const handleVendorChange = (vendor: string, checked: boolean) => {
    const newVendors = checked 
      ? [...localVendors, vendor]
      : localVendors.filter(v => v !== vendor);
      
    setLocalVendors(newVendors);
    onVendorChange(newVendors);
  };
  
  // Handle price range slider change
  const handlePriceChange = (values: number[]) => {
    setCurrentPriceRange(values);
    onPriceChange(values[0], values[1]);
  };
  
  // Handle in-stock checkbox change
  const handleInStockChange = (checked: boolean) => {
    setLocalInStock(checked);
    onInStockChange(checked);
  };

  return (
    <div className="space-y-6">
      {/* In Stock Filter */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Availability</h3>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="in-stock" 
              checked={localInStock}
              onCheckedChange={(checked) => handleInStockChange(checked as boolean)}
            />
            <Label htmlFor="in-stock">In Stock Only</Label>
          </div>
        </CardContent>
      </Card>
      
      {/* Price Range Filter */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Price Range</h3>
          <Slider 
            defaultValue={[priceRange.min, priceRange.max]}
            max={priceRange.max}
            min={priceRange.min}
            step={1}
            value={currentPriceRange}
            onValueChange={handlePriceChange}
            className="mb-4"
          />
          <div className="flex justify-between text-sm">
            <div>€{currentPriceRange[0]}</div>
            <div>€{currentPriceRange[1]}</div>
          </div>
        </CardContent>
      </Card>
      
      {/* Vendor Filter */}
      {vendors.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Vendors</h3>
            <div className="space-y-2">
              {vendors.map(vendor => (
                <div key={vendor} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`vendor-${vendor}`}
                    checked={localVendors.includes(vendor)}
                    onCheckedChange={(checked) => handleVendorChange(vendor, checked as boolean)}
                  />
                  <Label htmlFor={`vendor-${vendor}`}>{vendor}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Sidebar;
