import { useEffect, useState } from 'react';

import { OverlayLoader } from '../../components/OverlayLoader/OverlayLoader';
import { useDateUtils } from '../../hooks/useDateUtils';
import { useMealLogsStore } from '../../stores/useMealLogsStore';
import { type Meal as MealType } from '../../types/MealLogs';
import { CalorieProgressBar } from './components/CalorieProgressBar/CalorieProgressBar';
import { DateMenu } from './components/DateMenu/DateMenu';
import { Meal } from './components/Meal/Meal';
import { formatDateString } from './utils/index';

import './index.css';

export const MealLogs = () => {
  const { formatDate } = useDateUtils();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { meals, dailyTotals, isLoading, fetchCurrentDayMeals } = useMealLogsStore();

  const currentDateString = formatDateString(currentDate);

  useEffect(() => {
    fetchCurrentDayMeals(currentDateString, true);
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

  return (
    <div className="day-of-eating">
      <div className="day-of-eating__header">
        <DateMenu
          date={formatDate(currentDate)}
          onPrevDateChange={handlePrevDate}
          onNextDateChange={handleNextDate}
        />
      </div>
      <div className="day-of-eating__body">
        <OverlayLoader isLoading={isLoading} />
        {!isLoading &&
          meals.map((meal: MealType) => {
            return (
              <Meal
                key={meal.id}
                mealId={meal.id}
                products={meal.products}
                mealName={meal.name}
                mealTime={meal.time}
                macros={meal.macros}
              />
            );
          })}
      </div>
      <div className="day-of-eating__footer">
         <CalorieProgressBar consumed={dailyTotals} />
      </div>
    </div>
  );
};
