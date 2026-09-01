import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { B94Wordmark, SafiraWordmark } from "@/components/brand";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <header className="sticky top-0 z-20 mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between bg-transparent px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 text-foreground no-underline"
          aria-label="SAFIRA"
        >
          <span
            className="size-2 rounded-full bg-primary shadow-[0_0_0_3px_var(--background)] transition-transform duration-300 group-hover:scale-125"
            aria-hidden="true"
          />
          <SafiraWordmark />
        </Link>
        <ThemeToggle />
      </header>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-6xl items-start justify-center px-5 pb-10 pt-8 sm:px-8 sm:pt-14">
        <section className="mx-auto mt-6 flex max-w-4xl flex-col items-center text-center">
          <div className="mb-10 max-w-xl">
            <h1>
              <SafiraWordmark className="text-4xl sm:text-6xl" />
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Sistema de Análise Facilitada de Informações e Requerimentos
              Assistenciais
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <Link
              href="/b94easy"
              className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card/90 px-5 py-5 text-left no-underline shadow-[0_18px_60px_-32px_rgba(13,74,134,0.42)] transition-colors hover:border-primary/40 hover:bg-card"
            >
              <div>
                <B94Wordmark className="text-2xl sm:text-3xl" />
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Análise rápida de benefícios B94 com foco em produtividade,
                  clareza operacional e ergonomia de uso.
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
