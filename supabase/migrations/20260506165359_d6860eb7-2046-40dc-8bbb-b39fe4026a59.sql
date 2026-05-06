
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS nida text,
  ADD COLUMN IF NOT EXISTS service_type text,
  ADD COLUMN IF NOT EXISTS employment_type text,
  ADD COLUMN IF NOT EXISTS company_name text;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _role public.app_role;
  _role_text text;
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, phone, nida, service_type, employment_type, company_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'nida',
    NEW.raw_user_meta_data->>'service_type',
    NEW.raw_user_meta_data->>'employment_type',
    NEW.raw_user_meta_data->>'company_name'
  );

  _role_text := NEW.raw_user_meta_data->>'role';
  IF _role_text = 'provider' THEN
    _role := 'provider';
  ELSE
    _role := 'customer';
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
