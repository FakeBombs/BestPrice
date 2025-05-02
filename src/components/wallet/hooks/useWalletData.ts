import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { WalletData } from "../types";

export const useWalletData = (userId: string | null) => {
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    pendingBalance: 0,
    transactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      return;
    }
    
    const fetchWalletData = async () => {
      setLoading(true);
      try {
        const { data: wallet, error: walletError } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (walletError) throw walletError;
        
        const { data: transactionsData, error: txError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
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
    
    // Set up realtime subscriptions
    const walletChannel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${userId}`
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
          filter: `user_id=eq.${userId}`
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
  }, [userId]);

  return { walletData, loading };
};
