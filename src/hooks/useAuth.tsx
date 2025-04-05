
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
  isAdmin?: boolean;
  bio?: string;
  location?: string;
  website?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'facebook' | 'twitter') => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper type for profile data
type Profile = Database['public']['Tables']['profiles']['Row'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Set up auth state listener
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
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Επιτυχής σύνδεση",
        description: "Καλώς ήρθατε στο BestPrice!"
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Σφάλμα Σύνδεσης",
        description: error.message || "Λάθος email ή κωδικός."
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
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
        title: "Επιτυχής εγγραφή",
        description: "Ο λογαριασμός σας δημιουργήθηκε επιτυχώς."
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Σφάλμα Εγγραφής",
        description: error.message || "Το email που χρησιμοποιήσατε υπάρχει ήδη."
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Social login function
  const socialLogin = async (provider: 'google' | 'facebook' | 'twitter'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider
      });
      
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Σφάλμα Σύνδεσης",
        description: `Η σύνδεση μέσω ${provider} απέτυχε.`
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Αποσύνδεση",
      description: "Αποσυνδεθήκατε επιτυχώς."
    });
  };
  
  // Update profile function
  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    
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
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: "Επιτυχής ενημέρωση",
        description: "Το προφίλ σας ενημερώθηκε με επιτυχία."
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Σφάλμα Ενημέρωσης",
        description: error.message || "Δεν ήταν δυνατή η ενημέρωση του προφίλ σας."
      });
      
      return false;
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session,
        isLoading, 
        login, 
        register, 
        socialLogin, 
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
