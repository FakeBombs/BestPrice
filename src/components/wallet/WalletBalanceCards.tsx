
import { Card, CardContent } from "@/components/ui/card";
import { CircleDollarSign, History } from "lucide-react";
import { WalletData } from "./types";

interface WalletBalanceCardsProps {
  walletData: WalletData;
}

const WalletBalanceCards = ({ walletData }: WalletBalanceCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <h3 className="text-2xl font-bold">${walletData.balance.toFixed(2)}</h3>
            </div>
            <CircleDollarSign className="h-8 w-8 text-primary opacity-80" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Balance</p>
              <h3 className="text-2xl font-bold">${walletData.pendingBalance.toFixed(2)}</h3>
            </div>
            <History className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletBalanceCards;
