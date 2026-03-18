export const MealLogs = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const;
export type MealLog = (typeof MealLogs)[number];

export type MacroNutrients = {
  calories: number;
  proteins: number;
  carbs: number;
  fat: number;
};

export type ProductNutriments = {
  'energy-kcal_100g': number;
  proteins_100g: number;
  fat_100g: number;
  'saturated-fat_100g': number;
  carbohydrates_100g: number;
  sugars_100g: number;
  salt_100g: number;
};

export type ProductByCodeApiResponse = {
  _id: string;
  code: string;
  name: string;
  brands: string;
  countries_tags: string[];
  nutriscore: string;
  allergens: string[];
  updatedAt?: string | null;
  nutriments: ProductNutriments;
};

export type ProductDetails = {
  id: string;
  mealId: string;
  code: string;
  name: string;
  nutrientsPer100g: MacroNutrients;
  brands: string;
  quantity: number;
  unit: string;
};

export interface ProductDetailsBody {
  productCode: string;
  quantity: number;
  unit?: string;
}

export type ProductDetailsResponseBody = Omit<ProductDetails, 'code'> & {
  productCode: string;
};

// Frontend meal input type
export type MealInput = {
  id: string;
  name: string;
  mealType: MealLog;
  date: string;
  time: string;
};

// Backend meal type with full data
export type Meal = {
  id: string;
  name: string;
  mealType: MealLog;
  date: string;
  time: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  macros: MacroNutrients;
  products: ProductDetailsResponseBody[];
};

export type MealsByDateResponse = {
  date: string;
  meals: Meal[];
};

export type UserSettings = {
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  dailyCarbsGoal: number;
  dailyFatGoal: number;
};

export type DailySummary = {
  date: string;
  consumed: MacroNutrients;
  remaining: MacroNutrients;
  percentage: MacroNutrients;
  goals: UserSettings;
};
