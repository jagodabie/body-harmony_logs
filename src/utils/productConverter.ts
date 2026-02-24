import type {
  ProductDetails,
  ProductDetailsBody,
} from '../types/MealLogs';

export const convertProductDetailsToProductDetailsBody = (
  productDetails: ProductDetails,
  quantity: number,
  unit: string,
  mealId: string
): ProductDetailsBody => {
  const { code, ...productDetailsWithoutCode } = productDetails;

  return {
    ...productDetailsWithoutCode,
    mealId,
    quantity,
    productCode: code,
    unit,
  };
};
