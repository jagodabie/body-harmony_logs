import CloseIcon from '@mui/icons-material/Close';

import { Button } from '../../../../components/Button/Button';
import { useMealLogsStore } from '../../../../stores/useMealLogsStore';
import type { NutrimentsPer100g } from '../../../../types/MealLogs';
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
  nutritionPer100g,
}: ProductProps) => {
  const removeProductFromMeal = useMealLogsStore(
    state => state.removeProductFromMeal
  );

  const handleDelete = async () => {
    try {
      await removeProductFromMeal(mealId, productId);
    } catch (error) {
      console.error('[MealProduct] Failed to remove product:', error);
      // TODO: Show error message to user
    }
  };

  const handleClick = () => {
    console.log('[MealProduct] Clicked:', nutritionPer100g);
  };

  return (
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
      <div className="meal-product__delete">
        <Button Icon={CloseIcon} onClick={handleDelete} />
      </div>
    </div>
  );
};
