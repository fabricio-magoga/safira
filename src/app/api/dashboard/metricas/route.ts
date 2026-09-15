import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { obterResumo } from "@/lib/dashboard/estatisticas";
import { NOME_COOKIE_SESSAO, extrairSessao } from "@/lib/dashboard/sessao";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const armazemDeCookies = await cookies();
  const sessao = extrairSessao(armazemDeCookies.get(NOME_COOKIE_SESSAO)?.value);

  if (!sessao) {
    return NextResponse.json(
      { error: "Sessão inválida ou expirada." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(obterResumo(), {
    headers: { "Cache-Control": "no-store" },
  });
}
