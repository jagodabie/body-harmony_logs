import { useState } from 'react';

import { useDateUtils } from '../../../hooks/useDateUtils';
import { MealLogs, type MealProductType } from '../../../types/MealLogs';
import DateMenu from './DateMenu/DateMenu';
import Meal from './Meal/Meal';

const mealProducts: MealProductType[] = [
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

const meals = [
  {
    mealName: MealLogs[0],
    mealTime: '10:00',
    mealProducts: mealProducts,
  },
  {
    mealName: MealLogs[1],
    mealTime: '12:00',
    mealProducts: mealProducts,
  },
  {
    mealName: MealLogs[2],
    mealTime: '14:00',
    mealProducts: mealProducts,
  },
];


const DayOfEating = () => {
  const { formatDate } = useDateUtils();
  const [currentDate, setCurrentDate] = useState(new Date());
  return (
    <div className="day-of-eating">
      <div className="day-of-eating__header">
        <DateMenu
          date={formatDate(currentDate)}
          onPrevDateChange={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)))}
          onNextDateChange={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)))}
        />
      </div>
      <div className="day-of-eating__body">
      {
        meals.map(({ mealName, mealTime, mealProducts }) => (
          <Meal
            mealProducts={mealProducts || []}
            mealName={mealName}
            mealTime={mealTime}
            totalMealCalories={100}
            totalMealProtein={10}
            totalMealCarbohydrates={10}
            totalMealFat={10}
        />
        ))
      }
      </div>
    </div>
  );
};

export default DayOfEating;
