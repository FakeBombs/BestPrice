
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAuth } from "@/hooks/useAuth";
import { Search, CheckCircle, XCircle, DollarSign, MousePointer, Eye } from "lucide-react";
import { Advertisement } from "@/components/ads/AdManager";

// Mock ads for demo purposes
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
  
  const formatAdType = (type: string) => {
    switch(type) {
      case 'product': return 'Product';
      case 'store': return 'Store';
      case 'brand': return 'Brand';
      case 'external': return 'External Link';
      default: return type;
    }
  };
  
  const formatPlacement = (placement: string) => {
    switch(placement) {
      case 'top-vendors': return 'Top Vendors';
      case 'featured-product': return 'Featured Product';
      case 'ptc': return 'PTC Ad';
      default: return placement;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Ad Management"
        backLink="/admin"
      />
      
      {pendingExternalAds.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
          <h3 className="font-medium text-amber-800 mb-2">
            {pendingExternalAds.length} external {pendingExternalAds.length === 1 ? 'ad' : 'ads'} pending approval
          </h3>
          <div className="grid gap-2">
            {pendingExternalAds.map(ad => (
              <div key={ad.id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                <div>
                  <p className="font-medium">{ad.title}</p>
                  <p className="text-sm text-muted-foreground">{ad.targetUrl}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => setApprovalDialog({ open: true, approve: false, ad })}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setApprovalDialog({ open: true, approve: true, ad })}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 space-x-0 sm:space-x-2 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search ads..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <Select 
            value={typeFilter} 
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="store">Store</SelectItem>
              <SelectItem value="brand">Brand</SelectItem>
              <SelectItem value="external">External</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Placement</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                  No ads found matching your search
                </TableCell>
              </TableRow>
            ) : (
              filteredAds.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{ad.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Created {ad.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatAdType(ad.type)}</TableCell>
                  <TableCell>{formatPlacement(ad.placement)}</TableCell>
                  <TableCell>{getStatusBadge(ad.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{ad.impressions}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MousePointer className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{ad.clicks}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">${ad.budget}/day</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Spent: ${ad.spent.toFixed(2)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedAd(ad)}
                      >
                        View
                      </Button>
                      
                      {ad.status === 'pending' && ad.type === 'external' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => setApprovalDialog({ open: true, approve: false, ad })}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-500 hover:text-green-600"
                            onClick={() => setApprovalDialog({ open: true, approve: true, ad })}
                          >
                            Approve
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Approval Dialog */}
      <Dialog 
        open={approvalDialog.open} 
        onOpenChange={(open) => !open && setApprovalDialog({ open: false, approve: false, ad: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalDialog.approve ? 'Approve Advertisement' : 'Reject Advertisement'}
            </DialogTitle>
            <DialogDescription>
              {approvalDialog.approve 
                ? 'Are you sure you want to approve this external advertisement? Once approved, it will be displayed to users.' 
                : 'Are you sure you want to reject this advertisement? This will notify the advertiser.'
              }
            </DialogDescription>
          </DialogHeader>
          
          {approvalDialog.ad && (
            <div className="py-4">
              <h3 className="font-medium mb-1">{approvalDialog.ad.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{approvalDialog.ad.description}</p>
              
              {approvalDialog.ad.type === 'external' && (
                <div className="text-sm bg-muted p-2 rounded">
                  <span className="font-medium">Target URL: </span>
                  <span className="break-all">{approvalDialog.ad.targetUrl}</span>
                </div>
              )}
            </div>
          )}
          
          {!approvalDialog.approve && (
            <div className="space-y-2 py-2">
              <label className="text-sm font-medium" htmlFor="rejection-reason">
                Rejection Reason (will be sent to advertiser)
              </label>
              <Input id="rejection-reason" placeholder="e.g., Violates content policy" />
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={approvalDialog.approve ? handleApproveAd : handleRejectAd}
              variant={approvalDialog.approve ? "default" : "destructive"}
            >
              {approvalDialog.approve ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
