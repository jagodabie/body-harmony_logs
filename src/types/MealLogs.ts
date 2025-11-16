export const MealLogs = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const;
export type MealLog = (typeof MealLogs)[number];

export type Nutriments = {
  'energy-kcal_100g'?: number;
  proteins_100g?: number;
  fat_100g?: number;
  'saturated-fat_100g'?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  salt_100g?: number;
};

export type ProductCode = {
  name: string;
  code: string;
  nutriments: Nutriments;
  brands?: string;
};

export type ProductDetailsResponse = {
  _id: string;
  nutriments: Nutriments;
  countries_tags: string[];
  quantity: string;
  categories: string;
  brands: string;
  code: string;
  name: string;
  nutriscore: string;
  nova: number;
  ingredients: string;
  allergens: string[];
  lastModified: string;
  updatedAt: string;
};

export type ProductDetails = {
  _id: string;
  mealId: string;
  productCode: ProductCode;
  // Here is the quantity of the product in packaging
  quantity: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  brands: string;
  nutriments: Nutriments;
};

// Frontend meal input type
export type MealInput = {
  _id: string;
  name: string;
  mealType: MealLog;
  date: string;
  time: string;
};

// Backend meal type with full data
export type Meal = {
  _id: string;
  name: string;
  mealType: MealLog;
  date: string;
  time: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  products: ProductDetails[];
};

export type MealsByDateResponse = {
  date: string;
  meals: Meal[];
};

export type MacroNutrients = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
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
