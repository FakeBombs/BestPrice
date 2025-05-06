
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const { resetPassword, isLoading } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      console.log("Initiating password reset for:", email);
      const success = await resetPassword(email);
      
      if (success) {
        setIsSuccess(true);
      } else {
        setError('Password reset failed. Please try again.');
      }
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err?.message || 'An unexpected error occurred');
    }
  };
  
  if (isSuccess) {
    return (
      <div className="space-y-4">
        <div className="bg-green-100 text-green-800 p-4 rounded-md flex items-start gap-3">
          <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">{t('checkYourEmail')}</p>
            <p className="text-sm mt-1">
              {t('passwordResetEmailSent', { email })}
            </p>
          </div>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={onBack}
        >
          {t('backToLogin')}
        </Button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex gap-2 items-start">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
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
      
      <div className="flex flex-col space-y-2">
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? t('sendingResetLink') : t('sendResetLink')}
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={onBack}
        >
          {t('backToLogin')}
        </Button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
