export const runtime = "nodejs";

import type { NextRequest } from "next/server";
import { readJSON, writeJSON } from "@/lib/server/fsdb";

/** Tipos */
type Unidade = "g" | "ml" | "un";
export interface StockItem {
  item: string;
  unidade: Unidade;
  quantidade: number;
}
interface EstoqueData {
  itens: StockItem[];
}

/** Helpers de validação */
function isUnidade(x: unknown): x is Unidade {
  return x === "g" || x === "ml" || x === "un";
}
function isStockItem(x: unknown): x is StockItem {
  const o = x as Partial<StockItem>;
  return (
    !!o &&
    typeof o.item === "string" &&
    isUnidade(o.unidade) &&
    typeof o.quantidade === "number"
  );
}

const FILE = "estoque.json";

export async function GET() {
  const data = await readJSON<EstoqueData>(FILE, { itens: [] });
  return Response.json(data, { status: 200 });
}

type PostBody = StockItem;
function isPostBody(x: unknown): x is PostBody {
  return isStockItem(x);
}

export async function POST(req: NextRequest) {
  const bodyUnknown: unknown = await req.json();
  if (!isPostBody(bodyUnknown)) {
    return new Response("payload inválido", { status: 400 });
  }
  const body = bodyUnknown;

  const data = await readJSON<EstoqueData>(FILE, { itens: [] });
  const found = data.itens.find(
    (x) => x.item === body.item && x.unidade === body.unidade
  );
  if (found) {
    found.quantidade += Number(body.quantidade) || 0;
  } else {
    data.itens.push({
      item: body.item,
      unidade: body.unidade,
      quantidade: Number(body.quantidade) || 0,
    });
  }
  await writeJSON(FILE, data);
  return Response.json({ ok: true });
}

type PatchBody = {
  item: string;
  unidade: Unidade;
  quantidade?: number;
  delta?: number;
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

  const data = await readJSON<EstoqueData>(FILE, { itens: [] });
  const idx = data.itens.findIndex(
    (x) => x.item === body.item && x.unidade === body.unidade
  );

  if (idx === -1) {
    data.itens.push({
      item: body.item,
      unidade: body.unidade,
      quantidade: Number(body.quantidade) || 0,
    });
  } else {
    if (typeof body.quantidade === "number") {
      data.itens[idx].quantidade = Number(body.quantidade);
    }
    if (typeof body.delta === "number") {
      data.itens[idx].quantidade = Math.max(
        0,
        Number(data.itens[idx].quantidade || 0) + body.delta
      );
    }
  }
  await writeJSON(FILE, data);
  return Response.json({ ok: true });
}

type DeleteBody = { item: string; unidade: Unidade };
function isDeleteBody(x: unknown): x is DeleteBody {
  const o = x as DeleteBody;
  return !!o && typeof o.item === "string" && isUnidade(o.unidade);
}

export async function DELETE(req: NextRequest) {
  const bodyUnknown: unknown = await req.json();
  if (!isDeleteBody(bodyUnknown)) {
    return new Response("payload inválido", { status: 400 });
  }
  const body = bodyUnknown;

  const data = await readJSON<EstoqueData>(FILE, { itens: [] });
  data.itens = data.itens.filter(
    (x) => !(x.item === body.item && x.unidade === body.unidade)
  );
  await writeJSON(FILE, data);
  return Response.json({ ok: true });
}
