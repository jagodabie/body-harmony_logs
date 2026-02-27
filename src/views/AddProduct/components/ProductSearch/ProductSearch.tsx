import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputBase from '@mui/material/InputBase';

import { useDebouncedSearch } from './hooks/useDebouncedSearch';

import './index.css';

type ProductSearchProps = {
  onValidBarcodeDetected: (code: string) => void;
  onTextSearch?: (query: string) => void;
  onInvalidBarcode?: (code: string) => void;
  onChangeEanCode?: (value: string | null) => void;
  placeholder?: string;
  className?: string;
};

export const ProductSearch = ({
  onValidBarcodeDetected,
  onTextSearch,
  onInvalidBarcode,
  placeholder = 'Search by name / barcode',
  className = '',
  onChangeEanCode,
}: ProductSearchProps) => {
  const { value, handleChange, handleBlur, handleKeyDown, validation } =
    useDebouncedSearch({
      onValidBarcodeDetected,
      onTextSearch,
      onInvalidBarcode,
    });

  console.log('Product re-re');

  const { validationClass, helperText, isError } = validation;

  return (
    <FormControl
      error={isError}
      className={`search-wrapper ${className}`}
      variant="standard"
    >
      <InputBase
        name="search"
        placeholder={placeholder}
        className={`search-input ${validationClass}`}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange(e.target.value);
          onChangeEanCode?.(null);
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        inputProps={{
          'aria-label': 'Search products by name or barcode',
        }}
      />

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
