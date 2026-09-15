import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export type ModuloId = "b94";

export type PontoFluxo = {
  rotulo: string;
  interacoes: number;
};

export type EstatisticaModulo = {
  id: ModuloId;
  nome: string;
  interacoes: number;
  participacao: number;
};

export type ResumoEstatisticas = {
  usuariosAtivos: number;
  interacoesTotais: number;
  eficiencia: number;
  tempoMedioMs: number;
  inicioEm: string;
  atualizadoEm: string;
  fluxo: PontoFluxo[];
  modulos: EstatisticaModulo[];
};

type OpcoesEvento = {
  sucesso?: boolean;
  duracaoMs?: number;
};

type EstadoEstatisticas = {
  inicioEm: number;
  interacoesTotais: number;
  interacoesConcluidas: number;
  erros: number;
  tempoTotalMs: number;
  porModulo: Record<ModuloId, number>;
  fluxoPorDia: Map<string, number>;
  sessoes: Map<string, number>;
};

type EscopoGlobal = typeof globalThis & {
  __safiraDashboardEstatisticas?: EstadoEstatisticas;
};

type EstadoSerializado = {
  inicioEm: number;
  interacoesTotais: number;
  interacoesConcluidas: number;
  erros: number;
  tempoTotalMs: number;
  porModulo: Record<ModuloId, number>;
  fluxoPorDia: [string, number][];
  sessoes: [string, number][];
};

const ARQUIVO_ESTADO = join(
  process.cwd(),
  ".dados",
  process.env.NODE_ENV === "development"
    ? "estatisticas.dev.json"
    : "estatisticas.json",
);
const INTERVALO_SALVAMENTO_SESSOES_MS = 5000;

let ultimoSalvamentoSessoes = 0;

const NOMES_MODULOS: Record<ModuloId, string> = {
  b94: "b94+",
};

const MS_POR_DIA = 24 * 60 * 60 * 1000;
const JANELA_ATIVIDADE_MS = 2 * 60 * 1000;
const DIAS_EXIBIDOS = 30;
const DIAS_RETIDOS = 180;

