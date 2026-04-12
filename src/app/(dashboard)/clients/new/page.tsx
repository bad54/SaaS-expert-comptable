import { ClientForm } from "@/components/client-form";

export default function NewClientPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nouveau client</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Ajoutez un nouveau dossier client a votre cabinet
        </p>
      </div>
      <ClientForm />
    </div>
  );
}
