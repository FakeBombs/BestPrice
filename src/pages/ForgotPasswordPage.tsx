
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleBack = () => {
    navigate("/login");
  };
  
  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">{t('resetYourPassword')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            {t('enterEmailForReset')}
          </p>
          <ForgotPasswordForm onBack={handleBack} />
        </CardContent>
      </Card>
    </div>
  );
}
