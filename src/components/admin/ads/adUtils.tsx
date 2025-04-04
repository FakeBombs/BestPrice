
import { Badge } from "@/components/ui/badge";
import { Eye, MousePointer, DollarSign } from "lucide-react";

export function formatAdType(type: string) {
  switch(type) {
    case 'product': return 'Product';
    case 'store': return 'Store';
    case 'brand': return 'Brand';
    case 'external': return 'External Link';
    default: return type;
  }
}

export function formatPlacement(placement: string) {
  switch(placement) {
    case 'top-vendors': return 'Top Vendors';
    case 'featured-product': return 'Featured Product';
    case 'ptc': return 'PTC Ad';
    default: return placement;
  }
}

export function getStatusBadge(status: string) {
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
}

export function AdPerformance({ impressions, clicks }: { impressions: number, clicks: number }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <Eye className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{impressions}</span>
      </div>
      <div className="flex items-center gap-1">
        <MousePointer className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{clicks}</span>
      </div>
    </div>
  );
}

export function AdBudget({ budget, spent }: { budget: number, spent: number }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <DollarSign className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">${budget}/day</span>
      </div>
      <div className="text-xs text-muted-foreground">
        Spent: ${spent.toFixed(2)}
      </div>
    </div>
  );
}
