import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  FileText,
  Calendar,
  MessageSquare,
  ScanLine,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestion des dossiers",
    desc: "Centralisez les fiches clients, SIREN, forme juridique, regime fiscal.",
  },
  {
    icon: FileText,
    title: "Collecte de pieces",
    desc: "Portail client pour deposer factures, releves et justificatifs.",
  },
  {
    icon: ScanLine,
    title: "OCR intelligent",
    desc: "Extraction automatique des donnees : montant, date, fournisseur.",
  },
  {
    icon: Calendar,
    title: "Echeancier fiscal",
    desc: "Rappels TVA, IS, charges sociales. Ne manquez plus aucune echeance.",
  },
  {
    icon: MessageSquare,
    title: "Messagerie integree",
    desc: "Echangez directement avec vos clients depuis la plateforme.",
  },
  {
    icon: Shield,
    title: "Export FEC",
    desc: "Generez le Fichier des Ecritures Comptables conforme DGFiP.",
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          La gestion de cabinet
          <br />
          <span className="text-zinc-500">simplifiee</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          ComptaFlow centralise vos dossiers clients, collecte les pieces comptables,
          automatise les echeances fiscales et genere vos exports FEC.
          Tout ca sans infrastructure lourde.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="h-12 px-8 text-base">
              Commencer gratuitement
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              Voir les tarifs
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-zinc-500">
          Gratuit jusqu&apos;a 5 clients. Aucune carte bancaire requise.
        </p>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-24 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">
            Tout ce dont un cabinet a besoin
          </h2>
          <p className="mt-4 text-center text-zinc-500">
            Une plateforme complete pour gerer votre cabinet au quotidien.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title}>
                <CardContent className="p-6">
                  <f.icon className="h-8 w-8 text-zinc-900 dark:text-zinc-50" />
                  <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-zinc-500">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-bold">Concu pour le cabinet solo</h2>
          <p className="mt-4 text-zinc-500">
            Pas besoin d&apos;une equipe IT. Deployez en quelques minutes.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-4xl font-bold">0 EUR</p>
              <p className="mt-1 text-sm text-zinc-500">
                Pour demarrer. Aucun cout cache.
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold">&lt; 2 min</p>
              <p className="mt-1 text-sm text-zinc-500">
                Pour creer votre compte et ajouter votre premier client.
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold">100%</p>
              <p className="mt-1 text-sm text-zinc-500">
                Web. Accessible partout, sur tous les appareils.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200 bg-zinc-900 py-20 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">
            Pret a simplifier votre cabinet ?
          </h2>
          <p className="mt-4 text-zinc-400">
            Rejoignez ComptaFlow et concentrez-vous sur ce qui compte :
            vos clients.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="mt-8 h-12 bg-white px-8 text-base text-zinc-900 hover:bg-zinc-200"
            >
              Creer mon compte gratuitement
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
