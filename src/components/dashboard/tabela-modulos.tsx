import {
  Tabela,
  TabelaCabecalho,
  TabelaCelula,
  TabelaCelulaCab,
  TabelaCorpo,
  TabelaLinha,
} from "@/components/ui/table";
import type { EstatisticaModulo } from "@/lib/dashboard/estatisticas";
import { formatarInteiro, formatarPercentual } from "@/lib/dashboard/formato";

type PropsTabelaModulos = {
  modulos: EstatisticaModulo[];
};

export function TabelaModulos({ modulos }: PropsTabelaModulos) {
  return (
    <Tabela>
      <TabelaCabecalho className="[&_tr]:border-0">
        <TabelaLinha className="border-0 hover:bg-transparent">
          <TabelaCelulaCab className="h-9 pl-0">Módulo</TabelaCelulaCab>
          <TabelaCelulaCab className="h-9 pr-0 text-right">Interações</TabelaCelulaCab>
        </TabelaLinha>
      </TabelaCabecalho>
      <TabelaCorpo>
        {modulos.map((modulo) => (
          <TabelaLinha key={modulo.id} className="border-0 hover:bg-transparent">
            <TabelaCelula className="pl-0">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium">{modulo.nome}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {formatarPercentual(modulo.participacao)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-accent">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(2, Math.min(100, modulo.participacao))}%` }}
                  />
                </div>
              </div>
            </TabelaCelula>
            <TabelaCelula className="pr-0 text-right font-mono text-sm">
              {formatarInteiro(modulo.interacoes)}
            </TabelaCelula>
          </TabelaLinha>
        ))}
      </TabelaCorpo>
    </Tabela>
  );
}
