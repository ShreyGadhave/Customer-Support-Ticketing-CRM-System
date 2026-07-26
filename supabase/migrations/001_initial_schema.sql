-- =============================================================================
-- TicketFlow — Initial Schema
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New Query)
-- or via: supabase db push
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. tickets table
-- ---------------------------------------------------------------------------
create table if not exists tickets (
  id            uuid primary key default gen_random_uuid(),
  ticket_id     text unique not null,            -- e.g. "TKT-001" — set by trigger below
  customer_name  text not null,
  customer_email text not null,
  subject       text not null,
  description   text not null default '',
  status        text not null default 'Open'
                  check (status in ('Open', 'In Progress', 'Closed')),
  priority      text not null default 'Medium'
                  check (priority in ('Low', 'Medium', 'High', 'Urgent')),
  ai_summary    text,                            -- null until AI triage runs
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. notes table
-- ---------------------------------------------------------------------------
create table if not exists notes (
  id         uuid primary key default gen_random_uuid(),
  ticket_id  uuid not null references tickets(id) on delete cascade,
  note_text  text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. ticket_id auto-increment sequence + trigger
--
-- WHY a DB trigger instead of application code?
-- If two requests arrive simultaneously and both read the current max ticket_id
-- in JS, they would generate the same number (race condition). A DB sequence +
-- trigger is atomic — Postgres serialises the counter increment so duplicates
-- are impossible.
-- ---------------------------------------------------------------------------

-- Dedicated sequence — starts at 1, never resets
create sequence if not exists tickets_ticket_id_seq start 1;

-- Trigger function: fires BEFORE INSERT, sets ticket_id if not already provided
create or replace function generate_ticket_id()
returns trigger
language plpgsql
as $$
begin
  -- Only generate if caller didn't supply one (defensive — caller never should)
  if new.ticket_id is null or new.ticket_id = '' then
    new.ticket_id := 'TKT-' || lpad(nextval('tickets_ticket_id_seq')::text, 3, '0');
  end if;
  return new;
end;
$$;

-- Attach the trigger — runs once per inserted row, before the row is written
create or replace trigger set_ticket_id
  before insert on tickets
  for each row
  execute function generate_ticket_id();

-- ---------------------------------------------------------------------------
-- 4. updated_at auto-update trigger
--
-- Keeps tickets.updated_at fresh whenever any column changes, without needing
-- the application to remember to set it.
-- ---------------------------------------------------------------------------
create or replace function touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace trigger tickets_updated_at
  before update on tickets
  for each row
  execute function touch_updated_at();

-- ---------------------------------------------------------------------------
-- 5. Indexes — speed up the most common query patterns
-- ---------------------------------------------------------------------------
create index if not exists idx_tickets_status     on tickets(status);
create index if not exists idx_tickets_created_at on tickets(created_at desc);
create index if not exists idx_notes_ticket_id    on notes(ticket_id);

-- ---------------------------------------------------------------------------
-- 6. Enable Row Level Security (RLS)
--
-- We enable RLS as a security baseline. Since this is an MVP with no auth,
-- we add a permissive "allow all" policy so the anon key can still read/write.
-- Replace these policies with auth.uid()-scoped policies when you add auth.
-- ---------------------------------------------------------------------------
alter table tickets enable row level security;
alter table notes    enable row level security;

-- Allow anon + authenticated roles to do everything (MVP — no auth yet)
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'tickets' and policyname = 'allow_all_tickets'
  ) then
    create policy allow_all_tickets on tickets for all to anon, authenticated using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'notes' and policyname = 'allow_all_notes'
  ) then
    create policy allow_all_notes on notes for all to anon, authenticated using (true) with check (true);
  end if;
end;
$$;
