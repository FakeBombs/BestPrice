import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';
import { toast } from '@/hooks/use-toast';

export function useAuthActions(
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileData) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: profileData.display_name || 'User',
          avatar: profileData.profile_image_url,
          username: profileData.username,
          bio: profileData.bio,
          location: profileData.location,
          website: profileData.website,
          isAdmin: profileData.role === 'admin',
        });
      }

      return true;
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

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

  const socialLogin = async (provider: 'google' | 'facebook' | 'twitter'): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
      });

      if (error) {
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }

      return true;
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error: any) {
      toast({
        title: 'Logout Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userData = { 
        ...data, 
        ...(data.language && { language: data.language })
      } as any;
      
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', data.id);

      if (error) throw error;

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
    login,
    register,
    socialLogin,
    logout,
    updateProfile,
    resetPassword,
    isLoading,
  };
}
