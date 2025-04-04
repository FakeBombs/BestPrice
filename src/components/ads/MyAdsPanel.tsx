
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Advertisement } from './AdManager';
import { useAuth } from "@/hooks/useAuth";
import { Play, Pause, Eye, MousePointer, LineChart, BarChart3, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

// Mock ads for demonstration
const mockAds: Advertisement[] = [
  {
    id: 'ad1',
    title: 'iPhone 14 Pro Max - Top Deal',
    description: 'Best price on the latest iPhone',
    targetUrl: '',
    type: 'product',
    status: 'active',
    budget: 10,
    spent: 3.45,
    impressions: 245,
    clicks: 17,
    createdAt: new Date(2025, 3, 1),
    ownerId: 'user1',
    placement: 'top-vendors',
    targetId: 'p1'
  },
  {
    id: 'ad2',
    title: 'Visit Our Electronics Store',
    description: 'Find all the latest gadgets at amazing prices',
    targetUrl: 'https://example.com/store',
    type: 'external',
    status: 'pending',
    budget: 15,
    spent: 0,
    impressions: 0,
    clicks: 0,
    createdAt: new Date(2025, 3, 2),
    ownerId: 'user1',
    placement: 'ptc'
  },
  {
    id: 'ad3',
    title: 'Dell Laptop Sale',
    description: 'Big discounts on all Dell laptops',
    targetUrl: '',
    type: 'brand',
    status: 'active',
    budget: 8,
    spent: 5.67,
    impressions: 543,
    clicks: 32,
    createdAt: new Date(2025, 3, 1),
    ownerId: 'user1',
    placement: 'featured-product',
    targetId: 'b5'
  },
  {
    id: 'ad4',
    targetUrl: 'https://example.com/rejected-site',
    title: 'Discount Electronics',
    description: 'Too good to be true deals',
    type: 'external',
    status: 'rejected',
    budget: 20,
    spent: 0,
    impressions: 0,
    clicks: 0,
    createdAt: new Date(2025, 2, 28),
    ownerId: 'user1',
    placement: 'ptc',
    rejectionReason: 'Link contains potential scam or misleading content'
  }
];

export function MyAdsPanel() {
  const { user } = useAuth();
  const [ads] = useState<Advertisement[]>(mockAds);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  if (!user) return null;
  
  const filteredAds = statusFilter === 'all' 
    ? ads 
    : ads.filter(ad => ad.status === statusFilter);
  
  const pauseAd = (adId: string) => {
    toast({
      title: "Ad paused",
      description: "Your ad has been paused and will stop running."
    });
  };
  
  const resumeAd = (adId: string) => {
    toast({
      title: "Ad resumed",
      description: "Your ad is now active and will continue running."
    });
  };
  
  const deleteAd = (adId: string) => {
    toast({
      title: "Ad deleted",
      description: "Your ad has been permanently deleted."
    });
  };
  
  const getStatusBadge = (status: Advertisement['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending Approval</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>;
    }
  };
  
  const getPlacementDescription = (placement: Advertisement['placement']) => {
    switch (placement) {
      case 'top-vendors':
        return 'Top of Vendors List';
      case 'featured-product':
        return 'Featured Product';
      case 'ptc':
        return 'Pay-to-Click Ad';
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {filteredAds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No ads found matching your filter</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAds.map(ad => (
            <Card key={ad.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(ad.status)}
                      <span className="text-sm text-muted-foreground">
                        {getPlacementDescription(ad.placement)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-1">{ad.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{ad.description}</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Budget</p>
                        <p className="font-medium">${ad.budget.toFixed(2)}/day</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Spent</p>
                        <p className="font-medium">${ad.spent.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{ad.impressions}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <MousePointer className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{ad.clicks}</p>
                      </div>
                    </div>
                    
                    {ad.status === 'rejected' && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-red-800">Ad Rejected</h4>
                          <p className="text-sm text-red-700">{ad.rejectionReason}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-row md:flex-col gap-2">
                    {ad.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pauseAd(ad.id)}
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    
                    {ad.status === 'paused' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resumeAd(ad.id)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = "/ad-stats/" + ad.id}
                    >
                      <LineChart className="h-4 w-4 mr-2" />
                      Stats
                    </Button>
                    
                    {ad.status !== 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log('Edit', ad.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => deleteAd(ad.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
