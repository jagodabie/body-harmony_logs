import { describe, expect,it } from 'vitest';

import {
  detectSearchMode,
  getBarcodeValidationState,
  isValidBarcode,
  validateEAN8,
  validateEAN13,
} from '../../../utils/barcodeValidation';

// Real-world valid barcodes
const VALID_EAN13 = '5901234123457';
const VALID_EAN8 = '96385074';

// Same codes with wrong check digit
const INVALID_EAN13 = '5901234123458';
const INVALID_EAN8 = '96385075';

describe('detectSearchMode', () => {
  it('returns "barcode" for valid 13-digit input', () => {
    expect(detectSearchMode('1234567890123')).toBe('barcode');
  });

  it('returns "barcode" for valid 8-digit input', () => {
    expect(detectSearchMode('12345678')).toBe('barcode');
  });

  it('returns "text" for empty string', () => {
    expect(detectSearchMode('')).toBe('text');
  });

  it('returns "text" for whitespace-only string', () => {
    expect(detectSearchMode('   ')).toBe('text');
  });

  it('returns "text" for input containing letters', () => {
    expect(detectSearchMode('abc123')).toBe('text');
  });

  it('returns "text" for digits with wrong length (e.g. 10 digits)', () => {
    expect(detectSearchMode('1234567890')).toBe('text');
  });

  it('trims whitespace before evaluating', () => {
    expect(detectSearchMode('  12345678  ')).toBe('barcode');
  });
});

describe('validateEAN13', () => {
  it('returns true for a valid EAN-13', () => {
    expect(validateEAN13(VALID_EAN13)).toBe(true);
  });

  it('returns false for invalid check digit', () => {
    expect(validateEAN13(INVALID_EAN13)).toBe(false);
  });

  it('returns false for string shorter than 13 digits', () => {
    expect(validateEAN13('123456789012')).toBe(false);
  });

  it('returns false for string longer than 13 digits', () => {
    expect(validateEAN13('12345678901234')).toBe(false);
  });

  it('returns false for non-digit characters', () => {
    expect(validateEAN13('590123412345X')).toBe(false);
  });

  it('returns true for all-zeros EAN-13 (valid check digit)', () => {
    expect(validateEAN13('0000000000000')).toBe(true);
  });
});

describe('validateEAN8', () => {
  it('returns true for a valid EAN-8', () => {
    expect(validateEAN8(VALID_EAN8)).toBe(true);
  });

  it('returns false for invalid check digit', () => {
    expect(validateEAN8(INVALID_EAN8)).toBe(false);
  });

  it('returns false for string shorter than 8 digits', () => {
    expect(validateEAN8('1234567')).toBe(false);
  });

  it('returns false for string longer than 8 digits', () => {
    expect(validateEAN8('123456789')).toBe(false);
  });

  it('returns false for non-digit characters', () => {
    expect(validateEAN8('9638507X')).toBe(false);
  });
});

describe('isValidBarcode', () => {
  it('returns true for valid EAN-13', () => {
    expect(isValidBarcode(VALID_EAN13)).toBe(true);
  });

  it('returns true for valid EAN-8', () => {
    expect(isValidBarcode(VALID_EAN8)).toBe(true);
  });

  it('returns false for invalid EAN-13', () => {
    expect(isValidBarcode(INVALID_EAN13)).toBe(false);
  });

  it('returns false for invalid EAN-8', () => {
    expect(isValidBarcode(INVALID_EAN8)).toBe(false);
  });

  it('returns false for unsupported length (10 digits)', () => {
    expect(isValidBarcode('1234567890')).toBe(false);
  });
});

describe('getBarcodeValidationState', () => {
  it('returns "idle" for empty input', () => {
    expect(getBarcodeValidationState('')).toBe('idle');
  });

  it('returns "idle" for text input (contains letters)', () => {
    expect(getBarcodeValidationState('milk')).toBe('idle');
  });

  it('returns "typing" for digits with non-barcode length (e.g. 5 digits)', () => {
    expect(getBarcodeValidationState('12345')).toBe('typing');
  });

  it('returns "valid" for a valid EAN-13', () => {
    expect(getBarcodeValidationState(VALID_EAN13)).toBe('valid');
  });

  it('returns "valid" for a valid EAN-8', () => {
    expect(getBarcodeValidationState(VALID_EAN8)).toBe('valid');
  });

  it('returns "invalid" for 13-digit string with wrong check digit', () => {
    expect(getBarcodeValidationState(INVALID_EAN13)).toBe('invalid');
  });

  it('returns "invalid" for 8-digit string with wrong check digit', () => {
    expect(getBarcodeValidationState(INVALID_EAN8)).toBe('invalid');
  });

  it('returns "idle" for whitespace-only input', () => {
    expect(getBarcodeValidationState('   ')).toBe('idle');
  });

  it('returns "typing" for digits with non-barcode length after trim', () => {
    expect(getBarcodeValidationState('  123  ')).toBe('typing');
  });
});
