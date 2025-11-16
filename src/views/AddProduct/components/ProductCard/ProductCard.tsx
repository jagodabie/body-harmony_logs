import { useMemo, useState } from 'react';

import { InputBase } from '../../../../components/InputBase/InputBase';
import { SelectBase } from '../../../../components/SelectBase/SelectBase';
import type { ProductDetails } from '../../../../types/MealLogs';

import './index.css';

type ProductCardProps = {
  productDetails: ProductDetails;
};

export const ProductCard = ({ productDetails }: ProductCardProps) => {
  const [quantity, setQuantity] = useState<number>(100);
  const [unit, setUnit] = useState<string>('g');

  const productAmountOptions = useMemo(() => {
    const kcalPer100g = productDetails.nutriments['energy-kcal_100g'] || 0;
    const totalQuantity = productDetails.quantity;
    const totalKcal = (totalQuantity * kcalPer100g) / 100;

    return [
      { label: `1 package (${totalQuantity}g)`, value: totalKcal },
      { label: 'per 100g', value: kcalPer100g },
      { label: `1/2 package (${totalQuantity / 2}g)`, value: totalKcal / 2 },
    ];
  }, [productDetails.quantity, productDetails.nutriments]);

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
          <div className="product-card__kcal-list-item" key={option.value}>
            <div className="product-card__kcal-list-item-name">
              {option.label}
            </div>
            <div className="product-card__kcal-list-item-value">
              {option.value} kcal
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
        <div className="product-card__kcal">{quantity} kcal</div>
      </div>
    </div>
  );
};
