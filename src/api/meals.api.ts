import type { Meal, MealLog, ProductDetailsBody } from '../types/MealLogs';
import { parseApiError } from './errorHandling';

const apiUrl = process.env.REACT_APP_API_BASE_URL;

type CreateMealRequest = {
  name: string;
  mealType: MealLog;
  date: string;
  time: string;
  notes: string | null;
  products?: ProductDetailsBody[];
};

type MealsByDateResponse = {
  meals: Meal[];
};

export const fetchMealsByDate = async (
  date: string
): Promise<MealsByDateResponse> => {
  const response = await fetch(
    `${apiUrl}/meals/by-date/${date}/with-products`,
    {
      cache: 'no-cache',
    }
  );

  if (!response.ok) {
    throw await parseApiError(response, 'Failed to fetch meals');
  }

  // Handle 304 Not Modified - response has no body
  if (response.status === 304) {
    throw new Error('Meals data not available (cached)');
  }

  return await response.json();
};

export const createMeal = async (
  requestBody: CreateMealRequest
): Promise<void> => {
  const response = await fetch(`${apiUrl}/meals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Failed to create meal');
  }

  await response.json();
};

export const addProductToMeal = async (
  mealId: string,
  product: ProductDetailsBody
): Promise<void> => {
  const response = await fetch(`${apiUrl}/meals/${mealId}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Failed to add product to meal');
  }

  await response.json();
};

export const removeProductFromMeal = async (
  mealId: string,
  productId: string
): Promise<void> => {
  const response = await fetch(
    `${apiUrl}/meals/${mealId}/products/${productId}`,
    {
      method: 'DELETE',
      cache: 'no-cache',
    }
  );

  if (!response.ok) {
    throw await parseApiError(response, 'Failed to remove product from meal');
  }
};

