
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '../types';
import { toast } from '@/hooks/use-toast';

export function useLoginActions(
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
        console.error("Supabase auth error:", error);
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }

      if (!data.user) {
        toast({
          title: 'Login Failed',
          description: 'User data not returned from authentication service.',
          variant: 'destructive',
        });
        return false;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        // Don't fail the login, just log the error and continue
      }

      // Check if the email is the specified super admin email
      const isAdmin = email.toLowerCase() === 'chrissfreezers@gmail.com' || 
                      (profileData && profileData.role === 'admin');

      setUser({
        id: data.user.id,
        email: data.user.email!,
        name: (profileData && profileData.display_name) || data.user.email?.split('@')[0] || 'User',
        avatar: profileData?.profile_image_url,
        username: profileData?.username,
        bio: profileData?.bio,
        location: profileData?.location,
        website: profileData?.website,
        isAdmin: isAdmin,
      });
        
      // If the email is the super admin but the role is not set in the database,
      // update the profile to set them as an admin
      if (email.toLowerCase() === 'chrissfreezers@gmail.com' && (!profileData || profileData.role !== 'admin')) {
        await supabase
          .from('profiles')
          .upsert({ 
            id: data.user.id, 
            role: 'admin',
            display_name: data.user.email?.split('@')[0] || 'Admin'
          })
          .eq('id', data.user.id);
      }

      return true;
    } catch (error: any) {
      console.error("Login error:", error);
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

  const socialLogin = async (provider: 'google' | 'facebook' | 'twitter'): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        }
      });

      if (error) {
        console.error(`${provider} login error:`, error);
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }

      return true;
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: 'Logout Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    login,
    socialLogin,
    logout,
    isLoading,
  };
}
