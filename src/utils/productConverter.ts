import type {
  NutrimentsPer100g,
  ProductDetails,
  ProductDetailsBody,
} from '../types/MealLogs';
import { calculateMacros } from './macrosCalculator';

export const convertProductDetailsToProductDetailsBody = (
  productDetails: ProductDetails<NutrimentsPer100g>,
  quantity: number,
  unit: string,
  mealId: string
): ProductDetailsBody => {
  const nutrition = calculateMacros(productDetails.nutrition, quantity);

  const { code, ...productDetailsWithoutCode } = productDetails;

  return {
    ...productDetailsWithoutCode,
    nutrition,
    mealId,
    quantity,
    productCode: code,
    unit,
  };
};

