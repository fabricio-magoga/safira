import type { BlocoB94, ValorCelula, IndiceConreaj } from "./types";

export const MESES = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
] as const;

const PADRAO_ANO = /\b(?:19|20)\d{2}\b/g;
const LINHA_MES =
  /^\s*(JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\b(.*)$/i;
const DINHEIRO = /\d[\d.]*,\d{1,2}/g;

function celulasDaTabela(linha: string): string[] {
  const separador = linha.includes("!") ? "!" : linha.includes("|") ? "|" : null;
  if (!separador) return [];

  return linha
    .split(separador)
    .map((cel) => cel.trim())
    .filter(Boolean);
}

function prismaTemContrib(celula: string): boolean {
  const valores = celula.match(DINHEIRO) ?? [];
  const valorPrisma = valores.at(-1);
  if (!valorPrisma) return false;

  const normalizado = valorPrisma.replace(/\./g, "").replace(",", ".");
  return Number(normalizado) > 0;
}

function celulasMes(linha: string): { mes: string; celulas: string[] } | null {
  const celulasTab = celulasDaTabela(linha);
  if (celulasTab.length) {
    const mes = celulasTab[0].toUpperCase().replace(/[.:;]+$/, "");
    if ((MESES as readonly string[]).includes(mes)) {
      return { mes, celulas: celulasTab.slice(1) };
    }
  }

  const match = linha.match(LINHA_MES);
  if (!match) return null;

  const tokens = match[2].trim().split(/\s+/).filter(Boolean);
  const celulas: string[] = [];
  for (let i = 0; i < tokens.length; i += 2) {
    celulas.push(tokens.slice(i, i + 2).join(" "));
  }

  return { mes: match[1].toUpperCase(), celulas };
}

export function extrairMatrizes(
  linhasPagina: string[][],
  dadosConreaj: IndiceConreaj,
): BlocoB94[] {
  const matriz: Record<string, Record<number, ValorCelula>> = Object.fromEntries(
    MESES.map((mes) => [mes, {}]),
  );
  const anosEncontrados = new Set<number>();

  for (const linhas of linhasPagina) {
    let anosAtuais: number[] = [];

    for (const linhaOriginal of linhas) {
      const linha = linhaOriginal.trim();
      const celulasTab = celulasDaTabela(linha);
      const celulaCab = celulasTab[0]?.replace(/\\/g, "/").toUpperCase();

      if (
        (celulaCab === "M/A" && celulasTab.length > 0) ||
        /^M[\\/]A\b/i.test(linha)
      ) {
        const anos = [...linhaOriginal.matchAll(new RegExp(PADRAO_ANO))].map(
          (m) => Number(m[0]),
        );
        anosAtuais = anos;
        anos.forEach((ano) => anosEncontrados.add(ano));
        continue;
      }

      const dadosMes = celulasMes(linha);
      if (!dadosMes || !anosAtuais.length) continue;

      for (let i = 0; i < anosAtuais.length; i += 1) {
        const ano = anosAtuais[i];
        const celula = dadosMes.celulas[i] ?? "";
        if (prismaTemContrib(celula)) {
          matriz[dadosMes.mes][ano] =
            dadosConreaj.get(ano) ?? `CONREAJ ${ano}`;
        } else if (!(ano in matriz[dadosMes.mes])) {
          matriz[dadosMes.mes][ano] = 0;
        }
      }
    }
  }

  const anoInicioConreaj = dadosConreaj.keys().next().value as
    | number
    | undefined;
  const anos = [...anosEncontrados]
    .filter(
      (ano) =>
        dadosConreaj.has(ano) &&
        anoInicioConreaj !== undefined &&
        ano >= anoInicioConreaj,
    )
    .sort((a, b) => a - b);

  const blocos: BlocoB94[] = [];
  for (let i = 0; i < anos.length; i += 5) {
    const grupo = anos.slice(i, i + 5);
    blocos.push({
      periodo: `${grupo[0]}-${grupo.at(-1)}`,
      colunas: grupo,
      linhas: Object.fromEntries(
        MESES.map((mes) => [
          mes,
          grupo.map((ano) => matriz[mes][ano] ?? 0),
        ]),
      ),
    });
  }

  return blocos;
}
