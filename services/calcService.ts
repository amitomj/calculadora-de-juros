
import { 
  InterestType, 
  InterestRate, 
  Debt, 
  CalculationResult, 
  InterestPeriodResult 
} from '../types';
import { DEVALUATION_COEFFICIENTS, INTEREST_RATES } from '../constants';

export const getDevaluationCoefficient = (year: number): number => {
  if (year < 1903) return 4631.11;
  if (year > 2015) return 1.00;

  const found = DEVALUATION_COEFFICIENTS.find(c => {
    const min = c.minYear ?? -Infinity;
    const max = c.maxYear ?? Infinity;
    return year >= min && year <= max;
  });

  return found ? found.value : 1.00;
};

export const calculateInterestForDebt = (
  debt: Debt,
  endDateStr: string,
  type: InterestType
): CalculationResult => {
  const startDate = new Date(debt.dueDate);
  const endDate = new Date(endDateStr);
  const rates = INTEREST_RATES[type];
  
  const periods: InterestPeriodResult[] = [];
  
  if (startDate >= endDate) {
    return {
      debt,
      periods: [],
      totalInterest: 0,
      totalValue: debt.value
    };
  }

  // Iterate through historical rates to find matching segments
  rates.forEach((rateInfo, index) => {
    const rateStart = rateInfo.start;
    // If it's the last rate, it applies indefinitely
    const rateEnd = rateInfo.end || new Date(8640000000000000); // Max date

    // Find the overlap between [startDate, endDate] and [rateStart, rateEnd]
    const segmentStart = new Date(Math.max(startDate.getTime(), rateStart.getTime()));
    const segmentEnd = new Date(Math.min(endDate.getTime(), rateEnd.getTime()));

    if (segmentStart < segmentEnd) {
      const diffTime = Math.abs(segmentEnd.getTime() - segmentStart.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const interest = (debt.value * (rateInfo.rate / 100) / 365) * diffDays;
      
      periods.push({
        start: segmentStart,
        end: segmentEnd,
        rate: rateInfo.rate,
        days: diffDays,
        interest: Number(interest.toFixed(2))
      });
    }
  });

  // Handle period after the last known rate if calculation date is further
  const lastKnownRate = rates[rates.length - 1];
  if (lastKnownRate.end && endDate > lastKnownRate.end && startDate < endDate) {
    const segmentStart = new Date(Math.max(startDate.getTime(), lastKnownRate.end.getTime() + 86400000)); // +1 day
    if (segmentStart < endDate) {
       const diffTime = Math.abs(endDate.getTime() - segmentStart.getTime());
       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
       const interest = (debt.value * (lastKnownRate.rate / 100) / 365) * diffDays;
       periods.push({
          start: segmentStart,
          end: endDate,
          rate: lastKnownRate.rate,
          days: diffDays,
          interest: Number(interest.toFixed(2))
       });
    }
  }

  const totalInterest = periods.reduce((sum, p) => sum + p.interest, 0);
  
  return {
    debt,
    periods,
    totalInterest: Number(totalInterest.toFixed(2)),
    totalValue: Number((debt.value + totalInterest).toFixed(2))
  };
};
