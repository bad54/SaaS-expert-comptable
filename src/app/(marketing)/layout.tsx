import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Navbar */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-sm font-bold text-white dark:bg-zinc-50 dark:text-zinc-900">
              C
            </div>
            <span className="text-lg font-semibold">ComptaFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Tarifs
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">Se connecter</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Essai gratuit</Button>
            </Link>
          </div>
        </div>
      </nav>

      {children}

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-zinc-500">
              ComptaFlow - Simplifie la vie des experts-comptables
            </p>
            <div className="flex gap-4 text-sm text-zinc-500">
              <Link href="/cgu" className="hover:text-zinc-900 dark:hover:text-zinc-50">CGU</Link>
              <Link href="/confidentialite" className="hover:text-zinc-900 dark:hover:text-zinc-50">Confidentialite</Link>
              <Link href="/mentions-legales" className="hover:text-zinc-900 dark:hover:text-zinc-50">Mentions legales</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
