
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useRegisterActions() {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        toast({
          title: 'Registration Failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }

      toast({
        title: 'Registration Successful',
        description: 'Your account has been created.',
      });

      return true;
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
  };
}
