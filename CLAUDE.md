# CLAUDE.md — MyKrew App (Back Office)

> Documentation technique d'onboarding pour développeurs.
> Fait partie de l'écosystème d'outils internes (MyKrew, MyHub, automations n8n, crons, warehouse).

---

## 1. Résumé du projet

**MyKrew App (Back Office)** est l'interface d'administration web de la plateforme MyKrew.
Elle permet aux administrateurs de l'entreprise de gérer les consultants, leurs transactions
financières, les sociétés de portage, les LLP (anciennement « Bureaux ») et les cooptations
(parrainages / referrals).

- **Rôle** : tableau de bord d'administration (CRUD + import CSV) consommant une API REST externe.
- **Utilisateurs cibles** : administrateurs internes uniquement (rôle `ADMIN`). Les utilisateurs
  avec le rôle `USER` sont explicitement bloqués à la connexion.
- **Cas d'usage principaux** :
  - Authentification par email + code OTP (one-time password).
  - Gestion des consultants : liste paginée, recherche, création, édition, suppression,
    changement de rôle, import CSV en lot.
  - Gestion des transactions : liste, création, édition, import CSV en lot.
  - Gestion des sociétés de portage et des LLP.
  - Gestion des cooptations (referrals).

> ⚠️ **Périmètre** : ce repository est **frontend-only**. Il n'embarque ni backend ni base de
> données. Toute la logique métier et la persistance sont assurées par une API REST externe
> (voir §8 — Dépendances externes).

---

## 2. Stack technique

| Domaine | Technologie | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.5.2 |
| Runtime React | React / React DOM | 19.1.0 |
| Langage | TypeScript | ^5 |
| Build / dev | Turbopack (`next dev/build --turbopack`) | — |
| Data fetching / cache | TanStack React Query | ^5.87 |
| Client HTTP | axios | ^1.11 |
| Formulaires | Formik | ^2.4 |
| Validation | Yup | ^1.7 |
| Styling | Tailwind CSS | ^4 |
| Composants UI | shadcn/ui (style « new-york ») + Radix UI primitives | — |
| Icônes | lucide-react, react-icons | — |
| Notifications | sonner (toasts) | ^2.0 |
| Thème | next-themes | ^0.4 |
| Parsing CSV | papaparse | ^5.5 |
| Saisie OTP | input-otp | ^1.4 |
| Utilitaires CSS | clsx, tailwind-merge, class-variance-authority | — |
| Lint | ESLint 9 + `eslint-config-next` | — |

