"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Building2, FileText, Calendar } from "lucide-react";
import { FORME_JURIDIQUE_LABELS, REGIME_FISCAL_LABELS } from "@/types";

interface ClientRow {
  id: string;
  name: string;
  siren: string | null;
  email: string | null;
  formeJuridique: string | null;
  regimeFiscal: string | null;
  createdAt: string;
  _count: { documents: number; deadlines: number };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [search, setSearch] = useState("");
  const [formeJuridique, setFormeJuridique] = useState("");
  const [regimeFiscal, setRegimeFiscal] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (formeJuridique) params.set("formeJuridique", formeJuridique);
    if (regimeFiscal) params.set("regimeFiscal", regimeFiscal);
    params.set("page", String(page));

    try {
      const res = await fetch(`/api/clients?${params}`);
      const data = await res.json();
      setClients(data.clients);
      setPagination(data.pagination);
    } catch {
      // API not connected yet - show empty state
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [search, formeJuridique, regimeFiscal, page]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Debounced search
  useEffect(() => {
    setPage(1);
  }, [search, formeJuridique, regimeFiscal]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {pagination ? `${pagination.total} client(s)` : "Gerez les dossiers de vos clients"}
          </p>
        </div>
        <Link href="/clients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau client
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Rechercher par nom, SIREN ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={formeJuridique}
              onChange={(e) => setFormeJuridique(e.target.value)}
            >
              <option value="">Toutes les formes</option>
              {Object.entries(FORME_JURIDIQUE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Select>
            <Select
              value={regimeFiscal}
              onChange={(e) => setRegimeFiscal(e.target.value)}
            >
              <option value="">Tous les regimes</option>
              {Object.entries(REGIME_FISCAL_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Client list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
        </div>
      ) : clients.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
                <Building2 className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-medium">Aucun client</h3>
              <p className="mt-1 max-w-sm text-sm text-zinc-500">
                Commencez par ajouter votre premier client pour gerer ses dossiers,
                documents et echeances.
              </p>
              <Link href="/clients/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un client
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {clients.map((client) => (
            <Link key={client.id} href={`/clients/${client.id}`}>
              <Card className="transition-colors hover:border-zinc-300 dark:hover:border-zinc-700">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold dark:bg-zinc-800">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium">{client.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        {client.siren && <span>SIREN: {client.siren}</span>}
                        {client.email && <span>{client.email}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {client.formeJuridique && (
                      <Badge variant="secondary">
                        {FORME_JURIDIQUE_LABELS[client.formeJuridique] ?? client.formeJuridique}
                      </Badge>
                    )}
                    <div className="flex items-center gap-3 text-sm text-zinc-500">
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {client._count.documents}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {client._count.deadlines}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Precedent
              </Button>
              <span className="text-sm text-zinc-500">
                Page {pagination.page} sur {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Suivant
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
