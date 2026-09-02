import { NextResponse } from "next/server";
import { analisarConreaj } from "@/lib/b94/conreaj";
import { extrairMatrizes } from "@/lib/b94/inss-pdf";
import { extrairLinhasPdf } from "@/lib/b94/pdf-text";

export const runtime = "nodejs";
export const maxDuration = 60;

function ehPdf(arquivo: File): boolean {
  if (arquivo.type === "application/pdf") return true;
  return arquivo.name.toLowerCase().endsWith(".pdf");
}

export async function POST(requisicao: Request) {
  const formData = await requisicao.formData();
  const textoConreaj = String(formData.get("conreaj_text") ?? "");
  const arquivo = formData.get("file");

  if (!(arquivo instanceof File)) {
    return NextResponse.json(
      { error: "Envie um arquivo PDF" },
      { status: 400 },
    );
  }

  if (!ehPdf(arquivo)) {
    return NextResponse.json(
      { error: "Envie um arquivo PDF" },
      { status: 415 },
    );
  }

  try {
    const dados = new Uint8Array(await arquivo.arrayBuffer());
    const linhasPagina = await extrairLinhasPdf(dados);
    const blocos = extrairMatrizes(linhasPagina, analisarConreaj(textoConreaj));
    return NextResponse.json({ blocks: blocos });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível analisar os documentos." },
      { status: 500 },
    );
  }
}
