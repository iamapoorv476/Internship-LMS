
create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  role text not null check (role in ('student', 'mentor', 'admin')),
  is_approved boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_users_email on public.users(email);
