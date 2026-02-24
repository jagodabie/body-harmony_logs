import { useCallback, useState } from 'react';

import { fetchProductByEan } from '../../../api/products.api';
import { extractErrorMessage } from '../../../stores/errorHandling';
import { useUIStore } from '../../../stores/useUIStore';
import type {
  ProductByCodeApiResponse,
  ProductDetails,
} from '../../../types/MealLogs';
import { convertProductResponseToProductDetails } from './utils';

type UseEanProductSearchReturn = {
  productResponse: ProductByCodeApiResponse | null;
  productDetails: ProductDetails | null;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  searchByEan: (code: string) => void;
  clearProduct: () => void;
};

export const useEanProductSearch = (): UseEanProductSearchReturn => {
  const [productResponse, setProductResponse] =
    useState<ProductByCodeApiResponse | null>(null);
  const [productDetails, setProductDetails] =
    useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showSnackbar = useUIStore(state => state.showSnackbar);

  const clearProduct = () => {
    setProductDetails(null);
    setProductResponse(null);
    setError(null);
  };

  const searchProductByEan = useCallback(
    async (eanCode: string) => {
      // TODO: Remove this after testing
      // eanCode = "5905186302250"
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchProductByEan(eanCode);
        setProductResponse(data);
        const details = convertProductResponseToProductDetails(data);
        setProductDetails(details);
      } catch (err) {
        const errorMessage = extractErrorMessage(err);
        const error = err as Error;

        // Handle 404 errors differently - show in UI instead of snackbar
        // Check if error message contains the default 404 message pattern
        if (error.message.toLowerCase().includes('not found')) {
          setError(errorMessage);
          setProductResponse(null);
          setProductDetails(null);
          return;
        }

        showSnackbar(errorMessage, 'error');
        setProductResponse(null);
        setProductDetails(null);
      } finally {
        setIsLoading(false);
      }
    },
    [showSnackbar]
  );

  const searchByEan = useCallback(
    (code: string) => {
      searchProductByEan(code);
    },
    [searchProductByEan]
  );

  return {
    productResponse,
    productDetails,
    isLoading,
    error,
    setError,
    searchByEan,
    clearProduct,
  };
};
