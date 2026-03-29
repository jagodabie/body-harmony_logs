import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MealProduct } from '../../../views/MealLogs/components/MealProduct/MealProduct';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockRemoveProductFromMeal = vi.fn();

vi.mock('../../../stores/useMealLogsStore', () => ({
  useMealLogsStore: (selector: (s: unknown) => unknown) =>
    selector({ removeProductFromMeal: mockRemoveProductFromMeal }),
}));

// ─── Tests ───────────────────────────────────────────────────────────────────

const defaultProps = {
  mealId: 'meal-1',
  productId: 'prod-1',
  name: 'oat flakes',
  quantity: 150,
  calories: 370,
  protein: 13,
  carbohydrates: 60,
  fat: 7,
};

describe('MealProduct', () => {
  describe('rendering', () => {
    it('renders capitalized product name', () => {
      render(<MealProduct {...defaultProps} />);
      expect(screen.getByText('Oat flakes')).toBeInTheDocument();
    });

    it('renders quantity in grams', () => {
      render(<MealProduct {...defaultProps} />);
      expect(screen.getByText('150 g')).toBeInTheDocument();
    });

    it('renders macros', () => {
      render(<MealProduct {...defaultProps} />);
      expect(screen.getByText('370 kcal')).toBeInTheDocument();
      expect(screen.getByText('Protein: 13 g')).toBeInTheDocument();
      expect(screen.getByText('Carbs: 60 g')).toBeInTheDocument();
      expect(screen.getByText('Fat: 7 g')).toBeInTheDocument();
    });

    it('renders delete button', () => {
      render(<MealProduct {...defaultProps} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('delete action', () => {
    it('calls removeProductFromMeal with correct ids when delete is clicked', async () => {
      mockRemoveProductFromMeal.mockResolvedValue(undefined);
      render(<MealProduct {...defaultProps} />);
      await userEvent.click(screen.getByRole('button'));
      expect(mockRemoveProductFromMeal).toHaveBeenCalledWith('meal-1', 'prod-1');
    });
  });
});
