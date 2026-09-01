"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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
