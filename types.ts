
export type Unit = 'kg' | 'g';

export interface CalculationResult {
  id: string;
  weight: number;
  weightUnit: Unit;
  pricePerUnit: number;
  priceUnit: Unit;
  totalWeightGrams: number;
  totalWeightKg: number;
  totalAmount: number;
  timestamp: number;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}
