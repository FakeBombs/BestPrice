
import { Advertisement } from "@/components/ads/AdManager";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatAdType, formatPlacement, getStatusBadge, AdPerformance, AdBudget } from "./adUtils";

interface AdsListProps {
  ads: Advertisement[];
  onViewAd: (ad: Advertisement) => void;
  onApproveRequest: (ad: Advertisement) => void;
  onRejectRequest: (ad: Advertisement) => void;
}

export function AdsList({ 
  ads, 
  onViewAd, 
  onApproveRequest, 
  onRejectRequest 
}: AdsListProps) {
  return (
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
          {ads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                No ads found matching your search
              </TableCell>
            </TableRow>
          ) : (
            ads.map((ad) => (
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
                  <AdPerformance impressions={ad.impressions} clicks={ad.clicks} />
                </TableCell>
                <TableCell>
                  <AdBudget budget={ad.budget} spent={ad.spent} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewAd(ad)}
                    >
                      View
                    </Button>
                    
                    {ad.status === 'pending' && ad.type === 'external' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => onRejectRequest(ad)}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-500 hover:text-green-600"
                          onClick={() => onApproveRequest(ad)}
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
  );
}
