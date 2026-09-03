import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Cartao({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export const CLASSE_CARTAO_DESTAQUE =
  "rounded-xl border border-border bg-card/90 shadow-[0_18px_60px_-32px_rgba(13,74,134,0.42)]";

export function CartaoDestaque({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <article
      className={cn(CLASSE_CARTAO_DESTAQUE, "p-6", className)}
      {...props}
    />
  );
}

export function CartaoCabecalho({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  );
}

export function CartaoTitulo({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

export function CartaoConteudo({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}
