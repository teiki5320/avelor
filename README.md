# Solelis

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
- `RESEND_API_KEY` — Envoi d'emails
- `NEXT_PUBLIC_BASE_URL` — URL publique (pour les liens magiques)

## Base de données

Cloudflare D1 « solelis » (stockage limité à l'UE), reliée au Worker par le binding `DB`.
Le schéma de la table `fiches` est dans `migrations/` :

```bash
npx wrangler d1 migrations apply DB --local    # base locale (npm run dev / cf:preview)
npx wrangler d1 migrations apply DB --remote   # base en ligne
```

## Stack

Next.js 15 App Router · Tailwind · Framer Motion · Cloudflare Workers (OpenNext) + D1 · Resend.
