import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Gerez les dossiers de vos clients
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Liste des clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
              <Plus className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium">Aucun client</h3>
            <p className="mt-1 max-w-sm text-sm text-zinc-500">
              Commencez par ajouter votre premier client pour gerer ses dossiers,
              documents et echeances.
            </p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un client
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
