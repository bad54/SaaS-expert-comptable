# TASKS - ComptaFlow

## Phase 0 : Fondations (Semaine 1-2)

- [x] Initialiser le projet Next.js avec TypeScript
- [x] Configurer Tailwind CSS + shadcn/ui
- [x] Configurer Prisma + connexion Supabase
- [x] Definir le schema de base (User, Cabinet, Client, Document)
- [x] Mettre en place l'authentification (Supabase Auth)
- [x] Creer le layout principal (sidebar, header, navigation)
- [x] Configurer ESLint + Prettier
- [x] Ajouter le .env.example avec toutes les variables necessaires

## Phase 1 : MVP - Gestion de dossiers (Semaine 3-4)

- [x] CRUD dossiers clients (nom, SIREN, forme juridique, regime fiscal)
- [x] Page liste des clients avec recherche et filtres
- [x] Fiche client detaillee (infos, documents, echeances)
- [x] Upload de documents (pieces comptables, releves)
- [x] Stockage des fichiers sur Supabase Storage
- [x] Systeme de tags/categories pour les documents

## Phase 2 : Echeancier fiscal & social (Semaine 5-6)

- [x] Modele de donnees pour les echeances (type, date, client, statut)
- [x] Vue calendrier des echeances a venir
- [x] Tableau de bord avec alertes (echeances stats)
- [x] Formulaire de creation d'echeances
- [x] Action marquer comme termine
- [ ] Notifications par email via Resend
- [ ] Echeancier parametrable par regime fiscal

## Phase 3 : Portail client (Semaine 7-8)

- [x] Espace client securise (layout dedie, navigation)
- [x] Interface de depot de documents (drag & drop)
- [x] Page d'accueil portail avec actions rapides
- [x] Messagerie simple client <-> comptable
- [ ] Lien d'invitation pour les clients
- [ ] Notifications au comptable lors d'un depot client

## Phase 4 : OCR et pre-saisie (Semaine 9-10)

- [x] Integration OCR (Tesseract.js pour le MVP)
- [x] Extraction automatique : date, montant, fournisseur, numero de facture
- [x] Suggestion d'ecriture comptable (compte, journal)
- [x] Interface de validation/correction par le comptable
- [x] Export des ecritures au format FEC
- [x] Page documents globale avec OCR et actions

## Phase 5 : Monetisation & production (Semaine 11-12)

- [x] Integration Stripe (plans, checkout, portail de facturation, webhooks)
- [x] Page de pricing publique avec FAQ
- [x] Landing page marketing (hero, features, social proof, CTA)
- [x] Layout marketing avec navbar et footer
- [x] Page parametres (profil, cabinet, abonnement, export)
- [ ] Deploiement production (Vercel + Supabase Pro si necessaire)
- [ ] Monitoring et analytics (Vercel Analytics ou Plausible)
- [ ] CGU, politique de confidentialite, mentions legales

## Backlog (futur)

- [ ] Multi-cabinet (gestion de plusieurs cabinets)
- [ ] Generation automatique de la liasse fiscale
- [ ] Connexion bancaire (Open Banking via Bridge/Powens)
- [ ] API publique pour integrations tierces
- [ ] Application mobile (React Native ou PWA)
- [ ] Intelligence artificielle pour categorisation automatique
- [ ] Notifications email via Resend
- [ ] Echeancier parametrable par regime fiscal
- [ ] Liens d'invitation clients
