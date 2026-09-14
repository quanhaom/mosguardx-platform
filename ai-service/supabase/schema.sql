create extension if not exists pgcrypto;


-- ============================================================
-- UPDATED_AT FUNCTION
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;


-- ============================================================
-- ACCOUNTS
--
-- One common tenant model for:
-- - household   -> MosGuardX Home / B2C
-- - organization -> MosGuardX Enterprise / B2B
-- - authority   -> Command Center / B2G
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

create index if not exists
    accounts_type_idx
on public.accounts (
    type
);

create index if not exists
    accounts_status_idx
on public.accounts (
    status
);


-- ============================================================
-- SITES
--
-- Household:
--   usually one home site
--
-- Enterprise:
--   many business sites
--
-- Authority:
--   may own / manage operational locations
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

create index if not exists
    sites_account_idx
on public.sites (
    account_id
);

create index if not exists
    sites_status_idx
on public.sites (
    status
);


-- ============================================================
-- STATIONS
-- Physical MosGuardX devices
-- ============================================================

create table if not exists public.stations (
    id text primary key,

    name text not null,

    device_key_hash text not null,

    site_id uuid
        references public.sites(id)
        on delete set null,

    serial_number text,

    hardware_version text,
    firmware_version text,

    latitude double precision,
    longitude double precision,

    address text,

    status text not null default 'offline'
        check (
            status in (
                'online',
                'offline',
                'maintenance'
            )
        ),

    installed_at timestamptz,
    last_seen_at timestamptz,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint stations_latitude_check
        check (
            latitude is null
            or latitude between -90 and 90
        ),

    constraint stations_longitude_check
        check (
            longitude is null
            or longitude between -180 and 180
        )
);


-- ============================================================
-- SAFE STATION MIGRATION
--
-- Required for databases created using the old MosGuardX
-- schema where stations already exists.
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

create index if not exists
    stations_site_idx
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
-- OBSERVATIONS
-- ============================================================

create table if not exists public.observations (
    id uuid primary key default gen_random_uuid(),

    station_id text not null
        references public.stations(id)
        on update cascade
        on delete restrict,

    idempotency_key text,

    captured_at timestamptz not null,

    received_at timestamptz not null
        default now(),

    image_path text not null,

    image_content_type text not null,

    image_width integer not null
        check (
            image_width > 0
        ),

    image_height integer not null
        check (
            image_height > 0
        ),

    temperature double precision,

    humidity double precision,

    firmware_version text,

    processing_status text not null
        default 'processing'
        check (
            processing_status in (
                'processing',
                'completed',
                'failed'
            )
        ),

    total_detected integer not null
        default 0
        check (
            total_detected >= 0
        ),

    model_version text,

    inference_ms double precision,

    error_message text,

    created_at timestamptz not null
        default now()
);


create unique index if not exists
    observations_station_idempotency_unique
on public.observations (
    station_id,
    idempotency_key
)
where idempotency_key is not null;


create index if not exists
    observations_station_captured_idx
on public.observations (
    station_id,
    captured_at desc
);


create index if not exists
    observations_received_idx
on public.observations (
    received_at desc
);


create index if not exists
    observations_status_idx
on public.observations (
    processing_status
);


-- ============================================================
-- DETECTIONS
-- ============================================================

create table if not exists public.detections (
    id bigint
        generated by default as identity
        primary key,

    observation_id uuid not null
        references public.observations(id)
        on delete cascade,

    object_type text not null
        default 'mosquito',

    class_id integer not null
        check (
            class_id >= 0
        ),

    species text not null,

    species_vi text,

    confidence double precision not null
        check (
            confidence between 0 and 1
        ),

    detector_confidence double precision
        check (
            detector_confidence between 0 and 1
        ),

    classification_confidence double precision
        check (
            classification_confidence between 0 and 1
        ),

    classification_model_version text,

    review_required boolean not null
        default false,

    x1 double precision not null,
    y1 double precision not null,
    x2 double precision not null,
    y2 double precision not null,

    normalized_x1 double precision not null
        check (
            normalized_x1 between 0 and 1
        ),

    normalized_y1 double precision not null
        check (
            normalized_y1 between 0 and 1
        ),

    normalized_x2 double precision not null
        check (
            normalized_x2 between 0 and 1
        ),

    normalized_y2 double precision not null
        check (
            normalized_y2 between 0 and 1
        ),

    created_at timestamptz not null
        default now(),

    constraint detections_box_x_check
        check (
            x2 >= x1
        ),

    constraint detections_box_y_check
        check (
            y2 >= y1
        )
);


create index if not exists
    detections_observation_idx
on public.detections (
    observation_id
);


create index if not exists
    detections_species_idx
on public.detections (
    species
);


-- ============================================================
-- SAFE DETECTIONS MIGRATION
-- ============================================================

alter table public.detections
    add column if not exists
        detector_confidence double precision
        check (
            detector_confidence between 0 and 1
        ),

    add column if not exists
        classification_confidence double precision
        check (
            classification_confidence between 0 and 1
        ),

    add column if not exists
        classification_model_version text,

    add column if not exists
        review_required boolean not null
        default false;


create index if not exists
    detections_review_required_idx
on public.detections (
    review_required,
    created_at desc
);


-- ============================================================
-- ALERTS
-- ============================================================

