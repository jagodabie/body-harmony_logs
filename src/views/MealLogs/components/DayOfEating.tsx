import { useState } from 'react';

import { useDateUtils } from '../../../hooks/useDateUtils';
import { MealLogs, type ProductDetails } from '../../../types/MealLogs';
import { DateMenu } from './DateMenu/DateMenu';
import { Meal } from './Meal/Meal.tsx';

const mealProducts: ProductDetails[] = [
  {
    productId: '1',
    productName: 'Bread',
    productQuantity: 100,
    productCalories: 100,
    productProtein: 10,
    productCarbohydrates: 10,
    productFat: 10,
  },
  {
    productId: '2',
    productName: 'Milk',
    productQuantity: 200,
    productCalories: 200,
    productProtein: 20,
    productCarbohydrates: 20,
    productFat: 20,
  },
  {
    productId: '3',
    productName: 'Eggs',
    productQuantity: 300,
    productCalories: 300,
    productProtein: 30,
    productCarbohydrates: 30,
    productFat: 30,
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

export const DayOfEating = () => {
  const { formatDate } = useDateUtils();
  const [currentDate, setCurrentDate] = useState(new Date());
  return (
    <div className="day-of-eating">
      <div className="day-of-eating__header">
        <DateMenu
          date={formatDate(currentDate)}
          onPrevDateChange={() =>
            setCurrentDate(
              new Date(currentDate.setDate(currentDate.getDate() - 1))
            )
          }
          onNextDateChange={() =>
            setCurrentDate(
              new Date(currentDate.setDate(currentDate.getDate() + 1))
            )
          }
        />
      </div>
      <div className="day-of-eating__body">
        {meals.map(({ mealName, mealTime, mealProducts }, index) => (
          <Meal
            key={`${mealName}-${index}`}
            mealProducts={mealProducts || []}
            mealName={mealName}
            mealTime={mealTime}
            totalMealCalories={100}
            totalMealProtein={10}
            totalMealCarbohydrates={10}
            totalMealFat={10}
          />
        ))}
      </div>
    </div>
  );
};
