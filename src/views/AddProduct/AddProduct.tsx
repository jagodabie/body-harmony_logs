import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { EANCodeScanner } from '../../components/EANCodeScanner/EANCodeScanner';
import { OverlayLoader } from '../../components/OverlayLoader/OverlayLoader';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import type { NutrimentsPer100g, ProductDetails } from '../../types/MealLogs';
import { ProductSearch } from './components/ProductSearch/ProductSearch';
import { useEanProductSearch } from './hooks/useEanProductSearch';

import './index.css';

export const AddProduct = () => {
  const { mealId } = useParams<{ mealId: string }>();
  // TODO: Add products list when search will be implemented
  // const [products, setProducts] = useState<ProductDetails<NutrimentsPer100g>[]>(
  //   []
  // );
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDetails<NutrimentsPer100g> | null>(null);
  const { productDetails, isLoading, error, handleScanSuccess, clearProduct } =
    useEanProductSearch();

  // TODO: Add products list when search will be implemented
  // const handleProductClick = (product: ProductDetails<NutrimentsPer100g>) => {
  //   setSelectedProduct(prev => (prev?._id === product._id ? null : product));
  // };

  const handleInvalidScan = (code: string) => {
    console.warn('Invalid barcode scanned:', code);
    // TODO: Show user feedback for invalid scan
  };

  useEffect(() => {
    if (productDetails) {
      setSelectedProduct(productDetails);
    } else {
      setSelectedProduct(null);
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
          <OverlayLoader isLoading={isLoading} />
          {error && (
            <div className="add-product__message" role="alert">
              {error}
            </div>
          )}
          {/* TODO: Add products list  when search will be implemented*/}
          {/* <div className="search-product__list">
            {products.length > 0 &&
              products.map(product => (
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
                    calories={product.nutrition?.['energy-kcal_100g'] ?? 0}
                    protein={product.nutrition?.proteins_100g ?? 0}
                    carbohydrates={product.nutrition?.carbohydrates_100g ?? 0}
                    fat={product.nutrition?.fat_100g ?? 0}
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
