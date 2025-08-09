-- 1) Lock down password_recovery_tokens (service-role only)
ALTER TABLE public.password_recovery_tokens ENABLE ROW LEVEL SECURITY;

-- Remove any existing policies just in case (safe if none exist)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'password_recovery_tokens'
  ) THEN
    EXECUTE (
      SELECT string_agg(format('DROP POLICY IF EXISTS %I ON public.password_recovery_tokens;', polname), ' ')
      FROM pg_policies 
      WHERE schemaname = 'public' AND tablename = 'password_recovery_tokens'
    );
  END IF;
END$$;

-- Do NOT add any public policies here; only service role should access via Edge Functions

-- 2) Harden admin_users: drop permissive policy
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'admin_users' AND polname = 'Admin users can manage admin accounts'
  ) THEN
    DROP POLICY "Admin users can manage admin accounts" ON public.admin_users;
  END IF;
END$$;

-- Ensure RLS is enabled (defense-in-depth)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
-- Intentionally create NO public policies so only service role can access.

-- 3) Blog posts: remove public write access, keep read access for published posts, add admin-only writes
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'blog_posts' AND polname = 'Allow public inserts on blog_posts'
  ) THEN
    DROP POLICY "Allow public inserts on blog_posts" ON public.blog_posts;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'blog_posts' AND polname = 'Allow public updates on blog_posts'
  ) THEN
    DROP POLICY "Allow public updates on blog_posts" ON public.blog_posts;
  END IF;
END$$;

-- Admin-only write policies using has_role
CREATE POLICY "Admins can insert blog posts"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blog posts"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blog posts"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Keep existing SELECT policy for published posts as-is

-- 4) user_roles: add proper RLS policies
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to replace (if any)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles'
  ) THEN
    EXECUTE (
      SELECT string_agg(format('DROP POLICY IF EXISTS %I ON public.user_roles;', polname), ' ')
      FROM pg_policies 
      WHERE schemaname = 'public' AND tablename = 'user_roles'
    );
  END IF;
END$$;

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
