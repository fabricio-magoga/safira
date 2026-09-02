"use client";

import * as DicaPrimitiva from "@radix-ui/react-tooltip";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export function DicaProvedor({
  delayDuration = 300,
  ...props
}: ComponentPropsWithoutRef<typeof DicaPrimitiva.Provider>) {
  return (
    <DicaPrimitiva.Provider delayDuration={delayDuration} {...props} />
  );
}

export const Dica = DicaPrimitiva.Root;
export const DicaGatilho = DicaPrimitiva.Trigger;

export function DicaConteudo({
  className,
  sideOffset = 6,
  ...props
}: ComponentPropsWithoutRef<typeof DicaPrimitiva.Content>) {
  return (
    <DicaPrimitiva.Portal>
      <DicaPrimitiva.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md",
          className,
        )}
        {...props}
      />
    </DicaPrimitiva.Portal>
  );
}
