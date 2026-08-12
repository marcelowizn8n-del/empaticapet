-- ============================================================
-- Empática Pet — Relatório de Internação / Passagem de Plantão
-- Execute este SQL no Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- Requer que o arquivo supabase-setup.sql já tenha sido executado (tabela profiles).
-- ============================================================

-- 1. Tabela de internações (pets internados)
create table if not exists public.internacoes (
  id uuid primary key default gen_random_uuid(),
  pet_name text not null,
  species text not null default 'cão' check (species in ('cão', 'gato', 'outro')),
  breed text,
  tutor_name text,
  box text,                       -- leito / box / baia
  reason text not null,           -- motivo da internação
  status text not null default 'internado'
    check (status in ('internado', 'observacao', 'critico', 'alta')),
  admitted_at timestamptz not null default now(),
  discharged_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 2. Tabela de relatórios de plantão (passagem de plantão)
create table if not exists public.shift_reports (
  id uuid primary key default gen_random_uuid(),
  internacao_id uuid not null references public.internacoes(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  author_name text,
  shift_label text,               -- ex: 'Plantão Diurno', 'Plantão Noturno'
  written_report text,            -- relatório digitado pelo profissional
  audio_url text,                 -- caminho do áudio no Storage (bucket plantao-audios)
  transcription text,             -- transcrição do áudio (OpenAI)
  ai_summary jsonb,               -- resumo estruturado gerado pela IA (Claude)
  created_at timestamptz default now()
);

create index if not exists shift_reports_internacao_idx
  on public.shift_reports (internacao_id, created_at desc);

-- 3. Row Level Security
alter table public.internacoes enable row level security;
alter table public.shift_reports enable row level security;

-- Helper: o usuário autenticado é veterinário ou admin?
-- (usado nas políticas abaixo via subconsulta)

-- Internações: veterinários e admins têm acesso total
drop policy if exists "Vets and admins manage internacoes" on public.internacoes;
create policy "Vets and admins manage internacoes"
  on public.internacoes for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('vet', 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('vet', 'admin')
    )
  );

-- Relatórios de plantão: veterinários e admins têm acesso total
-- (todos os profissionais precisam ler os relatórios uns dos outros)
drop policy if exists "Vets and admins manage shift reports" on public.shift_reports;
create policy "Vets and admins manage shift reports"
  on public.shift_reports for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('vet', 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('vet', 'admin')
    )
  );

-- 4. Storage bucket para os áudios de plantão (privado)
insert into storage.buckets (id, name, public)
values ('plantao-audios', 'plantao-audios', false)
on conflict (id) do nothing;

-- Políticas de Storage: veterinários e admins podem ler/enviar áudios
drop policy if exists "Vets manage plantao audios" on storage.objects;
create policy "Vets manage plantao audios"
  on storage.objects for all
  using (
    bucket_id = 'plantao-audios'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('vet', 'admin')
    )
  )
  with check (
    bucket_id = 'plantao-audios'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('vet', 'admin')
    )
  );

-- 5. Tabela de mensagens do chat da UTI
create table if not exists public.icu_messages (
  id uuid primary key default gen_random_uuid(),
  internacao_id uuid not null references public.internacoes(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  author_name text not null,
  message_type text not null check (message_type in ('text', 'audio', 'system')),
  content text,
  audio_url text,
  transcription text,
  created_at timestamptz default now()
);

create index if not exists icu_messages_internacao_idx
  on public.icu_messages (internacao_id, created_at asc);

-- 6. Tabela de resumos consolidados de plantão da UTI
create table if not exists public.icu_shift_summaries (
  id uuid primary key default gen_random_uuid(),
  internacao_id uuid not null references public.internacoes(id) on delete cascade,
  generated_by uuid references public.profiles(id) on delete set null,
  shift_label text not null default 'Passagem de Plantão',
  summary_data jsonb not null,
  messages_count integer not null default 0,
  created_at timestamptz default now()
);

create index if not exists icu_shift_summaries_internacao_idx
  on public.icu_shift_summaries (internacao_id, created_at desc);

-- 7. RLS para icu_messages e icu_shift_summaries
alter table public.icu_messages enable row level security;
alter table public.icu_shift_summaries enable row level security;

drop policy if exists "Vets and admins manage icu_messages" on public.icu_messages;
create policy "Vets and admins manage icu_messages"
  on public.icu_messages for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('vet', 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('vet', 'admin')
    )
  );

drop policy if exists "Vets and admins manage icu_shift_summaries" on public.icu_shift_summaries;
create policy "Vets and admins manage icu_shift_summaries"
  on public.icu_shift_summaries for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('vet', 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('vet', 'admin')
    )
  );

