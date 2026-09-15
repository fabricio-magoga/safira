import { formatarInteiro } from "@/lib/dashboard/formato";
import type { PontoFluxo } from "@/lib/dashboard/estatisticas";

const LARGURA = 720;
const ALTURA = 240;
const MARGEM = { topo: 28, direita: 14, base: 34, esquerda: 40 };
const LINHAS_DE_GRADE = 4;

type PropsGraficoFluxo = {
  pontos: PontoFluxo[];
};

export function GraficoFluxo({ pontos }: PropsGraficoFluxo) {
  if (pontos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Sem interações registradas neste período.
      </p>
    );
  }

  const larguraArea = LARGURA - MARGEM.esquerda - MARGEM.direita;
  const alturaArea = ALTURA - MARGEM.topo - MARGEM.base;
  const passo = larguraArea / pontos.length;
  const larguraBarra = Math.max(6, passo * 0.6);
  const raioBarra = Math.min(4, larguraBarra / 2);
  const maximo = Math.max(1, ...pontos.map((ponto) => ponto.interacoes));
  const total = pontos.reduce((soma, ponto) => soma + ponto.interacoes, 0);
  const intervaloRotulos = Math.max(1, Math.ceil(pontos.length / 6));
  const indicePico = pontos.reduce(
    (indice, ponto, posicao) =>
      ponto.interacoes > pontos[indice].interacoes ? posicao : indice,
    0,
  );
  const temDados = total > 0;

  const posicaoY = (valor: number) =>
    MARGEM.topo + alturaArea - (valor / maximo) * alturaArea;
  const alturaBarra = (valor: number) =>
    Math.max(3, (valor / maximo) * alturaArea);
  const centroX = (posicao: number) =>
    MARGEM.esquerda + passo * posicao + passo / 2;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          fluxo de uso · últimos {pontos.length} dias
        </p>
        <p className="text-xs text-muted-foreground">
          {formatarInteiro(total)} interações no período
        </p>
      </div>

      <svg
        viewBox={`0 0 ${LARGURA} ${ALTURA}`}
        className="h-56 w-full"
        role="img"
        aria-label={`Fluxo de uso nos últimos ${pontos.length} dias`}
      >
        {Array.from({ length: LINHAS_DE_GRADE + 1 }, (_, linha) => {
          const valor = (maximo / LINHAS_DE_GRADE) * linha;
          const y = posicaoY(valor);

          return (
            <g key={`grade-${linha}`}>
              <line
                x1={MARGEM.esquerda}
                x2={LARGURA - MARGEM.direita}
                y1={y}
                y2={y}
                className="stroke-border"
                strokeWidth={1}
                strokeDasharray={linha === 0 ? undefined : "4 6"}
              />
              <text
                x={MARGEM.esquerda - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {formatarInteiro(valor)}
              </text>
            </g>
          );
        })}

        {pontos.map((ponto, posicao) => {
          const ehPico = posicao === indicePico && temDados;
          const mostrarRotulo =
            posicao % intervaloRotulos === 0 || posicao === pontos.length - 1;

          return (
            <g key={`${ponto.rotulo}-${posicao}`}>
              {ponto.interacoes > 0 && (
                <rect
                  x={centroX(posicao) - larguraBarra / 2}
                  y={posicaoY(ponto.interacoes)}
                  width={larguraBarra}
                  height={alturaBarra(ponto.interacoes)}
                  rx={raioBarra}
                  className={ehPico ? "fill-primary" : "fill-primary/25"}
                />
              )}
              {mostrarRotulo && (
                <text
                  x={centroX(posicao)}
                  y={ALTURA - MARGEM.base + 18}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px]"
                >
                  {ponto.rotulo}
                </text>
              )}
              {ehPico && (
                <text
                  x={centroX(posicao)}
                  y={posicaoY(ponto.interacoes) - 8}
                  textAnchor="middle"
                  className="fill-foreground text-[10px] font-semibold"
                >
                  {formatarInteiro(ponto.interacoes)}
                </text>
              )}
            </g>
          );
        })}

        {!temDados && (
          <text
            x={MARGEM.esquerda + larguraArea / 2}
            y={MARGEM.topo + alturaArea / 2}
            textAnchor="middle"
            className="fill-muted-foreground text-[11px]"
          >
            nenhuma análise b94+ registrada neste período
          </text>
        )}
      </svg>
    </div>
  );
}
