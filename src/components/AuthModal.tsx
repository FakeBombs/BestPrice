import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeOff, Eye } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";


// Custom Input Component
const InputComponent = ({
  type,
  value,
  name,
  placeholder,
  onChange,
  autoCapitalize,
  autoComplete,
  onFocus,
  onBlur
}: {
  type: string;
  value: string;
  name: string;
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoCapitalize?: string;
  autoComplete?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}) => (
  <input
    type={type}
    value={value}
    name={name}
    placeholder={placeholder}
    onChange={onChange}
    className="login__input-field auth-input"
    autoCapitalize={autoCapitalize}
    autoComplete={autoComplete}
    onFocus={onFocus}
    onBlur={onBlur}
  />
);

// Custom Label Component
const LabelComponent = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => (
  <label className={`login__input-wrapper auth-label ${className || ''}`} {...props}>
    {children}
  </label>
);


export default function LoginPage() {
  const [user, setUser] = useState<any>(null); //  set user to null to prevent errors, since useAuth is removed
  const navigate = useNavigate();
  const t = (key: string) => key; // added a basic translation function to prevent errors
  const [authError, setAuthError] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginEmailFocused, setLoginEmailFocused] = useState(false);
  const [loginPasswordFocused, setLoginPasswordFocused] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // New state for "Forgot Password"
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState(''); // State for forgot password form
  const [forgotPasswordEmailFocused, setForgotPasswordEmailFocused] = useState(false);


  const [registerEmail, setRegisterEmail] = useState('');
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConsentTerms, setRegisterConsentTerms] = useState(false);
  const [registerConsentNewsletters, setRegisterConsentNewsletters] = useState(false);
  const [registerShowPassword, setRegisterShowPassword] = useState(false);
  const [registerEmailFocused, setRegisterEmailFocused] = useState(false);
  const [registerFirstNameFocused, setRegisterFirstNameFocused] = useState(false);
  const [registerLastNameFocused, setRegisterLastNameFocused] = useState(false);
  const [registerPasswordFocused, setRegisterPasswordFocused] = useState(false);


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

  const handleLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Login:', { email: loginEmail, password: loginPassword });
      navigate('/'); // Or wherever you want to go after successful login
    },
    [navigate, loginEmail, loginPassword]
  );

  const handleRegister = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Register:', {
        email: registerEmail,
        firstName: registerFirstName,
        lastName: registerLastName,
        password: registerPassword,
        consentTerms: registerConsentTerms,
        consentNewsletters: registerConsentNewsletters
      });
      navigate('/');
    },
    [
      navigate,
      registerEmail,
      registerFirstName,
      registerLastName,
      registerPassword,
      registerConsentTerms,
      registerConsentNewsletters
    ]
  );

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your forgot password logic here (e.g., send a reset email)
    console.log("Forgot Password Submitted", e);
    navigate('/'); // Or wherever you want to go after submission (or successful reset)
  };

  const renderLoginContent = () => {
    return (
      <div className="login__view login__view--signin">
        <div className="login__providers">
          <button
            className="login__provider login__provider--google pressable"
            onClick={() => console.log('Google Login')}
          >
            <div>
              <svg className="icon" aria-hidden="true" width={24} height={24}>
                <use href="/dist/images/icons/providers.svg#icon-google-24"></use>
              </svg>
              <span>Σύνδεση με Google</span>
            </div>
          </button>
          <button
            className="login__provider login__provider--fb pressable"
            onClick={() => console.log('Facebook Login')}
          >
            <div>
              <svg className="icon" aria-hidden="true" width={24} height={24}>
                <use href="/dist/images/icons/providers.svg#icon-facebook-white-24"></use>
              </svg>
              <span>Σύνδεση με Facebook</span>
            </div>
          </button>
          <button
            className="login__provider login__provider--apple pressable"
            onClick={() => console.log('Apple Login')}
          >
            <div>
              <svg className="icon" aria-hidden="true" width={24} height={24}>
                <use href="/dist/images/icons/providers.svg#icon-apple-white-24"></use>
              </svg>
              <span>Σύνδεση με Apple</span>
            </div>
          </button>
        </div>
        <div className="login__sub-title">Σύνδεση με όνομα χρήστη ή e-mail</div>
        <form method="post" className="login__form" onSubmit={handleLogin}>
          <div
            className={`login__field login__field--placeholder-transition login__field--text
            ${loginEmailFocused ? 'login__field--focused' : ''}`}
            onClick={() => {
              const input = document.querySelector('input[name="usernameOrEmail"]');
              if (input) {
                input.focus();
              }
            }}
          >
            <LabelComponent className="login__input-wrapper">
              <div
                className="login__field-placeholder"
                style={{
                  marginTop: loginEmailFocused ? '-8.2875px' : '-9.75px',
                  transformOrigin: 'left top',
                  transform: loginEmailFocused
                    ? 'scale(0.85) translateY(-33.6765px)'
                    : 'none'
                }}
              >
                Όνομα χρήστη ή e-mail
              </div>
              <InputComponent
                type="text"
                value={loginEmail}
                name="usernameOrEmail"
                onChange={(e) => setLoginEmail(e.target.value)}
                autoCapitalize="none"
                placeholder=""
                onFocus={() => setLoginEmailFocused(true)}
                onBlur={() => setLoginEmailFocused(false)}
              />
            </LabelComponent>
          </div>
          <div
            className={`login__field login__field--placeholder-transition login__field--password login__field--has-toggler
            ${loginPasswordFocused ? 'login__field--focused' : ''}`}
            onClick={() => {
              const input = document.querySelector('input[name="password"]');
              if (input) {
                input.focus();
              }
            }}
          >
            <LabelComponent className="login__input-wrapper">
              <div
                className="login__field-placeholder"
                style={{
                  marginTop: loginPasswordFocused ? '-8.2875px' : '-9.75px',
                  transformOrigin: 'left top',
                  transform: loginPasswordFocused
                    ? 'scale(0.85) translateY(-33.6765px)'
                    : 'none'
                }}
              >
                Κωδικός
              </div>
              <InputComponent
                type={loginShowPassword ? 'text' : 'password'}
                value={loginPassword}
                name="password"
                onChange={(e) => setLoginPassword(e.target.value)}
                autoCapitalize="none"
                placeholder=""
                onFocus={() => setLoginPasswordFocused(true)}
                onBlur={() => setLoginPasswordFocused(false)}
              />
              <div
                className="tooltip__anchor"
                onClick={() => setLoginShowPassword(!loginShowPassword)}
              >
                {loginShowPassword ? (
                  <Eye className="icon icon pressable" />
                ) : (
                  <EyeOff className="icon icon pressable" />
                )}
              </div>
            </LabelComponent>
          </div>
          <div className="login__actions">
            <Button
              type="submit"
              className="button"
              disabled={!loginEmail || !loginPassword}
            >
              Σύνδεση
            </Button>
          </div>
          <div className="login__forgot">
            <span className="foo-link" onClick={() => setShowForgotPassword(true)}>
              Υπενθύμιση Κωδικού
            </span>
          </div>
        </form>
        <div className="login__footer">
          <span className="foo-link" onClick={() => navigate('/register')}>
            Δημιουργία λογαριασμού
          </span>
        </div>
      </div>
    );
  };

  const renderRegisterContent = () => {
    return (
      <div className="login__view">
        <div className="login__providers">
          <button
            className="login__provider login__provider--google pressable"
            onClick={() => console.log('Google Register')}
          >
            <div>
              <svg className="icon" aria-hidden="true" width={24} height={24}>
                <use href="/dist/images/icons/providers.svg#icon-google-24"></use>
              </svg>
              <span>Εγγραφή με Google</span>
            </div>
          </button>
          <button
            className="login__provider login__provider--fb pressable"
            onClick={() => console.log('Facebook Register')}
          >
            <div>
              <svg className="icon" aria-hidden="true" width={24} height={24}>
                <use href="/dist/images/icons/providers.svg#icon-facebook-white-24"></use>
              </svg>
              <span>Εγγραφή με Facebook</span>
            </div>
          </button>
          <button
            className="login__provider login__provider--apple pressable"
            onClick={() => console.log('Apple Register')}
          >
            <div>
              <svg className="icon" aria-hidden="true" width={24} height={24}>
                <use href="/dist/images/icons/providers.svg#icon-apple-white-24"></use>
              </svg>
              <span>Εγγραφή με Apple</span>
            </div>
          </button>
        </div>
        <div className="login__sub-title">Εγγραφή με χρήση e-mail</div>
        <form method="post" className="login__form" onSubmit={handleRegister}>
          <div
            className={`login__field login__field--placeholder-transition login__field--text
            ${registerEmailFocused ? 'login__field--focused' : ''}`}
            onClick={() => {
              const input = document.querySelector('input[name="email"]');
              if (input) {
                input.focus();
              }
            }}
          >
            <LabelComponent className="login__input-wrapper">
              <div
                className="login__field-placeholder"
                style={{
                  marginTop: registerEmailFocused ? '-8.2875px' : '-9.75px',
                  transformOrigin: 'left top',
                  transform: registerEmailFocused
                    ? 'scale(0.85) translateY(-33.6765px)'
                    : 'none'
                }}
              >
                e-mail
              </div>
              <InputComponent
                type="text"
                value={registerEmail}
                name="email"
                onChange={(e) => setRegisterEmail(e.target.value)}
                autoCapitalize="none"
                placeholder=""
                onFocus={() => setRegisterEmailFocused(true)}
                onBlur={() => setRegisterEmailFocused(false)}
              />
            </LabelComponent>
          </div>
          <div
            className={`login__field login__field--placeholder-transition login__field--text
            ${registerFirstNameFocused ? 'login__field--focused' : ''}`}
            onClick={() => {
              const input = document.querySelector('input[name="firstName"]');
              if (input) {
                input.focus();
              }
            }}
          >
            <LabelComponent className="login__input-wrapper">
              <div
                className="login__field-placeholder"
                style={{
                  marginTop: registerFirstNameFocused ? '-8.2875px' : '-9.75px',
                  transformOrigin: 'left top',
                  transform: registerFirstNameFocused
                    ? 'scale(0.85) translateY(-33.6765px)'
                    : 'none'
                }}
              >
                Όνομα
              </div>
              <InputComponent
                type="text"
                value={registerFirstName}
                name="firstName"
                onChange={(e) => setRegisterFirstName(e.target.value)}
                autoCapitalize="sentences"
                placeholder=""
                onFocus={() => setRegisterFirstNameFocused(true)}
                onBlur={() => setRegisterFirstNameFocused(false)}
              />
            </LabelComponent>
          </div>
          <div
            className={`login__field login__field--placeholder-transition login__field--text
            ${registerLastNameFocused ? 'login__field--focused' : ''}`}
            onClick={() => {
              const input = document.querySelector('input[name="lastName"]');
              if (input) {
                input.focus();
              }
            }}
          >
            <LabelComponent className="login__input-wrapper">
              <div
                className="login__field-placeholder"
                style={{
                  marginTop: registerLastNameFocused ? '-8.2875px' : '-9.75px',
                  transformOrigin: 'left top',
                  transform: registerLastNameFocused
                    ? 'scale(0.85) translateY(-33.6765px)'
                    : 'none'
                }}
              >
                Επώνυμο
              </div>
              <InputComponent
                type="text"
                value={registerLastName}
                name="lastName"
                onChange={(e) => setRegisterLastName(e.target.value)}
                autoCapitalize="sentences"
                placeholder=""
                onFocus={() => setRegisterLastNameFocused(true)}
                onBlur={() => setRegisterLastNameFocused(false)}
              />
            </LabelComponent>
          </div>
          <div
            className={`login__field login__field--placeholder-transition login__field--password login__field--has-toggler
            ${registerPasswordFocused ? 'login__field--focused' : ''}`}
            onClick={() => {
              const input = document.querySelector('input[name="password"]');
              if (input) {
                input.focus();
              }
            }}
          >
            <LabelComponent className="login__input-wrapper">
              <div
                className="login__field-placeholder"
                style={{
                  marginTop: registerPasswordFocused ? '-8.2875px' : '-9.75px',
                  transformOrigin: 'left top',
                  transform: registerPasswordFocused
                    ? 'scale(0.85) translateY(-33.6765px)'
                    : 'none'
                }}
              >
                Κωδικός
              </div>
              <InputComponent
                type={registerShowPassword ? 'text' : 'password'}
                value={registerPassword}
                name="password"
                onChange={(e) => setRegisterPassword(e.target.value)}
                autoCapitalize="none"
                autoComplete="new-password"
                placeholder=""
                onFocus={() => setRegisterPasswordFocused(true)}
                onBlur={() => setRegisterPasswordFocused(false)}
              />
              <div
                className="tooltip__anchor"
                onClick={() => setRegisterShowPassword(!registerShowPassword)}
              >
                {registerShowPassword ? (
                  <Eye className="icon icon pressable" />
                ) : (
                  <EyeOff className="icon icon pressable" />
                )}
              </div>
            </LabelComponent>
          </div>
          <div className="login__consent">
            <div className="login__field login__field--placeholder-transition login__field--checkbox">
              <LabelComponent className="login__input-wrapper">
                <input
                  type="checkbox"
                  value={registerConsentTerms}
                  name="consentTerms"
                  onChange={(e) => setRegisterConsentTerms(e.target.checked)}
                />
                <div className="login__field-label">
                  Συμφωνώ με τους{' '}
                  <a
                    tabIndex={-1}
                    className="dotted"
                    target="_blank"
                    href="/policies/terms"
                  >
                    όρους χρήσης του BestPrice
                  </a>
                </div>
              </LabelComponent>
            </div>
            <div className="login__field login__field--placeholder-transition login__field--checkbox">
              <LabelComponent className="login__input-wrapper">
                <input
                  type="checkbox"
                  value={registerConsentNewsletters}
                  name="consentNewsletters"
                  onChange={(e) =>
                    setRegisterConsentNewsletters(e.target.checked)
                  }
                />
                <div className="login__field-label">
                  Θέλω να λαμβάνω ενημερωτικά newsletters
                </div>
              </LabelComponent>
            </div>
          </div>
          <div className="login__actions">
            <Button
              type="submit"
              className="auth-button"
              disabled={
                !registerEmail ||
                !registerFirstName ||
                !registerLastName ||
                !registerPassword ||
                !registerConsentTerms
              }
            >
              Εγγραφή
            </Button>
          </div>
        </form>
        <div className="login__footer">
          <span className="foo-link" onClick={() => navigate('/register')}>
            Δημιουργία λογαριασμού
          </span>
        </div>
      </div>
    );
  };

  const renderForgotPasswordContent = () => {
    return (
      <div className="login__view">
        <form method="post" className="login__form" onSubmit={handleForgotPasswordSubmit}>
          <div
            className={`login__field login__field--placeholder-transition login__field--text
            ${forgotPasswordEmailFocused ? 'login__field--focused' : ''}`}
            onClick={() => {
              const input = document.querySelector('input[name="usernameOrEmail"]');
              if (input) {
                input.focus();
              }
            }}
          >
            <LabelComponent className="login__input-wrapper">
              <div
                className="login__field-placeholder"
                style={{
                  marginTop: forgotPasswordEmailFocused ? '-8.2875px' : '-9.75px',
                  transformOrigin: 'left top',
                  transform: forgotPasswordEmailFocused
                    ? 'scale(0.85) translateY(-33.6765px)'
                    : 'none'
                }}
              >
                Όνομα χρήστη ή e-mail
              </div>
              <InputComponent
                autoCapitalize="none"
                type="text"
                value={forgotPasswordEmail}
                name="usernameOrEmail"
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                onFocus={() => setForgotPasswordEmailFocused(true)}
                onBlur={() => setForgotPasswordEmailFocused(false)}
              />
            </LabelComponent>
          </div>
          <div className="login__actions">
            <Button type="submit" className="button">
              Συνέχεια
            </Button>
          </div>
        </form>
        <div className="login__footer">
          <span className="foo-link" onClick={() => setShowForgotPassword(false)}>
            Σύνδεση στο BestPrice
          </span>
        </div>
      </div>
    );
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
          {showForgotPassword ? renderForgotPasswordContent() : renderLoginContent()}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('dontHaveAccount')}
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
