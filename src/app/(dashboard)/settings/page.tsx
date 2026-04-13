"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, User, CreditCard, Download } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Parametres</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Gerez votre compte et votre cabinet
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input placeholder="Votre nom" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="vous@cabinet.fr" disabled />
            </div>
          </div>
          <Button>Enregistrer</Button>
        </CardContent>
      </Card>

      {/* Cabinet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5" />
            Cabinet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nom du cabinet</Label>
              <Input placeholder="Cabinet Martin" />
            </div>
            <div className="space-y-2">
              <Label>SIREN</Label>
              <Input placeholder="123 456 789" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Adresse</Label>
              <Input placeholder="12 rue des Lilas, 75001 Paris" />
            </div>
            <div className="space-y-2">
              <Label>Telephone</Label>
              <Input placeholder="01 23 45 67 89" />
            </div>
            <div className="space-y-2">
              <Label>Email de contact</Label>
              <Input type="email" placeholder="contact@cabinet.fr" />
            </div>
          </div>
          <Button>Enregistrer</Button>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5" />
            Abonnement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Plan Gratuit</p>
                <p className="text-sm text-zinc-500">
                  Jusqu&apos;a 5 clients, 50 Mo de stockage
                </p>
              </div>
              <Button variant="outline">Changer de plan</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Download className="h-5 w-5" />
            Export de donnees
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-zinc-500">
            Exportez vos donnees au format FEC ou CSV.
          </p>
          <div className="flex gap-3">
            <Button variant="outline">Export FEC</Button>
            <Button variant="outline">Export CSV clients</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
