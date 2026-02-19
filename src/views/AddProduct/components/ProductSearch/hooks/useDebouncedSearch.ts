import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  type BarcodeValidationState,
  getBarcodeValidationState,
  isValidBarcode,
} from '../../../../../utils/barcodeValidation';

const DEBOUNCE_MS = 400;
const MIN_TEXT_SEARCH_LENGTH = 3;
const DIGITS_ONLY = /^\d+$/;
const VALID_EAN_LENGTHS = [8, 13];

type SearchInputFeedback = {
  validationClass: string;
  helperText: string | null;
  isError: boolean;
};

export const getSearchInputFeedback = (
  barcodeValidation: BarcodeValidationState,
  inputLength: number
): SearchInputFeedback => {
  switch (barcodeValidation) {
    case 'typing': {
      if (inputLength < 8) {
        return {
          validationClass: 'search-input--invalid',
          helperText: 'EAN code is too short',
          isError: true,
        };
      }
      return {
        validationClass: 'search-input--invalid',
        helperText: `Invalid EAN length. Valid lengths: ${VALID_EAN_LENGTHS.join(', ')}`,
        isError: true,
      };
    }
    case 'invalid':
      return {
        validationClass: 'search-input--invalid',
        helperText: 'EAN code is invalid',
        isError: true,
      };
    case 'valid':
      return {
        validationClass: 'search-input--valid',
        helperText: null,
        isError: false,
      };
    case 'idle':
    default:
      return {
        validationClass: '',
        helperText: null,
        isError: false,
      };
  }
};

type UseDebouncedSearchParams = {
  onValidBarcodeDetected: (code: string) => void;
  onTextSearch?: (query: string) => void;
  onInvalidBarcode?: (code: string) => void;
};

export const useDebouncedSearch = ({
  onValidBarcodeDetected,
  onTextSearch,
  onInvalidBarcode,
}: UseDebouncedSearchParams) => {
  const [value, setValue] = useState('');

  const barcodeValidation = useMemo(() => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return 'idle';
    return getBarcodeValidationState(trimmed);
  }, [value]);

  const feedback = useMemo(
    () => getSearchInputFeedback(barcodeValidation, value.trim().length),
    [barcodeValidation, value]
  );

  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed.length < MIN_TEXT_SEARCH_LENGTH) return;
    if (DIGITS_ONLY.test(trimmed)) return;

    const timer = window.setTimeout(() => {
      onTextSearch?.(trimmed);
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [value, onTextSearch]);

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

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  const handleBlur = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    submitBarcode(trimmed);
  }, [value, submitBarcode]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      const trimmed = value.trim();
      if (trimmed.length === 0) return;
      submitBarcode(trimmed);
    },
    [value, submitBarcode]
  );

  return {
    value,
    setValue,
    handleChange,
    handleBlur,
    handleKeyDown,
    barcodeValidation,
    feedback,
  };
};
