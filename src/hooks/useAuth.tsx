
import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

// Mock user data
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'facebook' | 'twitter') => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Mock login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll accept any email/password
      const user: User = {
        id: 'user1',
        name: email.split('@')[0],
        email,
        avatar: `https://placehold.co/100x100?text=${email.charAt(0).toUpperCase()}`
      };
      
      setUser(user);
      toast({
        title: "Επιτυχής σύνδεση",
        description: "Καλώς ήρθατε στο BestPrice!"
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Σφάλμα Σύνδεσης",
        description: "Λάθος email ή κωδικός."
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mock register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: 'user1',
        name,
        email,
        avatar: `https://placehold.co/100x100?text=${name.charAt(0).toUpperCase()}`
      };
      
      setUser(user);
      toast({
        title: "Επιτυχής εγγραφή",
        description: "Ο λογαριασμός σας δημιουργήθηκε επιτυχώς."
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Σφάλμα Εγγραφής",
        description: "Το email που χρησιμοποιήσατε υπάρχει ήδη."
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mock social login function
  const socialLogin = async (provider: 'google' | 'facebook' | 'twitter'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: 'user1',
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        email: `user@${provider}.com`,
        avatar: `https://placehold.co/100x100?text=${provider.charAt(0).toUpperCase()}`
      };
      
      setUser(user);
      toast({
        title: "Επιτυχής σύνδεση",
        description: `Συνδεθήκατε με επιτυχία μέσω ${provider}.`
      });
      
      return true;
    } catch (error) {
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
  const logout = () => {
    setUser(null);
    toast({
      title: "Αποσύνδεση",
      description: "Αποσυνδεθήκατε επιτυχώς."
    });
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        register, 
        socialLogin, 
        logout 
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
