
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null,
  title text not null,
  description text,
  image_url text,
  video_url text,
  sequence_order integer not null,
  created_at timestamptz default now(),

  constraint fk_chapters_course
    foreign key (course_id)
    references public.courses(id)
    on delete cascade,

  constraint uq_course_sequence
    unique (course_id, sequence_order)
);

create index if not exists idx_chapters_course_id on public.chapters(course_id);
