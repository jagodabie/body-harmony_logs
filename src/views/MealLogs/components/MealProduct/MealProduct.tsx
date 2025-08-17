import CloseIcon from '@mui/icons-material/Close';

import Button from '../../../../components/Button/Button';

import './index.css';

type ProductProps = {
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

const Product = ({
  name,
  quantity,
  calories,
  protein,
  carbohydrates,
  fat,
}: ProductProps) => {
  return (
    <div className="item meal-product">
      <div className="meal-product__wrapper">
      <div className="meal-product__header">
        <div className="meal-product__name">{name}</div>
        <div className="meal-product__calories">{calories} kcal</div>
      </div>
      <div className="meal-product__content">
      <div className="meal-product__quantity">{quantity} g</div>
        <div className="meal-product__protein">{protein} g</div>
        <div className="meal-product__carbohydrates">{carbohydrates} g</div>
        <div className="meal-product__fat">{fat} g</div>
      </div>
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

export default Product;
