import { useCallback, useMemo } from 'react';

import {
  getBarcodeValidationState,
  isValidBarcode,
} from '../../../../../utils/barcodeValidation';
import { getSearchInputValidation, type SearchInputValidation } from './utils';

const DIGITS_ONLY = /^\d+$/;

type UseBarcodeInputParams = {
  value: string;
  onValidBarcodeDetected: (code: string) => void;
  onInvalidBarcode?: (code: string) => void;
};

type UseBarcodeInputReturn = {
  validation: SearchInputValidation;
  submitBarcode: (trimmed: string) => void;
};

export const useBarcodeInput = ({
  value,
  onValidBarcodeDetected,
  onInvalidBarcode,
}: UseBarcodeInputParams): UseBarcodeInputReturn => {
  const barcodeValidation = useMemo(() => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return 'idle' as const;
    return getBarcodeValidationState(trimmed);
  }, [value]);

  const validation = useMemo(
    () => getSearchInputValidation(barcodeValidation, value.trim().length),
    [barcodeValidation, value]
  );

  const submitBarcode = useCallback(
    (trimmed: string) => {
      if (!DIGITS_ONLY.test(trimmed)) return;
      if (isValidBarcode(trimmed)) {
        onValidBarcodeDetected(trimmed);
        return;
      }
      onInvalidBarcode?.(trimmed);
    },
    [onValidBarcodeDetected, onInvalidBarcode]
  );

  return { validation, submitBarcode };
};
