-- Profiles should only be accessed through the server API using the service role.
-- Public SELECT exposed edit_token to anyone with the Supabase anon/publishable key.
drop policy if exists "Profiles are publicly readable" on public.profiles;
