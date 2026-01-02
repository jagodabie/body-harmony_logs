import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Button } from '../../../../components/Button/Button';
import type {
  MacroNutrients,
  ProductDetailsBody,
} from '../../../../types/MealLogs';
import { Macros } from '../Macros/Macros';
import { MealProduct } from '../MealProduct/MealProduct';

import './index.css';

type MealProps = {
  mealId: string;
  products: ProductDetailsBody[];
  macros: MacroNutrients;
  mealName: string;
  mealTime: string;
};

export const Meal = ({
  mealId,
  products,
  macros,
  mealName,
  mealTime,
}: MealProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const navigate = useNavigate();

  console.log('[Meal] Products:', products);

  return (
    <div className={`meal ${!isExpanded ? 'meal--collapsed' : ''}`}>
      <div className="meal__header">
        <div className="meal__header-content">
          <div className="meal__header-summary">
            <span className="meal__header-title">{mealName}</span>
            <span className="meal__header-expand">
              <Button
                className="meal__header-expand-button"
                Icon={isExpanded ? ExpandLessIcon : ExpandMoreIcon}
                disabled={products.length === 0}
                onClick={handleExpand}
              />
            </span>
            <span className="meal__header-time">{mealTime}</span>
          </div>
          <Macros
            calories={macros?.calories || 0}
            protein={macros?.proteins || 0}
            carbohydrates={macros?.carbs || 0}
            fat={macros?.fat || 0}
            className="meal__header-macros"
          />
        </div>
        <div className="meal__header-actions">
          <Button
            Icon={AddIcon}
            onClick={() => navigate(`/add-product/${mealId}`)}
          />
        </div>
      </div>
      <div className={`meal__body ${isExpanded ? 'meal__body--expanded' : ''}`}>
        {products.map((product: ProductDetailsBody) => {
          console.log('[Meal] Product:', product);
          return (
            <MealProduct
              key={product._id}
              mealId={mealId}
              productId={product._id}
              name={product.name}
              quantity={product.quantity}
              calories={product?.nutrition?.calories}
              protein={product?.nutrition?.proteins}
              carbohydrates={product.nutrition?.carbs}
              fat={product.nutrition?.fat}
            />
          );
        })}
      </div>
    </div>
  );
};
