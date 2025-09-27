import "../styles/globals.css";
import Link from "next/link";

export const metadata = {
  title: "Cardápio & Mercado",
  description: "Planejamento semanal de refeições com lista de compras e estoque"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <div className="container">
          <header className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
            <h1 className="title">🍽️ Cardápio • 🛒 Mercado • 📦 Estoque</h1>
            <nav className="row" style={{ gap: 8 }}>
              <Link className="btn ghost" href="/">Cardápio do dia</Link>
              <Link className="btn ghost" href="/mercado">Lista de mercado</Link>
              <Link className="btn ghost" href="/estoque">Controle de estoque</Link>
            </nav>
          </header>
          {children}
          <footer className="small muted" style={{ marginTop: 24 }}>
            Dados salvos em JSON local em <code>/data</code> (ambiente de desenvolvimento).
          </footer>
        </div>
      </body>
    </html>
  );
}
