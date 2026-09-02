import type { CellValue } from "./types";

export function formatCopyValue(value: CellValue): string | null {
  if (typeof value === "number") {
    if (value === 0) return null;
    return value.toFixed(2);
  }

  const normalized = value.trim();
  if (!normalized) return null;

  return normalized;
}

export function formatDisplayValue(value: CellValue): string {
  if (typeof value === "number") {
    return value === 0 ? "-" : value.toFixed(2);
  }

  return value.trim() || "-";
}
