import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Cabecalho } from "@/components/app-header";
import { B94Logotipo, SafiraLogotipo } from "@/components/brand";

export default function PaginaInicial() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <Cabecalho />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-6xl items-start justify-center px-5 pb-10 pt-8 sm:px-8 sm:pt-14">
        <section className="mx-auto mt-6 flex max-w-4xl flex-col items-center text-center">
          <div className="mb-10 max-w-xl">
            <h1>
              <SafiraLogotipo className="text-4xl sm:text-6xl" />
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Sistema de Análise Facilitada de Informações e Requerimentos
              Assistenciais
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <Link
              href="/b94+"
              className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card/90 px-5 py-5 text-left no-underline shadow-[0_18px_60px_-32px_rgba(13,74,134,0.42)] hover:border-primary/40 hover:bg-card"
            >
              <div>
                <B94Logotipo className="text-2xl sm:text-3xl" />
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  É um módulo do SAFIRA que facilita a análise de benefícios
                  B94, permitindo análises deforma mais rápida e automática.
                </p>
              </div>
              <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-opacity group-hover:opacity-70" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
