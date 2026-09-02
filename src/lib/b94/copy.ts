import type { ValorCelula } from "./types";
import { formatarCopia } from "./format";

export async function copiarBloco(
  linhas: Record<string, ValorCelula[]>,
  colunas: number[],
): Promise<void> {
  const itens: string[] = [];

  colunas.forEach((_, indice) => {
    Object.values(linhas).forEach((valores) => {
      const valor = valores[indice];
      if (valor === undefined || valor === null) {
        return;
      }

      const formatado = formatarCopia(valor);
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
