import { useEffect, useState } from 'react';

import { SyncIndicator } from '../../../components/SyncIndicator';
import { useDateUtils } from '../../../hooks/useDateUtils';
import { useMealLogsStore } from '../../../stores/useMealLogsStore';
import { type Meal as MealType } from '../../../types/MealLogs';
import { DateMenu } from '../components/DateMenu/DateMenu';
import { Meal } from '../components/Meal/Meal';
import { calculateMealTotals, formatDateString, prepareMeals } from './utils/index';

import '../index.css';

export const DayOfEating = () => {
  const { formatDate } = useDateUtils();
  const [currentDate, setCurrentDate] = useState(new Date());
  const {meals, isLoading, error, fetchCurrentDayMeals } = useMealLogsStore();
  const currentDateString = formatDateString(currentDate);

  useEffect(() => {
    fetchCurrentDayMeals(currentDateString);
  }, [currentDateString, fetchCurrentDayMeals]);

  if (error) {
    return (
      <div className="day-of-eating">
        <div className="day-of-eating__error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="day-of-eating">
      <div className="day-of-eating__header">
        <div className="day-of-eating__header-top">
          <SyncIndicator />
        </div>
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
        {isLoading ? (
          <div className="day-of-eating__loading">Loading meals...</div>
        ) : (
          prepareMeals(meals, currentDateString).map((meal: MealType) => {
            // TODO: for now, it will be ready from the backend, but in the future, we will need to calculate the totals here
            const totals = calculateMealTotals(meal.products);

            return (
              <Meal
                key={meal._id}
                mealId={meal._id}
                products={meal.products}
                mealName={meal.name}
                mealTime={meal.time}
                totalMealCalories={Math.round(totals.calories)}
                totalMealProtein={Math.round(totals.protein)}
                totalMealCarbohydrates={Math.round(totals.carbs)}
                totalMealFat={Math.round(totals.fat)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