function chaveDoDia(instante: number) {
  const data = new Date(instante);
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function rotuloDoDia(chave: string) {
  const [, mes, dia] = chave.split("-");
  return `${dia}/${mes}`;
}

function obterEstado(): EstadoEstatisticas {
  const escopo = globalThis as EscopoGlobal;
  escopo.__safiraDashboardEstatisticas = normalizarEstado(
    escopo.__safiraDashboardEstatisticas,
    criarEstadoInicial,
  );
  return escopo.__safiraDashboardEstatisticas;
}

function criarEstadoInicial(): EstadoEstatisticas {
  const padrao: EstadoEstatisticas = {
    inicioEm: Date.now(),
    interacoesTotais: 0,
    interacoesConcluidas: 0,
    erros: 0,
    tempoTotalMs: 0,
    porModulo: { b94: 0 },
    fluxoPorDia: new Map(),
    sessoes: new Map(),
  };

  return carregarEstado(padrao);
}

function numero(valor: unknown, padrao: number) {
  const convertido = Number(valor);
  return Number.isFinite(convertido) ? convertido : padrao;
}

function converterMapaDeInstantes(fonte: unknown) {
  const mapa = new Map<string, number>();

  if (fonte instanceof Map) {
    for (const [chave, valor] of fonte as Map<unknown, unknown>) {
      if (typeof chave === "string") {
        mapa.set(chave, numero(valor, 0));
      }
    }
    return mapa;
  }

  if (Array.isArray(fonte)) {
    for (const item of fonte) {
      if (Array.isArray(item) && item.length === 2 && typeof item[0] === "string") {
        mapa.set(item[0], numero(item[1], 0));
      }
    }
  }

  return mapa;
}

function normalizarEstado(
  fonte: unknown,
  criarPadrao: () => EstadoEstatisticas,
): EstadoEstatisticas {
  if (!fonte || typeof fonte !== "object") {
    return criarPadrao();
  }

  const bruto = fonte as Partial<EstadoSerializado> & {
    fluxoPorDia?: unknown;
    fluxoPorHora?: unknown;
    sessoes?: unknown;
    porModulo?: unknown;
  };

  const porModulo = (bruto.porModulo ?? {}) as Partial<Record<ModuloId, number>>;

  return {
    inicioEm: numero(bruto.inicioEm, Date.now()),
    interacoesTotais: numero(bruto.interacoesTotais, 0),
    interacoesConcluidas: numero(bruto.interacoesConcluidas, 0),
    erros: numero(bruto.erros, 0),
    tempoTotalMs: numero(bruto.tempoTotalMs, 0),
    porModulo: {
      b94: numero(porModulo.b94, 0),
    },
    fluxoPorDia: converterMapaDeInstantes(bruto.fluxoPorDia),
    sessoes: converterMapaDeInstantes(bruto.sessoes),
  };
}

function carregarEstado(padrao: EstadoEstatisticas): EstadoEstatisticas {
  try {
    const bruto = readFileSync(ARQUIVO_ESTADO, "utf8");
    return normalizarEstado(JSON.parse(bruto), () => padrao);
  } catch {
    return padrao;
  }
}

function persistirEstado() {
  const estado = obterEstado();
  const serializado: EstadoSerializado = {
    inicioEm: estado.inicioEm,
    interacoesTotais: estado.interacoesTotais,
    interacoesConcluidas: estado.interacoesConcluidas,
    erros: estado.erros,
    tempoTotalMs: estado.tempoTotalMs,
    porModulo: estado.porModulo,
    fluxoPorDia: Array.from(estado.fluxoPorDia.entries()),
    sessoes: Array.from(estado.sessoes.entries()),
  };

  try {
    mkdirSync(dirname(ARQUIVO_ESTADO), { recursive: true });
    const temporario = `${ARQUIVO_ESTADO}.tmp`;
    writeFileSync(temporario, JSON.stringify(serializado), "utf8");
    renameSync(temporario, ARQUIVO_ESTADO);
  } catch {
    return;
  }
}

function persistirSessoesComIntervalo() {
  const agora = Date.now();
  if (agora - ultimoSalvamentoSessoes < INTERVALO_SALVAMENTO_SESSOES_MS) return;

  ultimoSalvamentoSessoes = agora;
  persistirEstado();
}

function limparPeriodosAntigos(estado: EstadoEstatisticas) {
  const limite = chaveDoDia(Date.now() - DIAS_RETIDOS * MS_POR_DIA);

  for (const chave of estado.fluxoPorDia.keys()) {
    if (chave < limite) {
      estado.fluxoPorDia.delete(chave);
    }
  }
}

export function registrarEvento(modulo: ModuloId, opcoes: OpcoesEvento = {}) {
  const estado = obterEstado();
  const { sucesso = true, duracaoMs } = opcoes;
  const chave = chaveDoDia(Date.now());

  estado.interacoesTotais += 1;
  estado.porModulo[modulo] += 1;
  estado.fluxoPorDia.set(chave, (estado.fluxoPorDia.get(chave) ?? 0) + 1);

  if (sucesso) {
    estado.interacoesConcluidas += 1;
    if (typeof duracaoMs === "number" && Number.isFinite(duracaoMs) && duracaoMs > 0) {
      estado.tempoTotalMs += duracaoMs;
    }
  } else {
    estado.erros += 1;
  }

  persistirEstado();
}

export function marcarAtividade(identificador: string) {
  const estado = obterEstado();
  estado.sessoes.set(identificador, Date.now());
  persistirSessoesComIntervalo();
}

function contarSessoesAtivas(estado: EstadoEstatisticas) {
  const limite = Date.now() - JANELA_ATIVIDADE_MS;

  for (const [identificador, instante] of estado.sessoes) {
    if (instante < limite) {
      estado.sessoes.delete(identificador);
    }
  }

  return estado.sessoes.size;
}

function montarFluxo(estado: EstadoEstatisticas): PontoFluxo[] {
  const pontos: PontoFluxo[] = [];
  const agora = Date.now();

  for (let deslocamento = DIAS_EXIBIDOS - 1; deslocamento >= 0; deslocamento -= 1) {
    const chave = chaveDoDia(agora - deslocamento * MS_POR_DIA);

    pontos.push({
      rotulo: rotuloDoDia(chave),
      interacoes: estado.fluxoPorDia.get(chave) ?? 0,
    });
  }

  return pontos;
}

function montarModulos(estado: EstadoEstatisticas, total: number): EstatisticaModulo[] {
  return (Object.keys(estado.porModulo) as ModuloId[])
    .map((id) => ({
      id,
      nome: NOMES_MODULOS[id],
      interacoes: estado.porModulo[id],
      participacao: total > 0 ? (estado.porModulo[id] / total) * 100 : 0,
    }))
    .sort((a, b) => b.interacoes - a.interacoes);
}

export function obterResumo(): ResumoEstatisticas {
  const estado = obterEstado();
  limparPeriodosAntigos(estado);

  const total = estado.interacoesTotais;

  return {
    usuariosAtivos: contarSessoesAtivas(estado),
    interacoesTotais: total,
    eficiencia: total > 0 ? (estado.interacoesConcluidas / total) * 100 : 0,
    tempoMedioMs:
      estado.interacoesConcluidas > 0
        ? estado.tempoTotalMs / estado.interacoesConcluidas
        : 0,
    inicioEm: new Date(estado.inicioEm).toISOString(),
    atualizadoEm: new Date().toISOString(),
    fluxo: montarFluxo(estado),
    modulos: montarModulos(estado, total),
  };
}
