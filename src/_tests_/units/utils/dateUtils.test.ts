import { describe, expect,it } from 'vitest';

import { formatDate, formatTime } from '../../../utils/dateUtils';

describe('formatDate', () => {
  it('formats date to "Month Day, Year" (en-US locale)', () => {
    expect(formatDate('2026-03-27T12:00:00.000Z')).toMatch(/March/);
    expect(formatDate('2026-03-27T12:00:00.000Z')).toMatch(/2026/);
  });

  it('includes day number in output', () => {
    const result = formatDate('2026-01-05T00:00:00.000Z');
    expect(result).toMatch(/5/);
    expect(result).toMatch(/January/);
  });

  it('handles end-of-year date', () => {
    const result = formatDate('2025-12-31T12:00:00.000Z');
    expect(result).toMatch(/December/);
    expect(result).toMatch(/2025/);
  });

  it('handles leap day', () => {
    const result = formatDate('2024-02-29T12:00:00.000Z');
    expect(result).toMatch(/February/);
    expect(result).toMatch(/2024/);
  });

  it('returns a non-empty string', () => {
    expect(formatDate('2026-03-27T00:00:00.000Z')).toBeTruthy();
  });
});

describe('formatTime', () => {
  it('returns time in HH:MM AM/PM format', () => {
    const result = formatTime('2026-03-27T14:30:00.000Z');
    expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
  });

  it('returns a non-empty string', () => {
    expect(formatTime('2026-03-27T08:00:00.000Z')).toBeTruthy();
  });

  it('includes AM for morning times (UTC)', () => {
    // 08:00 UTC is AM in en-US
    const result = formatTime('2026-03-27T08:00:00.000Z');
    expect(result).toMatch(/AM/);
  });

  it('includes PM for afternoon times (UTC)', () => {
    // 14:00 UTC is PM in en-US
    const result = formatTime('2026-03-27T14:00:00.000Z');
    expect(result).toMatch(/PM/);
  });

  it('formats midnight correctly', () => {
    const result = formatTime('2026-03-27T00:00:00.000Z');
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });
});
