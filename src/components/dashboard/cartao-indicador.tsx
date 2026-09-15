import type { ReactNode } from "react";
import { CartaoDestaque } from "@/components/ui/card";

type PropsCartaoIndicador = {
  titulo: string;
  valor: string;
  legenda: string;
  icone: ReactNode;
  detalhe?: ReactNode;
};

export function CartaoIndicador({
  titulo,
  valor,
  legenda,
  icone,
  detalhe,
}: PropsCartaoIndicador) {
  return (
    <CartaoDestaque className="flex flex-col justify-between gap-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {titulo}
          </p>
          <p className="mt-3 text-3xl font-black tracking-[-0.05em]">{valor}</p>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary dark:text-primary-foreground">
          {icone}
        </span>
      </div>
      <div>
        <p className="text-xs leading-5 text-muted-foreground">{legenda}</p>
        {detalhe}
      </div>
    </CartaoDestaque>
  );
}
