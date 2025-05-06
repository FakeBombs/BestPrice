
-- Ensure the admin user exists and has the proper role
-- This script will create the user if it doesn't exist or update it if it does

-- First check if the admin user exists
DO $$
DECLARE
  admin_id uuid;
  user_exists boolean;
BEGIN
  -- Check if user exists in auth.users
  SELECT id INTO admin_id FROM auth.users WHERE email = 'chrissfreezers@gmail.com';
  user_exists := admin_id IS NOT NULL;

  IF user_exists THEN
    -- User exists, ensure they have a profile with admin role
    RAISE NOTICE 'Admin user exists with ID: %', admin_id;
    
    -- Check if profile exists
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = admin_id) THEN
      -- Update profile to ensure admin role
      UPDATE public.profiles
      SET role = 'admin',
          display_name = COALESCE(display_name, 'Chris')
      WHERE id = admin_id;
      
      RAISE NOTICE 'Admin profile updated';
    ELSE
      -- Create profile with admin role
      INSERT INTO public.profiles (id, display_name, username, role)
      VALUES (admin_id, 'Chris', 'chrissfreezers', 'admin');
      
      RAISE NOTICE 'Admin profile created';
    END IF;
  ELSE
    RAISE NOTICE 'Admin user does not exist in auth.users table';
  END IF;
END $$;
