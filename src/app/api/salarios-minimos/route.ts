import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Consulta a série 1619 (Salário Mínimo) na API do Banco Central
    const resposta = await fetch(
      "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1619/dados?formato=json",
      {
        // Revalida os dados a cada 24 horas para garantir atualização sem sobrecarregar a API
        next: { revalidate: 86400 },
      },
    );

    if (!resposta.ok) {
      throw new Error("Falha ao buscar dados no Banco Central");
    }

    const dados = await resposta.json();
    return NextResponse.json(dados);
  } catch (erro) {
    return NextResponse.json(
      { error: "Erro ao carregar salários mínimos" },
      { status: 500 },
    );
  }
}
