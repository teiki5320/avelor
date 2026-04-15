# AVELOR

Plateforme d'aide aux chefs d'entreprise français en difficulté.

## Installation

```bash
npm install
cp .env.example .env.local
# Renseignez vos clés API
npm run dev
```

## Variables d'environnement

- `INSEE_API_KEY` — API Sirene INSEE
- `GOOGLE_PLACES_API_KEY` — Google Places
- `SUPABASE_URL` + `SUPABASE_ANON_KEY` — Base Supabase (table `fiches`)
- `RESEND_API_KEY` — Envoi d'emails
- `NEXT_PUBLIC_BASE_URL` — URL publique (pour les liens magiques)

## Table Supabase

```sql
create table fiches (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  siret text,
  reponses jsonb,
  company_data jsonb,
  email text,
  created_at timestamptz default now()
);
```

## Stack

Next.js 14 App Router · Tailwind · Framer Motion · Supabase · Resend.
