import { type Meal as MealType, type MealLog, MealLogs } from '../../../../types/MealLogs';

export const formatDateString = (date: Date): string =>
    date.toISOString().split('T')[0];

export const calculateMealTotals = (products: MealType['products']) => {
    return products.reduce(
      (acc, product) => {
        const multiplier = product.quantity / 100;
        const nutriments = product.productCode.nutriments;
        acc.calories += (nutriments['energy-kcal_100g'] || 0) * multiplier;
        acc.protein += (nutriments.proteins_100g || 0) * multiplier;
        acc.carbs += (nutriments.carbohydrates_100g || 0) * multiplier;
        acc.fat += (nutriments.fat_100g || 0) * multiplier;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };


//   TODO :We need a function that allows us to have cases where we have multiple meals, 
//   then we need to add all the individual mealTypes from MealLogs to meals we want all meals to be displayed, 

export const prepareMeals = (meals: MealType[], date: string) => {
  if (meals.length > 0) {
    // TODO: Do scenario when we will have multiple meals for a given handling from the backend
    return [];
  }

  const defaultTimes: Record<MealLog, string> = {
    BREAKFAST: '10:00',
    LUNCH: '14:00',
    DINNER: '18:00',
    SNACK: '16:00',
  };

  return MealLogs.map((mealType: MealLog) => ({
    _id: `${mealType}-default`,
    mealType,
    products: [],
    name: mealType,
    date: `${date}T00:00:00.000Z`,
    time: defaultTimes[mealType],
    notes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};