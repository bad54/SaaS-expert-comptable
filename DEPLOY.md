# Deploiement ComptaFlow sur Railway + Supabase

Guide complet pour deployer ComptaFlow gratuitement (trial Railway 5$ + Supabase free tier).

---

## 1. Supabase (gratuit)

### Creer le projet

1. Aller sur [supabase.com](https://supabase.com) et creer un compte
2. Cliquer **New Project**, choisir une region EU (ex: `eu-west-1`)
3. Noter le **mot de passe** de la base de donnees

### Recuperer les cles

Dans **Project Settings > API** :
- `NEXT_PUBLIC_SUPABASE_URL` → URL du projet (ex: `https://xxxxx.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → cle `anon` / `public`
- `SUPABASE_SERVICE_ROLE_KEY` → cle `service_role` (ne jamais exposer cote client)

Dans **Project Settings > Database > Connection string > URI** :
- `DATABASE_URL` → URI PostgreSQL (remplacer `[YOUR-PASSWORD]` par le mot de passe choisi)

### Configurer le Storage

1. Aller dans **Storage** > **Create bucket**
2. Creer un bucket nomme `documents` (public: non)
3. Ajouter une policy pour permettre les uploads authentifies

### Configurer l'Auth

1. Aller dans **Authentication > URL Configuration**
2. Ajouter votre URL Railway dans **Redirect URLs** :
   - `https://votre-app.up.railway.app/api/auth/callback`

---

## 2. Stripe (gratuit en mode test)

### Creer le compte

1. Aller sur [stripe.com](https://stripe.com) et creer un compte
2. Rester en **mode test** (toggle en haut a droite)

### Recuperer les cles

Dans **Developers > API keys** :
- `STRIPE_SECRET_KEY` → cle secrete (`sk_test_...`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → cle publique (`pk_test_...`)

### Creer les produits

1. Aller dans **Products** > **Add product**
2. Creer le plan **Pro** (ex: 29EUR/mois) → copier le **Price ID** (`price_...`)
3. Creer le plan **Cabinet** (ex: 79EUR/mois) → copier le **Price ID**
4. Renseigner `STRIPE_PRO_PRICE_ID` et `STRIPE_CABINET_PRICE_ID`

### Webhook (apres deploiement)

1. Aller dans **Developers > Webhooks**
2. Ajouter un endpoint : `https://votre-app.up.railway.app/api/stripe/webhook`
3. Evenements a ecouter : `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copier le **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## 3. Resend (gratuit 3000 emails/mois)

1. Aller sur [resend.com](https://resend.com) et creer un compte
2. Creer une **API Key** → `RESEND_API_KEY`
3. (Optionnel) Configurer un domaine pour les emails

---

## 4. Railway (trial 5$ gratuit)

### Creer le projet

1. Aller sur [railway.com](https://railway.com) et creer un compte (GitHub recommande)
2. Cliquer **New Project** > **Deploy from GitHub repo**
3. Selectionner le repo `SaaS-expert-comptable`
4. Railway detecte automatiquement Next.js via Nixpacks

### Configurer les variables d'environnement

Dans **Variables** du service, ajouter toutes les variables :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_CABINET_PRICE_ID=price_...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=ComptaFlow <noreply@votredomaine.fr>
NEXT_PUBLIC_APP_URL=https://votre-app.up.railway.app
```

### Lancer les migrations

Dans le terminal Railway (ou via `railway run`) :

```bash
npx prisma migrate deploy
```

Ou ajouter une **one-off command** dans Railway :
1. Service > Settings > Deploy > Start Command (temporairement) :
   `npx prisma migrate deploy && npm start`
2. Apres la premiere execution, remettre : `npm start`

### Configurer le cron (notifications)

Railway supporte les cron jobs via un service separe :

1. Dans votre projet Railway, cliquer **+ New** > **Cron Service**
2. Configurer :
   - **Schedule** : `0 7 * * *` (tous les jours a 7h UTC)
   - **Command** :
     ```bash
     curl -X POST https://votre-app.up.railway.app/api/notifications \
       -H "Content-Type: application/json" \
       -d '{"type": "deadline_reminders"}'
     ```

### Domaine personnalise (optionnel)

1. Service > Settings > Networking > **Generate Domain** (sous-domaine `.up.railway.app` gratuit)
2. Ou ajouter un domaine custom dans **Custom Domain**

---

## 5. Deploiement

Railway deploie automatiquement a chaque `git push` sur la branche configuree.

### Premier deploiement

```bash
git push origin main
```

Railway va :
1. Detecter Node.js / Next.js via Nixpacks
2. Executer `npm install`
3. Executer `npm run build` (qui lance `prisma generate && next build`)
4. Demarrer l'app avec `npm start`

### Verifier

- Ouvrir l'URL Railway (visible dans Deployments)
- Verifier que la page de login s'affiche
- Tester l'inscription et la connexion

---

## 6. Apres le deploiement

### Checklist

- [ ] Mettre a jour `NEXT_PUBLIC_APP_URL` avec l'URL Railway finale
- [ ] Configurer le webhook Stripe avec l'URL Railway
- [ ] Mettre a jour les **Redirect URLs** dans Supabase Auth
- [ ] Tester le flow complet : inscription → checkout Stripe → dashboard
- [ ] Configurer le cron service pour les notifications
- [ ] (Optionnel) Ajouter un domaine personnalise

### Couts estimatifs

| Service | Plan | Cout |
|---------|------|------|
| Railway | Trial / Hobby | 5$/mois (trial gratuit au debut) |
| Supabase | Free | 0$ (500 MB DB, 1 GB storage) |
| Stripe | Standard | 0$ fixe (1.4% + 0.25EUR par transaction) |
| Resend | Free | 0$ (3000 emails/mois) |
| **Total** | | **~5$/mois** apres le trial |

---

## Developpement local

```bash
# Cloner le projet
git clone <repo-url>
cd SaaS-expert-comptable

# Installer les dependances
npm install

# Configurer les variables
cp .env.example .env.local
# Remplir les valeurs dans .env.local

# Lancer les migrations
npx prisma migrate dev

# Lancer le serveur
npm run dev
```

L'app est accessible sur `http://localhost:3000`.
