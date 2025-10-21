export const MealLogs = ['Breakfast', 'Lunch', 'Dinner'] as const;
export type MealLog = typeof MealLogs[number];

export type ProductDetails = {
  productId: string;
  productName: string;
  productQuantity: number; // in grams
  productCalories: number; // per 100 grams
  productProtein: number; // per 100 grams
  productCarbohydrates: number; // per 100 grams
  productFat: number; // per 100 grams
};

