import React, { useState, useEffect, useCallback } from 'react';
import { LogIn, UserPlus, X, EyeOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Input = ({ type, value, name, placeholder, onChange, autoCapitalize, autoComplete, onFocus, onBlur }) => (
  <input type={type} value={value} name={name} placeholder={placeholder} onChange={onChange} className="login__input-field auth-input" autoCapitalize={autoCapitalize} autoComplete={autoComplete} onFocus={onFocus} onBlur={onBlur} />
);
const Label = ({ children, className, ...props }) => (
  <label className={`login__input-wrapper auth-label ${className || ''}`} {...props}>
    {children}
  </label>
);

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loginEmail, setLoginEmail] = useState(''), [loginPassword, setLoginPassword] = useState(''), [loginShowPassword, setLoginShowPassword] = useState(false), [loginEmailFocused, setLoginEmailFocused] = useState(false), [loginPasswordFocused, setLoginPasswordFocused] = useState(false);
  const [registerEmail, setRegisterEmail] = useState(''), [registerFirstName, setRegisterFirstName] = useState(''), [registerLastName, setRegisterLastName] = useState(''), [registerPassword, setRegisterPassword] = useState(''), [registerConsentTerms, setRegisterConsentTerms] = useState(false),
    [registerConsentNewsletters, setRegisterConsentNewsletters] = useState(false), [registerShowPassword, setRegisterShowPassword] = useState(false), [registerEmailFocused, setRegisterEmailFocused] = useState(false),
    [registerFirstNameFocused, setRegisterFirstNameFocused] = useState(false), [registerLastNameFocused, setRegisterLastNameFocused] = useState(false), [registerPasswordFocused, setRegisterPasswordFocused] = useState(false);

  useEffect(() => { setActiveTab(defaultTab); }, [defaultTab]);

  const handleLogin = useCallback((e) => {
    e.preventDefault();
    console.log('Login:', { email: loginEmail, password: loginPassword });
    onClose();
  }, [onClose, loginEmail, loginPassword]);

  const handleRegister = useCallback((e) => {
    e.preventDefault();
    console.log('Register:', { email: registerEmail, firstName: registerFirstName, lastName: registerLastName, password: registerPassword, consentTerms: registerConsentTerms, consentNewsletters: registerConsentNewsletters });
    onClose();
  }, [onClose, registerEmail, registerFirstName, registerLastName, registerPassword, registerConsentTerms, registerConsentNewsletters]);

  const focusInput = (inputName) => {
    const input = document.querySelector(`input[name="${inputName}"]`);
    if (input) input.focus();
  };

  const renderLoginContent = () => {
    const isEmailFilled = loginEmail !== '', isPasswordFilled = loginPassword !== '';
    return (
      <div className="login__view login__view--signin">
        <div className="login__providers">
          <button className="login__provider login__provider--google pressable" onClick={() => console.log('Google Login')}><div><svg className="icon" aria-hidden="true" width={24} height={24}><use href="/dist/images/icons/providers.svg#icon-google-24"></use></svg><span>Σύνδεση με Google</span></div></button>
          <button className="login__provider login__provider--fb pressable" onClick={() => console.log('Facebook Login')}><div><svg className="icon" aria-hidden="true" width={24} height={24}><use href="/dist/images/icons/providers.svg#icon-facebook-white-24"></use></svg><span>Σύνδεση με Facebook</span></div></button>
          <button className="login__provider login__provider--apple pressable" onClick={() => console.log('Apple Login')}><div><svg className="icon" aria-hidden="true" width={24} height={24}><use href="/dist/images/icons/providers.svg#icon-apple-white-24"></use></svg><span>Σύνδεση με Apple</span></div></button>
        </div>
        <div className="login__sub-title">Σύνδεση με όνομα χρήστη ή e-mail</div>
        <form method="post" className="login__form" onSubmit={(e) => { e.preventDefault(); handleLogin(e); }}>
          <div className={`login__field login__field--placeholder-transition login__field--text ${loginEmailFocused || isEmailFilled ? 'login__field--focused' : ''}`} onClick={() => focusInput('usernameOrEmail')}>
            <Label className="login__input-wrapper">
              <div className="login__field-placeholder" style={{ marginTop: loginEmailFocused || isEmailFilled ? '-8.2875px' : '-9.75px', transformOrigin: 'left top', transform: loginEmailFocused || isEmailFilled ? 'scale(0.85) translateY(-33.6765px)' : 'none' }}>Όνομα χρήστη ή e-mail</div>
              <Input type="text" value={loginEmail} name="usernameOrEmail" onChange={(e) => setLoginEmail(e.target.value)} autoCapitalize="none" placeholder="" onFocus={() => setLoginEmailFocused(true)} onBlur={() => setLoginEmailFocused(false)} />
            </Label>
          </div>
          <div className={`login__field login__field--placeholder-transition login__field--password login__field--has-toggler ${loginPasswordFocused || isPasswordFilled ? 'login__field--focused' : ''}`} onClick={() => focusInput('password')}>
            <Label className="login__input-wrapper">
              <div className="login__field-placeholder" style={{ marginTop: loginPasswordFocused || isPasswordFilled ? '-8.2875px' : '-9.75px', transformOrigin: 'left top', transform: loginPasswordFocused || isPasswordFilled ? 'scale(0.85) translateY(-33.6765px)' : 'none' }}>Κωδικός</div>
              <Input type={loginShowPassword ? 'text' : 'password'} value={loginPassword} name="password" onChange={(e) => setLoginPassword(e.target.value)} autoCapitalize="none" placeholder="" onFocus={() => setLoginPasswordFocused(true)} onBlur={() => setLoginPasswordFocused(false)} />
              <div className="tooltip__anchor" onClick={() => setLoginShowPassword(!loginShowPassword)}>{loginShowPassword ? <Eye className="icon icon pressable" /> : <EyeOff className="icon icon pressable" />}</div>
            </Label>
          </div>
          <div className="login__actions"><Button type="submit" className="button" disabled={!loginEmail || !loginPassword}>Σύνδεση</Button></div>
          <div className="login__forgot"><span className="foo-link" onClick={() => console.log('Forgot Password')}>Υπενθύμιση Κωδικού</span></div>
        </form>
        <div className="login__footer"><span className="foo-link" onClick={() => setActiveTab('register')}>Δημιουργία λογαριασμού</span></div>
      </div>
    );
  };

  const renderRegisterContent = () => {
    const isEmailFilled = registerEmail !== '', isFirstNameFilled = registerFirstName !== '', isLastNameFilled = registerLastName !== '', isPasswordFilled = registerPassword !== '';
    return (
      <div className="login__view">
        <div className="login__providers">
          <button className="login__provider login__provider--google pressable" onClick={() => console.log('Google Register')}><div><svg className="icon" aria-hidden="true" width={24} height={24}><use href="/dist/images/icons/providers.svg#icon-google-24"></use></svg><span>Εγγραφή με Google</span></div></button>
          <button className="login__provider login__provider--fb pressable" onClick={() => console.log('Facebook Register')}><div><svg className="icon" aria-hidden="true" width={24} height={24}><use href="/dist/images/icons/providers.svg#icon-facebook-white-24"></use></svg><span>Εγγραφή με Facebook</span></div></button>
          <button className="login__provider login__provider--apple pressable" onClick={() => console.log('Apple Register')}><div><svg className="icon" aria-hidden="true" width={24} height={24}><use href="/dist/images/icons/providers.svg#icon-apple-white-24"></use></svg><span>Εγγραφή με Apple</span></div></button>
        </div>
        <div className="login__sub-title">Εγγραφή με χρήση e-mail</div>
        <form method="post" className="login__form" onSubmit={(e) => { e.preventDefault(); handleRegister(e); }}>
          <div className={`login__field login__field--placeholder-transition login__field--text ${registerEmailFocused || isEmailFilled ? 'login__field--focused' : ''}`} onClick={() => focusInput('email')}>
            <Label className="login__input-wrapper">
              <div className="login__field-placeholder" style={{ marginTop: registerEmailFocused || isEmailFilled ? '-8.2875px' : '-9.75px', transformOrigin: 'left top', transform: registerEmailFocused || isEmailFilled ? 'scale(0.85) translateY(-33.6765px)' : 'none' }}>e-mail</div>
              <Input type="text" value={registerEmail} name="email" onChange={(e) => setRegisterEmail(e.target.value)} autoCapitalize="none" placeholder="" onFocus={() => setRegisterEmailFocused(true)} onBlur={() => setRegisterEmailFocused(false)} />
            </Label>
          </div>
          <div className={`login__field login__field--placeholder-transition login__field--text ${registerFirstNameFocused || isFirstNameFilled ? 'login__field--focused' : ''}`} onClick={() => focusInput('firstName')}>
            <Label className="login__input-wrapper">
              <div className="login__field-placeholder" style={{ marginTop: registerFirstNameFocused || isFirstNameFilled ? '-8.2875px' : '-9.75px', transformOrigin: 'left top', transform: registerFirstNameFocused || isFirstNameFilled ? 'scale(0.85) translateY(-33.6765px)' : 'none' }}>Όνομα</div>
              <Input type="text" value={registerFirstName} name="firstName" onChange={(e) => setRegisterFirstName(e.target.value)} autoCapitalize="sentences" placeholder="" onFocus={() => setRegisterFirstNameFocused(true)} onBlur={() => setRegisterFirstNameFocused(false)} />
            </Label>
          </div>
          <div className={`login__field login__field--placeholder-transition login__field--text ${registerLastNameFocused || isLastNameFilled ? 'login__field--focused' : ''}`} onClick={() => focusInput('lastName')}>
            <Label className="login__input-wrapper">
              <div className="login__field-placeholder" style={{ marginTop: registerLastNameFocused || isLastNameFilled ? '-8.2875px' : '-9.75px', transformOrigin: 'left top', transform: registerLastNameFocused || isLastNameFilled ? 'scale(0.85) translateY(-33.6765px)' : 'none' }}>Επώνυμο</div>
              <Input type="text" value={registerLastName} name="lastName" onChange={(e) => setRegisterLastName(e.target.value)} autoCapitalize="sentences" placeholder="" onFocus={() => setRegisterLastNameFocused(true)} onBlur={() => setRegisterLastNameFocused(false)} />
            </Label>
          </div>
          <div className={`login__field login__field--placeholder-transition login__field--password login__field--has-toggler ${registerPasswordFocused || isPasswordFilled ? 'login__field--focused' : ''}`} onClick={() => focusInput('password')}>
            <Label className="login__input-wrapper">
              <div className="login__field-placeholder" style={{ marginTop: registerPasswordFocused || isPasswordFilled ? '-8.2875px' : '-9.75px', transformOrigin: 'left top', transform: registerPasswordFocused || isPasswordFilled ? 'scale(0.85) translateY(-33.6765px)' : 'none' }}>Κωδικός</div>
              <Input type={registerShowPassword ? 'text' : 'password'} value={registerPassword} name="password" onChange={(e) => setRegisterPassword(e.target.value)} autoCapitalize="none" autoComplete="new-password" placeholder="" onFocus={() => setRegisterPasswordFocused(true)} onBlur={() => setRegisterPasswordFocused(false)} />
              <div className="tooltip__anchor" onClick={() => setRegisterShowPassword(!registerShowPassword)}>{registerShowPassword ? <Eye className="icon icon pressable" /> : <EyeOff className="icon icon pressable" />}</div>
            </Label>
          </div>
          <div className="login__consent">
            <div className="login__field login__field--placeholder-transition login__field--checkbox">
              <Label className="login__input-wrapper">
                <input type="checkbox" checked={registerConsentTerms} name="consentTerms" onChange={(e) => setRegisterConsentTerms(e.target.checked)} />
                <div className="login__field-label">Συμφωνώ με τους <a tabIndex={-1} className="dotted" target="_blank" href="/policies/terms">όρους χρήσης του BestPrice</a></div>
              </Label>
            </div>
            <div className="login__field login__field--placeholder-transition login__field--checkbox">
              <Label className="login__input-wrapper">
                <input type="checkbox" checked={registerConsentNewsletters} name="consentNewsletters" onChange={(e) => setRegisterConsentNewsletters(e.target.checked)} />
                <div className="login__field-label">Θέλω να λαμβάνω ενημερωτικά newsletters</div>
              </Label>
            </div>
          </div>
          <div className="login__actions">
            <Button type="submit" className="auth-button" disabled={!registerEmail || !registerFirstName || !registerLastName || !registerPassword || !registerConsentTerms}>Εγγραφή</Button>
          </div>
        </form>
        <div className="login__footer"><span className="foo-link" onClick={() => setActiveTab('login')}>Συνδέσου με το λογαριασμό σου</span></div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="popup-placeholder popup-placeholder--modal" style={{ width: '100vw', height: '0', maxWidth: '98vw', position: 'absolute', top: '0' }}>
      <div className="popup-flex-center" style={{ zIndex: 2147483519 }}>
        <div id="login-popup-backdrop" className="popup-backdrop open is-modal" style={{ zIndex: 2147483519, transitionDuration: '150ms' }}></div>
        <div id="login-popup" className="popup open has-close has-close--inside is-modal" style={{ transitionDuration: '150ms', zIndex: 2147483519 }}>
          <div className="popup-body">
            <div role="button" className="close-button__wrapper pressable popup-close" onClick={onClose}>
              <div className="close-button"><svg className="icon" aria-hidden="true" width={12} height={12}><use href="/dist/images/icons/icons.svg#icon-x-12"></use></svg></div>
            </div>
            <div className="login__wrapper"><div className="login">{activeTab === 'login' ? renderLoginContent() : renderRegisterContent()}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
