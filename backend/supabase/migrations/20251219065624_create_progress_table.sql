
create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null,
  chapter_id uuid not null,
  completed_at timestamptz default now(),

  constraint fk_progress_student
    foreign key (student_id)
    references public.users(id)
    on delete cascade,

  constraint fk_progress_chapter
    foreign key (chapter_id)
    references public.chapters(id)
    on delete cascade,

  constraint uq_student_chapter
    unique (student_id, chapter_id)
);

create index if not exists idx_progress_student_id on public.progress(student_id);
create index if not exists idx_progress_chapter_id on public.progress(chapter_id);
