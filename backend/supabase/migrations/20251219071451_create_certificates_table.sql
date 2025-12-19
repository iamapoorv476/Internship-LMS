
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null,
  student_id uuid not null,
  issued_at timestamptz default now(),

  constraint fk_certificate_course
    foreign key (course_id)
    references public.courses(id)
    on delete cascade,

  constraint fk_certificate_student
    foreign key (student_id)
    references public.users(id)
    on delete cascade,

  constraint uq_certificate
    unique (course_id, student_id)
);

create index if not exists idx_certificates_student_id on public.certificates(student_id);
