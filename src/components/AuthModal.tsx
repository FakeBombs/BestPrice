import React, { useState, useEffect, useCallback } from 'react';
import { LogIn, UserPlus, X,  Facebook, Apple, EyeOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you have this
// import { Input } from '@/components/ui/input';  // Removed, using custom
// import { Label } from '@/components/ui/label';  // Removed, using custom

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

// Custom Input Component (with added classes)
const Input = ({ type, value, name, placeholder, onChange, autoCapitalize, autoComplete }: { type: string; value: string; name: string; placeholder: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; autoCapitalize?: string; autoComplete?: string }) => (
  <input
    type={type}
    value={value}
    name={name}
    placeholder={placeholder}
    onChange={onChange}
    className="login__input-field auth-input" // Added login__input-field
    autoCapitalize={autoCapitalize}
    autoComplete={autoComplete}
  />
);

// Custom Label Component (with added classes)
const Label = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <label className={`login__input-wrapper auth-label ${className || ''}`} {...props}>  {/* Added login__input-wrapper */}
    {children}
  </label>
);

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginShowPassword, setLoginShowPassword] = useState(false);

  const [registerEmail, setRegisterEmail] = useState('');
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConsentTerms, setRegisterConsentTerms] = useState(false);
  const [registerConsentNewsletters, setRegisterConsentNewsletters] = useState(false);
  const [registerShowPassword, setRegisterShowPassword] = useState(false);


  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);


  const handleLogin = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email: loginEmail, password: loginPassword });
    onClose();
  }, [onClose, loginEmail, loginPassword]);

  const handleRegister = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', { email: registerEmail, firstName: registerFirstName, lastName: registerLastName, password: registerPassword, consentTerms: registerConsentTerms, consentNewsletters: registerConsentNewsletters });
    onClose();
  }, [onClose, registerEmail, registerFirstName, registerLastName, registerPassword, registerConsentTerms, registerConsentNewsletters]);

    const renderGoogleIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
            <path fill="#fbc02d" d="M43.611 20.083H42v-8H30v8H27.86c-.835 0-1.529.649-1.529 1.464v3.383c0 1.649 1.348 2.982 3.03 2.982H42v8h-8v-8h-2.13c-2.821 0-5.225-2.685-5.225-5.631s2.404-5.631 5.225-5.631H30v-8h12v8h1.611a4.96 4.96 0 0 1 3.9 7.216"/>
            <path fill="#e53935" d="M6.306 14.691c.215-1.39 1.352-2.48 2.74-2.48h13.59v4.96H9.879c-.931 0-1.706.579-1.976 1.37s-.329 1.931-.329 3.295v7.513c0 1.364.138 2.524.329 3.316.27.791 1.039 1.37 1.976 1.37h13.589v4.96c-2.804 0-5.25-1.605-6.223-3.755H6.306V14.691z"/>
            <path fill="#4285f4" d="M24.48 20.083c-2.783 0-5.053 2.35-5.053 5.131 0 2.781 2.27 5.031 5.053 5.031s5.053-2.25 5.053-5.031c0-2.781-2.27-5.131-5.053-5.131z"/>
        </svg>
    )

  const renderLoginContent = () => {


    return (
    <div className="login__view login__view--signin">
      <div className="login__providers">
        <button className="login__provider login__provider--google pressable" onClick={() => console.log('Google Login')}>
          <div>
            {renderGoogleIcon()}
            <span>Σύνδεση με Google</span>
          </div>
        </button>
        <button className="login__provider login__provider--fb pressable" onClick={() => console.log('Facebook Login')}>
          <div>
            <Facebook className="icon" />
            <span>Σύνδεση με Facebook</span>
          </div>
        </button>
        <button className="login__provider login__provider--apple pressable" onClick={() => console.log('Apple Login')}>
          <div>
            <Apple className="icon" />
            <span>Σύνδεση με Apple</span>
          </div>
        </button>
      </div>
      <div className="login__sub-title">Σύνδεση με όνομα χρήστη ή e-mail</div>
      <form method="post" className="login__form" onSubmit={(e) => {e.preventDefault(); handleLogin(e);}}>
        <div className="login__field login__field--placeholder-transition login__field--text">
          <Label className="login__input-wrapper">
            <div className="login__field-placeholder" style={{ marginTop: '-9.75px', transformOrigin: 'left top' }}>Όνομα χρήστη ή e-mail</div>
            <Input
              type="text"
              value={loginEmail}
              name="usernameOrEmail"
              onChange={(e) => setLoginEmail(e.target.value)}
              autoCapitalize="none"
              placeholder=""
            />
          </Label>
        </div>
        <div className="login__field login__field--placeholder-transition login__field--password login__field--has-toggler">
          <Label className="login__input-wrapper">
            <div className="login__field-placeholder" style={{ marginTop: '-9.75px', transformOrigin: 'left top' }}>Κωδικός</div>
            <Input
              type={loginShowPassword ? 'text' : 'password'}
              value={loginPassword}
              name="password"
              onChange={(e) => setLoginPassword(e.target.value)}
              autoCapitalize="none"
              placeholder=""
            />
            <div className="tooltip__anchor" onClick={() => setLoginShowPassword(!loginShowPassword)}>
              {loginShowPassword ? <Eye className="icon icon pressable" /> : <EyeOff className="icon icon pressable" />}
            </div>
          </Label>
        </div>
        <div className="login__actions">
          <Button type="submit" className="auth-button" disabled={!loginEmail || !loginPassword}>
            Σύνδεση
          </Button>
        </div>
        <div className="login__forgot">
          <span className="foo-link" onClick={() => console.log('Forgot Password')}>Υπενθύμιση Κωδικού</span>
        </div>
      </form>
      <div className="login__footer">
        <span className="foo-link" onClick={() => setActiveTab('register')}>Δημιουργία λογαριασμού</span>
      </div>
    </div>
  );
  }

  const renderRegisterContent = () => {

    return(
    <div className="login__view">
      <div className="login__providers">
       <button className="login__provider login__provider--google pressable" onClick={() => console.log('Google Register')}>
          <div>
            {renderGoogleIcon()}
            <span>Εγγραφή με Google</span>
          </div>
        </button>
        <button className="login__provider login__provider--fb pressable" onClick={() => console.log('Facebook Register')}>
          <div>
            <Facebook className="icon" />
            <span>Εγγραφή με Facebook</span>
          </div>
        </button>
        <button className="login__provider login__provider--apple pressable" onClick={() => console.log('Apple Register')}>
          <div>
            <Apple className="icon" />
            <span>Εγγραφή με Apple</span>
          </div>
        </button>
      </div>
      <div className="login__sub-title">Εγγραφή με χρήση e-mail</div>
      <form method="post" className="login__form" onSubmit={(e) => {e.preventDefault(); handleRegister(e);}}>
        <div className="login__field login__field--placeholder-transition login__field--text">
          <Label className="login__input-wrapper">
            <div className="login__field-placeholder" style={{ marginTop: '-9.75px', transformOrigin: 'left top' }}>e-mail</div>
            <Input
              type="text"
              value={registerEmail}
              name="email"
              onChange={(e) => setRegisterEmail(e.target.value)}
              autoCapitalize="none"
              placeholder=""
            />
          </Label>
        </div>
        <div className="login__field login__field--placeholder-transition login__field--text">
          <Label className="login__input-wrapper">
            <div className="login__field-placeholder">Όνομα</div>
            <Input
              type="text"
              value={registerFirstName}
              name="firstName"
              onChange={(e) => setRegisterFirstName(e.target.value)}
              autoCapitalize="sentences"
              placeholder=""
            />
          </Label>
        </div>
        <div className="login__field login__field--placeholder-transition login__field--text">
          <Label className="login__input-wrapper">
            <div className="login__field-placeholder">Επώνυμο</div>
            <Input
              type="text"
              value={registerLastName}
              name="lastName"
              onChange={(e) => setRegisterLastName(e.target.value)}
              autoCapitalize="sentences"
              placeholder=""
            />
          </Label>
        </div>
        <div className="login__field login__field--placeholder-transition login__field--password login__field--has-toggler">
          <Label className="login__input-wrapper">
            <div className="login__field-placeholder" style={{ marginTop: '-9.75px', transformOrigin: 'left top' }}>Κωδικός</div>
            <Input
              type={registerShowPassword ? 'text' : 'password'}
              value={registerPassword}
              name="password"
              onChange={(e) => setRegisterPassword(e.target.value)}
              autoCapitalize="none"
              autoComplete="new-password"
              placeholder=""
            />
             <div className="tooltip__anchor" onClick={() => setRegisterShowPassword(!registerShowPassword)}>
             {registerShowPassword ? <Eye className="icon icon pressable" /> : <EyeOff className="icon icon pressable" />}
            </div>
          </Label>
        </div>
        <div className="login__consent">
          <div className="login__field login__field--placeholder-transition login__field--checkbox">
            <Label className="login__input-wrapper">
              <input
                type="checkbox"
                value={registerConsentTerms}
                name="consentTerms"
                onChange={(e) => setRegisterConsentTerms(e.target.checked)}

              />
              <div className="login__field-label">
                Συμφωνώ με τους <a tabIndex={-1} className="dotted" target="_blank" href="/policies/terms">
                  όρους χρήσης του BestPrice
                </a>
              </div>
            </Label>
          </div>
          <div className="login__field login__field--placeholder-transition login__field--checkbox">
            <Label className="login__input-wrapper">
              <input
                type="checkbox"
                value={registerConsentNewsletters}
                name="consentNewsletters"
                onChange={(e) => setRegisterConsentNewsletters(e.target.checked)}
              />
              <div className="login__field-label">Θέλω να λαμβάνω ενημερωτικά newsletters</div>
            </Label>
          </div>
        </div>
        <div className="login__actions">
          <Button type="submit" className="auth-button" disabled={!registerEmail || !registerFirstName || !registerLastName || !registerPassword || !registerConsentTerms}>
            Εγγραφή
          </Button>
        </div>
      </form>
      <div className="login__footer">
        <span className="foo-link" onClick={() => setActiveTab('login')}>Συνδέσου με το λογαριασμό σου</span>
      </div>
    </div>
  );
  }

  if (!isOpen) return null;

  return (
    <div  style={{zIndex: 2147483509}}>
        <div  style={{ transitionDuration: '150ms', zIndex: 2147483483 }}>
                {activeTab === 'login' ? renderLoginContent() : renderRegisterContent()}
        </div>
    </div>
  );
};

export default AuthModal;
