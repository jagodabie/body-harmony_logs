import { describe, expect,it } from 'vitest';

import type { MacroNutrients } from '../../../types/MealLogs';
import {
  calculateCalories,
  calculateMacros,
} from '../../../utils/macrosCalculator';

const BASE_MACROS: MacroNutrients = {
  calories: 200,
  proteins: 10,
  carbs: 30,
  fat: 5,
};

describe('calculateCalories', () => {
  it('returns correct calories for 100g (ratio 1)', () => {
    expect(calculateCalories(BASE_MACROS, 100)).toBe(200);
  });

  it('scales calories proportionally for 50g', () => {
    expect(calculateCalories(BASE_MACROS, 50)).toBe(100);
  });

  it('rounds to nearest integer', () => {
    const macros: MacroNutrients = { ...BASE_MACROS, calories: 333 };
    expect(calculateCalories(macros, 50)).toBe(167); // 166.5 → 167
  });

  it('returns 0 when quantity is 0', () => {
    expect(calculateCalories(BASE_MACROS, 0)).toBe(0);
  });

  it('returns 0 when quantity is negative', () => {
    expect(calculateCalories(BASE_MACROS, -10)).toBe(0);
  });

  it('returns 0 when nutrientsPer100g is undefined', () => {
    expect(calculateCalories(undefined, 100)).toBe(0);
  });

  it('handles large quantities', () => {
    expect(calculateCalories(BASE_MACROS, 1000)).toBe(2000);
  });

  it('handles calories of 0', () => {
    const macros: MacroNutrients = { ...BASE_MACROS, calories: 0 };
    expect(calculateCalories(macros, 100)).toBe(0);
  });
});

describe('calculateMacros', () => {
  it('returns correct macros for 100g', () => {
    expect(calculateMacros(BASE_MACROS, 100)).toEqual({
      calories: 200,
      proteins: 10,
      carbs: 30,
      fat: 5,
    });
  });

  it('scales all macros for 50g', () => {
    expect(calculateMacros(BASE_MACROS, 50)).toEqual({
      calories: 100,
      proteins: 5,
      carbs: 15,
      fat: 2.5,
    });
  });

  it('rounds proteins/carbs/fat to 1 decimal', () => {
    const macros: MacroNutrients = {
      calories: 100,
      proteins: 10,
      carbs: 10,
      fat: 10,
    };
    const result = calculateMacros(macros, 33);
    expect(result.proteins).toBe(3.3);
    expect(result.carbs).toBe(3.3);
    expect(result.fat).toBe(3.3);
  });

  it('returns zeros when quantity is 0', () => {
    expect(calculateMacros(BASE_MACROS, 0)).toEqual({
      calories: 0,
      proteins: 0,
      carbs: 0,
      fat: 0,
    });
  });

  it('returns zeros when quantity is negative', () => {
    expect(calculateMacros(BASE_MACROS, -50)).toEqual({
      calories: 0,
      proteins: 0,
      carbs: 0,
      fat: 0,
    });
  });

  it('returns zeros when nutrientsPer100g is undefined', () => {
    expect(calculateMacros(undefined, 100)).toEqual({
      calories: 0,
      proteins: 0,
      carbs: 0,
      fat: 0,
    });
  });

  it('returns numbers (not strings) for all fields', () => {
    const result = calculateMacros(BASE_MACROS, 75);
    expect(typeof result.calories).toBe('number');
    expect(typeof result.proteins).toBe('number');
    expect(typeof result.carbs).toBe('number');
    expect(typeof result.fat).toBe('number');
  });
});
