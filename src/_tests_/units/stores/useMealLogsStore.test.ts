import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock persist middleware before store is imported — bypasses localStorage entirely
vi.mock('zustand/middleware', () => ({
  persist: (fn: (set: unknown, get: unknown, api: unknown) => unknown) => fn,
  createJSONStorage: () => ({}),
}));

import { useMealLogsStore } from '../../../stores/useMealLogsStore';
import type { Meal, ProductDetailsBody } from '../../../types/MealLogs';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockFetchMealsByDate = vi.fn();
const mockCreateMealApi = vi.fn();
const mockAddProductToMealApi = vi.fn();
const mockRemoveProductFromMealApi = vi.fn();

vi.mock('../../../api/meals.api', () => ({
  fetchMealsByDate: (...args: unknown[]) => mockFetchMealsByDate(...args),
  createMeal: (...args: unknown[]) => mockCreateMealApi(...args),
  addProductToMeal: (...args: unknown[]) => mockAddProductToMealApi(...args),
  removeProductFromMeal: (...args: unknown[]) =>
    mockRemoveProductFromMealApi(...args),
}));

// Let prepareMeals run as-is (it's pure), but we control API responses
// to keep tests isolated from the view utility.

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeMeal = (id: string, mealType: Meal['mealType'] = 'BREAKFAST'): Meal => ({
  id,
  name: mealType,
  mealType,
  date: '2026-03-27T00:00:00.000Z',
  time: '10:00',
  notes: null,
  createdAt: '2026-03-27T08:00:00.000Z',
  updatedAt: '2026-03-27T08:00:00.000Z',
  macros: { calories: 500, proteins: 20, carbs: 60, fat: 15 },
  products: [],
});

const DAILY_TOTALS = { calories: 500, proteins: 20, carbs: 60, fat: 15 };

