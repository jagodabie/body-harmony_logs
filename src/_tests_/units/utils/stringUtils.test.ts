import { describe, expect,it } from 'vitest';

import { capitalizeFirstLetter } from '../../../utils/stringUtils';

describe('capitalizeFirstLetter', () => {
  it('capitalizes first letter and lowercases the rest', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
  });

  it('lowercases an all-caps string', () => {
    expect(capitalizeFirstLetter('WORLD')).toBe('World');
  });

  it('handles mixed case input', () => {
    expect(capitalizeFirstLetter('hELLO wORLD')).toBe('Hello world');
  });

  it('handles single character', () => {
    expect(capitalizeFirstLetter('a')).toBe('A');
  });

  it('returns empty string unchanged', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });

  it('handles string that is already correctly capitalized', () => {
    expect(capitalizeFirstLetter('Hello')).toBe('Hello');
  });

  it('handles string starting with a number', () => {
    expect(capitalizeFirstLetter('1abc')).toBe('1abc');
  });
});
