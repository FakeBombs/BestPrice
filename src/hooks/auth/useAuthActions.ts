
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';
import { Database } from '@/integrations/supabase/types';

export function useAuthActions(setUser: (user: UserProfile | null) => void) {
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Successful login",
        description: "Welcome to BestPrice!"
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Error",
        description: error.message || "Wrong email or password."
      });
      
      return false;
    }
  };
  
  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          },
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Successful registration",
        description: "Your account was created successfully."
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: error.message || "The email you used already exists."
      });
      
      return false;
    }
  };
  
  // Social login function
  const socialLogin = async (provider: 'google' | 'facebook' | 'twitter'): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider
      });
      
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Error",
        description: `Login via ${provider} failed.`
      });
      
      return false;
    }
  };
  
  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout",
      description: "You have successfully logged out."
    });
  };
  
  // Update profile function
  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    try {
      type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
      
      const updates: ProfileUpdate = {
        display_name: data.name,
        bio: data.bio,
        profile_image_url: data.avatar,
        location: data.location,
        website: data.website,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', data.id!);
        
      if (error) throw error;
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: "Successful update",
        description: "Your profile has been successfully updated."
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Error",
        description: error.message || "Your profile could not be updated."
      });
      
      return false;
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a password reset link."
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password Reset Error",
        description: error.message || "Could not send password reset email."
      });
      
      return false;
    }
  };
  
  return { login, register, socialLogin, logout, updateProfile, resetPassword };
}
