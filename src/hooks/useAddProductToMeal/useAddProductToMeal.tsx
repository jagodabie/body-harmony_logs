import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMealLogsStore } from '../../stores/useMealLogsStore';
import type {
  NutrimentsPer100g,
  ProductDetails,
  ProductDetailsBody,
} from '../../types/MealLogs';
import { calculateMacros } from '../../utils/macrosCalculator';

type UseAddProductToMealParams = {
  mealId: string;
  productDetails: ProductDetails<NutrimentsPer100g>;
  unit: string;
};

type UseAddProductToMealReturn = {
  addProduct: (quantity: number) => Promise<void>;
  isAdding: boolean;
};

export const useAddProductToMeal = ({
  mealId,
  productDetails,
  unit,
}: UseAddProductToMealParams): UseAddProductToMealReturn => {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const { createMeal, addProductToMeal, meals } = useMealLogsStore();

  const addProduct = useCallback(
    async (quantity: number) => {
      setIsAdding(true);

      try {
        const nutrition = calculateMacros(productDetails.nutrition, quantity);
        const { code, ...productDetailsWithoutCode } = productDetails;
        const productToAdd: ProductDetailsBody = {
          ...productDetailsWithoutCode,
          nutrition,
          mealId,
          quantity,
          productCode: code,
          unit,
        };

        const meal = meals.find(m => m._id === mealId);

        console.log('[useAddProductToMeal] Meal:', meal);

        if (!meal) {
          console.error('[useAddProductToMeal] Meal not found:', mealId);
          // TODO: Show error message to user
          return;
        }

        if (mealId.includes('-temp')) {
          await createMeal(meal, productToAdd);
        } else {
          await addProductToMeal(mealId, productToAdd);
        }

        // Navigate to meal-logs with the date from the meal that was modified
        const mealDate = meal.date.split('T')[0];
        navigate(`/meal-logs?date=${mealDate}`);
      } catch (error) {
        console.error('[useAddProductToMeal] Failed to add product:', error);
        // TODO: Show error message to user
      } finally {
        setIsAdding(false);
      }
    },
    [
      mealId,
      productDetails,
      unit,
      meals,
      createMeal,
      addProductToMeal,
      navigate,
    ]
  );

  return { addProduct, isAdding };
};
