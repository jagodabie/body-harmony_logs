import { useState } from 'react';

import { EANCodeScanner } from '../../components/EANCodeScanner/EANCodeScanner';
import type { MealProductType } from '../../types/MealLogs';
import { Macros } from '../MealLogs/components/Macros/Macros';
import Search from './components/Search';

import './index.css';

const products: (MealProductType & { caloriesPer100g: number })[] = [
  {
    id: '1',
    name: 'Chleb żytni',
    caloriesPer100g: 215,
    quantity: 100,
    calories: 215,
    protein: 10,
    carbohydrates: 10,
    fat: 10,
  },
  {
    id: '2',
    name: 'Jajka',
    caloriesPer100g: 215,
    quantity: 100,
    calories: 215,
    protein: 10,
    carbohydrates: 10,
    fat: 10,
  },
  {
    id: '3',
    name: 'Pomidory',
    caloriesPer100g: 215,
    quantity: 100,
    calories: 215,
    protein: 10,
    carbohydrates: 10,
    fat: 10,
  },
];

const AddProduct = () => {
  const [selectedProducts, setSelectedProducts] = useState<string>('');

  const handleProductClick = (productId: string) => {
    setSelectedProducts(prev => 
      prev === productId ? '' : productId
    );
  };
  return (
    <div className="add-product-page">
      <div className="add-product__search">
        <Search />
        <EANCodeScanner />
      </div>
      <div className="add-product__list">
        {products.map((product) => (
          <div 
            key={product.id} 
            className={`add-product__item ${
              selectedProducts === product.id ? 'add-product__item--selected' : ''
            }`}
            onClick={() => handleProductClick(product.id)}
          >
            <div className="add-product__item-name">{product.name}</div>
            <Macros
              calories={product.caloriesPer100g}
              protein={product.protein}
              carbohydrates={product.carbohydrates}
              fat={product.fat}
              className="add-product__item-macros"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddProduct;
