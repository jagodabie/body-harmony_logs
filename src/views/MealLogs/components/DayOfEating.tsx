import { MealLogs } from '../../../types/MealLogs';
import DateMenu from './DateMenu/DateMenu';
import Meal from './Meal/Meal';

const mealProducts = [
  {
    name: 'Bread',
    quantity: 100,
    calories: 100,
    protein: 10,
    carbohydrates: 10,
    fat: 10,
  },
  {
    name: 'Milk',
    quantity: 200,
    calories: 200,
    protein: 20,
    carbohydrates: 20,
    fat: 20,
  },
  {
    name: 'Eggs',
    quantity: 300,
    calories: 300,
    protein: 30,
    carbohydrates: 30,
    fat: 30,
  },
];


const DayOfEating = () => {
  return <div className="day-of-eating">
    <h1>Day of Eating</h1>
    <div className="day-of-eating__header">
        <div className="day-of-eating__header">
            <DateMenu date="2025-08-12" onPrevDateChange={() => console.log('prev') } onNextDateChange={() => console.log('next')} />
        </div>
    </div>
    <div className="day-of-eating__body">    
        <Meal 
            mealProducts={mealProducts}
            mealName={MealLogs[0]}
            mealTime="10:00"
            mealCalories={100}
        />
    </div>
    </div>;
};

export default DayOfEating;