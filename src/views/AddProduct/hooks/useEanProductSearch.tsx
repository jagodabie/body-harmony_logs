import { useCallback, useEffect, useState } from 'react';

import { fetchProductByEan } from '../../../api/products.api';
import type { ScanResult } from '../../../components/EANCodeScanner/types';
import { extractErrorMessage } from '../../../stores/errorHandling';
import { useUIStore } from '../../../stores/useUIStore';
import type {
  NutrimentsPer100g,
  ProductByCodeApiResponse,
  ProductDetails,
} from '../../../types/MealLogs';
import { convertProductResponseToProductDetails } from './utils';

type UseEanProductSearchReturn = {
  scanResult: ScanResult | null;
  productResponse: ProductByCodeApiResponse | null;
  productDetails: ProductDetails<NutrimentsPer100g> | null;
  isLoading: boolean;
  error: string | null;
  handleScanSuccess: (result: ScanResult) => void;
  clearProduct: () => void;
};

export const useEanProductSearch = (): UseEanProductSearchReturn => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [productResponse, setProductResponse] =
    useState<ProductByCodeApiResponse | null>(null);
  const [productDetails, setProductDetails] =
    useState<ProductDetails<NutrimentsPer100g> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showSnackbar = useUIStore(state => state.showSnackbar);

  const handleScanSuccess = (result: ScanResult) => {
    setScanResult(result);
  };

  const clearProduct = () => {
    setProductDetails(null);
    setScanResult(null);
    setProductResponse(null);
    setError(null);
  };


  const searchProductByEan = useCallback(
    async (eanCode : string) => {
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
        if (
          error.message.toLowerCase().includes('not found')
        ) {
          setError(errorMessage);
          setProductResponse(null);
          setProductDetails(null);
          setScanResult(null);
          return;
        }

        showSnackbar(errorMessage, 'error');
        setProductResponse(null);
        setProductDetails(null);
        setScanResult(null);
      } finally {
        setIsLoading(false);
      }
    },
    [showSnackbar]
  );

  useEffect(() => {
    if (scanResult?.code) {
      searchProductByEan(scanResult.code);
    }
  }, [scanResult, searchProductByEan]);

  return {
    scanResult,
    productResponse,
    productDetails,
    isLoading,
    error,
    handleScanSuccess,
    clearProduct,
  };
};

