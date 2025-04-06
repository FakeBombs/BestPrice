
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function useAuthState() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // First establish the listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Get the user's profile data
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
            
          setUser({
            id: currentSession.user.id,
            name: profile?.display_name || currentSession.user.email?.split('@')[0] || '',
            email: currentSession.user.email || '',
            avatar: profile?.profile_image_url,
            username: profile?.username,
            bio: profile?.bio,
            location: profile?.location,
            website: profile?.website,
            isAdmin: currentSession.user.email?.toLowerCase().includes('admin')
          });
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Then check the current session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        // Get the user's profile in a setTimeout to avoid deadlocks
        setTimeout(async () => {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user!.id)
            .single();
            
          setUser({
            id: currentSession.user!.id,
            name: profile?.display_name || currentSession.user!.email?.split('@')[0] || '',
            email: currentSession.user!.email || '',
            avatar: profile?.profile_image_url,
            username: profile?.username,
            bio: profile?.bio,
            location: profile?.location,
            website: profile?.website,
            isAdmin: currentSession.user!.email?.toLowerCase().includes('admin')
          });
          setIsLoading(false);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, isLoading, setUser };
}
