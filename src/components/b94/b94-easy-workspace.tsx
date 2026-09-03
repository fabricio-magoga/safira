"use client";

import { useState } from "react";
import {
  AlertCircle,
  Check,
  Clipboard,
  ExternalLink,
  FileUp,
  RotateCcw,
} from "lucide-react";
import { Cabecalho } from "@/components/app-header";
import { ConteudoPagina, PaginaBase } from "@/components/page-shell";
import { Alerta } from "@/components/ui/alert";
import { Botao } from "@/components/ui/button";
import { BotaoIcone, CLASSE_ICONE_INTERATIVO } from "@/components/ui/icon-button";
import { Cartao, CartaoConteudo, CartaoCabecalho, CartaoTitulo } from "@/components/ui/card";
import {
  Tabela,
  TabelaCorpo,
  TabelaCelula,
  TabelaCelulaCab,
  TabelaCabecalho,
  TabelaLinha,
} from "@/components/ui/table";
import { AreaTexto } from "@/components/ui/textarea";
import { B94Logotipo, SafiraLink } from "@/components/brand";
import {
  Dica,
  DicaConteudo,
  DicaProvedor,
  DicaGatilho,
} from "@/components/ui/tooltip";
import { montarBlocos } from "@/lib/b94/blocos";
import { copiarBloco } from "@/lib/b94/copy";
import { obterPrimeiroAnoConreaj } from "@/lib/b94/conreaj";
import { formatarExibicao } from "@/lib/b94/format";
import { usarStoreB94, type BlocoB94 } from "@/store/b94-store";

