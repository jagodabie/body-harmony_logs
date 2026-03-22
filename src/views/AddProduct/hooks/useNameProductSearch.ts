import { useCallback, useState } from 'react';

import { fetchProductsByName } from '../../../api/products.api';
import { extractErrorMessage } from '../../../stores/errorHandling';
import { useUIStore } from '../../../stores/useUIStore';
import type { ProductByCodeApiResponse } from '../../../types/MealLogs';

type UseNameProductSearchReturn = {
  results: ProductByCodeApiResponse[];
  isLoading: boolean;
  searchByName: (query: string) => void;
  clearResults: () => void;
};

export const useNameProductSearch = (): UseNameProductSearchReturn => {
  const [results, setResults] = useState<ProductByCodeApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const showSnackbar = useUIStore(state => state.showSnackbar);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  const searchByName = useCallback(
    async (query: string) => {
      try {
        setIsLoading(true);
        const data = await fetchProductsByName(query);
        setResults(data);
      } catch (err) {
        const errorMessage = extractErrorMessage(err);
        showSnackbar(errorMessage, 'error');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showSnackbar]
  );

  return { results, isLoading, searchByName, clearResults };
};
