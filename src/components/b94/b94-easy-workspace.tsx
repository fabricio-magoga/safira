"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Check, Clipboard, FileUp, RotateCcw } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { B94Wordmark, SafiraWordmark } from "@/components/brand";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { copyBlockToExcel } from "@/lib/b94/copy";
import { getFirstConreajYear } from "@/lib/b94/conreaj";
import { formatDisplayValue } from "@/lib/b94/format";
import { useB94Store, type B94Block } from "@/store/b94-store";

export function B94EasyWorkspace() {
  const { conreajText, setConreajText, blocks, setBlocks, reset } =
    useB94Store();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alertType, setAlertType] = useState<"warning" | "error">("error");
  const [copiedPeriod, setCopiedPeriod] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!conreajText.trim()) {
      setAlertType("warning");
      setError("Insira os índices CONREAJ para continuar.");
      return;
    }
    if (!file) {
      setAlertType("warning");
      setError("Adicione um Resumo de Benefício para continuar.");
      return;
    }
    setLoading(true);
    setError("");
    setAlertType("error");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("conreaj_text", conreajText);

    try {
      const response = await fetch("/api/analyze-b94", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as {
        blocks?: B94Block[];
        error?: string;
      };
      if (!response.ok) {
        throw new Error(
          data.error ?? "Não foi possível analisar os documentos.",
        );
      }
      if (!data.blocks?.length) {
        setAlertType("warning");
        throw new Error("Nenhuma matriz foi encontrada no PDF.");
      }
      const startYear = getFirstConreajYear(conreajText);
      const filteredBlocks =
        startYear === null
          ? data.blocks
          : data.blocks
              .map((block) => {
                const indexes = block.columns
                  .map((year, index) => (year >= startYear ? index : -1))
                  .filter((index) => index >= 0);
                return {
                  ...block,
                  columns: indexes.map((index) => block.columns[index]),
                  rows: Object.fromEntries(
                    Object.entries(block.rows).map(([month, values]) => [
                      month,
                      indexes.map((index) => values[index] ?? 0),
                    ]),
                  ),
                };
              })
              .filter((block) => block.columns.length > 0);
      if (!filteredBlocks.length) {
        setAlertType("warning");
        throw new Error("O PDF não possui anos a partir do início do CONREAJ.");
      }
      setBlocks(filteredBlocks);
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? "Não foi possível conectar à API."
          : requestError instanceof Error
            ? requestError.message
            : "Erro ao processar documentos.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (block: B94Block) => {
    try {
      await copyBlockToExcel(block.rows, block.columns);
      setCopiedPeriod(block.period);
      window.setTimeout(() => setCopiedPeriod(null), 2500);
    } catch (copyError) {
      setAlertType("error");
      setError(
        copyError instanceof Error
          ? copyError.message
          : "Não foi possível copiar os valores.",
      );
    }
  };

  const valuesByYear = new Map<number, Record<string, number | string>>();
  blocks.forEach((block) => {
    block.columns.forEach((year, index) => {
      valuesByYear.set(
        year,
        Object.fromEntries(
          Object.entries(block.rows).map(([month, values]) => [
            month,
            values[index] ?? 0,
          ]),
        ),
      );
    });
  });

  const years = [...valuesByYear.keys()].sort(
    (firstYear, secondYear) => secondYear - firstYear,
  );
  const displayBlocks: B94Block[] = [];
  for (let index = 0; index < years.length; index += 5) {
    const columns = years.slice(index, index + 5);
    displayBlocks.push({
      period: `${columns[0]}/${columns[columns.length - 1]}`,
      columns,
      rows: Object.fromEntries(
        Object.keys(blocks[0]?.rows ?? {})
          .reverse()
          .map((month) => [
            month,
            columns.map((year) => valuesByYear.get(year)?.[month] ?? 0),
          ]),
      ),
    });
  }

  return (
    <TooltipProvider>
      <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
        <AppHeader
          left={
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-foreground no-underline"
                aria-label="Voltar ao SAFIRA"
              >
                <img
                  src="/safira.png"
                  alt="SAFIRA"
                  className="h-7 w-7 rounded-full object-cover shadow-[0_0_0_3px_var(--background)]"
                />
                <SafiraWordmark className="text-sm text-muted-foreground" />
              </Link>
              <button
                type="button"
                className="group flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-foreground"
                aria-label="Recarregar página"
                onClick={() => window.location.reload()}
              >
                <B94Wordmark />
              </button>
            </div>
          }
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
          {!blocks.length ? (
            <section className="mx-auto max-w-4xl">
              <div className="mb-12 max-w-xl">
                <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                  workspace
                </p>
                <h1 className="text-4xl font-black tracking-[-0.08em] sm:text-6xl">
                  <B94Wordmark className="text-4xl sm:text-6xl" />
                </h1>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="group relative rounded-xl border border-border bg-card/90 p-1 shadow-[0_22px_80px_-40px_rgba(13,74,134,0.42)] backdrop-blur-sm sm:row-span-2">
                  <Textarea
                    id="conreaj-text"
                    aria-label="Dados do CONREAJ"
                    placeholder="Copie e cole a tabela do CONREAJ aqui"
                    className="min-h-[375px] resize-none border-0 bg-transparent p-5 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60 sm:min-h-[178px]"
                    value={conreajText}
                    onChange={(event) => {
                      setConreajText(event.target.value);
                      setError("");
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
                    {file ? (
                      <Check className="size-5" />
                    ) : (
                      <FileUp className="size-5" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 overflow-hidden">
                    <strong className="block truncate text-sm font-medium text-foreground">
                      {file ? file.name : "Adicionar PDF"}
                    </strong>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {file ? "Pronto para análise" : "Resumo de Benefício"}
                    </span>
                  </span>
                  <input
                    className="hidden"
                    id="pdf-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => {
                      setFile(event.target.files?.[0] ?? null);
                      setError("");
                    }}
                  />
                </label>
                <Button
                  className="cursor-pointer border border-primary/20 bg-primary/90 px-3 font-bold text-primary-foreground opacity-95 transition-opacity hover:bg-primary/90 hover:opacity-95 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                  onClick={handleProcess}
                >
                  <span>
                    {loading ? "Processando dados" : "Aplicar B94 Easy"}
                  </span>
                </Button>
              </div>
              {error && (
                <Alert
                  variant={alertType === "warning" ? "warning" : "destructive"}
                  className="mt-4 flex items-center gap-2"
                >
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{error}</span>
                </Alert>
              )}
            </section>
          ) : (
            <section className="mx-auto max-w-5xl">
              <div className="mb-10 flex items-end justify-between gap-6">
                <div>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                    b94 / output
                  </p>
                  <h1 className="flex flex-wrap items-baseline gap-x-3 text-4xl font-black tracking-[-0.08em] sm:text-6xl">
                    <B94Wordmark className="text-4xl sm:text-6xl" />
                    <span>aplicado</span>
                  </h1>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    Nova consulta
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="group size-10 cursor-pointer border-0 bg-transparent p-0 hover:bg-transparent hover:text-foreground focus-visible:ring-0"
                        onClick={reset}
                        aria-label="Nova consulta"
                      >
                        <RotateCcw className="size-5 transition-opacity duration-200 group-hover:opacity-60" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Nova consulta</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="space-y-10">
                {displayBlocks.map((block) => (
                  <Card
                    key={block.period}
                    className="overflow-hidden rounded-xl border-border/60 bg-card/80 shadow-[0_20px_60px_-40px_rgba(13,74,134,0.28)]"
                  >
                    <CardHeader className="flex-row items-center justify-between space-y-0 px-5 py-4">
                      <CardTitle className="font-mono text-xs font-medium tracking-wider text-muted-foreground">
                        {block.period}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {copiedPeriod === block.period
                            ? "Valores copiados"
                            : "Copiar valores"}
                        </span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="group size-10 cursor-pointer border-0 bg-transparent p-0 hover:bg-transparent hover:text-foreground focus-visible:ring-0"
                              onClick={() => handleCopy(block)}
                              aria-label={
                                copiedPeriod === block.period
                                  ? "Valores copiados"
                                  : "Copiar valores"
                              }
                            >
                              {copiedPeriod === block.period ? (
                                <Check className="size-5 text-emerald-600" />
                              ) : (
                                <Clipboard className="size-5 transition-opacity duration-200 group-hover:opacity-60" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {copiedPeriod === block.period
                              ? "Valores copiados"
                              : "Copiar valores"}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </CardHeader>
                    <CardContent className="overflow-x-auto p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border/40 hover:bg-transparent">
                            <TableHead />
                            {block.columns.map((year) => (
                              <TableHead
                                key={year}
                                className="text-right font-mono text-[11px] text-primary"
                              >
                                {year}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(block.rows).map(([month, values]) => (
                            <TableRow key={month} className="border-border/30">
                              <TableHead className="font-mono text-xs font-medium text-muted-foreground">
                                {month}
                              </TableHead>
                              {values.map((value, index) => (
                                <TableCell
                                  key={`${month}-${index}`}
                                  className={`text-right font-mono text-xs ${typeof value === "string" ? "text-[#b36d00] dark:text-[#ffba4d]" : ""}`}
                                >
                                  {formatDisplayValue(value)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </TooltipProvider>
  );
}
