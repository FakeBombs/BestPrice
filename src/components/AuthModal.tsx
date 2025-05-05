import React, { useState, useEffect, useCallback } from 'react';
import { LogIn, UserPlus, X,  Facebook, Apple, EyeOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you have this


interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

// Custom Input Component
const Input = ({ type, value, name, placeholder, onChange, autoCapitalize, autoComplete, onFocus, onBlur }: { type: string; value: string; name: string; placeholder: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; autoCapitalize?: string; autoComplete?: string; onFocus?: () => void; onBlur?: () => void; }) => (
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
const Label = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <label className={`login__input-wrapper auth-label ${className || ''}`} {...props}>
    {children}
  </label>
);

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState(false);
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginEmailFocused, setLoginEmailFocused] = useState(false);
  const [loginPasswordFocused, setLoginPasswordFocused] = useState(false);


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
            <path fill="#fff" d="M16 24h4v10h-4z"/>
            <path fill="#fff" d="M28 14h4v10h-4z"/>
            <path fill="#fff" d="M36 18h4v10h-4z"/>
            <path fill="#06c" d="M24 48C10.8 48 0 37.2 0 24S10.8 0 24 0s24 10.8 24 24-10.8 24-24 24z"/>
            <path fill="#fff" d="M24 4C12.8 4 3.6 11.8 3.6 24S12.8 44 24 44s20.4-8.2 20.4-20S35.2 4 24 4z"/>
            <path fill="#ffba00" d="M24 16c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z"/>
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
            <div
              className="login__field-placeholder"
              style={{
                marginTop: loginEmailFocused ? '-9.75px' : '0',
                transformOrigin: loginEmailFocused ? 'left top' : 'left top', // Keep left top
              }}
              onClick={() => {
                const input = document.querySelector('input[name="usernameOrEmail"]');
                if (input) {
                  input.focus();
                }
              }}
            >
              Όνομα χρήστη ή e-mail
            </div>
            <Input
              type="text"
              value={loginEmail}
              name="usernameOrEmail"
              onChange={(e) => setLoginEmail(e.target.value)}
              autoCapitalize="none"
              placeholder=""
              onFocus={() => setLoginEmailFocused(true)}
              onBlur={() => setLoginEmailFocused(false)}

            />
          </Label>
        </div>
        <div className={
            `login__field login__field--placeholder-transition login__field--password login__field--has-toggler
            ${loginPasswordFocused ? 'login__field--focused' : ''}`
          }
          onClick={() => {
            const input = document.querySelector('input[name="password"]');
            if (input) {
              input.focus();
            }
          }}
        >
          <Label className="login__input-wrapper">
            <div

              className="login__field-placeholder"
              style={{
                marginTop: loginPasswordFocused ? '-9.75px' : '0',
                transformOrigin: loginPasswordFocused ? 'left top' : 'left top',
              }}

            >
              Κωδικός
            </div>
            <Input
              type={loginShowPassword ? 'text' : 'password'}
              value={loginPassword}
              name="password"
              onChange={(e) => setLoginPassword(e.target.value)}
              autoCapitalize="none"
              placeholder=""
              onFocus={() => setLoginPasswordFocused(true)}
              onBlur={() => setLoginPasswordFocused(false)}
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
            <div
              className="login__field-placeholder"
              style={{
                marginTop: registerEmailFocused ? '-9.75px' : '0',
                transformOrigin: registerEmailFocused ? 'left top' : 'left top', // Keep left top
              }}
              onClick={() => {
                const input = document.querySelector('input[name="email"]');
                if (input) {
                  input.focus();
                }
              }}
            >
              e-mail
            </div>
            <Input
              type="text"
              value={registerEmail}
              name="email"
              onChange={(e) => setRegisterEmail(e.target.value)}
              autoCapitalize="none"
              placeholder=""
              onFocus={() => setRegisterEmailFocused(true)}
              onBlur={() => setRegisterEmailFocused(false)}
            />
          </Label>
        </div>
        <div className="login__field login__field--placeholder-transition login__field--text">
          <Label className="login__input-wrapper">
            <div
              className="login__field-placeholder"
              style={{
                marginTop: registerFirstNameFocused ? '-9.75px' : '0',
                transformOrigin: registerFirstNameFocused ? 'left top' : 'left top', // Keep left top
              }}
              onClick={() => {
                const input = document.querySelector('input[name="firstName"]');
                if (input) {
                  input.focus();
                }
              }}
            >
              Όνομα
            </div>
            <Input
              type="text"
              value={registerFirstName}
              name="firstName"
              onChange={(e) => setRegisterFirstName(e.target.value)}
              autoCapitalize="sentences"
              placeholder=""
              onFocus={() => setRegisterFirstNameFocused(true)}
              onBlur={() => setRegisterFirstNameFocused(false)}
            />
          </Label>
        </div>
        <div className="login__field login__field--placeholder-transition login__field--text">
          <Label className="login__input-wrapper">
            <div
              className="login__field-placeholder"
              style={{
                marginTop: registerLastNameFocused ? '-9.75px' : '0',
                transformOrigin: registerLastNameFocused ? 'left top' : 'left top', // Keep left top
              }}
              onClick={() => {
                const input = document.querySelector('input[name="lastName"]');
                if (input) {
                  input.focus();
                }
              }}
            >
              Επώνυμο
            </div>
            <Input
              type="text"
              value={registerLastName}
              name="lastName"
              onChange={(e) => setRegisterLastName(e.target.value)}
              autoCapitalize="sentences"
              placeholder=""
              onFocus={() => setRegisterLastNameFocused(true)}
              onBlur={() => setRegisterLastNameFocused(false)}
            />
          </Label>
        </div>
        <div  className={
            `login__field login__field--placeholder-transition login__field--password login__field--has-toggler
            ${registerPasswordFocused ? 'login__field--focused' : ''}`
          }
          onClick={() => {
            const input = document.querySelector('input[name="password"]');
            if (input) {
              input.focus();
            }
          }}
        >
          <Label className="login__input-wrapper">
            <div
              className="login__field-placeholder"
              style={{
                marginTop: registerPasswordFocused ? '-9.75px' : '0',
                transformOrigin: registerPasswordFocused ? 'left top' : 'left top', // Keep left top
              }}
            >
              Κωδικός
            </div>
            <Input
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
    <div className="popup-placeholder popup-placeholder--modal" style={{ width: '100vw', height: '0px', maxWidth: '98vw', position: 'absolute', top: '0px' }}>
      <div className="popup-flex-center" style={{ zIndex: 2147483519 }}>
        <div id="login-popup-backdrop" className="popup-backdrop open is-modal" style={{ zIndex: 2147483519, transitionDuration: '150ms' }}></div>
        <div id="login-popup" className="popup open has-close has-close--inside is-modal" style={{ transitionDuration: '150ms', zIndex: 2147483519 }}>
          <div className="popup-body">
            <div role="button" className="close-button__wrapper pressable popup-close">
              <div className="close-button">
                <svg className="icon" aria-hidden="true" width="12" height="12">
                  <use href="/dist/images/icons/icons.svg#icon-x-12"></use>
                </svg>
              </div>
            </div>
            <div className="login__wrapper">
              <div className="login">
                {activeTab === 'login' ? renderLoginContent() : renderRegisterContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
