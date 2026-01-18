import { useMemo } from 'react';

import { DEFAULT_HEIGHT_CM } from '../constants';

interface UseWeightCalculationProps {
  weight: number;
  height?: number; // in cm
}

interface WeightCalculationResult {
  bmi: string;
  bmiCategory: string;
  isHealthyWeight: boolean;
}

const bmiStrategies = [
  { max: 18.5, category: 'Underweight', isHealthy: false },
  { max: 25, category: 'Normal', isHealthy: true },
  { max: 30, category: 'Overweight', isHealthy: false },
  { max: Infinity, category: 'Obesity', isHealthy: false },
];

export const useWeightCalculation = ({
  weight,
  height = DEFAULT_HEIGHT_CM,
}: UseWeightCalculationProps): WeightCalculationResult => {
  const calculation = useMemo(() => {
    // Convert height from cm to meters
    const heightInMeters = height / 100;

    // Calculate BMI
    const bmiValue = weight / (heightInMeters * heightInMeters);
    const bmi = bmiValue.toFixed(1);

    // Categorize BMI using strategy pattern
    const {
      category: bmiCategory = 'Unknown',
      isHealthy: isHealthyWeight = false,
    } = bmiStrategies.find(strategy => bmiValue < strategy.max) || {};

    return {
      bmi,
      bmiCategory,
      isHealthyWeight,
    };
  }, [weight, height]);

  return calculation;
};
