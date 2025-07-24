
-- Grant super_admin access to the user igorofyeshua@gmail.com
-- User ID: 32d08b5a-d9f3-42f2-8943-326a5a0a6c09

INSERT INTO public.admin_profiles (id, role)
VALUES ('32d08b5a-d9f3-42f2-8943-326a5a0a6c09', 'super_admin')
ON CONFLICT (id) DO UPDATE SET role = 'super_admin';
