
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
    console.log("Register attempt started for:", { name, email });
    setIsLoading(true);
    
    try {
      // First, abort any ongoing auth session
      await supabase.auth.signOut();
      
      console.log("Calling signUp...");
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            display_name: name,
          },
        },
      });

      console.log("Registration response:", { data, error });

      if (error) {
        console.error("Registration error:", error);
        toast({
          title: 'Registration Failed',
          description: error.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return false;
      }

      if (!data.user) {
        console.error("No user data returned from registration");
        toast({
          title: 'Registration Failed',
          description: 'User data not returned from authentication service.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return false;
      }

      // Create a profile for the user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          display_name: name,
          username: email.split('@')[0],
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
        // Don't fail registration, just log the error
      }

      toast({
        title: 'Registration Successful',
        description: data.session ? 'Your account has been created and you are now logged in.' : 'Your account has been created. Please check your email to confirm your account.',
      });

      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  };

  return {
    register,
    isLoading,
  };
}
