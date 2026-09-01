import { extractTextItems } from "unpdf";

type TextSpan = {
  str: string;
  x: number;
  y: number;
  width: number;
  hasEOL?: boolean;
};

const Y_TOLERANCE = 3;
const X_TOLERANCE = 2;

function spansToLines(spans: TextSpan[]): string[] {
  const sorted = [...spans].sort((a, b) => b.y - a.y || a.x - b.x);
  const grouped: TextSpan[][] = [];

  for (const span of sorted) {
    const lastLine = grouped.at(-1);
    if (lastLine && Math.abs(lastLine[0].y - span.y) <= Y_TOLERANCE) {
      lastLine.push(span);
    } else {
      grouped.push([span]);
    }
  }

  return grouped.map((line) => {
    line.sort((a, b) => a.x - b.x);
    let text = "";
    for (let index = 0; index < line.length; index += 1) {
      const span = line[index];
      if (index > 0) {
        const previous = line[index - 1];
        const gap = span.x - (previous.x + previous.width);
        if (gap > X_TOLERANCE) text += " ";
      }
      text += span.str;
    }
    return text.replace(/\s+$/g, "");
  });
}

export async function extractPdfPageLines(
  data: Uint8Array,
): Promise<string[][]> {
  const { items } = await extractTextItems(data);
  return items.map((pageItems) => spansToLines(pageItems));
}
