import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import InputBase from '@mui/material/InputBase';

import Button from '../../components/Button/Button';
import type { MealProductType } from '../../types/MealLogs';
import { Macros } from '../MealLogs/components/Macros/Macros';

import './index.css';

const products: (MealProductType & { caloriesPer100g: number })[] = [
  {
    name: 'Chleb żytni',
    caloriesPer100g: 215,
    quantity: 100,
    calories: 215,
    protein: 10,
    carbohydrates: 10,
    fat: 10,
  },
  {
    name: 'Jajka',
    caloriesPer100g: 215,
    quantity: 100,
    calories: 215,
    protein: 10,
    carbohydrates: 10,
    fat: 10,
  },
  {
    name: 'Pomidory',
    caloriesPer100g: 215,
    quantity: 100,
    calories: 215,
    protein: 10,
    carbohydrates: 10,
    fat: 10,
  }
];

const AddProduct = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleAddProduct = (e: React.ChangeEvent<HTMLInputElement>, product: MealProductType) => {
      if (e.target.checked) {
        setSelectedProducts([...selectedProducts, product.name]);
      } else {
        setSelectedProducts(selectedProducts.filter((name) => name !== product.name));
      }
    };
  
  return (
    <div className="add-product-page">
      <div className="add-product__search">
        <InputBase placeholder="Search" onChange={(e) => console.log(e.target.value)}/>
      </div>
      <div className="add-product__list">
        {products.map((product) => (
          <div  key={product.name} className="add-product__item">
            <div className="add-product__item-name">{product.name}</div>
            <Macros
              calories={product.caloriesPer100g}
              protein={product.protein}
              carbohydrates={product.carbohydrates}
              fat={product.fat}
              className="add-product__item-macros"
            />
            <div className="add-product__item-actions">
             <InputBase
              type="checkbox"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddProduct(e, product)}
             />
            </div>
          </div>
        ))}
      </div>
        <Button 
          Icon={AddIcon}
          className="add-product__add-button"
          onClick={() => console.log('add product')}
          label="Dodaj"
        />
    </div>
  );
};

export default AddProduct;
