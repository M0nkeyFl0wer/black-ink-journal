-- Safe creation of policies using conditional DO blocks

-- 1) password_recovery_tokens RLS
ALTER TABLE public.password_recovery_tokens ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'password_recovery_tokens'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.password_recovery_tokens;', pol.policyname);
  END LOOP;
END$$;

-- 2) admin_users: drop permissive ALL policy and ensure RLS
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'admin_users' AND policyname = 'Admin users can manage admin accounts'
  ) THEN
    DROP POLICY "Admin users can manage admin accounts" ON public.admin_users;
  END IF;
END$$;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3) blog_posts: drop public write policies
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'blog_posts' AND policyname = 'Allow public inserts on blog_posts'
  ) THEN
    DROP POLICY "Allow public inserts on blog_posts" ON public.blog_posts;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'blog_posts' AND policyname = 'Allow public updates on blog_posts'
  ) THEN
    DROP POLICY "Allow public updates on blog_posts" ON public.blog_posts;
  END IF;
END$$;

-- 3a) blog_posts: create admin write policies if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'blog_posts' AND policyname = 'Admins can insert blog posts'
  ) THEN
    CREATE POLICY "Admins can insert blog posts"
    ON public.blog_posts
    FOR INSERT
    TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'blog_posts' AND policyname = 'Admins can update blog posts'
  ) THEN
    CREATE POLICY "Admins can update blog posts"
    ON public.blog_posts
    FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'blog_posts' AND policyname = 'Admins can delete blog posts'
  ) THEN
    CREATE POLICY "Admins can delete blog posts"
    ON public.blog_posts
    FOR DELETE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END$$;

-- 4) user_roles policies
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing to replace
DO $$
DECLARE pol2 RECORD;
BEGIN
  FOR pol2 IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.user_roles;', pol2.policyname);
  END LOOP;
END$$;

-- Recreate minimal secure policies
DO $$
BEGIN
  CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

  CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

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
END$$;