const reset = () => {
  useMealLogsStore.setState({
    meals: [],
    dailyTotals: null,
    isLoading: false,
    currentDate: null,
  });
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useMealLogsStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    reset();
  });

  describe('initial state', () => {
    it('has correct defaults', () => {
      const { meals, dailyTotals, isLoading, currentDate } =
        useMealLogsStore.getState();
      expect(meals).toEqual([]);
      expect(dailyTotals).toBeNull();
      expect(isLoading).toBe(false);
      expect(currentDate).toBeNull();
    });
  });

  describe('setMeals', () => {
    it('replaces the meals array', () => {
      const meals = [makeMeal('m1'), makeMeal('m2', 'LUNCH')];
      useMealLogsStore.getState().setMeals(meals);
      expect(useMealLogsStore.getState().meals).toEqual(meals);
    });
  });

  describe('fetchCurrentDayMeals', () => {
    it('fetches meals and updates state', async () => {
      const meal = makeMeal('m1');
      mockFetchMealsByDate.mockResolvedValue({
        meals: [meal],
        dailyTotals: DAILY_TOTALS,
      });

      await useMealLogsStore.getState().fetchCurrentDayMeals('2026-03-27');

      expect(mockFetchMealsByDate).toHaveBeenCalledWith('2026-03-27');
      expect(useMealLogsStore.getState().currentDate).toBe('2026-03-27');
      expect(useMealLogsStore.getState().dailyTotals).toEqual(DAILY_TOTALS);
    });

    it('uses cache when date matches and meals exist (no force)', async () => {
      useMealLogsStore.setState({
        currentDate: '2026-03-27',
        meals: [makeMeal('cached')],
      });

      await useMealLogsStore.getState().fetchCurrentDayMeals('2026-03-27');

      expect(mockFetchMealsByDate).not.toHaveBeenCalled();
    });

    it('bypasses cache when force=true', async () => {
      useMealLogsStore.setState({
        currentDate: '2026-03-27',
        meals: [makeMeal('cached')],
      });
      mockFetchMealsByDate.mockResolvedValue({ meals: [], dailyTotals: null });

      await useMealLogsStore
        .getState()
        .fetchCurrentDayMeals('2026-03-27', true);

      expect(mockFetchMealsByDate).toHaveBeenCalledTimes(1);
    });

    it('fetches when date is different from cached', async () => {
      useMealLogsStore.setState({
        currentDate: '2026-03-26',
        meals: [makeMeal('old')],
      });
      mockFetchMealsByDate.mockResolvedValue({ meals: [], dailyTotals: null });

      await useMealLogsStore.getState().fetchCurrentDayMeals('2026-03-27');

      expect(mockFetchMealsByDate).toHaveBeenCalledWith('2026-03-27');
    });

    it('handles missing dailyTotals from API (sets null)', async () => {
      mockFetchMealsByDate.mockResolvedValue({ meals: [] });

      await useMealLogsStore.getState().fetchCurrentDayMeals('2026-03-27');

      expect(useMealLogsStore.getState().dailyTotals).toBeNull();
    });

    it('resets isLoading to false after fetch', async () => {
      mockFetchMealsByDate.mockResolvedValue({ meals: [], dailyTotals: null });

      await useMealLogsStore.getState().fetchCurrentDayMeals('2026-03-27');

      expect(useMealLogsStore.getState().isLoading).toBe(false);
    });
  });

  describe('createMeal', () => {
    it('calls createMealApi with correct payload', async () => {
      mockCreateMealApi.mockResolvedValue(undefined);
      mockFetchMealsByDate.mockResolvedValue({ meals: [], dailyTotals: null });

      const payload = {
        name: 'Breakfast',
        mealType: 'BREAKFAST' as const,
        date: '2026-03-27T00:00:00.000Z',
        time: '10:00',
        notes: null,
      };

      await useMealLogsStore.getState().createMeal(payload);

      expect(mockCreateMealApi).toHaveBeenCalledWith(payload);
    });

    it('re-fetches current day meals after creation', async () => {
      mockCreateMealApi.mockResolvedValue(undefined);
      mockFetchMealsByDate.mockResolvedValue({ meals: [], dailyTotals: null });

      await useMealLogsStore.getState().createMeal({
        name: 'Lunch',
        mealType: 'LUNCH',
        date: '2026-03-27T12:00:00.000Z',
        time: '12:00',
        notes: null,
      });

      expect(mockFetchMealsByDate).toHaveBeenCalledWith('2026-03-27');
    });
  });

  describe('addProductToMeal', () => {
    const product: ProductDetailsBody = {
      productCode: '5901234123457',
      quantity: 150,
      unit: 'g',
    };

    it('calls addProductToMealApi with correct args', async () => {
      const meal = makeMeal('meal-1');
      useMealLogsStore.setState({ meals: [meal], currentDate: '2026-03-27' });
      mockAddProductToMealApi.mockResolvedValue(undefined);
      mockFetchMealsByDate.mockResolvedValue({ meals: [meal], dailyTotals: null });

      await useMealLogsStore.getState().addProductToMeal('meal-1', product);

      expect(mockAddProductToMealApi).toHaveBeenCalledWith('meal-1', product);
    });

    it('re-fetches meals after adding product', async () => {
      const meal = makeMeal('meal-1');
      useMealLogsStore.setState({ meals: [meal] });
      mockAddProductToMealApi.mockResolvedValue(undefined);
      mockFetchMealsByDate.mockResolvedValue({ meals: [meal], dailyTotals: null });

      await useMealLogsStore.getState().addProductToMeal('meal-1', product);

      expect(mockFetchMealsByDate).toHaveBeenCalledWith('2026-03-27');
    });

    it('does not re-fetch when meal is not found in state', async () => {
      useMealLogsStore.setState({ meals: [] });
      mockAddProductToMealApi.mockResolvedValue(undefined);

      await useMealLogsStore.getState().addProductToMeal('nonexistent', product);

      expect(mockFetchMealsByDate).not.toHaveBeenCalled();
    });
  });

  describe('removeProductFromMeal', () => {
    it('calls removeProductFromMealApi with correct args', async () => {
      const meal = makeMeal('meal-1');
      useMealLogsStore.setState({ meals: [meal] });
      mockRemoveProductFromMealApi.mockResolvedValue(undefined);
      mockFetchMealsByDate.mockResolvedValue({ meals: [meal], dailyTotals: null });

      await useMealLogsStore
        .getState()
        .removeProductFromMeal('meal-1', 'prod-1');

      expect(mockRemoveProductFromMealApi).toHaveBeenCalledWith(
        'meal-1',
        'prod-1'
      );
    });

    it('re-fetches meals after removing product', async () => {
      const meal = makeMeal('meal-1');
      useMealLogsStore.setState({ meals: [meal] });
      mockRemoveProductFromMealApi.mockResolvedValue(undefined);
      mockFetchMealsByDate.mockResolvedValue({ meals: [meal], dailyTotals: null });

      await useMealLogsStore
        .getState()
        .removeProductFromMeal('meal-1', 'prod-1');

      expect(mockFetchMealsByDate).toHaveBeenCalledWith('2026-03-27');
    });
  });
});
