
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { AlertTriangle } from 'lucide-react';

interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  
  // Reset button disabled state after a timeout in case the isLoading state gets stuck
  useEffect(() => {
    let timer: number;
    
    if (isLoading) {
      // If still loading after 10 seconds, force enable the button
      timer = window.setTimeout(() => {
        setButtonDisabled(false);
        console.log("Register button force enabled after timeout");
      }, 10000);
    }
    
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [isLoading]);
  
  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setButtonDisabled(true);
    
    if (!validatePassword() || !terms) {
      setButtonDisabled(false);
      return;
    }
    
    try {
      console.log("Register form submitted");
      const success = await register(name, email, password);
      console.log("Registration result:", success);
      
      if (success) {
        onSuccess();
      } else {
        const errorMsg = "Registration failed. Please try again.";
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMsg = err?.message || "Registration failed. Please try again.";
      setError(errorMsg);
    } finally {
      // Enable button after a short delay to avoid rapid re-clicks
      setTimeout(() => {
        setButtonDisabled(false);
      }, 500);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex gap-2 items-start">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          type="text" 
          placeholder="John Doe" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="email@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          onBlur={validatePassword}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input 
          id="confirm-password" 
          type="password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          onBlur={validatePassword}
        />
        {passwordError && (
          <p className="text-sm text-red-500">{passwordError}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={terms} 
          onCheckedChange={(checked) => setTerms(checked as boolean)}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the{" "}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={buttonDisabled || (!terms && !isLoading)}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default RegisterForm;
