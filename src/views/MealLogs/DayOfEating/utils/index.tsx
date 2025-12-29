import { type Meal as MealType, type MealLog, MealLogs } from '../../../../types/MealLogs';

export const formatDateString = (date: Date): string =>
    date.toISOString().split('T')[0];

export const prepareMeals = (meals: MealType[], date: string): MealType[] => {
  const defaultTimes: Record<MealLog, string> = {
    BREAKFAST: '10:00',
    LUNCH: '14:00',
    DINNER: '18:00',
    SNACK: '16:00',
  };

  return MealLogs.map((mealType: MealLog) => {
    const existingMeal = meals.find(meal => meal.mealType === mealType);
    if (existingMeal) {
      return existingMeal;
    }

    return {
      _id: `${mealType}-${date}-temp`,
      mealType,
      products: [],
      name: mealType,
      date: `${date}T00:00:00.000Z`,
      time: defaultTimes[mealType],
      notes: null,
      macros: { calories: 0, proteins: 0, carbs: 0, fat: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
};