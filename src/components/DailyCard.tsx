"use client";
import React, { useMemo, useState } from "react";
import MealCard from "./MealCard";
import { dias, MealType, receitas, semana } from "@/lib/data";

function todayKey() {
  const d = new Date();
  const k = dias[d.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6];
  return k;
}

const labelMap: Record<MealType, string> = {
  cafe: "Café",
  almoco: "Almoço",
  lanche: "Lanche",
  jantar: "Jantar",
};

export default function DailyCard() {
  const [selectedMeal, setSelectedMeal] = useState<MealType>("almoco");
  const key = useMemo(() => todayKey(), []);
  const day = semana[key];

  const recipeId = day?.[selectedMeal]?.receitaId;
  const recipe = recipeId ? receitas[recipeId] : undefined;

  if (!day)
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-6">
        Sem plano para hoje.
      </div>
    );

  const meals: MealType[] = ["cafe", "almoco", "lanche", "jantar"];

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-6 flex flex-col gap-4">
      {/* Cabeçalho responsivo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">
            Cardápio do dia —{" "}
            <span className="ml-1 inline-flex items-center rounded-full border border-slate-600 bg-slate-800/60 px-2 py-0.5 text-xs text-slate-200">
              {key.toUpperCase()}
            </span>
          </h2>
          <p className="text-sm text-slate-400">
            Selecione a refeição para ver receita e modo de preparo.
          </p>
        </div>

    
      </div>

      {/* Cards das refeições */}
      <div className=" grid grid-cols-1 gap-4 md:grid-cols-2">
        <MealCard title="Café da manhã" meal={day.cafe} />
        <MealCard title="Almoço" meal={day.almoco} />
        <MealCard title="Lanche da tarde" meal={day.lanche} />
        <MealCard title="Jantar" meal={day.jantar} />
      </div>
      {/* Abas roláveis no mobile */}
          <div
          className="flex w-full sm:w-auto gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Selecionar refeição"
        >
          {meals.map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={selectedMeal === m}
              onClick={() => setSelectedMeal(m)}
              className={[
                "whitespace-nowrap rounded-lg border px-3 py-2 text-sm transition",
                selectedMeal === m
                  ? "bg-blue-600 border-blue-600 text-white shadow"
                  : "bg-transparent border-slate-600 text-slate-200 hover:bg-slate-800",
              ].join(" ")}
            >
              {labelMap[m]}
            </button>
          ))}
        </div>
      {/* Receita */}
      <div className=" rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Receita selecionada</h3>
          <span className="inline-flex items-center rounded-full border border-slate-600 bg-slate-800/60 px-2 py-0.5 text-xs text-slate-200">
            {labelMap[selectedMeal].toUpperCase()}
          </span>
        </div>

        {!recipe && (
          <p className="mt-2 text-slate-400">
            Esta refeição não possui receita (livre ou café/lanche).
          </p>
        )}
        
        {recipe && (
          <div className="mt-3">
            <h4 className="font-medium">{recipe.titulo}</h4>
            <p className="text-xs text-slate-400">Rendimento: {recipe.rendimento}</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              {recipe.modo.map((step, idx) => (
                <li key={idx} className="text-sm">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
