import { useEffect, useState } from 'react';

import { EANCodeScanner } from '../../components/EANCodeScanner/EANCodeScanner';
import type { ProductDetails } from '../../types/MealLogs';
import { Macros } from '../MealLogs/components/Macros/Macros';
import { Search } from './components/Search';
import { useEanProductSearch } from './hooks/useEanProductSearch';

import './index.css';

export const AddProduct = () => {
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string>('');
  const { productDetails, handleScanSuccess } = useEanProductSearch();

  const handleProductClick = (productId: string) => {
    setSelectedProducts(prev => (prev === productId ? '' : productId));
  };

  const handleInvalidScan = (code: string) => {
    console.warn('Invalid barcode scanned:', code);
    // TODO: Show user feedback for invalid scan
  };

  useEffect(() => {
    if (productDetails) {
      setProducts(prev => [...prev, productDetails]);
    }
  }, [productDetails]);

  return (
    <div className="add-product-page">
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
        Search Product
      </button>
      <div className="add-product__search">
        <Search />
        <EANCodeScanner
          onScanSuccess={handleScanSuccess}
          config={{
            validateChecksum: true,
            debounceMs: 1500,
            onInvalidScan: handleInvalidScan,
          }}
        />
      </div>
      <div className="search-product__list">
        {products.length > 0 &&
          products.map(product => (
            <div
              key={product.productId}
              className={`search-product__item ${
                selectedProducts === product.productId
                  ? 'search-product__item--selected'
                  : ''
              }`}
              onClick={() => handleProductClick(product.productId)}
            >
              <div className="search-product__item-name">
                {product.productName}
              </div>
              <div className="search-product__item-quantity">
                Quantity:
                {product.productQuantity} g
              </div>
              <Macros
                calories={product.productCalories}
                protein={product.productProtein}
                carbohydrates={product.productCarbohydrates}
                fat={product.productFat}
                className="search-product__item-macros"
              />
            </div>
          ))}
      </div>
    </div>
  );
};
