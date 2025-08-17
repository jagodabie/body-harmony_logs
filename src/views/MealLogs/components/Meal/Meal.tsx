import AddIcon from '@mui/icons-material/Add';

import Button from '../../../../components/Button/Button';
import type { MealProductType } from '../../../../types/MealLogs';
import MealProduct from '../MealProduct/MealProduct';

import './index.css';

const Meal = ({
    mealProducts,
    mealName,
    mealTime,
    mealCalories,
}: {
    mealProducts: MealProductType[];
    mealName: string;
    mealTime: string;
    mealCalories: number;
}) => {
  return (
    <div className="meal">
      <div className="meal__header">
            <div className="meal__header-summary">
            <div className="meal__header-title">{mealName} </div>
            <div className="meal__header-calories">{mealCalories} kcal</div>
            <div className="meal__header-time">{mealTime}</div>
        </div>
        <div className="meal__header-actions">
            <Button Icon={AddIcon} onClick={() => console.log('add product')} />
        </div>
      </div>
      <div className="meal__body">
        {mealProducts.map(
          (
            { name, quantity, calories, protein, carbohydrates, fat },
            index
          ) => (
            <MealProduct
              key={`${name}-${index}`}
              name={name}
              quantity={quantity}
              calories={calories}
              protein={protein}
              carbohydrates={carbohydrates}
              fat={fat}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Meal;
