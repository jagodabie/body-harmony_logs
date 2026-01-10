import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

import { Button } from '../../../../components/Button/Button';
import { ProductCard } from '../../../../components/ProductCard/ProductCard';
import { useMealLogsStore } from '../../../../stores/useMealLogsStore';
import type {
  NutrimentsPer100g,
  ProductDetails,
  ProductDetailsResponseBody,
} from '../../../../types/MealLogs';
import { capitalizeFirstLetter } from '../../../../utils/stringUtils';
import { Macros } from '../Macros/Macros';

import './index.css';

type ProductProps = {
  mealId: string;
  productId: string;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  nutritionPer100g: NutrimentsPer100g;
  product: ProductDetailsResponseBody;
};

export const MealProduct = ({
  mealId,
  productId,
  name,
  quantity,
  calories,
  protein,
  carbohydrates,
  fat,
  product,
}: ProductProps) => {
  const [showProductCard, setShowProductCard] = useState(false);
  const removeProductFromMeal = useMealLogsStore(
    state => state.removeProductFromMeal
  );

  const handleDelete = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      await removeProductFromMeal(mealId, productId);
    } catch (error) {
      console.error('[MealProduct] Failed to remove product:', error);
      // TODO: Show error message to user
    }
  };

  const handleClick = () => {
    setShowProductCard(!showProductCard);
  };

  const convertToProductDetails = (
    product: ProductDetailsResponseBody
  ): ProductDetails<NutrimentsPer100g> => {
    return {
      _id: product._id,
      mealId: product.mealId,
      code: product.productCode,
      name: product.name,
      nutrition: product.nutritionPer100g,
      brands: product.brands,
      quantity: product.quantity,
      unit: product.unit,
    };
  };

  return (
    <>
      <div className="meal-product" onClick={handleClick}>
        <div className="meal-product__wrapper">
          <div className="meal-product__header">
            <div className="meal-product__name">
              {capitalizeFirstLetter(name)}
            </div>
          </div>
          <div className="meal-product__quantity">{quantity} g</div>
          <Macros
            calories={calories}
            protein={protein}
            carbohydrates={carbohydrates}
            fat={fat}
          />
        </div>
        <div
          className="meal-product__delete"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
          }}
        >
          <Button Icon={CloseIcon} onClick={handleDelete} />
        </div>
      </div>
      {showProductCard && (
        <ProductCard
          productDetails={convertToProductDetails(product)}
          mealId={mealId}
        />
      )}
    </>
  );
};
