import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Meal, ProductDetails } from '../types/MealLogs';

type MealLogsState = {
  meals: Meal[];
  isLoading: boolean;
  error: string | null;
  setMeals: (meals: Meal[]) => void;
  fetchCurrentDayMeals: (date: string) => Promise<void>;
  addMeal: (meal: Meal) => void;
  updateMeal: (mealId: string, updates: Partial<Meal>) => void;
  deleteMeal: (mealId: string) => void;
  addProductToMeal: (mealId: string, product: ProductDetails) => void;
  removeProductFromMeal: (mealId: string, productId: string) => void;
  updateProductInMeal: (
    mealId: string,
    productId: string,
    updates: Partial<ProductDetails>
  ) => void;
};

const apiUrl = process.env.REACT_APP_API_BASE_URL;

export const useMealLogsStore = create<MealLogsState>()(
  persist(
    set => ({
      meals: [],
      isLoading: false,
      error: null,

      setMeals: (meals: Meal[]) => {
        set({ meals });
      },

      fetchCurrentDayMeals: async (date: string) => {
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
          const meals: Meal[] = responseData.meals;

          set({ meals, isLoading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          console.error('Error fetching meals:', errorMessage);
          set({ error: errorMessage, isLoading: false });
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

      deleteMeal: (mealId: string) => {
        set(state => ({
          meals: state.meals.filter(meal => meal._id !== mealId),
        }));
      },

      addProductToMeal: (mealId: string, product: ProductDetails) => {
        set(state => ({
          meals: state.meals.map(meal =>
            meal._id === mealId
              ? {
                  ...meal,
                  products: [...meal.products, product],
                }
              : meal
          ),
        }));
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
        updates: Partial<ProductDetails>
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
    }
  )
);

