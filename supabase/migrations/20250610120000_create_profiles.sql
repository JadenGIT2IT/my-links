create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null default '',
  bio text not null default '',
  avatar text,
  theme text not null default 'forest',
  links jsonb not null default '[]'::jsonb,
  edit_token text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_slug_idx on public.profiles (slug);

alter table public.profiles enable row level security;

create policy "Profiles are publicly readable"
  on public.profiles
  for select
  using (true);
