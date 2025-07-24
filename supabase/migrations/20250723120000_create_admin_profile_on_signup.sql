
-- supabase/migrations/YYYYMMDDHHMMSS_create_admin_profile_on_signup.sql

-- 1. Create the function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Insert a new row into the admin_profiles table
  -- Default role is 'admin', can be changed if needed
  insert into public.admin_profiles (user_id, role)
  values (new.id, 'admin');
  return new;
end;
$$;

-- 2. Create the trigger to call the function on new user creation
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
