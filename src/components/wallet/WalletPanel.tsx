
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WalletData } from "./types";
import WalletBalanceCards from './WalletBalanceCards';
import WalletDeposit from './WalletDeposit';
import WalletTransactions from './WalletTransactions';
import WalletConnectSection from './WalletConnectSection';

const WalletPanel = () => {
  const { user } = useAuth();
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    pendingBalance: 0,
    transactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }
    
    const fetchWalletData = async () => {
      setLoading(true);
      try {
        const { data: wallet, error: walletError } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (walletError) throw walletError;
        
        const { data: transactionsData, error: txError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (txError) throw txError;
        
        if (wallet && transactionsData) {
          setWalletData({
            balance: wallet.balance || 0,
            pendingBalance: wallet.pending_balance || 0,
            transactions: transactionsData.map(tx => ({
              id: tx.id,
              date: new Date(tx.created_at),
              amount: tx.amount,
              description: tx.description,
              status: tx.status as 'completed' | 'pending' | 'failed',
              type: tx.type as 'deposit' | 'withdrawal' | 'ad-payment' | 'ad-earnings'
            }))
          });
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch wallet data"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchWalletData();
    
    const walletChannel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new) {
            const newData = payload.new as any;
            setWalletData(prev => ({
              ...prev,
              balance: newData.balance || 0,
              pendingBalance: newData.pending_balance || 0
            }));
          }
        }
      )
      .subscribe();
      
    const transactionChannel = supabase
      .channel('transaction-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new) {
            const newData = payload.new as any;
            const newTx = {
              id: newData.id,
              date: new Date(newData.created_at),
              amount: newData.amount,
              description: newData.description,
              status: newData.status as 'completed' | 'pending' | 'failed',
              type: newData.type as 'deposit' | 'withdrawal' | 'ad-payment' | 'ad-earnings'
            };
            
            setWalletData(prev => ({
              ...prev,
              transactions: [newTx, ...prev.transactions]
            }));
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(walletChannel);
      supabase.removeChannel(transactionChannel);
    };
  }, [user]);
  
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
