import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const variantesAlerta = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-[var(--error-border)] bg-[var(--error-bg)] text-[var(--error-text)]",
        warning:
          "border-[var(--warning-border)] bg-[var(--warning-bg)] text-[var(--warning-text)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type PropsAlerta = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof variantesAlerta>;

export function Alerta({ className, variant, ...props }: PropsAlerta) {
  return (
    <div
      role="alert"
      className={cn(variantesAlerta({ variant }), className)}
      {...props}
    />
  );
}
