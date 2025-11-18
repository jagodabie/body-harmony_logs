import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { EANCodeScanner } from '../../components/EANCodeScanner/EANCodeScanner';
import type { ProductDetails } from '../../types/MealLogs';
import { Macros } from '../MealLogs/components/Macros/Macros';
import { ProductCard } from './components/ProductCard/ProductCard';
import { ProductSearch } from './components/ProductSearch/ProductSearch';
import { useEanProductSearch } from './hooks/useEanProductSearch';

import './index.css';

export const AddProduct = () => {
  const { mealId } = useParams<{ mealId: string }>();
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(
    null
  );
  const { productDetails, isLoading, handleScanSuccess, clearProduct } =
    useEanProductSearch();

  const handleProductClick = (product: ProductDetails) => {
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
      {/* Scanner i Search - zawsze widoczne gdy nie ma wybranego produktu */}
      {!selectedProduct && (
        <>
          <button
            onClick={() => {
              handleScanSuccess({
                code: '5900531000010',
                type: 'EAN-13',
                isValid: true,
                timestamp: Date.now(),
              });
            }}
          >
            Search Product (Test)
          </button>
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

          {/* Loading state */}
          {isLoading && <div className="add-product__loading">Loading...</div>}

          <div className="search-product__list">
            {products.length > 0 &&
              products.map(product => {
                const nutriments = product.productCode.nutriments;
                return (
                  <div
                    key={product._id}
                    className="search-product__item"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="search-product__item-name">
                      {product.productCode.name}
                    </div>
                    <div className="search-product__item-quantity">
                      Quantity: {product.quantity} g
                    </div>
                    <Macros
                      calories={nutriments['energy-kcal_100g'] || 0}
                      protein={nutriments.proteins_100g || 0}
                      carbohydrates={nutriments.carbohydrates_100g || 0}
                      fat={nutriments.fat_100g || 0}
                      className="search-product__item-macros"
                    />
                  </div>
                );
              })}
          </div>
        </>
      )}

      {/* ProductCard - pokazuje się po kliknięciu w produkt z listy */}
      {selectedProduct && mealId && (
        <ProductCard productDetails={selectedProduct} mealId={mealId} />
      )}
    </div>
  );
};
