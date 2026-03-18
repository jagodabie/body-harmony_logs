import type { ProductByCodeApiResponse, ProductDetails } from "../../../../types/MealLogs";

export const convertProductResponseToProductDetails = (
    productResponse: ProductByCodeApiResponse
  ): ProductDetails => {
    return {
      id: productResponse._id,
      mealId: '',
      code: productResponse.code,
      name: productResponse.name,
      nutrientsPer100g: {
        calories: productResponse.nutriments['energy-kcal_100g'],
        proteins: productResponse.nutriments.proteins_100g,
        carbs: productResponse.nutriments.carbohydrates_100g,
        fat: productResponse.nutriments.fat_100g,
      },
      brands: productResponse.brands,
      quantity: 100,
      unit: 'g',
    };
  };