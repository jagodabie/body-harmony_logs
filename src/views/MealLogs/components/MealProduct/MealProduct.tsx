import CloseIcon from '@mui/icons-material/Close';

import { Button } from '../../../../components/Button/Button';
import { useMealLogsStore } from '../../../../stores/useMealLogsStore';
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
};

export const Product = ({
  mealId,
  productId,
  name,
  quantity,
  calories,
  protein,
  carbohydrates,
  fat,
}: ProductProps) => {
  const removeProductFromMeal = useMealLogsStore(
    state => state.removeProductFromMeal
  );

  const handleDelete = () => {
    removeProductFromMeal(mealId, productId);
  };

  // Calculate actual macros based on quantity (values are per 100g)
  const multiplier = quantity / 100;
  const actualCalories = Math.round(calories * multiplier);
  const actualProtein = Math.round(protein * multiplier);
  const actualCarbs = Math.round(carbohydrates * multiplier);
  const actualFat = Math.round(fat * multiplier);

  return (
    <div className="meal-product">
      <div className="meal-product__wrapper">
        <div className="meal-product__header">
          <div className="meal-product__name">{name}</div>
        </div>
        <div className="meal-product__quantity">{quantity} g</div>
        <Macros
          calories={actualCalories}
          protein={actualProtein}
          carbohydrates={actualCarbs}
          fat={actualFat}
        />
      </div>
      <div className="meal-product__delete">
        <Button Icon={CloseIcon} onClick={handleDelete} />
      </div>
    </div>
  );
};
