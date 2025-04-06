
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Facebook, Twitter } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface LoginFormProps {
  onSuccess: () => void;
  onForgotPassword?: () => void;
}

const LoginForm = ({ onSuccess, onForgotPassword }: LoginFormProps) => {
  const { login, socialLogin, isLoading } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const success = await login(email, password);
      if (success) {
        onSuccess();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials and try again.");
    }
  };
  
  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'twitter') => {
    setError(null);
    
    try {
      const success = await socialLogin(provider);
      if (success) {
        onSuccess();
      }
    } catch (err) {
      console.error(`${provider} login error:`, err);
      setError(`${provider} login failed. Please try again.`);
    }
  };
  
  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword();
    } else {
      // Fallback if no handler is provided
      window.location.href = '/forgot-password';
    }
  };
  
  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder={t('emailPlaceholder')} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password">{t('password')}</Label>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto"
              onClick={handleForgotPassword}
            >
              {t('forgotPassword')}
            </Button>
          </div>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t('loggingIn') : t('signIn')}
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t('orContinueWith')}
          </span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="h-5 w-5 mr-2">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            <path d="M1 1h22v22H1z" fill="none"/>
          </svg>
          {t('google')}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={() => handleSocialLogin('facebook')}
          disabled={isLoading}
        >
          <Facebook className="h-5 w-5 mr-2 text-blue-600" />
          {t('facebook')}
        </Button>
      </div>
      <Button 
        type="button" 
        variant="outline" 
        className="w-full" 
        onClick={() => handleSocialLogin('twitter')}
        disabled={isLoading}
      >
        <Twitter className="h-5 w-5 mr-2 text-sky-500" />
        {t('twitter')}
      </Button>
    </div>
  );
};

export default LoginForm;
