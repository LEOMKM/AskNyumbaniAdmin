-- AskNyumbani Admin Panel Reference Schema & Functions
-- Run this script inside Supabase SQL editor for local/testing environments.

-- Table storing backend admin users
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  pin_hash text,
  full_name text,
  role text default 'admin',
  is_active boolean default true,
  is_first_login boolean default true,
  failed_login_attempts int default 0,
  pin_created_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz default now()
);

-- Activity ledger for auditing admin work
create table if not exists public.admin_activity_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references public.admin_users(id) on delete set null,
  activity_type text not null,
  description text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Session tokens for admin panel authentication
create table if not exists public.admin_sessions (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references public.admin_users(id) on delete cascade,
  session_token text unique not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Helper: hash passwords & pins (same as database function expectation)
create or replace function public.hash_password(p_input text)
returns text language sql immutable
as $$ select encode(digest(p_input || 'admin_salt_2025', 'sha256'), 'hex'); $$;

-- Approve property image (no comment required)
create or replace function public.approve_property_image(
  p_image_id uuid,
  p_admin_user_id uuid
) returns boolean
language plpgsql security definer
as $$
declare
  v_property_id uuid;
begin
  select property_id into v_property_id from public.property_images where id = p_image_id;
  if not found then
    raise exception 'Image not found';
  end if;

  update public.property_images
     set admin_approved = true,
         admin_reviewed_at = now(),
         admin_reviewed_by = p_admin_user_id,
         admin_rejection_reason = null,
         admin_comment = null
   where id = p_image_id;

  insert into public.admin_activity_log (admin_user_id, activity_type, description, metadata)
  values (
    p_admin_user_id,
    'image_approved',
    'Approved property image',
    jsonb_build_object(
      'imageId', p_image_id,
      'propertyId', v_property_id
    )
  );

  return true;
end;
$$;

-- Reject property image (requires reason, deletes row)
create or replace function public.reject_property_image(
  p_image_id uuid,
  p_admin_user_id uuid,
  p_rejection_reason text
) returns boolean
language plpgsql security definer
as $$
declare
  v_property_id uuid;
  v_image_url text;
begin
  if p_rejection_reason is null or trim(p_rejection_reason) = '' then
    raise exception 'Rejection reason is required';
  end if;

  select property_id, image_url into v_property_id, v_image_url
    from public.property_images
   where id = p_image_id;

  if not found then
    raise exception 'Image not found';
  end if;

  insert into public.admin_activity_log (admin_user_id, activity_type, description, metadata)
  values (
    p_admin_user_id,
    'image_rejected',
    'Rejected property image',
    jsonb_build_object(
      'imageId', p_image_id,
      'propertyId', v_property_id,
      'imageUrl', v_image_url,
      'rejectionReason', p_rejection_reason
    )
  );

  delete from public.property_images where id = p_image_id;
  return true;
end;
$$;

-- Session helpers (simplified)
create or replace function public.create_admin_session(p_admin_user_id uuid)
returns text language plpgsql security definer
as $$
declare
  v_token text := encode(gen_random_bytes(24), 'hex');
  v_expiry timestamptz := now() + interval '12 hours';
begin
  insert into public.admin_sessions (admin_user_id, session_token, expires_at)
  values (p_admin_user_id, v_token, v_expiry);
  return v_token;
end;
$$;

create or replace function public.validate_admin_session(p_session_token text)
returns table (
  admin_user_id uuid,
  email text,
  full_name text,
  role text,
  is_active boolean
) language sql security definer
as $$
  select u.id, u.email, u.full_name, u.role, u.is_active
    from public.admin_sessions s
    join public.admin_users u on u.id = s.admin_user_id
   where s.session_token = p_session_token
     and s.expires_at > now();
$$;

-- Convenience view of pending images (used by dashboard)
create or replace view public.pending_image_reviews as
select
  i.*, p.title as property_title, p.address as property_address,
  p.city as property_city, prof.full_name as property_owner_name,
  prof.email as property_owner_email, prof.phone_number as property_owner_phone
from public.property_images i
join public.properties p on p.id = i.property_id
join public.profiles prof on prof.id = p.owner_id
where i.admin_approved is null
order by i.created_at asc;

-- History view for already-reviewed items
create or replace view public.image_review_history as
select
  i.*,
  p.title as property_title,
  prof.full_name as property_owner_name,
  au.full_name as reviewer_name,
  au.email as reviewer_email
from public.property_images i
join public.properties p on p.id = i.property_id
join public.profiles prof on prof.id = p.owner_id
left join public.admin_users au on au.id = i.admin_reviewed_by
where i.admin_approved is not null
order by i.admin_reviewed_at desc;
