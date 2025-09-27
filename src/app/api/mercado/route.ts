export const runtime = "nodejs";

import type { NextRequest } from "next/server";
import { rgetJSON, rsetJSON } from "@/lib/server/redis";
import { listaMercadoConsolidada } from "@/lib/data";
import { Unidade } from "@/components/StockManager";

export interface MarketItem {
  item: string;
  unidade: Unidade; // 'g' | 'ml' | 'un'
  quantidade: number;
  comprado?: boolean;
}
interface MercadoData {
  lista: MarketItem[];
}

const KEY = "mercado:list:v1";

function seed(): MercadoData {
  const lista: MarketItem[] = listaMercadoConsolidada.map((i) => ({
    item: i.item,
    unidade: i.unidade as Unidade, // garante o literal type
    quantidade: i.quantidade,
    comprado: false,
  }));
  return { lista };
}

export async function GET() {
  const data = await rgetJSON<MercadoData>(KEY, seed());
  // se estiver vazio, grava o seed
  if (!Array.isArray(data.lista) || data.lista.length === 0) {
    const s = seed();
    await rsetJSON(KEY, s);
    return Response.json(s);
  }
  return Response.json(data, { status: 200 });
}

type PatchBody = {
  item: string;
  unidade: Unidade;
  comprado?: boolean;
  quantidade?: number;
};

export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as PatchBody;
  if (!body?.item || !body?.unidade)
    return new Response("item/unidade obrigatórios", { status: 400 });

  const data = await rgetJSON<MercadoData>(KEY, seed());
  const idx = data.lista.findIndex(
    (x) => x.item === body.item && x.unidade === body.unidade
  );

  if (idx === -1) {
    data.lista.push({
      item: body.item,
      unidade: body.unidade,
      quantidade: body.quantidade ?? 0,
      comprado: !!body.comprado,
    });
  } else {
    if (typeof body.comprado === "boolean")
      data.lista[idx].comprado = body.comprado;
    if (typeof body.quantidade === "number")
      data.lista[idx].quantidade = body.quantidade;
  }
  await rsetJSON(KEY, data);
  return Response.json({ ok: true });
}

export async function POST() {
  // reseed opcional
  const s = seed();
  await rsetJSON(KEY, s);
  return Response.json({ ok: true, seeded: s.lista.length });
}
