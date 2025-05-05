
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';
import { Database } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function useAuthState() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    console.log("useAuthState initialization");
    
    // Handle any authentication errors that might be in the URL
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    const errorDesc = params.get('error_description');
    
    if (errorParam) {
      setAuthError(`${errorParam}: ${errorDesc || 'Authentication error'}`);
      console.error(`Auth error from URL: ${errorParam} - ${errorDesc}`);
      toast({
        title: 'Authentication Error',
        description: errorDesc || errorParam,
        variant: 'destructive',
      });
    }

    // First establish the listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        
        // Always immediately update the session
        setSession(currentSession);
        
        if (!currentSession) {
          // If no session, set user to null and stop loading
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        // If there's a session with user, fetch profile asynchronously
        // Use a setTimeout to avoid potential deadlocks with Supabase client
        setTimeout(async () => {
          try {
            if (!currentSession.user) {
              setIsLoading(false);
              return;
            }
            
            const email = currentSession.user.email || '';
            console.log("Fetching profile for user:", currentSession.user.id);
            
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .maybeSingle();
              
            console.log("Profile fetch result:", { profile, error: profileError });
              
            if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = No rows returned
              console.error("Error fetching profile:", profileError);
              toast({
                title: 'Profile Error',
                description: 'Failed to load your profile data.',
                variant: 'destructive',
              });
            }
              
            const isAdmin = email.toLowerCase() === 'chrissfreezers@gmail.com' || 
                          (profile && profile.role === 'admin');
            
            // If profile doesn't exist, create it
            if (!profile) {
              console.log("No profile found, creating one");
              const displayName = currentSession.user.user_metadata?.full_name || 
                                 email.split('@')[0] || 'User';
              
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: currentSession.user.id,
                  display_name: displayName,
                  username: email.split('@')[0],
                  role: email.toLowerCase() === 'chrissfreezers@gmail.com' ? 'admin' : 'user'
                });
                
              if (insertError) {
                console.error("Error creating profile:", insertError);
              }
              
              // Set user with basic info since profile creation might have failed
              setUser({
                id: currentSession.user.id,
                name: displayName,
                email: email,
                isAdmin: isAdmin
              });
            } else {
              // Profile exists, use its data
              console.log("Profile found, setting user state");
              setUser({
                id: currentSession.user.id,
                name: profile.display_name || email.split('@')[0] || '',
                email: email,
                avatar: profile.profile_image_url,
                username: profile.username,
                bio: profile.bio,
                location: profile.location,
                website: profile.website,
                isAdmin: isAdmin
              });
            }
            
            // Super admin check
            if (email.toLowerCase() === 'chrissfreezers@gmail.com' && (!profile || profile.role !== 'admin')) {
              await supabase
                .from('profiles')
                .upsert({ 
                  id: currentSession.user.id, 
                  role: 'admin',
                  display_name: email.split('@')[0] || 'Admin'
                });
            }
            
          } catch (error) {
            console.error("Error in profile processing:", error);
          } finally {
            setIsLoading(false);
          }
        }, 0);
      }
    );
    
    // Then check the current session
    console.log("Checking for existing session");
    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      console.log("Current session check result:", { session: currentSession?.user?.id, error });
      
      if (error) {
        console.error("Session retrieval error:", error);
        setIsLoading(false);
        return;
      }
      
      if (!currentSession) {
        console.log("No active session found");
        setIsLoading(false);
        return;
      }
      
      setSession(currentSession);
      
      // Get the user's profile in a setTimeout to avoid potential deadlocks
      setTimeout(async () => {
        try {
          console.log("Getting profile for current session user");
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user!.id)
            .maybeSingle();
          
          console.log("Profile result:", { profile, error: profileError });
          
          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error fetching profile:", profileError);
          }
          
          const email = currentSession.user!.email || '';
          const isAdmin = email.toLowerCase() === 'chrissfreezers@gmail.com' || 
                         (profile && profile.role === 'admin');

          // If profile doesn't exist
          if (!profile) {
            console.log("No profile found for current user, creating one");
            const displayName = currentSession.user!.user_metadata?.full_name || 
                               email.split('@')[0] || 'User';
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: currentSession.user!.id,
                display_name: displayName,
                username: email.split('@')[0],
                role: email.toLowerCase() === 'chrissfreezers@gmail.com' ? 'admin' : 'user'
              });
              
            if (insertError) {
              console.error("Error creating profile:", insertError);
            }
            
            setUser({
              id: currentSession.user!.id,
              name: displayName,
              email: email,
              isAdmin: isAdmin
            });
          } else {
            // Profile exists, use its data
            console.log("Setting user state from profile");
            setUser({
              id: currentSession.user!.id,
              name: profile.display_name || email.split('@')[0] || '',
              email: email,
              avatar: profile.profile_image_url,
              username: profile.username,
              bio: profile.bio,
              location: profile.location,
              website: profile.website,
              isAdmin: isAdmin
            });
          }
          
          // Super admin check
          if (email.toLowerCase() === 'chrissfreezers@gmail.com' && (!profile || profile.role !== 'admin')) {
            await supabase
              .from('profiles')
              .upsert({ 
                id: currentSession.user!.id, 
                role: 'admin',
                display_name: email.split('@')[0] || 'Admin'
              });
          }
        } catch (error) {
          console.error("Error processing user data:", error);
        } finally {
          setIsLoading(false);
        }
      }, 0);
    }).catch(error => {
      console.error("Session initialization error:", error);
      setIsLoading(false);
    });
    
    return () => {
      console.log("Cleaning up auth state subscription");
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, isLoading, authError, setUser };
}
