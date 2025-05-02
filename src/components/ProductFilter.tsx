
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  onInStockOnly
}: ProductFilterProps) => {
  const [isInStockOnly, setIsInStockOnly] = React.useState(false);

  const handleSortChange = (value: string) => {
    onSortChange(value);
  };

  const handleInStockToggle = () => {
    const newValue = !isInStockOnly;
    setIsInStockOnly(newValue);
    onInStockOnly(newValue);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Ταξινόμηση:</span>
        <Select defaultValue="relevance" onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Relevance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Δημοφιλέστερα</SelectItem>
            <SelectItem value="price_asc">Φθηνότερα</SelectItem>
            <SelectItem value="price_desc">Ακριβότερα</SelectItem>
            <SelectItem value="rating">Καλύτερη βαθμολογία</SelectItem>
            <SelectItem value="stores">Πλήθος καταστημάτων</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={isInStockOnly ? "default" : "outline"}
          size="sm"
          onClick={handleInStockToggle}
          className="flex items-center gap-1"
        >
          <CheckCircle className="h-4 w-4" />
          Άμεσα διαθέσιμα
        </Button>

        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <SortDesc className="h-4 w-4" />
          Φίλτρα
        </Button>
      </div>
    </div>
  );
};

export default ProductFilter;
