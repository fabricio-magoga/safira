import type { CellValue } from "./types";
import { formatCopyValue } from "./format";

export async function copyBlockToExcel(
  rows: Record<string, CellValue[]>,
  columns: number[],
): Promise<void> {
  const lines: string[] = [];

  columns.forEach((_, index) => {
    Object.values(rows).forEach((values) => {
      const value = values[index];
      if (value === undefined || value === null) {
        return;
      }

      const formatted = formatCopyValue(value);
      if (formatted !== null) {
        lines.push(formatted);
      }
    });
  });

  const text = lines.join("\n");

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    if (!document.execCommand("copy")) {
      throw new Error(
        "Não foi possível copiar o bloco para a área de transferência.",
      );
    }
  } finally {
    textarea.remove();
  }
}
