"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { PLANS, type PlanKey } from "@/lib/stripe";

export default function PricingPage() {
  const [loading, setLoading] = useState<PlanKey | null>(null);

  async function handleCheckout(plan: PlanKey) {
    const planData = PLANS[plan];
    if (!planData.priceId) {
      // Free plan, just redirect to register
      window.location.href = "/register";
      return;
    }

    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: planData.priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // handle error
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Tarifs simples et transparents
          </h1>
          <p className="mt-4 text-lg text-zinc-500">
            Commencez gratuitement, evoluez quand vous etes pret.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {(Object.entries(PLANS) as [PlanKey, (typeof PLANS)[PlanKey]][]).map(
            ([key, plan]) => {
              const isPopular = key === "pro";
              return (
                <Card
                  key={key}
                  className={`relative ${
                    isPopular
                      ? "border-zinc-900 shadow-lg dark:border-zinc-50"
                      : ""
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 px-4 py-1 text-xs font-semibold text-white dark:bg-zinc-50 dark:text-zinc-900">
                      Le plus populaire
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        {plan.price === 0 ? "0" : plan.price}
                      </span>
                      <span className="text-zinc-500">
                        {plan.price === 0 ? " EUR" : " EUR/mois"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {key === "free" ? (
                      <Link href="/register" className="block">
                        <Button variant="outline" className="w-full">
                          Commencer gratuitement
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handleCheckout(key)}
                        disabled={loading === key}
                      >
                        {loading === key ? "Redirection..." : "Choisir ce plan"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>

        {/* FAQ */}
        <div className="mt-24 mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-8">Questions frequentes</h2>
          <div className="space-y-6">
            <FaqItem
              q="Puis-je changer de plan a tout moment ?"
              a="Oui, vous pouvez passer a un plan superieur ou inferieur a tout moment. Le changement prend effet immediatement."
            />
            <FaqItem
              q="Y a-t-il un engagement ?"
              a="Non, tous les plans sont sans engagement. Vous pouvez annuler a tout moment."
            />
            <FaqItem
              q="Mes donnees sont-elles en securite ?"
              a="Oui, toutes les donnees sont chiffrees et hebergees sur des serveurs securises en Europe."
            />
            <FaqItem
              q="Puis-je exporter mes donnees ?"
              a="Oui, l'export FEC et CSV est disponible sur tous les plans payants."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <h3 className="font-medium">{q}</h3>
      <p className="mt-2 text-sm text-zinc-500">{a}</p>
    </div>
  );
}
