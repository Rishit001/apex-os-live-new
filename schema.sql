-- ============================================================
-- APEX OS — Conversation History Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- conversations: one row per chat session per agent
create table if not exists conversations (
  id          uuid primary key default gen_random_uuid(),
  agent_id    text not null,              -- 'APEX' | 'ORACLE' | etc.
  title       text not null default 'New conversation',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- messages: every message in a conversation
create table if not exists messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null,
  from_agent      text,                   -- set when delegated from another agent
  delegation      jsonb,                  -- { targetAgent, message } if agent delegated
  created_at      timestamptz not null default now()
);

-- indexes for fast lookups
create index if not exists idx_conversations_agent    on conversations(agent_id);
create index if not exists idx_conversations_updated  on conversations(updated_at desc);
create index if not exists idx_messages_conversation  on messages(conversation_id, created_at asc);

-- auto-update updated_at on conversations when a message is inserted
create or replace function touch_conversation()
returns trigger language plpgsql as $$
begin
  update conversations set updated_at = now() where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists trg_touch_conversation on messages;
create trigger trg_touch_conversation
after insert on messages
for each row execute function touch_conversation();

-- RLS: disable for now (no auth). Enable and add policies when you add auth.
alter table conversations disable row level security;
alter table messages     disable row level security;
