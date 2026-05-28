# MyKrew App — Back Office

Interface d'administration web de la plateforme **MyKrew**. Permet aux administrateurs internes
de gérer les consultants, leurs transactions, les sociétés de portage, les LLP et les cooptations.

> Outil interne — fait partie de l'écosystème MyKrew / MyHub (automations n8n, crons, warehouse).
> Documentation technique détaillée : voir [`CLAUDE.md`](./CLAUDE.md).

---

## Overview

- **Quoi** : back-office d'administration (CRUD + import CSV) pour la plateforme MyKrew.
- **Pour qui** : administrateurs internes uniquement (rôle `ADMIN`).
- **Architecture** : application **frontend-only** Next.js 15 (App Router) consommant une **API
  REST externe**. Pas de backend ni de base de données dans ce repository.
- **Auth** : connexion par **email + code OTP** ; token JWT stocké en cookie HTTP-only.

---

## Quick Start

> Objectif : démarrage en moins de 10 minutes.

**Prérequis** : Node.js ≥ 18.18 (Node 20+ recommandé), npm.

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
#    Copier le modèle puis renseigner l'URL de l'API :
cp .env.example .env.local
#    .env.local :
#    NEXT_PUBLIC_BASE_URL=https://my-krew-be.onrender.com/my-krew

# 3. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) → redirige vers `/dashboard`, puis vers
`/auth/signin` si non connecté.

**Scripts disponibles :**

| Script | Commande | Description |
|---|---|---|
| `npm run dev` | `next dev --turbopack` | Serveur de développement |
| `npm run build` | `next build --turbopack` | Build de production |
| `npm run start` | `next start` | Lance le build de production |
| `npm run lint` | `eslint` | Lint du code |

> ℹ️ Aucun script de test n'est défini (pas de framework de test dans le repo).

---

## Architecture Overview

Application frontend-only. Le flux de données suit toujours le même pattern par domaine :

```
Page / Composant (client)
  └─ Hook React Query (src/hooks/**)        → cache, loading / error
       └─ Service (src/services/**)          → fonction async typée
            └─ axiosInstance (src/config)     → injecte Bearer token (cookie)
                 └─ API REST externe (NEXT_PUBLIC_BASE_URL)
```

- **Auth & routing** : `src/middleware.ts` protège les routes selon la présence du cookie `token`
  (`/` → `/dashboard`, routes privées sans token → `/auth/signin`).
- **Token** : géré via des Server Actions Next.js (`src/app/actions/`) en cookie HTTP-only.
- **State serveur** : TanStack React Query (cache, mutations, devtools).
- **UI** : Tailwind CSS 4 + shadcn/ui (style « new-york ») + primitives Radix.

**Stack** : Next.js 15.5.18 · React 19 · TypeScript 5 · React Query 5 · axios · Formik + Yup ·
Tailwind 4 · shadcn/ui · sonner · papaparse.

---

## Project Structure

```
src/
├── app/                 # App Router : routes, layouts, Server Actions
│   ├── actions/         # Gestion du cookie token ('use server')
│   ├── auth/signin/     # Connexion email + OTP
│   ├── dashboard/       # Section protégée (consultants, transactions, portage, office, referrals)
│   └── layout.tsx       # Root layout (fonts, providers, toaster)
├── components/
│   ├── ui/              # Primitives shadcn/ui
│   ├── custom/          # Composants maison réutilisables
│   └── dashboard/<domaine>/  # Composants par domaine métier
├── hooks/<domaine>/     # Hooks React Query (useQuery / useMutation)
├── services/            # Appels API axios, un fichier par domaine
├── types/<domaine>/     # Interfaces & enums TypeScript
├── config/axiosInstance.ts   # Instance axios + intercepteur Bearer
├── context/             # ReactQueryProvider
├── lib/utils.ts         # cn() — merge classes Tailwind
├── utils/               # routes (sidebar) + helpers (dates, erreurs)
└── middleware.ts        # Garde d'authentification
```

> Alias d'import : `@/*` → `./src/*`. Pattern répété par domaine :
> `types` → `services` → `hooks` → `components/dashboard`.

---

## Environment Variables

| Variable | Obligatoire | Rôle |
|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | ✅ | URL de base de l'API REST externe (axios) |

- Seule variable utilisée dans le code ([`src/config/axiosInstance.ts`](./src/config/axiosInstance.ts)).
- Valeur de production : `https://my-krew-be.onrender.com/my-krew` (API partagée avec MyKrew App).
- Préfixe `NEXT_PUBLIC_` ⇒ **inlinée dans le bundle client** : n'y mettre **aucun secret**. Ce n'est
  pas un secret, juste une URL publique — sans risque à versionner dans la doc.
- Les fichiers `.env*` sont gitignorés **sauf** [`.env.example`](./.env.example). Copier ce modèle
  vers `.env.local` en développement.

**Où récupérer la valeur ?**
- **En local** : utiliser la valeur de production ci-dessus dans `.env.local`. Si elle a changé,
  la source de vérité est le dashboard Vercel (ci-dessous).
