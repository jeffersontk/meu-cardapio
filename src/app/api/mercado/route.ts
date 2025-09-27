// src/app/api/mercado/route.ts
export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { readJSON, writeJSON } from "@/lib/server/fsdb";
import { listaMercadoConsolidada } from "@/lib/data";

const FILE = "mercado.json";

function seed() {
  return {
    lista: listaMercadoConsolidada.map((i) => ({ ...i, comprado: false })),
  };
}

export async function GET() {
  let data = await readJSON<{ lista: any[] }>(FILE, seed());
  // Se existir mas estiver vazio, popular com o seed:
  if (!Array.isArray(data.lista) || data.lista.length === 0) {
    data = seed();
    await writeJSON(FILE, data);
  }
  return Response.json(data, { status: 200 });
}

// Reseed manual: sobrescreve com o seed
export async function POST() {
  const data = seed();
  await writeJSON(FILE, data);
  return Response.json({ ok: true, seeded: data.lista.length });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { item, unidade, comprado, quantidade } = body || {};
  if (!item || !unidade)
    return new Response("item/unidade obrigatórios", { status: 400 });

  const data = await readJSON<{ lista: any[] }>(FILE, seed());
  const idx = data.lista.findIndex(
    (x: any) => x.item === item && x.unidade === unidade
  );
  if (idx === -1) {
    data.lista.push({
      item,
      unidade,
      quantidade: quantidade ?? 0,
      comprado: !!comprado,
    });
  } else {
    if (typeof comprado === "boolean") data.lista[idx].comprado = comprado;
    if (typeof quantidade === "number") data.lista[idx].quantidade = quantidade;
  }
  await writeJSON(FILE, data);
  return Response.json({ ok: true });
}
