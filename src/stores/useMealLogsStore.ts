import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  addProductToMeal as addProductToMealApi,
  createMeal as createMealApi,
  fetchMealsByDate,
  removeProductFromMeal as removeProductFromMealApi,
} from '../api/meals.api';
import type { Meal, MealLog, ProductDetailsBody } from '../types/MealLogs';
import { prepareMeals } from '../views/MealLogs/DayOfEating/utils';
import { handleAsyncOperation } from './storeHelpers';

type CreateMealRequest = {
  name: string;
  mealType: MealLog;
  date: string;
  time: string;
  notes: string | null;
  products?: ProductDetailsBody[];
};

type MealLogsState = {
  meals: Meal[];
  isLoading: boolean;
  currentDate: string | null;
  setMeals: (meals: Meal[]) => void;
  fetchCurrentDayMeals: (date: string, force?: boolean) => Promise<void>;
  createMeal: (requestBody: CreateMealRequest) => Promise<void>;
  addProductToMeal: (
    mealId: string,
    product: ProductDetailsBody
  ) => Promise<void>;
  removeProductFromMeal: (mealId: string, productId: string) => Promise<void>;
};

export const useMealLogsStore = create<MealLogsState>()(
  persist(
    set => ({
      meals: [],
      isLoading: false,
      currentDate: null,

      setMeals: (meals: Meal[]) => {
        set({ meals });
      },

      fetchCurrentDayMeals: async (date: string, force = false) => {
        const state = useMealLogsStore.getState();
        if (!force && state.currentDate === date && state.meals.length > 0) {
          return;
        }

        await handleAsyncOperation({
          setLoading: (loading) => set({ isLoading: loading }),
          operation: async () => {
            const responseData = await fetchMealsByDate(date);
            const mealsFromBackend: Meal[] = responseData.meals || [];
            const meals = prepareMeals(mealsFromBackend, date);
            set({ meals, currentDate: date });
            return meals;
          },
          showErrorMessage: true,
        });
      },

      createMeal: async (requestBody: CreateMealRequest) => {
        await handleAsyncOperation({
          setLoading: () => {}, // No loading state for this operation
          operation: async () => {
            await createMealApi(requestBody);
            // Re-fetch current day meals to update frontend
            const currentDate = requestBody.date.split('T')[0];
            const state = useMealLogsStore.getState();
            await state.fetchCurrentDayMeals(currentDate, true);
          },
          showSuccessMessage: 'Meal created successfully',
          showErrorMessage: true,
        });
      },

      addProductToMeal: async (mealId: string, product: ProductDetailsBody) => {
        await handleAsyncOperation({
          setLoading: () => {}, // No loading state for this operation
          operation: async () => {
            await addProductToMealApi(mealId, product);
            // Re-fetch current day meals to update frontend
            const state = useMealLogsStore.getState();
            const meal = state.meals.find(m => m._id === mealId);
            if (meal) {
              const currentDate = meal.date.split('T')[0];
              await state.fetchCurrentDayMeals(currentDate, true);
            }
          },
          showSuccessMessage: 'Product added to meal successfully',
          showErrorMessage: true,
        });
      },

      removeProductFromMeal: async (mealId: string, productId: string) => {
        await handleAsyncOperation({
          setLoading: () => {}, // No loading state for this operation
          operation: async () => {
            await removeProductFromMealApi(mealId, productId);
            // Re-fetch current day meals to update frontend
            const state = useMealLogsStore.getState();
            const meal = state.meals.find(m => m._id === mealId);
            if (meal) {
              const currentDate = meal.date.split('T')[0];
              await state.fetchCurrentDayMeals(currentDate, true);
            }
          },
          showSuccessMessage: 'Product removed from meal successfully',
          showErrorMessage: true,
        });
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

