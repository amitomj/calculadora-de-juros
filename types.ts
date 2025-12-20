
export enum InterestType {
  COMMERCIAL_3 = 'COMMERCIAL_3',
  COMMERCIAL_5 = 'COMMERCIAL_5',
  CIVIL = 'CIVIL',
  STATE = 'STATE'
}

export interface InterestRate {
  start: Date;
  end: Date | null;
  rate: number;
}

export interface Debt {
  id: string;
  value: number;
  dueDate: string;
}

export interface CalculationResult {
  debt: Debt;
  periods: InterestPeriodResult[];
  totalInterest: number;
  totalValue: number;
}

export interface InterestPeriodResult {
  start: Date;
  end: Date;
  rate: number;
  days: number;
  interest: number;
}

export interface DevaluationCoefficient {
  label: string;
  minYear?: number;
  maxYear?: number;
  value: number;
}
