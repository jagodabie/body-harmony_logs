import type {
  NutrimentsPer100g,
  NutrimentsPerQuantity,
} from '../types/MealLogs';

export type CalculatedMacros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export const calculateCalories = (
  nutriments: NutrimentsPer100g | undefined,
  quantity: number
): number => {
  if (!nutriments || quantity <= 0) {
    return 0;
  }

  const ratio = quantity / 100;
  return Math.round((nutriments['energy-kcal_100g'] ?? 0) * ratio);
};

export const calculateMacros = (
  nutriments: NutrimentsPer100g | undefined,
  quantity: number
): NutrimentsPerQuantity => {
  if (!nutriments || quantity <= 0) {
    return {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fat: 0,
    };
  }

  const ratio = quantity / 100;

  return {
    calories: Math.round((nutriments['energy-kcal_100g'] ?? 0) * ratio),
    proteins: Number(((nutriments.proteins_100g ?? 0) * ratio).toFixed(1)),
    carbs: Number(((nutriments.carbohydrates_100g ?? 0) * ratio).toFixed(1)),
    fat: Number(((nutriments.fat_100g ?? 0) * ratio).toFixed(1)),
  };
};

// Convert product details to products macros
export const convertProductDetailsToProductsMacros = () => {};
