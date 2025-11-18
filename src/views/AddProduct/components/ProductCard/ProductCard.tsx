import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { Button } from '../../../../components/Button/Button';
import { InputBase } from '../../../../components/InputBase/InputBase';
import { SelectBase } from '../../../../components/SelectBase/SelectBase';
import { useProductMacrosCalculator } from '../../../../hooks/useProductMacrosCalculator/useProductMacrosCalculator';
import { useMealLogsStore } from '../../../../stores/useMealLogsStore';
import type { ProductDetails } from '../../../../types/MealLogs';

import './index.css';

type ProductCardProps = {
  productDetails: ProductDetails;
  mealId: string;
};

export const ProductCard = ({ productDetails, mealId }: ProductCardProps) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState<number>(200);
  const [unit, setUnit] = useState<string>('g');
  const { calculateCalories } = useProductMacrosCalculator();
  const { addProductToMeal } = useMealLogsStore();

  // TODO: set quantity based on unit
  // TODO : input quantity should be validated
  const productAmountOptions = useMemo(() => {
    const totalQuantity = productDetails.quantity;

    return [
      {
        id: 'full-package',
        label: `1 package (${totalQuantity}g)`,
        value: calculateCalories(productDetails.nutriments, totalQuantity),
        quantity: totalQuantity,
      },
      {
        id: 'per-100g',
        label: 'per 100g',
        value: calculateCalories(productDetails.nutriments, 100),
        quantity: 100,
      },
      {
        id: 'half-package',
        label: `1/2 package (${totalQuantity / 2}g)`,
        value: calculateCalories(productDetails.nutriments, totalQuantity / 2),
        quantity: totalQuantity / 2,
      },
    ];
  }, [productDetails.quantity, productDetails.nutriments, calculateCalories]);

  const handleAddProduct = (quantity: number) => {
    const productToAdd: ProductDetails = {
      ...productDetails,
      mealId,
      quantity,
      unit,
    };

    addProductToMeal(mealId, productToAdd);
    navigate('/meal-logs');
  };

  return (
    <div className="product-card">
      <div className="product-card__header">
        <div className="product-card__header-content">
          <div className="product-card__header-content-name">
            {productDetails.name}
            {productDetails.brands && ` - ${productDetails.brands}`}
          </div>
          <div className="product-card__header-content-brand"></div>
        </div>
      </div>
      <div className="product-card__kcal-list">
        {productAmountOptions.map(option => (
          <div className="product-card__kcal-list-item" key={option.id}>
            <div className="product-card__kcal-list-item-name">
              {option.label}
            </div>
            <div className="product-card__kcal-list-item-value">
              {option.value} kcal
            </div>
            <div className="product-card__quantity-button">
              <Button
                Icon={ArrowForwardIosIcon}
                onClick={() => handleAddProduct(option.quantity)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="product-card__quantity">
        <InputBase
          name="quantity"
          label="Quantity"
          placeholder="Quantity"
          type="number"
          min={0}
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          required
        />
        <SelectBase
          name="unit"
          label="Unit"
          placeholder="Select a unit"
          value={unit}
          onChange={e => setUnit(e.target.value)}
          // TODO: for now like that but here should be units connected with the product state
          options={[
            { label: 'g', value: 'g' },
            { label: 'ml', value: 'ml' },
            { label: 'l', value: 'l' },
          ]}
          required
        />
        <div className="product-card__kcal">
          {calculateCalories(productDetails.nutriments, quantity)} kcal
        </div>
        <div className="product-card__quantity-button">
          <Button
            Icon={ArrowForwardIosIcon}
            onClick={() => handleAddProduct(Number(quantity))}
          />
        </div>
      </div>
    </div>
  );
};
