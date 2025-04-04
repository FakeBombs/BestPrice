
import { Advertisement } from "@/components/ads/AdManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

interface ApprovalDialogState {
  open: boolean;
  approve: boolean;
  ad: Advertisement | null;
}

interface AdApprovalDialogProps {
  approvalDialog: ApprovalDialogState;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
  onReject: () => void;
}

export function AdApprovalDialog({
  approvalDialog,
  onOpenChange,
  onApprove,
  onReject
}: AdApprovalDialogProps) {
  return (
    <Dialog 
      open={approvalDialog.open} 
      onOpenChange={(open) => !open && onOpenChange(false)}
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
            onClick={approvalDialog.approve ? onApprove : onReject}
            variant={approvalDialog.approve ? "default" : "destructive"}
          >
            {approvalDialog.approve ? 'Approve' : 'Reject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
