import type { HTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Tabela({
  className,
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  );
}

export function TabelaCabecalho({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}

export function TabelaCorpo({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  );
}

export function TabelaLinha({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn("border-b hover:bg-muted/50", className)} {...props} />
  );
}

export function TabelaCelulaCab({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

export function TabelaCelula({
  className,
  ...props
}: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}
