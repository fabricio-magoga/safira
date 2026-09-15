import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { PainelDashboard } from "@/components/dashboard/painel-dashboard";
import { ConteudoPagina, PaginaBase } from "@/components/page-shell";
import { Botao } from "@/components/ui/button";
import { obterResumo } from "@/lib/dashboard/estatisticas";
import { NOME_COOKIE_SESSAO, extrairSessao } from "@/lib/dashboard/sessao";
import { encerrarSessao } from "./acoes";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | SAFIRA",
  description: "Painel de impacto do SAFIRA para validação institucional.",
};

export default async function PaginaDashboard() {
  const armazemDeCookies = await cookies();
  const sessao = extrairSessao(armazemDeCookies.get(NOME_COOKIE_SESSAO)?.value);

  if (!sessao) {
    redirect("/dashboard/acesso");
  }

  const resumo = obterResumo();

  return (
    <PaginaBase>
      <ConteudoPagina>
        <section className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                dashboard · acesso restrito
              </p>
              <h1 className="text-3xl font-black tracking-[-0.06em] sm:text-4xl">
                Painel de impacto
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Indicadores consolidados de uso do SAFIRA nesta execução, com
                atualização automática enquanto esta página permanece aberta.
              </p>
            </div>

            <form action={encerrarSessao}>
              <Botao
                type="submit"
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <LogOut className="size-4" />
                encerrar sessão
              </Botao>
            </form>
          </div>

          <PainelDashboard resumoInicial={resumo} />
        </section>
      </ConteudoPagina>
    </PaginaBase>
  );
}
