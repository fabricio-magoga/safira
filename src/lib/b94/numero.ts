export const PADRAO_VALOR_BR = /^[\d.]+(?:,\d{1,2})?$/;

export function converterValorBr(texto: string): number {
  return Number(texto.replace(/\./g, "").replace(",", "."));
}
