"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X } from "lucide-react";
import { DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS, DOCUMENT_STATUS_COLORS } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PortalDocumentsPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [docType, setDocType] = useState("AUTRE");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setFiles(Array.from(e.target.files));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files) setFiles(Array.from(e.dataTransfer.files));
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    try {
      for (const file of files) {
        const timestamp = Date.now();
        const filePath = `portal/${timestamp}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("documents")
          .getPublicUrl(filePath);

        // TODO: use real clientId and userId from portal auth
        await fetch("/api/clients/portal-client/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name,
            type: docType,
            fileUrl: urlData.publicUrl,
            fileSize: file.size,
            mimeType: file.type,
            uploadedById: "portal-user",
          }),
        });
      }

      setFiles([]);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du depot");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mes documents</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Deposez et consultez vos documents comptables
        </p>
      </div>

      {/* Upload form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Deposer un document</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
                Document(s) depose(s) avec succes !
              </div>
            )}

            <div
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 p-8 transition-colors hover:border-zinc-400"
              onClick={() => document.getElementById("portal-file-input")?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <Upload className="mb-2 h-8 w-8 text-zinc-400" />
              <p className="text-sm font-medium">Cliquez ou deposez vos fichiers ici</p>
              <p className="text-xs text-zinc-500">PDF, images, Excel... (max 10 Mo)</p>
              <Input
                id="portal-file-input"
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv,.doc,.docx"
              />
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md border p-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-zinc-500">({(file.size / 1024).toFixed(0)} Ko)</span>
                    </div>
                    <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))}>
                      <X className="h-4 w-4 text-zinc-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label>Type de document</Label>
              <Select value={docType} onChange={(e) => setDocType(e.target.value)}>
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={files.length === 0 || uploading}>
              {uploading ? "Envoi en cours..." : `Deposer ${files.length} fichier(s)`}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent documents placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Documents deposes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="mx-auto h-8 w-8 text-zinc-300 mb-2" />
            <p className="text-sm text-zinc-500">
              Vos documents deposes apparaitront ici.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
