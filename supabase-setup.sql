-- Execute este SQL no Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Criar tabela de perfis
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null,
  role text not null default 'tutor' check (role in ('tutor', 'vet', 'admin')),
  phone text,
  crmv text,
  specialty text,
  clinic text,
  created_at timestamptz default now()
);

-- 2. Habilitar Row Level Security
alter table public.profiles enable row level security;

-- 3. Políticas de acesso
-- Usuários podem ver seu próprio perfil
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Usuários podem inserir seu próprio perfil
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Admins podem ver todos os perfis
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 4. Trigger para criar perfil automaticamente no signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role, phone, crmv, specialty, clinic)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'tutor'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'crmv',
    new.raw_user_meta_data->>'specialty',
    new.raw_user_meta_data->>'clinic'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Criar o primeiro admin (execute DEPOIS de criar a conta via cadastro)
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'marcelowiz@gmail.com';
