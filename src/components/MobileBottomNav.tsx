"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Item = { href: string; label: string; icon: (active: boolean) => React.ReactNode };

const HomeIcon = (active: boolean) => (
  <svg viewBox="0 0 24 24" className={`h-6 w-6 ${active ? "text-blue-500" : "text-slate-300"}`} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CartIcon = (active: boolean) => (
  <svg viewBox="0 0 24 24" className={`h-6 w-6 ${active ? "text-blue-500" : "text-slate-300"}`} fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="17" cy="20" r="1.5" />
    <path d="M3 4h2l2.4 10.2A2 2 0 0 0 9.35 16H18a2 2 0 0 0 1.96-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BoxesIcon = (active: boolean) => (
  <svg viewBox="0 0 24 24" className={`h-6 w-6 ${active ? "text-blue-500" : "text-slate-300"}`} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 7l9-4 9 4-9 4-9-4z" />
    <path d="M3 17l9 4 9-4" />
    <path d="M3 12l9 4 9-4" />
  </svg>
);

const items: Item[] = [
  { href: "/",        label: "Hoje",    icon: HomeIcon },
  { href: "/mercado", label: "Mercado", icon: CartIcon },
  { href: "/estoque", label: "Estoque", icon: BoxesIcon },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-slate-700 bg-slate-900/90 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70"
      role="navigation"
      aria-label="Navegação principal"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex h-16 max-w-3xl items-center justify-around px-2">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs transition
                  ${active ? "text-blue-500" : "text-slate-300 hover:text-white"}`}
                aria-current={active ? "page" : undefined}
              >
                {item.icon(active)}
                <span className="leading-tight">{item.label}</span>
                {active && <span className="mt-0.5 h-0.5 w-6 rounded-full bg-blue-500" aria-hidden />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
