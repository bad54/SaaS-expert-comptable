# TASKS - ComptaFlow

## Phase 0 : Fondations (Semaine 1-2)

- [ ] Initialiser le projet Next.js avec TypeScript
- [ ] Configurer Tailwind CSS + shadcn/ui
- [ ] Configurer Prisma + connexion Supabase
- [ ] Definir le schema de base (User, Cabinet, Client, Document)
- [ ] Mettre en place l'authentification (Supabase Auth)
- [ ] Creer le layout principal (sidebar, header, navigation)
- [ ] Configurer ESLint + Prettier
- [ ] Ajouter le .env.example avec toutes les variables necessaires

## Phase 1 : MVP - Gestion de dossiers (Semaine 3-4)

- [ ] CRUD dossiers clients (nom, SIREN, forme juridique, regime fiscal)
- [ ] Page liste des clients avec recherche et filtres
- [ ] Fiche client detaillee (infos, documents, echeances)
- [ ] Upload de documents (pieces comptables, releves)
- [ ] Stockage des fichiers sur Supabase Storage
- [ ] Systeme de tags/categories pour les documents

## Phase 2 : Echeancier fiscal & social (Semaine 5-6)

- [ ] Modele de donnees pour les echeances (type, date, client, statut)
- [ ] Echeancier parametrable par regime fiscal (micro, reel simplifie, reel normal)
- [ ] Vue calendrier des echeances a venir
- [ ] Tableau de bord avec alertes (echeances J-7, J-3, J-jour)
- [ ] Notifications par email via Resend

## Phase 3 : Portail client (Semaine 7-8)

- [ ] Espace client securise (auth separee, lien d'invitation)
- [ ] Interface de depot de documents (drag & drop)
- [ ] Liste des demandes de pieces du comptable
- [ ] Messagerie simple client <-> comptable
- [ ] Notifications au comptable lors d'un depot client

## Phase 4 : OCR et pre-saisie (Semaine 9-10)

- [ ] Integration OCR (Tesseract.js pour le MVP)
- [ ] Extraction automatique : date, montant, fournisseur, numero de facture
- [ ] Suggestion d'ecriture comptable (compte, journal)
- [ ] Interface de validation/correction par le comptable
- [ ] Export des ecritures au format FEC

## Phase 5 : Monetisation & production (Semaine 11-12)

- [ ] Integration Stripe (plans, checkout, portail de facturation)
- [ ] Page de pricing publique
- [ ] Landing page marketing
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
