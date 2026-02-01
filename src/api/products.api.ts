import type { ProductByCodeApiResponse } from '../types/MealLogs';
import { productsUrl } from './config';
import { parseApiError } from './errorHandling';

export const fetchProductByEan = async (
  eanCode: string
): Promise<ProductByCodeApiResponse> => {
  const response = await fetch(`${productsUrl}/${eanCode}`, {
    cache: 'no-cache',
  });
  if (!response.ok) {
    throw await parseApiError(
      response,
      `Failed to fetch product with EAN code ${eanCode}`
    );
  }

  return await response.json();
};
