import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Timer, Check, ExternalLink, DollarSign, MousePointer } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface PtcAd {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  targetUrl: string; 
  reward: number;
  waitTime: number; // in seconds
  viewed: boolean;
  viewedAt?: Date;
}

const mockPtcAds: PtcAd[] = [
  {
    id: 'ptc1',
    title: 'Check out the latest MacBook Pro',
    description: 'Revolutionary technology with the new M2 chip',
    imageUrl: 'https://placehold.co/600x400?text=MacBook+Pro',
    targetUrl: '/item/p5/apple-macbook-pro-m2.html',
    reward: 0.05,
    waitTime: 10,
    viewed: false
  },
  {
    id: 'ptc2',
    title: 'Visit Amazing Electronics Store',
    description: 'Great deals on all your favorite tech',
    imageUrl: 'https://placehold.co/600x400?text=Electronics+Store',
    targetUrl: 'https://example.com/store',
    reward: 0.10,
    waitTime: 20,
    viewed: false
  },
  {
    id: 'ptc3',
    title: 'New Samsung Galaxy S23',
    description: 'The most advanced Galaxy yet',
    imageUrl: 'https://placehold.co/600x400?text=Galaxy+S23',
    targetUrl: '/search?q=samsung+galaxy+s23',
    reward: 0.07,
    waitTime: 15,
    viewed: true,
    viewedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  }
];

export function PtcAdsPanel() {
  const { user } = useAuth();
  const [ptcAds, setPtcAds] = useState<PtcAd[]>(mockPtcAds);
  const [viewing, setViewing] = useState<{id: string, progress: number} | null>(null);
  const [totalEarned, setTotalEarned] = useState<number>(0.22); // mock value
  
  if (!user) return null;
  
  const handleViewAd = (adId: string) => {
    const ad = ptcAds.find(a => a.id === adId);
    if (!ad || viewing) return;
    
    setViewing({ id: adId, progress: 0 });
    
    // Start the progress timer
    const interval = setInterval(() => {
      setViewing(prev => {
        if (!prev) return null;
        
        const newProgress = prev.progress + (100 / ad.waitTime);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Mark the ad as viewed and reward the user
          setPtcAds(ads => ads.map(a => 
            a.id === adId ? { ...a, viewed: true, viewedAt: new Date() } : a
          ));
          
          setTotalEarned(prev => prev + ad.reward);
          
          toast({
            title: "Reward earned!",
            description: `You've earned $${ad.reward.toFixed(2)} for viewing this ad.`
          });
          
          return null;
        }
        
        return { ...prev, progress: newProgress };
      });
    }, 1000);
    
    return () => clearInterval(interval);
  };
  
  const getAdStatus = (ad: PtcAd) => {
    if (viewing?.id === ad.id) {
      return (
        <div className="w-full">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span>Earning reward...</span>
            <span>{Math.round(viewing.progress)}%</span>
          </div>
          <Progress value={viewing.progress} className="h-2" />
        </div>
      );
    }
    
    if (ad.viewed) {
      return (
        <div className="flex items-center text-green-600">
          <Check className="h-4 w-4 mr-1" />
          <span className="text-sm">Viewed</span>
        </div>
      );
    }
    
    return (
      <Button 
        variant="default" 
        size="sm"
        className="w-full"
        onClick={() => handleViewAd(ad.id)}
        disabled={!!viewing}
      >
        <MousePointer className="h-4 w-4 mr-2" />
        View & Earn
      </Button>
    );
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-muted/40">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total PTC Earnings</p>
              <h3 className="text-2xl font-bold">${totalEarned.toFixed(2)}</h3>
            </div>
            <DollarSign className="h-8 w-8 text-primary opacity-80" />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Available PTC Ads</h3>
        
        {ptcAds.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No PTC ads available right now</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {ptcAds.map(ad => (
              <Card key={ad.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {ad.imageUrl && (
                      <div className="sm:w-1/3 lg:w-1/4">
                        <img 
                          src={ad.imageUrl} 
                          alt={ad.title} 
                          className="w-full h-40 sm:h-32 object-cover rounded-md"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{ad.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{ad.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                        <div className="flex items-center text-primary">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span className="font-medium">${ad.reward.toFixed(2)} reward</span>
                        </div>
                        
                        <div className="flex items-center text-muted-foreground">
                          <Timer className="h-4 w-4 mr-1" />
                          <span>{ad.waitTime} seconds</span>
                        </div>
                      </div>
                      
                      {getAdStatus(ad)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-2 bg-muted p-4 rounded-md">
        <h3 className="font-medium">How PTC Ads Work</h3>
        <p className="text-sm text-muted-foreground">
          View ads for a specified duration to earn rewards. Once the timer completes, 
          you'll receive a reward in your wallet. Create your own PTC ads in the "Create Ad" section.
        </p>
      </div>
    </div>
  );
}
