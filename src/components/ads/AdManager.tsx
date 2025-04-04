
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AdPostForm } from './AdPostForm';
import { MyAdsPanel } from './MyAdsPanel';
import { PtcAdsPanel } from './PtcAdsPanel';
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { WalletData } from '../wallet/WalletPanel';

// Mock wallet data for demonstration
const mockWalletData: WalletData = {
  balance: 25.50,
  pendingBalance: 5.75,
  transactions: []
};

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  targetUrl: string;
  type: 'product' | 'store' | 'brand' | 'external';
  status: 'active' | 'pending' | 'rejected' | 'paused';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  createdAt: Date;
  expiresAt?: Date;
  ownerId: string;
  placement: 'top-vendors' | 'featured-product' | 'ptc';
  targetId?: string; // ID of the product/store/brand being advertised
  approvedBy?: string; // Admin ID who approved the ad (for external ads)
  rejectionReason?: string;
}

export default function AdManager() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('create');
  const [walletData] = useState<WalletData>(mockWalletData);
  
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Advertisement Manager</CardTitle>
          <CardDescription>
            Please log in to access the advertisement manager.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Advertisement Manager</CardTitle>
        <CardDescription>
          Create and manage your ads
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {walletData.balance < 5 && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-800">Low Balance</h4>
              <p className="text-sm text-amber-700">
                Your wallet balance is low. Consider adding funds to ensure your ads continue to run.
              </p>
              <Button variant="link" className="h-auto p-0 text-amber-600 mt-1">
                Add Funds <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="create">Create Ad</TabsTrigger>
            <TabsTrigger value="my-ads">My Ads</TabsTrigger>
            <TabsTrigger value="ptc">PTC Ads</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <AdPostForm onSubmit={() => setActiveTab('my-ads')} />
          </TabsContent>
          
          <TabsContent value="my-ads">
            <MyAdsPanel />
          </TabsContent>
          
          <TabsContent value="ptc">
            <PtcAdsPanel />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
