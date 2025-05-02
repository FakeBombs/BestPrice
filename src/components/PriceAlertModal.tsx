
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
  product: Product;
  currentPrice: number;
}

const PriceAlertModal = ({ isOpen, onClose, product, currentPrice }: PriceAlertModalProps) => {
  const { toast } = useToast();
  const [targetPrice, setTargetPrice] = useState(Math.floor(currentPrice * 0.9));
  
  const handleSetAlert = () => {
    toast({
      title: "Price Alert Set",
      description: `We'll notify you when ${product.title} drops below $${targetPrice}`,
    });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Price Alert</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <Label className="text-base">Product</Label>
            <p className="text-sm text-muted-foreground mt-1">{product.title}</p>
          </div>
          
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
            <p className="text-sm text-muted-foreground">
              You'll receive a notification when the price drops to or below your target price.
            </p>
          </div>
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
