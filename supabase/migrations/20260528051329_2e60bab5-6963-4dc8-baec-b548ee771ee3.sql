DROP POLICY IF EXISTS "admins manage roles" ON public.user_roles;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $$
  SELECT auth.uid() = _user_id
    AND EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = _user_id
        AND role = _role
    )
$$;

DROP POLICY IF EXISTS "anyone submit message" ON public.messages;
CREATE POLICY "anyone submit valid message"
ON public.messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 160
  AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  AND length(btrim(message)) BETWEEN 1 AND 5000
  AND (phone IS NULL OR length(btrim(phone)) <= 40)
);

DROP POLICY IF EXISTS "anyone log visit" ON public.visitors;
CREATE POLICY "anyone log valid visit"
ON public.visitors
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (path IS NULL OR length(path) <= 2048)
  AND (referrer IS NULL OR length(referrer) <= 2048)
  AND (user_agent IS NULL OR length(user_agent) <= 512)
);