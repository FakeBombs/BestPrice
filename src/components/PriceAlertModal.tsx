
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Product } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  currentPrice?: number;
  categoryName?: string;
  categoryId?: string;
}

const PriceAlertModal = ({ isOpen, onClose, product, currentPrice, categoryName, categoryId }: PriceAlertModalProps) => {
  const { toast } = useToast();
  const [isPercentage, setIsPercentage] = useState(!!categoryName);
  const [targetPrice, setTargetPrice] = useState(product && currentPrice ? Math.floor(currentPrice * 0.9) : 0);
  const [percentageDiscount, setPercentageDiscount] = useState(15);
  const productTitle = product ? (product.title || product.name) : categoryName;
  
  const handleSetAlert = () => {
    if (categoryId && categoryName) {
      toast({
        title: "Category Price Alert Set",
        description: `You'll be notified when products in ${categoryName} drop by ${percentageDiscount}%`,
      });
    } else if (product && currentPrice) {
      toast({
        title: "Price Alert Set",
        description: `We'll notify you when ${productTitle} drops below $${targetPrice}`,
      });
    }
    onClose();
  };

  const handlePercentageChange = (value: number) => {
    setPercentageDiscount(value);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Price Alert</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <Label className="text-base">
              {categoryId ? "Category" : "Product"}
            </Label>
            <p className="text-sm text-muted-foreground mt-1">{productTitle}</p>
          </div>
          
          {categoryId ? (
            <div className="space-y-4">
              <Label htmlFor="percentage-discount">Alert me when products drop by (%)</Label>
              <div>
                <div className="flex justify-between mb-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPercentageDiscount(15)} 
                    className={percentageDiscount === 15 ? "bg-primary text-primary-foreground" : ""}
                  >
                    15%
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPercentageDiscount(20)} 
                    className={percentageDiscount === 20 ? "bg-primary text-primary-foreground" : ""}
                  >
                    20%
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPercentageDiscount(30)} 
                    className={percentageDiscount === 30 ? "bg-primary text-primary-foreground" : ""}
                  >
                    30%
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPercentageDiscount(40)} 
                    className={percentageDiscount === 40 ? "bg-primary text-primary-foreground" : ""}
                  >
                    40%
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPercentageDiscount(50)} 
                    className={percentageDiscount === 50 ? "bg-primary text-primary-foreground" : ""}
                  >
                    50%
                  </Button>
                </div>
                <div className="flex items-center space-x-3">
                  <Input 
                    id="percentage-discount"
                    type="number" 
                    value={percentageDiscount}
                    onChange={(e) => setPercentageDiscount(Number(e.target.value))}
                    min={1}
                    max={90}
                    step={1}
                  />
                  <span>%</span>
                </div>
                <Slider 
                  value={[percentageDiscount]} 
                  min={5} 
                  max={90}
                  step={1}
                  onValueChange={(value) => setPercentageDiscount(value[0])}
                  className="mt-6"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>5%</span>
                  <span>90%</span>
                </div>
              </div>
            </div>
          ) : product && currentPrice ? (
            <>
              <div className="mb-6">
                <Label className="text-base">Current Price</Label>
                <p className="text-xl font-bold text-primary mt-1">${currentPrice.toFixed(2)}</p>
              </div>
              
              <div className="space-y-4">
                <Label htmlFor="target-price">Alert me when price drops below</Label>
                <div className="flex items-center space-x-3">
                  <span>$</span>
                  <Input 
                    id="target-price"
                    type="number" 
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    min={1}
                    max={currentPrice}
                    step={1}
                  />
                </div>
                <Slider 
                  value={[targetPrice]} 
                  min={Math.floor(currentPrice * 0.5)} 
                  max={currentPrice}
                  step={1}
                  onValueChange={(value) => setTargetPrice(value[0])}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${Math.floor(currentPrice * 0.5)}</span>
                  <span>${currentPrice}</span>
                </div>
              </div>
            </>
          ) : null}
          
          <p className="text-sm text-muted-foreground mt-6">
            You'll receive a notification when {categoryId ? `products in this category drop by ${percentageDiscount}%` : "the price drops to or below your target price"}.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSetAlert}>Set Alert</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriceAlertModal;
