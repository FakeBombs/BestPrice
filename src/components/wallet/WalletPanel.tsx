import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, CreditCard, CircleDollarSign, Plus, Coins, History, ExternalLink, Bitcoin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import WalletConnectButton from "./WalletConnectButton";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export interface WalletData {
  balance: number;
  pendingBalance: number;
  transactions: {
    id: string;
    date: Date;
    amount: number;
    description: string;
    status: 'completed' | 'pending' | 'failed';
    type: 'deposit' | 'withdrawal' | 'ad-payment' | 'ad-earnings';
  }[];
}

export default function WalletPanel() {
  const { user } = useAuth();
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    pendingBalance: 0,
    transactions: []
  });
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('credit-card');
  const [loading, setLoading] = useState(true);
  
  // Fetch wallet data when user changes
  useEffect(() => {
    if (!user) {
      return;
    }
    
    const fetchWalletData = async () => {
      setLoading(true);
      try {
        // Get wallet
        const { data: wallet, error: walletError } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (walletError) throw walletError;
        
        // Get transactions
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
    
    // Subscribe to wallet changes
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
      
    // Subscribe to transaction changes
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
  
  const handleDeposit = async () => {
    if (!user) return;
    
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to deposit",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      // Create a transaction record
      const transactionData = {
        user_id: user.id,
        amount: amount,
        description: `Deposit via ${
          paymentMethod === 'credit-card' ? 'Credit Card' : 
          paymentMethod === 'paypal' ? 'PayPal' : 
          paymentMethod === 'bitpay' ? 'BitPay' : 
          paymentMethod === 'coinbase' ? 'Coinbase' : 
          paymentMethod === 'coinpayments' ? 'CoinPayments' :
          paymentMethod === 'faucetpay' ? 'FaucetPay' :
          'selected payment method'
        }`,
        status: 'completed',
        type: 'deposit'
      } as const;
      
      const { error } = await supabase
        .from('transactions')
        .insert(transactionData);
        
      if (error) throw error;
      
      // Update wallet balance using RPC
      const { error: walletError } = await supabase.rpc('add_to_wallet', {
        user_id: user.id,
        amount_to_add: amount
      });
      
      if (walletError) throw walletError;
      
      toast({
        title: "Deposit successful",
        description: `$${amount.toFixed(2)} has been added to your wallet.`
      });
      
      setDepositAmount('');
    } catch (error) {
      console.error("Error processing deposit:", error);
      toast({
        variant: "destructive",
        title: "Deposit failed",
        description: "There was an error processing your deposit"
      });
    } finally {
      setLoading(false);
    }
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
        
        <Tabs defaultValue="deposit">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="connect">Connect Wallet</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit">
            <Card>
              <CardHeader>
                <CardTitle>Add Funds</CardTitle>
                <CardDescription>
                  Deposit money to your account to pay for advertising
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="amount" className="text-sm font-medium">Amount ($)</label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      min="1"
                      step="0.01"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Payment Method</label>
                    <div className="grid grid-cols-1 gap-2">
                      <h4 className="text-sm font-medium text-muted-foreground mt-2">Traditional Methods</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Button 
                          variant={paymentMethod === 'credit-card' ? 'default' : 'outline'} 
                          className="justify-start"
                          onClick={() => setPaymentMethod('credit-card')}
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Credit Card
                        </Button>
                        <Button 
                          variant={paymentMethod === 'paypal' ? 'default' : 'outline'} 
                          className="justify-start"
                          onClick={() => setPaymentMethod('paypal')}
                        >
                          <Coins className="mr-2 h-4 w-4" />
                          PayPal
                        </Button>
                      </div>
                      
                      <h4 className="text-sm font-medium text-muted-foreground mt-4">Cryptocurrency</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Button 
                          variant={paymentMethod === 'bitpay' ? 'default' : 'outline'} 
                          className="justify-start"
                          onClick={() => setPaymentMethod('bitpay')}
                        >
                          <Bitcoin className="mr-2 h-4 w-4" />
                          BitPay
                        </Button>
                        <Button 
                          variant={paymentMethod === 'coinbase' ? 'default' : 'outline'} 
                          className="justify-start"
                          onClick={() => setPaymentMethod('coinbase')}
                        >
                          <Bitcoin className="mr-2 h-4 w-4" />
                          Coinbase
                        </Button>
                        <Button 
                          variant={paymentMethod === 'coinpayments' ? 'default' : 'outline'} 
                          className="justify-start"
                          onClick={() => setPaymentMethod('coinpayments')}
                        >
                          <Bitcoin className="mr-2 h-4 w-4" />
                          CoinPayments
                        </Button>
                        <Button 
                          variant={paymentMethod === 'faucetpay' ? 'default' : 'outline'} 
                          className="justify-start"
                          onClick={() => setPaymentMethod('faucetpay')}
                        >
                          <Bitcoin className="mr-2 h-4 w-4" />
                          FaucetPay
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleDeposit} 
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0 || loading}
                  className="w-full"
                >
                  {loading ? 'Processing...' : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Funds
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  View your recent transactions and payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {walletData.transactions.length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">No transactions yet</p>
                  ) : (
                    <div className="space-y-3">
                      {walletData.transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between border-b pb-3">
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.date.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toFixed(2)} $
                            </p>
                            <p className="text-xs">
                              {transaction.status === 'completed' && <span className="text-green-600">Completed</span>}
                              {transaction.status === 'pending' && <span className="text-amber-500">Pending</span>}
                              {transaction.status === 'failed' && <span className="text-red-500">Failed</span>}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="connect">
            <Card>
              <CardHeader>
                <CardTitle>Connect External Wallet</CardTitle>
                <CardDescription>
                  Connect your Web3 wallet to deposit or withdraw funds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <WalletConnectButton walletType="metamask" />
                  <WalletConnectButton walletType="binance" />
                  <WalletConnectButton walletType="walletconnect" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <p className="text-sm text-muted-foreground mb-2">
                  Connecting a wallet allows you to pay for ads and receive earnings directly through your preferred Web3 wallet.
                </p>
                <div className="flex items-center">
                  <Button variant="link" className="h-auto p-0">
                    Learn more about Web3 wallets
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
