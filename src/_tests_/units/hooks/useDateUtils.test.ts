import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useDateUtils } from '../../../hooks/useDateUtils';

describe('useDateUtils', () => {
  describe('getDayOfWeek', () => {
    it('returns correct day name for each day of the week', () => {
      const { result } = renderHook(() => useDateUtils());
      const { getDayOfWeek } = result.current;

      // 2026-03-23 is Monday
      expect(getDayOfWeek(new Date(2026, 2, 23))).toBe('Monday');
      // 2026-03-24 is Tuesday
      expect(getDayOfWeek(new Date(2026, 2, 24))).toBe('Tuesday');
      // 2026-03-25 is Wednesday
      expect(getDayOfWeek(new Date(2026, 2, 25))).toBe('Wednesday');
      // 2026-03-26 is Thursday
      expect(getDayOfWeek(new Date(2026, 2, 26))).toBe('Thursday');
      // 2026-03-27 is Friday
      expect(getDayOfWeek(new Date(2026, 2, 27))).toBe('Friday');
      // 2026-03-28 is Saturday
      expect(getDayOfWeek(new Date(2026, 2, 28))).toBe('Saturday');
      // 2026-03-29 is Sunday
      expect(getDayOfWeek(new Date(2026, 2, 29))).toBe('Sunday');
    });
  });

  describe('formatDate', () => {
    it('formats date as "DayName, D Month YYYY"', () => {
      const { result } = renderHook(() => useDateUtils());
      const { formatDate } = result.current;

      // 2026-03-27 is Friday
      expect(formatDate(new Date(2026, 2, 27))).toBe('Friday, 27 March 2026');
    });

    it('includes correct day of week', () => {
      const { result } = renderHook(() => useDateUtils());
      const output = result.current.formatDate(new Date(2026, 0, 1)); // Thursday
      expect(output).toMatch(/^Thursday/);
    });

    it('includes correct day number', () => {
      const { result } = renderHook(() => useDateUtils());
      const output = result.current.formatDate(new Date(2026, 0, 5));
      expect(output).toContain('5');
    });

    it('includes correct month name', () => {
      const { result } = renderHook(() => useDateUtils());
      const output = result.current.formatDate(new Date(2026, 11, 25)); // December
      expect(output).toContain('December');
    });

    it('includes correct year', () => {
      const { result } = renderHook(() => useDateUtils());
      const output = result.current.formatDate(new Date(2026, 5, 15));
      expect(output).toContain('2026');
    });
  });
});
