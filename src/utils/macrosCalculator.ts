import type { MacroNutrients } from '../types/MealLogs';

export const calculateCalories = (
  nutrientsPer100g: MacroNutrients | undefined,
  quantity: number
): number => {
  if (!nutrientsPer100g || quantity <= 0) {
    return 0;
  }

  const ratio = quantity / 100;
  return Math.round(nutrientsPer100g.calories * ratio);
};

export const calculateMacros = (
  nutrientsPer100g: MacroNutrients | undefined,
  quantity: number
): MacroNutrients => {
  if (!nutrientsPer100g || quantity <= 0) {
    return { calories: 0, proteins: 0, carbs: 0, fat: 0 };
  }

  const ratio = quantity / 100;

  return {
    calories: Math.round(nutrientsPer100g.calories * ratio),
    proteins: Number((nutrientsPer100g.proteins * ratio).toFixed(1)),
    carbs: Number((nutrientsPer100g.carbs * ratio).toFixed(1)),
    fat: Number((nutrientsPer100g.fat * ratio).toFixed(1)),
  };
};
