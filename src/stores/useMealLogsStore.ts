import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Meal, MealLog, ProductDetailsBody } from '../types/MealLogs';
import { indexedDBStorage } from '../utils/indexedDBStorage';
import { prepareMeals } from '../views/MealLogs/DayOfEating/utils';

type MealLogsState = {
  meals: Meal[];
  isLoading: boolean;
  error: string | null;
  currentDate: string | null;
  setMeals: (meals: Meal[]) => void;
  fetchCurrentDayMeals: (date: string, force?: boolean) => Promise<void>;
  createMealOnBackend: (
    tempMeal: Meal,
    product?: ProductDetailsBody
  ) => Promise<Meal>;
  addProductToMealOnBackend: (
    mealId: string,
    product: ProductDetailsBody
  ) => Promise<ProductDetailsBody>;
  addMeal: (meal: Meal) => void;
  updateMeal: (mealId: string, updates: Partial<Meal>) => void;
  updateMealFromBackend: (oldMealId: string, newMeal: Meal) => void;
  deleteMeal: (mealId: string) => void;
  addProductToMeal: (mealId: string, product: ProductDetailsBody) => void;
  removeProductFromMeal: (mealId: string, productId: string) => void;
  updateProductInMeal: (
    mealId: string,
    productId: string,
    updates: Partial<ProductDetailsBody>
  ) => void;
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
          console.log(
            '[fetchCurrentDayMeals] Data for this date already loaded, skipping fetch'
          );
          return;
        }

        console.log('[fetchCurrentDayMeals] Fetching data for date:', date);
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            `${apiUrl}/meals/by-date/${date}/with-products`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch meals: ${response.statusText}`);
          }

          const responseData = await response.json();
          console.log('response data:', responseData);
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

      createMealOnBackend: async (
        tempMeal: Meal,
        product?: ProductDetailsBody
      ) => {
        console.log('[createMealOnBackend] Creating meal on BE:', tempMeal);
        if (product) {
          console.log('[createMealOnBackend] With product:', product);
        }

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

          console.log('[createMealOnBackend] Request body:', requestBody);

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
          console.log('[createMealOnBackend] Meal created on BE:', createdMeal);

          return createdMeal;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          console.error(
            '[createMealOnBackend] Error creating meal:',
            errorMessage
          );
          throw error;
        }
      },

      addProductToMealOnBackend: async (
        mealId: string,
        product: ProductDetailsBody
      ) => {
        console.log(
          '[addProductToMealOnBackend] Adding product to meal on BE:',
          mealId,
          product
        );
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
          console.log(
            '[addProductToMealOnBackend] Product added to meal on BE:',
            addedProduct
          );
          return addedProduct;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          console.error(
            '[addProductToMealOnBackend] Error adding product to meal:',
            errorMessage
          );
          throw error;
        }
      },

      addMeal: (meal: Meal) => {
        set(state => ({
          meals: [...state.meals, meal],
        }));
      },

      updateMeal: (mealId: string, updates: Partial<Meal>) => {
        set(state => ({
          meals: state.meals.map(meal =>
            meal._id === mealId ? { ...meal, ...updates } : meal
          ),
        }));
      },

      updateMealFromBackend: (oldMealId: string, newMeal: Meal) => {
        set(state => ({
          meals: state.meals.map(meal =>
            meal._id === oldMealId ? newMeal : meal
          ),
        }));
      },

      deleteMeal: (mealId: string) => {
        set(state => ({
          meals: state.meals.filter(meal => meal._id !== mealId),
        }));
      },

      addProductToMeal: (mealId: string, product: ProductDetailsBody) => {
        // Simple function - only adds product to existing meal
        // Assumes meal already exists (not temp)
        set(state => {
          const meal = state.meals.find(m => m._id === mealId);
          if (!meal) {
            console.error(`[addProductToMeal] Meal ${mealId} not found`);
          }
          return {
            meals: state.meals.map(meal =>
              meal._id === mealId
                ? {
                    ...meal,
                    products: [...meal.products, product],
                  }
                : meal
            ),
          };
        });
      },

      removeProductFromMeal: (mealId: string, productId: string) => {
        set(state => ({
          meals: state.meals.map(meal =>
            meal._id === mealId
              ? {
                  ...meal,
                  products: meal.products.filter(
                    product => product._id !== productId
                  ),
                }
              : meal
          ),
        }));
      },

      updateProductInMeal: (
        mealId: string,
        productId: string,
        updates: Partial<ProductDetailsBody>
      ) => {
        set(state => ({
          meals: state.meals.map(meal =>
            meal._id === mealId
              ? {
                  ...meal,
                  products: meal.products.map(product =>
                    product._id === productId
                      ? { ...product, ...updates }
                      : product
                  ),
                }
              : meal
          ),
        }));
      },
    }),
    {
      name: 'meal-logs-storage',
      storage: createJSONStorage(() => indexedDBStorage),
      partialize: state => ({
        meals: state.meals,
        currentDate: state.currentDate,
      }),
    }
  )
);

