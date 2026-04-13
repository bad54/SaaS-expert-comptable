"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Calendar,
  Upload,
  Send,
  CalendarPlus,
} from "lucide-react";
import {
  FORME_JURIDIQUE_LABELS,
  REGIME_FISCAL_LABELS,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_STATUS_COLORS,
} from "@/types";
import { DocumentUpload } from "@/components/document-upload";

interface ClientDetail {
  id: string;
  name: string;
  siren: string | null;
  siret: string | null;
  formeJuridique: string | null;
  regimeFiscal: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  createdAt: string;
  documents: {
    id: string;
    name: string;
    type: string;
    status: string;
    fileUrl: string;
    fileSize: number | null;
    mimeType: string | null;
    createdAt: string;
  }[];
  deadlines: {
    id: string;
    title: string;
    type: string;
    status: string;
    dueDate: string;
  }[];
  _count: { documents: number; deadlines: number; messages: number };
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"info" | "documents" | "deadlines">("info");
  const [showUpload, setShowUpload] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [generatingDeadlines, setGeneratingDeadlines] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);

  const fetchClient = useCallback(async () => {
    try {
      const res = await fetch(`/api/clients/${clientId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setClient(data);
    } catch {
      setClient(null);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  async function handleDelete() {
    if (!confirm("Supprimer ce client et tous ses documents ? Cette action est irreversible.")) return;
    setDeleting(true);
    try {
      await fetch(`/api/clients/${clientId}`, { method: "DELETE" });
      router.push("/clients");
    } catch {
      setDeleting(false);
    }
  }

  async function handleGenerateDeadlines() {
    if (!confirm("Generer automatiquement les echeances fiscales pour cette annee ?")) return;
    setGeneratingDeadlines(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/generate-deadlines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: new Date().getFullYear() }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchClient();
      } else {
        alert(data.error);
      }
    } catch {
      alert("Erreur lors de la generation");
    } finally {
      setGeneratingDeadlines(false);
    }
  }

  async function handleInvite() {
    if (!client?.email) {
      alert("Ce client n'a pas d'email. Modifiez sa fiche d'abord.");
      return;
    }
    setInviting(true);
    setInviteMessage(null);
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, email: client.email }),
      });
      const data = await res.json();
      setInviteMessage(res.ok ? data.message : data.error);
    } catch {
      setInviteMessage("Erreur d'envoi");
    } finally {
      setInviting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Client introuvable</h2>
        <Link href="/clients">
          <Button variant="outline" className="mt-4">Retour aux clients</Button>
        </Link>
      </div>
    );
  }

  const tabs = [
    { key: "info" as const, label: "Informations" },
    { key: "documents" as const, label: `Documents (${client._count.documents})` },
    { key: "deadlines" as const, label: `Echeances (${client._count.deadlines})` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/clients">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
              {client.formeJuridique && (
                <Badge variant="secondary">
                  {FORME_JURIDIQUE_LABELS[client.formeJuridique]}
                </Badge>
              )}
            </div>
            {client.siren && (
              <p className="text-sm text-zinc-500">SIREN: {client.siren}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleInvite}
            disabled={inviting}
            title="Inviter au portail client"
          >
            <Send className="mr-2 h-4 w-4" />
            {inviting ? "Envoi..." : "Inviter"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateDeadlines}
            disabled={generatingDeadlines}
            title="Generer les echeances selon le regime fiscal"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            {generatingDeadlines ? "Generation..." : "Echeances auto"}
          </Button>
          <Link href={`/clients/${client.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleting ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Invite message */}
      {inviteMessage && (
        <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {inviteMessage}
        </div>
      )}

      {/* Tab content */}
      {tab === "info" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Identification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={Building2} label="Raison sociale" value={client.name} />
              <InfoRow icon={Building2} label="SIREN" value={client.siren} />
              <InfoRow icon={Building2} label="SIRET" value={client.siret} />
              <InfoRow
                icon={Building2}
                label="Forme juridique"
                value={client.formeJuridique ? FORME_JURIDIQUE_LABELS[client.formeJuridique] : null}
              />
              <InfoRow
                icon={Building2}
                label="Regime fiscal"
                value={client.regimeFiscal ? REGIME_FISCAL_LABELS[client.regimeFiscal] : null}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Coordonnees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={Mail} label="Email" value={client.email} />
              <InfoRow icon={Phone} label="Telephone" value={client.phone} />
              <InfoRow icon={MapPin} label="Adresse" value={client.address} />
            </CardContent>
          </Card>

          {client.notes && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{client.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {tab === "documents" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowUpload(!showUpload)}>
              <Upload className="mr-2 h-4 w-4" />
              Deposer un document
            </Button>
          </div>

          {showUpload && (
            <DocumentUpload
              clientId={client.id}
              onUploaded={() => {
                setShowUpload(false);
                fetchClient();
              }}
            />
          )}

          {client.documents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="mx-auto h-8 w-8 text-zinc-400" />
                <p className="mt-2 text-sm text-zinc-500">Aucun document pour ce client</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {client.documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-zinc-400" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-zinc-500">
                          {DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type}
                          {doc.fileSize && ` - ${formatFileSize(doc.fileSize)}`}
                          {" - "}
                          {new Date(doc.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <Badge className={DOCUMENT_STATUS_COLORS[doc.status]}>
                      {DOCUMENT_STATUS_LABELS[doc.status]}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "deadlines" && (
        <div>
          {client.deadlines.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="mx-auto h-8 w-8 text-zinc-400" />
                <p className="mt-2 text-sm text-zinc-500">Aucune echeance pour ce client</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {client.deadlines.map((dl) => (
                <Card key={dl.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{dl.title}</p>
                      <p className="text-xs text-zinc-500">{dl.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(dl.dueDate).toLocaleDateString("fr-FR")}
                      </p>
                      <Badge variant="secondary">{dl.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-zinc-400" />
      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="text-sm font-medium">{value || "-"}</p>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}
