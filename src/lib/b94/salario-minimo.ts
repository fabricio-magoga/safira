// salario-minimo.ts
import { NUMERO_MES } from "./conreaj";

export type HistoricoSalario = {
  ano: number;
  mes: number; // 1 a 12
  valor: number;
};

// Histórico local base (Fallback) ordenado do mais recente para o mais antigo
const HISTORICO_LOCAL: HistoricoSalario[] = [
  { ano: 2026, mes: 1, valor: 1621.0 },
  { ano: 2025, mes: 1, valor: 1518.0 },
  { ano: 2024, mes: 1, valor: 1412.0 },
  { ano: 2023, mes: 5, valor: 1320.0 },
  { ano: 2023, mes: 1, valor: 1302.0 },
  { ano: 2022, mes: 1, valor: 1212.0 },
  { ano: 2021, mes: 1, valor: 1100.0 },
  { ano: 2020, mes: 2, valor: 1045.0 },
  { ano: 2020, mes: 1, valor: 1039.0 },
  { ano: 2019, mes: 1, valor: 998.0 },
  { ano: 2018, mes: 1, valor: 954.0 },
  { ano: 2017, mes: 1, valor: 937.0 },
  { ano: 2016, mes: 1, valor: 880.0 },
  { ano: 2015, mes: 1, valor: 788.0 },
  { ano: 2014, mes: 1, valor: 724.0 },
  { ano: 2013, mes: 1, valor: 678.0 },
  { ano: 2012, mes: 1, valor: 622.0 },
  { ano: 2011, mes: 3, valor: 545.0 },
  { ano: 2011, mes: 1, valor: 540.0 },
  { ano: 2010, mes: 1, valor: 510.0 },
  { ano: 2009, mes: 2, valor: 465.0 },
  { ano: 2008, mes: 3, valor: 415.0 },
  { ano: 2007, mes: 4, valor: 380.0 },
  { ano: 2006, mes: 4, valor: 350.0 },
  { ano: 2005, mes: 5, valor: 300.0 },
  { ano: 2004, mes: 5, valor: 260.0 },
  { ano: 2003, mes: 6, valor: 240.0 },
  { ano: 2002, mes: 6, valor: 200.0 },
  { ano: 2001, mes: 6, valor: 180.0 },
  { ano: 2000, mes: 6, valor: 151.0 },
  { ano: 1999, mes: 5, valor: 136.0 },
  { ano: 1998, mes: 5, valor: 130.0 },
  { ano: 1997, mes: 5, valor: 120.0 },
  { ano: 1996, mes: 5, valor: 112.0 },
  { ano: 1995, mes: 5, valor: 100.0 },
  { ano: 1994, mes: 9, valor: 70.0 },
  { ano: 1994, mes: 7, valor: 64.79 },
];

let cacheHistorico: HistoricoSalario[] = HISTORICO_LOCAL;

/**
 * Busca o histórico de salários mínimos diretamente da API do Banco Central.
 * Atualiza o cache em memória e no localStorage.
 */
export async function carregarSalariosMinimos(): Promise<void> {
  const CHAVE_CACHE = "salarios_minimos_bcb";
  const CHAVE_DATA_CACHE = "salarios_minimos_data";

  // Tenta carregar do localStorage primeiro
  const cacheSalvo = localStorage.getItem(CHAVE_CACHE);
  const dataUltimaAtualizacao = localStorage.getItem(CHAVE_DATA_CACHE);

  if (cacheSalvo) {
    try {
      cacheHistorico = JSON.parse(cacheSalvo);
    } catch {
      cacheHistorico = HISTORICO_LOCAL;
    }
  }

  // Atualiza via API se não houver cache ou se tiver passado mais de 7 dias
  const umaSemana = 7 * 24 * 60 * 60 * 1000;
  const precisaAtualizar =
    !dataUltimaAtualizacao ||
    Date.now() - Number(dataUltimaAtualizacao) > umaSemana;

  if (!precisaAtualizar) return;

  try {
    // Série 1619 do SGS/BCB: Salário mínimo mensal em R$
    const resposta = await fetch(
      "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1619/dados?formato=json",
    );
    if (!resposta.ok) throw new Error("Falha na requisição BCB");

    const dados: Array<{ data: string; valor: string }> = await resposta.json();

    const historicoBcb: HistoricoSalario[] = dados
      .map((item) => {
        const [dia, mes, ano] = item.data.split("/").map(Number);
        return {
          ano,
          mes,
          valor: Number(item.valor),
        };
      })
      .filter((item) => !isNaN(item.valor) && item.valor > 0);

    // Ordena do mais recente para o mais antigo
    historicoBcb.sort((a, b) => {
      if (a.ano !== b.ano) return b.ano - a.ano;
      return b.mes - a.mes;
    });

    if (historicoBcb.length > 0) {
      cacheHistorico = historicoBcb;
      localStorage.setItem(CHAVE_CACHE, JSON.stringify(historicoBcb));
      localStorage.setItem(CHAVE_DATA_CACHE, Date.now().toString());
    }
  } catch (erro) {
    console.warn(
      "Não foi possível atualizar salários mínimos via BCB. Usando versão em cache/fallback.",
      erro,
    );
  }
}

/**
 * Obtém o salário mínimo vigente para determinado ano e mês.
 */
export function obterSalarioMinimo(
  ano: number,
  mesNome: string,
): number | null {
  const numMes = NUMERO_MES[mesNome.toUpperCase()];
  if (!numMes) return null;

  const item = cacheHistorico.find((h) => {
    if (ano > h.ano) return true;
    if (ano === h.ano && numMes >= h.mes) return true;
    return false;
  });

  return item ? item.valor : null;
}
