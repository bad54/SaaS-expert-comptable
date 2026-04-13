"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Eye,
  ScanLine,
} from "lucide-react";
import {
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_STATUS_COLORS,
} from "@/types";

interface DocumentRow {
  id: string;
  name: string;
  type: string;
  status: string;
  fileUrl: string;
  fileSize: number | null;
  mimeType: string | null;
  ocrData: Record<string, unknown> | null;
  createdAt: string;
  client: { id: string; name: string };
  uploadedBy: { id: string; name: string | null; email: string };
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [ocrResult, setOcrResult] = useState<Record<string, unknown> | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all clients' documents
      const res = await fetch("/api/clients?limit=100");
      const data = await res.json();
      const allDocs: DocumentRow[] = [];

      for (const client of data.clients ?? []) {
        const params = new URLSearchParams();
        if (filterType) params.set("type", filterType);
        if (filterStatus) params.set("status", filterStatus);

        const docRes = await fetch(`/api/clients/${client.id}/documents?${params}`);
        const docs = await docRes.json();
        if (Array.isArray(docs)) {
          allDocs.push(...docs.map((d: DocumentRow) => ({ ...d, client: { id: client.id, name: client.name } })));
        }
      }

      // Filter by search
      const filtered = search
        ? allDocs.filter(
            (d) =>
              d.name.toLowerCase().includes(search.toLowerCase()) ||
              d.client.name.toLowerCase().includes(search.toLowerCase())
          )
        : allDocs;

      // Sort by date desc
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setDocuments(filtered);
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [search, filterType, filterStatus]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  async function handleOcr(doc: DocumentRow) {
    setProcessing(doc.id);
    setSelectedDoc(doc.id);
    setOcrResult(null);

    try {
      // Client-side OCR with Tesseract.js
      const Tesseract = await import("tesseract.js");
      const { data } = await Tesseract.recognize(doc.fileUrl, "fra");

      // Send text to server for extraction
      const res = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.text, docType: doc.type }),
      });

      const result = await res.json();
      setOcrResult(result);

      // Update document with OCR data
      await fetch(`/api/documents/${doc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PROCESSING" }),
      });

      fetchDocuments();
    } catch {
      setOcrResult({ error: "Erreur OCR - le fichier doit etre une image" });
    } finally {
      setProcessing(null);
    }
  }

  async function updateStatus(docId: string, status: string) {
    await fetch(`/api/documents/${docId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchDocuments();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Tous les documents de vos clients - OCR et validation
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            window.open("/api/export/fec?clientId=all", "_blank");
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Export FEC
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Rechercher par nom de document ou client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">Tous les types</option>
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Tous les statuts</option>
              {Object.entries(DOCUMENT_STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Document list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
        </div>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-8 w-8 text-zinc-300 mb-2" />
            <p className="text-sm text-zinc-500">Aucun document</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-zinc-500">
                        {doc.client.name} - {DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type}
                        {doc.fileSize && ` - ${(doc.fileSize / 1024).toFixed(0)} Ko`}
                        {" - "}{new Date(doc.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={DOCUMENT_STATUS_COLORS[doc.status]}>
                      {DOCUMENT_STATUS_LABELS[doc.status]}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOcr(doc)}
                      disabled={processing === doc.id}
                      title="Lancer l'OCR"
                    >
                      <ScanLine className={`h-4 w-4 ${processing === doc.id ? "animate-pulse" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateStatus(doc.id, "VALIDATED")}
                      disabled={doc.status === "VALIDATED"}
                      title="Valider"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateStatus(doc.id, "REJECTED")}
                      disabled={doc.status === "REJECTED"}
                      title="Rejeter"
                    >
                      <XCircle className="h-4 w-4 text-red-600" />
                    </Button>
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" title="Voir le fichier">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>

                {/* OCR result */}
                {selectedDoc === doc.id && ocrResult && (
                  <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <h4 className="text-sm font-semibold mb-2">Resultat OCR</h4>
                    {ocrResult.error ? (
                      <p className="text-sm text-red-600">{String(ocrResult.error)}</p>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <OcrField label="Date" value={getNestedValue(ocrResult, "extractedData.date")} />
                        <OcrField label="Montant" value={getNestedValue(ocrResult, "extractedData.amount")} />
                        <OcrField label="Fournisseur" value={getNestedValue(ocrResult, "extractedData.vendor")} />
                        <OcrField label="N. Facture" value={getNestedValue(ocrResult, "extractedData.invoiceNumber")} />
                        <OcrField label="TVA" value={getNestedValue(ocrResult, "extractedData.vatAmount")} />
                        <div className="sm:col-span-2 mt-2 border-t pt-2">
                          <h5 className="text-xs font-semibold text-zinc-500 mb-1">Ecriture suggeree</h5>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <OcrField label="Compte" value={getNestedValue(ocrResult, "suggestedEntry.account")} />
                            <OcrField label="Journal" value={getNestedValue(ocrResult, "suggestedEntry.journal")} />
                            <OcrField label="Libelle" value={getNestedValue(ocrResult, "suggestedEntry.label")} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function OcrField({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-[10px] text-zinc-500">{label}</p>
      <p className="text-sm font-medium">{value ?? "-"}</p>
    </div>
  );
}

function getNestedValue(obj: Record<string, unknown>, path: string): string | null {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return null;
    }
  }
  return current ? String(current) : null;
}
