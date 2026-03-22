import { useEffect, useState } from 'react';

import { useBarcodeInput } from './useBarcodeInput';

const DEBOUNCE_MS = 400;
const MIN_TEXT_SEARCH_LENGTH = 3;
const DIGITS_ONLY = /^\d+$/;

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

  const { validation, submitBarcode } = useBarcodeInput({
    value,
    onValidBarcodeDetected,
    onInvalidBarcode,
  });

  useEffect(() => {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      onTextSearch?.('');
      return;
    }

    if (trimmed.length < MIN_TEXT_SEARCH_LENGTH) return;
    if (DIGITS_ONLY.test(trimmed)) return;

    const timer = window.setTimeout(() => {
      onTextSearch?.(trimmed);
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [value, onTextSearch]);

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleBlur = () => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    submitBarcode(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    submitBarcode(trimmed);
  };

  return {
    value,
    setValue,
    handleChange,
    handleBlur,
    handleKeyDown,
    validation,
  };
};
