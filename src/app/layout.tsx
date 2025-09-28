import MobileBottomNav from "@/components/MobileBottomNav";
import "../styles/globals.css";
import Link from "next/link";
import DesktopTopNav from "@/components/DesktopTopNav";

export const metadata = {
  title: "Cardápio & Mercado",
  description: "Planejamento semanal de refeições com lista de compras e estoque"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="min-h-dvh bg-slate-950 text-slate-100">
        <DesktopTopNav />
        <main className="mx-auto max-w-5xl p-4 sm:p-6 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-6">
          {children}
        </main>

        <MobileBottomNav />
      </body>
    </html>
  );
}
