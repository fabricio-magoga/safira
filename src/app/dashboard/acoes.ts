"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  NOME_COOKIE_SESSAO,
  acessoBloqueado,
  criarSessao,
  opcoesCookieSessao,
  registrarTentativaInvalida,
  tokenConfigurado,
  tokenCorreto,
} from "@/lib/dashboard/sessao";

export type EstadoAcesso = {
  erro?: string;
  tentativas: number;
};

export async function autenticarDashboard(
  estadoAnterior: EstadoAcesso,
  formData: FormData,
): Promise<EstadoAcesso> {
  const tentativas = (estadoAnterior?.tentativas ?? 0) + 1;
  const token = String(formData.get("token") ?? "").trim();

  if (!tokenConfigurado()) {
    return {
      erro: "Acesso indisponível: a variável de ambiente DASHBOARD_TOKEN não está definida neste servidor.",
      tentativas,
    };
  }

  if (acessoBloqueado()) {
    return {
      erro: "Muitas tentativas inválidas. Aguarde alguns minutos antes de tentar novamente.",
      tentativas,
    };
  }

  if (!token) {
    return { erro: "Informe o token de validação para acessar o painel.", tentativas };
  }

  if (!tokenCorreto(token)) {
    registrarTentativaInvalida();
    return { erro: "Token inválido. Confira o código recebido e tente novamente.", tentativas };
  }

  const { valor } = criarSessao();
  const armazemDeCookies = await cookies();
  armazemDeCookies.set(NOME_COOKIE_SESSAO, valor, opcoesCookieSessao());

  redirect("/dashboard");
}

export async function encerrarSessao() {
  const armazemDeCookies = await cookies();
  armazemDeCookies.delete(NOME_COOKIE_SESSAO);

  redirect("/dashboard/acesso");
}
