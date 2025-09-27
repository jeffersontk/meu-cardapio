"use client";
import React from "react";
import type { Meal } from "@/lib/data";

export default function MealCard({ title, meal }: { title: string; meal: Meal }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
        <h3 className="font-semibold">{title}</h3>
        <span className="flex justify-center items-center rounded-full border border-slate-600 bg-slate-800/60 px-2 py-0.5 text-xs text-slate-200">
          {meal.prato}
        </span>
      </div>

      <ul className="mt-2 divide-y divide-slate-700">
        {meal.itens.length === 0 && (
          <li className="py-2 text-sm text-slate-400">Sem itens definidos (refeição livre)</li>
        )}
        {meal.itens.map((i) => (
          <li key={i.nome} className="flex items-center justify-between py-2 text-sm">
            <span className="text-slate-200">{i.nome}</span>
            <span className="inline-flex items-center rounded-md border border-slate-600 bg-slate-800/60 px-2 py-0.5 text-xs">
              {i.quantidade} {i.unidade}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
