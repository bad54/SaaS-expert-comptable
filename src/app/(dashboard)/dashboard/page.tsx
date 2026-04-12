import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Calendar, AlertTriangle } from "lucide-react";

const stats = [
  { name: "Clients actifs", value: "0", icon: Users, color: "text-blue-600" },
  { name: "Documents en attente", value: "0", icon: FileText, color: "text-amber-600" },
  { name: "Echeances ce mois", value: "0", icon: Calendar, color: "text-green-600" },
  { name: "Alertes", value: "0", icon: AlertTriangle, color: "text-red-600" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Vue d&apos;ensemble de votre cabinet
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">
                {stat.name}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Echeances a venir</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">
              Aucune echeance pour le moment. Ajoutez des clients pour commencer.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activite recente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">
              Aucune activite recente.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
