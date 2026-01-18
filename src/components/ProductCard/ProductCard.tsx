import { useMemo, useState } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { useAddProductToMeal } from '../../hooks/useAddProductToMeal/useAddProductToMeal';
import type {
  NutrimentsPer100g,
  ProductDetails,
} from '../../types/MealLogs';
import { calculateCalories } from '../../utils/macrosCalculator';
import { Button } from '../Button/Button';
import { InputBase } from '../InputBase/InputBase';
import { OverlayLoader } from '../OverlayLoader/OverlayLoader';
import { SelectBase } from '../SelectBase/SelectBase';

import './index.css';

type ProductCardProps = {
  productDetails: ProductDetails<NutrimentsPer100g>;
  mealId: string;
};

export const ProductCard = ({ productDetails, mealId }: ProductCardProps) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [unit, setUnit] = useState<string>('g');
  const { addProduct, isAdding } = useAddProductToMeal({
    mealId,
    productDetails,
    unit,
  });
  // TODO : input quantity should be validated
  const productAmountOptions = useMemo(() => {
    const totalQuantity = productDetails.quantity;

    return [
      {
        id: 'full-package',
        label: `1 package (${totalQuantity}g)`,
        value: calculateCalories(productDetails.nutrition, totalQuantity),
        quantity: totalQuantity,
      },
      {
        id: 'per-100g',
        label: 'per 100g',
        value: calculateCalories(productDetails.nutrition, 100),
        quantity: 100,
      },
      {
        id: 'half-package',
        label: `1/2 package (${totalQuantity / 2}g)`,
        value: calculateCalories(productDetails.nutrition, totalQuantity / 2),
        quantity: totalQuantity / 2,
      },
    ];
  }, [productDetails.quantity, productDetails.nutrition]);

  const handleAddProduct = async (productQuantity: number) => {
    await addProduct(productQuantity);
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
                disabled={isAdding}
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
          onChange={e => {
            setQuantity(Number(e.target.value));
          }}
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
          {calculateCalories(productDetails.nutrition, quantity)} kcal
        </div>
        <div className="product-card__quantity-button">
          <Button
            Icon={ArrowForwardIosIcon}
            onClick={() => handleAddProduct(Number(quantity))}
            disabled={isAdding || quantity <= 0}
          />
        </div>
      </div>
      <OverlayLoader isLoading={isAdding} />
    </div>
  );
};





