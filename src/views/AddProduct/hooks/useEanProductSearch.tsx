import { useCallback, useEffect, useState } from 'react';

import type { ScanResult } from '../../../components/EANCodeScanner/types';
import type { ProductDetails } from '../../../types/MealLogs';

type ProductResponse = {
  _id: string;
  code: string;
  name: string;
  quantity: string;
  brands?: string;
  categories?: string;
  ingredients?: string;
  allergens?: string[];
  nutriments: {
    'energy-kcal_100g': number;
    proteins_100g: number;
    fat_100g: number;
    'saturated-fat_100g': number;
    carbohydrates_100g: number;
    sugars_100g: number;
    salt_100g: number;
  };
  nutriscore?: string;
  nova?: number;
  countries_tags?: string[];
  lastModified?: string;
  updatedAt?: string;
};

type UseEanProductSearchReturn = {
  scanResult: ScanResult | null;
  productResponse: ProductResponse | null;
  productDetails: ProductDetails | null;
  isLoading: boolean;
  error: string | null;
  handleScanSuccess: (result: ScanResult) => void;
};

export const useEanProductSearch = (): UseEanProductSearchReturn => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [productResponse, setProductResponse] =
    useState<ProductResponse | null>(null);
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScanSuccess = (result: ScanResult) => {
    setScanResult(result);
    console.log('Scanned:', result);
  };
  const convertProductResponseToProductDetails = (
    productResponse: ProductResponse
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
  };
};

