
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useDepositForm(userId: string, onDepositComplete: () => void) {
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeposit = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a deposit.",
        variant: "destructive",
      });
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Using type assertion to avoid TypeScript errors with RPC
      const { data, error } = await (supabase.rpc as any)('process_deposit', {
        p_user_id: userId,
        p_amount: parseFloat(depositAmount),
        p_payment_method: paymentMethod
      });
      
      if (error) throw error;
      
      toast({
        title: "Deposit Successful",
        description: `$${parseFloat(depositAmount).toFixed(2)} has been added to your account.`,
      });
      
      setDepositAmount('');
      onDepositComplete();
      
    } catch (error: any) {
      toast({
        title: "Deposit Failed",
        description: error.message || "There was an error processing your deposit.",
        variant: "destructive",
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
}
