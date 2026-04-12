"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ClientForm } from "@/components/client-form";

export default function EditClientPage() {
  const params = useParams();
  const clientId = params.id as string;

  const [initialData, setInitialData] = useState<{
    id: string;
    name: string;
    siren: string;
    siret: string;
    formeJuridique: string;
    regimeFiscal: string;
    address: string;
    phone: string;
    email: string;
    notes: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/clients/${clientId}`);
        if (!res.ok) throw new Error();
        const client = await res.json();
        setInitialData({
          id: client.id,
          name: client.name ?? "",
          siren: client.siren ?? "",
          siret: client.siret ?? "",
          formeJuridique: client.formeJuridique ?? "",
          regimeFiscal: client.regimeFiscal ?? "",
          address: client.address ?? "",
          phone: client.phone ?? "",
          email: client.email ?? "",
          notes: client.notes ?? "",
        });
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
      </div>
    );
  }

  if (!initialData) {
    return <p className="text-center py-12">Client introuvable</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Modifier le client</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Mettez a jour les informations de ce dossier
        </p>
      </div>
      <ClientForm initialData={initialData} />
    </div>
  );
}
