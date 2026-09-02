-- Worker C classification metadata for the existing detections table.
-- Safe to run more than once in the Supabase SQL Editor.

alter table public.detections
    add column if not exists detector_confidence double precision
        check (detector_confidence between 0 and 1),
    add column if not exists classification_confidence double precision
        check (classification_confidence between 0 and 1),
    add column if not exists classification_model_version text,
    add column if not exists review_required boolean not null default false;

create index if not exists detections_review_required_idx
on public.detections (
    review_required,
    created_at desc
);

comment on column public.detections.confidence is
    'Public species confidence. Uses Worker C confidence when classification is enabled.';

comment on column public.detections.detector_confidence is
    'Confidence from the bounding-box detector.';

comment on column public.detections.classification_confidence is
    'Species confidence from Worker C.';

comment on column public.detections.review_required is
    'True when confidence is below threshold or the predicted class requires mandatory review.';