- **Gestion des requêtes** : axios (instance unique avec intercepteur d'auth) encapsulé dans des
  services, eux-mêmes consommés via des hooks React Query (`useQuery` / `useMutation`).
- **Auth** : email + OTP. Le token JWT est stocké dans un **cookie HTTP-only** via les Server
  Actions Next.js. Pas de provider d'auth tiers.
- **Base de données** : aucune dans ce repo (gérée côté API externe).
- **CI/CD** : aucun pipeline présent dans le repo (pas de `.github/workflows`). Voir §7.

---

## 3. Architecture globale

- **Type** : application **frontend-only** (SPA-like) bâtie sur Next.js App Router.
- **Pas de couche backend** dans ce repo. Les seuls fragments « serveur » sont :
  - le **middleware** d'authentification (`src/middleware.ts`),
  - trois **Server Actions** pour gérer le cookie de token (`src/app/actions/`).
- **Flux de données** (de haut en bas) :

```
Page / Composant (client)
  └─ Hook React Query (src/hooks/**)        → cache, états loading/error
       └─ Service (src/services/**)          → fonction async typée
            └─ axiosInstance (src/config)     → intercepteur ajoute Bearer token
                 └─ API REST externe (NEXT_PUBLIC_BASE_URL)
```

- **Communication API** : 100 % REST via axios. L'URL de base provient de
  `process.env.NEXT_PUBLIC_BASE_URL`. L'intercepteur de requête lit le token depuis le cookie
  (via la Server Action `getTokenFromCookies`) et l'injecte en `Authorization: Bearer <token>`.
- **Protection des routes** : `src/middleware.ts` redirige :
  - `/` → `/dashboard`
  - pas de token + route privée → `/auth/signin`
  - token présent + route `/auth/*` → `/dashboard`

---

## 4. Structure du projet

```
src/
├── app/                       # App Router Next.js (routes + layouts)
│   ├── actions/               # Server Actions ('use server') — gestion du cookie token
│   │   ├── getTokenFromCookies.ts
│   │   ├── saveCookies.ts
│   │   └── logout.ts
│   ├── auth/signin/page.tsx   # Page de connexion (email + OTP)
│   ├── dashboard/             # Section protégée
│   │   ├── layout.tsx         # Layout dashboard (sidebar + sheet mobile)
│   │   ├── page.tsx           # Accueil = liste des consultants
│   │   ├── consultants/[id]/  # Détail d'un consultant
│   │   ├── portage/           # Sociétés de portage
│   │   ├── office/            # LLP (ex-« Bureaux »)
│   │   ├── transactions/      # Transactions
│   │   └── referrals/         # Cooptations
│   ├── layout.tsx             # Root layout (fonts, ReactQueryProvider, Toaster)
│   └── globals.css            # Tailwind + variables de thème
│
├── components/
│   ├── ui/                    # Primitives shadcn/ui (button, dialog, table, select…)
│   ├── custom/                # Composants maison réutilisables (CustomInput, CustomButton…)
│   ├── auth/signin/           # Formulaire de connexion
│   └── dashboard/             # Composants par domaine métier
│       ├── consultant/        # Tables, dialogs CRUD, import CSV, pagination, skeleton
│       ├── transaction/
│       ├── office/
│       ├── portage/
│       └── referral/
│
├── hooks/                     # Hooks React Query, un dossier par domaine
│   ├── auth/                  # useSignin, useSendOtp, useGetMe, useUpdateUserDetails
│   ├── consultant/            # CRUD + CSV + rôle
│   ├── transaction/           # CRUD + CSV
│   ├── office/  portage/  referral/
│
├── services/                  # Fonctions d'appel API (axios), une par domaine
│   ├── authService.ts
│   ├── consultantsService.ts
│   ├── transactionService.ts
│   ├── officeService.ts
│   ├── portageService.ts
│   └── referralService.ts
│
├── types/                     # Interfaces & enums TypeScript (payloads, réponses, modèles)
│   ├── auth/  consultant/  transaction/  office/  portage/  referral/
│   ├── User.ts
│   └── UserAuthRole.ts
│
├── config/axiosInstance.ts    # Instance axios + intercepteur Bearer
├── context/ReactQueryContext.tsx  # QueryClientProvider + Devtools
├── lib/utils.ts               # cn() — merge de classes Tailwind
├── utils/
│   ├── routes.ts              # Définition de la navigation sidebar
│   └── helpers/               # Formatage de dates, mapping d'erreurs API, remplissage de mois
└── middleware.ts              # Garde d'authentification basée sur le cookie token

public/
├── index.ts                   # Ré-exports d'assets (images)
└── images/                    # user.jpg, default-user-image.png, cooptation-box-bg.svg
```

**Conventions clés** :
- Alias d'import `@/*` → `./src/*` (voir `tsconfig.json` et `components.json`).
- Pattern par domaine répété de façon identique : `types/<domaine>` → `services/<domaine>Service`
  → `hooks/<domaine>/use*` → `components/dashboard/<domaine>/*`.
- Les requêtes GET listées encodent leurs params avec `URLSearchParams` (support des tableaux).

---

## 5. Entrypoints

| Entrypoint | Fichier | Rôle |
|---|---|---|
| Root layout | `src/app/layout.tsx` | Fonts Geist, `ReactQueryProvider`, `Toaster` sonner |
| Garde d'auth | `src/middleware.ts` | Redirections selon présence du cookie `token` |
| Connexion | `src/app/auth/signin/page.tsx` | Flux email → OTP |
| Dashboard | `src/app/dashboard/page.tsx` | Liste des consultants (page d'accueil par défaut) |
| Client HTTP | `src/config/axiosInstance.ts` | Base URL + injection du Bearer token |

---

## 6. Setup local

### Prérequis
- **Node.js** : version récente recommandée. Le projet utilise React 19 / Next 15 / Tailwind 4
  qui requièrent Node ≥ 18.18 (Node 20+ recommandé ; testé en local sous Node 24).
  > ⚠️ Aucun `engines` ni `.nvmrc` n'est défini dans le repo — version non verrouillée.
- **Gestionnaire de paquets** : `npm` (présence d'un `package-lock.json`). Pas de lockfile
  yarn/pnpm.

### Installation
```bash
npm install
```

### Variable d'environnement obligatoire
Créer un fichier `.env.local` à la racine (voir §6 ci-dessous) :
```bash
NEXT_PUBLIC_BASE_URL=https://<url-de-votre-api>
```
> Sans cette variable, tous les appels axios partent vers une base URL `undefined` → toutes les
> requêtes échouent.

### Scripts disponibles (`package.json`)
| Script | Commande | Description |
|---|---|---|
| `dev` | `next dev --turbopack` | Serveur de développement (http://localhost:3000) |
| `build` | `next build --turbopack` | Build de production |
| `start` | `next start` | Démarre le build de production |
| `lint` | `eslint` | Lint du code |

> ⚠️ Aucun script de **test** n'est défini ; il n'y a pas de framework de test dans le repo.

### Démarrer
```bash
npm run dev
# → http://localhost:3000  (redirige vers /dashboard, puis /auth/signin si pas connecté)
```

---

## 7. Variables d'environnement

| Variable | Obligatoire | Rôle | Exposée au client ? |
|---|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | ✅ | URL de base de l'API REST externe consommée par axios | Oui (préfixe `NEXT_PUBLIC_`) |

- **C'est la seule variable d'environnement référencée dans le code** (`src/config/axiosInstance.ts`).
- Le préfixe `NEXT_PUBLIC_` signifie qu'elle est **inlinée dans le bundle client** : n'y mettre
  aucun secret.
- Les fichiers `.env*` sont **gitignorés** (`.gitignore`). Aucun `.env.example` n'existe à ce jour.

**Base suggérée pour `.env.example`** (non créé automatiquement) :
```bash
# URL de l'API MyKrew (back-end externe)
NEXT_PUBLIC_BASE_URL=https://api.example.com
```

---

## 8. Dépendances externes

| Dépendance | Type | Détail |
|---|---|---|
| **API REST MyKrew** | API externe (obligatoire) | Toute la donnée et la logique métier. Base URL = `NEXT_PUBLIC_BASE_URL` |
| Cookie `token` | Auth | JWT stocké en cookie HTTP-only (`secure`, `sameSite: 'none'`) via Server Actions |

### Endpoints API consommés (référence)
> Chemins relatifs à `NEXT_PUBLIC_BASE_URL`, observés dans `src/services/**`.

**Auth / Users**
- `POST /users/otp` — envoi du code OTP par email
- `POST /users` — connexion (vérifie l'OTP, renvoie `{ user, accessToken }`)
- `GET /users/me` — profil de l'utilisateur courant
- `PATCH /users/update` — mise à jour des infos utilisateur
- `POST /users/register` — création d'un consultant
- `POST /users/register/batch` — création en lot (CSV)
- `DELETE /users/:id` — suppression d'un consultant

**Consultants**
- `GET /consultants/admin` — liste paginée (params : `page`, `perPage`, `search`)
- `GET /consultants/admin/:id` — détail
- `PATCH /consultants/role/:id` — changement de rôle
- `PATCH /consultants/update/:id` — édition

**Transactions**
- `GET /transactions/admin` — liste (params query)
- `POST /transactions/:consultantId` — création
- `POST /transactions/batch` — création en lot (CSV)
- `PATCH /transactions/:id` — édition (status, comment)

**Offices (LLP) / Portages / Referrals**
- `GET /offices/all`, `POST /offices`
- `GET /portages/all`, `POST /portages`
- `GET /referrals/admin` (params query), `POST /referrals`

> ⚠️ Le contrat exact (schémas de requête/réponse) est défini côté API externe. Les types dans
> `src/types/**` reflètent l'usage observé côté front et peuvent ne pas couvrir tous les champs API.

---

## 9. Déploiement & CI/CD

- **Aucun pipeline CI/CD** présent dans le repo (pas de `.github/`, pas de `Dockerfile`,
  pas de `vercel.json`).
- Le `.gitignore` mentionne `.vercel`, suggérant un **déploiement Vercel** (cible naturelle d'un
  projet Next.js), mais **non confirmé par la config du repo**.
- Pour déployer : fournir `NEXT_PUBLIC_BASE_URL` comme variable d'environnement de la plateforme,
  puis `npm run build` / `npm run start` (ou build géré par Vercel).

> ⚠️ Zone d'incertitude : environnements (dev/staging/prod) et stratégie de déploiement non
> documentés dans le repo. À confirmer avec l'équipe infra.

---

## 10. Zones critiques & points d'attention

- **`src/config/axiosInstance.ts`** : intercepteur unique d'auth. Tout appel API en dépend.
  Si `NEXT_PUBLIC_BASE_URL` est absente, **tout casse silencieusement**.
- **`src/middleware.ts`** : seule barrière de protection des routes (basée sur la *présence* du
  cookie, pas sa validité). La validation réelle du token est faite par l'API.
- **`src/app/actions/saveCookies.ts`** : cookie posé en `secure: true` + `sameSite: 'none'` →
  nécessite **HTTPS** ; en HTTP local le cookie peut ne pas être posé selon le navigateur.
- **Contrôle d'accès rôle** : seul `UserAuthRole.ADMIN` (=2) est autorisé ; les `USER` (=1) sont
  rejetés côté front dans `SignInForm.tsx`. Ce contrôle front **ne remplace pas** l'autorisation
  serveur.
- **Terminologie UI vs code** : l'UI affiche « LLP » et « Taux de rendement », mais le code utilise
  encore `office` / `performance` (renommage partiel — voir commit `98085c0`). Ne pas confondre.
- **React Query** : `staleTime`/`gcTime` mis à 0 quand une recherche est active (voir
  `useGetConsultants`) ; ailleurs 5 min. Tenir compte du cache lors des mutations (penser à
  invalider les bonnes `queryKey`).
- **Import CSV** : géré côté client avec `papaparse` puis envoyé en lot (`/batch`). Vérifier le
  mapping de colonnes attendu par l'API.

---

## 11. Notes d'onboarding pour développeur

1. **Cloner**, puis `npm install`.
2. Créer `.env.local` avec `NEXT_PUBLIC_BASE_URL` pointant vers l'API (demander l'URL à l'équipe).
3. `npm run dev` → ouvrir http://localhost:3000.
4. Pour se connecter : un email **autorisé en base (rôle ADMIN)** + le **code OTP** reçu par email.
   Sans backend joignable, la connexion est impossible.
5. **Ajouter une feature métier** = suivre le pattern par domaine :
   `types/<domaine>` → `services/<domaine>Service.ts` → `hooks/<domaine>/use*.ts` →
   `components/dashboard/<domaine>/*`.
6. **Ajouter un composant UI** : privilégier `components/ui` (shadcn) et `components/custom`
   existants ; utiliser `cn()` (`src/lib/utils.ts`) pour composer les classes Tailwind.
7. **Lint avant commit** : `npm run lint`.
8. ⚠️ Pas de tests automatisés : valider manuellement les parcours impactés.
