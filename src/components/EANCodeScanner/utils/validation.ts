import type { BarcodeType } from '../types';

export const detectBarcodeType = (code: string): BarcodeType => {
  if (/^\d{13}$/.test(code)) return 'EAN-13';
  if (/^\d{8}$/.test(code)) return 'EAN-8';
  if (/^\d{12}$/.test(code)) return 'UPC-A';
  if (/^\d{6}$/.test(code)) return 'UPC-E';
  return 'UNKNOWN';
};

export const validateEAN13 = (code: string): boolean => {
  if (!/^\d{13}$/.test(code)) return false;
  
  const digits = code.split('').map(Number);
  const checksum = digits.slice(0, 12).reduce((sum, digit, index) => {
    return sum + digit * (index % 2 === 0 ? 1 : 3);
  }, 0);
  
  const calculatedCheck = (10 - (checksum % 10)) % 10;
  return calculatedCheck === digits[12];
};

export const validateEAN8 = (code: string): boolean => {
  if (!/^\d{8}$/.test(code)) return false;
  
  const digits = code.split('').map(Number);
  const checksum = digits.slice(0, 7).reduce((sum, digit, index) => {
    return sum + digit * (index % 2 === 0 ? 3 : 1);
  }, 0);
  
  const calculatedCheck = (10 - (checksum % 10)) % 10;
  return calculatedCheck === digits[7];
};

export const validateUPC = (code: string): boolean => {
  // Simplified UPC validation - in real app you'd implement proper UPC checksum
  return /^\d{12}$/.test(code) || /^\d{6}$/.test(code);
};

export const validateBarcode = (code: string, validateChecksum = true): boolean => {
  const type = detectBarcodeType(code);
  
  if (!validateChecksum) {
    return type !== 'UNKNOWN';
  }
  
  switch (type) {
    case 'EAN-13':
      return validateEAN13(code);
    case 'EAN-8':
      return validateEAN8(code);
    case 'UPC-A':
    case 'UPC-E':
      return validateUPC(code);
    default:
      return false;
  }
};
