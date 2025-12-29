import { useCallback } from 'react';
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
};

export const useAddProductToMeal = ({
  mealId,
  productDetails,
  unit,
}: UseAddProductToMealParams): UseAddProductToMealReturn => {
  const navigate = useNavigate();
  const {
    addProductToMeal,
    createMealOnBackend,
    updateMealFromBackend,
    addProductToMealOnBackend,
    meals,
  } = useMealLogsStore();

  const addProduct = useCallback(
    async (quantity: number) => {
      const nutrition = calculateMacros(productDetails.nutrition, quantity);

      console.log('[useAddProductToMeal] Nutrition:', nutrition);

      const { code, ...productDetailsWithoutCode } = productDetails;
      const productToAdd: ProductDetailsBody = {
        ...productDetailsWithoutCode,
        nutrition,
        mealId,
        quantity,
        productCode: code,
        unit,
      };
      console.log('[useAddProductToMeal] Product to add:', productToAdd);

      const meal = meals.find(m => m._id === mealId);

      console.log('[useAddProductToMeal] Meal:', meal);

      if (!meal) {
        console.error('[useAddProductToMeal] Meal not found:', mealId);
        // TODO: Show error message to user
        return;
      }

      if (mealId.includes('-temp')) {
        try {
          const createdMeal = await createMealOnBackend(meal, productToAdd);

          updateMealFromBackend(mealId, createdMeal);
        } catch (error) {
          console.error(
            '[useAddProductToMeal] Failed to create meal on backend:',
            error
          );
          // TODO: Show error message to user
          return;
        }
      } else {
        const addedProduct = await addProductToMealOnBackend(
          mealId,
          productToAdd
        );
        addProductToMeal(mealId, addedProduct);
      }

      navigate('/meal-logs');
    },
    [
      mealId,
      productDetails,
      unit,
      meals,
      addProductToMeal,
      createMealOnBackend,
      updateMealFromBackend,
      addProductToMealOnBackend,
      navigate,
    ]
  );

  return { addProduct };
};

