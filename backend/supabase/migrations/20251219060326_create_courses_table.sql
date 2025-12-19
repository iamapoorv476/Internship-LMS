
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  mentor_id uuid not null,
  created_at timestamptz default now(),

  constraint fk_courses_mentor
    foreign key (mentor_id)
    references public.users(id)
    on delete cascade
);

create index if not exists idx_courses_mentor_id on public.courses(mentor_id);