export function B94EasyAreaTrabalho() {
  const { textoConreaj, defTextoConreaj, blocos, defBlocos, resetar } =
    usarStoreB94();
  const [arquivo, defArquivo] = useState<File | null>(null);
  const [carregando, defCarregando] = useState(false);
  const [erro, defErro] = useState("");
  const [tipoAlerta, defTipoAlerta] = useState<"warning" | "error">("error");
  const [periodoCopiado, defPeriodoCopiado] = useState<string | null>(null);

  const processar = async () => {
    if (!textoConreaj.trim()) {
      defTipoAlerta("warning");
      defErro("Insira os índices CONREAJ para continuar.");
      return;
    }
    if (!arquivo) {
      defTipoAlerta("warning");
      defErro("Adicione um Resumo de Benefício para continuar.");
      return;
    }
    defCarregando(true);
    defErro("");
    defTipoAlerta("error");
    const formData = new FormData();
    formData.append("file", arquivo);
    formData.append("conreaj_text", textoConreaj);

    try {
      const resposta = await fetch("/api/analyze-b94", {
        method: "POST",
        body: formData,
      });
      const dados = (await resposta.json()) as {
        blocks?: BlocoB94[];
        error?: string;
      };
      if (!resposta.ok) {
        throw new Error(
          dados.error ?? "Não foi possível analisar os documentos.",
        );
      }
      if (!dados.blocks?.length) {
        defTipoAlerta("warning");
        throw new Error("Nenhuma matriz foi encontrada no PDF.");
      }
      const anoInicio = obterPrimeiroAnoConreaj(textoConreaj);
      const blocosFiltrados =
        anoInicio === null
          ? dados.blocks
          : dados.blocks
              .map((bloco) => {
                const indices = bloco.colunas
                  .map((ano, idx) => (ano >= anoInicio ? idx : -1))
                  .filter((idx) => idx >= 0);
                return {
                  ...bloco,
                  colunas: indices.map((idx) => bloco.colunas[idx]),
                  linhas: Object.fromEntries(
                    Object.entries(bloco.linhas).map(([mes, valores]) => [
                      mes,
                      indices.map((idx) => valores[idx] ?? 0),
                    ]),
                  ),
                };
              })
              .filter((bloco) => bloco.colunas.length > 0);
      if (!blocosFiltrados.length) {
        defTipoAlerta("warning");
        throw new Error("O PDF não possui anos a partir do início do CONREAJ.");
      }
      defBlocos(blocosFiltrados);
    } catch (erroReq) {
      defErro(
        erroReq instanceof TypeError
          ? "Não foi possível conectar à API."
          : erroReq instanceof Error
            ? erroReq.message
            : "Erro ao processar documentos.",
      );
    } finally {
      defCarregando(false);
    }
  };

  const copiar = async (bloco: BlocoB94) => {
    try {
      await copiarBloco(bloco.linhas, bloco.colunas);
      defPeriodoCopiado(bloco.periodo);
      window.setTimeout(() => defPeriodoCopiado(null), 2500);
    } catch (erroCopia) {
      defTipoAlerta("error");
      defErro(
        erroCopia instanceof Error
          ? erroCopia.message
          : "Não foi possível copiar os valores.",
      );
    }
  };

  const valoresPorAno = new Map<number, Record<string, number | string>>();
  blocos.forEach((bloco) => {
    bloco.colunas.forEach((ano, idx) => {
      valoresPorAno.set(
        ano,
        Object.fromEntries(
          Object.entries(bloco.linhas).map(([mes, valores]) => [
            mes,
            valores[idx] ?? 0,
          ]),
        ),
      );
    });
  });

  const anos = [...valoresPorAno.keys()].sort((a, b) => b - a);
  const mesesExibicao = Object.keys(blocos[0]?.linhas ?? {}).reverse();
  const blocosExibicao = montarBlocos(
    anos,
    mesesExibicao,
    (mes, ano) => valoresPorAno.get(ano)?.[mes] ?? 0,
    "/",
  );

  const cabecalho = (
    <Cabecalho
      esquerda={
        <>
          <SafiraLink
            ariaLabel="Voltar ao SAFIRA"
            classeLogotipo="text-sm text-muted-foreground"
            animado={false}
          />
          <button
            type="button"
            className="group flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-foreground"
            aria-label="Recarregar página"
            onClick={() => window.location.reload()}
          >
            <B94Logotipo />
          </button>
        </>
      }
    />
  );

  return (
    <DicaProvedor>
      <PaginaBase cabecalho={cabecalho}>
        <ConteudoPagina>
          {!blocos.length ? (
            <section className="mx-auto max-w-4xl">
              <div className="mb-12 max-w-xl">
                <a
                  href="https://sibe.inss.gov.br/"
                  target="_blank"
                  rel="noreferrer"
                  className="mb-5 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
                >
                  acessar sibe
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
                <h1 className="text-4xl font-black tracking-[-0.08em] sm:text-6xl">
                  <B94Logotipo className="text-4xl sm:text-6xl" />
                </h1>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="group relative rounded-xl border border-border bg-card/90 p-1 shadow-[0_22px_80px_-40px_rgba(13,74,134,0.42)] backdrop-blur-sm sm:row-span-2">
                  <AreaTexto
                    id="conreaj-text"
                    aria-label="Dados do CONREAJ"
                    placeholder="Copie e cole a tabela do CONREAJ aqui"
                    className="min-h-[375px] resize-none border-0 bg-transparent p-5 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60 sm:min-h-[178px]"
                    value={textoConreaj}
                    onChange={(evento) => {
                      defTextoConreaj(evento.target.value);
                      defErro("");
                    }}
                  />
                  <span className="pointer-events-none absolute bottom-4 right-5 font-mono text-[10px] text-muted-foreground/70">
                    CONREAJ / TXT
                  </span>
                </div>
                <label
                  htmlFor="pdf-upload"
                  className="group flex min-h-[178px] w-full max-w-full cursor-pointer items-center gap-4 overflow-hidden rounded-xl border border-dashed border-border bg-card/90 px-5 hover:border-primary/40 hover:bg-card"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground transition-opacity group-hover:opacity-80">
                    {arquivo ? (
                      <Check className="size-5" />
                    ) : (
                      <FileUp className="size-5" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 overflow-hidden">
                    <strong className="block truncate text-sm font-medium text-foreground">
                      {arquivo ? arquivo.name : "Adicionar PDF"}
                    </strong>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {arquivo ? "Pronto para análise" : "Resumo de Benefício"}
                    </span>
                  </span>
                  <input
                    className="hidden"
                    id="pdf-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={(evento) => {
                      defArquivo(evento.target.files?.[0] ?? null);
                      defErro("");
                    }}
                  />
                </label>
                <Botao
                  className="cursor-pointer border border-primary/20 bg-primary/90 px-3 font-bold text-primary-foreground opacity-95 transition-opacity hover:bg-primary/90 hover:opacity-95 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={carregando}
                  onClick={processar}
                >
                  <span>
                    {carregando ? "Processando dados" : "Aplicar B94+"}
                  </span>
                </Botao>
              </div>
              {erro && (
                <Alerta
                  variant={tipoAlerta === "warning" ? "warning" : "destructive"}
                  className="mt-4 flex items-center gap-2"
                >
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{erro}</span>
                </Alerta>
              )}
            </section>
          ) : (
            <section className="mx-auto max-w-5xl">
              <div className="mb-10 flex items-end justify-between gap-6">
                <div>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                    b94 / resultados
                  </p>
                  <h1 className="flex flex-wrap items-baseline gap-x-3 text-4xl font-black tracking-[-0.08em] sm:text-6xl">
                    <B94Logotipo className="text-4xl sm:text-6xl" />
                    <span>aplicado</span>
                  </h1>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    Nova consulta
                  </span>
                  <Dica>
                    <DicaGatilho asChild>
                      <BotaoIcone
                        className="cursor-pointer"
                        onClick={resetar}
                        aria-label="Nova consulta"
                      >
                        <RotateCcw className={CLASSE_ICONE_INTERATIVO} />
                      </BotaoIcone>
                    </DicaGatilho>
                    <DicaConteudo>Nova consulta</DicaConteudo>
                  </Dica>
                </div>
              </div>
              <div className="space-y-10">
                {blocosExibicao.map((bloco) => {
                  const copiado = periodoCopiado === bloco.periodo;
                  const rotuloCopia = copiado
                    ? "Valores copiados"
                    : "Copiar valores";
                  return (
                  <Cartao
                    key={bloco.periodo}
                    className="overflow-hidden rounded-xl border-border/60 bg-card/80 shadow-[0_20px_60px_-40px_rgba(13,74,134,0.28)]"
                  >
                    <CartaoCabecalho className="flex-row items-center justify-between space-y-0 px-5 py-4">
                      <CartaoTitulo className="font-mono text-xs font-medium tracking-wider text-muted-foreground">
                        {bloco.periodo}
                      </CartaoTitulo>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {rotuloCopia}
                        </span>
                        <Dica>
                          <DicaGatilho asChild>
                            <BotaoIcone
                              className="cursor-pointer"
                              onClick={() => copiar(bloco)}
                              aria-label={rotuloCopia}
                            >
                              {copiado ? (
                                <Check className="size-5 text-emerald-600" />
                              ) : (
                                <Clipboard className={CLASSE_ICONE_INTERATIVO} />
                              )}
                            </BotaoIcone>
                          </DicaGatilho>
                          <DicaConteudo>{rotuloCopia}</DicaConteudo>
                        </Dica>
                      </div>
                    </CartaoCabecalho>
                    <CartaoConteudo className="overflow-x-auto p-0">
                      <Tabela>
                        <TabelaCabecalho>
                          <TabelaLinha className="border-border/40 hover:bg-transparent">
                            <TabelaCelulaCab />
                            {bloco.colunas.map((ano) => (
                              <TabelaCelulaCab
                                key={ano}
                                className="text-right font-mono text-xs font-medium text-muted-foreground"
                              >
                                {ano}
                              </TabelaCelulaCab>
                            ))}
                          </TabelaLinha>
                        </TabelaCabecalho>
                        <TabelaCorpo>
                          {Object.entries(bloco.linhas).map(([mes, valores]) => (
                            <TabelaLinha key={mes} className="border-border/30">
                              <TabelaCelulaCab className="font-mono text-xs font-medium text-muted-foreground">
                                {mes}
                              </TabelaCelulaCab>
                              {valores.map((valor, idx) => (
                                <TabelaCelula
                                  key={`${mes}-${idx}`}
                                  className={`text-right font-mono text-xs ${typeof valor === "string" ? "text-[#b36d00] dark:text-[#ffba4d]" : ""}`}
                                >
                                  {formatarExibicao(valor)}
                                </TabelaCelula>
                              ))}
                            </TabelaLinha>
                          ))}
                        </TabelaCorpo>
                      </Tabela>
                    </CartaoConteudo>
                  </Cartao>
                  );
                })}
              </div>
            </section>
          )}
        </ConteudoPagina>
      </PaginaBase>
    </DicaProvedor>
  );
}
