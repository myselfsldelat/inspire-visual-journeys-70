
-- Grant admin access to the project president
-- User ID: 244e9e89-3c31-4e36-9c80-27c1d8860c2d

INSERT INTO public.admin_profiles (id, role)
VALUES ('244e9e89-3c31-4e36-9c80-27c1d8860c2d', 'super_admin')
ON CONFLICT (id) DO UPDATE SET role = 'super_admin';
