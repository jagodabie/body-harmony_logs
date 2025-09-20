export const MealLogs = ['Breakfast', 'Lunch', 'Dinner'] as const;
export type MealLog = typeof MealLogs[number];

export type MealProductType = {
    id: string;
    name: string;
    quantity: number;
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
}