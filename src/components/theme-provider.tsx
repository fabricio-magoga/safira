"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Tema = "light" | "dark";

type ValorContextoTema = {
  temaResolvido: Tema;
  montado: boolean;
  defTema: (tema: Tema) => void;
};

const ContextoTema = createContext<ValorContextoTema>({
  temaResolvido: "light",
  montado: false,
  defTema: () => {},
});

const inscreverMontagem = () => () => {};
const obterMontado = () => true;
const obterMontadoServidor = () => false;

export function ProvedorTema({ children }: { children: ReactNode }) {
  const [tema, defEstadoTema] = useState<Tema>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return window.localStorage.getItem("theme") === "dark" ? "dark" : "light";
  });
  const montado = useSyncExternalStore(
    inscreverMontagem,
    obterMontado,
    obterMontadoServidor,
  );

  useEffect(() => {
    const raiz = document.documentElement;

    raiz.classList.remove("light", "dark");
    raiz.classList.add(tema);
    raiz.style.colorScheme = tema;
    window.localStorage.setItem("theme", tema);
  }, [tema]);

  const defTema = (proximoTema: Tema) => {
    defEstadoTema(proximoTema);
  };

  return (
    <ContextoTema.Provider value={{ temaResolvido: tema, montado, defTema }}>
      {children}
    </ContextoTema.Provider>
  );
}

export function usarTema() {
  return useContext(ContextoTema);
}
