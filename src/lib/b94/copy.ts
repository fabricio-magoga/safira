// Camada apresentação/copiar para a área de transferência do navegador com fallback (execCommand).

// copy.ts
import type { ValorCelula } from "./types";
import { formatarCopia } from "./format";
import { obterSalarioMinimo } from "./salario-minimo";
import { converterValorBr } from "./numero";

export async function copiarBloco(
  linhas: Record<string, ValorCelula[]>,
  colunas: number[],
  ehExtremidade: (ano: number, mes: string) => boolean,
): Promise<void> {
  const itens: string[] = [];

  colunas.forEach((ano, indice) => {
    Object.entries(linhas).forEach(([mes, valores]) => {
      if (ehExtremidade(ano, mes)) {
        return;
      }

      const valor = valores[indice];
      if (valor === undefined || valor === null) {
        return;
      }

      // Converte o valor para número
      let valorNumerico: number | null = null;
      if (typeof valor === "number") {
        valorNumerico = valor;
      } else if (typeof valor === "string") {
        valorNumerico = converterValorBr(valor);
      }

      // Verifica se o valor é menor que o salário mínimo vigente
      const salarioMinimo = obterSalarioMinimo(ano, mes);
      let sufixo = "";

      if (
        valorNumerico !== null &&
        salarioMinimo !== null &&
        valorNumerico > 0 &&
        valorNumerico < salarioMinimo
      ) {
        sufixo = " s";
      }

      const formatado = formatarCopia(valor, sufixo);
      if (formatado !== null) {
        itens.push(formatado);
      }
    });
  });

  const texto = itens.join("\n");

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(texto);
    return;
  }

  const areaTexto = document.createElement("textarea");
  areaTexto.value = texto;
  areaTexto.setAttribute("readonly", "");
  areaTexto.style.position = "fixed";
  areaTexto.style.opacity = "0";
  document.body.appendChild(areaTexto);
  areaTexto.select();

  try {
    if (!document.execCommand("copy")) {
      throw new Error(
        "Não foi possível copiar o bloco para a área de transferência.",
      );
    }
  } finally {
    areaTexto.remove();
  }
}
