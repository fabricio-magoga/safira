import { randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers"; // Adicionado "headers"
import { NextResponse } from "next/server";
import { marcarAtividade } from "@/lib/dashboard/estatisticas";
import {
  NOME_COOKIE_VISITANTE,
  opcoesCookieVisitante,
} from "@/lib/dashboard/sessao";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lista de palavras-chave comuns de ferramentas de monitoramento/scanners de rede
const BOTS_DA_REDE = [
  "zabbix",
  "prtg",
  "nagios",
  "uptime",
  "curl",
  "wget",
  "go-http-client",
  "python-requests",
  "axios",
  "postman",
];

export async function POST() {
  const listaDeHeaders = await headers();
  const userAgent = (listaDeHeaders.get("user-agent") || "").toLowerCase();

  // 1. Bloqueia bots conhecidos da rede interna para não inflar as métricas
  const ehBot =
    BOTS_DA_REDE.some((bot) => userAgent.includes(bot)) || !userAgent;
  if (ehBot) {
    return NextResponse.json(
      { ok: false, motivo: "ignorado" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const armazemDeCookies = await cookies();
  let idVisitante = armazemDeCookies.get(NOME_COOKIE_VISITANTE)?.value;
  let primeiraVisita = false;

  if (!idVisitante) {
    idVisitante = randomUUID();
    armazemDeCookies.set(
      NOME_COOKIE_VISITANTE,
      idVisitante,
      opcoesCookieVisitante(),
    );
    primeiraVisita = true;
  }

  // 2. FILTRO ESSENCIAL: Se o visitante não tem cookie E a requisição veio sem cabeçalhos comuns
  // de navegadores (como sec-ch-ua), há uma grande chance de ser um script/robô de TI oculto.
  const possuiAparenciaDeNavegador =
    listaDeHeaders.has("sec-ch-ua") || userAgent.includes("mozilla");

  if (primeiraVisita && !possuiAparenciaDeNavegador) {
    return NextResponse.json(
      { ok: false, motivo: "suspeito" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  // Registra a atividade apenas se passou nos filtros
  marcarAtividade(idVisitante);

  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
