export type ValorCelula = number | string;

export type BlocoB94 = {
  periodo: string;
  colunas: number[];
  linhas: Record<string, ValorCelula[]>;
};

export type IndiceConreaj = Map<number, number>;
