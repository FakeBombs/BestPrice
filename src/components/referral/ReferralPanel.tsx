
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Copy, Share2, Users } from "lucide-react";

interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  earnings: number;
  referralCode: string;
  referralLink: string;
  referralHistory: {
    id: string;
    date: Date;
    user: string;
    status: 'pending' | 'completed';
    reward: number;
  }[];
}

const mockReferralStats: ReferralStats = {
  totalReferrals: 5,
  pendingReferrals: 2,
  earnings: 15.50,
  referralCode: "FRIENDBONUS25",
  referralLink: "https://bestprice.com/ref/FRIENDBONUS25",
  referralHistory: [
    {
      id: 'r1',
      date: new Date(2025, 3, 1),
      user: "user***@gmail.com",
      status: 'completed',
      reward: 5.00
    },
    {
      id: 'r2',
      date: new Date(2025, 2, 25),
      user: "john***@example.com",
      status: 'completed',
      reward: 5.00
    },
    {
      id: 'r3',
      date: new Date(2025, 3, 4),
      user: "alice***@example.com",
      status: 'pending',
      reward: 5.00
    },
    {
      id: 'r4',
      date: new Date(2025, 3, 5),
      user: "bob***@example.com",
      status: 'pending',
      reward: 5.00
    },
  ]
};

export default function ReferralPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralStats] = useState<ReferralStats>(mockReferralStats);
  
  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: `${type === 'code' ? 'Referral code' : 'Referral link'} copied!`,
          description: "Share it with your friends to earn rewards.",
        });
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast({
          title: "Failed to copy",
          description: "Please try again.",
          variant: "destructive"
        });
      });
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join BestPrice with my referral link',
        text: 'Use my referral link to join BestPrice and we both get a bonus!',
        url: referralStats.referralLink,
      })
      .then(() => {
        toast({
          title: "Shared successfully!",
          description: "Thanks for sharing BestPrice with your friends.",
        });
      })
      .catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      copyToClipboard(referralStats.referralLink, 'link');
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referral Program</CardTitle>
          <CardDescription>
            Please log in to access the referral program.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Referral Program
        </CardTitle>
        <CardDescription>
          Invite friends and earn rewards when they join
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <h3 className="text-2xl font-bold">{referralStats.totalReferrals}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Pending Referrals</p>
                <h3 className="text-2xl font-bold">{referralStats.pendingReferrals}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <h3 className="text-2xl font-bold">${referralStats.earnings.toFixed(2)}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Your Referral Code</h3>
            <div className="flex gap-2">
              <Input 
                value={referralStats.referralCode} 
                readOnly 
                className="font-medium"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => copyToClipboard(referralStats.referralCode, 'code')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Share Your Referral Link</h3>
            <div className="flex gap-2">
              <Input 
                value={referralStats.referralLink}
                readOnly
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => copyToClipboard(referralStats.referralLink, 'link')}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                onClick={shareReferral}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Referral History</h3>
            {referralStats.referralHistory.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground">No referrals yet</p>
            ) : (
              <div className="space-y-3">
                {referralStats.referralHistory.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{referral.user}</p>
                      <p className="text-sm text-muted-foreground">
                        {referral.date.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${referral.reward.toFixed(2)}</p>
                      <p className="text-xs">
                        {referral.status === 'completed' ? (
                          <span className="text-green-600">Completed</span>
                        ) : (
                          <span className="text-amber-500">Pending</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start">
        <p className="text-sm text-muted-foreground">
          For each friend that signs up using your referral code, you'll both receive a $5.00 bonus once they complete their first purchase.
        </p>
      </CardFooter>
    </Card>
  );
}
