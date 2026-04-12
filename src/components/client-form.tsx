"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FORME_JURIDIQUE_LABELS, REGIME_FISCAL_LABELS } from "@/types";

interface ClientData {
  id?: string;
  name: string;
  siren: string;
  siret: string;
  formeJuridique: string;
  regimeFiscal: string;
  address: string;
  phone: string;
  email: string;
  notes: string;
}

const emptyClient: ClientData = {
  name: "",
  siren: "",
  siret: "",
  formeJuridique: "",
  regimeFiscal: "",
  address: "",
  phone: "",
  email: "",
  notes: "",
};

export function ClientForm({ initialData }: { initialData?: ClientData }) {
  const router = useRouter();
  const isEditing = !!initialData?.id;
  const [data, setData] = useState<ClientData>(initialData ?? emptyClient);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof ClientData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!data.name.trim()) {
      setError("Le nom du client est requis");
      setLoading(false);
      return;
    }

    try {
      const url = isEditing ? `/api/clients/${initialData!.id}` : "/api/clients";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          // TODO: use real cabinetId from auth context
          cabinetId: "default-cabinet",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de l'enregistrement");
      }

      const client = await res.json();
      router.push(`/clients/${client.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Informations generales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations generales</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Nom / Raison sociale *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Ex: Boulangerie Martin SARL"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siren">SIREN</Label>
            <Input
              id="siren"
              value={data.siren}
              onChange={(e) => update("siren", e.target.value)}
              placeholder="123 456 789"
              maxLength={11}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siret">SIRET</Label>
            <Input
              id="siret"
              value={data.siret}
              onChange={(e) => update("siret", e.target.value)}
              placeholder="123 456 789 00012"
              maxLength={17}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="formeJuridique">Forme juridique</Label>
            <Select
              id="formeJuridique"
              value={data.formeJuridique}
              onChange={(e) => update("formeJuridique", e.target.value)}
            >
              <option value="">Selectionner...</option>
              {Object.entries(FORME_JURIDIQUE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="regimeFiscal">Regime fiscal</Label>
            <Select
              id="regimeFiscal"
              value={data.regimeFiscal}
              onChange={(e) => update("regimeFiscal", e.target.value)}
            >
              <option value="">Selectionner...</option>
              {Object.entries(REGIME_FISCAL_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Coordonnees */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Coordonnees</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={data.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="12 rue des Lilas, 75001 Paris"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telephone</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="01 23 45 67 89"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="contact@entreprise.fr"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Notes internes sur ce client..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? "Enregistrement..."
            : isEditing
              ? "Mettre a jour"
              : "Creer le client"}
        </Button>
      </div>
    </form>
  );
}
