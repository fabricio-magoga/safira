import { create } from "zustand";
import type { BlocoB94 } from "@/lib/b94/types";

export type { BlocoB94 };

type EstadoB94 = {
  textoConreaj: string;
  defTextoConreaj: (texto: string) => void;
  blocos: BlocoB94[];
  defBlocos: (blocos: BlocoB94[]) => void;
  resetar: () => void;
};

export const usarStoreB94 = create<EstadoB94>((set) => ({
  textoConreaj: "",
  defTextoConreaj: (textoConreaj) => set({ textoConreaj }),
  blocos: [],
  defBlocos: (blocos) => set({ blocos }),
  resetar: () => set({ textoConreaj: "", blocos: [] }),
}));
