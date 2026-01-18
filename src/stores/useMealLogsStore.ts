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
import { extractErrorMessage } from './errorHandling';
import { useUIStore } from './useUIStore';

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

        set({ isLoading: true });
        try {
          const responseData = await fetchMealsByDate(date);
          const mealsFromBackend: Meal[] = responseData.meals || [];

          const meals = prepareMeals(mealsFromBackend, date);

          set({ meals, currentDate: date, isLoading: false });
        } catch (error) {
          const errorMessage = extractErrorMessage(error);
          useUIStore.getState().showSnackbar(errorMessage, 'error');
          set({ isLoading: false });
        }
      },

      createMeal: async (requestBody: CreateMealRequest) => {
        try {
          await createMealApi(requestBody);

          // Re-fetch current day meals to update frontend
          const currentDate = requestBody.date.split('T')[0];
          const state = useMealLogsStore.getState();
          await state.fetchCurrentDayMeals(currentDate, true);

          useUIStore
            .getState()
            .showSnackbar('Meal created successfully', 'success');
        } catch (error) {
          const errorMessage = extractErrorMessage(error);
          useUIStore.getState().showSnackbar(errorMessage, 'error');
          throw error;
        }
      },

      addProductToMeal: async (mealId: string, product: ProductDetailsBody) => {
        try {
          await addProductToMealApi(mealId, product);

          // Re-fetch current day meals to update frontend
          const state = useMealLogsStore.getState();
          const meal = state.meals.find(m => m._id === mealId);
          if (meal) {
            const currentDate = meal.date.split('T')[0];
            await state.fetchCurrentDayMeals(currentDate, true);
          }

          useUIStore
            .getState()
            .showSnackbar('Product added to meal successfully', 'success');
        } catch (error) {
          const errorMessage = extractErrorMessage(error);
          useUIStore.getState().showSnackbar(errorMessage, 'error');
          throw error;
        }
      },

      removeProductFromMeal: async (mealId: string, productId: string) => {
        try {
          await removeProductFromMealApi(mealId, productId);

          // Re-fetch current day meals to update frontend
          const state = useMealLogsStore.getState();
          const meal = state.meals.find(m => m._id === mealId);
          if (meal) {
            const currentDate = meal.date.split('T')[0];
            await state.fetchCurrentDayMeals(currentDate, true);
          }

          useUIStore
            .getState()
            .showSnackbar('Product removed from meal successfully', 'success');
        } catch (error) {
          const errorMessage = extractErrorMessage(error);
          useUIStore.getState().showSnackbar(errorMessage, 'error');
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

