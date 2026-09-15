import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { marcarAtividade } from "@/lib/dashboard/estatisticas";
import { NOME_COOKIE_VISITANTE, opcoesCookieVisitante } from "@/lib/dashboard/sessao";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const armazemDeCookies = await cookies();
  let idVisitante = armazemDeCookies.get(NOME_COOKIE_VISITANTE)?.value;

  if (!idVisitante) {
    idVisitante = randomUUID();
    armazemDeCookies.set(NOME_COOKIE_VISITANTE, idVisitante, opcoesCookieVisitante());
  }

  marcarAtividade(idVisitante);

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
