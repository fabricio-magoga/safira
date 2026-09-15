const FORMATADOR_INTEIRO = new Intl.NumberFormat("pt-BR");

const FORMATADOR_HORARIO = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const FORMATADOR_DATA_HORA = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatarInteiro(valor: number) {
  return FORMATADOR_INTEIRO.format(Math.round(valor));
}

export function formatarPercentual(valor: number) {
  return `${valor.toFixed(1).replace(".", ",")}%`;
}

export function formatarDuracao(milissegundos: number) {
  if (!Number.isFinite(milissegundos) || milissegundos <= 0) return "—";
  if (milissegundos >= 1000) {
    return `${(milissegundos / 1000).toFixed(2).replace(".", ",")} s`;
  }
  return `${Math.round(milissegundos)} ms`;
}

export function formatarHorario(instante: string) {
  const data = new Date(instante);
  if (Number.isNaN(data.getTime())) return "--:--";
  return FORMATADOR_HORARIO.format(data);
}

export function formatarDataHora(instante: string) {
  const data = new Date(instante);
  if (Number.isNaN(data.getTime())) return "data desconhecida";
  return FORMATADOR_DATA_HORA.format(data);
}
