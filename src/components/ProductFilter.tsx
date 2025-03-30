
import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { vendors } from '@/data/mockData';
import { Checkbox } from '@/components/ui/checkbox';

interface ProductFilterProps {
  onSortChange: (value: string) => void;
  onVendorFilter: (vendors: string[]) => void;
  onPriceRangeFilter: (min: number, max: number) => void;
  onInStockOnly: (inStockOnly: boolean) => void;
}

const ProductFilter = ({
  onSortChange,
  onVendorFilter,
  onPriceRangeFilter,
  onInStockOnly,
}: ProductFilterProps) => {
  const [sort, setSort] = useState('price-asc');
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  
  const handleSortChange = (value: string) => {
    setSort(value);
    onSortChange(value);
  };
  
  const handleVendorChange = (vendorId: string) => {
    const updatedVendors = selectedVendors.includes(vendorId)
      ? selectedVendors.filter(id => id !== vendorId)
      : [...selectedVendors, vendorId];
    
    setSelectedVendors(updatedVendors);
    onVendorFilter(updatedVendors);
  };
  
  const handleInStockChange = (checked: boolean) => {
    setInStockOnly(checked);
    onInStockOnly(checked);
  };
  
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Sort
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuRadioGroup value={sort} onValueChange={handleSortChange}>
            <DropdownMenuRadioItem value="price-asc">Price: Low to High</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="price-desc">Price: High to Low</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="rating-desc">Best Rating</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="reviews-desc">Most Reviews</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Vendors
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-2">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="flex items-center space-x-2 p-2">
              <Checkbox
                id={`vendor-${vendor.id}`}
                checked={selectedVendors.includes(vendor.id)}
                onCheckedChange={() => handleVendorChange(vendor.id)}
              />
              <label
                htmlFor={`vendor-${vendor.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {vendor.name}
              </label>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="in-stock"
          checked={inStockOnly}
          onCheckedChange={(checked) => 
            handleInStockChange(checked as boolean)
          }
        />
        <label
          htmlFor="in-stock"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          In Stock Only
        </label>
      </div>
    </div>
  );
};

export default ProductFilter;
