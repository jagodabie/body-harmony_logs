import type { MacroNutrients } from '../types/MealLogs';

export const calculateCalories = (
  nutritionPer100g: MacroNutrients | undefined,
  quantity: number
): number => {
  if (!nutritionPer100g || quantity <= 0) {
    return 0;
  }

  const ratio = quantity / 100;
  return Math.round(nutritionPer100g.calories * ratio);
};

export const calculateMacros = (
  nutritionPer100g: MacroNutrients | undefined,
  quantity: number
): MacroNutrients => {
  if (!nutritionPer100g || quantity <= 0) {
    return { calories: 0, proteins: 0, carbs: 0, fat: 0 };
  }

  const ratio = quantity / 100;

  return {
    calories: Math.round(nutritionPer100g.calories * ratio),
    proteins: Number((nutritionPer100g.proteins * ratio).toFixed(1)),
    carbs: Number((nutritionPer100g.carbs * ratio).toFixed(1)),
    fat: Number((nutritionPer100g.fat * ratio).toFixed(1)),
  };
};
