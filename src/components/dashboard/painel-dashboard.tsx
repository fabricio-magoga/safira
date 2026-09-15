"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Activity, Gauge, RefreshCw, Users } from "lucide-react";
import { CartaoIndicador } from "@/components/dashboard/cartao-indicador";
import { GraficoFluxo } from "@/components/dashboard/grafico-fluxo";
import { TabelaModulos } from "@/components/dashboard/tabela-modulos";
import { Alerta } from "@/components/ui/alert";
import { Botao } from "@/components/ui/button";
import { CartaoDestaque } from "@/components/ui/card";
import type { ResumoEstatisticas } from "@/lib/dashboard/estatisticas";
import {
  formatarDataHora,
  formatarDuracao,
  formatarHorario,
  formatarInteiro,
  formatarPercentual,
} from "@/lib/dashboard/formato";

const INTERVALO_ATUALIZACAO_MS = 15000;

type PropsPainelDashboard = {
  resumoInicial: ResumoEstatisticas;
};

export function PainelDashboard({ resumoInicial }: PropsPainelDashboard) {
  const [resumo, defResumo] = useState(resumoInicial);
  const [atualizadoEm, defAtualizadoEm] = useState<string | null>(null);
  const [atualizando, defAtualizando] = useState(false);
  const [sessaoExpirada, defSessaoExpirada] = useState(false);

  const buscarResumo = useCallback(async () => {
    defAtualizando(true);

    try {
      const resposta = await fetch("/api/dashboard/metricas", {
        cache: "no-store",
      });

      if (resposta.status === 401) {
        defSessaoExpirada(true);
        return;
      }

      if (!resposta.ok) return;

      const dados = (await resposta.json()) as ResumoEstatisticas;
      defResumo(dados);
      defAtualizadoEm(dados.atualizadoEm);
      defSessaoExpirada(false);
    } catch {
      defSessaoExpirada(false);
    } finally {
      defAtualizando(false);
    }
  }, []);

  useEffect(() => {
    const temporizador = window.setTimeout(() => {
      void buscarResumo();
    }, 0);
    const identificador = window.setInterval(() => {
      void buscarResumo();
    }, INTERVALO_ATUALIZACAO_MS);

    return () => {
      window.clearTimeout(temporizador);
      window.clearInterval(identificador);
    };
  }, [buscarResumo]);

  return (
    <div className="space-y-3">
      {sessaoExpirada && (
        <Alerta
          variant="destructive"
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <span>
            Sessão expirada. Insira o token novamente para continuar
            acompanhando os indicadores.
          </span>
          <Link
            href="/dashboard/acesso"
            className="font-medium underline underline-offset-4"
          >
            ir para o acesso
          </Link>
        </Alerta>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <CartaoIndicador
          titulo="usuários ativos agora"
          valor={formatarInteiro(resumo.usuariosAtivos)}
          legenda="Navegadores distintos com o SAFIRA aberto nos últimos 2 minutos, contados a cada 60s."
          icone={<Users className="size-5" strokeWidth={2.2} />}
        />
        <CartaoIndicador
          titulo="interações registradas"
          valor={formatarInteiro(resumo.interacoesTotais)}
          legenda="Análises b94+ aplicadas."
          icone={<Activity className="size-5" strokeWidth={2.2} />}
        />
        <CartaoIndicador
          titulo="eficiência operacional"
          valor={formatarPercentual(resumo.eficiencia)}
          legenda="Percentual de interações concluídas sem erro, calculado sobre o total processado."
          icone={<Gauge className="size-5" strokeWidth={2.2} />}
          detalhe={
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              tempo médio de resposta: {formatarDuracao(resumo.tempoMedioMs)}
            </p>
          }
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <CartaoDestaque className="p-5 sm:p-6">
          <GraficoFluxo pontos={resumo.fluxo} />
        </CartaoDestaque>
        <CartaoDestaque className="p-5 sm:p-6">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            módulos mais acessados
          </p>
          <TabelaModulos modulos={resumo.modulos} />
        </CartaoDestaque>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-muted-foreground">
        <p>
          Indicadores 100% reais, gravados em arquivo local no servidor — sem banco de dados.
        </p>
        <div className="flex items-center gap-2">
          <span>
            dados desde {formatarDataHora(resumo.inicioEm)}
            {atualizadoEm
              ? ` · atualizado às ${formatarHorario(atualizadoEm)}`
              : " · sincronizando…"}
          </span>
          <Botao
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void buscarResumo()}
            disabled={atualizando}
            className="h-7 gap-1.5 px-2 text-xs"
          >
            <RefreshCw
              className={`size-3.5 ${atualizando ? "animate-spin" : ""}`}
            />
            atualizar
          </Botao>
        </div>
      </div>
    </div>
  );
}
