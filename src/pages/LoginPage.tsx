import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from '@/hooks/useTranslation';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import AuthDebugger from "@/components/auth/AuthDebugger";

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [authError, setAuthError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for auth error in URL (common with OAuth redirects)
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    
    if (error) {
      const errorMessage = `${error}: ${errorDescription || 'Please check Supabase URL configuration.'}`;
      setAuthError(errorMessage);
      console.error("Authentication error detected:", errorMessage);
    }
    
    // If user is already logged in, redirect to home
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
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">{t('signIn')}</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm 
            onSuccess={handleLoginSuccess}
            onForgotPassword={handleForgotPassword}
            onError={(message) => setAuthError(message)}
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
      
      {/* Add auth debugger in development mode */}
      {import.meta.env.DEV && <AuthDebugger />}
    </div>
  );
}
