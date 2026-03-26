import { render, screen } from '@testing-library/react';

import { CalorieProgressBar } from './CalorieProgressBar';

const baseMacros = {
  calories: 1500,
  proteins: 80,
  carbs: 200,
  fat: 50,
};

describe('CalorieProgressBar', () => {
  it('renders consumed and goal calories', () => {
    render(<CalorieProgressBar consumed={baseMacros} calorieGoal={2000} />);

    expect(screen.getByText('1500 kcal')).toBeInTheDocument();
    expect(screen.getByText('/ 2000 kcal')).toBeInTheDocument();
  });

  it('renders macro values — protein, fat, carbs', () => {
    render(
      <CalorieProgressBar
        consumed={baseMacros}
        proteinGoal={110}
        fatGoal={73}
        carbsGoal={384}
      />
    );

    expect(screen.getByText('Protein')).toBeInTheDocument();
    expect(screen.getByText('80/110g')).toBeInTheDocument();

    expect(screen.getByText('Fat')).toBeInTheDocument();
    expect(screen.getByText('50/73g')).toBeInTheDocument();

    expect(screen.getByText('Carbs')).toBeInTheDocument();
    expect(screen.getByText('200/384g')).toBeInTheDocument();
  });

  it('rounds fractional calorie values', () => {
    render(
      <CalorieProgressBar consumed={{ ...baseMacros, calories: 1234.7 }} />
    );
    expect(screen.getByText('1235 kcal')).toBeInTheDocument();
  });

  it('caps calorie fill bar at 100% when goal is exceeded', () => {
    const { container } = render(
      <CalorieProgressBar consumed={{ ...baseMacros, calories: 3000 }} calorieGoal={2000} />
    );
    const fill = container.querySelector('.calorie-bar__fill');
    expect(fill).toHaveStyle({ width: '100%' });
  });

  it('uses default goals when props are not provided', () => {
    render(<CalorieProgressBar consumed={baseMacros} />);

    expect(screen.getByText('/ 2000 kcal')).toBeInTheDocument();
    expect(screen.getByText('80/110g')).toBeInTheDocument();
    expect(screen.getByText('50/73g')).toBeInTheDocument();
    expect(screen.getByText('200/384g')).toBeInTheDocument();
  });
});
