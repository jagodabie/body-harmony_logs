import type { NutrimentsPer100g, ProductByCodeApiResponse, ProductDetails } from "../../../../types/MealLogs";

export const convertProductResponseToProductDetails = (
    productResponse: ProductByCodeApiResponse
  ): ProductDetails<NutrimentsPer100g> => {
    // Parse quantity string (e.g., "200 g" -> 200)
    const quantityMatch = productResponse.quantity?.match(/(\d+)/);
    const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 100;

    return {
      _id: productResponse._id,
      mealId: '', // Will be set when adding to a meal
      code: productResponse.code,
      name: productResponse.name,
      nutrition: productResponse.nutriments,
      brands: productResponse.brands,
      quantity,
      unit: 'g',
      
    };
  };