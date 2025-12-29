import { useEffect, useState } from 'react';

import { SyncIndicator } from '../../../components/SyncIndicator';
import { useDateUtils } from '../../../hooks/useDateUtils';
import { useMealLogsStore } from '../../../stores/useMealLogsStore';
import { type Meal as MealType } from '../../../types/MealLogs';
import { DateMenu } from '../components/DateMenu/DateMenu';
import { Meal } from '../components/Meal/Meal';
import { formatDateString } from './utils/index';

import '../index.css';

export const DayOfEating = () => {
  const { formatDate } = useDateUtils();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { meals, isLoading, error, fetchCurrentDayMeals } = useMealLogsStore();

  const currentDateString = formatDateString(currentDate);

  useEffect(() => {
    fetchCurrentDayMeals(currentDateString);
  }, [currentDateString, fetchCurrentDayMeals]);

  const handlePrevDate = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
    fetchCurrentDayMeals(formatDateString(newDate), true);
  };

  const handleNextDate = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
    fetchCurrentDayMeals(formatDateString(newDate), true);
  };

  console.log('[DayOfEating] Meals:', meals);

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
          onPrevDateChange={handlePrevDate}
          onNextDateChange={handleNextDate}
        />
      </div>
      <div className="day-of-eating__body">
        {isLoading ? (
          <div className="day-of-eating__loading">Loading meals...</div>
        ) : (
          meals.map((meal: MealType) => {
            return (
              <Meal
                key={meal._id}
                mealId={meal._id}
                products={meal.products}
                mealName={meal.name}
                mealTime={meal.time}
                macros={meal.macros}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
