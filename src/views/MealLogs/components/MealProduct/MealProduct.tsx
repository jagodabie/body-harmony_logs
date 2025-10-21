import CloseIcon from '@mui/icons-material/Close';

import { Button } from '../../../../components/Button/Button';
import { Macros } from '../Macros/Macros';

import './index.css';

type ProductProps = {
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

export const Product = ({
  name,
  quantity,
  calories,
  protein,
  carbohydrates,
  fat,
}: ProductProps) => {
  return (
    <div className="meal-product">
      <div className="meal-product__wrapper">
        <div className="meal-product__header">
          <div className="meal-product__name">{name}</div>
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
        <Button
          Icon={CloseIcon}
          onClick={() => console.log('delete product')}
        />
      </div>
    </div>
  );
};
