"use client";
import React, { useEffect, useMemo, useState } from "react";

export type MarketItem = {
  item: string;
  unidade: "g" | "ml" | "un";
  quantidade: number;
  comprado?: boolean;
};

export default function GroceryList() {
  const [list, setList] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/mercado", { cache: "no-store" });
    const json = await res.json();
    setList(json.lista || []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function toggleComprado(it: MarketItem) {
    const body = { item: it.item, unidade: it.unidade, comprado: !it.comprado };
    await fetch("/api/mercado", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await load();
  }

  function exportCSV() {
    const header = "item;unidade;quantidade;comprado\n";
    const body = list
      .map(
        (r) =>
          `${r.item};${r.unidade};${r.quantidade};${r.comprado ? "sim" : "nao"}`
      )
      .join("\n");
    const blob = new Blob([header + body], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lista_mercado_semanal.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list
      .slice()
      .sort((a, b) => a.item.localeCompare(b.item))
      .filter((r) => !q || r.item.toLowerCase().includes(q));
  }, [list, query]);

  const totals = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filtered.filter((x) => !x.comprado)) {
      map.set(r.unidade, (map.get(r.unidade) || 0) + r.quantidade);
    }
    return Array.from(map.entries()).map(([unidade, quantidade]) => ({
      unidade,
      quantidade,
    }));
  }, [filtered]);

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Lista de Mercado (Semana)</h2>
          <p className="text-xs text-slate-400">
            Marque o que já comprou. Persistência em <code>/data/mercado.json</code>.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64"
            placeholder="Buscar item..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={exportCSV}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <p className="mt-3 text-sm text-slate-400" aria-busy="true">
          Carregando...
        </p>
      )}

      {/* Lista */}
      <ul className="mt-4 divide-y divide-slate-700">
        {filtered.map((r) => {
          const key = `${r.item}-${r.unidade}`;
          const checked = !!r.comprado;
          return (
            <li key={key} className="flex items-center justify-between gap-3 py-3">
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleComprado(r)}
                  className="h-5 w-5 accent-blue-600"
                />
                <span
                  className={[
                    "text-sm",
                    checked ? "line-through text-slate-500" : "text-slate-200",
                  ].join(" ")}
                >
                  {r.item}
                </span>
              </span>

              <span className="inline-flex items-center rounded-md border border-slate-600 bg-slate-800/60 px-2 py-0.5 text-xs text-slate-200">
                {r.quantidade} {r.unidade}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Totais por unidade (restante não comprado) */}
      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        {totals.map((t) => (
          <span
            key={t.unidade}
            className="inline-flex items-center rounded-full border border-slate-600 bg-slate-800/60 px-2 py-0.5 text-xs text-slate-200"
          >
            Restante: {t.quantidade} {t.unidade}
          </span>
        ))}
      </div>
    </div>
  );
}
