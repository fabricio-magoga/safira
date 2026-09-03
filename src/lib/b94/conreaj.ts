import type { IndiceConreaj } from "./types";
import { PADRAO_VALOR_BR, converterValorBr } from "./numero";

const PADRAO_DATA = /^\s*\d{2}\/((?:19|20)\d{2})\b/;
const PADRAO_VALOR = /[\d.]+(?:,\d{1,2})?/g;
const PADRAO_DATA_INICIO = /Data\s*:\s*(\d{2})\/(\d{2})\/(\d{4})/;

export type DataInicioConreaj = { dia: number; mes: number; ano: number };

export const NUMERO_MES: Record<string, number> = {
  JAN: 1,
  FEV: 2,
  MAR: 3,
  ABR: 4,
  MAI: 5,
  JUN: 6,
  JUL: 7,
  AGO: 8,
  SET: 9,
  OUT: 10,
  NOV: 11,
  DEZ: 12,
};

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

export function obterDataInicioConreaj(texto: string): DataInicioConreaj | null {
  const match = texto.match(PADRAO_DATA_INICIO);
  if (!match) return null;
  return { dia: Number(match[1]), mes: Number(match[2]), ano: Number(match[3]) };
}

function obterValorAposRotulo(texto: string, rotulo: string): string | null {
  const linhas = texto.split(/\r?\n/);
  const indice = linhas.findIndex((linha) =>
    linha.trim().toLowerCase().startsWith(rotulo.toLowerCase()),
  );
  if (indice === -1) return null;

  for (let i = indice + 1; i < linhas.length; i += 1) {
    const valor = linhas[i].trim();
    if (valor) return valor;
  }
  return null;
}

export function obterNomeConreaj(texto: string): string | null {
  return obterValorAposRotulo(texto, "Nome:");
}

export function obterEspecieConreaj(texto: string): string | null {
  return obterValorAposRotulo(texto, "Especie:");
}

export function obterPrimeiroAnoConreaj(texto: string): number | null {
  const dataInicio = obterDataInicioConreaj(texto);
  if (dataInicio) return dataInicio.ano;
  const match = texto.match(new RegExp(PADRAO_DATA.source, "m"));
  return match ? Number(match[1]) - 1 : null;
}
