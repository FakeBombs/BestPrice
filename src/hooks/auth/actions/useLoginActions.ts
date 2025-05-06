import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '../types';
import { toast } from '@/hooks/use-toast';

export function useLoginActions(
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Login attempt started for email:", email);
    setIsLoading(true);
    
    try {
      // First, abort any ongoing auth session to ensure a clean login attempt
      await supabase.auth.signOut();
      
      console.log("Calling signInWithPassword with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Login response:", { 
        user: data?.user ? data.user.id : null,
        session: data?.session ? "Session exists" : "No session", 
        error: error ? error.message : null 
      });

      if (error) {
        console.error("Supabase auth error:", error);
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return false;
      }

      if (!data.user) {
        console.error("No user data returned");
        toast({
          title: 'Login Failed',
          description: 'User data not returned from authentication service.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return false;
      }

      console.log("User authenticated successfully, fetching profile");
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        // Don't fail the login, just log the error and continue with basic profile info
      }

      // Check if the email is the specified super admin email
      const isAdmin = email.toLowerCase() === 'chrissfreezers@gmail.com' || 
                      (profileData && profileData.role === 'admin');

      // Create a basic profile if none was found
      if (!profileData) {
        console.log("No profile found, creating one");
        const displayName = data.user.email?.split('@')[0] || 'User';
        
        try {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              display_name: displayName,
              username: data.user.email?.split('@')[0] || 'user',
              role: email.toLowerCase() === 'chrissfreezers@gmail.com' ? 'admin' : 'user'
            });
          
          if (insertError) {
            console.error("Error creating profile:", insertError);
          }
        } catch (err) {
          console.error("Profile creation error:", err);
        }
        
        // Set a basic user profile
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: displayName,
          username: data.user.email?.split('@')[0] || 'user',
          isAdmin: isAdmin
        });
      } else {
        // Use existing profile data
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: profileData.display_name || data.user.email?.split('@')[0] || 'User',
          avatar: profileData.profile_image_url,
          username: profileData.username || data.user.email?.split('@')[0] || 'user',
          bio: profileData.bio,
          location: profileData.location,
          website: profileData.website,
          isAdmin: isAdmin,
        });
      }
        
      // If the email is the super admin but the role is not set in the database,
      // update the profile to set them as an admin
      if (email.toLowerCase() === 'chrissfreezers@gmail.com') {
        try {
          await supabase
            .from('profiles')
            .upsert({ 
              id: data.user.id, 
              role: 'admin',
              display_name: data.user.email?.split('@')[0] || 'Admin'
            });
          console.log("Admin role assigned to chrissfreezers@gmail.com");
        } catch (err) {
          console.error("Error setting admin role:", err);
        }
      }

      toast({
        title: 'Login Successful',
        description: 'You have been successfully logged in.',
      });
      
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  };

  const socialLogin = async (provider: 'google' | 'facebook' | 'twitter'): Promise<boolean> => {
    try {
      console.log(`Starting ${provider} login flow`);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        }
      });

      console.log(`${provider} login response:`, { data, error });

      if (error) {
        console.error(`${provider} login error:`, error);
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }

      // For OAuth, we don't set the user here because the redirect will happen
      // The user will be set during the auth state change event
      return true;
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast({
        title: 'Login Failed',
        description: error.message || `Error connecting to ${provider}`,
        variant: 'destructive',
      });
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      console.log("Starting logout process");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        throw error;
      }
      
      setUser(null);
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      
      console.log("Logout successful");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: 'Logout Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    socialLogin,
    logout,
    isLoading,
  };
}
