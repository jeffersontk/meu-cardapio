export const runtime = "nodejs";

import type { NextRequest } from "next/server";
import { readJSON, writeJSON } from "@/lib/server/fsdb";
import { listaMercadoConsolidada } from "@/lib/data";

/** Tipos */
type Unidade = "g" | "ml" | "un";
export interface MarketItem {
  item: string;
  unidade: Unidade;
  quantidade: number;
  comprado?: boolean;
}
interface MercadoData {
  lista: MarketItem[];
}

/** Helpers de validação */
function isUnidade(x: unknown): x is Unidade {
  return x === "g" || x === "ml" || x === "un";
}
function isMarketItem(x: unknown): x is MarketItem {
  const o = x as Partial<MarketItem>;
  return (
    !!o &&
    typeof o.item === "string" &&
    isUnidade(o.unidade) &&
    typeof o.quantidade === "number"
  );
}

const FILE = "mercado.json";

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
  let data = await readJSON<MercadoData>(FILE, seed());
  // Se o arquivo existir mas estiver vazio, re-seed
  if (!Array.isArray(data.lista) || data.lista.length === 0) {
    data = seed();
    await writeJSON(FILE, data);
  }
  return Response.json(data, { status: 200 });
}

type PatchBody = {
  item: string;
  unidade: Unidade;
  comprado?: boolean;
  quantidade?: number;
};
function isPatchBody(x: unknown): x is PatchBody {
  const o = x as PatchBody;
  return !!o && typeof o.item === "string" && isUnidade(o.unidade);
}

export async function PATCH(req: NextRequest) {
  const bodyUnknown: unknown = await req.json();
  if (!isPatchBody(bodyUnknown)) {
    return new Response("payload inválido", { status: 400 });
  }
  const body = bodyUnknown;

  const data = await readJSON<MercadoData>(FILE, seed());
  const idx = data.lista.findIndex(
    (x) => x.item === body.item && x.unidade === body.unidade
  );

  if (idx === -1) {
    data.lista.push({
      item: body.item,
      unidade: body.unidade,
      quantidade: typeof body.quantidade === "number" ? body.quantidade : 0,
      comprado: !!body.comprado,
    });
  } else {
    if (typeof body.comprado === "boolean") {
      data.lista[idx].comprado = body.comprado;
    }
    if (typeof body.quantidade === "number") {
      data.lista[idx].quantidade = body.quantidade;
    }
  }

  await writeJSON(FILE, data);
  return Response.json({ ok: true });
}

/** Opcional: re-seed manual via POST */
export async function POST() {
  const data = seed();
  await writeJSON(FILE, data);
  return Response.json({ ok: true, seeded: data.lista.length });
}
