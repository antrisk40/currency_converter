export interface ConversionEntry {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  result: string;
  timestamp: number;
}

export interface HistoryState {
  entries: ConversionEntry[];
}
