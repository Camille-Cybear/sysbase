import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { MODULES } from "@/data/modules";
import { getAllFlashcards } from "@/lib/flashcards";
import { getAllFiches } from "@/lib/mdx";
import { getAllQuizQuestions } from "@/lib/quiz";

export const metadata: Metadata = {
  title: "sysbase — Révisions certifications IT",
  description:
    "Plateforme de révision pour les certifications IT : fiches, flashcards et quiz. Modules Réseaux, Active Directory, Linux, Sécurité, Virtualisation et Scripting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Compteurs de contenu réels, calculés côté serveur (accès fs autorisé).
  const allCards = getAllFlashcards();
  const counts = {
    modules: MODULES.length,
    flashcards: allCards.length,
    fiches: getAllFiches().length,
    quiz: getAllQuizQuestions().length,
  };
  const allCardIds = allCards.map((card) => card.id);

  return (
    <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <div className="flex min-h-screen">
          <Sidebar counts={counts} allCardIds={allCardIds} />
          <div className="flex flex-1 flex-col">
            <TopBar />
            <main className="flex flex-1 flex-col overflow-y-auto">
              <div className="flex-1 p-5">{children}</div>
              <Footer />
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