create table if not exists public.alerts (
    id uuid primary key
        default gen_random_uuid(),

    station_id text not null
        references public.stations(id)
        on update cascade
        on delete restrict,

    observation_id uuid
        references public.observations(id)
        on delete set null,

    level text not null
        check (
            level in (
                'low',
                'medium',
                'high',
                'critical'
            )
        ),

    title text not null,

    message text not null,

    status text not null
        default 'new'
        check (
            status in (
                'new',
                'acknowledged',
                'resolved'
            )
        ),

    created_at timestamptz not null
        default now(),

    acknowledged_at timestamptz,

    resolved_at timestamptz
);


create index if not exists
    alerts_station_created_idx
on public.alerts (
    station_id,
    created_at desc
);


create index if not exists
    alerts_status_idx
on public.alerts (
    status
);


create index if not exists
    alerts_observation_idx
on public.alerts (
    observation_id
);


-- ============================================================
-- MAINTENANCE JOBS
-- ============================================================

create table if not exists public.maintenance_jobs (
    id uuid primary key
        default gen_random_uuid(),

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

    job_type text not null
        default 'inspection'
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

    priority text not null
        default 'medium'
        check (
            priority in (
                'low',
                'medium',
                'high',
                'critical'
            )
        ),

    status text not null
        default 'scheduled'
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

    created_at timestamptz not null
        default now(),

    updated_at timestamptz not null
        default now()
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
    maintenance_jobs_alert_idx
on public.maintenance_jobs (
    source_alert_id
);


create index if not exists
    maintenance_jobs_status_idx
on public.maintenance_jobs (
    status,
    scheduled_at
);


-- ============================================================
-- ACCOUNT MEMBERS
--
-- user_id is intended to map to Supabase Auth user IDs.
-- FK to auth.users is intentionally not required yet.
-- ============================================================

create table if not exists public.account_members (
    id uuid primary key
        default gen_random_uuid(),

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

    status text not null
        default 'active'
        check (
            status in (
                'active',
                'invited',
                'disabled'
            )
        ),

    created_at timestamptz not null
        default now(),

    updated_at timestamptz not null
        default now(),

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
-- UPDATED_AT TRIGGERS
-- ============================================================

drop trigger if exists
    accounts_set_updated_at
on public.accounts;

create trigger
    accounts_set_updated_at
before update
on public.accounts
for each row
execute function public.set_updated_at();


drop trigger if exists
    sites_set_updated_at
on public.sites;

create trigger
    sites_set_updated_at
before update
on public.sites
for each row
execute function public.set_updated_at();


drop trigger if exists
    stations_set_updated_at
on public.stations;

create trigger
    stations_set_updated_at
before update
on public.stations
for each row
execute function public.set_updated_at();


drop trigger if exists
    maintenance_jobs_set_updated_at
on public.maintenance_jobs;

create trigger
    maintenance_jobs_set_updated_at
before update
on public.maintenance_jobs
for each row
execute function public.set_updated_at();


drop trigger if exists
    account_members_set_updated_at
on public.account_members;

create trigger
    account_members_set_updated_at
before update
on public.account_members
for each row
execute function public.set_updated_at();


-- ============================================================
-- STORAGE BUCKET: OBSERVATION IMAGES
-- ============================================================

insert into storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
values (
    'mosguardx-observations',
    'mosguardx-observations',
    false,
    10485760,
    array[
        'image/jpeg',
        'image/png',
        'image/webp'
    ]
)
on conflict (id)
do update
set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;


-- ============================================================
-- STORAGE BUCKET: AI MODELS
-- ============================================================

insert into storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
values (
    'mosguardx-models',
    'mosguardx-models',
    false,
    104857600,
    array[
        'application/octet-stream',
        'application/x-pytorch'
    ]
)
on conflict (id)
do update
set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;


-- ============================================================
-- ROW LEVEL SECURITY
--
-- Backend currently uses the Supabase service-role key.
-- Service role bypasses RLS.
-- Frontend should NOT access these tables directly.
-- ============================================================

alter table public.accounts
    enable row level security;

alter table public.sites
    enable row level security;

alter table public.stations
    enable row level security;

alter table public.observations
    enable row level security;

alter table public.detections
    enable row level security;

alter table public.alerts
    enable row level security;

alter table public.maintenance_jobs
    enable row level security;

alter table public.account_members
    enable row level security;


-- ============================================================
-- OPTIONAL DEVELOPMENT SEED
--
-- Uncomment only when you want initial B2B demo records.
-- ============================================================

-- insert into public.accounts (
--     type,
--     name,
--     slug
-- )
-- values (
--     'organization',
--     'MosGuardX Demo Enterprise',
--     'demo-enterprise'
-- )
-- on conflict (slug)
-- do nothing;


-- insert into public.sites (
--     account_id,
--     code,
--     name,
--     site_type,
--     address
-- )
-- select
--     account.id,
--     'SITE-01',
--     'Office Building A',
--     'office',
--     'Hà Nội'
-- from public.accounts account
-- where account.slug = 'demo-enterprise'
-- on conflict (
--     account_id,
--     code
-- )
-- do nothing;


-- insert into public.sites (
--     account_id,
--     code,
--     name,
--     site_type,
--     address
-- )
-- select
--     account.id,
--     'SITE-02',
--     'Hotel Site B',
--     'hotel',
--     'Hà Nội'
-- from public.accounts account
-- where account.slug = 'demo-enterprise'
-- on conflict (
--     account_id,
--     code
-- )
-- do nothing;


-- insert into public.sites (
--     account_id,
--     code,
--     name,
--     site_type,
--     address
-- )
-- select
--     account.id,
--     'SITE-03',
--     'Facility C',
--     'facility',
--     'Hà Nội'
-- from public.accounts account
-- where account.slug = 'demo-enterprise'
-- on conflict (
--     account_id,
--     code
-- )
-- do nothing;x x   