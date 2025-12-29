import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { EANCodeScanner } from '../../components/EANCodeScanner/EANCodeScanner';
import type { NutrimentsPer100g, ProductDetails } from '../../types/MealLogs';
import { Macros } from '../MealLogs/components/Macros/Macros';
import { ProductCard } from './components/ProductCard/ProductCard';
import { ProductSearch } from './components/ProductSearch/ProductSearch';
import { useEanProductSearch } from './hooks/useEanProductSearch';

import './index.css';

export const AddProduct = () => {
  const { mealId } = useParams<{ mealId: string }>();
  const [products, setProducts] = useState<ProductDetails<NutrimentsPer100g>[]>(
    []
  );
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDetails<NutrimentsPer100g> | null>(null);
  const { productDetails, isLoading, error, handleScanSuccess, clearProduct } =
    useEanProductSearch();

  const handleProductClick = (product: ProductDetails<NutrimentsPer100g>) => {
    setSelectedProduct(prev => (prev?._id === product._id ? null : product));
  };

  const handleInvalidScan = (code: string) => {
    console.warn('Invalid barcode scanned:', code);
    // TODO: Show user feedback for invalid scan
  };

  useEffect(() => {
    if (productDetails) {
      setProducts(prev => [...prev, productDetails]);
      clearProduct();
    }
  }, [productDetails, clearProduct]);

  return (
    <div className="add-product-page">
      {!selectedProduct && (
        <>
          <div className="add-product__search">
            <ProductSearch />
            <EANCodeScanner
              onScanSuccess={handleScanSuccess}
              config={{
                validateChecksum: true,
                debounceMs: 1500,
                onInvalidScan: handleInvalidScan,
              }}
            />
          </div>

          {isLoading && <div className="add-product__loading">Loading...</div>}

          {error && (
            <div className="add-product__message" role="alert">
              {error}
            </div>
          )}

          <div className="search-product__list">
            {products.length > 0 &&
              products.map(product => {
                const nutrition = product.nutrition;
                return (
                  <div
                    key={product._id}
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
                      calories={nutrition['energy-kcal_100g'] || 0}
                      protein={nutrition.proteins_100g || 0}
                      carbohydrates={nutrition.carbohydrates_100g || 0}
                      fat={nutrition.fat_100g || 0}
                      className="search-product__item-macros"
                    />
                  </div>
                );
              })}
          </div>
        </>
      )}

      {selectedProduct && mealId && (
        <ProductCard productDetails={selectedProduct} mealId={mealId} />
      )}
    </div>
  );
};
