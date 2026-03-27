import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductCard } from '../../../components/ProductCard/ProductCard';
import type { ProductDetails } from '../../../types/MealLogs';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockAddProduct = vi.fn();

vi.mock('../../../hooks/useAddProductToMeal', () => ({
  useAddProductToMeal: () => ({ addProduct: mockAddProduct, isAdding: false }),
}));

vi.mock('../../../components/OverlayLoader/OverlayLoader', () => ({
  OverlayLoader: () => null,
}));

// ─── Test data ───────────────────────────────────────────────────────────────

const PRODUCT: ProductDetails = {
  id: 'prod-1',
  mealId: 'meal-1',
  code: '5901234123457',
  name: 'Oat Flakes',
  brands: 'Brand X',
  quantity: 500,
  unit: 'g',
  nutrientsPer100g: { calories: 370, proteins: 13, carbs: 60, fat: 7 },
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('product info', () => {
    it('renders product name', () => {
      render(<ProductCard productDetails={PRODUCT} mealId="meal-1" />);
      expect(screen.getByText(/Oat Flakes/)).toBeInTheDocument();
    });

    it('renders brand alongside name', () => {
      render(<ProductCard productDetails={PRODUCT} mealId="meal-1" />);
      expect(screen.getByText(/Brand X/)).toBeInTheDocument();
    });

    it('does not render brand separator when brands is empty', () => {
      const nobrands = { ...PRODUCT, brands: '' };
      render(<ProductCard productDetails={nobrands} mealId="meal-1" />);
      expect(screen.queryByText(/ - /)).not.toBeInTheDocument();
    });
  });

  describe('calorie options', () => {
    it('renders full package option with calculated kcal', () => {
      render(<ProductCard productDetails={PRODUCT} mealId="meal-1" />);
      // 500g * 370/100 = 1850 kcal
      expect(screen.getByText('1 package (500g)')).toBeInTheDocument();
      expect(screen.getByText('1850 kcal')).toBeInTheDocument();
    });

    it('renders per 100g option', () => {
      render(<ProductCard productDetails={PRODUCT} mealId="meal-1" />);
      expect(screen.getByText('per 100g')).toBeInTheDocument();
      expect(screen.getByText('370 kcal')).toBeInTheDocument();
    });

    it('renders half package option', () => {
      render(<ProductCard productDetails={PRODUCT} mealId="meal-1" />);
      expect(screen.getByText('1/2 package (250g)')).toBeInTheDocument();
      expect(screen.getByText('925 kcal')).toBeInTheDocument();
    });
  });

  describe('adding product via quick options', () => {
    it('calls addProduct with full package quantity on button click', async () => {
      render(<ProductCard productDetails={PRODUCT} mealId="meal-1" />);
      const buttons = screen.getAllByRole('button');
      await userEvent.click(buttons[0]);
      expect(mockAddProduct).toHaveBeenCalledWith(500);
    });

    it('calls addProduct with 100 for per-100g option', async () => {
      render(<ProductCard productDetails={PRODUCT} mealId="meal-1" />);
      const buttons = screen.getAllByRole('button');
      await userEvent.click(buttons[1]);
      expect(mockAddProduct).toHaveBeenCalledWith(100);
    });

    it('calls addProduct with half package quantity', async () => {
      render(<ProductCard productDetails={PRODUCT} mealId="meal-1" />);
      const buttons = screen.getAllByRole('button');
      await userEvent.click(buttons[2]);
      expect(mockAddProduct).toHaveBeenCalledWith(250);
    });
  });

  describe('custom quantity input', () => {
    it('renders quantity input', () => {
      render(<ProductCard productDetails={PRODUCT} mealId="meal-1" />);
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('updates calorie display when quantity is entered', async () => {
      render(<ProductCard productDetails={PRODUCT} mealId="meal-1" />);
      const input = screen.getByRole('spinbutton');
      await userEvent.clear(input);
      await userEvent.type(input, '200');
      // 200g * 370/100 = 740 kcal
      expect(screen.getByText('740 kcal')).toBeInTheDocument();
    });
  });
});
