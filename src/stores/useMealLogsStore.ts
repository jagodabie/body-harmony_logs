import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Meal, MealLog, ProductDetailsBody } from '../types/MealLogs';
import { prepareMeals } from '../views/MealLogs/DayOfEating/utils';

type MealLogsState = {
  meals: Meal[];
  isLoading: boolean;
  error: string | null;
  currentDate: string | null;
  setMeals: (meals: Meal[]) => void;
  fetchCurrentDayMeals: (date: string, force?: boolean) => Promise<void>;
  createMeal: (tempMeal: Meal, product?: ProductDetailsBody) => Promise<void>;
  addProductToMeal: (
    mealId: string,
    product: ProductDetailsBody
  ) => Promise<void>;
  removeProductFromMeal: (mealId: string, productId: string) => Promise<void>;
};

const apiUrl = process.env.REACT_APP_API_BASE_URL;

export const useMealLogsStore = create<MealLogsState>()(
  persist(
    set => ({
      meals: [],
      isLoading: false,
      error: null,
      currentDate: null,

      setMeals: (meals: Meal[]) => {
        set({ meals });
      },

      fetchCurrentDayMeals: async (date: string, force = false) => {
        const state = useMealLogsStore.getState();
        if (!force && state.currentDate === date && state.meals.length > 0) {
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            `${apiUrl}/meals/by-date/${date}/with-products`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch meals: ${response.statusText}`);
          }

          const responseData = await response.json();
          const mealsFromBackend: Meal[] = responseData.meals || [];

          const meals = prepareMeals(mealsFromBackend, date);

          set({ meals, currentDate: date, isLoading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          console.error('Error fetching meals:', errorMessage);
          set({ error: errorMessage, isLoading: false });
        }
      },

      createMeal: async (tempMeal: Meal, product?: ProductDetailsBody) => {
        try {
          const requestBody: {
            name: string;
            mealType: MealLog;
            date: string;
            time: string;
            notes: string | null;
            products?: ProductDetailsBody[];
          } = {
            name: tempMeal.name,
            mealType: tempMeal.mealType,
            date: tempMeal.date,
            time: tempMeal.time,
            notes: tempMeal.notes,
          };

          // If product is provided, include it in the request
          if (product) {
            requestBody.products = [{ ...product, mealId: '' }];
          }

          const response = await fetch(`${apiUrl}/meals`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          if (!response.ok) {
            throw new Error(`Failed to create meal: ${response.statusText}`);
          }

          const createdMeal: Meal = await response.json();

          // Re-fetch current day meals to update frontend
          const currentDate = tempMeal.date.split('T')[0];
          const state = useMealLogsStore.getState();
          await state.fetchCurrentDayMeals(currentDate, true);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          console.error('[createMeal] Error creating meal:', errorMessage);
          throw error;
        }
      },

      addProductToMeal: async (mealId: string, product: ProductDetailsBody) => {
        try {
          const response = await fetch(`${apiUrl}/meals/${mealId}/products`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
          });

          if (!response.ok) {
            throw new Error(
              `Failed to add product to meal: ${response.statusText}`
            );
          }

          const addedProduct: ProductDetailsBody = await response.json();

          // Re-fetch current day meals to update frontend
          const state = useMealLogsStore.getState();
          const meal = state.meals.find(m => m._id === mealId);
          if (meal) {
            const currentDate = meal.date.split('T')[0];
            await state.fetchCurrentDayMeals(currentDate, true);
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          console.error(
            '[addProductToMeal] Error adding product to meal:',
            errorMessage
          );
          throw error;
        }
      },

      removeProductFromMeal: async (mealId: string, productId: string) => {
        try {
          const response = await fetch(
            `${apiUrl}/meals/${mealId}/products/${productId}`,
            {
              method: 'DELETE',
            }
          );

          if (!response.ok) {
            throw new Error(
              `Failed to remove product from meal: ${response.statusText}`
            );
          }

          // Re-fetch current day meals to update frontend
          const state = useMealLogsStore.getState();
          const meal = state.meals.find(m => m._id === mealId);
          if (meal) {
            const currentDate = meal.date.split('T')[0];
            await state.fetchCurrentDayMeals(currentDate, true);
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          console.error(
            '[removeProductFromMeal] Error removing product from meal:',
            errorMessage
          );
          throw error;
        }
      },
    }),
    {
      name: 'meal-logs-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        meals: state.meals,
        currentDate: state.currentDate,
      }),
    }
  )
);

