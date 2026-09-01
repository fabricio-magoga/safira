import type { B94Block, CellValue, ConreajIndex } from "./types";

export const MONTHS = [
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

const YEAR_PATTERN = /\b(?:19|20)\d{2}\b/g;
const MONTH_LINE = /^\s*(JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\b(.*)$/i;
const MONEY = /\d[\d.]*,\d{1,2}/g;

function cellsFromBang(line: string): string[] {
  return line
    .split("!")
    .map((cell) => cell.trim())
    .filter(Boolean);
}

function pdfPrismaHasContribution(cell: string): boolean {
  const values = cell.match(MONEY) ?? [];
  if (values.length < 2) return false;
  const prismaValue = values[1].replace(/\./g, "").replace(",", ".");
  return Number(prismaValue) > 0;
}

function monthCells(line: string): { month: string; cells: string[] } | null {
  const bangCells = cellsFromBang(line);
  if (bangCells.length) {
    const month = bangCells[0].toUpperCase().replace(/[.:;]+$/, "");
    if ((MONTHS as readonly string[]).includes(month)) {
      return { month, cells: bangCells.slice(1) };
    }
  }

  const match = line.match(MONTH_LINE);
  if (!match) return null;

  const tokens = match[2].trim().split(/\s+/).filter(Boolean);
  const cells: string[] = [];
  for (let index = 0; index < tokens.length; index += 2) {
    cells.push(tokens.slice(index, index + 2).join(" "));
  }

  return { month: match[1].toUpperCase(), cells };
}

export function extractB94Matrices(
  pageLines: string[][],
  conreajData: ConreajIndex,
): B94Block[] {
  const matrix: Record<string, Record<number, CellValue>> = Object.fromEntries(
    MONTHS.map((month) => [month, {}]),
  );
  const yearsFound = new Set<number>();

  for (const lines of pageLines) {
    let currentYears: number[] = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      const bangCells = cellsFromBang(line);

      if (
        (bangCells.length && bangCells[0].toUpperCase() === "M/A") ||
        /^M\/A\b/i.test(line)
      ) {
        const years = [...rawLine.matchAll(new RegExp(YEAR_PATTERN))].map(
          (match) => Number(match[0]),
        );
        currentYears = years;
        years.forEach((year) => yearsFound.add(year));
        continue;
      }

      const monthData = monthCells(line);
      if (!monthData || !currentYears.length) continue;

      for (let index = 0; index < currentYears.length; index += 1) {
        const year = currentYears[index];
        const cell = monthData.cells[index] ?? "";
        if (pdfPrismaHasContribution(cell)) {
          matrix[monthData.month][year] =
            conreajData.get(year) ?? `CONREAJ ${year}`;
        } else if (!(year in matrix[monthData.month])) {
          matrix[monthData.month][year] = 0;
        }
      }
    }
  }

  const conreajStartYear = conreajData.keys().next().value as number | undefined;
  const years = [...yearsFound]
    .filter(
      (year) =>
        conreajData.has(year) &&
        conreajStartYear !== undefined &&
        year >= conreajStartYear,
    )
    .sort((a, b) => a - b);

  const blocks: B94Block[] = [];
  for (let index = 0; index < years.length; index += 5) {
    const chunk = years.slice(index, index + 5);
    blocks.push({
      period: `${chunk[0]}-${chunk.at(-1)}`,
      columns: chunk,
      rows: Object.fromEntries(
        MONTHS.map((month) => [
          month,
          chunk.map((year) => matrix[month][year] ?? 0),
        ]),
      ),
    });
  }

  return blocks;
}
