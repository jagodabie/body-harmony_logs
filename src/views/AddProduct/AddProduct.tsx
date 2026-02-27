import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { EANCodeScanner } from '../../components/EANCodeScanner/EANCodeScanner';
import { OverlayLoader } from '../../components/OverlayLoader/OverlayLoader';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { useUIStore } from '../../stores/useUIStore';
import type { ProductDetails } from '../../types/MealLogs';
import { ProductSearch } from './components/ProductSearch/ProductSearch';
import { useEanProductSearch } from './hooks/useEanProductSearch';

import './index.css';

export const AddProduct = () => {
  const { mealId } = useParams<{ mealId: string }>();
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(
    null
  );
  const { productDetails, isLoading, error, setError, searchProductByEan } =
    useEanProductSearch();
  const showSnackbar = useUIStore(state => state.showSnackbar);

  const handleInvalidBarcode = (code: string) => {
    showSnackbar(
      `Invalid barcode: ${code}. Please check and try again.`,
      'warning'
    );
  };

  const handleTextSearch = useCallback((query: string) => {
    /* TODO: text search API when available */
    void query;
  }, []);

  useEffect(() => {
    if (productDetails) {
      setSelectedProduct(productDetails);
    } else {
      setSelectedProduct(null);
    }
  }, [productDetails]);

  console.log('Add Product re-re');

  const scannerConfig = useMemo(
    () => ({
      validateChecksum: true,
      debounceMs: 1500,
      onInvalidScan: handleInvalidBarcode,
    }),
    [handleInvalidBarcode]
  );
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
          <OverlayLoader isLoading={isLoading} />
          {error && (
            <div className="add-product__message" role="alert">
              {error}
            </div>
          )}
          {/* <div className="search-product__list">
            {products.length > 0 &&
              products.map(product => (
                <div
                  key={product.id}
                  className="search-product__item"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="search-product__item-name">
                    {product.name}
                  </div>
                  <div className="search-product__item-quantity">
                    Quantity: {product.quantity} g
                  </div>
                  <Macros
                    calories={product.nutritionPer100g?.calories ?? 0}
                    protein={product.nutritionPer100g?.proteins ?? 0}
                    carbohydrates={product.nutritionPer100g?.carbs ?? 0}
                    fat={product.nutritionPer100g?.fat ?? 0}
                    className="search-product__item-macros"
                  />
                </div>
              ))}
          </div> */}
        </>
      )}

      {selectedProduct && mealId && (
        <ProductCard productDetails={selectedProduct} mealId={mealId} />
      )}
    </div>
  );
};
