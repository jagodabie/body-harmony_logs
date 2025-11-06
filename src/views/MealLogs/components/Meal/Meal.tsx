import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Button } from '../../../../components/Button/Button';
import type { ProductDetails } from '../../../../types/MealLogs';
import { Macros } from '../Macros/Macros';
import { Product as MealProduct } from '../MealProduct/MealProduct';

import './index.css';

type MealProps = {
  mealId: string;
  products: ProductDetails[];
  mealName: string;
  mealTime: string;
  totalMealCalories: number;
  totalMealProtein: number;
  totalMealCarbohydrates: number;
  totalMealFat: number;
};

export const Meal = ({
  mealId,
  products,
  mealName,
  mealTime,
  totalMealCalories,
  totalMealProtein,
  totalMealCarbohydrates,
  totalMealFat,
}: MealProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const navigate = useNavigate();

  return (
    <div className="meal">
      <div className="meal__header">
        <div className="meal__header-content">
          <div className="meal__header-summary">
            <span className="meal__header-title">{mealName}</span>
            <span className="meal__header-expand">
              <Button
                className="meal__header-expand-button"
                Icon={isExpanded ? ExpandLessIcon : ExpandMoreIcon}
                onClick={handleExpand}
              />
            </span>
            <span className="meal__header-time">{mealTime}</span>
          </div>
          <Macros
            calories={totalMealCalories}
            protein={totalMealProtein}
            carbohydrates={totalMealCarbohydrates}
            fat={totalMealFat}
            className="meal__header-macros"
          />
        </div>
        <div className="meal__header-actions">
          <Button Icon={AddIcon} onClick={() => navigate('/add-product')} />
        </div>
      </div>
      <div className={`meal__body ${isExpanded ? 'meal__body--expanded' : ''}`}>
        {products.map(product => {
          const nutriments = product.productCode.nutriments;
          return (
            <MealProduct
              key={product._id}
              mealId={mealId}
              productId={product._id}
              name={product.productCode.name}
              quantity={product.quantity}
              calories={nutriments['energy-kcal_100g'] || 0}
              protein={nutriments.proteins_100g || 0}
              carbohydrates={nutriments.carbohydrates_100g || 0}
              fat={nutriments.fat_100g || 0}
            />
          );
        })}
      </div>
    </div>
  );
};
