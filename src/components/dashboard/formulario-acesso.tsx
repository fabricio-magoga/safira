"use client";

import { useActionState } from "react";
import { AlertTriangle, KeyRound, LoaderCircle } from "lucide-react";
import { autenticarDashboard, type EstadoAcesso } from "@/app/dashboard/acoes";
import { Alerta } from "@/components/ui/alert";
import { Botao } from "@/components/ui/button";

const ESTADO_INICIAL: EstadoAcesso = { tentativas: 0 };

export function FormularioAcesso() {
  const [estado, acao, pendente] = useActionState(autenticarDashboard, ESTADO_INICIAL);

  return (
    <form action={acao} className="mt-6 space-y-4">
      <div className="space-y-2">
        <label htmlFor="token" className="flex items-center gap-2 text-sm font-medium">
          <KeyRound className="size-4 text-muted-foreground" />
          Token de validação
        </label>
        <input
          id="token"
          name="token"
          type="password"
          autoComplete="off"
          autoFocus
          spellCheck={false}
          placeholder="XXXXX-XXXXX-XXXXX"
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm tracking-[0.08em] shadow-sm outline-none placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {estado?.erro && (
        <Alerta variant="destructive" className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{estado.erro}</span>
        </Alerta>
      )}

      <Botao type="submit" disabled={pendente} className="w-full gap-2">
        {pendente ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Validando token…
          </>
        ) : (
          "Acessar painel"
        )}
      </Botao>
    </form>
  );
}
