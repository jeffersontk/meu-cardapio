"use client";
import React, { useEffect, useRef, useState } from "react";

export type Unidade = "g" | "ml" | "un";
export type StockItem = { item: string; unidade: Unidade; quantidade: number };

export default function StockManager() {
  const [itens, setItens] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/estoque", { cache: "no-store" });
    const json = await res.json();
    setItens(json.itens || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function upsert(item: Partial<StockItem> & { delta?: number }) {
    await fetch("/api/estoque", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    await load();
  }
  async function addNew(item: StockItem) {
    await fetch("/api/estoque", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    await load();
  }
  async function remove(item: StockItem) {
    await fetch("/api/estoque", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    await load();
  }

  const [form, setForm] = useState<StockItem>({ item: "", unidade: "g", quantidade: 0 });
  const itemRef = useRef<HTMLInputElement>(null);

  const stepFor = (u: Unidade) => (u === "un" ? 1 : 100);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.item.trim()) return;
    addNew(form);
    setForm({ item: "", unidade: "g", quantidade: 0 });
    itemRef.current?.focus();
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Controle de Estoque</h2>
          <p className="text-xs text-slate-400">
            Persistência em <code>/data/estoque.json</code>. Use +/− para entrada/saída rápida.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleAdd} className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-5">
        <input
          ref={itemRef}
          className="col-span-2 rounded-lg border border-slate-600 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Item (ex.: Arroz branco)"
          value={form.item}
          onChange={(e) => setForm({ ...form, item: e.target.value })}
        />
        <select
          className="rounded-lg border border-slate-600 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.unidade}
          onChange={(e) => setForm({ ...form, unidade: e.target.value as Unidade })}
        >
          <option value="g">g</option>
          <option value="ml">ml</option>
          <option value="un">un</option>
        </select>
        <input
          type="number"
          className="rounded-lg border border-slate-600 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Quantidade"
          value={form.quantidade}
          onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) })}
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Adicionar
        </button>
      </form>

      {/* Loading */}
      {loading && (
        <p className="mt-3 text-sm text-slate-400" aria-busy="true">
          Carregando...
        </p>
      )}

      {/* Lista */}
      <ul className="mt-4 divide-y divide-slate-700">
        {itens
          .slice()
          .sort((a, b) => a.item.localeCompare(b.item))
          .map((r) => {
            const step = stepFor(r.unidade);
            return (
              <li key={r.item + "-" + r.unidade} className="flex flex-col items-start justify-between gap-3 py-3 sm:flex-row sm:items-center">
                <span className="flex items-center gap-2">
                  <strong className="text-slate-100">{r.item}</strong>
                  <span className="inline-flex items-center rounded-md border border-slate-600 bg-slate-800/60 px-2 py-0.5 text-xs text-slate-200">
                    {r.unidade}
                  </span>
                </span>

                <span className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => upsert({ item: r.item, unidade: r.unidade, delta: -step })}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-600 bg-slate-800/60 px-3 text-sm text-slate-100 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Remover ${step} ${r.unidade} de ${r.item}`}
                  >
                    −{step}
                  </button>
                  <span className="inline-flex items-center rounded-md border border-slate-600 bg-slate-800/60 px-2 py-0.5 text-xs text-slate-200">
                    {r.quantidade} {r.unidade}
                  </span>
                  <button
                    type="button"
                    onClick={() => upsert({ item: r.item, unidade: r.unidade, delta: step })}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-600 bg-slate-800/60 px-3 text-sm text-slate-100 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Adicionar ${step} ${r.unidade} a ${r.item}`}
                  >
                    +{step}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(r)}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-700 px-3 text-sm text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Remover item ${r.item}`}
                  >
                    Remover
                  </button>
                </span>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
