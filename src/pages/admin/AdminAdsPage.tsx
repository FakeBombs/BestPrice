
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAuth } from "@/hooks/useAuth";
import { Advertisement } from "@/components/ads/AdManager";
import { AdFilters } from "@/components/admin/ads/AdFilters";
import { PendingAdsAlert } from "@/components/admin/ads/PendingAdsAlert";
import { AdsList } from "@/components/admin/ads/AdsList";
import { AdApprovalDialog } from "@/components/admin/ads/AdApprovalDialog";

// Mock ads for demo purposes
const mockAds: Advertisement[] = [
  {
    id: 'ad1',
    title: 'iPhone 14 Pro Max - Top Deal',
    description: 'Best price on the latest iPhone',
    targetUrl: 'https://example.com/iphone-14-pro-max',
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
    targetUrl: 'https://example.com/dell-laptops',
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
  }
];

export default function AdminAdsPage() {
  const { user } = useAuth();
  const [ads] = useState<Advertisement[]>(mockAds);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [approvalDialog, setApprovalDialog] = useState<{open: boolean, approve: boolean, ad: Advertisement | null}>({
    open: false, 
    approve: false, 
    ad: null
  });
  
  // Pending ads that need approval (external ads)
  const pendingExternalAds = ads.filter(ad => 
    ad.status === 'pending' && ad.type === 'external'
  );
  
  // Filter ads based on search query and filters
  const filteredAds = ads.filter(ad => {
    const matchesSearch = 
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !typeFilter || ad.type === typeFilter;
    const matchesStatus = !statusFilter || ad.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const handleApproveAd = () => {
    if (approvalDialog.ad) {
      // In a real app, this would update the database
      toast({
        title: "Ad approved",
        description: `The ad "${approvalDialog.ad.title}" has been approved and is now active.`
      });
    }
    setApprovalDialog({ open: false, approve: false, ad: null });
  };
  
  const handleRejectAd = () => {
    if (approvalDialog.ad) {
      // In a real app, this would update the database
      toast({
        title: "Ad rejected",
        description: `The ad "${approvalDialog.ad.title}" has been rejected.`
      });
    }
    setApprovalDialog({ open: false, approve: false, ad: null });
  };
  
  const handleOpenApprovalDialog = (ad: Advertisement, approve: boolean) => {
    setApprovalDialog({ open: true, approve, ad });
  };
  
  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Ad Management"
        backLink="/admin"
      />
      
      <PendingAdsAlert 
        pendingAds={pendingExternalAds}
        onApprove={(ad) => handleOpenApprovalDialog(ad, true)}
        onReject={(ad) => handleOpenApprovalDialog(ad, false)}
      />
      
      <AdFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      <AdsList 
        ads={filteredAds}
        onViewAd={setSelectedAd}
        onApproveRequest={(ad) => handleOpenApprovalDialog(ad, true)}
        onRejectRequest={(ad) => handleOpenApprovalDialog(ad, false)}
      />
      
      <AdApprovalDialog
        approvalDialog={approvalDialog}
        onOpenChange={(open) => !open && setApprovalDialog({ open: false, approve: false, ad: null })}
        onApprove={handleApproveAd}
        onReject={handleRejectAd}
      />
    </div>
  );
}
