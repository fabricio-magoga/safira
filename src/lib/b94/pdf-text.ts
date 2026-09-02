import { extractTextItems } from "unpdf";

type TrechoTexto = {
  str: string;
  x: number;
  y: number;
  width: number;
  hasEOL?: boolean;
};

const TOLERANCIA_Y = 3;
const TOLERANCIA_X = 2;

function trechosParaLinhas(trechos: TrechoTexto[]): string[] {
  const ordenados = [...trechos].sort((a, b) => b.y - a.y || a.x - b.x);
  const agrupados: TrechoTexto[][] = [];

  for (const trecho of ordenados) {
    const ultimaLinha = agrupados.at(-1);
    if (ultimaLinha && Math.abs(ultimaLinha[0].y - trecho.y) <= TOLERANCIA_Y) {
      ultimaLinha.push(trecho);
    } else {
      agrupados.push([trecho]);
    }
  }

  return agrupados.map((linha) => {
    linha.sort((a, b) => a.x - b.x);
    let texto = "";
    for (let i = 0; i < linha.length; i += 1) {
      const trecho = linha[i];
      if (i > 0) {
        const anterior = linha[i - 1];
        const espaco = trecho.x - (anterior.x + anterior.width);
        if (espaco > TOLERANCIA_X) texto += " ";
      }
      texto += trecho.str;
    }
    return texto.replace(/\s+$/g, "");
  });
}

export async function extrairLinhasPdf(
  dados: Uint8Array,
): Promise<string[][]> {
  const { items } = await extractTextItems(dados);
  return items.map((itensPagina) => trechosParaLinhas(itensPagina));
}
