import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { ProductDetailsResponseBody } from '../../../types/MealLogs';
import { Meal } from '../../../views/MealLogs/components/Meal/Meal';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../../stores/useMealLogsStore', () => ({
  useMealLogsStore: (selector: (s: unknown) => unknown) =>
    selector({ removeProductFromMeal: vi.fn().mockResolvedValue(undefined) }),
}));

// ─── Test data ───────────────────────────────────────────────────────────────

const MACROS = { calories: 500, proteins: 20, carbs: 60, fat: 15 };

const PRODUCT: ProductDetailsResponseBody = {
  id: 'prod-1',
  mealId: 'meal-1',
  productCode: '12345',
  name: 'Oat Flakes',
  brands: 'Brand X',
  quantity: 100,
  unit: 'g',
  nutrientsPer100g: { calories: 370, proteins: 13, carbs: 60, fat: 7 },
  nutrientsPerPortion: { calories: 370, proteins: 13, carbs: 60, fat: 7 },
};

const defaultProps = {
  mealId: 'meal-1',
  mealName: 'Breakfast',
  mealTime: '08:00',
  macros: MACROS,
  products: [] as ProductDetailsResponseBody[],
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Meal', () => {
  describe('rendering', () => {
    it('renders meal name', () => {
      render(<Meal {...defaultProps} />);
      expect(screen.getByText('Breakfast')).toBeInTheDocument();
    });

    it('renders meal time', () => {
      render(<Meal {...defaultProps} />);
      expect(screen.getByText('08:00')).toBeInTheDocument();
    });

    it('renders macros', () => {
      render(<Meal {...defaultProps} />);
      expect(screen.getByText('500 kcal')).toBeInTheDocument();
    });

    it('renders collapsed by default (has meal--collapsed class)', () => {
      const { container } = render(<Meal {...defaultProps} />);
      expect(container.querySelector('.meal')).toHaveClass('meal--collapsed');
    });
  });

  describe('expand / collapse', () => {
    it('expand button is disabled when there are no products', () => {
      render(<Meal {...defaultProps} products={[]} />);
      const buttons = screen.getAllByRole('button');
      // First button is expand toggle
      expect(buttons[0]).toBeDisabled();
    });

    it('expand button is enabled when products exist', () => {
      render(<Meal {...defaultProps} products={[PRODUCT]} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).not.toBeDisabled();
    });

    it('expands meal body on expand button click', async () => {
      const { container } = render(<Meal {...defaultProps} products={[PRODUCT]} />);
      const buttons = screen.getAllByRole('button');
      await userEvent.click(buttons[0]);
      expect(container.querySelector('.meal__body')).toHaveClass('meal__body--expanded');
    });

    it('collapses meal after two clicks', async () => {
      const { container } = render(<Meal {...defaultProps} products={[PRODUCT]} />);
      const buttons = screen.getAllByRole('button');
      await userEvent.click(buttons[0]);
      await userEvent.click(buttons[0]);
      expect(container.querySelector('.meal')).toHaveClass('meal--collapsed');
    });

    it('renders product list when expanded', async () => {
      render(<Meal {...defaultProps} products={[PRODUCT]} />);
      const buttons = screen.getAllByRole('button');
      await userEvent.click(buttons[0]);
      // capitalizeFirstLetter('Oat Flakes') → 'Oat flakes'
      expect(screen.getByText('Oat flakes')).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('navigates to add-product when add button is clicked', async () => {
      render(<Meal {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      // Last button is the Add (+) button
      await userEvent.click(buttons[buttons.length - 1]);
      expect(mockNavigate).toHaveBeenCalledWith('/add-product/meal-1');
    });
  });
});
