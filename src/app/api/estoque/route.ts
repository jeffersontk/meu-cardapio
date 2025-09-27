export const runtime = "nodejs";

import type { NextRequest } from "next/server";
import { rgetJSON, rsetJSON } from "@/lib/server/redis";
import { Unidade } from "@/components/StockManager";

export interface StockItem {
  item: string;
  unidade: Unidade;
  quantidade: number;
}
interface EstoqueData {
  itens: StockItem[];
}

const KEY = "estoque:list:v1";

async function getState() {
  return rgetJSON<EstoqueData>(KEY, { itens: [] });
}
async function setState(d: EstoqueData) {
  await rsetJSON(KEY, d);
}

export async function GET() {
  const data = await getState();
  return Response.json(data, { status: 200 });
}

type PostBody = StockItem;
export async function POST(req: NextRequest) {
  const b = (await req.json()) as PostBody;
  if (!b?.item || !b?.unidade)
    return new Response("item/unidade obrigatórios", { status: 400 });

  const data = await getState();
  const found = data.itens.find(
    (x) => x.item === b.item && x.unidade === b.unidade
  );
  if (found) found.quantidade += Number(b.quantidade) || 0;
  else
    data.itens.push({
      item: b.item,
      unidade: b.unidade,
      quantidade: Number(b.quantidade) || 0,
    });

  await setState(data);
  return Response.json({ ok: true });
}

type PatchBody = {
  item: string;
  unidade: Unidade;
  quantidade?: number;
  delta?: number;
};
export async function PATCH(req: NextRequest) {
  const b = (await req.json()) as PatchBody;
  if (!b?.item || !b?.unidade)
    return new Response("item/unidade obrigatórios", { status: 400 });

  const data = await getState();
  const idx = data.itens.findIndex(
    (x) => x.item === b.item && x.unidade === b.unidade
  );
  if (idx === -1) {
    data.itens.push({
      item: b.item,
      unidade: b.unidade,
      quantidade: Number(b.quantidade) || 0,
    });
  } else {
    if (typeof b.quantidade === "number")
      data.itens[idx].quantidade = Number(b.quantidade);
    if (typeof b.delta === "number")
      data.itens[idx].quantidade = Math.max(
        0,
        Number(data.itens[idx].quantidade || 0) + b.delta
      );
  }
  await setState(data);
  return Response.json({ ok: true });
}

type DeleteBody = { item: string; unidade: Unidade };
export async function DELETE(req: NextRequest) {
  const b = (await req.json()) as DeleteBody;
  if (!b?.item || !b?.unidade)
    return new Response("item/unidade obrigatórios", { status: 400 });

  const data = await getState();
  data.itens = data.itens.filter(
    (x) => !(x.item === b.item && x.unidade === b.unidade)
  );
  await setState(data);
  return Response.json({ ok: true });
}
