
-- Insert password reset related translations if they don't exist
INSERT INTO public.translations (key, en, fr, de, es, el)
VALUES 
  ('checkYourEmail', 'Check your email', 'Vérifiez votre email', 'Überprüfen Sie Ihre E-Mail', 'Revisa tu correo electrónico', 'Ελέγξτε το email σας')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.translations (key, en, fr, de, es, el)
VALUES 
  ('passwordResetEmailSent', 'A password reset link has been sent to {{email}}', 'Un lien de réinitialisation a été envoyé à {{email}}', 'Ein Link zum Zurücksetzen des Passworts wurde an {{email}} gesendet', 'Se ha enviado un enlace para restablecer la contraseña a {{email}}', 'Ένας σύνδεσμος επαναφοράς κωδικού πρόσβασης έχει αποσταλεί στο {{email}}')
ON CONFLICT (key) DO NOTHING;
