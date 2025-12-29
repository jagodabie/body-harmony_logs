import { useCallback, useEffect, useState } from 'react';

import type { ScanResult } from '../../../components/EANCodeScanner/types';
import type {
  NutrimentsPer100g,
  ProductByCodeApiResponse,
  ProductDetails,
} from '../../../types/MealLogs';

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

  const handleScanSuccess = (result: ScanResult) => {
    setScanResult(result);
  };

  const clearProduct = () => {
    setProductDetails(null);
    setScanResult(null);
    setProductResponse(null);
    setError(null);
  };
  const convertProductResponseToProductDetails = (
    productResponse: ProductByCodeApiResponse
  ): ProductDetails<NutrimentsPer100g> => {
    // Parse quantity string (e.g., "200 g" -> 200)
    const quantityMatch = productResponse.quantity.match(/(\d+)/);
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

  const searchProductByEan = useCallback(async (eanCode: string) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/products/${eanCode}`
      );
      console.log('response', response);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Product with EAN code ${eanCode} not found`);
        }
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Product EAN searched:', data);
      setProductResponse(data);
      const details = convertProductResponseToProductDetails(data);
      setProductDetails(details);
      // TODO: Add product to meal logs store
      console.log('Converted product details:', details);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error searching product EAN:', errorMessage);
      setError(errorMessage);
      setProductResponse(null);
      setProductDetails(null);
      setScanResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

