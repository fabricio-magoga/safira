import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Botao } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export const CLASSE_ICONE_INTERATIVO =
  "size-5 transition-opacity duration-200 group-hover:opacity-60";

export const BotaoIcone = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Botao
    ref={ref}
    variant="ghost"
    size="icon"
    className={cn(
      "group size-10 border-0 bg-transparent p-0 hover:bg-transparent hover:text-foreground focus-visible:ring-0",
      className,
    )}
    {...props}
  />
));

BotaoIcone.displayName = "BotaoIcone";
