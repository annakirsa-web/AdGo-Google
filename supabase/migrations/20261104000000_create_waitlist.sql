-- One private waitlist record for each authenticated Google account.
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- Public visitors and authenticated users have no write path for another user's row.
revoke all on table public.waitlist from anon;
revoke update, delete, truncate, references, trigger on table public.waitlist from authenticated;
grant select, insert on table public.waitlist to authenticated;

drop policy if exists "Users can read their own waitlist entry" on public.waitlist;
create policy "Users can read their own waitlist entry"
  on public.waitlist for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can join once with their verified email" on public.waitlist;
create policy "Users can join once with their verified email"
  on public.waitlist for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and email = (select auth.jwt() ->> 'email')
    and created_at = transaction_timestamp()
  );
