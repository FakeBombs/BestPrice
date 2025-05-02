
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

      // Check if the email is the specified super admin email
      const isAdmin = email.toLowerCase() === 'chrissfreezers@gmail.com' || 
                      (profileData && profileData.role === 'admin');

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
          isAdmin: isAdmin,
        });
        
        // If the email is the super admin but the role is not set in the database,
        // update the profile to set them as an admin
        if (email.toLowerCase() === 'chrissfreezers@gmail.com' && profileData.role !== 'admin') {
          await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', data.user.id);
        }
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

  return {
    login,
    socialLogin,
    logout,
    isLoading,
  };
}
