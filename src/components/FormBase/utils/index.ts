import type { FieldConfig } from '../../../types';

export const createEmptyFormData = <TForm>(fields: FieldConfig[]): TForm => {
  return Object.fromEntries(fields.map((field) => [field.name, ''])) as TForm;
};

export const handleSubmitValidation = <TForm>(
  formData: TForm,
  fields: FieldConfig[],
): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};

  fields.forEach((field) => {
    const validator = field.validator;
    const value = formData[field.name as keyof TForm];
    const error = validator?.(value?.toString() || '');
    if (error) {
      fieldErrors[field.name] = error;
    }
  });

  return fieldErrors;
};