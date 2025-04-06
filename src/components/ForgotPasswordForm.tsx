
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const { resetPassword } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await resetPassword(email);
    
    if (success) {
      setIsSuccess(true);
    }
    
    setIsLoading(false);
  };
  
  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 p-4 rounded-md flex items-center space-x-3">
          <Check className="h-5 w-5 text-green-500" />
          <p className="text-green-700">
            {t('resetPasswordEmailSent')}
          </p>
        </div>
        
        <Button 
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToLogin')}
        </Button>
      </div>
    );
  }
  
  return (
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
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? t('sendingResetLink') : t('sendResetLink')}
        </Button>
      </div>
      
      <div className="text-center">
        <Button 
          variant="link" 
          type="button" 
          onClick={onBack} 
          className="p-0 h-auto font-normal text-sm"
        >
          {t('backToLogin')}
        </Button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
