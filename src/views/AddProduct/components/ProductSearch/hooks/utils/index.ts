import type { BarcodeValidationState } from '../../../../../../utils/barcodeValidation';

const VALID_EAN_LENGTHS = [8, 13];

export type SearchInputValidation = {
  validationClass: string;
  helperText: string | null;
  isError: boolean;
};

type ValidationContext = {
  inputLength: number;
};

type ValidationStrategy = (ctx: ValidationContext) => SearchInputValidation;

const validationStrategies: Record<BarcodeValidationState, ValidationStrategy> =
  {
    typing: ({ inputLength }) => {
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
    },

    invalid: () => ({
      validationClass: 'search-input--invalid',
      helperText: 'EAN code is invalid',
      isError: true,
    }),

    valid: () => ({
      validationClass: 'search-input--valid',
      helperText: null,
      isError: false,
    }),

    idle: () => ({
      validationClass: '',
      helperText: null,
      isError: false,
    }),
  };

export const getSearchInputValidation = (
  barcodeValidation: BarcodeValidationState,
  inputLength: number
): SearchInputValidation => {
  const strategy =
    validationStrategies[barcodeValidation] ?? validationStrategies.idle;
  return strategy({ inputLength });
};
