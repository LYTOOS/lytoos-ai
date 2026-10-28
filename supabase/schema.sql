-- Lytoos AI - Supabase Schema (jalankan di Supabase Dashboard > SQL Editor > New Query > Run)
-- Gratis: buat project di https://supabase.com

create extension if not exists pgcrypto;

-- Lytoos API keys yang user buat sendiri (untuk akses gateway Lytoos)
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null default 'My Lytoos Key',
  key_prefix text not null,          -- sk-lytoos-xxxx (hanya prefix, aman ditampilkan)
  key_hash text not null unique,     -- sha256(full key), full key TIDAK pernah disimpan
  revoked boolean not null default false,
  quota_monthly int not null default 100000,  -- request / bulan, ubah sesukamu (gratis = self-hosted quota)
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

-- Provider keys BYOK (opsional: simpan key gratis user per provider, terenkripsi di aplikasi sebelum insert)
create table if not exists public.provider_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  provider text not null check (provider in ('muse','agnes','gemini','deepseek','kimi','openai','seedance')),
  encrypted_key text not null,
  label text,
  is_active boolean not null default true,
  rate_limited_until timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, provider, label)
);

-- Log penggunaan & fallback (untuk dashboard & debugging rate-limit)
create table if not exists public.usage_logs (
  id bigint generated always as identity primary key,
  api_key_id uuid references public.api_keys(id) on delete set null,
  user_id uuid,
  model_requested text,
  model_used text,
  provider text,
  status int,
  latency_ms int,
  fallback_chain jsonb default '[]'::jsonb,
  prompt_tokens int default 0,
  completion_tokens int default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_usage_created on public.usage_logs(created_at desc);
create index if not exists idx_apikeys_hash on public.api_keys(key_hash);

-- RLS: aktifkan, service-role (dipakai API route server) bypass RLS. Dashboard user hanya lihat miliknya.
alter table public.api_keys enable row level security;
alter table public.provider_keys enable row level security;
alter table public.usage_logs enable row level security;

create policy "own api_keys" on public.api_keys for all using (auth.uid() = user_id);
create policy "own provider_keys" on public.provider_keys for all using (auth.uid() = user_id);
create policy "own usage" on public.usage_logs for select using (auth.uid() = user_id);
