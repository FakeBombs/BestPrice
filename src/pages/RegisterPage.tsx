
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from '@/hooks/useTranslation';

export default function RegisterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleRegisterSuccess = () => {
    navigate('/');
  };
  
  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">{t('createAccount')}</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm onSuccess={handleRegisterSuccess} />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('alreadyHaveAccount')}{' '}
              <a 
                onClick={() => navigate('/login')} 
                className="text-primary hover:underline cursor-pointer"
              >
                {t('signIn')}
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
