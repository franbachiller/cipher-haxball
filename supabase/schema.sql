-- Cipher license server schema
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- Run it once per project (dev AND prod).

-- ============================================================
-- Extensions
-- ============================================================
-- pgcrypto provides gen_random_bytes(), used to mint tokens and keys below.
-- On Supabase it lives in the `extensions` schema. Without this the RPCs fail
-- with: function gen_random_bytes(integer) does not exist.
create extension if not exists pgcrypto with schema extensions;

-- ============================================================
-- Tables
-- ============================================================

create table if not exists licenses (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  hwid text,                          -- bound on first activation
  token text unique,                  -- session token issued on activation
  status text not null default 'active' check (status in ('active', 'revoked')),
  expires_at timestamptz,             -- null = lifetime
  activated_at timestamptz,
  last_seen_at timestamptz,
  note text,                          -- optional: who this key was sold to
  created_at timestamptz not null default now()
);

create table if not exists activation_logs (
  id bigint generated always as identity primary key,
  license_id uuid references licenses(id) on delete cascade,
  event text not null,                -- 'activated' | 'verified' | 'rejected_hwid' | 'rejected_invalid'
  hwid text,
  created_at timestamptz not null default now()
);

-- RLS on, no policies: anon key cannot touch these tables directly.
alter table licenses enable row level security;
alter table activation_logs enable row level security;

-- ============================================================
-- RPC: activate_license(p_key, p_hwid)
-- Called by the launcher on first activation.
-- ============================================================

create or replace function activate_license(p_key text, p_hwid text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  lic licenses%rowtype;
  new_token text;
begin
  select * into lic from licenses where key = p_key;

  if not found then
    insert into activation_logs (license_id, event, hwid) values (null, 'rejected_invalid', p_hwid);
    return json_build_object('success', false, 'error', 'Licencia inválida');
  end if;

  if lic.status = 'revoked' then
    insert into activation_logs (license_id, event, hwid) values (lic.id, 'rejected_invalid', p_hwid);
    return json_build_object('success', false, 'error', 'Licencia revocada');
  end if;

  if lic.expires_at is not null and lic.expires_at < now() then
    insert into activation_logs (license_id, event, hwid) values (lic.id, 'rejected_invalid', p_hwid);
    return json_build_object('success', false, 'error', 'Licencia expirada');
  end if;

  -- HWID binding: first activation binds; mismatch rejects
  if lic.hwid is null then
    new_token := encode(gen_random_bytes(32), 'hex');
    update licenses
      set hwid = p_hwid,
          token = new_token,
          activated_at = now(),
          last_seen_at = now()
      where id = lic.id;
    insert into activation_logs (license_id, event, hwid) values (lic.id, 'activated', p_hwid);
    return json_build_object('success', true, 'token', new_token);
  end if;

  if lic.hwid = p_hwid then
    -- Re-activation on the same machine: reissue token
    new_token := encode(gen_random_bytes(32), 'hex');
    update licenses
      set token = new_token,
          last_seen_at = now()
      where id = lic.id;
    insert into activation_logs (license_id, event, hwid) values (lic.id, 'activated', p_hwid);
    return json_build_object('success', true, 'token', new_token);
  end if;

  insert into activation_logs (license_id, event, hwid) values (lic.id, 'rejected_hwid', p_hwid);
  return json_build_object('success', false, 'error', 'Licencia vinculada a otra máquina');
end;
$$;

-- ============================================================
-- RPC: verify_token(p_token, p_hwid)
-- Called by the launcher on every startup.
-- ============================================================

create or replace function verify_token(p_token text, p_hwid text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  lic licenses%rowtype;
begin
  select * into lic from licenses where token = p_token;

  if not found
     or lic.status = 'revoked'
     or lic.hwid is distinct from p_hwid
     or (lic.expires_at is not null and lic.expires_at < now()) then
    return json_build_object('valid', false);
  end if;

  update licenses set last_seen_at = now() where id = lic.id;
  insert into activation_logs (license_id, event, hwid) values (lic.id, 'verified', p_hwid);
  return json_build_object('valid', true);
end;
$$;

-- ============================================================
-- Lock down function execution: only anon/authenticated may call
-- ============================================================

revoke all on function activate_license(text, text) from public;
revoke all on function verify_token(text, text) from public;
grant execute on function activate_license(text, text) to anon;
grant execute on function verify_token(text, text) to anon;

-- ============================================================
-- Helper: generate a license key (run manually when you sell one)
-- Example: select generate_license_key();          -- lifetime
--          select generate_license_key(30);        -- 30 days
-- ============================================================

create or replace function generate_license_key(p_days int default null, p_note text default null)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  new_key text;
begin
  new_key := 'CIPHER-' ||
    upper(encode(gen_random_bytes(2), 'hex')) || '-' ||
    upper(encode(gen_random_bytes(2), 'hex')) || '-' ||
    upper(encode(gen_random_bytes(2), 'hex'));

  insert into licenses (key, expires_at, note)
  values (
    new_key,
    case when p_days is null then null else now() + (p_days || ' days')::interval end,
    p_note
  );

  return new_key;
end;
$$;

-- Only callable from the SQL editor / service_role, never from clients
revoke all on function generate_license_key(int, text) from public;
revoke all on function generate_license_key(int, text) from anon;
revoke all on function generate_license_key(int, text) from authenticated;
