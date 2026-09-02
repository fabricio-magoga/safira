const PADRAO_DATA = /^\s*\d{2}\/((?:19|20)\d{2})\b/;
const PADRAO_VALOR = /[\d.]+(?:,\d{1,2})?/g;
const VALOR_COMPLETO = /^[\d.]+(?:,\d{1,2})?$/;

export function analisarConreaj(textoOriginal: string): Map<number, number> {
  const dados = new Map<number, number>();

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

    if (VALOR_COMPLETO.test(valorAnterior)) {
      const anteriorLimpo = valorAnterior
        .replace(/\./g, "")
        .replace(",", ".");
      dados.set(ano - 1, Number(anteriorLimpo));
    }

    if (!VALOR_COMPLETO.test(valorCorrigido)) continue;

    const valorLimpo = valorCorrigido.replace(/\./g, "").replace(",", ".");
    dados.set(ano, Number(valorLimpo));
  }

  return dados;
}

export function obterPrimeiroAnoConreaj(texto: string): number | null {
  const match = texto.match(/^\s*\d{2}\/((?:19|20)\d{2})\b/m);
  return match ? Number(match[1]) - 1 : null;
}
