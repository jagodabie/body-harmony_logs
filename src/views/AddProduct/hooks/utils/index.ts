import type { ProductByCodeApiResponse, ProductDetails } from "../../../../types/MealLogs";

export const convertProductResponseToProductDetails = (
    productResponse: ProductByCodeApiResponse
  ): ProductDetails => {
    return {
      id: productResponse.id,
      mealId: '',
      code: productResponse.code,
      name: productResponse.name,
      nutrientsPer100g: productResponse.nutrientsPer100g,
      brands: productResponse.brands,
      quantity: 100,
      unit: 'g',
    };
  };