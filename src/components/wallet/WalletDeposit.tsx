
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, Coins, Plus, Bitcoin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

interface WalletDepositProps {
  userId: string;
  onDepositComplete: () => void;
}

// Define a type for the RPC parameters
type AddToWalletParams = {
  user_id: string; 
  amount_to_add: number;
};

const WalletDeposit = ({ userId, onDepositComplete }: WalletDepositProps) => {
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('credit-card');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to deposit funds.",
        variant: "destructive"
      });
      return;
    }
    
    const depositNumAmount = parseFloat(depositAmount);
    if (isNaN(depositNumAmount) || depositNumAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to deposit.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const transactionData: Database['public']['Tables']['transactions']['Insert'] = {
        user_id: userId,
        amount: depositNumAmount,
        description: `Deposit via ${
          paymentMethod === 'credit-card' ? 'Credit Card' :
          paymentMethod === 'paypal' ? 'PayPal' :
          paymentMethod === 'bank' ? 'Bank Transfer' : 'Other method'
        }`,
        type: 'deposit',
        status: 'completed'
      };
      
      const { error } = await supabase
        .from('transactions')
        .insert(transactionData);
        
      if (error) throw error;
      
      // Create a properly typed parameter object for the RPC call
      const params: AddToWalletParams = {
        user_id: userId,
        amount_to_add: depositNumAmount
      };
      
      // Use any type assertion to bypass TypeScript constraints for the RPC call
      const { error: walletError } = await (supabase.rpc as any)(
        'add_to_wallet',
        params
      );
      
      if (walletError) throw walletError;
      
      toast({
        title: "Success!",
        description: `Deposited $${depositNumAmount.toFixed(2)} to your wallet.`
      });
      
      setDepositAmount('');
      onDepositComplete();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to deposit funds. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};

export default WalletDeposit;
