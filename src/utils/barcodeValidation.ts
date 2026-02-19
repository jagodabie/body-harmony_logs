/**
 * Barcode validation utilities: mode detection and check-digit validation
 * for EAN-8 and EAN-13.
 */

const DIGITS_ONLY = /^\d+$/;

const EAN8_LEN = 8;
const EAN13_LEN = 13;

const BARCODE_LENGTHS = [EAN8_LEN, EAN13_LEN] as const;

export type SearchMode = 'text' | 'barcode';

export type BarcodeValidationState = 'idle' | 'typing' | 'invalid' | 'valid';

/**
 * Determines whether the input should be treated as barcode or text search.
 * Barcode mode only when input is digits-only and length is 8 or 13.
 */
export const detectSearchMode = (input: string): SearchMode => {
  const trimmed = input.trim();
  if (trimmed.length === 0) return 'text';
  if (!DIGITS_ONLY.test(trimmed)) return 'text';
  return BARCODE_LENGTHS.includes(
    trimmed.length as (typeof BARCODE_LENGTHS)[number]
  )
    ? 'barcode'
    : 'text';
};

/**
 * EAN-13 check digit: positions 1–12 weighted 1,3,1,3,…; 13th digit = (10 - sum mod 10) mod 10.
 */
export const validateEAN13 = (code: string): boolean => {
  if (!/^\d{13}$/.test(code)) return false;
  const digits = code.split('').map(Number);
  const sum = digits
    .slice(0, 12)
    .reduce((acc, d, i) => acc + d * (i % 2 === 0 ? 1 : 3), 0);
  const check = (10 - (sum % 10)) % 10;
  return check === digits[12];
};

/**
 * EAN-8 check digit: positions 1–7 weighted 3,1,3,1,…; 8th digit = (10 - sum mod 10) mod 10.
 */
export const validateEAN8 = (code: string): boolean => {
  if (!/^\d{8}$/.test(code)) return false;
  const digits = code.split('').map(Number);
  const sum = digits
    .slice(0, 7)
    .reduce((acc, d, i) => acc + d * (i % 2 === 0 ? 3 : 1), 0);
  const check = (10 - (sum % 10)) % 10;
  return check === digits[7];
};

/**
 * Synchronous barcode validation state for inline UI feedback.
 * Returns 'idle' for empty/text input, 'typing' for digits not yet matching
 * a barcode length, 'valid'/'invalid' for complete barcode-length input.
 */
export const getBarcodeValidationState = (
  input: string
): BarcodeValidationState => {
  const trimmed = input.trim();
  if (trimmed.length === 0) return 'idle';
  if (!DIGITS_ONLY.test(trimmed)) return 'idle';
  if (
    !BARCODE_LENGTHS.includes(
      trimmed.length as (typeof BARCODE_LENGTHS)[number]
    )
  )
    return 'typing';
  return isValidBarcode(trimmed) ? 'valid' : 'invalid';
};

/**
 * Validates barcode by length and corresponding check-digit algorithm.
 * Does not call API; use only after detectSearchMode returns "barcode".
 */
export const isValidBarcode = (code: string): boolean => {
  const len = code.length;
  switch (len) {
    case EAN8_LEN:
      return validateEAN8(code);
    case EAN13_LEN:
      return validateEAN13(code);
    default:
      return false;
  }
};
