import type { ProductByCodeApiResponse } from '../types/MealLogs';
import { parseApiError } from './errorHandling';

const apiUrl = process.env.REACT_APP_API_BASE_URL;

export const fetchProductByEan = async (
  eanCode: string
): Promise<ProductByCodeApiResponse> => {
  const response = await fetch(`${apiUrl}/products/${eanCode}`, {
    cache: 'no-cache',
  });
console.log(response);
  if (!response.ok) {
    throw await parseApiError(
      response,
      `Failed to fetch product with EAN code ${eanCode}`
    );
  }

  return await response.json();
};
