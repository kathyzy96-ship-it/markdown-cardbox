-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  type text not null check (type in ('text', 'code', 'link')),
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists cards_user_id_created_at_idx
  on public.cards (user_id, created_at desc);

alter table public.cards enable row level security;

create policy "cards_select_own"
  on public.cards for select
  using (auth.uid() = user_id);

create policy "cards_insert_own"
  on public.cards for insert
  with check (auth.uid() = user_id);

create policy "cards_update_own"
  on public.cards for update
  using (auth.uid() = user_id);

create policy "cards_delete_own"
  on public.cards for delete
  using (auth.uid() = user_id);
