import Image from "next/image";
import Link from "next/link";
import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { SafiraWordmark } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

type AppHeaderProps = {
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
};

export function AppHeader({
  left,
  right = <ThemeToggle />,
  className = "",
}: AppHeaderProps) {
  return (
    <header
      className={`sticky top-0 z-20 mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between bg-transparent px-5 sm:px-8 ${className}`.trim()}
    >
      <div className="flex items-center gap-4">
        {left ?? defaultLeftContent()}
      </div>
      <div className="flex items-center gap-1">
        <Link href="/sobre" aria-label="Sobre o SAFIRA">
          <Button
            variant="ghost"
            size="icon"
            className="group size-10 border-0 bg-transparent p-0 hover:bg-transparent hover:text-foreground focus-visible:ring-0"
            aria-hidden="true"
            tabIndex={-1}
          >
            <Info className="size-5 transition-opacity duration-200 group-hover:opacity-60" />
          </Button>
        </Link>
        {right}
      </div>
    </header>
  );
}

function defaultLeftContent() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2 text-foreground no-underline"
      aria-label="SAFIRA"
    >
      <Image
        src="/safira.png"
        alt="SAFIRA"
        width={28}
        height={28}
        className="rounded-full object-cover shadow-[0_0_0_3px_var(--background)] transition-transform duration-300 group-hover:scale-110"
      />
      <SafiraWordmark />
    </Link>
  );
}
