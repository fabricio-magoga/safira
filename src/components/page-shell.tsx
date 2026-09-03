import type { HTMLAttributes, ReactNode } from "react";
import { Cabecalho } from "@/components/app-header";
import { cn } from "@/lib/cn";

type PropsPaginaBase = {
  cabecalho?: ReactNode;
  children: ReactNode;
};

export function PaginaBase({ cabecalho = <Cabecalho />, children }: PropsPaginaBase) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      {cabecalho}
      {children}
    </main>
  );
}

export function ConteudoPagina({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24",
        className,
      )}
      {...props}
    />
  );
}
