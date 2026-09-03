import Link from "next/link";
import type { ReactNode } from "react";
import { AlertTriangle, ArrowLeft, ExternalLink, Mail } from "lucide-react";
import { B94Logotipo, SafiraLogotipo } from "@/components/brand";
import { ConteudoPagina, PaginaBase } from "@/components/page-shell";
import { CartaoDestaque } from "@/components/ui/card";

export const metadata = {
  title: "Sobre | SAFIRA",
  description: "Sobre o SAFIRA.",
};

const EMAIL_CONTATO = "contato@fabriciomagoga.com.br";

type Passo = {
  titulo: string;
  descricao: string;
  aviso?: string;
};

const PASSOS: Passo[] = [
  {
    titulo: "Copie e Cole a tela do CONREAJ",
    descricao:
      "No SIBE, abra o relatório do CONREAJ e pressione Ctrl+A para selecionar a tela inteira, depois Ctrl+C para copiar. Vá para a tela do B94+ e cole o texto normalmente no campo indicado. O sistema extrairá automaticamente os dados do beneficiário e os índices de reajuste.",
  },
  {
    titulo: "Adicione o PDF",
    descricao:
      'Clique no botão "Adicionar PDF". O sistema aceita os dois formatos: Reconhecimento Inicial, com CNIS e PRISMA, e Revisão, com uma única coluna de valores.',
  },
  {
    titulo: "Aplique e copie",
    descricao:
      'Clique em "Aplicar B94+". Os resultados serão agrupados por ano e mês. O sistema comparará os valores do PDF com os do CONREAJ e exibirá os resultados. Clique em "Copiar Valores" para copiar os dados e colá-los no PRISMA.',
  },
  {
    titulo: "No PRISMA",
    descricao:
      "Cole os valores copiados no PRISMA. O sistema preencherá os campos de acordo com o ano e mês, facilitando a conferência e evitando erros de digitação.",
    aviso:
      'Importante: não use Ctrl+V. No campo do PRISMA, clique com o botão direito do mouse e selecione "Colar original".',
  },
];

function PassoGuia({ numero, passo }: { numero: number; passo: Passo }) {
  return (
    <CartaoDestaque className="sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent font-mono text-sm font-bold text-primary dark:text-primary-foreground">
          {String(numero).padStart(2, "0")}
        </span>
        <div>
          <h2 className="text-lg font-bold tracking-[-0.03em]">
            {passo.titulo}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {passo.descricao}
          </p>
          {passo.aviso && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-3 text-sm leading-5 text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <p>{passo.aviso}</p>
            </div>
          )}
        </div>
      </div>
    </CartaoDestaque>
  );
}

function LinkContato({
  href,
  children,
  externo = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  externo?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(externo && { target: "_blank", rel: "noopener noreferrer" })}
      className={`inline-flex items-center gap-2 text-sm text-primary hover:underline ${className}`.trim()}
    >
      {children}
    </a>
  );
}

export default function PaginaSobre() {
  return (
    <PaginaBase>
      <ConteudoPagina>
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
              sobre
            </p>
            <h1 className="text-4xl font-black tracking-[-0.08em] sm:text-6xl">
              <SafiraLogotipo className="text-4xl sm:text-6xl" />
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
              Sistema de Análise Facilitada de Informações e Requerimentos
              Assistenciais. O SAFIRA reúne módulos especializados para agilizar
              tarefas do dia a dia da análise de benefícios.
            </p>
          </div>

          <div className="mb-12 max-w-2xl">
            <p className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              guia rápido
            </p>
            <h2 className="text-2xl font-black tracking-[-0.05em] sm:text-3xl">
              Como usar o{" "}
              <B94Logotipo className="inline text-2xl sm:text-3xl" />
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Organize os dados do CONREAJ e extraia os valores PRISMA do PDF em
              poucos passos.
            </p>
          </div>

          <div className="space-y-3">
            {PASSOS.map((passo, indice) => (
              <PassoGuia key={passo.titulo} numero={indice + 1} passo={passo} />
            ))}

            <div className="grid gap-3 pt-6 sm:grid-cols-2">
              <CartaoDestaque className="shadow-none">
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
                <LinkContato
                  href={`mailto:${EMAIL_CONTATO}?subject=Relato%20de%20erro%20no%20SAFIRA`}
                  className="mt-5 font-medium"
                >
                  <Mail className="size-4" />
                  reportar erro
                </LinkContato>
              </CartaoDestaque>

              <CartaoDestaque className="shadow-none">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  créditos
                </p>
                <h2 className="mt-4 text-xl font-bold tracking-[-0.04em]">
                  Fabrício Alves Magoga
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Desenvolvimento e manutenção do SAFIRA.
                </p>
                <LinkContato href={`mailto:${EMAIL_CONTATO}`} className="mt-5">
                  {EMAIL_CONTATO}
                  <Mail className="size-4" />
                </LinkContato>
                <LinkContato
                  href="https://fabriciomagoga.com.br"
                  externo
                  className="mt-2"
                >
                  fabriciomagoga.com.br
                  <ExternalLink className="size-4" />
                </LinkContato>
              </CartaoDestaque>
            </div>
          </div>
        </section>
      </ConteudoPagina>
    </PaginaBase>
  );
}
