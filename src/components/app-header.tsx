import Link from "next/link";
import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { SafiraLink } from "@/components/brand";
import { AlternarTema } from "@/components/theme-toggle";
import { BotaoIcone, CLASSE_ICONE_INTERATIVO } from "@/components/ui/icon-button";

type PropsCabecalho = {
  esquerda?: ReactNode;
  direita?: ReactNode;
  className?: string;
};

export function Cabecalho({
  esquerda = <SafiraLink />,
  direita = <AlternarTema />,
  className = "",
}: PropsCabecalho) {
  return (
    <header
      className={`sticky top-0 z-20 mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between bg-transparent px-5 sm:px-8 ${className}`.trim()}
    >
      <div className="flex items-center gap-4">{esquerda}</div>
      <div className="flex items-center gap-1">
        <Link href="/sobre" aria-label="Sobre o SAFIRA">
          <BotaoIcone aria-hidden="true" tabIndex={-1}>
            <Info className={CLASSE_ICONE_INTERATIVO} />
          </BotaoIcone>
        </Link>
        {direita}
      </div>
    </header>
  );
}
