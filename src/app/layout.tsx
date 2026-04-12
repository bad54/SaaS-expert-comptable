import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ComptaFlow - SaaS pour Experts-Comptables",
  description: "Plateforme de gestion pour experts-comptables et petits cabinets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
