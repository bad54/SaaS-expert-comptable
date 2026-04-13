import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, Upload } from "lucide-react";
import Link from "next/link";

export default function PortalHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bienvenue</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Votre espace client pour echanger avec votre expert-comptable
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Upload className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-lg mt-2">Deposer des documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500 mb-4">
              Envoyez vos factures, releves bancaires et justificatifs.
            </p>
            <Link href="/portal/documents">
              <Button className="w-full">Deposer un document</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileText className="h-8 w-8 text-green-600" />
            <CardTitle className="text-lg mt-2">Mes documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500 mb-4">
              Consultez tous vos documents deposes et leur statut.
            </p>
            <Link href="/portal/documents">
              <Button variant="outline" className="w-full">Voir mes documents</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <MessageSquare className="h-8 w-8 text-amber-600" />
            <CardTitle className="text-lg mt-2">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500 mb-4">
              Echangez avec votre comptable, posez vos questions.
            </p>
            <Link href="/portal/messages">
              <Button variant="outline" className="w-full">Envoyer un message</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Pending requests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pieces demandees</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-500 text-center py-6">
            Votre comptable n&apos;a pas encore de demande de pieces en attente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
