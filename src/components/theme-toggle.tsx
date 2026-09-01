"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { mounted, resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="group size-10 border-0 bg-transparent p-0 hover:bg-transparent hover:text-foreground focus-visible:ring-0"
        aria-label="Carregando tema"
      >
        <Sun className="size-5 opacity-50" strokeWidth={2.2} />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="group size-10 border-0 bg-transparent p-0 hover:bg-transparent hover:text-foreground focus-visible:ring-0"
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Sun
          className="size-5 transition-opacity duration-200 group-hover:opacity-60"
          strokeWidth={2.2}
        />
      ) : (
        <Moon
          className="size-5 transition-opacity duration-200 group-hover:opacity-60"
          strokeWidth={2.2}
        />
      )}
    </Button>
  );
}
