import { useCallback, useEffect, useState } from 'react';

import type { ScanResult } from '../../../components/EANCodeScanner/types';
import type {
  ProductDetails,
  ProductDetailsResponse,
} from '../../../types/MealLogs';

type UseEanProductSearchReturn = {
  scanResult: ScanResult | null;
  productResponse: ProductDetailsResponse | null;
  productDetails: ProductDetails | null;
  isLoading: boolean;
  error: string | null;
  handleScanSuccess: (result: ScanResult) => void;
  clearProduct: () => void;
};

export const useEanProductSearch = (): UseEanProductSearchReturn => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [productResponse, setProductResponse] =
    useState<ProductDetailsResponse | null>(null);
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(
    null
  );
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
    productResponse: ProductDetailsResponse
  ): ProductDetails => {
    // Parse quantity string (e.g., "200 g" -> 200)
    const quantityMatch = productResponse.quantity.match(/(\d+)/);
    const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 100;

    return {
      _id: productResponse._id,
      mealId: '', // Will be set when adding to a meal
      productCode: {
        name: productResponse.name,
        code: productResponse.code,
        nutriments: productResponse.nutriments,
        brands: productResponse.brands,
      },
      quantity,
      unit: 'g',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: productResponse.name,
      brands: productResponse.brands,
      nutriments: productResponse.nutriments,
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

