const DATE_PATTERN = /^\s*\d{2}\/((?:19|20)\d{2})\b/;
const VALUE_PATTERN = /[\d.]+(?:,\d{1,2})?/g;
const VALUE_FULL = /^[\d.]+(?:,\d{1,2})?$/;

export function parseConreajText(rawText: string): Map<number, number> {
  const data = new Map<number, number>();

  for (const line of rawText.split(/\r?\n/)) {
    const dateMatch = line.match(DATE_PATTERN);
    if (!dateMatch) continue;

    const cells = line.split("\t").map((cell) => cell.trim());
    let correctedValue: string;

    if (cells.length >= 5) {
      correctedValue = cells[4] ?? "";
    } else {
      const rest = line.slice(dateMatch[0].length);
      const values = [...rest.matchAll(VALUE_PATTERN)].map((match) => match[0]);
      correctedValue = values.at(-1) ?? "";
    }

    if (!VALUE_FULL.test(correctedValue)) continue;

    const year = Number(dateMatch[1]);
    const cleanValue = correctedValue.replace(/\./g, "").replace(",", ".");
    data.set(year, Number(cleanValue));
  }

  return data;
}

export function getFirstConreajYear(text: string): number | null {
  const match = text.match(/^\s*\d{2}\/((?:19|20)\d{2})\b/m);
  return match ? Number(match[1]) : null;
}
