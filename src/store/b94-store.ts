import { create } from "zustand";
import type { B94Block } from "@/lib/b94/types";

export type { B94Block };

type B94State = {
  conreajText: string;
  setConreajText: (text: string) => void;
  blocks: B94Block[];
  setBlocks: (blocks: B94Block[]) => void;
  reset: () => void;
};

export const useB94Store = create<B94State>((set) => ({
  conreajText: "",
  setConreajText: (conreajText) => set({ conreajText }),
  blocks: [],
  setBlocks: (blocks) => set({ blocks }),
  reset: () => set({ conreajText: "", blocks: [] }),
}));
