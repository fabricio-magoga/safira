"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Botao } from "@/components/ui/button";
import { usarTema } from "@/components/theme-provider";

export function AlternarTema() {
  const montado = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const { temaResolvido, defTema } = usarTema();
  const ehEscuro = temaResolvido === "dark";

  if (!montado) {
    return (
      <Botao
        variant="ghost"
        size="icon"
        className="group size-10 border-0 bg-transparent p-0 hover:bg-transparent hover:text-foreground focus-visible:ring-0"
        aria-label="Carregando tema"
      >
        <Sun className="size-5 opacity-50" strokeWidth={2.2} />
      </Botao>
    );
  }

  return (
    <Botao
      variant="ghost"
      size="icon"
      className="group size-10 border-0 bg-transparent p-0 hover:bg-transparent hover:text-foreground focus-visible:ring-0"
      aria-label={ehEscuro ? "Ativar tema claro" : "Ativar tema escuro"}
      onClick={() => defTema(ehEscuro ? "light" : "dark")}
    >
      {ehEscuro ? (
        <Sun
          className="size-5 transition-opacity duration-200 group-hover:opacity-60"
          strokeWidth={2.2}
        />
      ) : (
        <Moon
          className="size-5 transition-opacity duration-200 group-hover:opacity-60"
          strokeWidth={2.2}
        />
      )}
    </Botao>
  );
}
