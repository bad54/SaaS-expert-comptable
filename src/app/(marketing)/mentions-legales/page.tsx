export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Mentions Legales</h1>
      <p className="mt-2 text-sm text-zinc-500">Derniere mise a jour : avril 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">1. Editeur du site</h2>
          <p className="mt-2">
            ComptaFlow<br />
            [Forme juridique a completer]<br />
            [Adresse a completer]<br />
            [SIREN a completer]<br />
            Email : contact@comptaflow.fr
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">2. Directeur de la publication</h2>
          <p className="mt-2">
            [Nom du directeur de publication a completer]
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">3. Hebergement</h2>
          <p className="mt-2">
            <strong>Application :</strong> Railway Corp., San Francisco, CA, USA<br />
            <strong>Backend &amp; Base de donnees :</strong> Supabase Inc.<br />
            <strong>Stockage de fichiers :</strong> Supabase Storage (AWS S3-compatible)
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">4. Propriete intellectuelle</h2>
          <p className="mt-2">
            L&apos;ensemble du contenu du site (textes, images, logo, interface, code source)
            est protege par les lois sur la propriete intellectuelle. Toute reproduction,
            representation ou diffusion, en tout ou partie, sans autorisation prealable
            ecrite est interdite.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">5. Donnees personnelles</h2>
          <p className="mt-2">
            Les donnees personnelles collectees sur ce site sont traitees conformement
            a notre <a href="/confidentialite" className="underline font-medium text-zinc-900 dark:text-zinc-50">Politique de Confidentialite</a>.
            Conformement a la loi &quot;Informatique et Libertes&quot; du 6 janvier 1978 modifiee
            et au Reglement General sur la Protection des Donnees (RGPD), vous disposez
            de droits sur vos donnees.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">6. Cookies</h2>
          <p className="mt-2">
            Ce site utilise des cookies strictement necessaires au fonctionnement du service
            (authentification, preferences). Pour plus d&apos;informations, consultez notre
            Politique de Confidentialite.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">7. Limitation de responsabilite</h2>
          <p className="mt-2">
            ComptaFlow s&apos;efforce de fournir des informations fiables mais ne saurait
            garantir l&apos;exactitude, la completude ou l&apos;actualite des informations diffusees
            sur le site. ComptaFlow ne se substitue en aucun cas a un expert-comptable
            ou a un conseil fiscal.
          </p>
        </section>
      </div>
    </div>
  );
}
