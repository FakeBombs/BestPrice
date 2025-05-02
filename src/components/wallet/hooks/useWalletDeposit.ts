
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define a type for the RPC parameters
type AddToWalletParams = {
  user_id: string; 
  amount_to_add: number;
};

export const useWalletDeposit = (userId: string, onDepositComplete: () => void) => {
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
      const transactionData = {
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

  return {
    depositAmount,
    setDepositAmount,
    paymentMethod,
    setPaymentMethod,
    loading,
    handleDeposit
  };
};
