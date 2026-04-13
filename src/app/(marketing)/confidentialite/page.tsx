export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Politique de Confidentialite</h1>
      <p className="mt-2 text-sm text-zinc-500">Derniere mise a jour : avril 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">1. Responsable du traitement</h2>
          <p className="mt-2">
            Le responsable du traitement des donnees est la societe ComptaFlow,
            dont le siege social est situe en France.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">2. Donnees collectees</h2>
          <p className="mt-2">Nous collectons les donnees suivantes :</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Donnees d&apos;identification : nom, prenom, email</li>
            <li>Donnees professionnelles : nom du cabinet, SIREN</li>
            <li>Donnees de vos clients : informations comptables, documents deposes</li>
            <li>Donnees de connexion : adresse IP, logs d&apos;acces</li>
            <li>Donnees de paiement : traitees par Stripe, non stockees sur nos serveurs</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">3. Finalites du traitement</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Fourniture et gestion du Service</li>
            <li>Gestion des comptes utilisateurs</li>
            <li>Facturation et gestion des abonnements</li>
            <li>Envoi de notifications par email (echeances, documents)</li>
            <li>Amelioration du Service et analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">4. Base legale</h2>
          <p className="mt-2">
            Le traitement des donnees repose sur l&apos;execution du contrat (CGU),
            le consentement de l&apos;utilisateur et notre interet legitime a ameliorer le Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">5. Duree de conservation</h2>
          <p className="mt-2">
            Les donnees sont conservees pendant toute la duree d&apos;utilisation du Service,
            puis 3 ans apres la suppression du compte, sauf obligation legale contraire.
            Les donnees comptables sont conservees conformement aux obligations legales (10 ans).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">6. Sous-traitants</h2>
          <p className="mt-2">Nous utilisons les sous-traitants suivants :</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li><strong>Supabase</strong> (hebergement, base de donnees) - UE</li>
            <li><strong>Railway</strong> (hebergement application) - US</li>
            <li><strong>Stripe</strong> (paiements) - UE/US</li>
            <li><strong>Resend</strong> (emails transactionnels) - US</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">7. Securite</h2>
          <p className="mt-2">
            Nous mettons en oeuvre des mesures techniques et organisationnelles appropriees
            pour proteger vos donnees : chiffrement TLS, controle d&apos;acces, sauvegardes
            regulieres, hebergement securise.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">8. Vos droits</h2>
          <p className="mt-2">
            Conformement au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Droit d&apos;acces a vos donnees</li>
            <li>Droit de rectification</li>
            <li>Droit a l&apos;effacement</li>
            <li>Droit a la portabilite</li>
            <li>Droit d&apos;opposition</li>
            <li>Droit a la limitation du traitement</li>
          </ul>
          <p className="mt-2">
            Pour exercer ces droits, contactez-nous a : contact@comptaflow.fr
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">9. Cookies</h2>
          <p className="mt-2">
            Le Service utilise des cookies strictement necessaires au fonctionnement
            (authentification, session). Aucun cookie publicitaire ou de tracking tiers
            n&apos;est utilise.
          </p>
        </section>
      </div>
    </div>
  );
}
