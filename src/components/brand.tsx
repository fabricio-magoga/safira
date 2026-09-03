import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

const estiloLogotipo = {
  fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
} as const;

type PropsSafiraLink = {
  ariaLabel?: string;
  classeLogotipo?: string;
  animado?: boolean;
};

export function SafiraLink({
  ariaLabel = "SAFIRA",
  classeLogotipo,
  animado = true,
}: PropsSafiraLink) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2 text-foreground no-underline"
      aria-label={ariaLabel}
    >
      <Image
        src="/safira.png"
        alt="SAFIRA"
        width={28}
        height={28}
        className={cn(
          "rounded-full object-cover shadow-[0_0_0_3px_var(--background)]",
          animado && "transition-transform duration-300 group-hover:scale-110",
        )}
      />
      <SafiraLogotipo className={classeLogotipo} />
    </Link>
  );
}

export function B94Logotipo({ className = "text-lg" }: { className?: string }) {
  return (
    <span
      className={`flex items-baseline tracking-[-0.06em] ${className}`}
      style={estiloLogotipo}
    >
      <span className="leading-none text-[#0F52BA]">b</span>
      <span className="leading-none text-[#f3c75b]">9</span>
      <span className="leading-none text-[#2a9d5d]">4</span>
      <span className="ml-1 leading-none text-[#0F52BA]">+</span>
    </span>
  );
}

export function SafiraLogotipo({
  className = "text-lg",
}: {
  className?: string;
}) {
  return (
    <span
      className={`tracking-[-0.08em] text-primary ${className}`}
      style={estiloLogotipo}
    >
      SAFIRA
    </span>
  );
}
