import { NextResponse } from "next/server";
import { parseConreajText } from "@/lib/b94/conreaj";
import { extractB94Matrices } from "@/lib/b94/inss-pdf";
import { extractPdfPageLines } from "@/lib/b94/pdf-text";

export const runtime = "nodejs";
export const maxDuration = 60;

function isPdf(file: File): boolean {
  if (file.type === "application/pdf") return true;
  return file.name.toLowerCase().endsWith(".pdf");
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const conreajText = String(formData.get("conreaj_text") ?? "");
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Envie um arquivo PDF" },
      { status: 400 },
    );
  }

  if (!isPdf(file)) {
    return NextResponse.json(
      { error: "Envie um arquivo PDF" },
      { status: 415 },
    );
  }

  try {
    const data = new Uint8Array(await file.arrayBuffer());
    const pageLines = await extractPdfPageLines(data);
    const blocks = extractB94Matrices(pageLines, parseConreajText(conreajText));
    return NextResponse.json({ blocks });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível analisar os documentos." },
      { status: 500 },
    );
  }
}
