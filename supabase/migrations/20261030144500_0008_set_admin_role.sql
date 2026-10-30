-- Migration: 0008_set_admin_role.sql
-- Description: Assigns platform administrator status to adeolalasisi6@gmail.com
-- Targets table: public.profiles

-- 1. Direct update for any existing user profile matching adeolalasisi6@gmail.com
UPDATE public.profiles
SET is_admin = true,
    updated_at = NOW()
WHERE id IN (
  SELECT id FROM auth.users WHERE lower(email) = 'adeolalasisi6@gmail.com'
);

-- 2. Trigger function to ensure any subsequent sign-up or profile update for adeolalasisi6@gmail.com stays admin
CREATE OR REPLACE FUNCTION public.handle_admin_role_sync()
RETURNS TRIGGER AS $$
BEGIN
  IF lower(NEW.email) = 'adeolalasisi6@gmail.com' THEN
    UPDATE public.profiles
    SET is_admin = true
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

