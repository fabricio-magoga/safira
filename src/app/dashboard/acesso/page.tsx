import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FormularioAcesso } from "@/components/dashboard/formulario-acesso";
import { ConteudoPagina, PaginaBase } from "@/components/page-shell";
import { CartaoDestaque } from "@/components/ui/card";
import { NOME_COOKIE_SESSAO, extrairSessao } from "@/lib/dashboard/sessao";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Acesso ao dashboard | SAFIRA",
  description:
    "Validação por token único para o painel de indicadores do SAFIRA.",
};

export default async function PaginaAcessoDashboard() {
  const armazemDeCookies = await cookies();

  if (extrairSessao(armazemDeCookies.get(NOME_COOKIE_SESSAO)?.value)) {
    redirect("/dashboard");
  }

  return (
    <PaginaBase>
      <ConteudoPagina className="flex min-h-[calc(100vh-72px)] items-start justify-center pb-10 pt-8 sm:pt-14">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-xs text-muted-foreground no-underline hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            voltar ao SAFIRA
          </Link>

          <CartaoDestaque className="p-6 sm:p-8">
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              acesso restrito
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-[-0.05em]">
              Painel de impacto
            </h1>

            <FormularioAcesso />
          </CartaoDestaque>
        </div>
      </ConteudoPagina>
    </PaginaBase>
  );
}
