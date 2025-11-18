import { useCallback } from 'react';

import type { Nutriments } from '../../types/MealLogs';

type CalculatedMacros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type CalculateMacrosFunction = (
  nutriments: Nutriments | undefined,
  quantity: number
) => CalculatedMacros;

type CalculateCaloriesFunction = (
  nutriments: Nutriments | undefined,
  quantity: number
) => number;

type UseProductMacrosCalculatorReturn = {
  calculateMacros: CalculateMacrosFunction;
  calculateCalories: CalculateCaloriesFunction;
};

export const useProductMacrosCalculator = (): UseProductMacrosCalculatorReturn => {
  const calculateCalories = useCallback<CalculateCaloriesFunction>(
    (nutriments, quantity) => {
      if (!nutriments || quantity <= 0) {
        return 0;
      }

      const ratio = quantity / 100;
      return Math.round((nutriments['energy-kcal_100g'] ?? 0) * ratio);
    },
    []
  );

  const calculateMacros = useCallback<CalculateMacrosFunction>(
    (nutriments, quantity) => {
      if (!nutriments || quantity <= 0) {
        return {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };
      }

      // All nutriments are per 100g, so we calculate proportionally
      const ratio = quantity / 100;

      return {
        calories: Math.round((nutriments['energy-kcal_100g'] ?? 0) * ratio),
        protein: Number(((nutriments.proteins_100g ?? 0) * ratio).toFixed(1)),
        carbs: Number(
          ((nutriments.carbohydrates_100g ?? 0) * ratio).toFixed(1)
        ),
        fat: Number(((nutriments.fat_100g ?? 0) * ratio).toFixed(1)),
      };
    },
    []
  );

  return { calculateMacros, calculateCalories };
};
