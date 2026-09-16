import type { Metadata } from "next";
import localFont from "next/font/local";
import { BatimentoCardiaco } from "@/components/dashboard/batimento-cardiaco";
import { ProvedorTema } from "@/components/theme-provider";
import "./globals.css";

const geistSans = localFont({
  src: "./fontes/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: false,
});

const geistMono = localFont({
  src: "./fontes/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "SAFIRA",
  description: "SAFIRA — ferramentas previdenciárias",
};

export default function LayoutRaiz({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              try {
                const theme = localStorage.getItem("theme") === "dark" ? "dark" : "light";
                document.documentElement.classList.remove("light", "dark");
                document.documentElement.classList.add(theme);
                document.documentElement.style.colorScheme = theme;
              } catch {}
            })();`,
          }}
        />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        <ProvedorTema>{children}</ProvedorTema>
        <BatimentoCardiaco />
      </body>
    </html>
  );
}
