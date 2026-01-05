export const MealLogs = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const;
export type MealLog = (typeof MealLogs)[number];

export type NutrimentsPer100g = {
  'energy-kcal_100g'?: number;
  proteins_100g?: number;
  fat_100g?: number;
  'saturated-fat_100g'?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  salt_100g?: number;
};

export type NutrimentsPerQuantity = {
  calories: number;
  proteins: number;
  carbs: number;
  fat: number;
  sugars?: number;
  salt?: number;
};

// API Response type for GET /products/:code endpoint (external API - Open Food Facts)
export type ProductByCodeApiResponse = {
  _id: string;
  nutriments: NutrimentsPer100g;
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
  lastModified?: string | null;
  updatedAt?: string | null;
  nutritionPer100g: NutrimentsPer100g;
};

// Keep ProductDetailsResponse as alias for backward compatibility
export type ProductDetailsResponse = ProductByCodeApiResponse;

export type ProductDetails<T> = {
  _id: string;
  mealId: string;
  code: string;
  name: string;
  nutrition: T;
  brands: string;
  quantity: number;
  unit: string;
};

export type ProductDetailsBody = Omit<
  ProductDetails<NutrimentsPerQuantity>,
  'code'
> & {
  productCode: string;
};

export type ProductDetailsResponseBody = ProductDetailsBody & {
  nutritionPer100g: NutrimentsPer100g;
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
  macros: MacroNutrients;
  products: ProductDetailsResponseBody[];
};

export type MealsByDateResponse = {
  date: string;
  meals: Meal[];
};

export type MacroNutrients = {
  calories: number;
  proteins: number;
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
