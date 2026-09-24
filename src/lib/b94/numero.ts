// Utilitários para parsing e conversão de strings numéricas no padrão monetário brasileiro (1.234,56 -> 1234.56)

export const PADRAO_VALOR_BR = /^[\d.]+(?:,\d{1,2})?$/;

export function converterValorBr(texto: string): number {
  return Number(texto.replace(/\./g, "").replace(",", "."));
}
