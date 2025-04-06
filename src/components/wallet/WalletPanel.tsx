
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import WalletBalanceCards from './WalletBalanceCards';
import WalletDeposit from './WalletDeposit';
import WalletTransactions from './WalletTransactions';
import WalletConnectSection from './WalletConnectSection';
import { useWalletData } from "./hooks/useWalletData";

const WalletPanel = () => {
  const { user } = useAuth();
  // Fixed: Pass user?.id which is a string, matching the updated parameter type
  const { walletData } = useWalletData(user?.id || null);
  
  const handleDepositComplete = () => {
    // Nothing to do here as the realtime subscription will update the UI
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
          <CardDescription>
            Please log in to access your wallet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          My Wallet
        </CardTitle>
        <CardDescription>
          Manage your funds, transactions, and ad payments
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <WalletBalanceCards walletData={walletData} />
        
        <Tabs defaultValue="deposit">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="connect">Connect Wallet</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit">
            <WalletDeposit userId={user.id} onDepositComplete={handleDepositComplete} />
          </TabsContent>
          
          <TabsContent value="transactions">
            <WalletTransactions transactions={walletData.transactions} />
          </TabsContent>
          
          <TabsContent value="connect">
            <WalletConnectSection />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WalletPanel;
