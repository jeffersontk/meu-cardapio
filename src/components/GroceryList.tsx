"use client";
import React, { useEffect, useMemo, useState } from "react";
import FloatingCalculator from "./FloatingCalculator";

export type MarketItem = {
  item: string;
  unidade: "g" | "ml" | "un";
  quantidade: number;      // do cardápio/semana
  comprado?: boolean;
};

/* ---------- categorias (sessões) ---------- */
type Categoria =
  | "Proteínas"
  | "Carboidratos"
  | "Leguminosas"
  | "Laticínios"
  | "Frutas"
  | "Legumes & Verduras"
  | "Bebidas"
  | "Grãos & Cereais"
  | "Temperos & Óleos"
  | "Outros";

const categoriaDe: Record<string, Categoria> = {
  // proteínas
  "Peito de frango": "Proteínas",
  "Carne moída bovina": "Proteínas",
  "Filé suíno": "Proteínas",
  "Atum (em água)": "Proteínas",
  Ovos: "Proteínas",

  // carboidratos / grãos
  "Arroz branco": "Carboidratos",
  "Pão integral": "Carboidratos",
  "Goma de tapioca": "Carboidratos",
  "Cuscuz (flocão cozido)": "Carboidratos",
  "Purê de batata-doce (cozida)": "Carboidratos",
  "Massa para pizza": "Carboidratos",
  Aveia: "Grãos & Cereais",
  Granola: "Grãos & Cereais",

  // leguminosas
  "Feijão carioca (cozido)": "Leguminosas",
  "Feijão preto (cozido)": "Leguminosas",
  "Lentilha (cozida)": "Leguminosas",
  "Grão-de-bico (cozido)": "Leguminosas",

  // laticínios/bebidas
  "Iogurte natural": "Laticínios",
  "Queijo minas": "Laticínios",
  "Queijo muçarela (pizza)": "Laticínios",
  Leite: "Bebidas",
  "Suco de laranja (in natura)": "Bebidas",
  "Suco de acerola (in natura)": "Bebidas",

  // frutas
  Mamão: "Frutas",
  Banana: "Frutas",
  Maçã: "Frutas",
  Morangos: "Frutas",
  "Frutas variadas (mix)": "Frutas",

  // legumes & verduras
  Brócolis: "Legumes & Verduras",
  Abobrinha: "Legumes & Verduras",
  Couve: "Legumes & Verduras",
  Cenoura: "Legumes & Verduras",
  Abóbora: "Legumes & Verduras",
  Beterraba: "Legumes & Verduras",
  Espinafre: "Legumes & Verduras",
  Vagem: "Legumes & Verduras",
};

const CATEGORIAS_ORDER: Categoria[] = [
  "Proteínas",
  "Carboidratos",
  "Leguminosas",
  "Grãos & Cereais",
  "Laticínios",
  "Frutas",
  "Legumes & Verduras",
  "Bebidas",
  "Temperos & Óleos",
  "Outros",
];

const catFor = (nome: string): Categoria => categoriaDe[nome] ?? "Outros";

/* ---------- preços com vírgula + modo unitário ---------- */
type MedidaCompra = "un" | "kg" | "g" | "l" | "ml";
type PriceEntry = {
  mode: "total" | "unit";  // total do pacote OU preço por unidade/medida
  price: number;           // em BRL
  qty?: number;            // quantidade da compra (se unit)
  measure?: MedidaCompra;  // un/kg/g/l/ml (se unit)
};

// storage
const STORAGE_PRICE = "mercado:precos:v2";
type PriceMap = Record<string, PriceEntry>;
const itemKey = (r: Pick<MarketItem, "item" | "unidade">) => `${r.item}|${r.unidade}`;

// parse "12,34" → 12.34
const parsePt = (s: string): number => {
  const clean = s.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number(clean);
  return Number.isFinite(n) ? n : 0;
};
const fmtPt = (n?: number) =>
  n && n > 0 ? n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "";

// normaliza quantidade para unidade base (un, kg, L)
const qtyNormalized = (qty = 0, m: MedidaCompra = "un") => {
  if (!qty || qty <= 0) return 0;
  if (m === "un") return qty;
  if (m === "kg") return qty;
  if (m === "g") return qty / 1000;
  if (m === "l") return qty;
  if (m === "ml") return qty / 1000;
  return qty;
};
const lineTotal = (e?: PriceEntry) => {
  if (!e || !e.price) return 0;
  return e.mode === "unit" ? e.price * qtyNormalized(e.qty, e.measure) : e.price;
};

