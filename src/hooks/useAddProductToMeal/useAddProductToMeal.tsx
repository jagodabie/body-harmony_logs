import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMealLogsStore } from '../../stores/useMealLogsStore';
import type {
  MealLog,
  ProductDetails,
  ProductDetailsBody,
} from '../../types/MealLogs';

type UseAddProductToMealParams = {
  mealId: string;
  productDetails: ProductDetails;
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
        if (!mealId) {
          return;
        }

        const productToAdd: ProductDetailsBody = {
          productCode: productDetails.code,
          quantity,
          unit,
        };

        const meal = meals.find(m => m.id === mealId);

        if (!meal) {
          // Error is handled by snackbar in store
          return;
        }

        if (mealId.includes('-temp')) {
          const requestBody = {
            name: meal.name,
            mealType: meal.mealType as MealLog,
            date: meal.date,
            time: meal.time,
            notes: meal.notes,
            products: [productToAdd],
          };
          await createMeal(requestBody);
        } else {
          await addProductToMeal(mealId, productToAdd);
        }

        // Navigate to meal-logs with the date from the meal that was modified
        const mealDate = meal.date.split('T')[0];
        navigate(`/meal-logs?date=${mealDate}`);
      } catch {
        // Error is handled by snackbar in store
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
