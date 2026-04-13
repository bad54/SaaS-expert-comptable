# ComptaFlow - SaaS pour Experts-Comptables

## Concept

ComptaFlow est une plateforme SaaS destinee aux experts-comptables et petits cabinets.
Elle simplifie la gestion quotidienne du cabinet en centralisant :

- **Gestion des clients (dossiers)** : fiche client, documents, echeances fiscales et sociales
- **Collecte de pieces comptables** : portail client pour deposer factures, releves, justificatifs
- **Lettrage et pre-saisie** : OCR sur les pieces, suggestions d'ecritures comptables
- **Tableau de bord cabinet** : vue d'ensemble des dossiers, echeances a venir, alertes
- **Collaboration** : messagerie interne client <-> comptable, demandes de pieces manquantes
- **Echeancier fiscal/social** : rappels automatiques (TVA, IS, charges sociales, liasses...)

## Pourquoi ce projet ?

Les outils existants (Pennylane, Dext, Tiime...) sont soit chers, soit complexes, soit les deux.
ComptaFlow vise le **cabinet solo ou petit cabinet (1-5 collaborateurs)** avec une approche :

- Simple a prendre en main
- Tarification accessible (freemium + plans abordables)
- Deploiement leger (pas d'infrastructure lourde)

## Stack technique

| Couche | Choix | Justification |
|---|---|---|
| **Frontend** | Next.js (App Router) + Tailwind CSS + shadcn/ui | SSR, DX excellente, composants accessibles |
| **Backend / API** | Next.js API Routes (Route Handlers) | Monorepo, pas de serveur separe a gerer |
| **Base de donnees** | PostgreSQL via Supabase | Tier gratuit genereux, auth integree, realtime |
| **ORM** | Prisma | Migrations typees, excellent avec TypeScript |
| **Auth** | Supabase Auth | Social login, magic link, gestion des roles |
| **Stockage fichiers** | Supabase Storage (S3-compatible) | Pieces comptables, documents clients |
| **OCR** | Tesseract.js (MVP) -> API Mindee/Veryfi (prod) | Gratuit au debut, upgrade possible |
| **Deploiement** | Railway (app) + Supabase (backend) | Trial gratuit, zero DevOps |
| **Emails** | Resend | API simple, 3000 mails/mois gratuits |
| **Paiements** | Stripe | Standard SaaS, Checkout + portail client |

## Demarrage rapide

```bash
# Installer les dependances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Remplir les valeurs dans .env.local

# Lancer les migrations
npx prisma migrate dev

# Lancer le serveur de dev
npm run dev
```

## Structure du projet

```
src/
├── app/
│   ├── (auth)/           # Pages login / register
│   ├── (dashboard)/      # Dashboard comptable (protege)
│   ├── (client-portal)/  # Portail client
│   └── api/              # Route Handlers
├── components/
│   └── ui/               # Composants shadcn/ui
├── lib/
│   ├── prisma.ts         # Client Prisma singleton
│   ├── supabase/         # Clients Supabase (server + browser)
│   └── utils.ts          # Utilitaires
└── types/                # Types TypeScript partages
prisma/
└── schema.prisma         # Schema de la base de donnees
```

## Licence

Projet prive - Tous droits reserves.
