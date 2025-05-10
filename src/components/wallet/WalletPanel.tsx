import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
// Removed import of WalletBalanceCards, WalletDeposit, WalletTransactions, WalletConnectSection
// Removed import of useWalletData

const WalletPanel = () => {
  const { user } = useAuth();
  // Removed usage of useWalletData

  // Removed handleDepositComplete

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
          Manage your funds, transactions, and ad payments (Wallet features are currently disabled)
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Wallet features commented out due to Supabase removal */}
        {/*
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
        */}
        <div className="text-center text-muted-foreground py-8">
          Wallet functionality is temporarily unavailable.
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletPanel;
