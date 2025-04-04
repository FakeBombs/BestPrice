
import { Advertisement } from "@/components/ads/AdManager";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface PendingAdsAlertProps {
  pendingAds: Advertisement[];
  onApprove: (ad: Advertisement) => void;
  onReject: (ad: Advertisement) => void;
}

export function PendingAdsAlert({ pendingAds, onApprove, onReject }: PendingAdsAlertProps) {
  if (pendingAds.length === 0) return null;
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
      <h3 className="font-medium text-amber-800 mb-2">
        {pendingAds.length} external {pendingAds.length === 1 ? 'ad' : 'ads'} pending approval
      </h3>
      <div className="grid gap-2">
        {pendingAds.map(ad => (
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
                onClick={() => onReject(ad)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => onApprove(ad)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
