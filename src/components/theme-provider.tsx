"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

type ThemeProviderProps = {
  children: ReactNode;
  attribute?: "class" | `data-${string}`;
  defaultTheme?: ThemePreference;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  value?: Partial<Record<Theme, string>>;
};

type ThemeContextValue = {
  theme: ThemePreference;
  resolvedTheme: Theme;
  mounted: boolean;
  setTheme: (theme: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "light",
  mounted: false,
  setTheme: () => {},
});

function resolveTheme(theme: ThemePreference, enableSystem: boolean): Theme {
  if (theme === "system" && enableSystem) {
    return typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return theme === "dark" ? "dark" : "light";
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  value,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemePreference>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const nextTheme =
      storedTheme === "light" ||
      storedTheme === "dark" ||
      storedTheme === "system"
        ? storedTheme
        : defaultTheme;

    setThemeState(nextTheme);
    setMounted(true);
  }, [defaultTheme]);

  const resolvedTheme = useMemo(
    () => resolveTheme(theme, enableSystem),
    [enableSystem, theme],
  );

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const root = document.documentElement;

    if (disableTransitionOnChange) {
      const disableTransition = () => {
        root.classList.add("theme-transition-disabled");
      };
      const enableTransition = () => {
        root.classList.remove("theme-transition-disabled");
      };

      disableTransition();
      requestAnimationFrame(enableTransition);
    }

    if (attribute === "class") {
      root.classList.remove("light", "dark");
      root.classList.add(resolvedTheme);
    } else {
      const attributeName = attribute;
      const attributeValue = value?.[resolvedTheme] ?? resolvedTheme;
      root.setAttribute(attributeName, attributeValue);
    }

    root.style.colorScheme = resolvedTheme;
    window.localStorage.setItem("theme", theme);
  }, [
    attribute,
    disableTransitionOnChange,
    mounted,
    resolvedTheme,
    theme,
    value,
  ]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const nextResolvedTheme = resolveTheme("system", enableSystem);
        const root = document.documentElement;

        if (attribute === "class") {
          root.classList.remove("light", "dark");
          root.classList.add(nextResolvedTheme);
        } else {
          const attributeName = attribute;
          const attributeValue =
            value?.[nextResolvedTheme] ?? nextResolvedTheme;
          root.setAttribute(attributeName, attributeValue);
        }

        root.style.colorScheme = nextResolvedTheme;
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [attribute, enableSystem, mounted, theme, value]);

  const setTheme = (nextTheme: ThemePreference) => {
    setThemeState(nextTheme);
  };

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      mounted,
      setTheme,
    }),
    [mounted, resolvedTheme, theme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
