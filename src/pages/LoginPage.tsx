
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from '@/hooks/useTranslation';

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleLoginSuccess = () => {
    navigate('/');
  };
  
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };
  
  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">{t('signIn')}</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm 
            onSuccess={handleLoginSuccess}
            onForgotPassword={handleForgotPassword}
          />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('dontHaveAccount')}{' '}
              <a 
                onClick={() => navigate('/register')} 
                className="text-primary hover:underline cursor-pointer"
              >
                {t('createAccount')}
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
