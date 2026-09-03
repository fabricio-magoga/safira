"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { BotaoIcone, CLASSE_ICONE_INTERATIVO } from "@/components/ui/icon-button";
import { useTema } from "@/components/theme-provider";

export function AlternarTema() {
  const montado = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const { temaResolvido, defTema } = useTema();
  const ehEscuro = temaResolvido === "dark";

  if (!montado) {
    return (
      <BotaoIcone aria-label="Carregando tema">
        <Sun className="size-5 opacity-50" strokeWidth={2.2} />
      </BotaoIcone>
    );
  }

  const Icone = ehEscuro ? Sun : Moon;

  return (
    <BotaoIcone
      aria-label={ehEscuro ? "Ativar tema claro" : "Ativar tema escuro"}
      onClick={() => defTema(ehEscuro ? "light" : "dark")}
    >
      <Icone className={CLASSE_ICONE_INTERATIVO} strokeWidth={2.2} />
    </BotaoIcone>
  );
}
