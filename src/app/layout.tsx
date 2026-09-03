import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ProvedorTema } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      </body>
    </html>
  );
}
