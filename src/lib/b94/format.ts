// Camada de formatação para a área de transferência do navegador com fallback (execCommand).

import type { ValorCelula } from "./types";

export function formatarCopia(
  valor: ValorCelula,
  sufixo: string = "",
): string | null {
  if (typeof valor === "number") {
    const textoBase = valor === 0 ? "0" : valor.toFixed(2);
    return `${textoBase}${sufixo}`;
  }

  const normalizado = valor.trim();
  if (!normalizado) return null;

  return `${normalizado}${sufixo}`;
}

export function formatarExibicao(valor: ValorCelula): string {
  if (typeof valor === "number") {
    return valor === 0 ? "0" : valor.toFixed(2);
  }

  return valor.trim() || "0";
}
