"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  X,
} from "lucide-react";
import {
  DEADLINE_TYPE_LABELS,
  DEADLINE_STATUS_LABELS,
  DEADLINE_STATUS_COLORS,
} from "@/types";

interface Deadline {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  dueDate: string;
  client: { id: string; name: string };
}

const MONTHS = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre",
];

export default function DeadlinesPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchDeadlines = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("month", `${year}-${String(month).padStart(2, "0")}`);
    if (filterType) params.set("type", filterType);
    if (filterStatus) params.set("status", filterStatus);

    try {
      const res = await fetch(`/api/deadlines?${params}`);
      const data = await res.json();
      setDeadlines(Array.isArray(data) ? data : []);
    } catch {
      setDeadlines([]);
    } finally {
      setLoading(false);
    }
  }, [year, month, filterType, filterStatus]);

  useEffect(() => {
    fetchDeadlines();
  }, [fetchDeadlines]);

  function prevMonth() {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  function nextMonth() {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  // Group deadlines by day
  const grouped = deadlines.reduce<Record<number, Deadline[]>>((acc, dl) => {
    const day = new Date(dl.dueDate).getDate();
    if (!acc[day]) acc[day] = [];
    acc[day].push(dl);
    return acc;
  }, {});

  // Calendar grid
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1; // Monday start

  // Stats
  const overdue = deadlines.filter((d) => d.status === "OVERDUE").length;
  const dueSoon = deadlines.filter((d) => d.status === "DUE_SOON").length;
  const upcoming = deadlines.filter((d) => d.status === "UPCOMING").length;
  const completed = deadlines.filter((d) => d.status === "COMPLETED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Echeancier</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Echeances fiscales et sociales de vos clients
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle echeance
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={AlertTriangle} label="En retard" value={overdue} color="text-red-600" />
        <StatCard icon={Clock} label="Bientot" value={dueSoon} color="text-amber-600" />
        <StatCard icon={Calendar} label="A venir" value={upcoming} color="text-blue-600" />
        <StatCard icon={CheckCircle2} label="Terminees" value={completed} color="text-green-600" />
      </div>

      {/* New deadline form */}
      {showForm && (
        <DeadlineForm
          onCreated={() => {
            setShowForm(false);
            fetchDeadlines();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Filters + Month navigation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold min-w-[180px] text-center">
            {MONTHS[month - 1]} {year}
          </span>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Tous les types</option>
            {Object.entries(DEADLINE_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Tous les statuts</option>
            {Object.entries(DEADLINE_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Calendar grid */}
      <Card>
        <CardContent className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
            </div>
          ) : (
            <>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-zinc-500 py-1">
                    {d}
                  </div>
                ))}
              </div>
              {/* Days */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: offset }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[80px]" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayDeadlines = grouped[day] || [];
                  const isToday =
                    day === now.getDate() &&
                    month === now.getMonth() + 1 &&
                    year === now.getFullYear();

                  return (
                    <div
                      key={day}
                      className={`min-h-[80px] rounded-md border p-1 ${
                        isToday
                          ? "border-zinc-900 bg-zinc-50 dark:border-zinc-50 dark:bg-zinc-900"
                          : "border-zinc-100 dark:border-zinc-800"
                      }`}
                    >
                      <span
                        className={`text-xs font-medium ${
                          isToday ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400"
                        }`}
                      >
                        {day}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {dayDeadlines.map((dl) => (
                          <div
                            key={dl.id}
                            className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${DEADLINE_STATUS_COLORS[dl.status]}`}
                            title={`${dl.title} - ${dl.client.name}`}
                          >
                            {dl.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* List view */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Toutes les echeances - {MONTHS[month - 1]} {year}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deadlines.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-8">
              Aucune echeance ce mois-ci
            </p>
          ) : (
            <div className="space-y-2">
              {deadlines.map((dl) => (
                <div
                  key={dl.id}
                  className="flex items-center justify-between rounded-md border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[40px]">
                      <div className="text-lg font-bold">
                        {new Date(dl.dueDate).getDate()}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {MONTHS[new Date(dl.dueDate).getMonth()]?.substring(0, 3)}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{dl.title}</p>
                      <p className="text-xs text-zinc-500">
                        {dl.client.name} - {DEADLINE_TYPE_LABELS[dl.type] ?? dl.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={DEADLINE_STATUS_COLORS[dl.status]}>
                      {DEADLINE_STATUS_LABELS[dl.status]}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        await fetch(`/api/deadlines/${dl.id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "COMPLETED" }),
                        });
                        fetchDeadlines();
                      }}
                      disabled={dl.status === "COMPLETED"}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <Icon className={`h-5 w-5 ${color}`} />
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-zinc-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DeadlineForm({
  onCreated,
  onCancel,
}: {
  onCreated: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("TVA");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !dueDate || !clientId) {
      setError("Le titre, la date et le client sont requis");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/deadlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, type, dueDate, description, clientId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Nouvelle echeance</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          {error && (
            <div className="sm:col-span-2 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label>Titre *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Declaration TVA T1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Type *</Label>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              {Object.entries(DEADLINE_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date d&apos;echeance *</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>ID Client *</Label>
            <Input
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="ID du client"
              required
            />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details supplementaires..."
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Creation..." : "Creer l'echeance"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
