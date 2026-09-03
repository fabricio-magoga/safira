import type { IndiceConreaj } from "./types";
import { PADRAO_VALOR_BR, converterValorBr } from "./numero";

const PADRAO_DATA = /^\s*\d{2}\/((?:19|20)\d{2})\b/;
const PADRAO_VALOR = /[\d.]+(?:,\d{1,2})?/g;

export function analisarConreaj(textoOriginal: string): IndiceConreaj {
  const dados: IndiceConreaj = new Map();

  for (const linha of textoOriginal.split(/\r?\n/)) {
    const matchData = linha.match(PADRAO_DATA);
    if (!matchData) continue;

    const celulas = linha.split("\t").map((cel) => cel.trim());
    const ano = Number(matchData[1]);
    const resto = linha.slice(matchData[0].length);
    const valores = [...resto.matchAll(PADRAO_VALOR)].map((m) => m[0]);
    let valorCorrigido: string;
    let valorAnterior: string;

    if (celulas.length >= 5) {
      valorAnterior = celulas[1] ?? "";
      valorCorrigido = celulas[4] ?? "";
    } else {
      valorAnterior = valores[0] ?? "";
      valorCorrigido = valores.at(-1) ?? "";
    }

    if (PADRAO_VALOR_BR.test(valorAnterior)) {
      dados.set(ano - 1, converterValorBr(valorAnterior));
    }

    if (!PADRAO_VALOR_BR.test(valorCorrigido)) continue;

    dados.set(ano, converterValorBr(valorCorrigido));
  }

  return dados;
}

export function obterPrimeiroAnoConreaj(texto: string): number | null {
  const match = texto.match(new RegExp(PADRAO_DATA.source, "m"));
  return match ? Number(match[1]) - 1 : null;
}
