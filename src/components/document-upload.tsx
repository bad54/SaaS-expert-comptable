"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, FileText } from "lucide-react";
import { DOCUMENT_TYPE_LABELS } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface Props {
  clientId: string;
  onUploaded: () => void;
}

export function DocumentUpload({ clientId, onUploaded }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [docType, setDocType] = useState("AUTRE");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    const supabase = createClient();

    try {
      for (const file of files) {
        const timestamp = Date.now();
        const filePath = `${clientId}/${timestamp}-${file.name}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("documents")
          .getPublicUrl(filePath);

        // Create document record in DB
        const res = await fetch(`/api/clients/${clientId}/documents`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name,
            type: docType,
            fileUrl: urlData.publicUrl,
            fileSize: file.size,
            mimeType: file.type,
            // TODO: use real userId from auth context
            uploadedById: "current-user",
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erreur lors de la creation du document");
        }
      }

      setFiles([]);
      onUploaded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Deposer des documents</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Drop zone */}
          <div
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 p-8 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <Upload className="mb-2 h-8 w-8 text-zinc-400" />
            <p className="text-sm font-medium">
              Cliquez ou deposez vos fichiers ici
            </p>
            <p className="text-xs text-zinc-500">
              PDF, images, Excel... (max 10 Mo par fichier)
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv,.doc,.docx"
            />
          </div>

          {/* Selected files */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border border-zinc-200 p-2 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-zinc-500">
                      ({(file.size / 1024).toFixed(0)} Ko)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Document type */}
          <div className="space-y-2">
            <Label>Type de document</Label>
            <Select value={docType} onChange={(e) => setDocType(e.target.value)}>
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Select>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" disabled={files.length === 0 || uploading}>
              {uploading ? "Upload en cours..." : `Deposer ${files.length} fichier(s)`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
