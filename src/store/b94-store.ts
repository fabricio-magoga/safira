import { create } from "zustand";
import type { BlocoB94 } from "@/lib/b94/types";

export type { BlocoB94 };

export type ItemSalarioMinimo = {
  data: string; // Ex: "01/01/2026"
  valor: string; // Ex: "1518.00"
};

type EstadoB94 = {
  textoConreaj: string;
  defTextoConreaj: (texto: string) => void;
  blocos: BlocoB94[];
  defBlocos: (blocos: BlocoB94[]) => void;
  salariosMinimos: ItemSalarioMinimo[];
  defSalariosMinimos: (salarios: ItemSalarioMinimo[]) => void;
  resetar: () => void;
};

export const usarStoreB94 = create<EstadoB94>((set) => ({
  textoConreaj: "",
  defTextoConreaj: (textoConreaj) => set({ textoConreaj }),
  blocos: [],
  defBlocos: (blocos) => set({ blocos }),
  salariosMinimos: [],
  defSalariosMinimos: (salariosMinimos) => set({ salariosMinimos }),
  resetar: () => set({ textoConreaj: "", blocos: [] }),
}));
