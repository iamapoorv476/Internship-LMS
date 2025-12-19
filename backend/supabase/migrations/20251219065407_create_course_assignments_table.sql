
create table if not exists public.course_assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null,
  student_id uuid not null,
  assigned_at timestamptz default now(),

  constraint fk_assignment_course
    foreign key (course_id)
    references public.courses(id)
    on delete cascade,

  constraint fk_assignment_student
    foreign key (student_id)
    references public.users(id)
    on delete cascade,

  constraint uq_course_student
    unique (course_id, student_id)
);

create index if not exists idx_assignments_course_id on public.course_assignments(course_id);
create index if not exists idx_assignments_student_id on public.course_assignments(student_id);
