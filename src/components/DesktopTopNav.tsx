"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const items = [
  { href: "/", label: "Hoje" },
  { href: "/mercado", label: "Mercado" },
  { href: "/estoque", label: "Estoque" },
];

export default function DesktopTopNav() {
  const pathname = usePathname();

  return (
    <header className="hidden md:block sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <h1 className="title">🍽️ Cardápio • 🛒 Mercado • 📦 Estoque</h1>
          <nav className="flex items-center gap-4" aria-label="Navegação principal">
            {items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-sm transition
                    ${active ? "bg-blue-600 text-white" : "btn ghost"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
