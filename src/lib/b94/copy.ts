import type { CellValue } from "./types";
import { formatCopyValue } from "./format";

export function copyBlockToExcel(
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

  return navigator.clipboard.writeText(lines.join("\n"));
}
