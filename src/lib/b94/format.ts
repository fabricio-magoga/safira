import type { ValorCelula } from "./types";

export function formatarCopia(valor: ValorCelula): string | null {
  if (typeof valor === "number") {
    return valor === 0 ? "0" : valor.toFixed(2);
  }

  const normalizado = valor.trim();
  if (!normalizado) return null;

  return normalizado;
}

export function formatarExibicao(valor: ValorCelula): string {
  if (typeof valor === "number") {
    return valor === 0 ? "0" : valor.toFixed(2);
  }

  return valor.trim() || "0";
}
