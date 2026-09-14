-- ============================================================
-- MosGuardX
-- Multi-platform / multi-tenant core
--
-- Existing flow is preserved:
--
-- stations
--   -> observations
--   -> detections
--   -> alerts
--
-- New hierarchy:
--
-- accounts
--   -> sites
--   -> stations
--   -> maintenance_jobs
-- ============================================================

create extension if not exists pgcrypto;


-- ============================================================
-- ACCOUNTS
-- ============================================================

create table if not exists public.accounts (
    id uuid primary key default gen_random_uuid(),

    type text not null
        check (
            type in (
                'household',
                'organization',
                'authority'
            )
        ),

    name text not null,

    slug text unique,

    status text not null default 'active'
        check (
            status in (
                'active',
                'inactive',
                'suspended'
            )
        ),

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists accounts_type_idx
on public.accounts (
    type
);

create index if not exists accounts_status_idx
on public.accounts (
    status
);


-- ============================================================
-- SITES
-- ============================================================

create table if not exists public.sites (
    id uuid primary key default gen_random_uuid(),

    account_id uuid not null
        references public.accounts(id)
        on delete cascade,

    code text,

    name text not null,

    site_type text,

    address text,

    latitude double precision,
    longitude double precision,

    timezone text not null
        default 'Asia/Ho_Chi_Minh',

    status text not null default 'active'
        check (
            status in (
                'active',
                'inactive'
            )
        ),

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint sites_latitude_check
        check (
            latitude is null
            or latitude between -90 and 90
        ),

    constraint sites_longitude_check
        check (
            longitude is null
            or longitude between -180 and 180
        ),

    constraint sites_account_code_unique
        unique (
            account_id,
            code
        )
);

create index if not exists sites_account_idx
on public.sites (
    account_id
);

create index if not exists sites_status_idx
on public.sites (
    status
);


-- ============================================================
-- EXTEND EXISTING STATIONS
-- ============================================================

alter table public.stations
    add column if not exists site_id uuid
        references public.sites(id)
        on delete set null;

alter table public.stations
    add column if not exists serial_number text;

alter table public.stations
    add column if not exists hardware_version text;

alter table public.stations
    add column if not exists installed_at timestamptz;

alter table public.stations
    add column if not exists metadata jsonb
        not null
        default '{}'::jsonb;

create index if not exists stations_site_idx
on public.stations (
    site_id
);

create unique index if not exists
    stations_serial_number_unique
on public.stations (
    serial_number
)
where serial_number is not null;


-- ============================================================
-- MAINTENANCE JOBS
-- ============================================================

create table if not exists public.maintenance_jobs (
    id uuid primary key default gen_random_uuid(),

    account_id uuid not null
        references public.accounts(id)
        on delete cascade,

    site_id uuid
        references public.sites(id)
        on delete set null,

    station_id text
        references public.stations(id)
        on update cascade
        on delete set null,

    source_alert_id uuid
        references public.alerts(id)
        on delete set null,

    title text not null,

    description text,

    job_type text not null default 'inspection'
        check (
            job_type in (
                'inspection',
                'repair',
                'replacement',
                'cleaning',
                'connectivity',
                'routine',
                'other'
            )
        ),

    priority text not null default 'medium'
        check (
            priority in (
                'low',
                'medium',
                'high',
                'critical'
            )
        ),

    status text not null default 'scheduled'
        check (
            status in (
                'scheduled',
                'in_progress',
                'completed',
                'cancelled'
            )
        ),

    assigned_to uuid,

    scheduled_at timestamptz,
    started_at timestamptz,
    completed_at timestamptz,

    notes text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists
    maintenance_jobs_account_idx
on public.maintenance_jobs (
    account_id
);

create index if not exists
    maintenance_jobs_site_idx
on public.maintenance_jobs (
    site_id
);

create index if not exists
    maintenance_jobs_station_idx
on public.maintenance_jobs (
    station_id
);

create index if not exists
    maintenance_jobs_status_idx
on public.maintenance_jobs (
    status,
    scheduled_at
);

create index if not exists
    maintenance_jobs_alert_idx
on public.maintenance_jobs (
    source_alert_id
);


-- ============================================================
-- ACCOUNT MEMBERS
--
-- user_id will later map to Supabase auth.users.id.
-- We intentionally do not add an FK to auth.users yet so
-- local development / migration remains simple.
-- ============================================================

create table if not exists public.account_members (
    id uuid primary key default gen_random_uuid(),

    account_id uuid not null
        references public.accounts(id)
        on delete cascade,

    user_id uuid not null,

    role text not null
        check (
            role in (
                'owner',
                'manager',
                'technician',
                'viewer'
            )
        ),

    status text not null default 'active'
        check (
            status in (
                'active',
                'invited',
                'disabled'
            )
        ),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint account_members_unique
        unique (
            account_id,
            user_id
        )
);

create index if not exists
    account_members_user_idx
on public.account_members (
    user_id
);

create index if not exists
    account_members_account_idx
on public.account_members (
    account_id
);


-- ============================================================
-- UPDATED_AT
-- Existing schema already contains public.set_updated_at().
-- We reuse it.
-- ============================================================

drop trigger if exists accounts_set_updated_at
on public.accounts;

create trigger accounts_set_updated_at
before update on public.accounts
for each row
execute function public.set_updated_at();


drop trigger if exists sites_set_updated_at
on public.sites;

create trigger sites_set_updated_at
before update on public.sites
for each row
execute function public.set_updated_at();


drop trigger if exists maintenance_jobs_set_updated_at
on public.maintenance_jobs;

create trigger maintenance_jobs_set_updated_at
before update on public.maintenance_jobs
for each row
execute function public.set_updated_at();


drop trigger if exists account_members_set_updated_at
on public.account_members;

create trigger account_members_set_updated_at
before update on public.account_members
for each row
execute function public.set_updated_at();


-- ============================================================
-- DEMO / DEVELOPMENT DATA
--
-- Safe to execute multiple times because slug is unique.
-- ============================================================

insert into public.accounts (
    type,
    name,
    slug
)
values (
    'organization',
    'MosGuardX Demo Enterprise',
    'demo-enterprise'
)
on conflict (slug)
do nothing;


insert into public.sites (
    account_id,
    code,
    name,
    site_type,
    address
)
select
    account.id,
    'SITE-01',
    'Office Building A',
    'office',
    'Hà Nội'
from public.accounts account
where account.slug = 'demo-enterprise'
on conflict (
    account_id,
    code
)
do nothing;


insert into public.sites (
    account_id,
    code,
    name,
    site_type,
    address
)
select
    account.id,
    'SITE-02',
    'Hotel Site B',
    'hotel',
    'Hà Nội'
from public.accounts account
where account.slug = 'demo-enterprise'
on conflict (
    account_id,
    code
)
do nothing;


insert into public.sites (
    account_id,
    code,
    name,
    site_type,
    address
)
select
    account.id,
    'SITE-03',
    'Facility C',
    'facility',
    'Hà Nội'
from public.accounts account
where account.slug = 'demo-enterprise'
on conflict (
    account_id,
    code
)
do nothing;