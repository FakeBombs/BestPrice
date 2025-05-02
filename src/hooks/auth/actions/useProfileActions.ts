
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '../types';
import { toast } from '@/hooks/use-toast';

export function useProfileActions(
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) {
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Type assertion to fix the issue
      const userData = { 
        ...data, 
        ...(data.language && { language: data.language })
      } as any;
      
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', data.id);

      if (error) throw error;

      // Update the user state
      setUser((prev: UserProfile | null) => {
        if (!prev) return null;
        return { 
          ...prev, 
          ...data 
        };
      });

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) throw error;

      toast({
        title: 'Password Reset Email Sent',
        description:
          "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.",
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Reset Failed',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    resetPassword,
    isLoading,
  };
}