/* ---------- componente ---------- */
export default function GroceryList() {
  const [list, setList] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [prices, setPrices] = useState<PriceMap>({});
  const [openCalc, setOpenCalc] = useState(true);
  const [catFilter, setCatFilter] = useState<Categoria | "Todas">("Todas");

  // carrega lista + preços salvos
  async function load() {
    setLoading(true);
    const res = await fetch("/api/mercado", { cache: "no-store" });
    const json = await res.json();
    setList(json.lista || []);
    try {
      const s = localStorage.getItem(STORAGE_PRICE);
      setPrices(s ? (JSON.parse(s) as PriceMap) : {});
    } catch { setPrices({}); }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const persist = (next: PriceMap) => {
    setPrices(next);
    try { localStorage.setItem(STORAGE_PRICE, JSON.stringify(next)); } catch {}
  };

  async function toggleComprado(it: MarketItem) {
    const body = { item: it.item, unidade: it.unidade, comprado: !it.comprado };
    // otimista
    setList(prev => prev.map(p => p.item === it.item && p.unidade === it.unidade ? { ...p, comprado: !p.comprado } : p));
    // best-effort na API
    try {
      await fetch("/api/mercado", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } catch {}
  }

  /* ----- filtros e agrupamento ----- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list
      .slice()
      .filter(r => (catFilter === "Todas" || catFor(r.item) === catFilter))
      .filter(r => !q || r.item.toLowerCase().includes(q))
      .sort((a, b) => a.item.localeCompare(b.item));
  }, [list, query, catFilter]);

  const grouped = useMemo(() => {
    const map = new Map<Categoria, MarketItem[]>();
    for (const r of filtered) {
      const c = catFor(r.item);
      if (!map.has(c)) map.set(c, []);
      map.get(c)!.push(r);
    }
    // ordena itens dentro de cada categoria
    for (const [c, arr] of map) arr.sort((a, b) => a.item.localeCompare(b.item));
    // retorna na ordem de CATEGORIAS_ORDER
    return CATEGORIAS_ORDER
      .map(c => ({ cat: c, itens: map.get(c) || [] }))
      .filter(sec => sec.itens.length > 0);
  }, [filtered]);

  // totais de peso/volume restantes (igual antes)
  const totalsRestantes = useMemo(() => {
    const totals = new Map<string, number>();
    for (const r of filtered.filter(x => !x.comprado)) {
      totals.set(r.unidade, (totals.get(r.unidade) || 0) + r.quantidade);
    }
    return Array.from(totals.entries()).map(([unidade, quantidade]) => ({ unidade, quantidade }));
  }, [filtered]);

  // somas da calculadora
  const sumAll = useMemo(() => filtered.reduce((acc, r) => acc + lineTotal(prices[itemKey(r)]), 0), [filtered, prices]);
  const sumChecked = useMemo(
    () => filtered.filter(r => r.comprado).reduce((acc, r) => acc + lineTotal(prices[itemKey(r)]), 0),
    [filtered, prices]
  );

  // handlers de edição
  function setMode(r: MarketItem, mode: PriceEntry["mode"]) {
    const k = itemKey(r);
    const curr = prices[k] || { mode: "total", price: 0 } as PriceEntry;
    const next = { ...curr, mode } as PriceEntry;
    persist({ ...prices, [k]: next });
  }
  function setPrice(r: MarketItem, raw: string) {
    const k = itemKey(r);
    const curr = prices[k] || { mode: "total", price: 0 } as PriceEntry;
    const next = { ...curr, price: parsePt(raw) };
    persist({ ...prices, [k]: next });
  }
  function setQty(r: MarketItem, raw: string) {
    const k = itemKey(r);
    const curr = prices[k] || { mode: "unit", price: 0 } as PriceEntry;
    const next = { ...curr, qty: parsePt(raw) };
    persist({ ...prices, [k]: next });
  }
  function setMeasure(r: MarketItem, m: MedidaCompra) {
    const k = itemKey(r);
    const curr = prices[k] || { mode: "unit", price: 0 } as PriceEntry;
    const next = { ...curr, measure: m };
    persist({ ...prices, [k]: next });
  }

  function exportCSV() {
    const header = "item;categoria;unidade_cardapio;quantidade_cardapio;comprado;modo;preco;qtde_compra;medida;total_linha\n";
    const rows = filtered.map(r => {
      const k = itemKey(r);
      const e = prices[k];
      const total = lineTotal(e);
      const cat = catFor(r.item);
      return [
        r.item,
        cat,
        r.unidade,
        r.quantidade,
        r.comprado ? "sim" : "nao",
        e?.mode ?? "",
        e?.price ?? 0,
        e?.qty ?? "",
        e?.measure ?? "",
        total.toFixed(2).replace(".", ","),
      ].join(";");
    });
    const blob = new Blob([header + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "lista_mercado_semanal.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-6 relative">
      {/* Header & filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Lista de Mercado (Semana)</h2>
          <p className="text-xs text-slate-400">
            Preço com vírgula. Se escolher <strong>Unitário</strong>, informe quantidade e medida (un/kg/g/L/ml).
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <select
            className="rounded-lg border border-slate-600 bg-slate-800/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value as Categoria | "Todas")}
          >
            <option value="Todas">Todas as categorias</option>
            {CATEGORIAS_ORDER.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64"
            placeholder="Buscar item..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={exportCSV}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {loading && <p className="mt-3 text-sm text-slate-400" aria-busy="true">Carregando...</p>}

      {/* SESSÕES por categoria */}
      <div className="mt-4 space-y-6">
        {grouped.map(section => (
          <section key={section.cat}>
            <h3 className="mb-2 text-sm font-semibold text-slate-300">{section.cat}</h3>
            <ul className="divide-y divide-slate-700">
              {section.itens.map((r) => {
                const k = itemKey(r);
                const checked = !!r.comprado;
                const e = prices[k];
                const mode = e?.mode ?? "total";
                const priceStr = fmtPt(e?.price);
                const qtyStr = e?.qty ? String(e.qty).replace(".", ",") : "";

                return (
                  <li key={k} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* checkbox + nome */}
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleComprado(r)}
                        className="h-5 w-5 accent-blue-600"
                      />
                      <span className={["text-sm", checked ? "line-through text-slate-500" : "text-slate-200"].join(" ")}>
                        {r.item}
                      </span>
                      <span className="ml-2 inline-flex items-center rounded-md border border-slate-600 bg-slate-800/60 px-2 py-0.5 text-[10px]">
                        {r.quantidade} {r.unidade}
                      </span>
                    </span>

                    {/* editor de preço */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex rounded-lg border border-slate-600 bg-slate-800/60 p-0.5">
                        <button
                          className={`rounded-md px-2 py-1 text-xs ${mode === "total" ? "bg-blue-600 text-white" : "text-slate-200"}`}
                          onClick={() => setMode(r, "total")}
                          type="button"
                        >
                          Total
                        </button>
                        <button
                          className={`rounded-md px-2 py-1 text-xs ${mode === "unit" ? "bg-blue-600 text-white" : "text-slate-200"}`}
                          onClick={() => setMode(r, "unit")}
                          type="button"
                        >
                          Unitário
                        </button>
                      </div>

                      {/* preço (aceita vírgula) */}
                      <div className="relative">
                        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 select-none text-xs text-slate-400">R$</span>
                        <input
                          inputMode="decimal"
                          type="text"
                          className="w-28 rounded-lg border border-slate-600 bg-slate-800/60 pl-6 pr-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0,00"
                          value={priceStr}
                          onChange={(e) => setPrice(r, e.target.value)}
                          aria-label={`Preço de ${r.item}`}
                        />
                      </div>

                      {/* se unitário: quantidade + medida */}
                      {mode === "unit" && (
                        <>
                          <input
                            inputMode="decimal"
                            type="text"
                            className="w-20 rounded-lg border border-slate-600 bg-slate-800/60 px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Qtde"
                            value={qtyStr}
                            onChange={(e) => setQty(r, e.target.value)}
                            aria-label={`Quantidade de compra de ${r.item}`}
                          />
                          <select
                            className="rounded-lg border border-slate-600 bg-slate-800/60 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={e?.measure ?? "un"}
                            onChange={(ev) => setMeasure(r, ev.target.value as any)}
                            aria-label={`Medida da compra de ${r.item}`}
                          >
                            <option value="un">un</option>
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                            <option value="l">L</option>
                            <option value="ml">ml</option>
                          </select>

                          {/* total da linha */}
                          <span className="ml-1 inline-flex items-center rounded-md border border-slate-600 bg-slate-800/60 px-2 py-0.5 text-xs text-slate-200">
                            Total: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(lineTotal(e))}
                          </span>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {/* Totais por unidade (restante não comprado) */}
      <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
        {totalsRestantes.map(t => (
          <span key={t.unidade} className="inline-flex items-center rounded-full border border-slate-600 bg-slate-800/60 px-2 py-0.5 text-xs text-slate-200">
            Restante: {t.quantidade} {t.unidade}
          </span>
        ))}
      </div>

      {/* Calculadora fixa */}
      <FloatingCalculator
        totalAll={sumAll}
        totalChecked={sumChecked}
        onClear={() => persist({})}
        open={openCalc}
        setOpen={setOpenCalc}
      />
    </div>
  );
}
