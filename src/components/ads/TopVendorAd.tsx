
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TopVendorAdProps {
  productId: string;
}

export default function TopVendorAd({ productId }: TopVendorAdProps) {
  // In a real app, we would fetch the ad based on the productId
  // For now, let's create a mock ad
  
  // Randomly decide whether to show an ad or not (70% chance)
  const showAd = Math.random() < 0.7;
  
  if (!showAd) {
    return null; // Don't show an ad
  }
  
  const handleAdClick = () => {
    // In a real app, we would track this click
    toast({
      title: "Sponsored Link",
      description: "You clicked on a sponsored vendor link"
    });
  };
  
  return (
    <Card className="border-2 border-primary/20 mb-4 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="https://placehold.co/50x50?text=BT" 
              alt="BestTech" 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium">BestTech Store</h4>
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                  Sponsored
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Special price: $899.99 with free shipping</p>
            </div>
          </div>
          
          <Button size="sm" onClick={handleAdClick}>
            View Offer
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
