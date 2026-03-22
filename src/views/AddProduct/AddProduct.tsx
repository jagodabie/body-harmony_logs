import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { EANCodeScanner } from '../../components/EANCodeScanner/EANCodeScanner';
import { OverlayLoader } from '../../components/OverlayLoader/OverlayLoader';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { useUIStore } from '../../stores/useUIStore';
import type { ProductByCodeApiResponse, ProductDetails } from '../../types/MealLogs';
import { ProductSearch } from './components/ProductSearch/ProductSearch';
import { useEanProductSearch } from './hooks/useEanProductSearch';
import { useNameProductSearch } from './hooks/useNameProductSearch';
import { convertProductResponseToProductDetails } from './hooks/utils';

import './index.css';

export const AddProduct = () => {
  const { mealId } = useParams<{ mealId: string }>();
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(
    null
  );
  const { productDetails, isLoading, error, setError, searchProductByEan } =
    useEanProductSearch();
  const { results, isLoading: nameIsLoading, searchByName, clearResults } =
    useNameProductSearch();
  const showSnackbar = useUIStore(state => state.showSnackbar);

  const handleInvalidBarcode = (code: string) => {
    showSnackbar(
      `Invalid barcode: ${code}. Please check and try again.`,
      'warning'
    );
  };

  const handleTextSearch = useCallback(
    (query: string) => {
      if (query === '') {
        clearResults();
        return;
      }
      searchByName(query);
    },
    [searchByName, clearResults]
  );

  const handleProductClick = (product: ProductByCodeApiResponse) => {
    clearResults();
    setSelectedProduct(convertProductResponseToProductDetails(product));
  };

  useEffect(() => {
    if (productDetails) {
      clearResults();
      setSelectedProduct(productDetails);
    }
  }, [productDetails, clearResults]);

  return (
    <div className="add-product-page">
      {!selectedProduct && (
        <>
          <div className="add-product__search">
            <ProductSearch
              onValidBarcodeDetected={searchProductByEan}
              onTextSearch={handleTextSearch}
              onChangeEanCode={setError}
            />
            <EANCodeScanner
              onScanSuccess={result => searchProductByEan(result.code)}
              config={{
                validateChecksum: true,
                debounceMs: 1500,
                onInvalidScan: handleInvalidBarcode,
              }}
            />
          </div>
          <OverlayLoader isLoading={isLoading || nameIsLoading} />
          {error && (
            <div className="add-product__message" role="alert">
              {error}
            </div>
          )}
          {results.length > 0 && (
            <div className="add-product__list">
              {results.map(product => (
                <div
                  key={product.id}
                  className="add-product__item"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="add-product__item-name">{product.name}</div>
                  {product.brands && (
                    <div className="add-product__item-brand">
                      {product.brands}
                    </div>
                  )}
                  <div className="add-product__item-macros-row">
                    <span>{product.nutrientsPer100g.calories} kcal</span>
                    <span>B: {product.nutrientsPer100g.proteins}g</span>
                    <span>W: {product.nutrientsPer100g.carbs}g</span>
                    <span>T: {product.nutrientsPer100g.fat}g</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedProduct && mealId && (
        <ProductCard productDetails={selectedProduct} mealId={mealId} />
      )}
    </div>
  );
};
