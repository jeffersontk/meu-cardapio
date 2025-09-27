import { readJSON, writeJSON } from "@/lib/server/fsdb";
import { NextRequest } from "next/server";

const FILE = "estoque.json";

export async function GET() {
  const data = await readJSON<{ itens: any[] }>(FILE, { itens: [] });
  return Response.json(data, { status: 200 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { item, unidade, quantidade } = body || {};
  if (!item || !unidade)
    return new Response("item/unidade obrigatórios", { status: 400 });

  const data = await readJSON<{ itens: any[] }>(FILE, { itens: [] });
  const found = data.itens.find(
    (x: any) => x.item === item && x.unidade === unidade
  );
  if (found) {
    found.quantidade += Number(quantidade) || 0;
  } else {
    data.itens.push({ item, unidade, quantidade: Number(quantidade) || 0 });
  }

  await writeJSON(FILE, data);
  return Response.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { item, unidade, quantidade, delta } = body || {};
  if (!item || !unidade)
    return new Response("item/unidade obrigatórios", { status: 400 });

  const data = await readJSON<{ itens: any[] }>(FILE, { itens: [] });
  const idx = data.itens.findIndex(
    (x: any) => x.item === item && x.unidade === unidade
  );
  if (idx === -1) {
    data.itens.push({ item, unidade, quantidade: Number(quantidade) || 0 });
  } else {
    if (typeof quantidade === "number")
      data.itens[idx].quantidade = Number(quantidade);
    if (typeof delta === "number")
      data.itens[idx].quantidade = Math.max(
        0,
        Number(data.itens[idx].quantidade || 0) + delta
      );
  }
  await writeJSON(FILE, data);
  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { item, unidade } = body || {};
  if (!item || !unidade)
    return new Response("item/unidade obrigatórios", { status: 400 });

  const data = await readJSON<{ itens: any[] }>(FILE, { itens: [] });
  data.itens = data.itens.filter(
    (x: any) => !(x.item === item && x.unidade === unidade)
  );

  await writeJSON(FILE, data);
  return Response.json({ ok: true });
}
