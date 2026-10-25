-- Run this in Supabase SQL Editor. Review your project before applying.
create extension if not exists pgcrypto;
create table if not exists public.convocation_survey(
 id uuid primary key default gen_random_uuid(),
 full_name text not null check(char_length(trim(full_name)) between 1 and 120),
 department text not null,
 batch text not null check(char_length(trim(batch)) between 1 and 80),
 contact_type text null check(contact_type in ('phone','email')),
 contact_value text null,
 registration_status text not null check(registration_status in ('Already registered','Will register','Not decided yet','Do not plan to register')),
 preferred_venue text not null check(preferred_venue in ('Our Own Campus','Zilla Stadium / Convocation Hall','Others')),
 suggested_venue text null,
 opinion_suggestions text null,
 created_at timestamptz not null default now(),
 constraint suggested_venue_required_for_others check((preferred_venue='Others' and suggested_venue is not null and char_length(trim(suggested_venue))>0) or (preferred_venue<>'Others' and suggested_venue is null)),
 constraint opinion_length check(opinion_suggestions is null or char_length(opinion_suggestions)<=2000)
);
alter table public.convocation_survey enable row level security;
drop policy if exists "Public can submit survey responses" on public.convocation_survey;
create policy "Public can submit survey responses" on public.convocation_survey for insert to anon,authenticated with check(char_length(trim(full_name)) between 1 and 120 and char_length(trim(batch)) between 1 and 80 and (preferred_venue<>'Others' or (suggested_venue is not null and char_length(trim(suggested_venue))>0)));
grant insert on public.convocation_survey to anon,authenticated;
-- Intentionally no public SELECT/UPDATE/DELETE policy. Add admin access only through Auth + admin-only RLS.
