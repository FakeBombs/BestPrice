
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '../types';
import { toast } from '@/hooks/use-toast';

export function useProfileActions(
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) {
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (profile: Partial<UserProfile>): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profile.name,
          username: profile.username,
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
          profile_image_url: profile.avatar
        })
        .eq('id', profile.id);

      if (error) {
        console.error("Profile update error:", error);
        toast({
          title: 'Profile Update Failed',
          description: error.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return false;
      }

      // Update the user context
      setUser(prev => {
        if (!prev) return null;
        return { ...prev, ...profile };
      });

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
      
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: 'Profile Update Failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log("Sending password reset email to:", email);
      
      // Use sendPasswordResetLink API for better error handling
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      });

      if (error) {
        console.error("Password reset error:", error);
        toast({
          title: 'Password Reset Failed',
          description: error.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return false;
      }

      toast({
        title: 'Password Reset Email Sent',
        description: `Check your email (${email}) for a password reset link.`,
      });
      
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: 'Password Reset Failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  };

  return {
    updateProfile,
    resetPassword,
    isLoading,
  };
}
