import type { BlocoB94, ValorCelula } from "./types";

export const ANOS_POR_BLOCO = 5;

export function montarBlocos(
  anos: number[],
  meses: readonly string[],
  obterValor: (mes: string, ano: number) => ValorCelula,
  separadorPeriodo = "-",
): BlocoB94[] {
  const blocos: BlocoB94[] = [];

  for (let i = 0; i < anos.length; i += ANOS_POR_BLOCO) {
    const colunas = anos.slice(i, i + ANOS_POR_BLOCO);
    blocos.push({
      periodo: `${colunas[0]}${separadorPeriodo}${colunas.at(-1)}`,
      colunas,
      linhas: Object.fromEntries(
        meses.map((mes) => [mes, colunas.map((ano) => obterValor(mes, ano))]),
      ),
    });
  }

  return blocos;
}
