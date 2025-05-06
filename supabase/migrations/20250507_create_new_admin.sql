
-- Create a new admin user as a backup
-- This will create a new user with admin privileges if it doesn't exist

-- Define variables
DO $$
DECLARE
  admin_email TEXT := 'admin@example.com';
  admin_password TEXT := 'Admin123!';
  admin_id uuid;
  user_exists boolean;
BEGIN
  -- Check if user exists
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = admin_email) INTO user_exists;
  
  IF NOT user_exists THEN
    -- Create the user in auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      uuid_generate_v4(),
      'authenticated',
      'authenticated',
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin User"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO admin_id;
    
    -- Create profile with admin role
    INSERT INTO public.profiles (id, display_name, username, role)
    VALUES (admin_id, 'Admin User', 'admin', 'admin');
    
    RAISE NOTICE 'New admin user created with email: % and ID: %', admin_email, admin_id;
  ELSE
    RAISE NOTICE 'Admin user with email % already exists', admin_email;
  END IF;
END $$;
