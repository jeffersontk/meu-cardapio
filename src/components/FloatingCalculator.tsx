"use client";
import React from "react";

function money(n: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n || 0);
}

export default function FloatingCalculator({
  totalAll,
  totalChecked,
  onClear,
  open,
  setOpen,
}: {
  totalAll: number;
  totalChecked: number;
  onClear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-[min(92vw,320px)] rounded-2xl border border-slate-700 bg-slate-900/80 p-3 backdrop-blur-md shadow-xl"
      role="complementary"
      aria-label="Calculadora de preços"
    >
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold">Calculadora</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg border border-slate-600 bg-slate-800/60 px-2 py-1 text-xs hover:bg-slate-800"
          >
            {open ? "Ocultar" : "Mostrar"}
          </button>
          <button
            onClick={onClear}
            className="rounded-lg bg-slate-700 px-2 py-1 text-xs text-white hover:bg-slate-600"
            title="Limpar todos os preços"
          >
            Limpar
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Marcados (✔)</span>
            <strong className="text-slate-100">{money(totalChecked)}</strong>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Total (todos)</span>
            <strong className="text-slate-100">{money(totalAll)}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
