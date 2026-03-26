import type { Nullable } from '../../../../types/BodyLog';
import type { MacroNutrients } from '../../../../types/MealLogs';
import { MacroBar } from './MacroBar/MacroBar';

import './index.css';

type CalorieProgressBarProps = {
  consumed: Nullable<MacroNutrients>;
  calorieGoal?: number;
  proteinGoal?: number;
  carbsGoal?: number;
  fatGoal?: number;
  className?: string;
};

export const CalorieProgressBar = ({
  consumed,
  calorieGoal = 2000,
  proteinGoal = 110,
  carbsGoal = 384,
  fatGoal = 73,
  className = '',
}: CalorieProgressBarProps) => {
  const calories = consumed?.calories ?? 0;

  const caloriePercent =
    calorieGoal > 0 ? Math.min((calories / calorieGoal) * 100, 100) : 0;

  return (
    <div className={`calorie-bar ${className}`}>
      <div className="calorie-bar__calories-row">
        <span className="calorie-bar__calories-consumed">
          {Math.round(calories)} kcal
        </span>
        <span className="calorie-bar__calories-goal">/ {calorieGoal} kcal</span>
      </div>
      <div className="calorie-bar__track">
        <div
          className="calorie-bar__fill"
          style={{ width: `${caloriePercent}%` }}
        />
      </div>
      <div className="calorie-bar__macros">
        <MacroBar label="Protein" consumed={Math.round(consumed?.proteins ?? 0)} goal={proteinGoal} />
        <MacroBar label="Fat" consumed={Math.round(consumed?.fat ?? 0)} goal={fatGoal} />
        <MacroBar label="Carbs" consumed={Math.round(consumed?.carbs ?? 0)} goal={carbsGoal} />
      </div>
    </div>
  );
};