- **Source de vérité (prod)** : **Vercel → projet → Settings → Environment Variables →
  `NEXT_PUBLIC_BASE_URL`**. C'est cette valeur qui s'applique en production.
- **Priorité Next.js** : en prod, la variable définie dans Vercel l'emporte ; `.env.local`
  n'est jamais déployé (gitignoré) et `.env.example` n'est jamais lu par Next.js (simple modèle).

---

## Key Features / Modules

| Module | Route | Fonctionnalités |
|---|---|---|
| **Auth** | `/auth/signin` | Connexion email + OTP, contrôle du rôle `ADMIN` |
| **Consultants** | `/dashboard`, `/dashboard/consultants/[id]` | Liste paginée avec recherche temps réel (debounced 400 ms), filtres (Statut / Portage / LLP), tri (Nom, Date de début), sélecteur de taille de page (10/25/50/100), création, édition (formulaire unifié : identité, LLP, portage, statut, type, dates, rôle, estimation, taux de rendement), suppression (soft delete), changement de rôle, **édition en lot** (Portage / LLP / Statut / Type / Rôle), import CSV |
| **Transactions** | `/dashboard/transactions` | Liste, création, édition (Type, Statut, Montant, Date, Commentaires), suppression (soft delete), import CSV. Badge « Archivé » si consultant supprimé |
| **Portage** | `/dashboard/portage` | Liste, création, renommage et suppression (soft delete) des sociétés de portage |
| **LLP** | `/dashboard/office` | Liste, création, renommage et suppression (soft delete) des LLP (ex-« Bureaux ») |
| **Cooptation** | `/dashboard/referrals` | Liste, création, édition (Statut, Montant, Date début, Date fin), suppression (soft delete). Badge « Archivé » si consultant supprimé |

> Toutes les suppressions passent par une confirmation Radix `AlertDialog` et s'appuient sur
> le **soft delete** côté API (`deletedAt`). L'identité des consultants supprimés reste
> lisible dans l'historique (transactions, cooptations) ; seul l'email est neutralisé.

---

## External Dependencies

- **API REST MyKrew** (obligatoire) — toute la donnée et la logique métier. Base URL via
  `NEXT_PUBLIC_BASE_URL`. Endpoints consommés détaillés dans [`CLAUDE.md`](./CLAUDE.md#8-dépendances-externes).
- **Authentification** — JWT en cookie HTTP-only (`secure`, `sameSite: 'none'`), posé via Server
  Actions. Pas de provider d'auth tiers.

---

## Deployment

- Hébergement : **Vercel** (déploiement automatique du repo ; build géré par Vercel).
- **Variable d'environnement à configurer sur Vercel** (Settings → Environment Variables) :
  `NEXT_PUBLIC_BASE_URL`. C'est la source de vérité en production — sans elle, le build prod
  pointe vers une base URL `undefined` et tous les appels API échouent.
- Build : `npm run build` puis `npm run start` (ou build géré par Vercel).
- Aucun pipeline CI/CD ni Dockerfile présent dans le repo (le déploiement passe par Vercel).

---

## Known Issues

- **HTTPS requis en local** : le cookie de token est `secure: true` + `sameSite: 'none'`. En HTTP
  (`localhost`), certains navigateurs peuvent refuser de poser le cookie → connexion impossible.
- **Sans `NEXT_PUBLIC_BASE_URL`**, tous les appels API échouent silencieusement (base URL `undefined`).
- **Pas de tests automatisés** : validation manuelle requise.
- **Terminologie partiellement renommée** : l'UI affiche « LLP » / « Taux de rendement » mais le
  code utilise encore `office` / `performance`.
- **Version de Node non verrouillée** (pas de `engines` ni `.nvmrc`).
- Le middleware vérifie la **présence** du cookie, pas la validité du token (validée côté API).

---

## Developer Notes

- **Ajouter une feature métier** : suivre le pattern par domaine
  `types/<domaine>` → `services/<domaine>Service.ts` → `hooks/<domaine>/use*.ts` →
  `components/dashboard/<domaine>/*`.
- **UI** : réutiliser `components/ui` (shadcn) et `components/custom` ; composer les classes avec
  `cn()` ([`src/lib/utils.ts`](./src/lib/utils.ts)).
- **Cache** : attention aux `queryKey` lors des mutations (invalidation). `useGetConsultants` met
  `staleTime`/`gcTime` à 0 en mode recherche.
- **Lint avant commit** : `npm run lint`.
- **Connexion en dev (login admin via OTP)** :
  1. Saisir un email d'un compte **ADMIN** existant en base (comptes test fournis par l'équipe).
  2. L'API envoie un **code OTP** à cet email ; le saisir pour valider.
  3. Les comptes au rôle `USER` sont rejetés à la connexion (back-office réservé aux admins).
  - Nécessite que l'API (`NEXT_PUBLIC_BASE_URL`) soit joignable.

---

📖 Pour l'audit complet (entrypoints, endpoints API, zones critiques, onboarding détaillé) :
voir [`CLAUDE.md`](./CLAUDE.md).
