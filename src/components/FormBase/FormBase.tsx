import { useCallback,useMemo, useState } from 'react';

import type { FieldConfig } from '../../types';
import type { Nullable } from '../../types/WeightLog';
import { FormFooter } from '../FormFooter/FormFooter';
import { FormHeader } from '../FormHeader/FormHeader';
import { InputBase } from '../InputBase/InputBase';
import { createEmptyFormData, handleSubmitValidation } from './utils';

import './index.css';

type FormBaseProps<TForm> = {
  formTitle?: string;
  fields: FieldConfig[];

  onSubmit: (formData: TForm) => void;
  handleClose: () => void;
  showFooter?: boolean;
  defaultValues?: Partial<TForm> | Nullable<TForm>;
};

export const FormBase = <TForm,>({
  formTitle,
  fields,
  onSubmit,
  defaultValues,
  showFooter = true,
  handleClose,
}: FormBaseProps<TForm>) => {
  const [formData, setFormData] = useState<TForm>(
    (defaultValues as TForm) ||
      createEmptyFormData(fields)
  );



  const [errors, setErrors] = useState<Record<string, string>>({});

  const canSubmit = useMemo(() => {
    return !Object.values(formData as Record<string, unknown>).some(
      (value) => value !== null && value !== ''
    );
  }, [formData]);


  const handleSubmit = useCallback(async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fieldErrors = handleSubmitValidation(formData, fields);
    setErrors(fieldErrors);

    if (Object.values(fieldErrors).some((error) => error !== '')) {
        return;
    }

    await onSubmit(formData);
    handleClose();

    setFormData(createEmptyFormData(fields));
    setErrors({});
}, [formData, fields, onSubmit, handleClose]);

  return (
    <form className="form-base__container" onSubmit={handleSubmit}>
      <FormHeader
        title={formTitle}
        onClose={() => {
          handleClose();
          setErrors({});
          setFormData(createEmptyFormData(fields));
        }}
        onConfirm={handleSubmit}
      />
      <div className="form-base__body">
        {fields.map((field) => {
          const name = field.name as keyof TForm;
          return (
            <InputBase
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              error={errors[field.name]}
              placeholder={field.placeholder}
              value={formData[name]?.toString() || ''}
              onBlur={() => {
                const validator = field.validator;
                const error = validator?.(formData[name]?.toString() || '');
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  newErrors[field.name] = error || '';
                  return newErrors;
                });
              }}
              onChange={(e) => {
                const newValue = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  [name]: newValue,
                }));
              }}
            />
          );
        })}
      </div>
      {showFooter && (
        <FormFooter canSubmit={canSubmit} onCancel={handleClose} />
      )}
    </form>
  );
};
