import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DEFAULT_HEIGHT_CM } from '../../../constants';
import { useWeightCalculation } from '../../../hooks/useWeightCalculation';

describe('useWeightCalculation', () => {
  describe('BMI calculation', () => {
    it('calculates BMI correctly for given weight and height', () => {
      // 70kg / (1.75m)^2 = 22.857... → "22.9"
      const { result } = renderHook(() =>
        useWeightCalculation({ weight: 70, height: 175 })
      );
      expect(result.current.bmi).toBe('22.9');
    });

    it('uses DEFAULT_HEIGHT_CM (170) when height is omitted', () => {
      // 70kg / (1.70m)^2 = 24.221... → "24.2"
      const { result } = renderHook(() =>
        useWeightCalculation({ weight: 70 })
      );
      const expected = (70 / ((DEFAULT_HEIGHT_CM / 100) ** 2)).toFixed(1);
      expect(result.current.bmi).toBe(expected);
    });

    it('returns BMI as string with one decimal place', () => {
      const { result } = renderHook(() =>
        useWeightCalculation({ weight: 80, height: 180 })
      );
      expect(result.current.bmi).toMatch(/^\d+\.\d$/);
    });
  });

  describe('BMI categories', () => {
    it('returns "Underweight" and isHealthyWeight=false for BMI < 18.5', () => {
      // 50kg / (1.80m)^2 = 15.4 → Underweight
      const { result } = renderHook(() =>
        useWeightCalculation({ weight: 50, height: 180 })
      );
      expect(result.current.bmiCategory).toBe('Underweight');
      expect(result.current.isHealthyWeight).toBe(false);
    });

    it('returns "Normal" and isHealthyWeight=true for BMI 18.5–24.9', () => {
      // 70kg / (1.75m)^2 ≈ 22.9 → Normal
      const { result } = renderHook(() =>
        useWeightCalculation({ weight: 70, height: 175 })
      );
      expect(result.current.bmiCategory).toBe('Normal');
      expect(result.current.isHealthyWeight).toBe(true);
    });

    it('returns "Overweight" and isHealthyWeight=false for BMI 25–29.9', () => {
      // 90kg / (1.80m)^2 ≈ 27.8 → Overweight
      const { result } = renderHook(() =>
        useWeightCalculation({ weight: 90, height: 180 })
      );
      expect(result.current.bmiCategory).toBe('Overweight');
      expect(result.current.isHealthyWeight).toBe(false);
    });

    it('returns "Obesity" and isHealthyWeight=false for BMI >= 30', () => {
      // 120kg / (1.80m)^2 ≈ 37.0 → Obesity
      const { result } = renderHook(() =>
        useWeightCalculation({ weight: 120, height: 180 })
      );
      expect(result.current.bmiCategory).toBe('Obesity');
      expect(result.current.isHealthyWeight).toBe(false);
    });

    it('categorizes BMI exactly at boundary 18.5 as Normal', () => {
      // Find weight that gives exactly BMI 18.5 at 180cm
      // w = 18.5 * 1.8^2 = 18.5 * 3.24 = 59.94kg
      const weight = 18.5 * (1.8 * 1.8);
      const { result } = renderHook(() =>
        useWeightCalculation({ weight, height: 180 })
      );
      expect(result.current.bmiCategory).toBe('Normal');
    });

    it('categorizes BMI exactly at boundary 25 as Overweight', () => {
      // w = 25 * 1.8^2 = 81kg
      const weight = 25 * (1.8 * 1.8);
      const { result } = renderHook(() =>
        useWeightCalculation({ weight, height: 180 })
      );
      expect(result.current.bmiCategory).toBe('Overweight');
    });

    it('categorizes BMI exactly at boundary 30 as Obesity', () => {
      // w = 30 * 1.8^2 = 97.2kg
      const weight = 30 * (1.8 * 1.8);
      const { result } = renderHook(() =>
        useWeightCalculation({ weight, height: 180 })
      );
      expect(result.current.bmiCategory).toBe('Obesity');
    });
  });

  describe('return shape', () => {
    it('returns bmi, bmiCategory, and isHealthyWeight', () => {
      const { result } = renderHook(() =>
        useWeightCalculation({ weight: 70, height: 175 })
      );
      expect(result.current).toHaveProperty('bmi');
      expect(result.current).toHaveProperty('bmiCategory');
      expect(result.current).toHaveProperty('isHealthyWeight');
    });
  });
});
