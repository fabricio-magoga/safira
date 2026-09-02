import Link from "next/link";
import { AlertTriangle, ArrowLeft, ExternalLink, Mail } from "lucide-react";
import { Cabecalho } from "@/components/app-header";
import { SafiraLogotipo } from "@/components/brand";

export const metadata = {
  title: "SAFIRA - Sobre",
  description: "Sobre o SAFIRA.",
};

export default function PaginaSobre() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <Cabecalho />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <section className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="mb-12 inline-flex items-center gap-2 text-xs text-muted-foreground no-underline hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            voltar ao SAFIRA
          </Link>

          <div className="mb-12 max-w-2xl">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              guia rápido
            </p>
            <h1 className="text-4xl font-black tracking-[-0.08em] sm:text-6xl">
              <SafiraLogotipo className="text-4xl sm:text-6xl" />
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
              Organize os dados do CONREAJ e extraia os valores PRISMA do PDF em
              poucos passos.
            </p>
          </div>

          <div className="space-y-3">
            <article className="rounded-xl border border-border bg-card/90 p-6 shadow-[0_18px_60px_-32px_rgba(13,74,134,0.42)] sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent font-mono text-sm font-bold text-primary dark:text-primary-foreground">
                  01
                </span>
                <div>
                  <h2 className="text-lg font-bold tracking-[-0.03em]">
                    Copie e Cole os dados do CONREAJ
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    No SIBE, copie a tabela do CONREAJ, vá para a tela do
                    B94+ e cole o texto normalmente no campo indicado. O sistema
                    filtrará os dados automaticamente.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-border bg-card/90 p-6 shadow-[0_18px_60px_-32px_rgba(13,74,134,0.42)] sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent font-mono text-sm font-bold text-primary dark:text-primary-foreground ">
                  02
                </span>
                <div>
                  <h2 className="text-lg font-bold tracking-[-0.03em]">
                    Adicione o PDF
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Clique no botão "Adicionar PDF". O sistema aceita os dois
                    formatos: Reconhecimento Inicial, com CNIS e PRISMA, e
                    Revisão, com uma única coluna de valores.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-border bg-card/90 p-6 shadow-[0_18px_60px_-32px_rgba(13,74,134,0.42)] sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent font-mono text-sm font-bold text-primary dark:text-primary-foreground ">
                  03
                </span>
                <div>
                  <h2 className="text-lg font-bold tracking-[-0.03em]">
                    Aplique e copie
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Clique em "Aplicar B94+". Os resultados serão agrupados
                    por ano e mês. O sistema comparará os valores do PDF com os
                    do CONREAJ e exibirá os resultados. Clique em "Copiar
                    Valores" para copiar os dados e colá-los no PRISMA.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-border bg-card/90 p-6 shadow-[0_18px_60px_-32px_rgba(13,74,134,0.42)] sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent font-mono text-sm font-bold text-primary dark:text-primary-foreground  ">
                  04
                </span>
                <div>
                  <h2 className="text-lg font-bold tracking-[-0.03em]">
                    No PRISMA
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Cole os valores copiados no PRISMA. O sistema preencherá os
                    campos de acordo com o ano e mês, facilitando a conferência
                    e evitando erros de digitação.
                  </p>
                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-3 text-sm leading-5 text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <p>
                      Importante: não use Ctrl+V. No campo do PRISMA, clique com
                      o botão direito do mouse e selecione "Colar original".
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <div className="grid gap-3 pt-6 sm:grid-cols-2">
              <article className="rounded-xl border border-border bg-card/90 p-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="size-5 text-[#b36d00]" />
                  <h2 className="font-bold tracking-[-0.03em]">
                    Encontrou um erro?
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Envie uma mensagem informando o que aconteceu e, se possível,
                  anexe o PDF e uma imagem da tela.
                </p>
                <a
                  href="mailto:contato@fabriciomagoga.com.br?subject=Relato%20de%20erro%20no%20SAFIRA"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Mail className="size-4" />
                  reportar erro
                </a>
              </article>

              <article className="rounded-xl border border-border bg-card/90 p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  créditos
                </p>
                <h2 className="mt-4 text-xl font-bold tracking-[-0.04em]">
                  Fabrício Alves Magoga
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Desenvolvimento e manutenção do SAFIRA.
                </p>
                <a
                  href="mailto:contato@fabriciomagoga.com.br"
                  className="mt-5 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  contato@fabriciomagoga.com.br
                  <Mail className="size-4" />
                </a>
              </article>
            </div>
          </div>
        </section>
      </div>   
    </main>
  );
}
