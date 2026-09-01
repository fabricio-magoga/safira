export type CellValue = number | string;

export type B94Block = {
  period: string;
  columns: number[];
  rows: Record<string, CellValue[]>;
};

export type ConreajIndex = Map<number, number>;
