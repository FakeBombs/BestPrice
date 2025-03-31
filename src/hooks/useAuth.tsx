
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'facebook' | 'twitter') => Promise<boolean>;
  logout: () => void;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is logged in on initialization
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login (in a real app, this would be an API call)
      if (email && password) {
        const user: User = {
          id: '123',
          name: email.split('@')[0],
          email,
          avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
        };
        
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        return true;
      }
      
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      return false;
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login.",
        variant: "destructive",
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
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (name && email && password) {
        const user: User = {
          id: '123',
          name,
          email,
          avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
        };
        
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        toast({
          title: "Registration Successful",
          description: "Your account has been created.",
        });
        return true;
      }
      
      toast({
        title: "Registration Failed",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return false;
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "An error occurred during registration.",
        variant: "destructive",
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
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: '123',
        name: `User via ${provider}`,
        email: `user.${provider}@example.com`,
        avatar: `https://ui-avatars.com/api/?name=User&background=random`,
        provider
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      toast({
        title: "Login Successful",
        description: `You've been logged in via ${provider}.`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Social Login Error",
        description: `An error occurred during ${provider} login.`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, socialLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
