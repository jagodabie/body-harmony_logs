import { act,renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAddProductToMeal } from '../../../hooks/useAddProductToMeal';
import type { Meal, ProductDetails } from '../../../types/MealLogs';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockCreateMeal = vi.fn();
const mockAddProductToMeal = vi.fn();

const MOCK_MEALS: Meal[] = [
  {
    id: 'meal-1',
    name: 'Breakfast',
    mealType: 'BREAKFAST',
    date: '2026-03-27T08:00:00.000Z',
    time: '08:00',
    notes: null,
    createdAt: '2026-03-27T08:00:00.000Z',
    updatedAt: '2026-03-27T08:00:00.000Z',
    macros: { calories: 0, proteins: 0, carbs: 0, fat: 0 },
    products: [],
  },
  {
    id: 'lunch-temp',
    name: 'Lunch',
    mealType: 'LUNCH',
    date: '2026-03-27T12:00:00.000Z',
    time: '12:00',
    notes: null,
    createdAt: '2026-03-27T12:00:00.000Z',
    updatedAt: '2026-03-27T12:00:00.000Z',
    macros: { calories: 0, proteins: 0, carbs: 0, fat: 0 },
    products: [],
  },
];

vi.mock('../../../stores/useMealLogsStore', () => ({
  useMealLogsStore: () => ({
    createMeal: mockCreateMeal,
    addProductToMeal: mockAddProductToMeal,
    meals: MOCK_MEALS,
  }),
}));

// ─── Test data ───────────────────────────────────────────────────────────────

const PRODUCT: ProductDetails = {
  id: 'prod-1',
  mealId: 'meal-1',
  code: '5901234123457',
  name: 'Test Product',
  nutrientsPer100g: { calories: 200, proteins: 10, carbs: 30, fat: 5 },
  brands: 'Test Brand',
  quantity: 100,
  unit: 'g',
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useAddProductToMeal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('returns isAdding=false initially', () => {
      const { result } = renderHook(() =>
        useAddProductToMeal({ mealId: 'meal-1', productDetails: PRODUCT, unit: 'g' })
      );
      expect(result.current.isAdding).toBe(false);
    });

    it('returns addProduct function', () => {
      const { result } = renderHook(() =>
        useAddProductToMeal({ mealId: 'meal-1', productDetails: PRODUCT, unit: 'g' })
      );
      expect(typeof result.current.addProduct).toBe('function');
    });
  });

  describe('existing meal (no -temp suffix)', () => {
    it('calls addProductToMeal with correct args', async () => {
      const { result } = renderHook(() =>
        useAddProductToMeal({ mealId: 'meal-1', productDetails: PRODUCT, unit: 'g' })
      );

      await act(async () => {
        await result.current.addProduct(150);
      });

      expect(mockAddProductToMeal).toHaveBeenCalledWith('meal-1', {
        productCode: PRODUCT.code,
        quantity: 150,
        unit: 'g',
      });
      expect(mockCreateMeal).not.toHaveBeenCalled();
    });

    it('navigates to /meal-logs with the meal date', async () => {
      const { result } = renderHook(() =>
        useAddProductToMeal({ mealId: 'meal-1', productDetails: PRODUCT, unit: 'g' })
      );

      await act(async () => {
        await result.current.addProduct(100);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/meal-logs?date=2026-03-27');
    });
  });

  describe('temporary meal (-temp suffix)', () => {
    it('calls createMeal instead of addProductToMeal', async () => {
      const { result } = renderHook(() =>
        useAddProductToMeal({ mealId: 'lunch-temp', productDetails: PRODUCT, unit: 'g' })
      );

      await act(async () => {
        await result.current.addProduct(200);
      });

      expect(mockCreateMeal).toHaveBeenCalledWith({
        name: 'Lunch',
        mealType: 'LUNCH',
        date: '2026-03-27T12:00:00.000Z',
        time: '12:00',
        notes: null,
        products: [{ productCode: PRODUCT.code, quantity: 200, unit: 'g' }],
      });
      expect(mockAddProductToMeal).not.toHaveBeenCalled();
    });

    it('navigates to /meal-logs with the temp meal date', async () => {
      const { result } = renderHook(() =>
        useAddProductToMeal({ mealId: 'lunch-temp', productDetails: PRODUCT, unit: 'g' })
      );

      await act(async () => {
        await result.current.addProduct(200);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/meal-logs?date=2026-03-27');
    });
  });

  describe('meal not found', () => {
    it('does not call createMeal or addProductToMeal when meal is missing', async () => {
      const { result } = renderHook(() =>
        useAddProductToMeal({ mealId: 'nonexistent-id', productDetails: PRODUCT, unit: 'g' })
      );

      await act(async () => {
        await result.current.addProduct(100);
      });

      expect(mockCreateMeal).not.toHaveBeenCalled();
      expect(mockAddProductToMeal).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('isAdding state', () => {
    it('resets isAdding to false after successful add', async () => {
      const { result } = renderHook(() =>
        useAddProductToMeal({ mealId: 'meal-1', productDetails: PRODUCT, unit: 'g' })
      );

      await act(async () => {
        await result.current.addProduct(100);
      });

      expect(result.current.isAdding).toBe(false);
    });

    it('resets isAdding to false even when store throws', async () => {
      mockAddProductToMeal.mockRejectedValueOnce(new Error('API error'));

      const { result } = renderHook(() =>
        useAddProductToMeal({ mealId: 'meal-1', productDetails: PRODUCT, unit: 'g' })
      );

      await act(async () => {
        await result.current.addProduct(100);
      });

      expect(result.current.isAdding).toBe(false);
    });
  });
});
