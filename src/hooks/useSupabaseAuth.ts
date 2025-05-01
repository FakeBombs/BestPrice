
import { useState, useEffect, useMemo } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  display_name: string | null;
  username: string | null;
  profile_image_url: string | null;
  role: string | null;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

export const useSupabaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user || null,
        }));

        // Fetch user profile if user is logged in
        if (session?.user) {
          setTimeout(async () => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            setAuthState(prev => ({
              ...prev,
              profile,
              isAdmin: profile?.role === 'admin',
              loading: false,
            }));
          }, 0);
        } else {
          setAuthState(prev => ({
            ...prev,
            profile: null,
            isAdmin: false,
            loading: false,
          }));
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user || null,
      }));

      // Fetch user profile if user is logged in
      if (session?.user) {
        setTimeout(async () => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setAuthState(prev => ({
            ...prev,
            profile,
            isAdmin: profile?.role === 'admin',
            loading: false,
          }));
        }, 0);
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error.message);
      throw error;
    }

    return data;
  };

  const signup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Error signing up:', error.message);
      throw error;
    }

    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authState.user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', authState.user.id);

    if (error) {
      console.error('Error updating profile:', error.message);
      throw error;
    }

    // Refresh profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authState.user.id)
      .single();

    setAuthState(prev => ({
      ...prev,
      profile,
      isAdmin: profile?.role === 'admin',
    }));

    return profile;
  };

  return useMemo(() => ({
    session: authState.session,
    user: authState.user,
    profile: authState.profile,
    isAdmin: authState.isAdmin,
    loading: authState.loading,
    login,
    signup,
    logout,
    updateProfile,
  }), [authState]);
};

export default useSupabaseAuth;
